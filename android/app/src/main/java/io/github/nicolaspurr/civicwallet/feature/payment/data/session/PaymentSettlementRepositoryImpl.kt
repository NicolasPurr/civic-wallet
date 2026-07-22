package io.github.nicolaspurr.civicwallet.feature.payment.data.session

import android.util.Log
import io.github.nicolaspurr.civicwallet.core.di.IoDispatcher
import io.github.nicolaspurr.civicwallet.feature.payment.domain.session.PaymentSettlementRepository
import kotlinx.coroutines.CoroutineDispatcher
import kotlinx.coroutines.withContext
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.RequestBody.Companion.toRequestBody
import org.json.JSONObject
import javax.inject.Inject
import javax.inject.Singleton

/**
 * Network-backed implementation of [PaymentSettlementRepository] handling remote proof settlement.
 *
 * Serves as the gateway between the Android application and the Rust Axum verification server.
 * Transmits the serialized SnarkJS proof payload over HTTP and parses the resulting verification
 * status and backend performance metrics.
 *
 * ### Threading & Resource Allocation
 * All network calls are context-switched to the injected [ioDispatcher] (`Dispatchers.IO`) to
 * prevent blocking main or CPU-bound computation threads. Connection pools and socket instances
 * are reused across the application via an injected `@Singleton` [OkHttpClient].
 *
 * @param ioDispatcher Coroutine dispatcher reserved for blocking I/O tasks.
 * @param client Shared HTTP client instance for managing network connection lifecycles.
 */
@Singleton
class PaymentSettlementRepositoryImpl @Inject constructor(
    @param:IoDispatcher private val ioDispatcher: CoroutineDispatcher,
    // It is best practice to inject OkHttpClient so connection pools are shared globally
    private val client: OkHttpClient
) : PaymentSettlementRepository {

    /** MIME header specifying UTF-8 encoded JSON body payloads. */
    private val jsonMediaType = "application/json; charset=utf-8".toMediaType()

    override suspend fun submitZkProof(proof: String): Result<Double> = withContext(ioDispatcher) {
        try {
            // 10.0.2.2 routes to the host machine's localhost from the Android emulator
            val serverUrl = "http://10.0.2.2:8080/verify"

            // Construct HTTP request with JSON proof body
            val requestBody = proof.toRequestBody(jsonMediaType)
            val request = Request.Builder()
                .url(serverUrl)
                .post(requestBody)
                .build()

            // Synchronously execute request on the I/O dispatcher.
            // `.use` guarantees automatic resource cleanup and response body closure.
            client.newCall(request).execute().use { response ->
                if (!response.isSuccessful) {
                    return@withContext Result.failure(
                        Exception("Server returned HTTP status code: ${response.code}")
                    )
                }

                val responseBody = response.body.string()
                val jsonResponse = JSONObject(responseBody)

                // Extract the server-side benchmarking metric
                val serverProcessingTimeMs = jsonResponse.optDouble("processing_time_ms", 0.0)

                // Verify cryptographic validity status
                val isValid = jsonResponse.optBoolean("valid", false)
                if (isValid) {
                    Result.success(serverProcessingTimeMs)
                } else {
                    Result.failure(Exception("Cryptographic constraints rejected by verification server."))
                }
            }
        } catch (e: Exception) {
            // Log network connectivity failures or serialization errors
            Log.e("CBDC_NETWORK", "Failed to reach Rust server", e)
            Result.failure(e)
        }
    }
}