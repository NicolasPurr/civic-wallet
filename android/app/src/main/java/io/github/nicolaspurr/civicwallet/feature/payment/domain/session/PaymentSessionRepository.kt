package io.github.nicolaspurr.civicwallet.feature.payment.domain.session

interface PaymentSessionRepository {
    val generationTimeMs: Long
    fun storeProof(proof: String, timeMs: Long)
    /**
     * Relinquishes ownership of the secure off-heap memory container.
     * The consumer assumes complete lifecycle responsibility for closing it.
     */
    fun extractAndClearProof(): String
    fun clearSession()
}