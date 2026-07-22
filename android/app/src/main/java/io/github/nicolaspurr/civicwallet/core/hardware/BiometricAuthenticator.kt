package io.github.nicolaspurr.civicwallet.core.hardware

import kotlinx.coroutines.flow.Flow

/**
 * Read-only interface for domain observers (e.g., ViewModels and UseCases).
 */
interface BiometricAuthenticator {
    /**
     * Emits sanitised live inference confidence scores.
     */
    val confidenceFlow: Flow<Float>
}

/**
 * Write-only interface for data-layer hardware drivers (e.g., Camera Analyzers).
 */
interface BiometricAuthSink {

    /**
     * Emits a newly calculated confidence score into the reactive pipeline.
     *
     * @param score Normalized confidence score between 0.0 (no match) and 1.0 (positive match).
     */
    fun emitConfidence(score: Float)
}