package io.github.nicolaspurr.civicwallet.core.ml

import android.content.Context
import io.github.nicolaspurr.civicwallet.core.di.IoDispatcher
import dagger.hilt.android.qualifiers.ApplicationContext
import kotlinx.coroutines.CoroutineDispatcher
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.withContext
import org.tensorflow.lite.Interpreter
import java.io.File
import java.io.FileInputStream
import java.nio.ByteBuffer
import java.nio.channels.FileChannel
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class TfLiteModelManager @Inject constructor(
    @param:ApplicationContext private val context: Context,
    @param:IoDispatcher private val ioDispatcher: CoroutineDispatcher // Injected dispatcher
) : ModelManager {

    private val _modelState = MutableStateFlow<ModelState>(ModelState.Loading)
    override val modelState = _modelState.asStateFlow()

    private var interpreter: Interpreter? = null
    private val interpreterLock = Any()

    override suspend fun initialize() {
        if (_modelState.value is ModelState.Ready) return
        _modelState.value = ModelState.Loading

        // Executing on injected dispatcher for predictable unit testing
        withContext(ioDispatcher) {
            try {
                val modelBuffer = loadModelBuffer()
                val options = Interpreter.Options().apply { setNumThreads(4) }

                synchronized(interpreterLock) {
                    interpreter = Interpreter(modelBuffer, options)
                }

                _modelState.value = ModelState.Ready
            } catch (e: Exception) {
                _modelState.value = ModelState.Error(e.localizedMessage ?: "Failed to load model.")
            }
        }
    }

    override fun runInference(input: ByteBuffer, output: Array<FloatArray>) {
        synchronized(interpreterLock) {
            interpreter?.run(input, output)
                ?: throw IllegalStateException("Model released or not ready.")
        }
    }

    override fun release() {
        synchronized(interpreterLock) {
            try {
                interpreter?.close()
            } catch (e: Exception) {
                e.printStackTrace()
            } finally {
                interpreter = null
                _modelState.value = ModelState.Loading
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