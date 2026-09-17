package io.github.nicolaspurr.civicwallet.core.zk

/**
 * Deployment scenarios driving state-tree and blacklist-tree depths.
 *
 * Depths are derived from a capacity model (see DEPTHS.md), not chosen as arbitrary round numbers:
 *
 *   state leaves = 2 x population x 500 tx/person/year x 30 years
 *                  (two leaves per payment: payer state update + payee claim)
 *   blacklist    = 1e6 global sanctions base + 1% of accounts
 *
 * with a +2 level (4x) engineering margin applied to both trees.
 *
 * ## Single Proving Key File Architecture
 *
 * MoPro compiles the circuit-specific witness generator directly into the native
 * library (`w2c2`), meaning each compiled APK binary targets exactly one circuit variant.
 * The build script (`build.sh`) compiles discrete `jniLibs` per circuit, and the benchmark
 * runner (`run.sh`) reinstalls the application and pushes the corresponding key under the
 * uniform [ZKEY_FILENAME] before each test run. Runtime key differentiation is therefore
 * redundant—within a given APK, only one valid proving key exists.
 *
 * @property key Unique directory and ADB intent identifier for the circuit.
 * @property stateDepth Merkle tree depth for state balance commitments.
 * @property blacklistDepth Sparse/indexed Merkle tree depth for sanctions checks (0 for standard circuits).
 */
enum class CircuitType(
    val key: String,
    val stateDepth: Int,
    val blacklistDepth: Int
) {

    // ---- Standard Transfers ------------------------------------------- //

    /** Metropolitan / small nation tier: 10^7 population, 30-year operational horizon. */
    STANDARD_METRO("standard_metro", 41, 0),

    /** Large nation tier: 10^8 population, 30-year operational horizon. */
    STANDARD_NATION("standard_nation", 44, 0),

    /** Currency union tier (e.g., EU): 5 x 10^8 population, 30-year operational horizon. */
    STANDARD_UNION("standard_union", 47, 0),

    /** Global scale tier: 10^10 population, 30-year operational horizon. */
    STANDARD_GLOBAL("standard_global", 51, 0),

    // ---- Advanced Transfers (AML/CFT Compliance) --------------------- //

    ADVANCED_METRO("advanced_metro", 41, 23),
    ADVANCED_NATION("advanced_nation", 44, 23),
    ADVANCED_UNION("advanced_union", 47, 26),
    ADVANCED_GLOBAL("advanced_global", 51, 29),

    /**
     * Ablation control baseline. Shares identical circuit logic with [ADVANCED_UNION],
     * but retains a 160-depth blacklist tree reproducing pre-optimization computational overhead.
     * Evaluated strictly to demonstrate that performance gains originate from tree depth
     * rather than ancillary changes. Not intended for production deployment.
     */
    ADVANCED_UNION_BL160("advanced_union_bl160", 47, 160);

    val isAdvanced: Boolean get() = blacklistDepth > 0

    /** Target proving key filename (see class documentation). */
    val zkeyFilename: String get() = ZKEY_FILENAME

    companion object {
        const val ZKEY_FILENAME = "cbdc.zkey"

        /**
         * Resolves a [CircuitType] from an ADB intent extra string.
         *
         * Enforces strict equality matching rather than substring searching.
         * Loose parsing risks silently defaulting to a fallback variant on typos,
         * corrupting benchmark datasets without diagnostic traces in logs.
         *
         * @throws IllegalArgumentException if [key] does not match a known circuit identifier.
         */
        fun fromKey(key: String?): CircuitType {
            require(!key.isNullOrBlank()) { "Circuit key must not be blank" }
            val clean = key.trim().lowercase()
            return entries.firstOrNull { it.key == clean }
                ?: throw IllegalArgumentException(
                    "Unknown circuit key '$key'. Expected one of: " +
                            entries.joinToString(", ") { it.key }
                )
        }

        /** Production and deployment-grade circuit variants evaluated in benchmarks (excludes ablation controls). */
        val deploymentVariants: List<CircuitType>
            get() = entries.filter { it != ADVANCED_UNION_BL160 }
    }
}

