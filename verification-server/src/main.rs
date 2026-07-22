//! # Groth16 Proof Verification Server
//!
//! An Axum HTTP server that receives SnarkJS proofs and public inputs, 
//! verifies them using the BN254 curve via Arkworks, and returns validation results.

use axum::{http::StatusCode, routing::post, Json, Router};
use serde::{Deserialize, Serialize};
use std::{fs::File, io::BufReader, str::FromStr, time::Instant};
use ark_bn254::{Bn254, Fq, Fq2, Fr, G1Affine, G2Affine};
use ark_groth16::{Groth16, PreparedVerifyingKey, Proof, VerifyingKey};
use ark_snark::SNARK;
use tower_http::cors::CorsLayer;


/// SnarkJs JSON representation of a Groth16 proof
///
/// SnarkJS outputs $G_1$ points as 3-element arrays `[X, Y, Z]` (homogenous coordinates)
/// and $G_2$ points as `[[X_c0, X_c1], [Y_c0, Y_c1], [Z_c0, Z_c1]]` representing $\mathbb{F}_{q^2}$.
#[derive(Deserialize)]
struct SnarkJsProof {
    /// $G_1$ point $\pi_A$ in `[x, y, z]` format.
    pi_a: [String; 3],
    /// $G_2$ point $\pi_B$ as pairs of coefficients for $\mathbb{F}_{q^2}$.
    pi_b: [[String; 2]; 3],
    /// $G_1$ point $\pi_C$ in `[x, y, z]` format.
    pi_c: [String; 3],
}

/// SnarkJS Verification Key structure loaded from JSON.
#[derive(Deserialize, Clone)]
struct SnarkJsVk {
    vk_alpha_1: [String; 3],
    vk_beta_2: [[String; 2]; 3],
    vk_gamma_2: [[String; 2]; 3],
    vk_delta_2: [[String; 2]; 3],
    /// Public inputs linear combination commitments ($IC$) in $G_1$.
    #[serde(rename = "IC")]
    ic: Vec<[String; 3]>,
}

/// Incoming JSON payload for proof verification.
#[derive(Deserialize)]
struct VerifyRequest {
    proof: SnarkJsProof,
    /// Public inputs encoded as base-10 string field elements.
    public_inputs: Vec<String>,
}

/// Response payload containing verification results.
#[derive(Serialize, Deserialize)]
struct VerifyResponse {
    /// `true` if the proof is cryptographically valid against `public_inputs`.
    valid: bool,
    /// Verification execution time in milliseconds.
    processing_time_ms: f64,
}

/// Parses a base-10 string representation into a base field element (`Fq`).
///
/// # Panics
///
/// Panics if `s` is not a valid decimal string for an `Fq` field element.
fn parse_fq(s: &str) -> Fq {
    Fq::from_str(s).unwrap_or_else(|_| panic!("Failed to parse Fq: {}", s))
}

/// Converts a SnarkJS $G_1$ coordinate array `[x, y, z]` to an Arkworks [`G1Affine`].
///
/// SnarkJS uses homogeneous coordinates where `arr[2]` is $Z$ (typically `"1"`).
/// This extracts $X$ (`arr[0]`) and $Y$ (`arr[1]`) into affine form.
fn parse_g1(arr: &[String; 3]) -> G1Affine {
    let x = parse_fq(&arr[0]);
    let y = parse_fq(&arr[1]);
    G1Affine::new_unchecked(x, y)
}

/// Converts a SnarkJS $G_2$ coordinate matrix to an Arkworks [`G2Affine`].
///
/// $G_2$ elements lie in $\mathbb{F}_{q^2}$, so each coordinate requires two base field
/// coefficients `[c0, c1]`.
fn parse_g2(arr: &[[String; 2]; 3]) -> G2Affine {
    let x = Fq2::new(parse_fq(&arr[0][0]), parse_fq(&arr[0][1]));
    let y = Fq2::new(parse_fq(&arr[1][0]), parse_fq(&arr[1][1]));
    G2Affine::new_unchecked(x, y)
}

