package io.github.nicolaspurr.civicwallet.core.zk

import android.os.Debug
import java.io.File

/**
 * Lightweight helper to capture native heap allocations and parse `/proc/self/status`.
 */
object NativeMemoryTracker {

    /**
     * Returns currently allocated native heap size in Megabytes (MB).
     */
    fun getNativeHeapAllocatedMb(): Long {
        return Debug.getNativeHeapAllocatedSize() / (1024 * 1024)
    }

    /**
     * Reads /proc/self/status to extract VmHWM (Virtual Memory High WaterMark).
     * Represents the peak Resident Set Size (RSS) allocated by the OS in MB.
     */
    fun getMemoryHighWaterMarkMb(): Long {
        val statusFile = File("/proc/self/status")
        if (!statusFile.exists()) return 0L

        return try {
            statusFile.useLines { lines ->
                lines.firstOrNull { it.startsWith("VmHWM:") }
                    ?.split("\\s+".toRegex())
                    ?.getOrNull(1)
                    ?.toLongOrNull()?.div(1024) ?: 0L
            }
        } catch (_: Exception) {
            0L
        }
    }
}