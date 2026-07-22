package io.github.nicolaspurr.civicwallet.core.di

import androidx.camera.core.ImageAnalysis
import dagger.Binds
import dagger.Module
import dagger.hilt.InstallIn
import dagger.hilt.components.SingletonComponent
import io.github.nicolaspurr.civicwallet.core.hardware.BiometricAuthSink
import io.github.nicolaspurr.civicwallet.core.hardware.BiometricAuthenticator
import io.github.nicolaspurr.civicwallet.core.hardware.BiometricAuthenticatorImpl
import io.github.nicolaspurr.civicwallet.core.hardware.FaceAnalyzer
import javax.inject.Singleton

/**
 * Hilt module binding hardware biometric authentication drivers and frame analysers.
 *
 * Enforces Interface Segregation by binding [BiometricAuthenticatorImpl] to both its read-only
 * consumer stream ([BiometricAuthenticator]) and its write-only frame sink ([BiometricAuthSink]).
 */
@Module
@InstallIn(SingletonComponent::class)
abstract class BiometricModule {

    /** Binds the read-only biometric event stream consumed by domain session orchestrators. */
    @Binds
    @Singleton
    abstract fun bindBiometricAuthenticator(
        impl: BiometricAuthenticatorImpl
    ): BiometricAuthenticator

    /** Binds the write-only confidence injection sink used by hardware frame analysers. */
    @Binds
    @Singleton
    abstract fun bindBiometricAuthSink(
        impl: BiometricAuthenticatorImpl
    ): BiometricAuthSink

    /** Binds the CameraX image frame analyser performing real-time TFLite face processing. */
    @Binds
    @Singleton
    abstract fun bindFaceAnalyzer(
        impl: FaceAnalyzer
    ): ImageAnalysis.Analyzer
}