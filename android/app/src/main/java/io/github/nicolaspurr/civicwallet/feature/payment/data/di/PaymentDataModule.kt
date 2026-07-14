package io.github.nicolaspurr.civicwallet.feature.payment.data.di

import io.github.nicolaspurr.civicwallet.feature.payment.data.session.PaymentSessionRepositoryImpl
import io.github.nicolaspurr.civicwallet.feature.payment.data.session.PaymentSettlementRepositoryImpl
import io.github.nicolaspurr.civicwallet.feature.payment.domain.session.PaymentSessionRepository
import io.github.nicolaspurr.civicwallet.feature.payment.domain.session.PaymentSettlementRepository
import dagger.Binds
import dagger.Module
import dagger.hilt.InstallIn
import dagger.hilt.components.SingletonComponent
import javax.inject.Singleton

@Module
@InstallIn(SingletonComponent::class)
abstract class PaymentDataModule {

    @Binds
    @Singleton
    abstract fun bindPaymentSessionRepository(
        impl: PaymentSessionRepositoryImpl
    ): PaymentSessionRepository

    @Binds
    @Singleton
    abstract fun bindPaymentSettlementRepository(
        impl: PaymentSettlementRepositoryImpl
    ): PaymentSettlementRepository
}