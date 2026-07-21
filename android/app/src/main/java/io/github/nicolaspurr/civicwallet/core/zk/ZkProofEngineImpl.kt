package io.github.nicolaspurr.civicwallet.core.zk

import android.content.Context
import io.github.nicolaspurr.civicwallet.core.di.DefaultDispatcher
import kotlinx.coroutines.CoroutineDispatcher
import kotlinx.coroutines.withContext
import uniffi.mopro.ProofLib
import uniffi.mopro.generateCircomProof
import uniffi.mopro.verifyCircomProof
import javax.inject.Inject
import kotlin.system.measureTimeMillis
import android.util.Log
import dagger.hilt.android.qualifiers.ApplicationContext
import java.io.File
import java.io.FileOutputStream
import java.io.InputStream
import java.security.MessageDigest

/**
 * Native cryptographic bridge for MoPro zero-knowledge proofs.
 *
 * Injected via CoreModule. Bound to @DefaultDispatcher to ensure heavy FFI
 * execution does not block the main thread or UI orchestrators.
 */
class ZkProofEngineImpl @Inject constructor(
    @ApplicationContext private val context: Context,
    @param:DefaultDispatcher private val defaultDispatcher: CoroutineDispatcher
) : ZkProofEngine {

    override suspend fun generateProof(confidence: Float): Result<ZkProofResult> =
        withContext(defaultDispatcher) {
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
                //val zkeyPath = "/data/local/tmp/cbdc.zkey"
                val zkeyPath = getOrExtractZkey("cbdc.zkey")

                var proofResult: uniffi.mopro.CircomProofResult? = null

                // Benchmark proof generation (witness + proving)
                val generationTimeMs = measureTimeMillis {
                    proofResult = uniffi.mopro.generateCircomProof(
                        zkeyPath = zkeyPath,
                        circuitInputs = circuitInputsJson,
                        proofLib = uniffi.mopro.ProofLib.ARKWORKS // Use ARKWORKS for emulator compatibility
                    )
                }

                requireNotNull(proofResult) { "MoPro returned a null proof result" }

                // Benchmark verification
                val verificationTimeMs = measureTimeMillis {
                    val isValid = uniffi.mopro.verifyCircomProof(
                        zkeyPath = zkeyPath,
                        proofResult = proofResult,
                        proofLib = uniffi.mopro.ProofLib.ARKWORKS
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
                Log.d(
                    "CBDC_BENCHMARK", """
                ====================================
                ZK-SNARK PERFORMANCE METRICS
                Proof Generation Time: ${generationTimeMs}ms
                Local Verification Time: ${verificationTimeMs}ms
                Total Engine Time: ${generationTimeMs + verificationTimeMs}ms
                Proof Size: $proofSize bytes
                ====================================
            """.trimIndent()
                )

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

    // Helper
    private fun getOrExtractZkey(fileName: String = "cbdc.zkey"): String {
        val targetFile = File(context.filesDir, fileName)

        // Extract key if missing
        if (!targetFile.exists()) {
            Log.d("CBDC_ZKEY", "Target file missing. Extracting $fileName...")
            extractAsset(fileName, targetFile)
            return targetFile.absolutePath
        }

        // Compare SHA-256 hashes using injected `context`
        val assetHash = runCatching {
            context.assets.open(fileName).use { it.sha256() }
        }.getOrNull()

        val fileHash = runCatching {
            targetFile.inputStream().use { it.sha256() }
        }.getOrNull()

        // Overwrite if hashes mismatch or asset can't be read
        if (assetHash == null || assetHash != fileHash) {
            Log.d("CBDC_ZKEY", "ZKey update detected! Asset: $assetHash | Target: $fileHash")
            extractAsset(fileName, targetFile)
        } else {
            Log.d("CBDC_ZKEY", "ZKey is up to date (SHA256: $fileHash)")
        }

        return targetFile.absolutePath
    }

    private fun extractAsset(fileName: String, targetFile: File) {
        if (targetFile.exists()) targetFile.delete()

        context.assets.open(fileName).use { input ->
            FileOutputStream(targetFile).use { output ->
                input.copyTo(output)
                output.flush()
            }
        }
    }

    private fun InputStream.sha256(): String {
        val digest = java.security.MessageDigest.getInstance("SHA-256")
        val buffer = ByteArray(8192)
        var bytesRead: Int
        while (read(buffer).also { bytesRead = it } != -1) {
            digest.update(buffer, 0, bytesRead)
        }
        return digest.digest().joinToString("") { "%02x".format(it) }
    }
}