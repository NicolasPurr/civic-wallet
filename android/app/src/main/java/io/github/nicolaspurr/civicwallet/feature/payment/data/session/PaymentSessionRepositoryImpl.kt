package io.github.nicolaspurr.civicwallet.feature.payment.data.session

import io.github.nicolaspurr.civicwallet.feature.payment.domain.session.PaymentSessionRepository
import javax.inject.Inject
import javax.inject.Singleton

/**
 * Thread-safe, in-memory implementation of [PaymentSessionRepository].
 *
 * This class uses synchronization (`synchronized(this)`) to ensure thread safety.
 * State is volatile and will not persist across application restarts or process death.
 */
@Singleton
class PaymentSessionRepositoryImpl @Inject constructor() : PaymentSessionRepository {

    /**
     * Holds the active cryptographic proof.
     */
    private var cachedProof: String? = null

    @Volatile
    override var generationTimeMs: Long = 0L
        private set

    override fun storeProof(proof: String, timeMs: Long) {
        synchronized(this) {
            cachedProof = proof
            generationTimeMs = timeMs
        }
    }

    override fun consumeProof(): String {
        return synchronized(this) {
            val proof = cachedProof ?: throw IllegalStateException("No valid ZK proof in session memory.")
            cachedProof = null
            generationTimeMs = 0L
            proof
        }
    }

    override fun terminateSession() {
        synchronized(this) {
            cachedProof = null
            generationTimeMs = 0L
        }
    }
}
