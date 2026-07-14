package io.github.nicolaspurr.civicwallet.feature.payment.presentation.navigation

sealed class Screen(val route: String) {
    data object Scan : Screen("scan")
    data object Verifying : Screen("verifying")

    // Dynamic route argument to pass checkout values cleanly to the success screen
    data object Success : Screen("success/{amount}") {
        const val ARG_AMOUNT = "amount"
        fun createRoute(amount: String): String = "success/$amount"
    }

    data object Unauthorized : Screen("unauthorized/{source}") {
        const val ARG_SOURCE = "source"
        fun createRoute(source: String): String = "unauthorized/$source"
    }

    companion object {
        const val GRAPH_PAYMENT_FLOW = "payment_flow_graph"
    }
}