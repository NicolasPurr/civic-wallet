package io.github.nicolaspurr.civicwallet.feature.payment.presentation.component

import android.util.Log
import androidx.camera.core.CameraSelector
import androidx.camera.core.ImageAnalysis
import androidx.camera.core.Preview
import androidx.camera.lifecycle.ProcessCameraProvider
import androidx.camera.view.PreviewView
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.remember
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.viewinterop.AndroidView
import androidx.core.content.ContextCompat
import androidx.lifecycle.compose.LocalLifecycleOwner
import dagger.hilt.EntryPoint
import dagger.hilt.InstallIn
import dagger.hilt.android.EntryPointAccessors
import dagger.hilt.components.SingletonComponent
import java.util.concurrent.ExecutorService
import javax.inject.Named

@EntryPoint
@InstallIn(SingletonComponent::class)
interface BiometricCameraEntryPoint {
    fun faceAnalyzer(): ImageAnalysis.Analyzer
    // RESOLVED: Pull the pre-allocated global camera executor out of the DI graph
    @Named("CameraExecutor") fun cameraExecutor(): ExecutorService
}

@Composable
fun BiometricCameraPreview(
    modifier: Modifier = Modifier
) {
    val context = LocalContext.current
    val lifecycleOwner = LocalLifecycleOwner.current
    val previewView = remember { PreviewView(context) }

    // Resolve dependencies directly from the application context entry point
    val entryPoint = remember(context) {
        EntryPointAccessors.fromApplication(
            context.applicationContext,
            BiometricCameraEntryPoint::class.java
        )
    }

    val analyzer = remember(entryPoint) { entryPoint.faceAnalyzer() }
    val cameraExecutor = remember(entryPoint) { entryPoint.cameraExecutor() }

    LaunchedEffect(analyzer, cameraExecutor, lifecycleOwner) {
        val cameraProviderFuture = ProcessCameraProvider.getInstance(context)

        cameraProviderFuture.addListener({
            try {
                val cameraProvider = cameraProviderFuture.get()

                val preview = Preview.Builder().build().apply {
                    surfaceProvider = previewView.surfaceProvider
                }

                val imageAnalysis = ImageAnalysis.Builder()
                    .setBackpressureStrategy(ImageAnalysis.STRATEGY_KEEP_ONLY_LATEST)
                    .setOutputImageFormat(ImageAnalysis.OUTPUT_IMAGE_FORMAT_RGBA_8888)
                    .build().apply {
                        // Passing the DI managed background thread pool directly to CameraX
                        setAnalyzer(cameraExecutor, analyzer)
                    }

                cameraProvider.unbindAll()
                cameraProvider.bindToLifecycle(
                    lifecycleOwner,
                    CameraSelector.DEFAULT_FRONT_CAMERA,
                    preview,
                    imageAnalysis
                )
            } catch (e: Exception) {
                Log.e("BiometricCameraPreview", "Failed to initialize CameraX pipelines", e)
            }
        }, ContextCompat.getMainExecutor(context))
    }

    AndroidView(
        factory = { previewView },
        modifier = modifier.fillMaxSize()
    )
}