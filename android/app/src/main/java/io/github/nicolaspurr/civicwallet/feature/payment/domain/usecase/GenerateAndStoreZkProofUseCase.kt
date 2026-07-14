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
     * and securely writes the resulting CharArray payload directly to the session repository.
     * @return Result.success(Unit) upon secure storage, or a failure wrapping the exception.
     */
    suspend fun execute(confidence: Float): Result<Unit> {
        return zkEngine.generateProof(confidence).map { result ->
            val proofChars = result.proof

            if (proofChars.isEmpty() || proofChars.all { it == '\u0000' }) {
                throw IllegalStateException("ZK Engine returned empty or wiped proof payload.")
            }

            // Cleanly retrieve the highly accurate timing metrics from the ZK Engine
            val generationTimeMs = result.totalEngineTimeMs

            // Atomically cache inside our secure RAM session repository
            paymentSessionRepository.storeProof(proofChars, generationTimeMs)
        }
    }
}