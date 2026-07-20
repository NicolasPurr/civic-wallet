package io.github.nicolaspurr.civicwallet.feature.payment.domain.session

import kotlinx.coroutines.flow.StateFlow
import java.io.Closeable

/**
 * Defines the lifecycle stages of an active biometric payment session.
 *
 * Use these states to drive UI rendering, loading indicators, and user prompts.
 *
 * ### State Transition Flow
 * | From State | Event | To State |
 * | :--- | :--- | :--- |
 * | [Idle] | `start()` | [Initializing] |
 * | [Initializing] | Model loaded successfully | [Ready] (with `0.0` confidence) |
 * | [Initializing] | Model loading failed | [Error] |
 * | [Ready] | Biometric confidence raw score updates | [Ready] (with updated confidence) |
 * | [Ready] | Confidence reaches threshold | [GeneratingProof] |
 * | [GeneratingProof] | ZK proof computed | [ProofGenerated] |
 * | [GeneratingProof] | Proof pipeline exception | [Error] |
 * | Any State | `stop()` / `reset()` | [Idle] / [Ready] |
 */
sealed interface SessionState {
    /** The session has not been initialized yet, or has been explicitly stopped. */
    data object Idle : SessionState

    /** The underlying machine learning models are being hot-loaded into memory. */
    data object Initializing : SessionState

    /** * The session is active and listening to live biometric data.
     * @param confidence A normalized score representing biometric alignment, ranging from `0.0` to `1.0`.
     */
    data class Ready(val confidence: Float) : SessionState

    /** The biometric threshold was met, and the ZK proof generation pipeline is running. */
    data object GeneratingProof : SessionState

    /** The ZK proof has been generated and cached in local memory. */
    data object ProofGenerated : SessionState

    /**
     * A non-recoverable failure occurred during model setup or proof calculation.
     * @param message A localized human-readable reason for the failure.
     */
    data class Error(val message: String) : SessionState
}

/**
 * Orchestrates the active biometric authentication session and controls ZK proof dispatch.
 *
 * This component ties together hardware inputs and local ML inference, managing state transitions
 * sequentially. It exposes a reactive state stream to observe the session pipeline.
 */
interface BiometricSessionOrchestrator : Closeable {
    /**
     * A thread-safe, hot data stream exposing the active [SessionState].
     * Defaults to [SessionState.Idle] on creation.
     */
    val sessionState: StateFlow<SessionState>

    /**
     * Starts the biometric session. This loads the local ML model into RAM and begins
     * listening to hardware biometric streams.
     *
     * Calling this while a session is already running has no effect.
     */
    fun start()

    /**
     * Resets the biometric confidence state back to baseline without fully releasing
     * the underlying ML model.
     *
     * If the ML model is still cached in memory, this reverts state to [SessionState.Ready] (0.0).
     * If initialization failed or was stopped, it resets back to [SessionState.Idle].
     */
    fun reset()

    /**
     * Tears down the active session. This cancels any running proof generation,
     * stops hardware biometric listeners, and safely unloads the ML model from RAM.
     */
    fun stop()
}