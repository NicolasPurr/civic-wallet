package io.github.nicolaspurr.civicwallet.feature.payment.presentation

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import io.github.nicolaspurr.civicwallet.feature.payment.domain.usecase.SettlementStatus
import io.github.nicolaspurr.civicwallet.feature.payment.domain.usecase.SubmitPaymentUseCase
import dagger.hilt.android.lifecycle.HiltViewModel
import io.github.nicolaspurr.civicwallet.feature.payment.domain.usecase.SettlementStep
import kotlinx.coroutines.channels.Channel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.receiveAsFlow
import kotlinx.coroutines.launch
import javax.inject.Inject

sealed interface PaymentUiEvent {
    object NavigateToSuccess : PaymentUiEvent
    object NavigateToUnauthorized : PaymentUiEvent
}

@HiltViewModel
class PaymentViewModel @Inject constructor(
    private val submitPaymentUseCase: SubmitPaymentUseCase
) : ViewModel() {

    private val _uiState = MutableStateFlow<PaymentUiState>(PaymentUiState.Idle)
    val uiState = _uiState.asStateFlow()

    private val _uiEvent = Channel<PaymentUiEvent>(Channel.BUFFERED)
    val uiEvent = _uiEvent.receiveAsFlow()

    var zkGenerationTime: Long = 0L
        private set

    fun startSettlement() {
        // FIXED: Prevent duplicate execution upon configuration change/rotation
        if (_uiState.value !is PaymentUiState.Idle) return

        viewModelScope.launch {
            submitPaymentUseCase.execute().collect { status ->
                when (status) {
                    is SettlementStatus.Verifying -> {
                        _uiState.value = PaymentUiState.Verifying(status.step)
                    }
                    is SettlementStatus.Success -> {
                        _uiState.value = PaymentUiState.Idle
                        this@PaymentViewModel.zkGenerationTime = status.generationTimeMs
                        _uiEvent.send(PaymentUiEvent.NavigateToSuccess)
                    }
                    is SettlementStatus.Error -> {
                        _uiState.value = PaymentUiState.Error(status.message)
                        _uiEvent.send(PaymentUiEvent.NavigateToUnauthorized)
                    }
                }
            }
        }
    }
}

sealed interface PaymentUiState {
    data object Idle : PaymentUiState
    data class Verifying(val step: SettlementStep) :
        PaymentUiState

    data object Success : PaymentUiState
    data class Error(val message: String) : PaymentUiState
}