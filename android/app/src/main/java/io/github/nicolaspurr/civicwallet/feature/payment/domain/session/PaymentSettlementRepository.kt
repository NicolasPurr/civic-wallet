package io.github.nicolaspurr.civicwallet.feature.payment.domain.session

// This interface lives in domain, forcing the data layer to implement the real network calls
interface PaymentSettlementRepository {
    suspend fun submitZkProof(proof: CharArray): Result<Unit>
}