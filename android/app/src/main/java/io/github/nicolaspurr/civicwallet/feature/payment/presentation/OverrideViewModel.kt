package io.github.nicolaspurr.civicwallet.feature.payment.presentation

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class OverrideViewModel @Inject constructor() : ViewModel() {

    private val _overrideState = MutableStateFlow<OverrideUiState>(OverrideUiState.Idle)
    val overrideState = _overrideState.asStateFlow()

    fun onAdminAuthSuccess() {
        _overrideState.value = OverrideUiState.Verifying
        viewModelScope.launch {
            try {
                // Perform any secure administrative tasks here
                _overrideState.value = OverrideUiState.Success
            } catch (e: Exception) {
                _overrideState.value = OverrideUiState.Error(e.localizedMessage ?: "Failed administrative actions.")
            }
        }
    }

    fun onAdminAuthFailed(errorMessage: String) {
        _overrideState.value = OverrideUiState.Error(errorMessage)
    }

    fun resetOverrideState() {
        _overrideState.value = OverrideUiState.Idle
    }
}

sealed interface OverrideUiState {
    data object Idle : OverrideUiState
    data object Verifying : OverrideUiState
    data class Error(val message: String) : OverrideUiState
    data object Success : OverrideUiState
}