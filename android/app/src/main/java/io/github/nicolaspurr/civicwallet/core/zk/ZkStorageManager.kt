package io.github.nicolaspurr.civicwallet.core.zk

import android.content.Context
import android.util.Log
import dagger.hilt.android.qualifiers.ApplicationContext
import java.io.File
import java.io.FileOutputStream
import java.io.InputStream
import java.security.MessageDigest
import javax.inject.Inject
import javax.inject.Singleton

/**
 * Manages local file system extraction and integrity verification for ZK proving keys (`.zkey`).
 *
 * ### Implementation Rationale
 * Native C/C++ or Rust FFI engines cannot directly read compressed assets from an Android APK
 * bundle (`assets/`).
 * This manager extracts asset files into accessible internal storage (`context.filesDir`) and
 * verifies SHA-256 digests to guarantee that recompiled circuits are automatically synced without
 * manual cache invalidation.
 *
 * @param context Application context used for accessing assets and internal app storage.
 */
@Singleton
class ZkeyStorageManager @Inject constructor(
    @param:ApplicationContext private val context: Context
) {
    /**
     * Resolves the absolute file path for a required proving key.
     *
     * Checks internal storage for [fileName]. If missing or out-of-date (mismatched SHA-256 hash),
     * it extracts a fresh copy from the APK assets directory.
     *
     * @param fileName The target key file name in assets (defaults to `"cbdc.zkey"`).
     * @return The absolute filesystem path readable by native Rust FFI calls.
     */
    fun getOrExtractZkey(fileName: String = "cbdc.zkey"): String {
        val targetFile = File(context.filesDir, fileName)

        // Extract if target does not exist locally
        if (!targetFile.exists()) {
            Log.d("CBDC_ZKEY", "Target file missing. Extracting $fileName...")
            extractAsset(fileName, targetFile)
            return targetFile.absolutePath
        }

        // Compute SHA-256 digests to detect asset updates between builds
        val assetHash = runCatching { context.assets.open(fileName).use { it.sha256() } }
            .getOrNull()
        val fileHash = runCatching { targetFile.inputStream().use { it.sha256() } }
            .getOrNull()

        // Overwrite local file if hashes differ or asset failed to read
        if (assetHash == null || assetHash != fileHash) {
            Log.d("CBDC_ZKEY", "ZKey update detected! Extracting fresh copy...")
            extractAsset(fileName, targetFile)
        } else {
            Log.d("CBDC_ZKEY", "ZKey is up to date (SHA256: $fileHash)")
        }

        return targetFile.absolutePath
    }

    /**
     * Copies an asset file from the APK bundle directly into internal storage.
     *
     * @param fileName Name of the asset file to read.
     * @param targetFile Destination [File] in internal app storage.
     */
    private fun extractAsset(fileName: String, targetFile: File) {
        if (targetFile.exists()) targetFile.delete()
        context.assets.open(fileName).use { input ->
            FileOutputStream(targetFile).use { output ->
                input.copyTo(output)
                output.flush()
            }
        }
    }

    /**
     * Extension function calculating the hexadecimal SHA-256 checksum of an [InputStream].
     */
    private fun InputStream.sha256(): String {
        val digest = MessageDigest.getInstance("SHA-256")
        val buffer = ByteArray(8192)
        var bytesRead: Int
        while (read(buffer).also { bytesRead = it } != -1) {
            digest.update(buffer, 0, bytesRead)
        }
        return digest.digest().joinToString("") { "%02x".format(it) }
    }
}