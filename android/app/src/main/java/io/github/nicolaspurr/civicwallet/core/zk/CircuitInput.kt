package io.github.nicolaspurr.civicwallet.core.zk

import java.math.BigInteger

/**
 * Polymorphic contract for Circom circuit inputs.
 *
 * ## Protocol Revisions
 *
 * 1. `oldCommitment` and `newCommitment` are derived internally by the circuit
 *    from the state tuple. This eliminates client-side Poseidon hashing dependencies
 *    and prevents test-vector divergence from circuit constraint logic.
 * 2. `publicNullifier` is computed as an output signal rather than passed as an input.
 * 3. State tuples consist of seven uniform elements across both circuit tiers,
 *    allowing balance states to transition seamlessly between standard and advanced circuits.
 * 4. Accounting epochs (`epochDay`, `epochMonth`) manage velocity counter resets.
 * 5. Added recipient payload commitments (`recipientPubKey`, `noteSalt`) and bound
 *    encrypted payload hashes (`encryptedNoteHash`) directly to proof instances.
 * 6. Sanctions tree uses an indexed Merkle tree structure: replacing 160-depth paths
 *    with low-nullifier non-membership proofs across [CircuitType.blacklistDepth] levels.
 *
 * Values are serialized as single-element string arrays to match Circom/MoPro witness parser requirements.
 */
sealed interface CircuitInput {

    val circuit: CircuitType
    val zkeyFilename: String get() = circuit.zkeyFilename

    /**
     * Serializes witness parameters into a UTF-8 JSON payload consumed by the native witness generator.
     */
    fun toCircomInputsJson(): String

    // ------------------------------------------------------------------ //
    //  Standard Transfer Variant                                         //
    // ------------------------------------------------------------------ //
    data class StandardTransferInput(
        override val circuit: CircuitType,

        // --- Public Inputs ---
        val stateRoot: BigInteger,
        val epochDay: Long,
        val epochMonth: Long,
        val maxSingleTxLimit: Long,
        val maxDailyLimit: Long,
        val maxMonthlyLimit: Long,
        val encryptedNoteHash: BigInteger,

        // --- Private Inputs: Consumed State Opening ---
        val userPrivateKey: BigInteger,
        val oldBalance: Long,
        val oldSalt: BigInteger,
        val oldDailySpent: Long,
        val oldMonthlySpent: Long,
        val oldEpochDay: Long,
        val oldEpochMonth: Long,

        // --- Private Inputs: Transaction Parameters ---
        val newSalt: BigInteger,
        val transferAmount: Long,
        val recipientPubKey: BigInteger,
        val noteSalt: BigInteger,

        // --- Private Inputs: State Authentication Path ---
        val statePathElements: List<BigInteger>,
        val statePathIndices: List<Int>
    ) : CircuitInput {

        init {
            validateStateWitness(
                circuit, statePathElements, statePathIndices,
                oldBalance, transferAmount,
                oldEpochDay, epochDay, oldEpochMonth, epochMonth
            )
            require(!circuit.isAdvanced) {
                "${circuit.key} is an advanced circuit; use AdvancedTransferInput"
            }
        }

        override fun toCircomInputsJson(): String = """
        {
            "stateRoot": ["$stateRoot"],
            "epochDay": ["$epochDay"],
            "epochMonth": ["$epochMonth"],
            "maxSingleTxLimit": ["$maxSingleTxLimit"],
            "maxDailyLimit": ["$maxDailyLimit"],
            "maxMonthlyLimit": ["$maxMonthlyLimit"],
            "encryptedNoteHash": ["$encryptedNoteHash"],
            "userPrivateKey": ["$userPrivateKey"],
            "oldBalance": ["$oldBalance"],
            "oldSalt": ["$oldSalt"],
            "oldDailySpent": ["$oldDailySpent"],
            "oldMonthlySpent": ["$oldMonthlySpent"],
            "oldEpochDay": ["$oldEpochDay"],
            "oldEpochMonth": ["$oldEpochMonth"],
            "newSalt": ["$newSalt"],
            "transferAmount": ["$transferAmount"],
            "recipientPubKey": ["$recipientPubKey"],
            "noteSalt": ["$noteSalt"],
            "statePathElements": [${statePathElements.joinToString(",") { "\"$it\"" }}],
            "statePathIndices": [${statePathIndices.joinToString(",") { "\"$it\"" }}]
        }
        """.trimIndent()
    }

