package io.github.nicolaspurr.civicwallet.feature.payment.domain.session

interface PaymentSessionRepository {
    val generationTimeMs: Long
    fun storeProof(proof: CharArray, timeMs: Long)
    /**
     * Relinquishes ownership of the proof array, nullifying internal pointers.
     * The caller assumes responsibility for zeroizing the array when finished.
     */
    fun extractAndClearProof(): CharArray
    fun clearSession()
}