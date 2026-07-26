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
 * @property witnessGenTimeMs Execution time spent evaluating circuit constraints (witness calculation).
 * @property proofGenTimeMs Execution duration in milliseconds dedicated solely to generating the Groth16 proof.
 * @property totalEngineTimeMs Aggregate execution duration covering witness computation, proof generation, and local verification.
 * @property nativeHeapBeforeMb Native heap allocation in MB prior to MoPro Rust FFI execution.
 * @property nativeHeapAfterMb Native heap allocation in MB immediately after execution.
 * @property nativeHeapDeltaMb Net native heap allocation change (MB) during proof execution.
 * @property vmHwmMb OS-level peak Resident Set Size / High Water Mark memory footprint (MB).
 * @property thermalStatus Operating thermal state reported by Android PowerManager (e.g., NONE, LIGHT, SEVERE).
 */
data class ZkProofResult(
    val proofJson: String,
    val proofSizeInBytes: Int,
    val witnessGenTimeMs: Long,
    val proofGenTimeMs: Long,
    val totalEngineTimeMs: Long,
    val nativeHeapBeforeMb: Long = 0L,
    val nativeHeapAfterMb: Long = 0L,
    val nativeHeapDeltaMb: Long = 0L,
    val vmHwmMb: Long = 0L,
    val thermalStatus: String = "UNKNOWN"
)