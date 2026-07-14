package io.github.nicolaspurr.civicwallet.feature.payment.data.session

import io.github.nicolaspurr.civicwallet.feature.payment.domain.session.PaymentSettlementRepository
import kotlinx.coroutines.delay
import javax.inject.Inject
import javax.inject.Singleton
import kotlin.time.Duration.Companion.milliseconds

@Singleton
class PaymentSettlementRepositoryImpl @Inject constructor() : PaymentSettlementRepository {

    override suspend fun submitZkProof(proof: CharArray): Result<Unit> {
        // Move the simulation/network work safely to the data layer where it belongs
        delay(1500.milliseconds)

        val networkSettlementSuccess = true // Hook in your real RPC/API client here

        return if (networkSettlementSuccess) {
            Result.success(Unit)
        } else {
            Result.failure(Exception("Cloud settlement rejected the ZK proof."))
        }
    }
}