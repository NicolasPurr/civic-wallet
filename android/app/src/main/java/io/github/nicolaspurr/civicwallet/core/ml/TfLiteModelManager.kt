package io.github.nicolaspurr.civicwallet.core.ml

import android.content.Context
import io.github.nicolaspurr.civicwallet.core.di.IoDispatcher
import dagger.hilt.android.qualifiers.ApplicationContext
import kotlinx.coroutines.CoroutineDispatcher
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.sync.Mutex
import kotlinx.coroutines.sync.withLock
import kotlinx.coroutines.withContext
import org.tensorflow.lite.Interpreter
import java.io.File
import java.io.FileInputStream
import java.nio.ByteBuffer
import java.nio.channels.FileChannel
import java.util.concurrent.atomic.AtomicInteger
import java.util.concurrent.locks.ReentrantReadWriteLock
import javax.inject.Inject
import javax.inject.Singleton
import kotlin.concurrent.read
import kotlin.concurrent.write

/**
 * Thread-safe TensorFlow Lite interpreter using zero-copy memory mapping.
 *
 * Manages memory allocation, multithreaded execution, dynamic file updates, and safe teardown
 * without native C++ memory access violations.
 *
 * ### Concurrency & Memory Safety Architecture
 * 1. **Native Memory Protection ([rwLock]):** Uses a [ReentrantReadWriteLock] to guard native C++
 *    memory pointers. `runInference` acquires a read lock to allow safe concurrent execution, while
 *    `initialize` and `release` acquire a write lock to prevent teardown while an inference call is
 *    in-flight.
 * 2. **Initialisation Mutex ([initMutex]):** Serialises asynchronous initialisation requests to
 *    prevent concurrent coroutines from loading redundant models.
 * 3. **Reference Counting ([activeClients]):** Uses an [AtomicInteger] to track active callers
 *    holding a reservation. Memory is freed only after the client count reaches zero.
 *
 * @param context Application context used for accessing assets and internal app storage.
 * @param ioDispatcher Coroutine dispatcher reserved for disk I/O model loading.
 */
@Singleton
class TfLiteModelManager @Inject constructor(
    @param:ApplicationContext private val context: Context,
    @param:IoDispatcher private val ioDispatcher: CoroutineDispatcher
) : ModelManager {

    /** Internal mutable state flow holding the model lifecycle status. */
    private val _modelState = MutableStateFlow<ModelState>(ModelState.Loading)

    /** Exposes [modelState] as a read-only stream to UI and domain observers. */
    override val modelState = _modelState.asStateFlow()

    /** Volatile native TensorFlow Lite interpreter instance pointer. */
    @Volatile
    private var interpreter: Interpreter? = null

    /** Guard locking native memory pointers against use-after-free during asynchronous teardown. */
    private val rwLock = ReentrantReadWriteLock()

    /** Mutex serializing concurrent initialisation sequences. */
    private val initMutex = Mutex()

    /** Atomic reference counter tracking active components using the model interpreter. */
    private val activeClients = AtomicInteger(0)

    override suspend fun initialize() {
        // Increment client reservation immediately
        activeClients.incrementAndGet()

        initMutex.withLock {
            if (_modelState.value is ModelState.Ready) return
            _modelState.value = ModelState.Loading

            withContext(ioDispatcher) {
                try {
                    val modelBuffer = loadModelBuffer()
                    val options = Interpreter.Options().apply { setNumThreads(4) }

                    // Acquire write lock to cleanly instantiate the new native pointer
                    rwLock.write {
                        interpreter = Interpreter(modelBuffer, options)
                    }

                    _modelState.value = ModelState.Ready
                } catch (e: Exception) {
                    activeClients.decrementAndGet()
                    _modelState.value = ModelState.Error(e.localizedMessage ?:
                        "Failed to load model.")
                }
            }
        }
    }

    override fun runInference(input: ByteBuffer, output: Array<FloatArray>) {
        // Acquire read lock so release() cannot run mid-inference on another thread
        rwLock.read {
            val currentInterpreter = interpreter
                ?: throw IllegalStateException("Model released or not ready.")
            currentInterpreter.run(input, output)
        }
    }

    override fun release() {
        // Decrement client count. Only release physical resources if no screens are using it.
        val remainingClients = activeClients.decrementAndGet()

        if (remainingClients <= 0) {
            activeClients.set(0) // Prevent negative values in edge cases

            // Acquire write lock to prevent closing the interpreter during active inference
            rwLock.write {
                try {
                    val target = interpreter
                    interpreter = null
                    target?.close()
                } catch (e: Exception) {
                    e.printStackTrace()
                } finally {
                    _modelState.value = ModelState.Loading
                }
            }
        }
    }

    /**
     * Loads the model file into a zero-copy direct read-only [ByteBuffer].
     *
     * Checks internal app storage (`context.filesDir/custom_model.tflite`) first to support dynamic
     * model updates. If absent, falls back to the default bundled APK asset (`model.tflite`).
     *
     * @return Read-only memory-mapped [ByteBuffer] pointing directly to the TFLite model data.
     */
    private fun loadModelBuffer(): ByteBuffer {
        val customModelFile = File(context.filesDir, "custom_model.tflite")
        return if (customModelFile.exists()) {
            FileInputStream(customModelFile).use { inputStream ->
                inputStream.channel.map(
                    FileChannel.MapMode.READ_ONLY,
                    0,
                    customModelFile.length()
                )
            }
        } else {
            context.assets.openFd("model.tflite").use { fileDescriptor ->
                FileInputStream(fileDescriptor.fileDescriptor).use { inputStream ->
                    inputStream.channel.map(
                        FileChannel.MapMode.READ_ONLY,
                        fileDescriptor.startOffset,
                        fileDescriptor.declaredLength
                    )
                }
            }
        }
    }
}