package io.github.nicolaspurr.civicwallet.core.zk

import io.github.nicolaspurr.civicwallet.core.di.DefaultDispatcher
import kotlinx.coroutines.CoroutineDispatcher
import kotlinx.coroutines.delay
import kotlinx.coroutines.withContext
import java.util.Arrays
import javax.inject.Inject
import javax.inject.Singleton
import kotlin.system.measureTimeMillis
import kotlin.time.Duration.Companion.milliseconds

@Singleton
class ZkProofEngineImpl @Inject constructor(
    @param:DefaultDispatcher private val dispatcher: CoroutineDispatcher
) : ZkProofEngine {

    private val proofHead = "{\"protocol\":\"groth16\"...".toCharArray()
    private val proofTail = "...\"0xCBDC...\"]}".toCharArray()

    override suspend fun generateProof(confidence: Float): Result<ZkProofResult> = withContext(dispatcher) {
        val confidenceChars = secureFloatToChars(confidence)
        var secureBuffer: CharArray? = null

        var witnessTime = 0L
        var provingTime = 0L

        try {
            // Measure Simulated Witness Generation Time
            witnessTime = measureTimeMillis {
                delay(800L.milliseconds)
            }

            // Measure Simulated Proving Time
            provingTime = measureTimeMillis {
                delay(1200L.milliseconds)
            }

            val totalSize = proofHead.size + confidenceChars.size + proofTail.size
            secureBuffer = CharArray(totalSize)

            var offset = 0
            proofHead.copyInto(secureBuffer, offset)
            offset += proofHead.size
            confidenceChars.copyInto(secureBuffer, offset)
            offset += confidenceChars.size
            proofTail.copyInto(secureBuffer, offset)

            Result.success(
                ZkProofResult(
                    proof = secureBuffer,
                    proofSizeInBytes = totalSize * 2, // 1 Char = 2 Bytes in Kotlin JVM
                    witnessGenTimeMs = witnessTime,
                    proofGenTimeMs = provingTime,
                    totalEngineTimeMs = witnessTime + provingTime
                )
            )
        } catch (e: Exception) {
            secureBuffer?.let { Arrays.fill(it, '\u0000') }
            Result.failure(e)
        } finally {
            Arrays.fill(confidenceChars, '\u0000')
        }
    }

    /**
     * Converts a Float (0.0 to 1.0) into a CharArray WITHOUT allocating a String.
     * Extracts exactly 4 decimal places natively using primitive math.
     */
    private fun secureFloatToChars(value: Float): CharArray {
        val clamped = value.coerceIn(0f, 1f)

        if (clamped == 1f) return charArrayOf('1', '.', '0', '0', '0', '0')
        if (clamped == 0f) return charArrayOf('0', '.', '0', '0', '0', '0')

        // Shift decimal 4 places
        var intVal = (clamped * 10000).toInt()

        val chars = CharArray(6) // Format: "0.xxxx"
        chars[0] = '0'
        chars[1] = '.'

        // Extract digits right-to-left using modulo arithmetic
        // 48 is ASCII for '0'
        chars[5] = (intVal % 10 + 48).toChar(); intVal /= 10
        chars[4] = (intVal % 10 + 48).toChar(); intVal /= 10
        chars[3] = (intVal % 10 + 48).toChar(); intVal /= 10
        chars[2] = (intVal % 10 + 48).toChar()

        return chars
    }
}