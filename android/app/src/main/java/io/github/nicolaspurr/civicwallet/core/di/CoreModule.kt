package io.github.nicolaspurr.civicwallet.core.di

import io.github.nicolaspurr.civicwallet.core.ml.ModelManager
import io.github.nicolaspurr.civicwallet.core.ml.TfLiteModelManager
import dagger.Binds
import dagger.Module
import dagger.hilt.InstallIn
import dagger.hilt.components.SingletonComponent
import javax.inject.Singleton

@Module
@InstallIn(SingletonComponent::class)
abstract class CoreModule {

    @Binds
    @Singleton
    abstract fun bindModelManager(
        tfLiteModelManager: TfLiteModelManager
    ): ModelManager
}