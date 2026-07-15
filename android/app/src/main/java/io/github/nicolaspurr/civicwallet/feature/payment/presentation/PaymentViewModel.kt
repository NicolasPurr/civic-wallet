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
    // Dynamically carry the transaction metadata to the destination
    data class NavigateToSuccess(val amount: String) : PaymentUiEvent
    data class NavigateToUnauthorized(val source: String) : PaymentUiEvent
}

@HiltViewModel
class PaymentViewModel @Inject constructor(
    private val submitPaymentUseCase: SubmitPaymentUseCase
) : ViewModel() {

    private val _uiState = MutableStateFlow<PaymentUiState>(PaymentUiState.Idle)
    val uiState = _uiState.asStateFlow()

    private val _uiEvent = Channel<PaymentUiEvent>(Channel.BUFFERED)
    val uiEvent = _uiEvent.receiveAsFlow()

    private val _zkGenerationTime = MutableStateFlow(0L)
    val zkGenerationTime = _zkGenerationTime.asStateFlow()

    fun startSettlement() {
        if (_uiState.value !is PaymentUiState.Idle) return

        viewModelScope.launch {
            submitPaymentUseCase.execute().collect { status ->
                when (status) {
                    is SettlementStatus.Verifying -> {
                        _uiState.value = PaymentUiState.Verifying(status.step)
                    }
                    is SettlementStatus.Success -> {
                        _uiState.value = PaymentUiState.Idle
                        _zkGenerationTime.value = status.generationTimeMs

                        // Pass the actual amount settled down to the event stream
                        val settlementAmount = "$42.00 CBDC" // In production, pulled from state/usecase
                        _uiEvent.send(PaymentUiEvent.NavigateToSuccess(settlementAmount))
                    }
                    is SettlementStatus.Error -> {
                        _uiState.value = PaymentUiState.Error(status.message)
                        _uiEvent.send(PaymentUiEvent.NavigateToUnauthorized("cloud"))
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