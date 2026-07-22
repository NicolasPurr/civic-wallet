package io.github.nicolaspurr.civicwallet.core.zk

/**
 * Encapsulates the output payload and performance metadata from a ZK proof execution.
 *
 * Designed as an immutable data transfer object (DTO) to log on-device benchmarking metrics
 * for empirical performance analysis of zero-knowledge payment schemes.
 *
 * @property proofJson Serialized SnarkJS-compatible JSON payload containing proof curves (`pi_a`,
 * `pi_b`, `pi_c`) and public input parameters.
 * @property proofSizeInBytes Byte length of the UTF-8 formatted [proofJson] string, used to
 * evaluate network payload overhead.
 * @property witnessGenTimeMs Execution time spent evaluating circuit constraints (witness
 * calculation).
 * Note: Set to 0 if the native engine bundles witness and proof steps into a single FFI call.
 * @property proofGenTimeMs Execution duration in milliseconds dedicated solely to generating the
 * Groth16 proof.
 * @property totalEngineTimeMs Aggregate execution duration covering witness computation, proof
 * generation, and local verification.
 */
data class ZkProofResult(
    val proofJson: String,
    val proofSizeInBytes: Int,
    val witnessGenTimeMs: Long,
    val proofGenTimeMs: Long,
    val totalEngineTimeMs: Long,
)