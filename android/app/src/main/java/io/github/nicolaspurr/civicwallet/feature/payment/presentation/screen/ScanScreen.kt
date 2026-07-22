package io.github.nicolaspurr.civicwallet.feature.payment.presentation.screen

import android.Manifest
import android.content.pm.PackageManager
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.core.content.ContextCompat
import androidx.lifecycle.compose.LocalLifecycleOwner
import io.github.nicolaspurr.civicwallet.BuildConfig
import io.github.nicolaspurr.civicwallet.feature.payment.presentation.BiometricUiState
import io.github.nicolaspurr.civicwallet.feature.payment.presentation.BiometricViewModel
import io.github.nicolaspurr.civicwallet.feature.payment.presentation.component.BiometricCameraPreview
import androidx.lifecycle.Lifecycle
import androidx.lifecycle.LifecycleEventObserver
import androidx.compose.runtime.DisposableEffect

/**
 * Composable screen for performing biometric camera scanning and Zero-Knowledge (ZK) proof
 * generation.
 *
 * Handles camera permission requests, lifecycle events (refreshing permissions on resume),
 * state-based navigation, and dynamic UI rendering based on [BiometricViewModel].
 *
 * @param viewModel The [BiometricViewModel] driving the scanning engine state and events.
 * @param onNavigateToVerifying Callback triggered when proof generation succeeds to transition to
 * the verification screen.
 * @param onNavigateToRecalibrate Callback triggered when the user requests model recalibration
 * following a timeout.
 */
@Composable
fun ScanScreen(
    viewModel: BiometricViewModel,
    onNavigateToVerifying: () -> Unit,
    onNavigateToRecalibrate: () -> Unit,
) {
    val context = LocalContext.current
    val uiState by viewModel.uiState.collectAsState()
    val lifecycleOwner = LocalLifecycleOwner.current

    // Pure state-driven navigation based on UI state changes
    LaunchedEffect(uiState) {
        when (uiState) {
            is BiometricUiState.ProofGenerated -> onNavigateToVerifying()
            is BiometricUiState.NavigateToRecalibrate -> onNavigateToRecalibrate()
            else -> Unit // Do nothing for other states
        }
    }

    var hasCameraPermission by remember {
        mutableStateOf(ContextCompat.checkSelfPermission(
            context, Manifest.permission.CAMERA) == PackageManager.PERMISSION_GRANTED
        )
    }

    val permissionLauncher = rememberLauncherForActivityResult(
        contract = ActivityResultContracts.RequestPermission(),
        onResult = { granted -> hasCameraPermission = granted }
    )

    // Observe lifecycle to refresh permission state upon app resume
    DisposableEffect(lifecycleOwner) {
        val observer = LifecycleEventObserver { _, event ->
            if (event == Lifecycle.Event.ON_RESUME) {
                hasCameraPermission =
                    ContextCompat.checkSelfPermission(context, Manifest.permission.CAMERA) ==
                            PackageManager.PERMISSION_GRANTED
            }
        }
        lifecycleOwner.lifecycle.addObserver(observer)

        onDispose {
            lifecycleOwner.lifecycle.removeObserver(observer)
        }
    }

    Column(
        modifier = Modifier.fillMaxSize().background(Color(0xFF0A0A0A)),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.SpaceEvenly
    ) {
        ScanHeader(uiState)

        Box(
            modifier = Modifier
                .size(width = 280.dp, height = 350.dp)
                .background(MaterialTheme.colorScheme.surface, RoundedCornerShape(20.dp)),
            contentAlignment = Alignment.Center
        ) {
            when {
                !hasCameraPermission -> {
                    Text("Camera Access Required", color = MaterialTheme.colorScheme.onSurface)
                }
                uiState is BiometricUiState.Initializing -> {
                    Text("Initializing Engine...", color = MaterialTheme.colorScheme.primary,
                        fontSize = 14.sp, fontWeight = FontWeight.Medium)
                }
                uiState is BiometricUiState.Timeout -> {
                    TimeoutMenu(
                        onRetry = { viewModel.resetState() },
                        onRecalibrate = { viewModel.triggerRecalibrationEvent() }
                    )
                }
                uiState is BiometricUiState.Scanning -> {
                    BiometricCameraPreview()
                }
                uiState is BiometricUiState.GeneratingProof -> {
                    Text("Computing witness...", color =
                        MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f), fontSize = 14.sp)
                }
                uiState is BiometricUiState.Error -> {
                    Text(
                        text = (uiState as BiometricUiState.Error).message,
                        color = MaterialTheme.colorScheme.error,
                        fontSize = 14.sp,
                        textAlign = TextAlign.Center,
                        modifier = Modifier.padding(16.dp)
                    )
                }
            }
        }

        ScanFooter(hasCameraPermission, uiState, onGrantPermission =
            { permissionLauncher.launch(Manifest.permission.CAMERA) })
    }
}

