package io.github.nicolaspurr.civicwallet.feature.payment.domain.usecase

import io.github.nicolaspurr.civicwallet.feature.payment.domain.session.PaymentSessionRepository
import io.github.nicolaspurr.civicwallet.feature.payment.domain.session.PaymentSettlementRepository
import io.mockk.coEvery
import io.mockk.mockk
import kotlinx.coroutines.test.runTest
import org.junit.jupiter.api.Test

class SubmitPaymentUseCaseTest {

    private val sessionRepo: PaymentSessionRepository = mockk(relaxed = true)
    private val settlementRepo: PaymentSettlementRepository = mockk()

    // Injected mock dependencies cleanly into our UseCase
    private val useCase = SubmitPaymentUseCase(sessionRepo, settlementRepo)

    @Test
    fun `when submission fails, the raw proof in memory is still zero-filled`() {
        runTest {
            val rawProof = charArrayOf('s', 'e', 'c', 'r', 'e', 't')

            // Stub mock behavior
            coEvery { sessionRepo.extractAndClearProof() } returns rawProof
            coEvery { settlementRepo.submitZkProof(any()) } throws Exception("Network timeout")

            // Wrap the cold flow execution in a try-catch and collect it
            try {
                useCase.execute().collect { /* Discard emissions */ }
            } catch (_: Exception) {
                // Expected exception thrown by our mock settlementRepo
            }

            // Assert that the finally block executed and scrubbed the raw array from the JVM heap
            assert(rawProof.all { it == '\u0000' }) {
                "Security Vulnerability: Raw proof was not zero-filled in memory after execution failure."
            }
        }
    }
}