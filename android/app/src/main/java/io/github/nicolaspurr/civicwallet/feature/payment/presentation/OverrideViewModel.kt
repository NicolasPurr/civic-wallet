package io.github.nicolaspurr.civicwallet.feature.payment.presentation

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import javax.inject.Inject

/**
 * [ViewModel] handling manual administrative override flows.
 *
 * Manages UI state when biometric authentication fails or model recalibration is required,
 * allowing authorised admin credentials to override terminal lockouts.
 */
@HiltViewModel
class OverrideViewModel @Inject constructor() : ViewModel() {

    private val _overrideState = MutableStateFlow<OverrideUiState>(OverrideUiState.Idle)

    /**
     * Read-only StateFlow emitting the current administrative override UI state.
     */
    val overrideState = _overrideState.asStateFlow()

    /**
     * Triggered when administrative credentials are successfully validated.
     * Sets state to [OverrideUiState.Verifying] while underlying administrative overrides execute.
     */
    fun onAdminAuthSuccess() {
        _overrideState.value = OverrideUiState.Verifying
        viewModelScope.launch {
            try {
                // Execute administrative override or token resets here
                _overrideState.value = OverrideUiState.Success
            } catch (e: Exception) {
                _overrideState.value = OverrideUiState.Error(
                    e.localizedMessage ?: "Failed administrative actions."
                )
            }
        }
    }

    /**
     * Triggered when administrative credentials fail validation.
     *
     * @param errorMessage Descriptive reason for authorisation failure.
     */
    fun onAdminAuthFailed(errorMessage: String) {
        _overrideState.value = OverrideUiState.Error(errorMessage)
    }

    /**
     * Resets the override UI state back to [OverrideUiState.Idle].
     */
    fun resetOverrideState() {
        _overrideState.value = OverrideUiState.Idle
    }
}

/**
 * Discrete state contract for the administrative override workflow.
 */
sealed interface OverrideUiState {
    /** Awaiting user or administrator input. */
    data object Idle : OverrideUiState

    /** Administrative credentials or override tasks are processing. */
    data object Verifying : OverrideUiState

    /** Administrative override failed with an error message. */
    data class Error(val message: String) : OverrideUiState

    /** Administrative override succeeded. */
    data object Success : OverrideUiState
}