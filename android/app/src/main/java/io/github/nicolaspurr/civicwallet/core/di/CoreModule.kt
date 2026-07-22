package io.github.nicolaspurr.civicwallet.core.di

import dagger.Binds
import dagger.Module
import dagger.hilt.InstallIn
import dagger.hilt.components.SingletonComponent
import io.github.nicolaspurr.civicwallet.core.ml.ModelManager
import io.github.nicolaspurr.civicwallet.core.ml.TfLiteModelManager
import javax.inject.Singleton

/**
 * Hilt module providing global application infrastructure components.
 */
@Module
@InstallIn(SingletonComponent::class)
abstract class CoreModule {

    /** Binds the TensorFlow Lite neural interpreter manager as a singleton resource. */
    @Binds
    @Singleton
    abstract fun bindModelManager(
        tfLiteModelManager: TfLiteModelManager
    ): ModelManager
}