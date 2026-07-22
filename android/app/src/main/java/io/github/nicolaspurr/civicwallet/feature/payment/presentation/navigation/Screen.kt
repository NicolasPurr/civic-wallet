package io.github.nicolaspurr.civicwallet.feature.payment.presentation.navigation

import androidx.navigation.NamedNavArgument
import androidx.navigation.NavBackStackEntry
import androidx.navigation.NavType
import androidx.navigation.navArgument
import java.net.URLEncoder
import java.nio.charset.StandardCharsets

// File-level route parameter key constants
private const val ARG_AMOUNT = "amount"
private const val ARG_SOURCE = "source"

/**
 * Encapsulates type-safe screen destinations and argument contracts for the payment feature.
 *
 * Defines deep-link route templates, navigation argument schemas, and helper methods for encoding
 * route parameters and safely extracting values from [NavBackStackEntry] contexts.
 *
 * @property route The unique string identifier for Navigation Compose.
 * @property arguments List of declared [NamedNavArgument] instances expected by the route.
 */
sealed class Screen(
    val route: String,
    val arguments: List<NamedNavArgument> = emptyList()
) {
    /**
     * Primary landing screen for starting CBDC transactions or triggering payment flows.
     */
    data object Main : Screen("main")
    /**
     * Biometric camera view handling live face tracking and TFLite embedding verification.
     */
    data object Scan : Screen("scan")
    /**
     * Intermediate processing screen orchestrating native ZK-proof generation via MoPro
     * and remote Axum server settlement.
     */
    data object Verifying : Screen("verifying")

    /**
     * Terminal screen displayed following a successful payment settlement.
     *
     * Accepts a dynamic [ARG_AMOUNT] string parameter.
     */
    data object Success : Screen(
        route = "success/{$ARG_AMOUNT}",
        arguments = listOf(
            navArgument(ARG_AMOUNT) { type = NavType.StringType }
        )
    ) {
        private const val ARG_AMOUNT = "amount"

        /**
         * Builds a navigation route string with a URL-encoded payment amount.
         *
         * @param amount The transaction amount string to pass (e.g., "$12.50").
         * @return The formatted route string for [androidx.navigation.NavController.navigate].
         */
        fun createRoute(amount: String): String {
            // URL encode to pass special characters like '$', spaces, or slashes in route path
            val encodedAmount = URLEncoder.encode(amount, StandardCharsets.UTF_8.toString())
            return "success/$encodedAmount"
        }

        /**
         * Extracts and decodes the transaction amount argument from the target backstack entry.
         *
         * @param backStackEntry The current [NavBackStackEntry].
         * @return The extracted amount string, or empty string if not present.
         */
        fun getAmount(backStackEntry: NavBackStackEntry): String {
            return backStackEntry.arguments?.getString(ARG_AMOUNT).orEmpty()
        }
    }

    /**
     * Terminal screen displayed when biometric authentication or proof verification fails.
     *
     * Accepts a dynamic [ARG_SOURCE] string parameter indicating the failure location.
     */
    data object Unauthorized : Screen(
        route = "unauthorized/{$ARG_SOURCE}",
        arguments = listOf(
            navArgument(ARG_SOURCE) { type = NavType.StringType }
        )
    ) {
        private const val ARG_SOURCE = "source"

        /**
         * Builds a navigation route with the specified failure source identifier.
         *
         * @param source Highlighting where the failure occurred (e.g., "local" or "server").
         * @return The formatted route string for [androidx.navigation.NavController.navigate].
         */
        fun createRoute(source: String): String = "unauthorized/$source"

        /**
         * Extracts the failure source argument from the target backstack entry.
         *
         * @param backStackEntry The current [NavBackStackEntry].
         * @return The extracted source string, defaulting to "local" if null.
         */
        fun getSource(backStackEntry: NavBackStackEntry): String {
            return backStackEntry.arguments?.getString(ARG_SOURCE) ?: "local"
        }
    }

    companion object {
        /** Root route identifier for the nested payment navigation sub-graph. */
        const val GRAPH_PAYMENT_FLOW = "payment_flow_graph"
    }
}