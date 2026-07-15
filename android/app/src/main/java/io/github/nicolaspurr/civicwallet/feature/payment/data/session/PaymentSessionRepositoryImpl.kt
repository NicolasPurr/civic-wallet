package io.github.nicolaspurr.civicwallet.feature.payment.data.session

import io.github.nicolaspurr.civicwallet.feature.payment.domain.session.PaymentSessionRepository
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class PaymentSessionRepositoryImpl @Inject constructor() : PaymentSessionRepository {

    private var cachedProof: String? = null

    override var generationTimeMs: Long = 0L
        private set

    override fun storeProof(proof: String, timeMs: Long) {
        synchronized(this) {
            cachedProof = proof
            generationTimeMs = timeMs
        }
    }

    override fun extractAndClearProof(): String {
        return synchronized(this) {
            val proof = cachedProof ?: throw IllegalStateException("No valid ZK proof in session memory.")
            cachedProof = null
            generationTimeMs = 0L
            proof
        }
    }

    override fun clearSession() {
        synchronized(this) {
            cachedProof = null
            generationTimeMs = 0L
        }
    }
}