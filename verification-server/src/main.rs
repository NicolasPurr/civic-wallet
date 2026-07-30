//! # Groth16 Proof Verification Server
//!
//! An Axum HTTP server that receives SnarkJS proofs and public inputs,
//! verifies them using the BN254 curve via Arkworks, and returns validation results.

use axum::{extract::State, http::StatusCode, routing::post, Json, Router};
use serde::{Deserialize, Serialize};
use std::{
    fs::File,
    io::BufReader,
    str::FromStr,
    sync::{
        atomic::{AtomicU64, Ordering},
        Arc,
    },
    time::Instant,
};
use ark_bn254::{Bn254, Fq, Fq2, Fr, G1Affine, G2Affine};
use ark_ec::AffineRepr;
use ark_groth16::{Groth16, PreparedVerifyingKey, Proof, VerifyingKey};
use ark_snark::SNARK;
use tower_http::cors::CorsLayer;
use sqlx::{sqlite::SqlitePoolOptions, SqlitePool};

/// Global request counter to guarantee unique database insertion keys during benchmarks
static REQUEST_COUNTER: AtomicU64 = AtomicU64::new(0);

/// Server connection status to temporary relational SQLite DB
#[derive(Clone)]
struct AppState {
    db: SqlitePool,
    pvk: Arc<PreparedVerifyingKey<Bn254>>,
}

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
/// Performs explicit on-curve validation ($y^2 = x^3 + ax + b$) and prime-order subgroup checks.
fn parse_g1(arr: &[String; 3]) -> Result<G1Affine, String> {
    let x = parse_fq(&arr[0]);
    let y = parse_fq(&arr[1]);
    let point = G1Affine::new_unchecked(x, y);

    if !point.is_on_curve() || !point.is_in_correct_subgroup_assuming_on_curve() {
        return Err("G1 point failed on-curve or subgroup validation".to_string());
    }

    Ok(point)
}

/// Converts a SnarkJS $G_2$ coordinate matrix to an Arkworks [`G2Affine`].
///
/// Performs explicit on-curve validation and prime-order subgroup checks over $\mathbb{F}_{q^2}$.
///
/// # Errors
///
/// Returns an `Err` if the point is not in the correct subgroup.
fn parse_g2(arr: &[[String; 2]; 3]) -> Result<G2Affine, String> {
    let x = Fq2::new(parse_fq(&arr[0][0]), parse_fq(&arr[0][1]));
    let y = Fq2::new(parse_fq(&arr[1][0]), parse_fq(&arr[1][1]));
    let point = G2Affine::new_unchecked(x, y);

    if !point.is_on_curve() || !point.is_in_correct_subgroup_assuming_on_curve() {
        return Err("G2 point failed on-curve or subgroup validation".to_string());
    }

    Ok(point)
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

    let gamma_abc_g1: Result<Vec<G1Affine>, String> = raw_vk.ic.iter().map(parse_g1).collect();

    let vk = VerifyingKey::<Bn254> {
        alpha_g1: parse_g1(&raw_vk.vk_alpha_1)?,
        beta_g2: parse_g2(&raw_vk.vk_beta_2)?,
        gamma_g2: parse_g2(&raw_vk.vk_gamma_2)?,
        delta_g2: parse_g2(&raw_vk.vk_delta_2)?,
        gamma_abc_g1: gamma_abc_g1?,
    };

    Groth16::<Bn254>::process_vk(&vk).map_err(|e| format!("Failed to process VK: {e:?}"))
}

/// Initialises a database instance and generates 10M records.
async fn init_db() -> SqlitePool {
    let pool = SqlitePoolOptions::new()
        .max_connections(50)
        .connect("sqlite::memory:?cache=shared")
        .await
        .unwrap();

    // Use WAL mode and standard synchronization for realistic concurrent read/write behaviour
    sqlx::query("PRAGMA journal_mode = WAL;").execute(&pool).await.unwrap();
    sqlx::query("PRAGMA synchronous = NORMAL;").execute(&pool).await.unwrap();

    // Create tables without primary keys
    sqlx::query("CREATE TABLE nullifiers (nullifier TEXT);").execute(&pool).await.unwrap();
    sqlx::query("CREATE TABLE blacklist (item TEXT);").execute(&pool).await.unwrap();

    println!("Generating 10M records in DB...");
    let start_seed = Instant::now();

    // Insert 1K values in one query
    let chunk_size = 1000;
    let total = 10_000_000;

    let mut tx = pool.begin().await.unwrap();
    for chunk in 0..(total / chunk_size) {
        let mut query_builder = String::from("INSERT INTO nullifiers (nullifier) VALUES ");
        for i in 0..chunk_size {
            let idx = chunk * chunk_size + i;
            if i > 0 {
                query_builder.push_str(",");
            }
            query_builder.push_str(&format!("('test_nullifier_{}')", idx));
        }
        sqlx::query(&query_builder).execute(&mut *tx).await.unwrap();
    }
    tx.commit().await.unwrap();

    // Create indices after inserting all data
    println!("Creating index for 10M records...");
    sqlx::query("CREATE UNIQUE INDEX idx_nullifiers ON nullifiers (nullifier);")
        .execute(&pool)
        .await
        .unwrap();

    sqlx::query("CREATE UNIQUE INDEX idx_blacklist ON blacklist (item);")
        .execute(&pool)
        .await
        .unwrap();

    // Example record for the black list
    sqlx::query("INSERT INTO blacklist (item) VALUES ('123456789_EXAMPLE_BLACK_LISTED')")
        .execute(&pool)
        .await
        .unwrap();

    println!("Database ready. Execution: {:.2?}", start_seed.elapsed());

    pool
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    // Bind TCP listener first so port conflicts fail immediately before loading DB
    let bind_addr = "0.0.0.0:8080";
    let listener = tokio::net::TcpListener::bind(bind_addr).await.unwrap();

    // Generating SQL DB on server startup
    let pool = init_db().await;

    // Load VK once on startup to isolate proof verification latency from disk I/O
    let pvk = Arc::new(load_pvk().expect("Failed to load verification key at startup"));
    let state = AppState { db: pool, pvk };

    // Build application routes & attach middleware
    let app = Router::new()
        .route("/verify", post(verify_handler))
        // Allows cross-origin requests from browser clients during development
        .layer(CorsLayer::permissive())
        .with_state(state);

    println!("Proof verifier listening on http://{bind_addr}");

    // Start the Axum web server
    axum::serve(listener, app).await.unwrap();

    Ok(())
}

