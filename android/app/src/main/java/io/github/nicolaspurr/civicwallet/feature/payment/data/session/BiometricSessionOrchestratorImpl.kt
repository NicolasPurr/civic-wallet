package io.github.nicolaspurr.civicwallet.feature.payment.data.session

import io.github.nicolaspurr.civicwallet.core.di.DefaultDispatcher
import io.github.nicolaspurr.civicwallet.core.hardware.BiometricAuthenticator
import io.github.nicolaspurr.civicwallet.core.ml.ModelManager
import io.github.nicolaspurr.civicwallet.core.ml.ModelState
import io.github.nicolaspurr.civicwallet.core.zk.ZkProofEngine
import io.github.nicolaspurr.civicwallet.feature.payment.domain.session.BiometricSessionOrchestrator
import io.github.nicolaspurr.civicwallet.feature.payment.domain.session.SessionState
import io.github.nicolaspurr.civicwallet.feature.payment.domain.session.PaymentSessionRepository
import kotlinx.coroutines.CoroutineDispatcher
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Job
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.cancel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import kotlinx.coroutines.sync.Mutex
import kotlinx.coroutines.sync.withLock
import java.io.Closeable
import javax.inject.Inject
import javax.inject.Named

/**
 * Implementation of [BiometricSessionOrchestrator] coordinating ML and biometrics.
 *
 * ### Concurrency Architecture
 * Since biometric data updates frequently from a sensor background thread and ML states can mutate
 * asynchronously, this class uses [Mutex] serialisation ([stateMutex]) to guard its internal
 * variables.
 *
 * All asynchronous workloads are executed within a custom [orchestratorScope] isolated to the
 * passed [defaultDispatcher] (ideally `Dispatchers.Default` for CPU-heavy tasks).
 *
 * This class implements [Closeable] to prevent resource leaks when the orchestrator is cleared by
 * the dependency injection container or lifecycle owner.
 *
 * @param modelManager Handles RAM loading/unloading of the ML interpreter model.
 * @param authenticator Stream adapter bridging system biometric sensors.
 * @param zkProofEngine The execution pipeline for generating the ZK proof.
 * @param defaultDispatcher Coroutine dispatcher designed to absorb CPU-heavy calculations.
 * @param triggerThreshold The confidence target (0.0-1.0) required for proof generation.
 */
class BiometricSessionOrchestratorImpl @Inject constructor(
    private val modelManager: ModelManager,
    private val authenticator: BiometricAuthenticator,
    private val zkProofEngine: ZkProofEngine,
    private val paymentSessionRepository: PaymentSessionRepository,
    @param:DefaultDispatcher private val defaultDispatcher: CoroutineDispatcher,
    @param:Named("TriggerThreshold") private val triggerThreshold: Float
) : BiometricSessionOrchestrator, Closeable {

    private val _sessionState = MutableStateFlow<SessionState>(SessionState.Idle)
    override val sessionState: StateFlow<SessionState> = _sessionState.asStateFlow()

    /** Root coroutine scope bound to the life of the orchestrator instance. */
    private val orchestratorScope = CoroutineScope(SupervisorJob() + defaultDispatcher)

    /** References the single active running session job; cancelled on [stop] or [reset]. */
    private var activeJob: Job? = null

    /** Locks state updates to prevent race conditions from rapid biometric data streams. */
    private val stateMutex = Mutex()

    /** Manages physical RAM interpreter loading state. */
    private var isModelReady = false

    override fun start() {
        if (activeJob?.isActive == true) return

        activeJob = orchestratorScope.launch {
            _sessionState.value = SessionState.Initializing

            // Acquire the state mutex during initialisation to prevent race conditions with
            // asynchronous model releases called via stop().
            stateMutex.withLock {
                modelManager.initialize()
            }

            // Sub-job A: Monitor ML model state transitions
            launch {
                modelManager.modelState.collect { state ->
                    stateMutex.withLock {
                        when (state) {
                            is ModelState.Loading -> {
                                isModelReady = false // Hardened state safety
                                _sessionState.value = SessionState.Initializing
                            }
                            is ModelState.Ready -> {
                                isModelReady = true
                                _sessionState.value = SessionState.Ready(0f)
                            }
                            is ModelState.Error -> {
                                isModelReady = false // Hardened state safety
                                _sessionState.value = SessionState.Error("Model Init Failed: " +
                                        state.message
                                )
                            }
                        }
                    }
                }
            }

            // Sub-job B: Monitor live biometric confidence signals
            launch {
                authenticator.confidenceFlow.collect { rawScore ->
                    stateMutex.withLock {
                        val currentState = _sessionState.value
                        if (currentState is SessionState.Ready) {
                            val clampedScore = rawScore.coerceIn(0f, 1f)

                            if (clampedScore >= triggerThreshold) {
                                _sessionState.value = SessionState.GeneratingProof
                                // Launching within Sub-job B's child scope guarantees that
                                // cancelling [activeJob] will cancel the proof pipeline.
                                launch {
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

    /**
     * Executes the ZK computation pipeline asynchronously.
     */
    private suspend fun executeProofPipeline(confidence: Float) {
        zkProofEngine.generateProof(confidence)
            .onSuccess { proofResult ->
                paymentSessionRepository.storeResult(proofResult)
                stateMutex.withLock {
                    _sessionState.value = SessionState.ProofGenerated
                }
            }
            .onFailure { error ->
                stateMutex.withLock {
                    _sessionState.value = SessionState.Error(
                        error.localizedMessage ?: "Failed proof generation."
                    )
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
            // Running release inside the lock ensures sequential thread-safety
            stateMutex.withLock {
                isModelReady = false
                _sessionState.value = SessionState.Idle
                modelManager.release()
            }
        }
    }

    /**
     * Cleanly shuts down the orchestrator, cancels all ongoing calculations, and terminates
     * the root coroutine scope to eliminate potential memory and thread leaks.
     */
    override fun close() {
        stop()
        orchestratorScope.cancel()
    }
}