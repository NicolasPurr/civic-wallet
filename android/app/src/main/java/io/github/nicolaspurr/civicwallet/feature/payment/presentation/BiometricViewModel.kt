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

@HiltViewModel
class BiometricViewModel @Inject constructor(
    private val orchestrator: BiometricSessionOrchestrator
) : ViewModel() {

    private val _uiState = MutableStateFlow<BiometricUiState>(BiometricUiState.Initializing)
    val uiState = _uiState.asStateFlow()

    private var timeoutJob: Job? = null

    init {
        orchestrator.start()

        viewModelScope.launch {
            orchestrator.sessionState.collect { sessionState ->
                updateUiState(sessionState)
            }
        }
    }

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

    private fun startTimeoutCountdown() {
        if (timeoutJob?.isActive == true) return
        timeoutJob = viewModelScope.launch {
            delay(15000L.milliseconds)
            orchestrator.stop()
            _uiState.value = BiometricUiState.Timeout
        }
    }

    fun triggerRecalibrationEvent() {
        _uiState.value = BiometricUiState.NavigateToRecalibrate
    }

    fun resetState() {
        timeoutJob?.cancel()
        orchestrator.reset()
    }

    @SuppressLint("EmptySuperCall")
    override fun onCleared() {
        super.onCleared()
        timeoutJob?.cancel()
        orchestrator.stop()
    }
}

sealed interface BiometricUiState {
    data object Initializing : BiometricUiState
    data class Scanning(val confidence: Float) : BiometricUiState
    data object Timeout : BiometricUiState
    data object GeneratingProof : BiometricUiState
    data class Error(val message: String) : BiometricUiState
    data object ProofGenerated : BiometricUiState
    data object NavigateToRecalibrate : BiometricUiState
}