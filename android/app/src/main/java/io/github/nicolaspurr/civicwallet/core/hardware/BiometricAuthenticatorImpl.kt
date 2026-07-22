package io.github.nicolaspurr.civicwallet.core.hardware

import kotlinx.coroutines.channels.BufferOverflow
import kotlinx.coroutines.flow.MutableSharedFlow
import kotlinx.coroutines.flow.asSharedFlow
import javax.inject.Inject
import javax.inject.Singleton

/**
 * Thread-safe, reactive event bus bridging sensor analysis with session orchestration.
 *
 * Implements interface segregation by splitting operations into two distinct roles:
 * 1. [BiometricAuthSink]: Write-only pipeline injection interface used by hardware analysers
 * (e.g., [FaceAnalyzer]).
 * 2. [BiometricAuthenticator]: Read-only observation stream consumed by domain logic
 * (e.g., `BiometricSessionOrchestratorImpl`).
 *
 * ### Backpressure Strategy
 * Configured with `replay = 0` and `extraBufferCapacity = 1` using [BufferOverflow.DROP_OLDEST].
 * If the downstream subscriber (UI or orchestrator) is busy processing a heavy calculation when a
 * new frame score arrives, the buffer drops the outdated score instantly. This guarantees
 * zero-allocation non-blocking frame processing without queuing stale confidence scores in RAM.
 */
@Singleton
class BiometricAuthenticatorImpl @Inject constructor() : BiometricAuthenticator, BiometricAuthSink {

    /**
     * Hot shared flow carrying real-time biometric match confidence scores (0.0 to 1.0).
     */
    private val _confidenceFlow = MutableSharedFlow<Float>(
        replay = 0,
        extraBufferCapacity = 1,
        onBufferOverflow = BufferOverflow.DROP_OLDEST
    )

    /**
     * Exposes the confidence stream as a read-only [kotlinx.coroutines.flow.SharedFlow] to UI
     * and domain observers.
     */
    override val confidenceFlow = _confidenceFlow.asSharedFlow()

    /**
    * Uses non-blocking `tryEmit` to instantly drop old values if the channel buffer is full,
    * preventing thread lockups inside high-frequency camera loops.
     */
    override fun emitConfidence(score: Float) {
        _confidenceFlow.tryEmit(score)
    }
}