package io.github.nicolaspurr.civicwallet.feature.payment.presentation.navigation

import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.hilt.lifecycle.viewmodel.compose.hiltViewModel
import androidx.navigation.NavBackStackEntry
import androidx.navigation.NavController
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.navigation
import io.github.nicolaspurr.civicwallet.feature.payment.presentation.BiometricViewModel
import io.github.nicolaspurr.civicwallet.feature.payment.presentation.MainViewModel
import io.github.nicolaspurr.civicwallet.feature.payment.presentation.PaymentViewModel
import io.github.nicolaspurr.civicwallet.feature.payment.presentation.OverrideViewModel
import io.github.nicolaspurr.civicwallet.feature.payment.presentation.screen.MainPaymentScreen
import io.github.nicolaspurr.civicwallet.feature.payment.presentation.screen.ScanScreen
import io.github.nicolaspurr.civicwallet.feature.payment.presentation.screen.SuccessScreen
import io.github.nicolaspurr.civicwallet.feature.payment.presentation.screen.UnauthorizedScreen
import io.github.nicolaspurr.civicwallet.feature.payment.presentation.screen.VerifyingScreen

/**
 * Constructs the Jetpack Compose navigation host for the payment feature graph.
 *
 * Configures route composables, handles backstack popping strategies for terminal states,
 * and manages shared ViewModel scoping across nested destinations.
 *
 * @param navController Root navigation controller instance.
 */
@Composable
fun PaymentNavGraph(navController: NavHostController) {
    NavHost(
        navController = navController,
        startDestination = Screen.GRAPH_PAYMENT_FLOW
    ) {
        // Enclose payment flow destinations within a distinct nested sub-graph
        navigation(
            startDestination = Screen.Main.route,
            route = Screen.GRAPH_PAYMENT_FLOW
        ) {
            // Main Overview Destination
            composable(Screen.Main.route) {
                val mainViewModel: MainViewModel = hiltViewModel()

                MainPaymentScreen(
                    viewModel = mainViewModel,
                    onNavigateToScan = {
                        navController.navigate(Screen.Scan.route)
                    },
                    onNavigateToVerifying = {
                        navController.navigate(Screen.Verifying.route)
                    }
                )
            }

            // Camera Biometric Scan Destination
            composable(Screen.Scan.route) {
                val biometricViewModel: BiometricViewModel = hiltViewModel()

                ScanScreen(
                    viewModel = biometricViewModel,
                    onNavigateToVerifying = {
                        // Pop Scan destination to prevent user returning to camera feed via
                        // hardware back press
                        navController.navigate(Screen.Verifying.route) {
                            popUpTo(Screen.Scan.route) { inclusive = true }
                        }
                    },
                    onNavigateToRecalibrate = {
                        navController.navigate(Screen.Unauthorized.createRoute("local"))
                    }
                )
            }

            // Cryptographic Proof Generation & Verification Destination
            composable(Screen.Verifying.route) { backStackEntry ->
                // Obtain PaymentViewModel scoped to the parent graph to keep state across screens
                val paymentViewModel: PaymentViewModel = backStackEntry.sharedViewModel(
                    navController = navController,
                    parentRoute = Screen.GRAPH_PAYMENT_FLOW
                )

                VerifyingScreen(
                    viewModel = paymentViewModel,
                    onSuccess = { amount ->
                        // Pop Verifying to ensure generation cannot be re-triggered by back press
                        navController.navigate(Screen.Success.createRoute(amount)) {
                            popUpTo(Screen.Verifying.route) { inclusive = true }
                        }
                    },
                    onFail = { source ->
                        navController.navigate(Screen.Unauthorized.createRoute(source)) {
                            popUpTo(Screen.Verifying.route) { inclusive = true }
                        }
                    }
                )
            }

            // Transaction Success Summary Destination
            composable(
                route = Screen.Success.route,
                arguments = Screen.Success.arguments
            ) { backStackEntry ->
                // Type-safe argument extraction from backstack entry
                val amount = Screen.Success.getAmount(backStackEntry)

                SuccessScreen(
                    amount = amount,
                    onDone = {
                        // Clear the entire payment sub-graph from backstack upon completion
                        navController.navigate(Screen.GRAPH_PAYMENT_FLOW) {
                            popUpTo(Screen.GRAPH_PAYMENT_FLOW) { inclusive = true }
                        }
                    }
                )
            }

            // Authorization / Proof Failure Destination
            composable(
                route = Screen.Unauthorized.route,
                arguments = Screen.Unauthorized.arguments
            ) { backStackEntry ->
                val overrideViewModel: OverrideViewModel = backStackEntry.sharedViewModel(
                    navController = navController,
                    parentRoute = Screen.GRAPH_PAYMENT_FLOW
                )
                // Type-safe extraction of failure source
                val source = Screen.Unauthorized.getSource(backStackEntry)

                UnauthorizedScreen(
                    source = source,
                    viewModel = overrideViewModel,
                    onCancel = {
                        // Clear graph backstack on cancellation
                        navController.navigate(Screen.GRAPH_PAYMENT_FLOW) {
                            popUpTo(Screen.GRAPH_PAYMENT_FLOW) { inclusive = true }
                        }
                    },
                    onRetrainQueued = {
                        // Return to scan screen while keeping parent navigation graph active
                        navController.navigate(Screen.Scan.route) {
                            popUpTo(Screen.GRAPH_PAYMENT_FLOW) { inclusive = false }
                        }
                    }
                )
            }
        }
    }
}

/**
 * Extension function on [NavBackStackEntry] to scope a Hilt-injected [androidx.lifecycle.ViewModel]
 * to a parent nested navigation graph rather than the individual destination.
 *
 * Retains state continuity across multiscreen flows without manual lifecycle management.
 *
 * @param VM The target ViewModel type.
 * @param navController The active root navigation controller.
 * @param parentRoute The route key of the parent nested graph.
 * @return A Hilt ViewModel instance scoped to the parent graph's lifecycle.
 */
@Composable
inline fun <reified VM : androidx.lifecycle.ViewModel> NavBackStackEntry.sharedViewModel(
    navController: NavController,
    parentRoute: String
): VM {
    val parentEntry = remember(this) {
        navController.getBackStackEntry(parentRoute)
    }
    return hiltViewModel(parentEntry)
}