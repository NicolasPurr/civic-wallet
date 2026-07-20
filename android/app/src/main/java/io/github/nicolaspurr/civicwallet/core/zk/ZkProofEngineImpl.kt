package io.github.nicolaspurr.civicwallet.core.zk

import io.github.nicolaspurr.civicwallet.core.di.DefaultDispatcher
import kotlinx.coroutines.CoroutineDispatcher
import kotlinx.coroutines.withContext
import uniffi.mopro.ProofLib
import uniffi.mopro.generateCircomProof
import uniffi.mopro.verifyCircomProof
import javax.inject.Inject
import kotlin.system.measureTimeMillis
import android.util.Log

/**
 * Native cryptographic bridge for MoPro zero-knowledge proofs.
 *
 * Injected via CoreModule. Bound to @DefaultDispatcher to ensure heavy FFI
 * execution does not block the main thread or UI orchestrators.
 */
class ZkProofEngineImpl @Inject constructor(
    @param:DefaultDispatcher private val defaultDispatcher: CoroutineDispatcher
) : ZkProofEngine {

    override suspend fun generateProof(confidence: Float): Result<ZkProofResult> = withContext(defaultDispatcher) {
        runCatching {
            // Prepare circuit inputs
            // MoPro expects a JSON string mapping for Circom inputs.
            // We scale the float confidence to an integer for the circuit.
            // THIS WILL NOT BE NEEDEd
            val scaledConfidence = (confidence * 100).toInt()
            val circuitInputsJson = """{"confidence": ["$scaledConfidence"]}"""

            // Define asset paths
            // CRITICAL: Rust cannot read directly from Android APK assets via standard I/O.
            // For this emulator test, use `adb push` to place the .zkey in a readable directory,
            // or copy it from assets to `context.filesDir` on app launch.
            val zkeyPath = "/data/local/tmp/cbdc.zkey"

            var proofResult: uniffi.mopro.CircomProofResult? = null

            // Benchmark proof generation (witness + proving)
            val generationTimeMs = measureTimeMillis {
                proofResult = generateCircomProof(
                    zkeyPath = zkeyPath,
                    circuitInputs = circuitInputsJson,
                    proofLib = ProofLib.ARKWORKS // Use ARKWORKS for emulator compatibility
                )
            }

            requireNotNull(proofResult) { "MoPro returned a null proof result" }

            // Benchmark verification
            val verificationTimeMs = measureTimeMillis {
                val isValid = verifyCircomProof(
                    zkeyPath = zkeyPath,
                    proofResult = proofResult,
                    proofLib = ProofLib.ARKWORKS
                )
                if (!isValid) throw IllegalStateException("Generated proof failed local verification.")
            }

            // Serialize and calculate metrics
            // For the benchmark, we just need the byte size
            val a = proofResult.proof.a
            val b = proofResult.proof.b
            val c = proofResult.proof.c
            val inputs = proofResult.inputs

            // Format to match the Rust server's exact SnarkJsProof & VerifyRequest structs
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

            // TEMP LOG BLOCK
            Log.d("CBDC_BENCHMARK", """
                ====================================
                ZK-SNARK PERFORMANCE METRICS
                Proof Generation Time: ${generationTimeMs}ms
                Local Verification Time: ${verificationTimeMs}ms
                Total Engine Time: ${generationTimeMs + verificationTimeMs}ms
                Proof Size: $proofSize bytes
                ====================================
            """.trimIndent())

            Log.d("CBDC_PAYLOAD", proofJson)

            ZkProofResult(
                proofJson = proofJson,
                proofSizeInBytes = proofSize,
                // UniFFI bundles Witness and Proof generation into a single FFI call
                // To separate these natively, we would need to modify the MoPro Rust
                // scaffolding to return a custom struct containing the split timestamps
                witnessGenTimeMs = 0L,
                proofGenTimeMs = generationTimeMs,
                totalEngineTimeMs = generationTimeMs + verificationTimeMs
            )
        }
    }
}