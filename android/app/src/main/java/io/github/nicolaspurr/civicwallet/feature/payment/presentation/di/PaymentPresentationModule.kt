package io.github.nicolaspurr.civicwallet.feature.payment.presentation.di

import io.github.nicolaspurr.civicwallet.feature.payment.domain.session.BiometricSessionOrchestrator
import io.github.nicolaspurr.civicwallet.feature.payment.data.session.BiometricSessionOrchestratorImpl
import dagger.Binds
import dagger.Module
import dagger.hilt.InstallIn
import dagger.hilt.android.components.ViewModelComponent
import dagger.hilt.android.scopes.ViewModelScoped

/**
 * Hilt Dependency Injection module for the presentation layer of the payment feature.
 *
 * Scoped to [ViewModelComponent] to ensure that bindings declared here live only as long as
 * the associated ViewModel lifecycle, providing clean isolation between active transaction flows.
 */
@Module
@InstallIn(ViewModelComponent::class)
abstract class PaymentPresentationModule {

    /**
     * Binds the thread-safe [BiometricSessionOrchestratorImpl] to its domain interface
     * [BiometricSessionOrchestrator].
     *
     * @param impl The concrete data-layer session coordinator.
     * @return The abstract domain interface exposed to ViewModels and interactors.
     */
    @Binds
    @ViewModelScoped
    abstract fun bindBiometricSessionOrchestrator(
        impl: BiometricSessionOrchestratorImpl
    ): BiometricSessionOrchestrator
}