package io.github.nicolaspurr.civicwallet.feature.payment.domain.session

import kotlinx.coroutines.flow.StateFlow

sealed interface SessionState {
    data object Idle : SessionState
    data object Initializing : SessionState
    data class Ready(val confidence: Float) : SessionState
    data object GeneratingProof : SessionState
    data object ProofGenerated : SessionState
    data class Error(val message: String) : SessionState
}

interface BiometricSessionOrchestrator {
    val sessionState: StateFlow<SessionState>
    fun start()
    fun reset()
    fun stop()
}