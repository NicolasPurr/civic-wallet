package io.github.nicolaspurr.civicwallet.core.zk

import java.math.BigInteger

/**
 * Represents the distinct Zero-Knowledge circuit tiers supported by the Civic Wallet benchmarking
 * engine.
 *
 * Each enum entry encapsulates a [key] matching the circuit's build artefact directory
 * and command-line ADB intent parameters.
 *
 * @property key The string identifier for the circuit.
 */
enum class CircuitType(val key: String) {
    /** Basic balance and signature proof used as a lightweight baseline benchmark. */
    MOCK("cbdc"),

    /** Tier 1: Peer-to-peer transaction range bounds validation. */
    TIER1("tier1_p2p_range"),

    /** Tier 2: Anti-Money Laundering (AML) daily velocity limit enforcement. */
    TIER2("tier2_velocity_limit"),

    /** Tier 3: 20-level Poseidon Merkle tree Know-Your-Customer (KYC) membership verification. */
    TIER3("tier3_aml_merkle");

    companion object {
        /**
         * Resolves a [CircuitType] from a given string [key], defaulting to [TIER3] if missing or
         * unrecognised.
         *
         * Performs loose string matching to safely parse ADB intent arguments.
         *
         * @param key Raw string key received from CLI arguments, intent extras, or file names.
         * @return The matching [CircuitType], or [TIER2] as a fallback.
         */
        fun fromKey(key: String?): CircuitType {
            if (key.isNullOrBlank()) return TIER3
            val cleanKey = key.lowercase()
            return when {
                cleanKey.contains("tier1") || cleanKey.contains("p2p") -> TIER1
                cleanKey.contains("tier2") || cleanKey.contains("velocity") -> TIER2
                cleanKey.contains("tier3") || cleanKey.contains("merkle") -> TIER3
                cleanKey.contains("cbdc") || cleanKey.contains("mock") -> MOCK
                else -> TIER2
            }
        }
    }
}

/**
 * Polymorphic contract interface for all Circom circuits in the app.
 *
 * Implementations format strongly-typed private/public parameters into JSON strings expected
 * by the native MoPro / Circom witness generator.
 */
sealed interface ZkCircuitInput {
    /** Target `.zkey` filename stored in internal app storage for witness generation. */
    val zkeyFilename: String

    /**
     * Serialises the circuit parameters into a valid UTF-8 Circom JSON input string format.
     *
     * @return Formatted JSON string containing all public and private witness inputs.
     */
    fun toCircomInputsJson(): String

    /**
     * Inputs for basic CBDC transfers (`cbdc.circom`).
     *
     * @property currentBalance Total balance of the payer's account.
     * @property privateKey User's spending key used for signature derivation.
     * @property transferAmount CBDC payment amount to transmit.
     * @property zkeyFilename Target proving key file stored in app memory.
     */
    data class MockCbdcTransfer(
        val currentBalance: Long,
        val privateKey: BigInteger,
        val transferAmount: Long,
        override val zkeyFilename: String = "cbdc.zkey"
    ) : ZkCircuitInput {
        override fun toCircomInputsJson(): String = """
        {
            "currentBalance": ["$currentBalance"],
            "privateKey": ["$privateKey"],
            "transferAmount": ["$transferAmount"]
        }
        """.trimIndent()
    }

    /**
     * Inputs for Tier 1 P2P Range Check proofs (`tier1_p2p_range.circom`).
     *
     * Validates that the transfer amount does not exceed P2P noncustodial range bounds.
     *
     * @property currentBalance Total balance of the payer's account.
     * @property privateKey User's spending key used for signature derivation.
     * @property transferAmount CBDC payment amount to transmit.
     * @property zkeyFilename Target proving key file stored in app memory.
     */
    data class Tier1P2PRange(
        val currentBalance: Long,
        val privateKey: BigInteger,
        val transferAmount: Long,
        override val zkeyFilename: String = "cbdc.zkey"
    ) : ZkCircuitInput {
        override fun toCircomInputsJson(): String = """
        {
            "currentBalance": ["$currentBalance"],
            "privateKey": ["$privateKey"],
            "transferAmount": ["$transferAmount"]
        }
        """.trimIndent()
    }

