package io.github.nicolaspurr.civicwallet.core.di

import dagger.Binds
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.components.SingletonComponent
import io.github.nicolaspurr.civicwallet.BuildConfig
import io.github.nicolaspurr.civicwallet.core.zk.ZkProofEngine
import io.github.nicolaspurr.civicwallet.core.zk.ZkProofEngineImpl
import java.util.concurrent.ExecutorService
import java.util.concurrent.Executors
import javax.inject.Named
import javax.inject.Singleton

/**
 * Hilt module wiring cryptographic proving engines and hardware execution parameters.
 */
@Module
@InstallIn(SingletonComponent::class)
abstract class WalletModule {

    /** Binds the MoPro native zero-knowledge proof engine implementation. */
    @Binds
    @Singleton
    abstract fun bindZkProofEngine(
        impl: ZkProofEngineImpl
    ): ZkProofEngine

    companion object {

        /**
         * Provides a dedicated single-threaded background executor for CameraX frame analysis.
         *
         * Isolating camera frame processing to a dedicated single thread prevents thread pool
         * contention with CPU-heavy coroutines or UI rendering loops.
         */
        @Provides
        @Singleton
        @Named("CameraExecutor")
        fun provideCameraExecutor(): ExecutorService = Executors.newSingleThreadExecutor()

        /**
         * Provides the normalised biometric confidence target required to trigger automatic proof
         * generation.
         *
         * Reads dynamically from build configuration (`BuildConfig.TRIGGER_THRESHOLD`).
         */
        @Provides
        @Singleton
        @Named("TriggerThreshold")
        fun provideTriggerThreshold(): Float {
            return BuildConfig.TRIGGER_THRESHOLD
        }
    }
}