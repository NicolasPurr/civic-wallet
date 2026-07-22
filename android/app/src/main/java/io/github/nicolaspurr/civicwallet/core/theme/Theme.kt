package io.github.nicolaspurr.civicwallet.core.theme

import android.app.Activity
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.SideEffect
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalView
import androidx.core.view.WindowCompat

private val DarkColorScheme = darkColorScheme(
    primary = DarkPrimary,
    secondary = DarkSecondary,
    tertiary = DarkTertiary,
    background = DarkBackground,
    surface = DarkSurface,
    error = DarkError,
    onPrimary = Color(0xFF003919),
    onBackground = Color(0xFFE2E3DE),
    onSurface = Color(0xFFE2E3DE)
)

private val LightColorScheme = lightColorScheme(
    primary = LightPrimary,
    secondary = LightSecondary,
    tertiary = LightTertiary,
    background = LightBackground,
    surface = LightSurface,
    error = LightError,
    onPrimary = Color(0xFFFFFFFF),
    onBackground = Color(0xFF191C19),
    onSurface = Color(0xFF191C19)
)

/**
 * Root Material3 theme wrapper for Civic Wallet.
 *
 * Configures application-wide colour schemes, typography styles, and automatically synchronises
 * Android system bar icon contrast (`isAppearanceLightStatusBars`) with the active theme mode.
 *
 * @param darkTheme Controls whether [DarkColorScheme] or [LightColorScheme] is applied.
 * Defaults to `true`.
 * @param content Composable slot hierarchy wrapped by this theme layout.
 */
@Composable
fun SmartWalletTheme(
    darkTheme: Boolean = true, // Defaulting to true guarantees dark cyber styling out of the box
    content: @Composable () -> Unit
) {
    val colorScheme = if (darkTheme) DarkColorScheme else LightColorScheme
    val view = LocalView.current

    // Synchronise Android system bars with theme colours and contrast rules
    if (!view.isInEditMode) {
        SideEffect {
            val window = (view.context as? Activity)?.window
            if (window != null) {
                val windowInsetsController = WindowCompat.getInsetsController(window, view)
                windowInsetsController.isAppearanceLightStatusBars = !darkTheme
                windowInsetsController.isAppearanceLightNavigationBars = !darkTheme
            }
        }
    }

    MaterialTheme(
        colorScheme = colorScheme,
        typography = Typography,
        content = content
    )
}