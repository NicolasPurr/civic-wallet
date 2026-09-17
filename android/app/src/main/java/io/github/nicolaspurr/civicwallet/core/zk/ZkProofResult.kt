package io.github.nicolaspurr.civicwallet.core.zk

/**
 * Single benchmark run execution result.
 *
 * [witnessGenTimeMs] is `null` (not `0L`) when witness computation is bundled
 * with proof generation inside MoPro and cannot be measured separately.
 *
 * @property circuitKey Unique circuit identifier string.
 * @property stateDepth Merkle tree depth for state representation.
 * @property blacklistDepth Merkle tree depth for blacklist representation.
 * @property proofJson Serialized SnarkJS-compatible JSON payload containing proof curves (`pi_a`,
 * `pi_b`, `pi_c`) and public input parameters.
 * @property payloadBytesCompact Byte length of the compact affine transmission JSON payload.
 * @property payloadBytesVerbose Byte length of the legacy verbose projective JSON payload.
 * @property publicSignalCount Number of public inputs/signals evaluated by the circuit.
 * @property witnessGenTimeMs Execution time spent evaluating circuit constraints (witness calculation).
 * @property proofGenTimeMs Execution duration in milliseconds dedicated solely to generating the Groth16 proof.
 * @property verificationTimeMs Execution duration in milliseconds dedicated to local Groth16 verification.
 * @property totalEngineTimeMs Aggregate execution duration covering proof generation and local verification.
 * @property nativeHeapBeforeMb Native heap allocation in MB prior to MoPro Rust FFI execution.
 * @property nativeHeapAfterMb Native heap allocation in MB immediately after execution.
 * @property nativeHeapDeltaMb Net native heap allocation change (MB) during proof execution.
 * @property vmHwmMb OS-level peak Resident Set Size / High Water Mark memory footprint (MB).
 * @property thermalStatusBefore Operating thermal state reported prior to execution.
 * @property thermalStatusAfter Operating thermal state reported immediately after execution.
 */
data class ZkProofResult(
    val circuitKey: String,
    val stateDepth: Int,
    val blacklistDepth: Int,
    val proofJson: String,
    val payloadBytesCompact: Int,
    val payloadBytesVerbose: Int,
    val publicSignalCount: Int,
    val witnessGenTimeMs: Long?,
    val proofGenTimeMs: Long,
    val verificationTimeMs: Long,
    val totalEngineTimeMs: Long,
    val nativeHeapBeforeMb: Long,
    val nativeHeapAfterMb: Long,
    val nativeHeapDeltaMb: Long,
    val vmHwmMb: Long,
    val thermalStatusBefore: String,
    val thermalStatusAfter: String
)