package io.github.nicolaspurr.civicwallet.feature.payment.presentation

import android.util.Log
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import io.github.nicolaspurr.civicwallet.feature.payment.domain.interactor.SettlementStatus
import io.github.nicolaspurr.civicwallet.feature.payment.domain.interactor.PaymentSettlementInteractor
import dagger.hilt.android.lifecycle.HiltViewModel
import io.github.nicolaspurr.civicwallet.core.zk.ZkCircuitInput
import io.github.nicolaspurr.civicwallet.core.zk.ZkProofResult
import io.github.nicolaspurr.civicwallet.feature.payment.domain.interactor.SettlementStep
import io.github.nicolaspurr.civicwallet.feature.payment.domain.interactor.ZkProofInteractor
import io.github.nicolaspurr.civicwallet.feature.payment.domain.session.PaymentSessionRepository
import kotlinx.coroutines.channels.Channel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.receiveAsFlow
import kotlinx.coroutines.launch
import org.json.JSONObject
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
    private val paymentSettlementInteractor: PaymentSettlementInteractor,
    private val paymentSessionRepository: PaymentSessionRepository,
    private val zkProofInteractor: ZkProofInteractor,
) : ViewModel() {

    companion object {
        private const val BENCHMARK_TAG = "CIVIC_BENCHMARK"
    }

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

    private var isBenchmarkMode = false

    /** For easy benchmarking with `adb`. */
    fun setBenchmarkMode(enabled: Boolean) {
        this.isBenchmarkMode = enabled
    }

    /**
     * Triggers the end-to-end payment settlement pipeline.
     *
     * Guards against concurrent executions by ignoring calls if [_uiState] is not currently
     * [PaymentUiState.Idle].
     */
    fun startSettlement(circuitInput: ZkCircuitInput? = null) {
        if (_uiState.value !is PaymentUiState.Idle) return

        viewModelScope.launch {
            // Check if a local proof was already generated during the camera scan
            var localProof = paymentSessionRepository.getStoredResult()

            // If no local proof exists (Bypass or CLI mode), generate it now
            if (localProof == null && circuitInput != null) {
                _uiState.value = PaymentUiState.Verifying(SettlementStep.GENERATING_PROOF)

                val genResult = zkProofInteractor.execute(circuitInput)
                if (genResult.isFailure) {
                    _uiState.value = PaymentUiState.Error("Failed to generate proof locally.")
                    return@launch
                }
                // Fetch the freshly generated proof from the repository
                localProof = paymentSessionRepository.getStoredResult()
            }

            // Send the local proof to the Axum server for verification & settlement
            paymentSettlementInteractor.execute().collect { status ->
                when (status) {
                    is SettlementStatus.Verifying -> {
                        _uiState.value = PaymentUiState.Verifying(status.step)
                    }
                    is SettlementStatus.Success -> {
                        _uiState.value = PaymentUiState.Idle
                        _zkGenerationTime.value = status.generationTimeMs

                        // Combine local proof metrics + server verification metrics for ADB logcat
                        logBenchmarkResults(
                            zkResult = localProof,
                            serverTimeMs = status.serverVerificationTimeMs.toLong(),
                            success = true,
                            errorMsg = null
                        )

                        _uiEvent.send(PaymentUiEvent.NavigateToSuccess("$42.00 CBDC"))
                    }
                    is SettlementStatus.Error -> {
                        _uiState.value = PaymentUiState.Error(status.message)
                        logBenchmarkResults(
                            zkResult = localProof,
                            serverTimeMs = 0L,
                            success = false,
                            errorMsg = status.message
                        )
                        _uiEvent.send(PaymentUiEvent.NavigateToUnauthorized("cloud"))
                    }
                }
            }
        }
    }

    /**
     * Retrieves and logs the benchmark results from [paymentSessionRepository].
     *
     * @param serverTimeMs server verification time
     * @param success whether the verification was successful
     * @param errorMsg error message, if any
     */
    private fun logBenchmarkResults(
        zkResult: ZkProofResult?,
        serverTimeMs: Long,
        success: Boolean,
        errorMsg: String?
    ) {
        val jsonPayload = JSONObject().apply {
            put("success", success)
            put("witnessAndProofGenTimeMs", zkResult?.proofGenTimeMs ?: 0L) // main KPI
            put("localVerificationTimeMs", (zkResult?.totalEngineTimeMs ?: 0L) - (zkResult?.proofGenTimeMs ?: 0L))
            put("totalEngineTimeMs", zkResult?.totalEngineTimeMs ?: 0L)
            put("proofSizeInBytes", zkResult?.proofSizeInBytes ?: 0)
            put("serverProcessingTimeMs", serverTimeMs)

            // Native memory & thermal metrics
            put("nativeHeapDeltaMb", zkResult?.nativeHeapDeltaMb ?: 0L)
            put("vmHwmMb", zkResult?.vmHwmMb ?: 0L)
            put("thermalStatus", zkResult?.thermalStatus ?: "UNKNOWN")

            put("error", errorMsg ?: "")
        }

        Log.i(BENCHMARK_TAG, jsonPayload.toString())
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

    /** Transaction settlement failed with an error message. */
    data class Error(val message: String) : PaymentUiState
}
