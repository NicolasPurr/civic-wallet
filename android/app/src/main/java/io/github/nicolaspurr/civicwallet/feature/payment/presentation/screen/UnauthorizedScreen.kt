package io.github.nicolaspurr.civicwallet.feature.payment.presentation.screen

import android.widget.Toast
import androidx.biometric.BiometricManager
import androidx.biometric.BiometricPrompt
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.core.content.ContextCompat
import androidx.fragment.app.FragmentActivity
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import io.github.nicolaspurr.civicwallet.feature.payment.presentation.OverrideViewModel
import io.github.nicolaspurr.civicwallet.feature.payment.presentation.OverrideUiState

@Composable
fun UnauthorizedScreen(
    source: String,
    viewModel: OverrideViewModel,
    onCancel: () -> Unit,
    onRetrainQueued: () -> Unit
) {
    val context = LocalContext.current
    val overrideState by viewModel.overrideState.collectAsStateWithLifecycle()
    val isVerifying = overrideState is OverrideUiState.Verifying

    val statusMessage = when (val state = overrideState) {
        is OverrideUiState.Verifying -> "Verifying admin credentials..."
        is OverrideUiState.Error -> state.message
        else -> ""
    }

    // Launch secure system prompts on state change or success hooks
    LaunchedEffect(overrideState) {
        if (overrideState is OverrideUiState.Success) {
            Toast.makeText(context, "Updating local security weights...", Toast.LENGTH_SHORT).show()
            viewModel.resetOverrideState()
            onRetrainQueued()
        }
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background)
            .padding(20.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        Text("⚠️", fontSize = 60.sp, modifier = Modifier.padding(bottom = 10.dp))
        Text(
            text = if (source == "cloud") "Settlement Rejected" else "Access Denied",
            color = MaterialTheme.colorScheme.error,
            fontSize = 28.sp,
            fontWeight = FontWeight.Bold
        )
        Text(
            text = "Biometric profile did not match local weights.",
            color = MaterialTheme.colorScheme.onBackground.copy(alpha = 0.6f),
            textAlign = TextAlign.Center,
            modifier = Modifier.padding(top = 10.dp, bottom = 40.dp)
        )

        Box(
            modifier = Modifier
                .fillMaxWidth()
                .background(MaterialTheme.colorScheme.surface, RoundedCornerShape(15.dp))
                .padding(20.dp),
            contentAlignment = Alignment.Center
        ) {
            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                Text(
                    text = "Are you the account owner?",
                    color = MaterialTheme.colorScheme.onSurface,
                    modifier = Modifier.padding(bottom = 20.dp)
                )

                if (isVerifying) {
                    CircularProgressIndicator(color = MaterialTheme.colorScheme.primary)
                } else {
                    Button(
                        onClick = {
                            // Cast context safely to FragmentActivity to call System UI
                            val activity = context as? FragmentActivity
                            if (activity != null) {
                                showSystemBiometricPrompt(
                                    activity = activity,
                                    onSuccess = { viewModel.onAdminAuthSuccess() },
                                    onFail = { err -> viewModel.onAdminAuthFailed(err) }
                                )
                            } else {
                                viewModel.onAdminAuthFailed("Hardware authentication window unavailable.")
                            }
                        },
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Text("CONFIRM WITH DEVICE SCREEN LOCK", fontWeight = FontWeight.Bold)
                    }

                    Spacer(modifier = Modifier.height(10.dp))

                    TextButton(onClick = onCancel) {
                        Text("CANCEL", color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f))
                    }
                }

                if (statusMessage.isNotEmpty()) {
                    Spacer(modifier = Modifier.height(15.dp))
                    Text(
                        text = statusMessage,
                        color = if (overrideState is OverrideUiState.Error) MaterialTheme.colorScheme.error else MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f),
                        fontSize = 14.sp,
                        textAlign = TextAlign.Center
                    )
                }
            }
        }
    }
}

/**
 * Triggers the system-managed BiometricPrompt window.
 * This launches Android's native secure TEE/SE boundaries.
 */
private fun showSystemBiometricPrompt(
    activity: FragmentActivity,
    onSuccess: () -> Unit,
    onFail: (String) -> Unit
) {
    val executor = ContextCompat.getMainExecutor(activity)

    val biometricPrompt = BiometricPrompt(
        activity,
        executor,
        object : BiometricPrompt.AuthenticationCallback() {
            override fun onAuthenticationSucceeded(result: BiometricPrompt.AuthenticationResult) {
                super.onAuthenticationSucceeded(result)
                onSuccess()
            }

            override fun onAuthenticationError(errorCode: Int, errString: CharSequence) {
                super.onAuthenticationError(errorCode, errString)
                onFail(errString.toString())
            }

            override fun onAuthenticationFailed() {
                super.onAuthenticationFailed()
                onFail("Verification rejected.")
            }
        }
    )

    val promptInfo = BiometricPrompt.PromptInfo.Builder()
        .setTitle("Admin Override Authentication")
        .setSubtitle("Confirm your identity to modify security weights.")
        // Allows user's Lock Screen PIN, pattern, or password as backup to Biometrics
        .setAllowedAuthenticators(BiometricManager.Authenticators.BIOMETRIC_STRONG or BiometricManager.Authenticators.DEVICE_CREDENTIAL)
        .build()

    try {
        biometricPrompt.authenticate(promptInfo)
    } catch (e: Exception) {
        onFail(e.localizedMessage ?: "Hardware interface failed to load.")
    }
}

/* DEPRECATED
@Composable
private fun CustomPseudoSecureNumpad(
    onDigitClick: (Char) -> Unit,
    onBackspaceClick: () -> Unit,
    enabled: Boolean
) {
    val buttonColors = ButtonDefaults.textButtonColors(contentColor = MaterialTheme.colorScheme.onSurface)

    Column(horizontalAlignment = Alignment.CenterHorizontally, verticalArrangement = Arrangement.spacedBy(10.dp)) {
        val pad = listOf(
            listOf('1', '2', '3'),
            listOf('4', '5', '6'),
            listOf('7', '8', '9')
        )

        pad.forEach { row ->
            Row(horizontalArrangement = Arrangement.spacedBy(20.dp)) {
                row.forEach { digit ->
                    TextButton(onClick = { onDigitClick(digit) }, enabled = enabled, colors = buttonColors, modifier = Modifier.size(60.dp)) {
                        Text(digit.toString(), fontSize = 24.sp, fontWeight = FontWeight.Medium)
                    }
                }
            }
        }

        Row(horizontalArrangement = Arrangement.spacedBy(20.dp)) {
            Spacer(modifier = Modifier.size(60.dp))
            TextButton(onClick = { onDigitClick('0') }, enabled = enabled, colors = buttonColors, modifier = Modifier.size(60.dp)) {
                Text("0", fontSize = 24.sp, fontWeight = FontWeight.Medium)
            }
            TextButton(onClick = onBackspaceClick, enabled = enabled, colors = buttonColors, modifier = Modifier.size(60.dp)) {
                Text("⌫", fontSize = 24.sp)
            }
        }
    }
}
 */