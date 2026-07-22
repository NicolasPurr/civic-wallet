package io.github.nicolaspurr.civicwallet.core.hardware

import android.graphics.Bitmap
import android.graphics.Canvas
import android.graphics.Matrix
import android.util.Log
import androidx.camera.core.ImageAnalysis
import androidx.camera.core.ImageProxy
import androidx.core.graphics.createBitmap
import io.github.nicolaspurr.civicwallet.BuildConfig
import io.github.nicolaspurr.civicwallet.core.ml.ModelManager
import org.tensorflow.lite.DataType
import org.tensorflow.lite.support.image.TensorImage
import java.nio.ByteBuffer
import java.nio.ByteOrder
import javax.inject.Inject
import javax.inject.Singleton

/** Input image resolution expected by the TensorFlow Lite facial recognition model. */
const val IMG_SIZE = BuildConfig.IMG_SIZE

/**
 * Flags whether preprocessing uses native C++ TensorImage buffer mapping
 * or falls back to software-based JVM pixel looping.
 */
private const val USE_NATIVE_PREPROCESSING = true

/**
 * CameraX frame analyser that performs real-time facial feature extraction and inference.
 *
 * Captures raw RGBA camera buffers at up to 30 FPS, applies rotation and scaling matrix
 * transformations, executes TensorFlow Lite model inference, and dispatches match confidence
 * scores downstream via [BiometricAuthSink].
 *
 * ### Performance Debt
 * Software matrix transformations and bitmap allocations inside the hot-path analysis loop
 * impose CPU overhead.
 *
 * @param modelManager Neural interpreter runtime managing model initialisation and execution.
 * @param authSink Write-only reactive channel for transmitting real-time inference scores.
 */
@Singleton
class FaceAnalyzer @Inject constructor(
    private val modelManager: ModelManager,
    private val authSink: BiometricAuthSink
) : ImageAnalysis.Analyzer {

    /** Legacy pixel array buffer used during software-based JVM scaling fallback. */
    @Deprecated("Legacy intermediate JVM scaling state. Eliminate when native preprocessing is active.")
    private val intValues = IntArray(IMG_SIZE * IMG_SIZE)

    /** Direct native byte buffer allocated off-heap for zero-copy float tensor inputs. */
    private val manualInputBuffer: ByteBuffer = ByteBuffer.allocateDirect(
        1 * IMG_SIZE * IMG_SIZE * 3 * 4
    ).apply {
        order(ByteOrder.nativeOrder())
    }

    /** Native TensorFlow Lite image container for accelerated memory-mapped tensor conversion. */
    private val nativeTensorImage = TensorImage(DataType.FLOAT32)

    /** Single-element output array buffer receiving the scalar model confidence score (0.0-1.0). */
    private val outputBuffer = Array(1) { FloatArray(1) }

    /** Reusable bitmap buffer holding the raw unscaled frame from CameraX. */
    @Deprecated("Software rendering fallback. Remove once Rust image processing handles raw buffers.")
    private var sourceBitmapBuffer: Bitmap? = null

    /** Pre-allocated destination bitmap matching the exact input dimensions required by TFLite
     * ([IMG_SIZE]x[IMG_SIZE]). */
    private val targetBitmap = createBitmap(IMG_SIZE, IMG_SIZE)

    /** Software canvas targeting [targetBitmap] for executing matrix transformations in-place. */
    private val canvas = Canvas(targetBitmap)

    /** Transformation matrix used to apply hardware rotation offset and spatial scaling. */
    private val transformationMatrix = Matrix()

    /**
     * Called by CameraX for every available frame on the camera background thread.
     *
     * Processes pixel planes, aligns rotation, resizes the input buffer, runs model inference,
     * and guarantees frame buffer release via [ImageProxy.close] in the `finally` block to prevent
     * CameraX pipeline starvation.
     *
     * @param imageProxy The live camera frame container supplied by CameraX.
     */
    override fun analyze(imageProxy: ImageProxy) {
        val planes = imageProxy.planes

        if (planes.isNotEmpty()) {
            try {
                val width = imageProxy.width
                val height = imageProxy.height

                // Allocate or recycle the source bitmap buffer only if camera dimensions change
                var sourceBitmap = sourceBitmapBuffer
                if (sourceBitmap == null ||
                    sourceBitmap.width != width ||
                    sourceBitmap.height != height
                    ) {
                    sourceBitmapBuffer?.recycle()
                    sourceBitmap = createBitmap(width, height)
                    sourceBitmapBuffer = sourceBitmap
                }

                // Copy raw RGBA pixel memory directly from the primary plane buffer
                val pixelBuffer = planes[0].buffer
                pixelBuffer.rewind()
                sourceBitmap.copyPixelsFromBuffer(pixelBuffer)

                val srcW = sourceBitmap.width.toFloat()
                val srcH = sourceBitmap.height.toFloat()
                val rotationDegrees = imageProxy.imageInfo.rotationDegrees

                // Reset matrix and centre origin for rotation
                transformationMatrix.reset()
                transformationMatrix.postTranslate(-srcW / 2f, -srcH / 2f)
                transformationMatrix.postRotate(rotationDegrees.toFloat())

                // Swap coordinate bounds if frame is rotated vertically (90° / 270°)
                val postRotationWidth = if (rotationDegrees % 180 == 0) srcW else srcH
                val postRotationHeight = if (rotationDegrees % 180 == 0) srcH else srcW

                // Scale frame to model input dimensions and recentre
                transformationMatrix.postScale(
                    IMG_SIZE.toFloat() / postRotationWidth,
                    IMG_SIZE.toFloat() / postRotationHeight
                )
                transformationMatrix.postTranslate(IMG_SIZE / 2f, IMG_SIZE / 2f)

                // Render rotated and scaled source frame into targetBitmap
                canvas.drawBitmap(sourceBitmap, transformationMatrix, null)

                val finalInputBuffer: ByteBuffer
                val startTime = System.nanoTime()

                if (USE_NATIVE_PREPROCESSING) {
                    // Native processing: Load target bitmap directly into TFLite TensorImage
                    nativeTensorImage.load(targetBitmap)
                    finalInputBuffer = nativeTensorImage.buffer
                } else {
                    // Fallback JVM path: Sequentially copy ARGB pixels into ByteBuffer
                    targetBitmap.getPixels(
                        intValues,
                        0,
                        targetBitmap.width,
                        0,
                        0,
                        targetBitmap.width,
                        targetBitmap.height
                    )
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

                // Execute neural network inference and extract confidence
                modelManager.runInference(finalInputBuffer, outputBuffer)
                val confidence = outputBuffer[0][0]

                // Push resulting confidence score to the biometric event stream
                authSink.emitConfidence(confidence)

            } catch (e: Exception) {
                Log.e("FaceAnalyzer", "Error during frame analysis", e)
            } finally {
                // CRITICAL: Always release the ImageProxy buffer to unblock CameraX queue
                imageProxy.close()
            }
        } else {
            imageProxy.close()
        }
    }
}