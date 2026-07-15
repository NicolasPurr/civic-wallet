package io.github.nicolaspurr.civicwallet.feature.payment.domain.usecase

import io.github.nicolaspurr.civicwallet.feature.payment.domain.session.PaymentSessionRepository
import io.github.nicolaspurr.civicwallet.feature.payment.domain.session.PaymentSettlementRepository
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flow
import javax.inject.Inject

enum class SettlementStep {
    INITIALIZING,
    SUBMITTING_PROOF,
    VERIFYING_CONSTRAINTS
}

sealed interface SettlementStatus {
    data class Verifying(val step: SettlementStep) : SettlementStatus
    // We pass only the safe metadata back to the UI, never the proof itself
    data class Success(val generationTimeMs: Long) : SettlementStatus
    data class Error(val message: String) : SettlementStatus
}


class SubmitPaymentUseCase @Inject constructor(
    private val paymentSessionRepository: PaymentSessionRepository,
    private val settlementRepository: PaymentSettlementRepository
) {

    fun execute(): Flow<SettlementStatus> = flow {
        val proof = try {
            paymentSessionRepository.extractAndClearProof()
        } catch (e: IllegalStateException) {
            emit(SettlementStatus.Error("Cryptographic proof session is invalid or has already been consumed. $e"))
            return@flow
        }

        val generationTimeMs = paymentSessionRepository.generationTimeMs

        try {
            emit(SettlementStatus.Verifying(SettlementStep.INITIALIZING))

            emit(SettlementStatus.Verifying(SettlementStep.SUBMITTING_PROOF))
            val result = settlementRepository.submitZkProof(proof)

            emit(SettlementStatus.Verifying(SettlementStep.VERIFYING_CONSTRAINTS))

            result.fold(
                onSuccess = { emit(SettlementStatus.Success(generationTimeMs)) },
                onFailure = { error -> emit(SettlementStatus.Error(error.message ?: "Cloud settlement rejected.")) }
            )
        } finally {
            // Clean up our session cache standardly without worrying about physical RAM purging
            paymentSessionRepository.clearSession()
        }
    }
}