package io.github.nicolaspurr.civicwallet.feature.payment.domain.session
import io.github.nicolaspurr.civicwallet.core.zk.ZkProofResult

/**
 * Manages the lifecycle and security-sensitive state of a payment session.
 *
 * This repository acts as a contract defining the secure retention of cryptographic proofs and
 * tracking session creation timing. Implementations of this interface must ensure that sensitive
 * data is handled in accordance with local security policies (e.g., proper erasure from memory).
 */
interface PaymentSessionRepository {

    /**
     * Stores the complete ZK proof payload and benchmarking metadata in volatile session memory.
     *
     * @param result The complete ZK proof result.
     */
    fun storeResult(result: ZkProofResult)

    /**
     * Consumes the cached proof result for network settlement.
     *
     * To prevent the app from accidentally double-submitting the same transaction,
     * this is a single-use read operation that empties the buffer.
     *
     * @return The proof string extracted from the secure memory container.
     */
    fun consumeResult(): ZkProofResult

    /**
     * Resets the active session, freeing up cached benchmark metadata and string buffers.
     */
    fun terminateSession()
}