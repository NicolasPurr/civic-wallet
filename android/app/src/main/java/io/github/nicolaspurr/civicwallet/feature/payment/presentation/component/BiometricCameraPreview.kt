package io.github.nicolaspurr.civicwallet.feature.payment.presentation.component

import android.util.Log
import androidx.camera.core.CameraSelector
import androidx.camera.core.ImageAnalysis
import androidx.camera.core.Preview
import androidx.camera.lifecycle.ProcessCameraProvider
import androidx.camera.view.PreviewView
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.runtime.Composable
import androidx.compose.runtime.DisposableEffect
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.remember
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.viewinterop.AndroidView
import androidx.lifecycle.compose.LocalLifecycleOwner
import dagger.hilt.EntryPoint
import dagger.hilt.InstallIn
import dagger.hilt.android.EntryPointAccessors
import dagger.hilt.components.SingletonComponent
import java.util.concurrent.ExecutorService
import javax.inject.Named

/**
 * Dagger/Hilt EntryPoint allowing arbitrary composables and view targets to retrieve
 * dependencies directly from the [SingletonComponent] without constructor injection.
 */
@EntryPoint
@InstallIn(SingletonComponent::class)
interface BiometricCameraEntryPoint {

    /**
     * Provides the frame analyser responsible for processing camera frames for TFLite face matching.
     */
    fun faceAnalyzer(): ImageAnalysis.Analyzer
    // RESOLVED: Pull the pre-allocated global camera executor out of the DI graph

    /**
     * Provides the dedicated single-threaded [ExecutorService] configured specifically
     * for background camera analysis tasks.
     */
    @Named("CameraExecutor") fun cameraExecutor(): ExecutorService
}

/**
 * A Jetpack Compose surface wrapping a CameraX [PreviewView] and configuring real-time
 * frame analysis for facial biometric matching.
 *
 * Manages CameraX pipeline initialisation, lifecycle binding to [LocalLifecycleOwner],
 * and clean-up when unmounted.
 *
 * @param modifier Custom composable layout styling applied to the camera view container.
 */
@Composable
fun BiometricCameraPreview(
    modifier: Modifier = Modifier
) {
    val context = LocalContext.current
    val lifecycleOwner = LocalLifecycleOwner.current
    // Retain a single PreviewView across recompositions
    val previewView = remember { PreviewView(context) }

    // Access Hilt singletons via EntryPointAccessors for non-standard injection target
    val entryPoint = remember(context) {
        EntryPointAccessors.fromApplication(
            context.applicationContext,
            BiometricCameraEntryPoint::class.java
        )
    }

    val analyzer = remember(entryPoint) { entryPoint.faceAnalyzer() }
    val cameraExecutor = remember(entryPoint) { entryPoint.cameraExecutor() }

    // Retrieve ProcessCameraProvider instance synchronously on context initialisation
    val cameraProvider = remember { ProcessCameraProvider.getInstance(context).get() }

    // Bind CameraX use-cases (Preview + ImageAnalysis) whenever analyser or lifecycle changes
    LaunchedEffect(analyzer, cameraExecutor, lifecycleOwner) {
        try {
            // Surface provider setup linking CameraX stream to AndroidView layout
            val preview = Preview.Builder().build().apply {
                surfaceProvider = previewView.surfaceProvider
            }

            // Configure frame analysis pipeline
            val imageAnalysis = ImageAnalysis.Builder()
                // Drop stale frames
                .setBackpressureStrategy(ImageAnalysis.STRATEGY_KEEP_ONLY_LATEST)
                // Use RGBA_8888 byte order expected by TFLite facial embedding extractor
                .setOutputImageFormat(ImageAnalysis.OUTPUT_IMAGE_FORMAT_RGBA_8888)
                .build().apply {
                    setAnalyzer(cameraExecutor, analyzer)
                }

            // Reset camera provider bindings before re-attaching
            cameraProvider.unbindAll()
            cameraProvider.bindToLifecycle(
                lifecycleOwner,
                CameraSelector.DEFAULT_FRONT_CAMERA, // Front camera for facial biometrics
                preview,
                imageAnalysis
            )
        } catch (e: Exception) {
            Log.e("BiometricCameraPreview", "Failed to bind CameraX", e)
        }
    }

    // Explicit clean-up ensuring camera resources are released when composable leaves composition
    DisposableEffect(Unit) {
        onDispose {
            try {
                cameraProvider.unbindAll()
            } catch (e: Exception) {
                Log.e("BiometricCameraPreview", "Error cleaning up CameraX", e)
            }
        }
    }

    // Embed legacy Android View layout into Jetpack Compose UI graph
    AndroidView(
        factory = { previewView },
        modifier = modifier.fillMaxSize()
    )
}
