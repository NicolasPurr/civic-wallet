package io.github.nicolaspurr.civicwallet.feature.payment.domain.session

interface PaymentSettlementRepository {
    suspend fun submitZkProof(proof: String): Result<Unit>
}