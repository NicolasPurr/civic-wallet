package io.github.nicolaspurr.civicwallet.core.ml

import kotlinx.coroutines.flow.StateFlow
import java.nio.ByteBuffer

/**
 * Represents the discrete lifecycle states of an ML model interpreter in memory.
 */
sealed interface ModelState {

    /** Model is currently being loaded from storage into memory or initialised. */
    data object Loading : ModelState

    /** Model is fully loaded into RAM, initialised, and ready to accept inference calls. */
    data object Ready : ModelState

    /**
     * An error occurred during model loading or initialisation.
     *
     * @property message Descriptive error details explaining the initialisation failure.
     */
    data class Error(val message: String) : ModelState
}

/**
 * Architectural contract defining the lifecycle and execution rules for NN interpreters.
 *
 * Provides a framework-agnostic interface for loading, running, and stopping ML models
 * (e.g., TensorFlow Lite, ONNX Runtime).
 */
interface ModelManager {

    /**
     * Reactive stream emitting the current readiness state ([ModelState]) of the underlying
     * interpreter.
     */
    val modelState: StateFlow<ModelState>

    /**
     * Asynchronously loads and initialises the interpreter instance off the main thread.
     */
    suspend fun initialize()

    /**
     * Synchronously executes neural network inference against the provided input buffer.
     *
     * ### Threading & Hot-Loop Design
     * This function is explicitly synchronous (`fun` instead of `suspend`) to eliminate coroutine
     * context-switching overhead inside the high-frequency CameraX frame analyser loop (~30 FPS).
     * Callers must invoke this function from a dedicated background analysis thread.
     *
     * @param input Direct [ByteBuffer] containing preprocessed input tensor data.
     * @param output Destination array buffer receiving the raw model inference confidence outputs.
     */
    fun runInference(input: ByteBuffer, output: Array<FloatArray>)

    /**
     * Decrements client reservations and frees memory when no active clients remain.
     */
    fun release()
}