package io.github.nicolaspurr.civicwallet.feature.payment.presentation

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import io.github.nicolaspurr.civicwallet.feature.payment.domain.interactor.SettlementStatus
import io.github.nicolaspurr.civicwallet.feature.payment.domain.interactor.PaymentSettlementInteractor
import dagger.hilt.android.lifecycle.HiltViewModel
import io.github.nicolaspurr.civicwallet.feature.payment.domain.interactor.SettlementStep
import kotlinx.coroutines.channels.Channel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.receiveAsFlow
import kotlinx.coroutines.launch
import javax.inject.Inject

/**
 * One-time navigation and side effect events emitted during the payment settlement workflow.
 */
sealed interface PaymentUiEvent {
    /**
     *  Navigates the UI on success with the final settled transaction amount.
     *
     * @property amount The formatted settlement amount string (e.g., "$42.00 CBDC").
     */
    data class NavigateToSuccess(val amount: String) : PaymentUiEvent

    /**
     *  Navigates the UI on settlement failure.
     *
     * @property source Identifier indicating which layer triggered failure (e.g., "cloud" or "local").
     */
    data class NavigateToUnauthorized(val source: String) : PaymentUiEvent
}

/**
 * [ViewModel] driving the ZK-proof verification and payment settlement workflow.
 *
 * Collects real-time settlement status updates from [PaymentSettlementInteractor], updates
 * progression steps on verification, and captures native Groth16 proof generation
 * latency for mobile benchmarking.
 *
 * Scoped to the nested payment sub-graph (`Screen.GRAPH_PAYMENT_FLOW`) to maintain state
 * continuity across verification steps.
 *
 * @property paymentSettlementInteractor Domain interactor executing local proof checks and remote
 * Axum server settlement.
 */
@HiltViewModel
class PaymentViewModel @Inject constructor(
    private val paymentSettlementInteractor: PaymentSettlementInteractor
) : ViewModel() {

    private val _uiState = MutableStateFlow<PaymentUiState>(PaymentUiState.Idle)
    /** Read-only StateFlow exposing current payment settlement progress steps to the UI. */
    val uiState = _uiState.asStateFlow()

    // Buffered Channel ensures navigation events are delivered exactly once
    // without re-firing upon configuration changes (e.g., screen rotations).
    private val _uiEvent = Channel<PaymentUiEvent>(Channel.BUFFERED)

    /** Read-only Flow emitting navigation events to UI observers. */
    val uiEvent = _uiEvent.receiveAsFlow()

    private val _zkGenerationTime = MutableStateFlow(0L)

    /** Read-only StateFlow holding the proof generation latency in milliseconds. */
    val zkGenerationTime = _zkGenerationTime.asStateFlow()

    /**
     * Triggers the end-to-end payment settlement pipeline.
     *
     * Guards against concurrent executions by ignoring calls if [_uiState] is not currently
     * [PaymentUiState.Idle].
     */
    fun startSettlement() {
        if (_uiState.value !is PaymentUiState.Idle) return

        viewModelScope.launch {
            paymentSettlementInteractor.execute().collect { status ->
                when (status) {
                    is SettlementStatus.Verifying -> {
                        // Update UI with progress step
                        _uiState.value = PaymentUiState.Verifying(status.step)
                    }
                    is SettlementStatus.Success -> {
                        _uiState.value = PaymentUiState.Idle
                        // Store proof generation latency for benchmarking performance
                        _zkGenerationTime.value = status.generationTimeMs

                        // Dispatch navigation event with transaction summary metadata
                        val settlementAmount = "$42.00 CBDC" // Benchmark payload placeholder
                        _uiEvent.send(PaymentUiEvent.NavigateToSuccess(settlementAmount))
                    }
                    is SettlementStatus.Error -> {
                        _uiState.value = PaymentUiState.Error(status.message)
                        // Route user to failure screen flagged as a cloud/backend settlement error
                        _uiEvent.send(PaymentUiEvent.NavigateToUnauthorized("cloud"))
                    }
                }
            }
        }
    }
}

/**
 * Discrete state contract for the payment settlement screen.
 */
sealed interface PaymentUiState {
    /** Awaiting settlement initiation. */
    data object Idle : PaymentUiState

    /** Settlement pipeline actively executing. Encapsulates the active [SettlementStep]. */
    data class Verifying(val step: SettlementStep) : PaymentUiState

    /** Transaction settlement successfully finalised. */
    data object Success : PaymentUiState

    /** Transaction settlement failed with a descriptive error message. */
    data class Error(val message: String) : PaymentUiState
}