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
    /** Basic balance and signature proof used as a lightweight baseline check. */
    MOCK("mock_circuit"),

    /** Circuit A (Baseline): UTXO transfer with public transfer amount. */
    BASE("circuit_a_baseline"),

    /** Circuit B: Standard CBDC transfer with daily limit and state Merkle membership. */
    STANDARD("circuit_b_standard"),
    STANDARD_D20("circuit_b_standard_d20"),
    STANDARD_D21("circuit_b_standard_d21"),
    STANDARD_D27("circuit_b_standard_d27"),
    STANDARD_D33("circuit_b_standard_d33"),

    /** Circuit C: Advanced AML transfer with velocity limits and SMT blacklist check. */
    ADVANCED("circuit_c_advanced"),
    ADVANCED_D20("circuit_c_advanced_d20"),
    ADVANCED_D21("circuit_c_advanced_d21"),
    ADVANCED_D27("circuit_c_advanced_d27"),
    ADVANCED_D33("circuit_c_advanced_d33");

    companion object {
        /**
         * Resolves a [CircuitType] from a given string [key], defaulting to [BASE] if missing or
         * unrecognised.
         *
         * Performs loose string matching to safely parse ADB intent arguments.
         *
         * @param key Raw string key received from CLI arguments, intent extras, or file names.
         * @return The matching [CircuitType], or [BASE] as a fallback.
         */
        fun fromKey(key: String?): CircuitType {
            if (key.isNullOrBlank()) return BASE
            val cleanKey = key.lowercase()
            return when {
                // Advanced Circuit matching with AND logic for depths
                cleanKey.contains("advanced") && cleanKey.contains("d21") -> ADVANCED_D21
                cleanKey.contains("advanced") && cleanKey.contains("d27") -> ADVANCED_D27
                cleanKey.contains("advanced") && cleanKey.contains("d33") -> ADVANCED_D33
                cleanKey.contains("advanced") && cleanKey.contains("d20") -> ADVANCED_D20
                cleanKey.contains("advanced") || cleanKey.contains("aml") -> ADVANCED

                // Standard Circuit matching with AND logic for depths
                cleanKey.contains("standard") && cleanKey.contains("d21") -> STANDARD_D21
                cleanKey.contains("standard") && cleanKey.contains("d27") -> STANDARD_D27
                cleanKey.contains("standard") && cleanKey.contains("d33") -> STANDARD_D33
                cleanKey.contains("standard") && cleanKey.contains("d20") -> STANDARD_D20
                cleanKey.contains("standard") -> STANDARD

                cleanKey.contains("base") -> BASE
                cleanKey.contains("mock") -> MOCK
                else -> MOCK
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
     * Inputs for Baseline UTXO Transfer proofs (`BaselineUtxoTransfer.circom`).
     */
    data class MockTransferInput(
        val userPrivateKey: BigInteger,
        val oldBalance: Long,
        val oldSalt: BigInteger,
        val newSalt: BigInteger,
        val publicNullifier: BigInteger,
        val oldCommitment: BigInteger,
        val newCommitment: BigInteger,
        val transferAmount: Long,
        override val zkeyFilename: String = "cbdc.zkey"
    ) : ZkCircuitInput {
        override fun toCircomInputsJson(): String = """
        {
            "userPrivateKey": ["$userPrivateKey"],
            "oldBalance": ["$oldBalance"],
            "oldSalt": ["$oldSalt"],
            "newSalt": ["$newSalt"],
            "publicNullifier": ["$publicNullifier"],
            "oldCommitment": ["$oldCommitment"],
            "newCommitment": ["$newCommitment"],
            "transferAmount": ["$transferAmount"]
        }
        """.trimIndent()
    }

    /**
     * Inputs for Confidential Burn UTXO Transfer proofs (`ConfidentialBurnUtxoTransfer.circom`).
     */
    data class BaselineTransferInput(
        val userPrivateKey: BigInteger,
        val oldBalance: Long,
        val oldSalt: BigInteger,
        val changeSalt: BigInteger,
        val transferAmount: Long,
        val publicNullifier: BigInteger,
        val oldCommitment: BigInteger,
        val changeCommitment: BigInteger,
        override val zkeyFilename: String = "cbdc.zkey"
    ) : ZkCircuitInput {
        override fun toCircomInputsJson(): String = """
        {
            "userPrivateKey": ["$userPrivateKey"],
            "oldBalance": ["$oldBalance"],
            "oldSalt": ["$oldSalt"],
            "changeSalt": ["$changeSalt"],
            "transferAmount": ["$transferAmount"],
            "publicNullifier": ["$publicNullifier"],
            "oldCommitment": ["$oldCommitment"],
            "changeCommitment": ["$changeCommitment"]
        }
        """.trimIndent()
    }

    /**
     * Inputs for Standard CBDC Transfer proofs (`StandardCbdcConfidential.circom`).
     * Supports tree depths 20, 21, 27, and 33.
     */
    data class StandardTransferInput(
        val userPrivateKey: BigInteger,
        val oldBalance: Long,
        val oldSalt: BigInteger,
        val newSalt: BigInteger,
        val currentDailySpent: Long,
        val transferAmount: Long,
        val pathElements: List<BigInteger>,
        val pathIndices: List<Int>,
        val publicNullifier: BigInteger,
        val oldCommitment: BigInteger,
        val newCommitment: BigInteger,
        val maxSingleTxLimit: Long,
        val maxDailyLimit: Long,
        val stateRoot: BigInteger,
        override val zkeyFilename: String = "cbdc.zkey"
    ) : ZkCircuitInput {
        init {
            require(pathElements.size == pathIndices.size) {
                "pathElements (size ${pathElements.size}) and pathIndices (size ${pathIndices.size}) must be equal"
            }
            require(pathElements.size in listOf(20, 21, 27, 33)) {
                "pathElements size must be 20, 21, 27, or 33, but was ${pathElements.size}"
            }
        }

        override fun toCircomInputsJson(): String {
            val formattedElements = pathElements.joinToString(",") { "\"$it\"" }
            val formattedIndices = pathIndices.joinToString(",") { "\"$it\"" }
            return """
            {
                "userPrivateKey": ["$userPrivateKey"],
                "oldBalance": ["$oldBalance"],
                "oldSalt": ["$oldSalt"],
                "newSalt": ["$newSalt"],
                "currentDailySpent": ["$currentDailySpent"],
                "transferAmount": ["$transferAmount"],
                "pathElements": [$formattedElements],
                "pathIndices": [$formattedIndices],
                "publicNullifier": ["$publicNullifier"],
                "oldCommitment": ["$oldCommitment"],
                "newCommitment": ["$newCommitment"],
                "maxSingleTxLimit": ["$maxSingleTxLimit"],
                "maxDailyLimit": ["$maxDailyLimit"],
                "stateRoot": ["$stateRoot"]
            }
            """.trimIndent()
        }
    }

    /**
     * Inputs for Advanced AML Transfer proofs (`AdvancedAmlConfidential.circom`).
     * Supports state tree depths 20, 21, 27, and 33 with a 160-element SMT blacklist path.
     */
    data class AdvancedTransferInput(
        val userPrivateKey: BigInteger,
        val oldBalance: Long,
        val oldSalt: BigInteger,
        val newSalt: BigInteger,
        val currentDailySpent: Long,
        val currentMonthlySpent: Long,
        val transferAmount: Long,
        val statePathElements: List<BigInteger>,
        val statePathIndices: List<Int>,
        val blacklistPathElements: List<BigInteger>,
        val publicNullifier: BigInteger,
        val oldCommitment: BigInteger,
        val newCommitment: BigInteger,
        val maxSingleTxLimit: Long,
        val maxDailyLimit: Long,
        val maxMonthlyLimit: Long,
        val tier1WarningThreshold: Long,
        val stateRoot: BigInteger,
        val blacklistRoot: BigInteger,
        override val zkeyFilename: String = "cbdc.zkey"
    ) : ZkCircuitInput {
        init {
            require(statePathElements.size == statePathIndices.size) {
                "statePathElements (size ${statePathElements.size}) and statePathIndices " +
                        "(size ${statePathIndices.size}) must be equal"
            }
            require(statePathElements.size in listOf(20, 21, 27, 33)) {
                "statePathElements size must be 20, 21, 27, or 33, but was ${statePathElements.size}"
            }
            require(blacklistPathElements.size == 160) {
                "blacklistPathElements must be size 160, but was ${blacklistPathElements.size}"
            }
        }

        override fun toCircomInputsJson(): String {
            val formattedStateElements = statePathElements.joinToString(",") { "\"$it\"" }
            val formattedStateIndices = statePathIndices.joinToString(",") { "\"$it\"" }
            val formattedBlacklistElements = blacklistPathElements.joinToString(",") { "\"$it\"" }
            return """
            {
                "userPrivateKey": ["$userPrivateKey"],
                "oldBalance": ["$oldBalance"],
                "oldSalt": ["$oldSalt"],
                "newSalt": ["$newSalt"],
                "currentDailySpent": ["$currentDailySpent"],
                "currentMonthlySpent": ["$currentMonthlySpent"],
                "transferAmount": ["$transferAmount"],
                "statePathElements": [$formattedStateElements],
                "statePathIndices": [$formattedStateIndices],
                "blacklistPathElements": [$formattedBlacklistElements],
                "publicNullifier": ["$publicNullifier"],
                "oldCommitment": ["$oldCommitment"],
                "newCommitment": ["$newCommitment"],
                "maxSingleTxLimit": ["$maxSingleTxLimit"],
                "maxDailyLimit": ["$maxDailyLimit"],
                "maxMonthlyLimit": ["$maxMonthlyLimit"],
                "tier1WarningThreshold": ["$tier1WarningThreshold"],
                "stateRoot": ["$stateRoot"],
                "blacklistRoot": ["$blacklistRoot"]
            }
            """.trimIndent()
        }
    }
}

/**
 * Instantiates exact test vectors matching Poseidon hashes for each circuit tier and depth.
 */
object ZkCircuitInputFactory {

    private fun generatePathElements(startValue: Int, depth: Int): List<BigInteger> =
        List(depth) { i -> BigInteger((startValue + i).toString()) }

    private fun generatePathIndices(depth: Int): List<Int> =
        List(depth) { i -> i % 2 }

    private fun generateBlacklistPathElements(): List<BigInteger> =
        List(160) { j -> BigInteger((1000 + j).toString()) }

    /**
     * Generates a [ZkCircuitInput] test vector for automated mobile benchmarking.
     *
     * @param type The target [CircuitType] to construct test inputs for.
     * @return Valid, pre-populated [ZkCircuitInput] payload.
     */
    fun createDefaultInput(type: CircuitType): ZkCircuitInput = when (type) {

        CircuitType.MOCK -> ZkCircuitInput.MockTransferInput(
            userPrivateKey = BigInteger("123456789123456789"),
            oldBalance = 1000L,
            oldSalt = BigInteger("999111"),
            newSalt = BigInteger("888222"),
            transferAmount = 42L,
            publicNullifier = BigInteger("6068792487108398707149403764947990335404296465852179553942298054649828303385"),
            oldCommitment = BigInteger("17963156076338265717610657693272521449045059953318201442497982349774222203733"),
            newCommitment = BigInteger("20016353835725645922561700106331404295386934961283247156604796151384497625197")
        )

        CircuitType.BASE -> ZkCircuitInput.BaselineTransferInput(
            userPrivateKey = BigInteger("123456789123456789"),
            oldBalance = 1000L,
            oldSalt = BigInteger("999111"),
            changeSalt = BigInteger("777333"),
            transferAmount = 42L,
            publicNullifier = BigInteger("6068792487108398707149403764947990335404296465852179553942298054649828303385"),
            oldCommitment = BigInteger("17963156076338265717610657693272521449045059953318201442497982349774222203733"),
            changeCommitment = BigInteger("5738924484190964166456884285042852511404242378791863188014682954178512208556")
        )

        CircuitType.STANDARD, CircuitType.STANDARD_D20 -> createStandardInput(
            depth = 20,
            stateRoot = BigInteger("20207928685555545551766412547678985099929647358851539617781541095763236294684")
        )
        CircuitType.STANDARD_D21 -> createStandardInput(
            depth = 21,
            stateRoot = BigInteger("3212892827519114403243756572979095674822489888805923397430084237038174886641")
        )
        CircuitType.STANDARD_D27 -> createStandardInput(
            depth = 27,
            stateRoot = BigInteger("20919903900571108321110714834490413134822173415058395716248909612138144719561")
        )
        CircuitType.STANDARD_D33 -> createStandardInput(
            depth = 33,
            stateRoot = BigInteger("11349944334650083979504426297887179459032973517481575160277341278973501866129")
        )

        CircuitType.ADVANCED, CircuitType.ADVANCED_D20 -> createAdvancedInput(
            depth = 20,
            stateRoot = BigInteger("14857670798280066088006874170775458751958750095771819523831863775674296795796")
        )
        CircuitType.ADVANCED_D21 -> createAdvancedInput(
            depth = 21,
            stateRoot = BigInteger("11809982554599070887743222881219014123851873360868206405024847743007177031023")
        )
        CircuitType.ADVANCED_D27 -> createAdvancedInput(
            depth = 27,
            stateRoot = BigInteger("10817961257439874511875282694061473231430802931182402887619823554111768519767")
        )
        CircuitType.ADVANCED_D33 -> createAdvancedInput(
            depth = 33,
            stateRoot = BigInteger("12400225219538138888592621294927654626625453284850626509861183205940593313746")
        )
    }

    private fun createStandardInput(depth: Int, stateRoot: BigInteger): ZkCircuitInput.StandardTransferInput =
        ZkCircuitInput.StandardTransferInput(
            userPrivateKey = BigInteger("123456789123456789"),
            oldBalance = 1000L,
            oldSalt = BigInteger("999111"),
            newSalt = BigInteger("888222"),
            currentDailySpent = 100L,
            transferAmount = 42L,
            pathElements = generatePathElements(100, depth),
            pathIndices = generatePathIndices(depth),
            publicNullifier = BigInteger("6068792487108398707149403764947990335404296465852179553942298054649828303385"),
            oldCommitment = BigInteger("8428745149273434900138334885232042385859360879233173552899873421105457133996"),
            newCommitment = BigInteger("2286464865186034411311787289531807351100632270909984137600559467209196904567"),
            maxSingleTxLimit = 2000L,
            maxDailyLimit = 5000L,
            stateRoot = stateRoot
        )

    private fun createAdvancedInput(depth: Int, stateRoot: BigInteger): ZkCircuitInput.AdvancedTransferInput =
        ZkCircuitInput.AdvancedTransferInput(
            userPrivateKey = BigInteger("123456789123456789"),
            oldBalance = 1000L,
            oldSalt = BigInteger("999111"),
            newSalt = BigInteger("888222"),
            currentDailySpent = 100L,
            currentMonthlySpent = 500L,
            transferAmount = 42L,
            statePathElements = generatePathElements(500, depth),
            statePathIndices = generatePathIndices(depth),
            blacklistPathElements = generateBlacklistPathElements(),
            publicNullifier = BigInteger("6068792487108398707149403764947990335404296465852179553942298054649828303385"),
            oldCommitment = BigInteger("17813881758646158417372471634296620801072239794926302447307416292416763392563"),
            newCommitment = BigInteger("12871828892966285125524321732533388274803618702603568840201414232363870118352"),
            maxSingleTxLimit = 2000L,
            maxDailyLimit = 5000L,
            maxMonthlyLimit = 20000L,
            tier1WarningThreshold = 10000L,
            stateRoot = stateRoot,
            blacklistRoot = BigInteger("18512908201582940550497307157108523970286253999753491485812974818764111259687")
        )
}