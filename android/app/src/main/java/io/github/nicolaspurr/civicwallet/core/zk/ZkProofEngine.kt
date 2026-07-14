package io.github.nicolaspurr.civicwallet.core.zk

interface ZkProofEngine {
    // Pure, callback-free suspension
    suspend fun generateProof(confidence: Float): Result<ZkProofResult>
}