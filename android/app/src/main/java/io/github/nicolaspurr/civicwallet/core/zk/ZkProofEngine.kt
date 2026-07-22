package io.github.nicolaspurr.civicwallet.core.zk

/**
 * Architectural abstraction for zero-knowledge proof generation runtimes.
 *
 * Decouples logic and feature orchestrators from specific cryptographic toolchains
 * (e.g., MoPro, Circom, Noir, or Halo2).
 *
 * Implementations handle native FFI bindings and thread switching.
 */
interface ZkProofEngine {
    /**
     * Executes the zero-knowledge prover using the supplied biometric confidence inputs.
     *
     * This is a pure suspend function meant to be executed off the main thread (typically on a
     * CPU-optimised dispatcher like `Dispatchers.Default`).
     *
     * @param confidence Normalized biometric authentication score (0.0 to 1.0) passed as a circuit
     * parameter.
     * @return A [Result] holding [ZkProofResult] metrics on successful generation, or an error if
     * witness/proof steps fail.
     */
    suspend fun generateProof(confidence: Float): Result<ZkProofResult>
}