/// Loads and processes the verification key directly from disk
///
/// # Errors
///
/// Returns an `Err` if the embedded JSON is malformed or if the points fail
/// cryptographic processing under the BN254 curve.
fn load_pvk() -> Result<PreparedVerifyingKey<Bn254>, String> {
    let file = File::open("./verification_key.json")
        .map_err(|e| format!("Could not open verification_key.json: {e}"))?;
    let reader = BufReader::new(file);
    let raw_vk: SnarkJsVk = serde_json::from_reader(reader)
        .map_err(|e| format!("Failed to parse VK JSON: {e}"))?;

    let vk = VerifyingKey::<Bn254> {
        alpha_g1: parse_g1(&raw_vk.vk_alpha_1),
        beta_g2: parse_g2(&raw_vk.vk_beta_2),
        gamma_g2: parse_g2(&raw_vk.vk_gamma_2),
        delta_g2: parse_g2(&raw_vk.vk_delta_2),
        gamma_abc_g1: raw_vk.ic.iter().map(parse_g1).collect(),
    };

    Groth16::<Bn254>::process_vk(&vk).map_err(|e| format!("Failed to process VK: {e:?}"))
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    // Build application routes & attach middleware
    let app = Router::new()
        .route("/verify", post(verify_handler))
        // Allows cross-origin requests from browser clients during development
        .layer(CorsLayer::permissive());

    // Bind TCP listener to all network interfaces
    let bind_addr = "0.0.0.0:8080";
    let listener = tokio::net::TcpListener::bind(bind_addr).await.unwrap();
    println!("listening on http://{bind_addr}");

    // Start the Axum web server
    axum::serve(listener, app).await.unwrap();

    Ok(())
}

/// Axum HTTP endpoint that validates incoming Groth16 ZK proofs against public inputs.
///
/// # Request Processing Flow
/// 1. Loads and prepares the BN254 verification key.
/// 2. Converts base-10 input strings into scalar field elements ([`Fr`]).
/// 3. Converts SnarkJS coordinate arrays into Arkworks elliptic curve points ([`G1Affine`], [`G2Affine`]).
/// 4. Executes pairing checks via [`Groth16`] verification over BN254.
/// 5. Measures processing time and returns a JSON summary.
///
/// # HTTP Responses
///
/// * `200 OK` - Proof was evaluated successfully. Check `body.valid` for the outcome.
/// * `500 Internal Server Error` - Failed to read or parse the verification key.
async fn verify_handler(
    Json(payload): Json<VerifyRequest>,
) -> Result<Json<VerifyResponse>, StatusCode> {
    let start = Instant::now();

    // Load the verification key from disk
    // NOTE: very comfy for frequent key updates
    let pvk = load_pvk().map_err(|err| {
        eprintln!("Error loading VK: {}", err);
        StatusCode::INTERNAL_SERVER_ERROR
    })?;

    // Parse string inputs into scalar field elements (`Fr`)
    // WARNING: `unwrap()` will panic on malformed client strings, returning an unhandled 500
    let public_inputs: Vec<Fr> = payload
        .public_inputs
        .iter()
        .map(|s| Fr::from_str(s).unwrap())
        .collect();

        // Map SnarkJS JSON format to Arkworks Proof structure
    let proof = Proof::<Bn254> {
        a: parse_g1(&payload.proof.pi_a),
        b: parse_g2(&payload.proof.pi_b),
        c: parse_g1(&payload.proof.pi_c),
    };

    // Perform pairing-based cryptographic verification
    let is_valid = Groth16::<Bn254>::verify_with_processed_vk(&pvk, &public_inputs, &proof)
        .unwrap_or(false);

    let duration = start.elapsed().as_secs_f64() * 1000.0;

    println!("Received verification request: {}",
        if is_valid { "OK" } else { "REJECT" }
    );

    // Return execution timing and validity state to client
    Ok(Json(VerifyResponse {
        valid: is_valid,
        processing_time_ms: duration,
    }))
}
