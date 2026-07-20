package io.github.nicolaspurr.civicwallet.core.hardware

import android.graphics.Bitmap
import android.graphics.Canvas
import android.graphics.Matrix
import android.util.Log
import androidx.camera.core.ImageAnalysis
import androidx.camera.core.ImageProxy
import io.github.nicolaspurr.civicwallet.BuildConfig
import io.github.nicolaspurr.civicwallet.core.ml.ModelManager
import org.tensorflow.lite.DataType
import org.tensorflow.lite.support.image.TensorImage
import java.nio.ByteBuffer
import java.nio.ByteOrder
import javax.inject.Inject
import javax.inject.Singleton
import androidx.core.graphics.createBitmap

const val IMG_SIZE = BuildConfig.IMG_SIZE

private const val USE_NATIVE_PREPROCESSING = true

/**
 * PERFORMANCE DEBT:
 * This implementation contains heavy CPU processing inside the hot-path analysis loop.
 * * TODO: [PERF_NATIVE_MIGRATION_REQUIRED]
 * This entire class will be deprecated. The raw ImageProxy planes will be handed
 * directly to Rust (libmopro.so) via FFI.
 */
@Singleton
class FaceAnalyzer @Inject constructor(
    private val modelManager: ModelManager,
    private val authSink: BiometricAuthSink
) : ImageAnalysis.Analyzer {

    @Deprecated("Legacy intermediate JVM scaling state. Eliminate when native preprocessing is active.")
    private val intValues = IntArray(IMG_SIZE * IMG_SIZE)

    private val manualInputBuffer: ByteBuffer = ByteBuffer.allocateDirect(1 * IMG_SIZE * IMG_SIZE * 3 * 4).apply {
        order(ByteOrder.nativeOrder())
    }

    // TFLite Native Container
    private val nativeTensorImage = TensorImage(DataType.FLOAT32)
    private val outputBuffer = Array(1) { FloatArray(1) }

    @Deprecated("Software rendering fallback. Remove once Rust image processing handles raw buffers.")
    private var sourceBitmapBuffer: Bitmap? = null
    private val targetBitmap = createBitmap(IMG_SIZE, IMG_SIZE)
    private val canvas = Canvas(targetBitmap)
    private val transformationMatrix = Matrix()

    override fun analyze(imageProxy: ImageProxy) {
        val planes = imageProxy.planes

        if (planes.isNotEmpty()) {
            try {
                // TODO: [RUST_FFI_PORT_TARGET]
                // Target pattern:
                // val pointer = planes[0].buffer
                // NativeBridge.preprocessAndRunInference(pointer, imageProxy.width, imageProxy.height, imageProxy.imageInfo.rotationDegrees)

                val width = imageProxy.width
                val height = imageProxy.height

                // Recycle and allocate the source buffer ONLY if frame dimensions physically change
                var sourceBitmap = sourceBitmapBuffer
                if (sourceBitmap == null || sourceBitmap.width != width || sourceBitmap.height != height) {
                    sourceBitmapBuffer?.recycle()
                    sourceBitmap = createBitmap(width, height)
                    sourceBitmapBuffer = sourceBitmap
                }

                // Direct memory copy of raw RGBA pixels without allocations
                val pixelBuffer = planes[0].buffer
                pixelBuffer.rewind()
                sourceBitmap.copyPixelsFromBuffer(pixelBuffer)

                val srcW = sourceBitmap.width.toFloat()
                val srcH = sourceBitmap.height.toFloat()
                val rotationDegrees = imageProxy.imageInfo.rotationDegrees

                /**
                 * CRITICAL PERFORMANCE DEBT: Canvas.drawBitmap & Matrix scaling forces software
                 * manipulation of high-resolution pixel matrices on the CPU 30 times per second.
                 */
                transformationMatrix.reset()
                transformationMatrix.postTranslate(-srcW / 2f, -srcH / 2f)
                transformationMatrix.postRotate(rotationDegrees.toFloat())

                val postRotationWidth = if (rotationDegrees % 180 == 0) srcW else srcH
                val postRotationHeight = if (rotationDegrees % 180 == 0) srcH else srcW

                transformationMatrix.postScale(
                    IMG_SIZE.toFloat() / postRotationWidth,
                    IMG_SIZE.toFloat() / postRotationHeight
                )
                transformationMatrix.postTranslate(IMG_SIZE / 2f, IMG_SIZE / 2f)

                // Draw pre-allocated source onto our targetBitmap in-place
                canvas.drawBitmap(sourceBitmap, transformationMatrix, null)

                val finalInputBuffer: ByteBuffer
                val startTime = System.nanoTime()

                if (USE_NATIVE_PREPROCESSING) {
                    // --- OPTION A: Native C++ Processing (Highly Recommended) ---
                    nativeTensorImage.load(targetBitmap)
                    finalInputBuffer = nativeTensorImage.buffer
                } else {
                    // --- OPTION B: JVM loop fallback ---
                    /**
                     * CRITICAL PERFORMANCE ISSUE:
                     * Sequentially looping over 50,000 values on the JVM heap stalls the thread pool.
                     */
                    targetBitmap.getPixels(intValues, 0, targetBitmap.width, 0, 0, targetBitmap.width, targetBitmap.height)
                    manualInputBuffer.rewind()

                    for (pixelValue in intValues) {
                        manualInputBuffer.putFloat(((pixelValue shr 16) and 0xFF).toFloat())
                        manualInputBuffer.putFloat(((pixelValue shr 8) and 0xFF).toFloat())
                        manualInputBuffer.putFloat((pixelValue and 0xFF).toFloat())
                    }
                    finalInputBuffer = manualInputBuffer
                }

                val durationMs = (System.nanoTime() - startTime) / 1_000_000.0
                Log.d("PerformanceLog", "Preprocessing took: ${String.format("%.3f", durationMs)} ms (Native: $USE_NATIVE_PREPROCESSING)")

                modelManager.runInference(finalInputBuffer, outputBuffer)
                val confidence = outputBuffer[0][0]

                authSink.emitConfidence(confidence)

            } catch (e: Exception) {
                e.printStackTrace()
            } finally {
                imageProxy.close() // ALWAYS release the frame back to CameraX immediately
            }
        } else {
            imageProxy.close()
        }
    }
}