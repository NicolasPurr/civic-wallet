package io.github.nicolaspurr.civicwallet

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.ui.Modifier
import androidx.navigation.compose.rememberNavController
import io.github.nicolaspurr.civicwallet.core.theme.SmartWalletTheme
import io.github.nicolaspurr.civicwallet.feature.payment.presentation.navigation.PaymentNavGraph
import dagger.hilt.android.AndroidEntryPoint

/**
 * Primary Activity and entry point for the Civic Wallet application.
 *
 * Annotated with [@AndroidEntryPoint] to enable field injection for Activity-scoped components.
 * Configures edge-to-edge window rendering and initialises the Jetpack Compose UI surface
 * and navigation host.
 */
@AndroidEntryPoint
class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        // Enforces edge-to-edge system window bar insets across modern Android versions
        enableEdgeToEdge()
        super.onCreate(savedInstanceState)

        setContent {
            SmartWalletTheme {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colorScheme.background
                ) {
                    val navController = rememberNavController()
                    PaymentNavGraph(navController = navController)
                }
            }
        }
    }
}