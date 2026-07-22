package io.github.nicolaspurr.civicwallet.feature.payment.presentation.screen

import android.widget.Toast
import androidx.biometric.BiometricManager
import androidx.biometric.BiometricPrompt
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Button
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
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
import io.github.nicolaspurr.civicwallet.feature.payment.presentation.OverrideUiState
import io.github.nicolaspurr.civicwallet.feature.payment.presentation.OverrideViewModel

/**
 * Screen presented when an authorisation error or rejection occurs
 * (e.g., cloud settlement rejection or local verification failure).
 *
 * Allows the account owner to perform an admin override using Android's native system biometric
 * or device credential screen lock.
 *
 * @param source String indicating the failure origin (e.g., `"cloud"` for settlement rejection).
 * @param viewModel ViewModel managing admin override state and authentication callbacks.
 * @param onCancel Callback triggered when the user cancels the override process.
 * @param onRetrainQueued Callback invoked when the admin override succeeds and
 * local weight retraining is queued.
 */
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
            text = "No detailed information available.",
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
                        color = if (overrideState is OverrideUiState.Error)
                            MaterialTheme.colorScheme.error
                            else MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f),
                        fontSize = 14.sp,
                        textAlign = TextAlign.Center
                    )
                }
            }
        }
    }
}

/**
 * Displays the system-managed [BiometricPrompt] dialog leveraging Android's TEE/SE security
 * boundaries.
 *
 * Configured to allow both strong biometrics and primary device credentials (PIN/Pattern/Password).
 *
 * @param activity The host [FragmentActivity] required by [BiometricPrompt].
 * @param onSuccess Callback triggered upon successful user authentication.
 * @param onFail Callback triggered when authentication encounters an error or gets rejected.
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
        .setAllowedAuthenticators(BiometricManager.Authenticators.BIOMETRIC_STRONG or
                BiometricManager.Authenticators.DEVICE_CREDENTIAL)
        .build()

    try {
        biometricPrompt.authenticate(promptInfo)
    } catch (e: Exception) {
        onFail(e.localizedMessage ?: "Hardware interface failed to load.")
    }
}