package io.github.nicolaspurr.civicwallet.feature.payment.presentation.navigation

import androidx.navigation.NamedNavArgument
import androidx.navigation.NavBackStackEntry
import androidx.navigation.NavType
import androidx.navigation.navArgument
import java.net.URLEncoder
import java.nio.charset.StandardCharsets

// File-level constants are initialised before the classes load
private const val ARG_AMOUNT = "amount"
private const val ARG_SOURCE = "source"

sealed class Screen(
    val route: String,
    val arguments: List<NamedNavArgument> = emptyList()
) {
    data object Main : Screen("main")

    data object Scan : Screen("scan")

    data object Verifying : Screen("verifying")

    data object Success : Screen(
        route = "success/{$ARG_AMOUNT}",
        arguments = listOf(
            navArgument(ARG_AMOUNT) { type = NavType.StringType }
        )
    ) {
        private const val ARG_AMOUNT = "amount"

        fun createRoute(amount: String): String {
            // URL encode to safely pass characters like '$' or spaces in the route string
            val encodedAmount = URLEncoder.encode(amount, StandardCharsets.UTF_8.toString())
            return "success/$encodedAmount"
        }

        // Type-safe argument extractor
        fun getAmount(backStackEntry: NavBackStackEntry): String {
            return backStackEntry.arguments?.getString(ARG_AMOUNT).orEmpty()
        }
    }

    data object Unauthorized : Screen(
        route = "unauthorized/{$ARG_SOURCE}",
        arguments = listOf(
            navArgument(ARG_SOURCE) { type = NavType.StringType }
        )
    ) {
        private const val ARG_SOURCE = "source"

        fun createRoute(source: String): String = "unauthorized/$source"

        // Type-safe argument extractor
        fun getSource(backStackEntry: NavBackStackEntry): String {
            return backStackEntry.arguments?.getString(ARG_SOURCE) ?: "local"
        }
    }

    companion object {
        const val GRAPH_PAYMENT_FLOW = "payment_flow_graph"
    }
}