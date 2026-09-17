package io.github.nicolaspurr.civicwallet.core.zk

/**
 * Precomputed test fixture loaded from application assets.
 *
 * Parameters requiring Poseidon hash evaluations (tree roots, Merkle paths,
 * and indexed-tree low leaves) cannot be generated on-device without a native Kotlin
 * Poseidon implementation. They are produced offline via `tools/generate_fixtures.mjs`
 * (`circomlibjs`) and bundled under `assets/zk_fixtures/<key>.json`.
 *
 * State values must match the precomputed leaf preimage exactly to satisfy circuit constraints.
 */
data class ZkFixture(
    val circuit: String,
    val stateDepth: Int,
    val blacklistDepth: Int,

    val userPrivateKey: String,
    val oldBalance: Long,
    val oldSalt: String,
    val oldDailySpent: Long,
    val oldMonthlySpent: Long,
    val oldEpochDay: Long,
    val oldEpochMonth: Long,

    val stateRoot: String,
    val statePathElements: List<String>,
    val statePathIndices: List<Int>,

    val blacklistRoot: String? = null,
    val blLowValue: String? = null,
    val blLowNextIndex: String? = null,
    val blLowNextValue: String? = null,
    val blPathElements: List<String>? = null,
    val blPathIndices: List<Int>? = null
)