    /**
     * Inputs for Tier 2 AML Velocity Limit proofs (`tier2_velocity_limit.circom`).
     *
     * Verifies that the cumulative daily transaction sum remains within regulatory limits.
     *
     * @property currentBalance Total balance of the payer's account.
     * @property currentDailySpent Cumulative CBDC spent in the active 24-hour window.
     * @property transferAmount Active transaction amount.
     * @property maxDailyLimit Upper bound spending threshold imposed by policy.
     * @property zkeyFilename Target proving key file stored in app memory.
     */
    data class Tier2VelocityLimit(
        val currentBalance: Long,
        val currentDailySpent: Long,
        val transferAmount: Long,
        val maxDailyLimit: Long,
        override val zkeyFilename: String = "cbdc.zkey"
    ) : ZkCircuitInput {
        override fun toCircomInputsJson(): String = """
        {
            "currentBalance": ["$currentBalance"],
            "currentDailySpent": ["$currentDailySpent"],
            "transferAmount": ["$transferAmount"],
            "maxDailyLimit": ["$maxDailyLimit"]
        }
        """.trimIndent()
    }

    /**
     * Inputs for Tier 3 Merkle KYC Membership proofs (`tier3_aml_merkle.circom`).
     *
     * Proves cryptographic inclusion within an authourized KYC Merkle tree using Poseidon BN128
     * hashes.
     *
     * @property userSecret Private key/leaf secret for Merkle membership calculation.
     * @property currentBalance Total balance of the payer's account.
     * @property pathElements Array of 20 sibling hash nodes along the Merkle proof path.
     * @property pathIndices Array of 20 binary direction indicators (0 = left, 1 = right).
     * @property transferAmount Active payment transaction value.
     * @property root Expected 256-bit Poseidon Merkle tree root hash.
     * @property zkeyFilename Target proving key file stored in app memory.
     * @throws IllegalArgumentException if [pathElements] or [pathIndices] size is not exactly 20.
     */
    data class Tier3AmlMerkle(
        val userSecret: BigInteger,
        val currentBalance: Long,
        val pathElements: List<BigInteger>,
        val pathIndices: List<Int>,
        val transferAmount: Long,
        val root: BigInteger,
        override val zkeyFilename: String = "cbdc.zkey"
    ) : ZkCircuitInput {
        init {
            require(pathElements.size == 20) { "pathElements must be size 20" }
            require(pathIndices.size == 20) { "pathIndices must be size 20" }
        }

        override fun toCircomInputsJson(): String {
            val formattedPathElements = pathElements.joinToString(",") { "\"$it\"" }
            val formattedPathIndices = pathIndices.joinToString(",") { "\"$it\"" }
            return """
            {
                "userSecret": ["$userSecret"],
                "currentBalance": ["$currentBalance"],
                "pathElements": [$formattedPathElements],
                "pathIndices": [$formattedPathIndices],
                "transferAmount": ["$transferAmount"],
                "root": ["$root"]
            }
            """.trimIndent()
        }
    }
}

/**
 * Responsible for instantiating standard benchmark test vectors for each circuit tier.
 */
object ZkCircuitInputFactory {
    /** Static test vector for Tier 3 Merkle path sibling hashes (depth 20). */
    val tier3PathElements = List(20) { i -> BigInteger((i + 100).toString()) }

    /** Static test vector for Tier 3 Merkle path directions (depth 20). */
    val tier3PathIndices = List(20) { i -> i % 2 }

    /**
     * Generates a [ZkCircuitInput] test vector for automated mobile benchmarking.
     *
     * @param type The target [CircuitType] to construct test inputs for.
     * @return Valid, pre-populated [ZkCircuitInput] payload.
     */
    fun createDefaultInput(type: CircuitType): ZkCircuitInput = when (type) {
        CircuitType.MOCK -> ZkCircuitInput.MockCbdcTransfer(
            currentBalance = 1000L,
            privateKey = BigInteger("1234567890987654321"),
            transferAmount = 42L
        )

        CircuitType.TIER1 -> ZkCircuitInput.Tier1P2PRange(
            currentBalance = 1000L,
            privateKey = BigInteger("1234567890987654321"),
            transferAmount = 42L
        )

        CircuitType.TIER2 -> ZkCircuitInput.Tier2VelocityLimit(
            currentBalance = 1000L,
            currentDailySpent = 150L,
            transferAmount = 42L,
            maxDailyLimit = 500L
        )

        CircuitType.TIER3 -> ZkCircuitInput.Tier3AmlMerkle(
            userSecret = BigInteger("123456789"),
            currentBalance = 1000L,
            pathElements = tier3PathElements,
            pathIndices = tier3PathIndices,
            transferAmount = 42L,
            // Exact Poseidon BN128 tree root calculated by circomlibjs for the inputs above
            root = BigInteger("16611617098275133559459537698452468172697565001311346171626385131470191773187")
        )
    }
}