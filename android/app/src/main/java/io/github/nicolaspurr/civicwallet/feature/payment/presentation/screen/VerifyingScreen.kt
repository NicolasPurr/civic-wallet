package io.github.nicolaspurr.civicwallet.feature.payment.presentation.screen

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import io.github.nicolaspurr.civicwallet.feature.payment.presentation.PaymentUiEvent
import io.github.nicolaspurr.civicwallet.feature.payment.presentation.PaymentViewModel
import io.github.nicolaspurr.civicwallet.feature.payment.presentation.PaymentUiState
import androidx.lifecycle.compose.LocalLifecycleOwner
import androidx.lifecycle.compose.collectAsStateWithLifecycle // Modern lifecycle-aware collector
import androidx.lifecycle.flowWithLifecycle
import io.github.nicolaspurr.civicwallet.feature.payment.domain.interactor.SettlementStep

@Composable
fun VerifyingScreen(
    viewModel: PaymentViewModel,
    onSuccess: (amount: String) -> Unit, // Callback accepts parameter
    onFail: (source: String) -> Unit     // Callback accepts parameter
) {
    // Standardized on collectAsStateWithLifecycle to conserve background thread resources
    val uiState by viewModel.uiState.collectAsStateWithLifecycle()
    // FIXED: Safely collect the decoupled metric
    val zkGenerationTime by viewModel.zkGenerationTime.collectAsStateWithLifecycle()
    val isError = uiState is PaymentUiState.Error

    // Trigger the settlement pipeline automatically when entering the screen
    LaunchedEffect(viewModel) {
        viewModel.startSettlement()
    }

    // Lifecycle-aware flow collection for navigation events
    val lifecycleOwner = LocalLifecycleOwner.current
    LaunchedEffect(viewModel.uiEvent, lifecycleOwner) {
        viewModel.uiEvent.flowWithLifecycle(lifecycleOwner.lifecycle).collect { event ->
            when (event) {
                is PaymentUiEvent.NavigateToSuccess -> onSuccess(event.amount)
                is PaymentUiEvent.NavigateToUnauthorized -> onFail(event.source)
            }
        }
    }

    // Purely computational UI state mapping
    val statusText = when (val state = uiState) {
        is PaymentUiState.Verifying -> when (state.step) {
            SettlementStep.INITIALIZING -> "Initializing cryptographic validation..."
            SettlementStep.SUBMITTING_PROOF -> "Submitting Zero-Knowledge Proof..."
            SettlementStep.VERIFYING_CONSTRAINTS -> "Verifying cryptographic witness constraints..."
        }
        is PaymentUiState.Error -> state.message
        is PaymentUiState.Success -> "Proof Verified! Authorizing settlement..."
        else -> ""
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        if (!isError) {
            CircularProgressIndicator(
                color = MaterialTheme.colorScheme.primary,
                modifier = Modifier.size(60.dp),
                strokeWidth = 4.dp
            )
        } else {
            Text("✕", color = MaterialTheme.colorScheme.error, fontSize = 60.sp)
        }

        Spacer(modifier = Modifier.height(20.dp))

        Text(
            text = if (isError) "Verification Rejected" else "Verifying Identity...",
            color = MaterialTheme.colorScheme.onBackground,
            fontSize = 20.sp,
            fontWeight = FontWeight.SemiBold
        )

        Text(
            text = statusText,
            color = if (isError) MaterialTheme.colorScheme.error else MaterialTheme.colorScheme.onBackground.copy(alpha = 0.6f),
            fontSize = 14.sp,
            textAlign = TextAlign.Center,
            modifier = Modifier.padding(horizontal = 40.dp, vertical = 10.dp)
        )

        if (zkGenerationTime > 0L && !isError) {
            Spacer(modifier = Modifier.height(16.dp))
            Text(
                text = "On-Device Proof Generation Time: ${zkGenerationTime}ms",
                color = MaterialTheme.colorScheme.primary.copy(alpha = 0.7f),
                fontSize = 11.sp,
                fontWeight = FontWeight.Bold
            )
        }
    }
}