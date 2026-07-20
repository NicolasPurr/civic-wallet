package io.github.nicolaspurr.civicwallet.feature.payment.domain.interactor

import io.github.nicolaspurr.civicwallet.feature.payment.domain.session.PaymentSessionRepository
import io.github.nicolaspurr.civicwallet.feature.payment.domain.session.PaymentSettlementRepository
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flow
import javax.inject.Inject

/**
 * Represents the distinct steps in the remote payment settlement process.
 * * These steps can be mapped directly to UI progress indicators.
 */
enum class SettlementStep {
    /** Preparing the localized transaction details and proof reference. */
    INITIALIZING,

    /** Transmitting the ZK proof payload to the remote ledger or cloud server. */
    SUBMITTING_PROOF,

    /** Waiting for the cloud verifier to validate structural constraints of the proof. */
    VERIFYING_CONSTRAINTS,
}

/**
 * Sealed status representing the states of a payment submission.
 */
sealed interface SettlementStatus {
    /**
     * The settlement is actively processing.
     * @property step The current active [SettlementStep].
     */
    data class Verifying(val step: SettlementStep) : SettlementStatus

    /**
     * The transaction has been successfully verified and settled.
     *
     * @property generationTimeMs Time (in ms) it took the local device to generate the proof.
     * @property serverVerificationTimeMs Time (in ms) it took the Rust backend to verify the proof.
     */
    data class Success(
        val generationTimeMs: Long,
        val serverVerificationTimeMs: Double
    ) : SettlementStatus

    data class Error(val message: String) : SettlementStatus
}

/**
 * Coordinates the transaction settlement pipeline, where a generated proof is read
 * from memory, transmitted to the settlement network, and destroyed.
 */
class PaymentSettlementInteractor @Inject constructor(
    private val paymentSessionRepository: PaymentSessionRepository,
    private val settlementRepository: PaymentSettlementRepository
) {
    /**
     * Executes the payment settlement sequence, emitting progress statuses reactively.
     *
     * This returns a **cold** [Flow]. The sequence of operations (including reading
     * from the memory) does not begin until a collector starts gathering emissions.
     *
     * @return A cold [Flow] streaming the transactional [SettlementStatus].
     */
    fun execute(): Flow<SettlementStatus> = flow {
        // Capture the benchmark timing before session termination clears it
        val generationTimeMs = paymentSessionRepository.generationTimeMs

        // Destructive read of the ZK proof
        val proof = try {
            paymentSessionRepository.consumeProof()
        } catch (e: IllegalStateException) {
            emit(SettlementStatus.Error("ZK proof session is invalid or has already been consumed. $e"))
            return@flow
        }

        try {
            emit(SettlementStatus.Verifying(SettlementStep.INITIALIZING))

            emit(SettlementStatus.Verifying(SettlementStep.SUBMITTING_PROOF))

            // Submits proof and expects the server's verification time on success
            val result = settlementRepository.submitZkProof(proof)

            emit(SettlementStatus.Verifying(SettlementStep.VERIFYING_CONSTRAINTS))

            result.fold(
                onSuccess = { serverTimeMs ->
                    emit(SettlementStatus.Success(generationTimeMs, serverTimeMs))
                },
                onFailure = { error ->
                    emit(SettlementStatus.Error(error.message ?: "Cloud settlement rejected."))
                }
            )
        } finally {
            // Guaranteed session cleanup
            paymentSessionRepository.terminateSession()
        }
    }
}