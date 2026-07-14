package io.github.nicolaspurr.civicwallet.feature.payment.data.session

import io.github.nicolaspurr.civicwallet.BuildConfig
import io.github.nicolaspurr.civicwallet.core.di.DefaultDispatcher
import io.github.nicolaspurr.civicwallet.core.hardware.BiometricAuthenticator
import io.github.nicolaspurr.civicwallet.core.ml.ModelManager
import io.github.nicolaspurr.civicwallet.core.ml.ModelState
import io.github.nicolaspurr.civicwallet.feature.payment.domain.session.BiometricSessionOrchestrator
import io.github.nicolaspurr.civicwallet.feature.payment.domain.session.SessionState
import io.github.nicolaspurr.civicwallet.feature.payment.domain.usecase.GenerateAndStoreZkProofUseCase
import kotlinx.coroutines.CoroutineDispatcher
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Job
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import javax.inject.Inject

class BiometricSessionOrchestratorImpl @Inject constructor(
    private val modelManager: ModelManager,
    private val authenticator: BiometricAuthenticator,
    private val generateAndStoreZkProofUseCase: GenerateAndStoreZkProofUseCase,
    @param:DefaultDispatcher private val defaultDispatcher: CoroutineDispatcher
) : BiometricSessionOrchestrator {

    private val _sessionState = MutableStateFlow<SessionState>(SessionState.Idle)
    override val sessionState: StateFlow<SessionState> = _sessionState.asStateFlow()

    private val orchestratorScope = CoroutineScope(SupervisorJob() + defaultDispatcher)

    // Tracks the active execution stream to prevent duplicate/leaked coroutine jobs
    private var activeJob: Job? = null

    private var isModelReady = false
    private var isPipelineLocked = false

    override fun start() {
        // Prevent starting if already active or locked
        if (activeJob?.isActive == true || isPipelineLocked) return

        // Launch coordination job
        activeJob = orchestratorScope.launch {
            _sessionState.value = SessionState.Initializing
            modelManager.initialize()

            // Concurrently listen to machine learning state changes
            launch {
                modelManager.modelState.collect { state ->
                    when (state) {
                        is ModelState.Loading -> _sessionState.value = SessionState.Initializing
                        is ModelState.Ready -> {
                            isModelReady = true
                            _sessionState.value = SessionState.Ready(0f)
                        }
                        is ModelState.Error -> {
                            _sessionState.value = SessionState.Error("Model Init Failed: ${state.message}")
                        }
                    }
                }
            }

            // Concurrently listen to biometric confidence scores
            launch {
                authenticator.confidenceFlow.collect { rawScore ->
                    if (isPipelineLocked) return@collect

                    if (_sessionState.value is SessionState.Ready) {
                        val clampedScore = rawScore.coerceIn(0f, 1f)
                        _sessionState.value = SessionState.Ready(clampedScore)

                        if (clampedScore >= BuildConfig.TRIGGER_THRESHOLD) {
                            isPipelineLocked = true
                            executeProofPipeline(clampedScore)
                        }
                    }
                }
            }
        }
    }

    private suspend fun executeProofPipeline(confidence: Float) {
        _sessionState.value = SessionState.GeneratingProof

        generateAndStoreZkProofUseCase.execute(confidence)
            .onSuccess {
                _sessionState.value = SessionState.ProofGenerated
            }
            .onFailure { error ->
                _sessionState.value = SessionState.Error(error.localizedMessage ?: "Failed proof generation.")
                isPipelineLocked = false // Unlock pipeline on failure so user can retry
            }
    }

    override fun reset() {
        isPipelineLocked = false
        activeJob?.cancel() // Safely cancel only the child jobs of this orchestrator

        if (isModelReady) {
            _sessionState.value = SessionState.Ready(0f)
        } else {
            _sessionState.value = SessionState.Idle
        }
        start() // Safe to call now because the previous activeJob was canceled
    }

    override fun stop() {
        isPipelineLocked = false
        activeJob?.cancel()
        activeJob = null
        _sessionState.value = SessionState.Idle
    }
}