/// Axum HTTP endpoint that validates incoming Groth16 ZK proofs against public inputs.
///
/// # Request Processing Flow
/// 1. Pre-loaded BN254 verification key is fetched from application state.
/// 2. Converts base-10 input strings into scalar field elements ([`Fr`]).
/// 3. Converts SnarkJS coordinate arrays into Arkworks elliptic curve points ([`G1Affine`], [`G2Affine`]).
/// 4. Executes pairing checks via [`Groth16`] verification over BN254.
/// 5. Measures processing time and returns a JSON summary.
///
/// # HTTP Responses
///
/// * `200 OK` - Proof was evaluated successfully. Check `body.valid` for the outcome.
/// * `500 Internal Server Error` - Internal processing error.
async fn verify_handler(
    State(state): State<AppState>,
    Json(payload): Json<VerifyRequest>,
) -> Result<Json<VerifyResponse>, StatusCode> {
    let start = Instant::now();

    println!("Received verification request:");

    // Get the nullifier
    let nullifier = payload
        .public_inputs
        .first()
        .ok_or(StatusCode::BAD_REQUEST)?;

    // Blacklist check
    let is_blacklisted: Option<(String,)> = sqlx::query_as("SELECT item FROM blacklist WHERE item = ? LIMIT 1")
        .bind(nullifier)
        .fetch_optional(&state.db)
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    if is_blacklisted.is_some() {
        println!("REJECT (Blacklisted nullifier in SQL DB)\n");
        let duration = start.elapsed().as_secs_f64() * 1000.0;
        return Ok(Json(VerifyResponse {
            valid: false,
            processing_time_ms: duration,
        }));
    }

    // BENCHMARKING ONLY: Generate a unique entry per request to force a full SQLite B-Tree write
    // and page allocation on every iteration, accurately measuring database write latency.
    let req_id = REQUEST_COUNTER.fetch_add(1, Ordering::Relaxed);
    let mock_nullifier_entry = format!("{nullifier}_{req_id}");

    let result = sqlx::query("INSERT INTO nullifiers (nullifier) VALUES (?)")
        .bind(&mock_nullifier_entry)
        .execute(&state.db)
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    if result.rows_affected() == 0 {
        println!("REJECT (Nullifier double-spend conflict)\n");
        let duration = start.elapsed().as_secs_f64() * 1000.0;
        return Ok(Json(VerifyResponse {
            valid: false,
            processing_time_ms: duration,
        }));
    }

    // Offload CPU-bound cryptographic verification to blocking task pool
    let pvk = Arc::clone(&state.pvk);
    let is_valid = tokio::task::spawn_blocking(move || {
        // Parse string inputs into scalar field elements (`Fr`)
        // WARNING: `unwrap()` will panic on malformed client strings, returning an unhandled 500
        let public_inputs: Vec<Fr> = payload
            .public_inputs
            .iter()
            .map(|s| Fr::from_str(s).unwrap())
            .collect();

        // Map SnarkJS JSON format to Arkworks Proof structure with subgroup validation
        let proof = Proof::<Bn254> {
            a: parse_g1(&payload.proof.pi_a).unwrap(),
            b: parse_g2(&payload.proof.pi_b).unwrap(),
            c: parse_g1(&payload.proof.pi_c).unwrap(),
        };

        // Perform pairing-based cryptographic verification using pre-loaded VK from state
        Groth16::<Bn254>::verify_with_processed_vk(&pvk, &public_inputs, &proof)
            .unwrap_or(false)
    })
    .await
    .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    let duration = start.elapsed().as_secs_f64() * 1000.0;

    println!("{}\n",
        if is_valid { "OK" } else { "REJECT" }
    );

    // Return execution timing and validity state to client
    Ok(Json(VerifyResponse {
        valid: is_valid,
        processing_time_ms: duration,
    }))
}
