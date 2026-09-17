package io.github.nicolaspurr.civicwallet.core.zk

import android.content.Context
import android.os.Build
import android.os.PowerManager
import android.util.Log
import dagger.hilt.android.qualifiers.ApplicationContext
import io.github.nicolaspurr.civicwallet.core.di.DefaultDispatcher
import kotlinx.coroutines.CoroutineDispatcher
import kotlinx.coroutines.withContext
import javax.inject.Inject
import kotlin.system.measureTimeMillis

/**
 * Native cryptographic bridge for MoPro zero-knowledge proofs.
 *
 * Injected via CoreModule. Bound to @DefaultDispatcher to ensure heavy FFI
 * execution does not block the main thread or UI orchestrators.
 */
class ZkProofEngineImpl @Inject constructor(
    @ApplicationContext private val context: Context,
    private val zkeyStorageManager: ZkeyStorageManager,
    @param:DefaultDispatcher private val defaultDispatcher: CoroutineDispatcher
) : ZkProofEngine {

    override suspend fun generateProof(circuitInput: CircuitInput): Result<ZkProofResult> =
        withContext(defaultDispatcher) {
            runCatching {
                // Resolved polymorphically from the input object
                val zkeyPath = zkeyStorageManager.getOrExtractZkey(circuitInput.zkeyFilename)
                val circuitInputsJson = circuitInput.toCircomInputsJson()

                // BENCHMARK: Memory & Thermal state before Rust FFI
                val thermalBefore = readThermalStatus()
                val nativeHeapBeforeMb = NativeMemoryTracker.getNativeHeapAllocatedMb()

                // BENCHMARK: generation
                var proofResult: uniffi.mopro.CircomProofResult? = null
                val generationTimeMs = measureTimeMillis {
                    proofResult = uniffi.mopro.generateCircomProof(
                        zkeyPath = zkeyPath,
                        circuitInputs = circuitInputsJson,
                        proofLib = uniffi.mopro.ProofLib.ARKWORKS
                    )
                }
                val proof = requireNotNull(proofResult) { "MoPro returned a null proof result" }

                // BENCHMARK: verification
                var isValid = false
                val verificationTimeMs = measureTimeMillis {
                    isValid = try {
                        uniffi.mopro.verifyCircomProof(
                            zkeyPath = zkeyPath,
                            proofResult = proof,
                            proofLib = uniffi.mopro.ProofLib.ARKWORKS
                        )
                    } catch (e: Exception) {
                        Log.e("ZK_DEBUG", "FFI verifyCircomProof threw", e)
                        false
                    }
                }
                check(isValid) {
                    "Generated proof failed local verification for ${circuitInput.circuit.key}"
                }

                // BENCHMARK: Memory peak & delta
                val nativeHeapAfterMb = NativeMemoryTracker.getNativeHeapAllocatedMb()
                val peakVmHwmMb = NativeMemoryTracker.getMemoryHighWaterMarkMb()
                val thermalAfter = readThermalStatus()

                // Serialise and calculate metrics
                val a = proof.proof.a
                val b = proof.proof.b
                val c = proof.proof.c
                val inputs = proof.inputs

                // JSON formatting: compact affine transmission payload
                val compactJson = buildString {
                    append("{\"proof\":{")
                    append("\"pi_a\":[\"").append(a.x).append("\",\"").append(a.y).append("\"],")
                    append("\"pi_b\":[")
                    append("[\"").append(b.x[0]).append("\",\"").append(b.x[1]).append("\"],")
                    append("[\"").append(b.y[0]).append("\",\"").append(b.y[1]).append("\"]],")
                    append("\"pi_c\":[\"").append(c.x).append("\",\"").append(c.y).append("\"]")
                    append("},")
                    append("\"public_inputs\":[")
                    inputs.forEachIndexed { i, v ->
                        if (i > 0) append(',')
                        append('"').append(v).append('"')
                    }
                    append("]}")
                }

                // JSON formatting: legacy verbose projective format for payload comparison
                val verboseJson = """
                {
                    "proof": {
                        "pi_a": ["${a.x}", "${a.y}", "${a.z}"],
                        "pi_b": [
                            ["${b.x[0]}", "${b.x[1]}"],
                            ["${b.y[0]}", "${b.y[1]}"],
                            ["${b.z[0]}", "${b.z[1]}"]
                        ],
                        "pi_c": ["${c.x}", "${c.y}", "${c.z}"]
                    },
                    "public_inputs": [${inputs.joinToString(",") { "\"$it\"" }}]
                }
                """.trimIndent()

                ZkProofResult(
                    circuitKey = circuitInput.circuit.key,
                    stateDepth = circuitInput.circuit.stateDepth,
                    blacklistDepth = circuitInput.circuit.blacklistDepth,
                    proofJson = compactJson,
                    payloadBytesCompact = compactJson.toByteArray(Charsets.UTF_8).size,
                    payloadBytesVerbose = verboseJson.toByteArray(Charsets.UTF_8).size,
                    publicSignalCount = inputs.size,
                    witnessGenTimeMs = null,
                    proofGenTimeMs = generationTimeMs,
                    verificationTimeMs = verificationTimeMs,
                    totalEngineTimeMs = generationTimeMs + verificationTimeMs,
                    nativeHeapBeforeMb = nativeHeapBeforeMb,
                    nativeHeapAfterMb = nativeHeapAfterMb,
                    nativeHeapDeltaMb = nativeHeapAfterMb - nativeHeapBeforeMb,
                    vmHwmMb = peakVmHwmMb,
                    thermalStatusBefore = thermalBefore,
                    thermalStatusAfter = thermalAfter
                )
            }
        }

    /**
     * Inspects current hardware thermal status via Android PowerManager (API 29+).
     */
    private fun readThermalStatus(): String {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.Q) return "UNSUPPORTED_API"
        val pm = context.getSystemService(Context.POWER_SERVICE) as? PowerManager
        return when (pm?.currentThermalStatus) {
            PowerManager.THERMAL_STATUS_NONE -> "NONE"
            PowerManager.THERMAL_STATUS_LIGHT -> "LIGHT"
            PowerManager.THERMAL_STATUS_MODERATE -> "MODERATE"
            PowerManager.THERMAL_STATUS_SEVERE -> "SEVERE"
            PowerManager.THERMAL_STATUS_CRITICAL -> "CRITICAL"
            PowerManager.THERMAL_STATUS_EMERGENCY -> "EMERGENCY"
            PowerManager.THERMAL_STATUS_SHUTDOWN -> "SHUTDOWN"
            else -> "UNKNOWN"
        }
    }
}