package io.github.nicolaspurr.civicwallet.core.di

import io.github.nicolaspurr.civicwallet.core.zk.ZkProofEngine
import io.github.nicolaspurr.civicwallet.core.zk.ZkProofEngineImpl
import dagger.Binds
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.components.SingletonComponent
import io.github.nicolaspurr.civicwallet.BuildConfig
import java.util.concurrent.ExecutorService
import java.util.concurrent.Executors
import javax.inject.Named
import javax.inject.Singleton

@Module
@InstallIn(SingletonComponent::class)
abstract class WalletModule {

    @Binds
    @Singleton
    abstract fun bindZkProofEngine(
        impl: ZkProofEngineImpl
    ): ZkProofEngine

    companion object {
        @Provides
        @Singleton
        @Named("CameraExecutor") // Qualified specifically for camera analysis tasks
        fun provideCameraExecutor(): ExecutorService = Executors.newSingleThreadExecutor()

        // Provides configurable match metrics dynamically to testing targets
        @Provides
        @Singleton
        @Named("TriggerThreshold")
        fun provideTriggerThreshold(): Float {
            return BuildConfig.TRIGGER_THRESHOLD
        }
    }
}