package io.github.nicolaspurr.civicwallet

import com.lemonappdev.konsist.api.Konsist
import com.lemonappdev.konsist.api.architecture.Layer
import com.lemonappdev.konsist.api.architecture.KoArchitectureCreator.assertArchitecture
import com.lemonappdev.konsist.api.ext.list.imports
import com.lemonappdev.konsist.api.ext.list.withNameEndingWith
import com.lemonappdev.konsist.api.ext.list.withPackage
import com.lemonappdev.konsist.api.verify.assertTrue
import org.junit.jupiter.api.Test


class ArchitectureTest {

    // Global libraries allowed in every single file across the project
    private val globalAllowedImports = listOf(
        "kotlin.",
        "kotlinx.coroutines.",
        "javax.inject.",
        "dagger.",
        "java.",
        "io.github.nicolaspurr.civicwallet.BuildConfig"
    )

    @Test
    fun `feature layers must strictly adhere to Feature-by-Layer rules`() {
        Konsist.scopeFromProduction()
            .assertArchitecture {
                val core = Layer("Core", "io.github.nicolaspurr.civicwallet.core..")
                val featureData = Layer("FeatureData", "io.github.nicolaspurr.civicwallet.feature..data..")
                val featureDomain = Layer("FeatureDomain", "io.github.nicolaspurr.civicwallet.feature..domain..")
                val featurePresentation = Layer("FeaturePresentation", "io.github.nicolaspurr.civicwallet.feature..presentation..")

                // Define explicit boundaries
                featureDomain.dependsOn(core)
                featureData.dependsOn(featureDomain, core)
                featurePresentation.dependsOn(featureDomain, core)

                // Core is an independent island; it can never import features
                core.dependsOnNothing()
            }
    }

    @Test
    fun `domain layer must ONLY import allowed pure logic packages`() {
        val allowedDomainImports = globalAllowedImports + listOf(
            "io.github.nicolaspurr.civicwallet.feature.", // Peer feature domain imports allowed
            // Core abstract infrastructure interfaces ONLY (No concrete Impl classes allowed)
            "io.github.nicolaspurr.civicwallet.core.zk.ZkProofEngine",
            "io.github.nicolaspurr.civicwallet.core.zk.SecureBuffer",
            "io.github.nicolaspurr.civicwallet.core.ml.ModelManager",
            "io.github.nicolaspurr.civicwallet.core.hardware.CameraRepository",
            "io.github.nicolaspurr.civicwallet.core.hardware.BiometricAuthenticator"
        )

        Konsist.scopeFromProduction()
            .files
            .withPackage("io.github.nicolaspurr.civicwallet.feature..domain..")
            .imports
            .assertTrue { import ->
                allowedDomainImports.any { allowed -> import.name.startsWith(allowed) }
            }
    }

    @Test
    fun `presentation layer must ONLY import UI and domain packages`() {
        val allowedPresentationImports = globalAllowedImports + listOf(
            "android.",       // UI components inherently need platform Android classes
            "androidx.",      // Compose, Lifecycles, Navigation, Activity contracts
            "dagger.hilt.android.",
            "dagger.hilt.components.",
            "io.github.nicolaspurr.civicwallet.core.theme.",
            "io.github.nicolaspurr.civicwallet.feature." // UI can import logic from local domain/presentation
            // NOTE: Presentation CANNOT import feature data, mopro, or raw TF Lite
        )

        Konsist.scopeFromProduction()
            .files
            .withPackage("io.github.nicolaspurr.civicwallet.feature..presentation..")
            .imports
            .assertTrue { import ->
                allowedPresentationImports.any { allowed -> import.name.startsWith(allowed) }
            }
    }

    @Test
    fun `data layer must ONLY import logic interfaces, core systems, and data dependencies`() {
        val allowedDataImports = globalAllowedImports + listOf(
            "android.",
            "androidx.camera.",     // Android hardware permissions/cameras are allowed here
            "androidx.biometric.",
            "io.github.nicolaspurr.civicwallet.core.",
            "io.github.nicolaspurr.civicwallet.feature.",
            "org.tensorflow.lite.", // Machine Learning SDKs
            "mopro."                // Native Rust ZK SDK
        )

        Konsist.scopeFromProduction()
            .files
            .withPackage("io.github.nicolaspurr.civicwallet.feature..data..")
            .imports
            .assertTrue { import ->
                allowedDataImports.any { allowed -> import.name.startsWith(allowed) }
            }
    }

    @Test
    fun `structural hygiene requirements`() {
        Konsist.scopeFromProduction()
            .classes()
            .withNameEndingWith("ViewModel")
            .assertTrue { it.resideInPackage("..presentation..") }

        Konsist.scopeFromProduction()
            .classes()
            .withNameEndingWith("UseCase")
            .assertTrue { it.resideInPackage("..domain.usecase..") }
    }

    @Test
    fun `core layer must NEVER import feature packages`() {
        Konsist.scopeFromProduction()
            .files
            .withPackage("io.github.nicolaspurr.civicwallet.core..")
            .imports
            .assertTrue { import ->
                !import.name.contains(".feature.")
            }
    }
}