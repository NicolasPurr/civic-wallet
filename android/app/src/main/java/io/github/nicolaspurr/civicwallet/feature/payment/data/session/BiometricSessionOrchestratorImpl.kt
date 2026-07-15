package io.github.nicolaspurr.civicwallet.feature.payment.data.session

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
import kotlinx.coroutines.sync.Mutex
import kotlinx.coroutines.sync.withLock
import javax.inject.Inject
import javax.inject.Named

class BiometricSessionOrchestratorImpl @Inject constructor(
    private val modelManager: ModelManager,
    private val authenticator: BiometricAuthenticator,
    private val generateAndStoreZkProofUseCase: GenerateAndStoreZkProofUseCase,
    @param:DefaultDispatcher private val defaultDispatcher: CoroutineDispatcher,
    @param:Named("TriggerThreshold") private val triggerThreshold: Float // Inject threshold
) : BiometricSessionOrchestrator {

    private val _sessionState = MutableStateFlow<SessionState>(SessionState.Idle)
    override val sessionState: StateFlow<SessionState> = _sessionState.asStateFlow()

    private val orchestratorScope = CoroutineScope(SupervisorJob() + defaultDispatcher)
    private var activeJob: Job? = null

    // HARDENED: Replaces loose AtomicBoolean variables to prevent parallel state mutation
    private val stateMutex = Mutex()
    private var isModelReady = false

    override fun start() {
        if (activeJob?.isActive == true) return

        activeJob = orchestratorScope.launch {
            _sessionState.value = SessionState.Initializing
            modelManager.initialize()

            launch {
                modelManager.modelState.collect { state ->
                    stateMutex.withLock {
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
            }

            launch {
                authenticator.confidenceFlow.collect { rawScore ->
                    stateMutex.withLock {
                        val currentState = _sessionState.value
                        if (currentState is SessionState.Ready) {
                            val clampedScore = rawScore.coerceIn(0f, 1f)

                            if (clampedScore >= triggerThreshold) {
                                // State change prevents any concurrent frame processing
                                _sessionState.value = SessionState.GeneratingProof

                                // Execute prover asynchronously without blocking mutex flow
                                orchestratorScope.launch {
                                    executeProofPipeline(clampedScore)
                                }
                            } else {
                                _sessionState.value = SessionState.Ready(clampedScore)
                            }
                        }
                    }
                }
            }
        }
    }

    private suspend fun executeProofPipeline(confidence: Float) {
        generateAndStoreZkProofUseCase.execute(confidence)
            .onSuccess {
                stateMutex.withLock {
                    _sessionState.value = SessionState.ProofGenerated
                }
            }
            .onFailure { error ->
                stateMutex.withLock {
                    _sessionState.value = SessionState.Error(error.localizedMessage ?: "Failed proof generation.")
                }
            }
    }

    override fun reset() {
        activeJob?.cancel()
        orchestratorScope.launch {
            stateMutex.withLock {
                if (isModelReady) {
                    _sessionState.value = SessionState.Ready(0f)
                } else {
                    _sessionState.value = SessionState.Idle
                }
            }
            start()
        }
    }

    override fun stop() {
        activeJob?.cancel()
        activeJob = null
        orchestratorScope.launch {
            stateMutex.withLock {
                _sessionState.value = SessionState.Idle
            }
            modelManager.release()
        }
    }
}