package io.github.nicolaspurr.civicwallet.core.hardware

import kotlinx.coroutines.flow.MutableSharedFlow
import kotlinx.coroutines.flow.asSharedFlow
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class BiometricAuthenticatorImpl @Inject constructor() : BiometricAuthenticator, BiometricAuthSink {

    private val _confidenceFlow = MutableSharedFlow<Float>(extraBufferCapacity = 64)
    override val confidenceFlow = _confidenceFlow.asSharedFlow()

    // Internal Data Layer bridge method - not exposed to the Domain interface.
    override fun emitConfidence(score: Float) {
        _confidenceFlow.tryEmit(score)
    }
}