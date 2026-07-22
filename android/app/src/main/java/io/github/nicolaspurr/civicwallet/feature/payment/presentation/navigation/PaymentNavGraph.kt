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

@Composable
fun PaymentNavGraph(navController: NavHostController) {
    NavHost(
        navController = navController,
        startDestination = Screen.GRAPH_PAYMENT_FLOW
    ) {
        navigation(
            startDestination = Screen.Main.route,
            route = Screen.GRAPH_PAYMENT_FLOW
        ) {
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

            composable(Screen.Scan.route) {
                val biometricViewModel: BiometricViewModel = hiltViewModel()

                ScanScreen(
                    viewModel = biometricViewModel,
                    onNavigateToVerifying = {
                        navController.navigate(Screen.Verifying.route) {
                            popUpTo(Screen.Scan.route) { inclusive = true }
                        }
                    },
                    onNavigateToRecalibrate = {
                        navController.navigate(Screen.Unauthorized.createRoute("local"))
                    }
                )
            }

            composable(Screen.Verifying.route) { backStackEntry ->
                // Scoping the ViewModel using the helper below
                val paymentViewModel: PaymentViewModel = backStackEntry.sharedViewModel(
                    navController = navController,
                    parentRoute = Screen.GRAPH_PAYMENT_FLOW
                )

                VerifyingScreen(
                    viewModel = paymentViewModel,
                    onSuccess = { amount ->
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

            composable(
                route = Screen.Success.route,
                arguments = Screen.Success.arguments
            ) { backStackEntry ->
                // Type-safe, centralised extraction
                val amount = Screen.Success.getAmount(backStackEntry)

                SuccessScreen(
                    amount = amount,
                    onDone = {
                        navController.navigate(Screen.GRAPH_PAYMENT_FLOW) {
                            popUpTo(Screen.GRAPH_PAYMENT_FLOW) { inclusive = true }
                        }
                    }
                )
            }

            composable(
                route = Screen.Unauthorized.route,
                arguments = Screen.Unauthorized.arguments
            ) { backStackEntry ->
                val overrideViewModel: OverrideViewModel = backStackEntry.sharedViewModel(
                    navController = navController,
                    parentRoute = Screen.GRAPH_PAYMENT_FLOW
                )
                // Type-safe, centralised extraction
                val source = Screen.Unauthorized.getSource(backStackEntry)

                UnauthorizedScreen(
                    source = source,
                    viewModel = overrideViewModel,
                    onCancel = {
                        navController.navigate(Screen.GRAPH_PAYMENT_FLOW) {
                            popUpTo(Screen.GRAPH_PAYMENT_FLOW) { inclusive = true }
                        }
                    },
                    onRetrainQueued = {
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
 * Clean helper extension to scope a Hilt ViewModel to a parent navigation graph safely
 * without cluttering the declarative compose destination block.
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