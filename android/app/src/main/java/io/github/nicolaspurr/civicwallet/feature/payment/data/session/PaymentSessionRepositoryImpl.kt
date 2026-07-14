package io.github.nicolaspurr.civicwallet.feature.payment.data.session

import io.github.nicolaspurr.civicwallet.feature.payment.domain.session.PaymentSessionRepository
import java.util.Arrays
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class PaymentSessionRepositoryImpl @Inject constructor() : PaymentSessionRepository {

    // Protected behind synchronization locks to prevent concurrent race exploits
    private var secureProof: CharArray? = null

    override var generationTimeMs: Long = 0L
        private set

    override fun storeProof(proof: CharArray, timeMs: Long) {
        synchronized(this) {
            secureProof = proof
            generationTimeMs = timeMs
        }
    }

    override fun extractAndClearProof(): CharArray {
        return synchronized(this) {
            val proof = secureProof ?: throw IllegalStateException("No proof in memory")

            // Relinquish ownership entirely and clear metadata pointers immediately
            secureProof = null
            generationTimeMs = 0L
            proof
        }
    }

    override fun clearSession() {
        synchronized(this) {
            // Overwrites raw heap bytes in place before losing the reference
            secureProof?.let { Arrays.fill(it, '\u0000') }
            secureProof = null
            generationTimeMs = 0L
        }
    }
}

