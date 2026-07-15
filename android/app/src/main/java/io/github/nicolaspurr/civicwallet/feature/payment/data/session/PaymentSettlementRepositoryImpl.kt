package io.github.nicolaspurr.civicwallet.feature.payment.data.session

import io.github.nicolaspurr.civicwallet.feature.payment.domain.session.PaymentSettlementRepository
import kotlinx.coroutines.delay
import javax.inject.Inject
import javax.inject.Singleton
import kotlin.time.Duration.Companion.milliseconds

@Singleton
class PaymentSettlementRepositoryImpl @Inject constructor() : PaymentSettlementRepository {

    override suspend fun submitZkProof(proof: String): Result<Unit> {
        delay(1500.milliseconds) // Network delay simulation

        val networkSettlementSuccess = true

        return if (networkSettlementSuccess) {
            Result.success(Unit)
        } else {
            Result.failure(Exception("Cloud settlement server rejected structural ZK constraints."))
        }
    }
}