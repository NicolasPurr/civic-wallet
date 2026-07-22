package io.github.nicolaspurr.civicwallet.feature.payment.domain.session

/**
 * Gateway for submitting cryptographic proofs to the external payment settlement layer.
 *
 * This repository handles the final step of the payment lifecycle, dispatching finalised
 * Zero-Knowledge (ZK) proofs to a remote ledger or cloud verifier.
 */
interface PaymentSettlementRepository {

    /**
     * Submits a public ZK [proof] to the settlement network for verification.
     *
     * As a suspending function, it performs non-blocking network I/O. Callers should this is
     * invoked from an appropriate coroutine scope (e.g., `Dispatchers.IO`).
     *
     * @param proof Public ZK proof string proving the validity of the transaction.
     * @return A [Result] representing the outcome:
     * - [Result.success] if the proof was verified and settled.
     * - [Result.failure] if the network was unreachable or the proof failed verification.
     */
    suspend fun submitZkProof(proof: String): Result<Double>
}