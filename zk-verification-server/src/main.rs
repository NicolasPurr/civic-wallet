use axum::{http::StatusCode, routing::post, Json, Router};
use serde::{Deserialize, Serialize};
use std::{fs::File, io::BufReader, str::FromStr, time::Instant};
use ark_bn254::{Bn254, Fq, Fq2, Fr, G1Affine, G2Affine};
use ark_groth16::{Groth16, PreparedVerifyingKey, Proof, VerifyingKey};
use ark_snark::SNARK;
use tower_http::cors::CorsLayer;

#[derive(Deserialize)]
struct SnarkJsProof {
    pi_a: [String; 3],
    pi_b: [[String; 2]; 3],
    pi_c: [String; 3],
}

#[derive(Deserialize, Clone)]
struct SnarkJsVk {
    vk_alpha_1: [String; 3],
    vk_beta_2: [[String; 2]; 3],
    vk_gamma_2: [[String; 2]; 3],
    vk_delta_2: [[String; 2]; 3],
    #[serde(rename = "IC")]
    ic: Vec<[String; 3]>,
}

#[derive(Deserialize)]
struct VerifyRequest {
    proof: SnarkJsProof,
    public_inputs: Vec<String>,
}

#[derive(Serialize, Deserialize)]
struct VerifyResponse {
    valid: bool,
    processing_time_ms: f64,
}

fn parse_fq(s: &str) -> Fq {
    Fq::from_str(s).unwrap_or_else(|_| panic!("Failed to parse Fq: {}", s))
}

fn parse_g1(arr: &[String; 3]) -> G1Affine {
    let x = parse_fq(&arr[0]);
    let y = parse_fq(&arr[1]);
    G1Affine::new_unchecked(x, y)
}

fn parse_g2(arr: &[[String; 2]; 3]) -> G2Affine {
    let x = Fq2::new(parse_fq(&arr[0][0]), parse_fq(&arr[0][1]));
    let y = Fq2::new(parse_fq(&arr[1][0]), parse_fq(&arr[1][1]));
    G2Affine::new_unchecked(x, y)
}

// Helper to load and process the verification key directly from disk
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
async fn main() {
    let app = Router::new()
        .route("/verify", post(verify_handler))
        .layer(CorsLayer::permissive());

    let listener = tokio::net::TcpListener::bind("0.0.0.0:8080").await.unwrap();
    println!("Listening on port 8080");
    axum::serve(listener, app).await.unwrap();
}

async fn verify_handler(
    Json(payload): Json<VerifyRequest>,
) -> Result<Json<VerifyResponse>, StatusCode> {
    let start = Instant::now();

    // Read latest key on disk automatically
    let pvk = load_pvk().map_err(|err| {
        eprintln!("Error loading VK: {}", err);
        StatusCode::INTERNAL_SERVER_ERROR
    })?;

    let public_inputs: Vec<Fr> = payload
        .public_inputs
        .iter()
        .map(|s| Fr::from_str(s).unwrap())
        .collect();

    let proof = Proof::<Bn254> {
        a: parse_g1(&payload.proof.pi_a),
        b: parse_g2(&payload.proof.pi_b),
        c: parse_g1(&payload.proof.pi_c),
    };

    let is_valid = Groth16::<Bn254>::verify_with_processed_vk(&pvk, &public_inputs, &proof)
        .unwrap_or(false);

    let duration = start.elapsed().as_secs_f64() * 1000.0;

    print!("Received verification request: ");
    if is_valid { println!("OK"); } else { println!("REJECT"); }

    Ok(Json(VerifyResponse {
        valid: is_valid,
        processing_time_ms: duration,
    }))
}
