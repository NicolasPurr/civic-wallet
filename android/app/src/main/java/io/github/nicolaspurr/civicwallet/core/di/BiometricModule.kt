package io.github.nicolaspurr.civicwallet.core.di

import androidx.camera.core.ImageAnalysis
import io.github.nicolaspurr.civicwallet.core.hardware.BiometricAuthenticatorImpl
import io.github.nicolaspurr.civicwallet.core.hardware.BiometricAuthenticator
import io.github.nicolaspurr.civicwallet.core.hardware.BiometricAuthSink
import io.github.nicolaspurr.civicwallet.core.hardware.FaceAnalyzer
import dagger.Binds
import dagger.Module
import dagger.hilt.InstallIn
import dagger.hilt.components.SingletonComponent
import javax.inject.Singleton

@Module
@InstallIn(SingletonComponent::class)
abstract class BiometricModule {

    @Binds
    @Singleton
    abstract fun bindBiometricAuthenticator(
        impl: BiometricAuthenticatorImpl
    ): BiometricAuthenticator

    @Binds
    @Singleton
    abstract fun bindBiometricAuthSink(
        impl: BiometricAuthenticatorImpl
    ): BiometricAuthSink

    @Binds
    @Singleton
    abstract fun bindFaceAnalyzer(
        impl: FaceAnalyzer
    ): ImageAnalysis.Analyzer
}