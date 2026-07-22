# BN254 Groth16 Verifier Service

A lightweight Rust HTTP microserver built with **Axum** and **Arkworks** to verify SnarkJS-generated Groth16 proofs over the BN254 elliptic curve.

## Quickstart

```bash
# 1. Ensure verification_key.json is in the root folder
# 2. Run the server
cargo run 
```

The server will start listening on `http://localhost:8080`.

## Configuration

Place your SnarkJS verification key at `./verification_key.json` relative to the root of `verification_server`.

## API Reference

### Verify Proof

`POST /verify`

**Request Body:**
```JSON
{
  "proof": {
    "pi_a": ["123...", "456...", "1"],
    "pi_b": [["123...", "456..."], ["789...", "012..."], ["1", "0"]],
    "pi_c": ["789...", "012...", "1"]
  },
  "public_inputs": ["1", "42"]
}
```

**Response (200 OK):**

```JSON
{
  "valid": true,
  "processing_time_ms": 1.84
}
```

## Tech Stack

* Framework: [Axum](https://github.com/tokio-rs/axum)
* Crypto: [arkworks-rs](https://github.com/arkworks-rs) (`ark-groth16`, `ark-bn254`)
* JSON Compatibility: SnarkJS export format
