package io.github.nicolaspurr.civicwallet.core.hardware

import kotlinx.coroutines.flow.Flow

/**
 * Read-only interface for domain observers (e.g., ViewModels and UseCases).
 */
interface BiometricAuthenticator {
    /**
     * Emits sanitized live inference confidence scores.
     *
     */
    val confidenceFlow: Flow<Float>
}

/**
 * Write-only interface for data-layer hardware drivers (e.g., Camera Analyzers).
 */
interface BiometricAuthSink {
    fun emitConfidence(score: Float)
}