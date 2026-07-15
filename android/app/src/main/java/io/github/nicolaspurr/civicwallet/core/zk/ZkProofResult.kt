package io.github.nicolaspurr.civicwallet.core.zk

data class ZkProofResult(
    val proofJson: String,
    val proofSizeInBytes: Int,
    val witnessGenTimeMs: Long,
    val proofGenTimeMs: Long,
    val totalEngineTimeMs: Long,
)