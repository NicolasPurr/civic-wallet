package io.github.nicolaspurr.civicwallet.feature.payment.data.di

import io.github.nicolaspurr.civicwallet.feature.payment.data.session.PaymentSessionRepositoryImpl
import io.github.nicolaspurr.civicwallet.feature.payment.data.session.FakePaymentSettlementRepository
import io.github.nicolaspurr.civicwallet.feature.payment.domain.session.PaymentSessionRepository
import io.github.nicolaspurr.civicwallet.feature.payment.domain.session.PaymentSettlementRepository
import dagger.Binds
import dagger.Module
import dagger.hilt.InstallIn
import dagger.hilt.components.SingletonComponent
import javax.inject.Singleton

/**
 * Dependency injection module responsible for wiring the payment feature's data layer.
 *
 * This module binds domain-level repository interfaces to their concrete data implementations.
 * Since it is installed in the [SingletonComponent], all bound dependencies are treated as
 * application-wide singletons and will persist in memory for the entire app lifecycle.
 */
@Module
@InstallIn(SingletonComponent::class)
abstract class PaymentDataModule {

    /**
     * Binds the thread-safe, in-memory payment session repository implementation.
     *
     * @param impl The concrete [PaymentSessionRepositoryImpl] memory container.
     * @return The bound [PaymentSessionRepository] abstraction.
     */
    @Binds
    @Singleton
    abstract fun bindPaymentSessionRepository(
        impl: PaymentSessionRepositoryImpl
    ): PaymentSessionRepository

    /**
     * Binds the settlement repository implementation.
     *
     * **Important:** This currently binds [FakePaymentSettlementRepository], which simulates
     * network delays and returns mocked success results. Ensure this is swapped out for a
     * production-ready client before production.
     *
     * @param impl The simulated [FakePaymentSettlementRepository] instance.
     * @return The bound [PaymentSettlementRepository] abstraction.
     */
    @Binds
    @Singleton
    abstract fun bindPaymentSettlementRepository(
        impl: FakePaymentSettlementRepository
    ): PaymentSettlementRepository
}