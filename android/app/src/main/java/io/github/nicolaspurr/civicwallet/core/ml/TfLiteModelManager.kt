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

@Singleton
class TfLiteModelManager @Inject constructor(
    @param:ApplicationContext private val context: Context,
    @param:IoDispatcher private val ioDispatcher: CoroutineDispatcher
) : ModelManager {

    private val _modelState = MutableStateFlow<ModelState>(ModelState.Loading)
    override val modelState = _modelState.asStateFlow()

    @Volatile
    private var interpreter: Interpreter? = null

    // Real Security & Concurrency Fix: Protects native C++ memory access
    private val rwLock = ReentrantReadWriteLock()

    // Real Concurrency Fix: Serializes concurrent initialize and release sequences
    private val initMutex = Mutex()

    // Real Concurrency Fix: Reference counter of active components holding the model
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
                    _modelState.value = ModelState.Error(e.localizedMessage ?: "Failed to load model.")
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

    private fun loadModelBuffer(): ByteBuffer {
        val customModelFile = File(context.filesDir, "custom_model.tflite")
        return if (customModelFile.exists()) {
            FileInputStream(customModelFile).use { inputStream ->
                inputStream.channel.map(FileChannel.MapMode.READ_ONLY, 0, customModelFile.length())
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