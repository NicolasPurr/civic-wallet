/*package io.github.nicolaspurr.civicwallet.feature.payment.data.session

import io.github.nicolaspurr.civicwallet.feature.payment.domain.session.PaymentSettlementRepository
import kotlinx.coroutines.delay
import javax.inject.Inject
import javax.inject.Singleton
import kotlin.time.Duration.Companion.milliseconds

/**
 * Simulated implementation of [PaymentSettlementRepository] used for local testing and development.
 *
 * **Note:** This class does not perform real network requests. It mocks remote latency
 * using coroutine delays and returns a hardcoded successful result. Replace this with a concrete
 * HTTP/gRPC-based client before moving to production.
 */
@Singleton
class FakePaymentSettlementRepository @Inject constructor() : PaymentSettlementRepository {

    /**
     * Simulates a remote network call to verify the ZK proof.
     *
     * Introduces a synthetic delay of 1500ms to mimic real-world network round-trip time (RTT).
     */
    override suspend fun submitZkProof(proof: String): Result<Double> {
        delay(1500.milliseconds) // Network delay simulation

        val networkSettlementSuccess = true

        return if (networkSettlementSuccess) {
            Result.success(Unit)
        } else {
            Result.failure(Exception("Cloud settlement server rejected structural ZK constraints."))
        }
    }
}*/
