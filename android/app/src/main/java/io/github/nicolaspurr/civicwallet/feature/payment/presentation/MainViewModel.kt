package io.github.nicolaspurr.civicwallet.feature.payment.presentation

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import dagger.hilt.android.lifecycle.HiltViewModel
import io.github.nicolaspurr.civicwallet.feature.payment.domain.session.BiometricSessionOrchestrator
import io.github.nicolaspurr.civicwallet.feature.payment.domain.interactor.ZkProofInteractor
import kotlinx.coroutines.flow.MutableSharedFlow
import kotlinx.coroutines.flow.SharedFlow
import kotlinx.coroutines.flow.asSharedFlow
import kotlinx.coroutines.launch
import javax.inject.Inject

/**
 * Represents one-time UI events emitted by [MainViewModel] to handle navigation and feedback.
 */
sealed interface MainUiEvent {
    /**
     * Directs the UI to navigate to the biometric scan screen.
     */
    data object NavigateToBiometricScan : MainUiEvent
    /**
     * Directs the UI to navigate to the verification screen after proof generation.
     */
    data object NavigateToVerifying : MainUiEvent
    /**
     * Directs the UI to display an error message (e.g., via Toast or Snackbar).
     */
    data class ShowError(val message: String) : MainUiEvent
}

/**
 * [ViewModel] responsible for orchestrating the payment flow actions in the UI.
 *
 * Manages user interactions for both standard biometric authentication and
 * the bypass benchmark flow using Zero-Knowledge (ZK) proof generation.
 *
 * @property biometricSessionOrchestrator Orchestrates biometric authentication session states.
 * @property zkProofInteractor Executes Zero-Knowledge proof generation with confidence metrics.
 */
@HiltViewModel
class MainViewModel @Inject constructor(
    private val biometricSessionOrchestrator: BiometricSessionOrchestrator,
    private val zkProofInteractor: ZkProofInteractor
) : ViewModel() {


    /**
     * A read-only [SharedFlow] of [MainUiEvent] observed by the UI to trigger actions.
     */
    private val _uiEvent = MutableSharedFlow<MainUiEvent>()
    /**
     * Starts a biometric authentication session and notifies the UI to navigate to the biometric
     * scan screen.
     */
    val uiEvent: SharedFlow<MainUiEvent> = _uiEvent.asSharedFlow()

    /**
     * Bypasses biometric authentication to execute ZK proof generation directly.
     *
     * Generates a proof with a fixed 100% confidence (`1.0f`) for benchmark testing.
     * Emits [MainUiEvent.NavigateToVerifying] when generation succeeds.
     */
    fun onInitiateWithBiometrics() {
        viewModelScope.launch {
            biometricSessionOrchestrator.start()
            _uiEvent.emit(MainUiEvent.NavigateToBiometricScan)
        }
    }

    /**
     * Bypasses facial biometric matching to trigger immediate ZK proof generation.
     *
     * Supplies a fixed 100% confidence value (`1.0f`) to simulate a perfect match,
     * enabling smooth benchmarking on emulators and non-TEE devices.
     */
    fun onInitiateBypassBiometrics() {
        viewModelScope.launch {
            // Generate ZK proof directly with 100% confidence (1.0f) for the bypass benchmark
            zkProofInteractor.execute(confidence = 1.0f)
                .onSuccess {
                    _uiEvent.emit(MainUiEvent.NavigateToVerifying)
                }
                .onFailure { error ->
                    _uiEvent.emit(MainUiEvent.ShowError(error.message ?: "Proof generation failed"))
                }
        }
    }
}