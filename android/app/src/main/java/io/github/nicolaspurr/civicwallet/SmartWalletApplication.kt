// SmartWalletApplication.kt
package io.github.nicolaspurr.civicwallet

import android.app.Application
import dagger.hilt.android.HiltAndroidApp

/**
 * Root [Application] class for Civic Wallet.
 *
 * Annotated with [@HiltAndroidApp] to trigger Hilt's code generation, initialising the top-level
 * [dagger.hilt.components.SingletonComponent] that manages app-lifetime dependencies
 * (e.g., dispatchers, network clients, neural models, and cryptographic engines).
 */
@HiltAndroidApp
class SmartWalletApplication : Application()