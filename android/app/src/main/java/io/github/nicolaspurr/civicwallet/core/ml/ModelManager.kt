package io.github.nicolaspurr.civicwallet.core.ml

import kotlinx.coroutines.flow.StateFlow
import java.nio.ByteBuffer

sealed interface ModelState {
    // Upgraded to data objects for clean logger/debugger outputs
    data object Loading : ModelState
    data object Ready : ModelState
    data class Error(val message: String) : ModelState
}

interface ModelManager {
    val modelState: StateFlow<ModelState>
    suspend fun initialize()

    // FIXED: Synchronous execution required for the CameraX hot loop
    fun runInference(input: ByteBuffer, output: Array<FloatArray>)
    fun release()
}