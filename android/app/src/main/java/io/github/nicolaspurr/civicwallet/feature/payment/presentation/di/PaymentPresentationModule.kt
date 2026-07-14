package io.github.nicolaspurr.civicwallet.feature.payment.presentation.di

import io.github.nicolaspurr.civicwallet.feature.payment.domain.session.BiometricSessionOrchestrator
import io.github.nicolaspurr.civicwallet.feature.payment.data.session.BiometricSessionOrchestratorImpl
import dagger.Binds
import dagger.Module
import dagger.hilt.InstallIn
import dagger.hilt.android.components.ViewModelComponent
import dagger.hilt.android.scopes.ViewModelScoped

@Module
@InstallIn(ViewModelComponent::class)
abstract class PaymentPresentationModule {

    @Binds
    @ViewModelScoped
    abstract fun bindBiometricSessionOrchestrator(
        impl: BiometricSessionOrchestratorImpl
    ): BiometricSessionOrchestrator
}