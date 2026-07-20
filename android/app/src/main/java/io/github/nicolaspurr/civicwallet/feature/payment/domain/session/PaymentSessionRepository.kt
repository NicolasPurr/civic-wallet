package io.github.nicolaspurr.civicwallet.feature.payment.domain.session

/**
 * Manages the lifecycle and security-sensitive state of a payment session.
 *
 * This repository acts as a contract defining the secure retention of cryptographic proofs and
 * tracking session creation timing. Implementations of this interface must ensure that sensitive
 * data is handled in accordance with local security policies (e.g., proper erasure from memory).
 */
interface PaymentSessionRepository {

    /**
     * How much time it took for the proof to be generated.
     */
    val generationTimeMs: Long

    /**
     * Securely stores a cryptographic [proof] associated with a specific timestamp.
     *
     * @param proof The cryptographic proof string to be stored.
     * @param timeMs The epoch timestamp (in milliseconds) indicating when the proof was captured.
     * @throws IllegalArgumentException if the [proof] is blank or [timeMs] is invalid.
     */
    fun storeProof(proof: String, timeMs: Long)

    /**
     * Consumes the cached proof for network settlement.
     *
     * To prevent the app from accidentally double-submitting the same transaction,
     * this is a single-use read operation that empties the buffer.
     *
     * @return The proof string extracted from the secure memory container.
     */
    fun consumeProof(): String

    /**
     * Resets the active session, freeing up cached benchmark metadata and string buffers.
     */
    fun terminateSession()
}