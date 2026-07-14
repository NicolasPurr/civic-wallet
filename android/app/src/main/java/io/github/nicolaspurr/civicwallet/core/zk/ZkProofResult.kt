package io.github.nicolaspurr.civicwallet.core.zk

data class ZkProofResult(
    val proof: CharArray,
    val proofSizeInBytes: Int,
    val witnessGenTimeMs: Long,
    val proofGenTimeMs: Long,
    val totalEngineTimeMs: Long
) {
    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (javaClass != other?.javaClass) return false

        other as ZkProofResult

        if (proofSizeInBytes != other.proofSizeInBytes) return false
        if (witnessGenTimeMs != other.witnessGenTimeMs) return false
        if (proofGenTimeMs != other.proofGenTimeMs) return false
        if (totalEngineTimeMs != other.totalEngineTimeMs) return false
        if (!proof.contentEquals(other.proof)) return false

        return true
    }

    override fun hashCode(): Int {
        var result = proofSizeInBytes
        result = 31 * result + witnessGenTimeMs.hashCode()
        result = 31 * result + proofGenTimeMs.hashCode()
        result = 31 * result + totalEngineTimeMs.hashCode()
        result = 31 * result + proof.contentHashCode()
        return result
    }
}