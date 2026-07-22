package io.github.nicolaspurr.civicwallet.feature.payment.presentation

import android.annotation.SuppressLint
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import io.github.nicolaspurr.civicwallet.feature.payment.domain.session.BiometricSessionOrchestrator
import io.github.nicolaspurr.civicwallet.feature.payment.domain.session.SessionState
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.Job
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import javax.inject.Inject
import kotlin.time.Duration.Companion.milliseconds

/**
 * [ViewModel] managing the live biometric facial scanning lifecycle and UI state transitions.
 *
 * Observes state emissions from [BiometricSessionOrchestrator], enforces a 15-second scanning
 * timeout to prevent camera resource lockups, and handles recalibration triggers.
 *
 * @property orchestrator Domain session orchestrator coordinating CameraX frame analysis and state.
 */
@HiltViewModel
class BiometricViewModel @Inject constructor(
    private val orchestrator: BiometricSessionOrchestrator
) : ViewModel() {

    private val _uiState = MutableStateFlow<BiometricUiState>(BiometricUiState.Initializing)

    /**
     * Read-only StateFlow emitting discrete [BiometricUiState] changes to UI components.
     */
    val uiState = _uiState.asStateFlow()

    /** Coroutine job tracking the active 15-second biometric scanning countdown. */
    private var timeoutJob: Job? = null

    init {
        // Initialise the biometric hardware session immediately upon ViewModel creation
        orchestrator.start()

        // Collect continuous session state updates from the domain orchestrator
        viewModelScope.launch {
            orchestrator.sessionState.collect { sessionState ->
                updateUiState(sessionState)
            }
        }
    }

    /**
     * Maps low-level domain [SessionState] to presentation-layer [BiometricUiState].
     *
     * @param sessionState The incoming state from [BiometricSessionOrchestrator].
     */
    private fun updateUiState(sessionState: SessionState) {
        when (sessionState) {
            is SessionState.Idle, is SessionState.Initializing -> {
                _uiState.value = BiometricUiState.Initializing
            }
            is SessionState.Ready -> {
                _uiState.value = BiometricUiState.Scanning(sessionState.confidence)
                startTimeoutCountdown()
            }
            is SessionState.GeneratingProof -> {
                // Cancel timeout countdown once proof generation begins
                timeoutJob?.cancel()
                _uiState.value = BiometricUiState.GeneratingProof
            }
            is SessionState.ProofGenerated -> {
                _uiState.value = BiometricUiState.ProofGenerated
            }
            is SessionState.Error -> {
                timeoutJob?.cancel()
                _uiState.value = BiometricUiState.Error(sessionState.message)
            }
        }
    }

    /**
     * Starts a 15-second timeout countdown during the active scanning phase.
     * Automatically stops the camera orchestrator and transitions UI state to
     * [BiometricUiState.Timeout] if a valid face match is not achieved within the window.
     */
    private fun startTimeoutCountdown() {
        if (timeoutJob?.isActive == true) return
        timeoutJob = viewModelScope.launch {
            delay(15000L.milliseconds) // 15-second scanning limit
            orchestrator.stop()
            _uiState.value = BiometricUiState.Timeout
        }
    }

    /**
     * Emits a state event directing the presentation layer to navigate to the facial recalibration
     * screen.
     */
    fun triggerRecalibrationEvent() {
        _uiState.value = BiometricUiState.NavigateToRecalibrate
    }

    /**
     * Cancels active timeouts and resets the session orchestrator to initial idle state.
     */
    fun resetState() {
        timeoutJob?.cancel()
        orchestrator.reset()
    }

    /**
     * Ensures clean-up of camera session and background coroutine jobs when ViewModel is destroyed.
     */
    @SuppressLint("EmptySuperCall")
    override fun onCleared() {
        super.onCleared()
        timeoutJob?.cancel()
        orchestrator.stop()
    }
}

/**
 * Represents the full set of UI states for the facial scanning screen.
 */
sealed interface BiometricUiState {
    /** Camera hardware and TFLite models are loading */
    data object Initializing : BiometricUiState

    /** Active camera frame analysis in progress with real-time match confidence score */
    data class Scanning(val confidence: Float) : BiometricUiState

    /** 15-second scanning window expired without a successful match */
    data object Timeout : BiometricUiState

    /** Biometric match succeeded; native MoPro ZK proof generation is active */
    data object GeneratingProof : BiometricUiState

    /** An unrecoverable error occurred during scanning or proof construction */
    data class Error(val message: String) : BiometricUiState

    /** ZK proof construction completed successfully */
    data object ProofGenerated : BiometricUiState

    /** Triggered when the user requests or requires facial model recalibration */
    data object NavigateToRecalibrate : BiometricUiState
}