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

@Singleton
class PaymentSettlementRepositoryImpl @Inject constructor(
    @param:IoDispatcher private val ioDispatcher: CoroutineDispatcher,
    // It is best practice to inject OkHttpClient so connection pools are shared globally
    private val client: OkHttpClient
) : PaymentSettlementRepository {

    private val jsonMediaType = "application/json; charset=utf-8".toMediaType()

    override suspend fun submitZkProof(proof: String): Result<Double> = withContext(ioDispatcher) {
        try {
            // 10.0.2.2 routes to the host machine's localhost from the Android emulator
            val serverUrl = "http://10.0.2.2:8080/verify"

            val requestBody = proof.toRequestBody(jsonMediaType)
            val request = Request.Builder()
                .url(serverUrl)
                .post(requestBody)
                .build()

            client.newCall(request).execute().use { response ->
                if (!response.isSuccessful) {
                    return@withContext Result.failure(
                        Exception("Server returned HTTP status code: ${response.code}")
                    )
                }

                val responseBody = response.body.string()
                val jsonResponse = JSONObject(responseBody)

                val isValid = jsonResponse.optBoolean("valid", false)
                // Extract the server-side benchmarking metric
                val serverProcessingTimeMs = jsonResponse.optDouble("processing_time_ms", 0.0)

                if (isValid) {
                    Result.success(serverProcessingTimeMs)
                } else {
                    Result.failure(Exception("Cryptographic constraints rejected by verification server."))
                }
            }
        } catch (e: Exception) {
            Log.e("CBDC_NETWORK", "Failed to reach Rust server", e)
            Result.failure(e)
        }
    }
}