/**
 * Displays the main app title and dynamic status message based on the current [BiometricUiState].
 *
 * @param uiState The active [BiometricUiState] determining the dynamic subtitle text and styling.
 */
@Composable
private fun ScanHeader(uiState: BiometricUiState) {
    Column(horizontalAlignment = Alignment.CenterHorizontally) {
        Text("Civic Wallet", color = Color.White, fontSize = 28.sp, fontWeight = FontWeight.Bold)
        val subtitle = when (uiState) {
            is BiometricUiState.Timeout -> "Scan Failed"
            is BiometricUiState.GeneratingProof -> "Generating Zero-Knowledge Proof..."
            else -> "Align face within the frame"
        }
        Text(subtitle, color = if (uiState is BiometricUiState.Timeout) Color(0xFFFF3333)
            else Color.Gray, fontSize = 16.sp)
    }
}

/**
 * Renders contextual footer controls, such as a camera permission button or confidence metrics.
 *
 * @param hasPermission `true` if camera permission is granted.
 * @param uiState The active [BiometricUiState] providing scan progress and confidence metrics.
 * @param onGrantPermission Callback to invoke system camera permission launcher.
 */
@Composable
private fun ScanFooter(
    hasPermission: Boolean, uiState: BiometricUiState, onGrantPermission: () -> Unit
) {
    if (!hasPermission) {
        Button(onClick = onGrantPermission, colors =
            ButtonDefaults.buttonColors(containerColor = Color(0xFF00FF88))) {
            Text("GRANT PERMISSION", color = Color.Black, fontWeight = FontWeight.Bold)
        }
    } else if (uiState is BiometricUiState.Scanning) {
        val score = uiState.confidence
        Column(horizontalAlignment = Alignment.CenterHorizontally) {
            Text(
                text = "Match Confidence: ${(score * 100).toInt()}%",
                color = if (score > BuildConfig.TRIGGER_THRESHOLD) Color(0xFF00FF88)
                    else Color(0xFFFF3333),
                fontSize = 18.sp,
                fontWeight = FontWeight.Bold,
                modifier = Modifier.padding(bottom = 8.dp)
            )
            Text("SCANNING LIVE...", color = Color(0xFF00FF88), fontWeight = FontWeight.Bold)
        }
    }
}

/**
 * Rendered when biometric verification times out, presenting options to retry the scan
 * or trigger model recalibration.
 *
 * @param onRetry Callback to reset UI state and attempt scanning again.
 * @param onRecalibrate Callback to trigger the model recalibration flow.
 */
@Composable
private fun TimeoutMenu(onRetry: () -> Unit, onRecalibrate: () -> Unit) {
    Column(horizontalAlignment = Alignment.CenterHorizontally, modifier = Modifier.padding(20.dp)) {
        Text("We couldn't verify your identity.", color = Color.White,
            textAlign = TextAlign.Center, modifier = Modifier.padding(bottom = 20.dp))
        Button(onClick = onRetry, colors = ButtonDefaults.buttonColors(
            containerColor = Color(0xFF00FF88))
            , modifier = Modifier.fillMaxWidth().padding(bottom = 10.dp)
        ) {
            Text("RETRY SCAN", color = Color.Black, fontWeight = FontWeight.Bold)
        }
        Button(onClick = onRecalibrate, colors = ButtonDefaults.buttonColors(
            containerColor = Color(0xFFFF8800)), modifier = Modifier.fillMaxWidth()
        ) {
            Text("RECALIBRATE MODEL", color = Color.Black, fontWeight = FontWeight.Bold)
        }
    }
}