    // ------------------------------------------------------------------ //
    //  Advanced Transfer Variant (AML/CFT Compliance)                    //
    // ------------------------------------------------------------------ //
    data class AdvancedTransferInput(
        override val circuit: CircuitType,

        // --- Public Inputs ---
        val stateRoot: BigInteger,
        val blacklistRoot: BigInteger,
        val epochDay: Long,
        val epochMonth: Long,
        val maxSingleTxLimit: Long,
        val maxDailyLimit: Long,
        val maxMonthlyLimit: Long,
        val tier1WarningThreshold: Long,
        val encryptedNoteHash: BigInteger,

        // --- Private Inputs: Consumed State Opening ---
        val userPrivateKey: BigInteger,
        val oldBalance: Long,
        val oldSalt: BigInteger,
        val oldDailySpent: Long,
        val oldMonthlySpent: Long,
        val oldEpochDay: Long,
        val oldEpochMonth: Long,

        // --- Private Inputs: Transaction Parameters ---
        val newSalt: BigInteger,
        val transferAmount: Long,
        val recipientPubKey: BigInteger,
        val noteSalt: BigInteger,

        // --- Private Inputs: State Authentication Path ---
        val statePathElements: List<BigInteger>,
        val statePathIndices: List<Int>,

        // --- Private Inputs: Non-membership Proof (Indexed Merkle Tree) ---
        val blLowValue: BigInteger,
        val blLowNextIndex: BigInteger,
        val blLowNextValue: BigInteger,
        val blPathElements: List<BigInteger>,
        val blPathIndices: List<Int>
    ) : CircuitInput {

        init {
            validateStateWitness(
                circuit, statePathElements, statePathIndices,
                oldBalance, transferAmount,
                oldEpochDay, epochDay, oldEpochMonth, epochMonth
            )
            require(circuit.isAdvanced) {
                "${circuit.key} is a standard circuit; use StandardTransferInput"
            }
            require(blPathElements.size == circuit.blacklistDepth) {
                "blPathElements must be ${circuit.blacklistDepth} for ${circuit.key}, " +
                        "was ${blPathElements.size}"
            }
            require(blPathIndices.size == circuit.blacklistDepth) {
                "blPathIndices must be ${circuit.blacklistDepth} for ${circuit.key}, " +
                        "was ${blPathIndices.size}"
            }
            // Non-membership gap invariant check; failure causes unsat witness generation in native FFI.
            require(blLowNextValue.signum() == 0 || blLowValue < blLowNextValue) {
                "Indexed-tree invariant violated: blLowValue must be < blLowNextValue " +
                        "unless the leaf is terminal (blLowNextValue = 0)"
            }
        }

        override fun toCircomInputsJson(): String = """
        {
            "stateRoot": ["$stateRoot"],
            "blacklistRoot": ["$blacklistRoot"],
            "epochDay": ["$epochDay"],
            "epochMonth": ["$epochMonth"],
            "maxSingleTxLimit": ["$maxSingleTxLimit"],
            "maxDailyLimit": ["$maxDailyLimit"],
            "maxMonthlyLimit": ["$maxMonthlyLimit"],
            "tier1WarningThreshold": ["$tier1WarningThreshold"],
            "encryptedNoteHash": ["$encryptedNoteHash"],
            "userPrivateKey": ["$userPrivateKey"],
            "oldBalance": ["$oldBalance"],
            "oldSalt": ["$oldSalt"],
            "oldDailySpent": ["$oldDailySpent"],
            "oldMonthlySpent": ["$oldMonthlySpent"],
            "oldEpochDay": ["$oldEpochDay"],
            "oldEpochMonth": ["$oldEpochMonth"],
            "newSalt": ["$newSalt"],
            "transferAmount": ["$transferAmount"],
            "recipientPubKey": ["$recipientPubKey"],
            "noteSalt": ["$noteSalt"],
            "statePathElements": [${statePathElements.joinToString(",") { "\"$it\"" }}],
            "statePathIndices": [${statePathIndices.joinToString(",") { "\"$it\"" }}],
            "blLowValue": ["$blLowValue"],
            "blLowNextIndex": ["$blLowNextIndex"],
            "blLowNextValue": ["$blLowNextValue"],
            "blPathElements": [${blPathElements.joinToString(",") { "\"$it\"" }}],
            "blPathIndices": [${blPathIndices.joinToString(",") { "\"$it\"" }}]
        }
        """.trimIndent()
    }

    companion object {
        /**
         * Validates constraint preconditions on the JVM to surface clear assertion
         * errors before witness generation crashes unrecoverably inside Rust FFI.
         */
        private fun validateStateWitness(
            circuit: CircuitType,
            pathElements: List<BigInteger>,
            pathIndices: List<Int>,
            oldBalance: Long,
            transferAmount: Long,
            oldEpochDay: Long,
            epochDay: Long,
            oldEpochMonth: Long,
            epochMonth: Long
        ) {
            require(pathElements.size == circuit.stateDepth) {
                "statePathElements must be ${circuit.stateDepth} for ${circuit.key}, " +
                        "was ${pathElements.size}"
            }
            require(pathIndices.size == circuit.stateDepth) {
                "statePathIndices must be ${circuit.stateDepth} for ${circuit.key}, " +
                        "was ${pathIndices.size}"
            }
            require(pathIndices.all { it == 0 || it == 1 }) {
                "statePathIndices must be binary"
            }
            require(transferAmount in 0..oldBalance) {
                "transferAmount ($transferAmount) must be within [0, oldBalance=$oldBalance]; " +
                        "the 64-bit range check on newBalance would otherwise be unsatisfiable"
            }
            require(epochDay >= oldEpochDay) {
                "epochDay ($epochDay) must not precede oldEpochDay ($oldEpochDay)"
            }
            require(epochMonth >= oldEpochMonth) {
                "epochMonth ($epochMonth) must not precede oldEpochMonth ($oldEpochMonth)"
            }
        }
    }
}
