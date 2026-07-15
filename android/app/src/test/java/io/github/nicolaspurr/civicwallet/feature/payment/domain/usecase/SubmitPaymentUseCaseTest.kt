package io.github.nicolaspurr.civicwallet.feature.payment.domain.usecase

import io.github.nicolaspurr.civicwallet.core.zk.SecureBuffer
import io.github.nicolaspurr.civicwallet.feature.payment.domain.session.PaymentSessionRepository
import io.github.nicolaspurr.civicwallet.feature.payment.domain.session.PaymentSettlementRepository
import io.mockk.coEvery
import io.mockk.mockk
import kotlinx.coroutines.test.runTest
import org.junit.jupiter.api.Assertions.assertTrue
import org.junit.jupiter.api.Test

class SubmitPaymentUseCaseTest {

    private val sessionRepo: PaymentSessionRepository = mockk(relaxed = true)
    private val settlementRepo: PaymentSettlementRepository = mockk()

    // Injected mock dependencies cleanly into our UseCase
    private val useCase = SubmitPaymentUseCase(sessionRepo, settlementRepo)

    @Test
    fun `when submission fails, the raw proof in memory is still zero-filled`() = runTest {
        // RESOLVED: Allocate an actual secure off-heap memory buffer block for the test pipeline
        val secureProofBuffer = SecureBuffer.allocate(6).apply {
            "secret".map { it.code.toByte() }.forEach { appendByte(it) }
        }

        // Stub mock behavior to match our new SecureBuffer contract signatures
        coEvery { sessionRepo.extractAndClearProof() } returns secureProofBuffer
        coEvery { settlementRepo.submitZkProof(any()) } throws Exception("Network timeout")

        // Wrap the cold flow execution in a try-catch and collect it
        try {
            useCase.execute().collect { /* Discard emissions */ }
        } catch (_: Exception) {
            // Expected exception thrown by our mock settlementRepo
        }

        // RESOLVED: Assert that the finally block executed and completely zero-filled the native memory space
        assertTrue(secureProofBuffer.isCleared()) {
            "Security Vulnerability: Off-heap secure memory was not zeroed out after execution failure."
        }
    }
}