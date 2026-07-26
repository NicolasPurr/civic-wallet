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

    override suspend fun generateProof(circuitInput: ZkCircuitInput): Result<ZkProofResult> =
        withContext(defaultDispatcher) {
            runCatching {
                //val zkeyFile = File(context.filesDir, "cbdc.zkey")
                //if (!zkeyFile.exists()) {
                //  throw FileNotFoundException("Benchmark zkey not found at ${zkeyFile.absolutePath}. Ensure adb push succeeded.")
                //
                //val zkeyPath = zkeyFile.absolutePath

                // Resolved polymorphically from the input object
                val zkeyPath = zkeyStorageManager.getOrExtractZkey(circuitInput.zkeyFilename)
                val circuitInputsJson = circuitInput.toCircomInputsJson()

                // BENCHMARK: Memory & Thermal state before Rust FFI
                val nativeHeapBeforeMb = NativeMemoryTracker.getNativeHeapAllocatedMb()
                val thermalStatusStr = getThermalStatusString()

                var proofResult: uniffi.mopro.CircomProofResult? = null

                // BENCHMARK: generation
                val generationTimeMs = measureTimeMillis {
                    proofResult = uniffi.mopro.generateCircomProof(
                        zkeyPath = zkeyPath,
                        circuitInputs = circuitInputsJson,
                        proofLib = uniffi.mopro.ProofLib.ARKWORKS
                    )
                }

                requireNotNull(proofResult) { "MoPro returned a null proof result" }

                val isValid = try {
                    uniffi.mopro.verifyCircomProof(
                        zkeyPath = zkeyPath,
                        proofResult = proofResult,
                        proofLib = uniffi.mopro.ProofLib.ARKWORKS
                    )
                } catch (e: Exception) {
                    Log.e("ZK_DEBUG", "FFI verifyCircomProof threw an exception!", e)
                    false
                }

                if (!isValid) {
                    throw IllegalStateException("Generated proof failed local verification.")
                }

                // BENCHMARK: verification
                val verificationTimeMs = measureTimeMillis {
                    val isValid = uniffi.mopro.verifyCircomProof(
                        zkeyPath = zkeyPath,
                        proofResult = proofResult,
                        proofLib = uniffi.mopro.ProofLib.ARKWORKS
                    )
                    if (!isValid) throw IllegalStateException(
                        "Generated proof failed local verification."
                    )
                }

                // BENCHMARK: Memory peak & delta
                val nativeHeapAfterMb = NativeMemoryTracker.getNativeHeapAllocatedMb()
                val nativeHeapDeltaMb = nativeHeapAfterMb - nativeHeapBeforeMb
                val peakVmHwmMb = NativeMemoryTracker.getMemoryHighWaterMarkMb()

                // Serialise and calculate metrics
                val a = proofResult.proof.a
                val b = proofResult.proof.b
                val c = proofResult.proof.c
                val inputs = proofResult.inputs

                // JSON formatting
                val proofJson = """
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

                val proofSize = proofJson.toByteArray(Charsets.UTF_8).size

                ZkProofResult(
                    proofJson = proofJson,
                    proofSizeInBytes = proofSize,
                    witnessGenTimeMs = 0L,
                    proofGenTimeMs = generationTimeMs,
                    totalEngineTimeMs = generationTimeMs + verificationTimeMs,
                    nativeHeapBeforeMb = nativeHeapBeforeMb,
                    nativeHeapAfterMb = nativeHeapAfterMb,
                    nativeHeapDeltaMb = nativeHeapDeltaMb,
                    vmHwmMb = peakVmHwmMb,
                    thermalStatus = thermalStatusStr
                )
            }
        }

    /**
     * Inspects current hardware thermal status via Android PowerManager (API 29+).
     */
    private fun getThermalStatusString(): String {
        return if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            val powerManager = context.getSystemService(Context.POWER_SERVICE) as? PowerManager
            when (powerManager?.currentThermalStatus) {
                PowerManager.THERMAL_STATUS_NONE -> "NONE"
                PowerManager.THERMAL_STATUS_LIGHT -> "LIGHT"
                PowerManager.THERMAL_STATUS_MODERATE -> "MODERATE"
                PowerManager.THERMAL_STATUS_SEVERE -> "SEVERE"
                PowerManager.THERMAL_STATUS_CRITICAL -> "CRITICAL"
                PowerManager.THERMAL_STATUS_EMERGENCY -> "EMERGENCY"
                PowerManager.THERMAL_STATUS_SHUTDOWN -> "SHUTDOWN"
                else -> "UNKNOWN"
            }
        } else {
            "UNSUPPORTED_API"
        }
    }
}