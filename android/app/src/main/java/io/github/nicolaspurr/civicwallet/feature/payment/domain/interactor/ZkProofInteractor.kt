package io.github.nicolaspurr.civicwallet.feature.payment.domain.interactor

import io.github.nicolaspurr.civicwallet.feature.payment.domain.session.PaymentSessionRepository
import io.github.nicolaspurr.civicwallet.core.zk.ZkProofEngine
import javax.inject.Inject
import javax.inject.Singleton
import kotlinx.coroutines.sync.Mutex
import kotlinx.coroutines.sync.withLock

/**
 * Executes the ZK proof generation and stores the result.
 *
 * This use case acts as the bridge between biometric verification and local storage.
 * It coordinates the cryptographic work required to build a valid proof payload.
 *
 * ### Performance Warning
 * ZK proof generation involves heavy polynomial math. While this function is a `suspend`
 * function, callers should ensure it is collected within a CPU-optimised dispatcher,
 * such as `Dispatchers.Default`.
 */
@Singleton
class ZkProofInteractor @Inject constructor(
    private val zkEngine: ZkProofEngine,
    private val paymentSessionRepository: PaymentSessionRepository
) {
    private val executionMutex = Mutex()
    @Volatile private var isGenerating = false


    /**
     * Triggers the cryptographic proof generation engine using the provided biometric [confidence].
     *
     * On successful generation, the resulting proof payload and engine timing metrics
     * are written directly into the [PaymentSessionRepository].
     *
     * @param confidence A normalised score (0.0 to 1.0) indicating biometric match quality.
     * @return A [Result] indicating whether the proof was successfully generated and stored.
     */
    suspend fun execute(confidence: Float): Result<Unit> {
        if (isGenerating) {
            return Result.failure(IllegalStateException("Proof generation already in progress."))
        }

        return executionMutex.withLock {
            if (isGenerating) {
                return Result.failure(IllegalStateException("Proof generation already in progress."))
            }
            isGenerating = true
            try {
                val result = zkEngine.generateProof(confidence)
                result.onSuccess { proof ->
                    paymentSessionRepository.storeResult(proof)
                }
                result.map { }
            } finally {
                isGenerating = false
            }
        }
    }
}