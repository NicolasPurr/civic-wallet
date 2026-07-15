package io.github.nicolaspurr.civicwallet.feature.payment.domain.usecase

import io.github.nicolaspurr.civicwallet.feature.payment.domain.session.PaymentSessionRepository
import io.github.nicolaspurr.civicwallet.core.zk.ZkProofEngine
import javax.inject.Inject

class GenerateAndStoreZkProofUseCase @Inject constructor(
    private val zkEngine: ZkProofEngine,
    private val paymentSessionRepository: PaymentSessionRepository
) {
    /**
     * Executes ZK proof generation, extracts benchmarking metrics from the engine,
     * and writes the resulting payload.
     */
    suspend fun execute(confidence: Float): Result<Unit> {
        return zkEngine.generateProof(confidence).map { result ->
            paymentSessionRepository.storeProof(result.proofJson, result.totalEngineTimeMs)
        }
    }
}