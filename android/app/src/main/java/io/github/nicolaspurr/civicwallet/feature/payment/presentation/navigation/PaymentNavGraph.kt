package io.github.nicolaspurr.civicwallet.feature.payment.presentation.navigation

import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.hilt.lifecycle.viewmodel.compose.hiltViewModel
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.navigation
import io.github.nicolaspurr.civicwallet.feature.payment.presentation.BiometricViewModel
import io.github.nicolaspurr.civicwallet.feature.payment.presentation.PaymentViewModel
import io.github.nicolaspurr.civicwallet.feature.payment.presentation.OverrideViewModel
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
            startDestination = Screen.Scan.route,
            route = Screen.GRAPH_PAYMENT_FLOW
        ) {
            composable(Screen.Scan.route) {
                val biometricViewModel: BiometricViewModel = hiltViewModel()

                ScanScreen(
                    viewModel = biometricViewModel,
                    onNavigateToVerifying = {
                        // Pop the Scan screen so BiometricViewModel instantly clears
                        // and terminates the background camera/ML processing pipeline.
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
                val parentEntry = remember(backStackEntry) {
                    navController.getBackStackEntry(Screen.GRAPH_PAYMENT_FLOW)
                }
                val paymentViewModel: PaymentViewModel = hiltViewModel(parentEntry)

                VerifyingScreen(
                    viewModel = paymentViewModel,
                    onSuccess = {
                        // Pass transaction data down to the route payload dynamically
                        navController.navigate(Screen.Success.createRoute("$42.00 CBDC")) {
                            popUpTo(Screen.Verifying.route) { inclusive = true }
                        }
                    },
                    onFail = {
                        navController.navigate(Screen.Unauthorized.createRoute("cloud")) {
                            popUpTo(Screen.Verifying.route) { inclusive = true }
                        }
                    }
                )
            }

            composable(Screen.Success.route) { backStackEntry ->
                val amount = backStackEntry.arguments?.getString(Screen.Success.ARG_AMOUNT) ?: "$0.00"

                SuccessScreen(
                    amount = amount,
                    onDone = {
                        navController.navigate(Screen.GRAPH_PAYMENT_FLOW) {
                            popUpTo(Screen.GRAPH_PAYMENT_FLOW) { inclusive = true }
                        }
                    }
                )
            }

            composable(Screen.Unauthorized.route) { backStackEntry ->
                val parentEntry = remember(backStackEntry) {
                    navController.getBackStackEntry(Screen.GRAPH_PAYMENT_FLOW)
                }
                val overrideViewModel: OverrideViewModel = hiltViewModel(parentEntry)
                val source = backStackEntry.arguments?.getString(Screen.Unauthorized.ARG_SOURCE) ?: "local"

                UnauthorizedScreen(
                    source = source,
                    viewModel = overrideViewModel,
                    onCancel = {
                        navController.navigate(Screen.GRAPH_PAYMENT_FLOW) {
                            popUpTo(Screen.GRAPH_PAYMENT_FLOW) { inclusive = true }
                        }
                    },
                    onRetrainQueued = {
                        // If admin override passes, loop back to ScanScreen to re-attempt the flow
                        navController.navigate(Screen.Scan.route) {
                            popUpTo(Screen.GRAPH_PAYMENT_FLOW) { inclusive = false }
                        }
                    }
                )
            }
        }
    }
}