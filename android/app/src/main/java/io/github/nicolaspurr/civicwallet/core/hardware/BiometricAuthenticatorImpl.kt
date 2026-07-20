package io.github.nicolaspurr.civicwallet.core.hardware

import kotlinx.coroutines.flow.MutableSharedFlow
import kotlinx.coroutines.flow.asSharedFlow
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class BiometricAuthenticatorImpl @Inject constructor() : BiometricAuthenticator, BiometricAuthSink {

    // Capacity of 0 with DROP_OLDEST means no stale scores are ever buffered in RAM
    private val _confidenceFlow = MutableSharedFlow<Float>(
        replay = 0,
        extraBufferCapacity = 1,
        onBufferOverflow = kotlinx.coroutines.channels.BufferOverflow.DROP_OLDEST
    )
    override val confidenceFlow = _confidenceFlow.asSharedFlow()

    override fun emitConfidence(score: Float) {
        _confidenceFlow.tryEmit(score)
    }
}