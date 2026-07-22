package io.github.nicolaspurr.civicwallet.feature.payment.data.session

import io.github.nicolaspurr.civicwallet.core.zk.ZkProofResult
import io.github.nicolaspurr.civicwallet.feature.payment.domain.session.PaymentSessionRepository
import javax.inject.Inject
import javax.inject.Singleton

/**
 * Thread-safe, in-memory implementation of [PaymentSessionRepository].
 *
 * This class uses synchronisation (`synchronized(this)`) to ensure thread safety.
 * State is volatile and will not persist across application restarts or process death.
 */
@Singleton
class PaymentSessionRepositoryImpl @Inject constructor() : PaymentSessionRepository {

    private var cachedResult: ZkProofResult? = null

    override fun storeResult(result: ZkProofResult) {
        synchronized(this) {
            cachedResult = result
        }
    }

    override fun consumeResult(): ZkProofResult {
        return synchronized(this) {
            val result = cachedResult ?: throw IllegalStateException("No valid ZK proof in session memory.")
            cachedResult = null
            result
        }
    }

    override fun terminateSession() {
        synchronized(this) {
            cachedResult = null
        }
    }
}
