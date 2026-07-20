package io.github.nicolaspurr.civicwallet.feature.payment.domain.interactor

import io.github.nicolaspurr.civicwallet.feature.payment.domain.session.PaymentSessionRepository
import io.github.nicolaspurr.civicwallet.core.zk.ZkProofEngine
import javax.inject.Inject

/**
 * Executes the ZK proof generation and stores the result.
 *
 * This use case acts as the bridge between biometric verification and local storage.
 * It coordinates the cryptographic work required to build a valid proof payload.
 *
 * ### Performance Warning
 * ZK proof generation involves heavy polynomial math. While this function is a `suspend`
 * function, callers should ensure it is collected within a CPU-optimized dispatcher,
 * such as `Dispatchers.Default`.
 */
class ZkProofInteractor @Inject constructor(
    private val zkEngine: ZkProofEngine,
    private val paymentSessionRepository: PaymentSessionRepository
) {
    /**
     * Triggers the cryptographic proof generation engine using the provided biometric [confidence].
     *
     * On successful generation, the resulting proof payload and engine timing metrics
     * are written directly into the [PaymentSessionRepository].
     *
     * @param confidence A normalized score (0.0 to 1.0) indicating biometric match quality.
     * @return A [Result] indicating whether the proof was successfully generated and stored.
     */
    suspend fun execute(confidence: Float): Result<Unit> {
        return zkEngine.generateProof(confidence).map { result ->
            paymentSessionRepository.storeProof(result.proofJson, result.totalEngineTimeMs)
        }
    }
}