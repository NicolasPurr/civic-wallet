package io.github.nicolaspurr.civicwallet.core.zk

import io.github.nicolaspurr.civicwallet.core.di.DefaultDispatcher
import kotlinx.coroutines.CoroutineDispatcher
import kotlinx.coroutines.delay
import kotlinx.coroutines.withContext
import javax.inject.Inject
import javax.inject.Singleton
import kotlin.system.measureTimeMillis
import kotlin.time.Duration.Companion.milliseconds
import java.util.Locale

@Singleton
class ZkProofEngineImpl @Inject constructor(
    @param:DefaultDispatcher private val dispatcher: CoroutineDispatcher
) : ZkProofEngine {

    override suspend fun generateProof(confidence: Float): Result<ZkProofResult> = withContext(dispatcher) {
        val clamped = confidence.coerceIn(0f, 1f)

        var witnessTime = 0L
        var provingTime = 0L

        try {
            witnessTime = measureTimeMillis { delay(800L.milliseconds) }
            provingTime = measureTimeMillis { delay(1200L.milliseconds) }

            // Standardize format to 4 decimal places
            val formattedConfidence = String.format(Locale.US, "%.4f", clamped)

            // Pure, legible, standard JSON payload
            val jsonPayload = """
                {
                  "protocol": "groth16",
                  "proof": {
                    "a": ["0x1", "0x2"],
                    "b": [["0x3", "0x4"], ["0x5", "0x6"]],
                    "c": ["0x7", "0x8"]
                  },
                  "inputs": ["$formattedConfidence", "0xCBDC..."]
                }
            """.trimIndent()

            Result.success(
                ZkProofResult(
                    proofJson = jsonPayload,
                    proofSizeInBytes = jsonPayload.toByteArray(Charsets.UTF_8).size,
                    witnessGenTimeMs = witnessTime,
                    proofGenTimeMs = provingTime,
                    totalEngineTimeMs = witnessTime + provingTime
                )
            )
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}