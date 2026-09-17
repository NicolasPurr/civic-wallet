package io.github.nicolaspurr.civicwallet

import android.os.Bundle
import android.util.Log
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.ui.Modifier
import androidx.navigation.compose.rememberNavController
import dagger.hilt.android.AndroidEntryPoint
import io.github.nicolaspurr.civicwallet.core.theme.SmartWalletTheme
import io.github.nicolaspurr.civicwallet.core.zk.CircuitType
import io.github.nicolaspurr.civicwallet.core.zk.CircuitInput
import io.github.nicolaspurr.civicwallet.core.zk.CircuitInputFactory
import io.github.nicolaspurr.civicwallet.core.zk.ZkFixtureLoader
import io.github.nicolaspurr.civicwallet.feature.payment.presentation.navigation.PaymentNavGraph
import javax.inject.Inject

/**
 * Primary Activity and entry point for the Civic Wallet application.
 */
@AndroidEntryPoint
class MainActivity : ComponentActivity() {

    @Inject
    lateinit var fixtureLoader: ZkFixtureLoader

    override fun onCreate(savedInstanceState: Bundle?) {
        enableEdgeToEdge()
        super.onCreate(savedInstanceState)

        val isBenchmarkMode = intent?.getBooleanExtra("benchmark_mode", false) ?: false
        val circuitKey = intent?.getStringExtra("target_circuit")

        val circuitInput = resolveCircuitInput(circuitKey, isBenchmarkMode)

        if (circuitInput == null) {
            Log.e(TAG, "Aborting: could not resolve circuit input for key='$circuitKey'")
            finishAndRemoveTask()
            return
        }

        setContent {
            SmartWalletTheme {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colorScheme.background
                ) {
                    val navController = rememberNavController()
                    PaymentNavGraph(
                        navController = navController,
                        circuitInput = circuitInput,
                        isBenchmarkMode = isBenchmarkMode,
                        onBenchmarkComplete = { finishAndRemoveTask() }
                    )
                }
            }
        }
    }

    /**
     * Determines the circuit variant and build an input vector.
     *
     * Reading the vector from `assets` is synchronous. The file has up to a few kilobytes and
     * is performed once before any benchmark. It does count into t_client or t_gen. The conversion
     * of the key is costly and so it is performed lazily in `ZkeyStoreageManager` inside
     * `ZkProofEngineImpl`.
     *
     * @return `null` if the variaant or vector could not be resolved.
     */
    private fun resolveCircuitInput(
        circuitKey: String?,
        isBenchmarkMode: Boolean
    ): CircuitInput? {
        val type = try {
            if (circuitKey.isNullOrBlank()) {
                // No indication of the target circuit is only allowed in interactive mode.
                require(!isBenchmarkMode) {
                    "benchmark_mode requires an explicit --es target_circuit argument"
                }
                DEFAULT_INTERACTIVE_CIRCUIT
            } else {
                CircuitType.fromKey(circuitKey)
            }
        } catch (e: IllegalArgumentException) {
            Log.e(TAG, "Circuit resolution failed", e)
            return null
        }

        return try {
            CircuitInputFactory.fromFixture(
                type = type,
                fixture = fixtureLoader.load(type)
            )
        } catch (e: Exception) {
            Log.e(TAG, "Fixture load failed for ${type.key}", e)
            null
        }
    }

    private companion object {
        const val TAG = "CivicWallet"

        /** Variant used when manually running the app from the launcher. */
        val DEFAULT_INTERACTIVE_CIRCUIT = CircuitType.STANDARD_NATION
    }
}