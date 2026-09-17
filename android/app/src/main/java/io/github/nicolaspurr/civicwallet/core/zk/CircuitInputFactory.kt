package io.github.nicolaspurr.civicwallet.core.zk

import java.math.BigInteger

/**
 * Constructs production-grade [CircuitInput] instances by combining precomputed
 * static fixtures with transaction runtime parameters.
 *
 * The default scenario enforces a daily epoch rollover while keeping the monthly
 * epoch unchanged (`epochDay = oldEpochDay + 1`, `epochMonth = oldEpochMonth`).
 * This exercises both velocity rollover branches simultaneously (daily limit reset
 * and monthly counter carryover), targeting the most constraint-critical execution path.
 */
object CircuitInputFactory {

    private const val DEFAULT_TRANSFER_AMOUNT = 42L
    private const val MAX_SINGLE_TX = 2_000L
    private const val MAX_DAILY = 5_000L
    private const val MAX_MONTHLY = 20_000L
    private const val TIER1_THRESHOLD = 10_000L

    private val NEW_SALT = BigInteger("888222")
    private val NOTE_SALT = BigInteger("424242")
    private val RECIPIENT_PK = BigInteger("55512345678901234567890")
    private val ENCRYPTED_NOTE_HASH = BigInteger("777888999")

    fun fromFixture(
        type: CircuitType,
        fixture: ZkFixture,
        transferAmount: Long = DEFAULT_TRANSFER_AMOUNT
    ): CircuitInput {
        require(fixture.circuit == type.key) {
            "Fixture '${fixture.circuit}' does not match circuit '${type.key}'"
        }
        require(fixture.stateDepth == type.stateDepth) {
            "Fixture state depth ${fixture.stateDepth} != circuit ${type.stateDepth}"
        }

        val epochDay = fixture.oldEpochDay + 1
        val epochMonth = fixture.oldEpochMonth

        return if (type.isAdvanced) {
            CircuitInput.AdvancedTransferInput(
                circuit = type,
                stateRoot = BigInteger(fixture.stateRoot),
                blacklistRoot = BigInteger(
                    requireNotNull(fixture.blacklistRoot) { "Advanced fixture needs blacklistRoot" }
                ),
                epochDay = epochDay,
                epochMonth = epochMonth,
                maxSingleTxLimit = MAX_SINGLE_TX,
                maxDailyLimit = MAX_DAILY,
                maxMonthlyLimit = MAX_MONTHLY,
                tier1WarningThreshold = TIER1_THRESHOLD,
                encryptedNoteHash = ENCRYPTED_NOTE_HASH,
                userPrivateKey = BigInteger(fixture.userPrivateKey),
                oldBalance = fixture.oldBalance,
                oldSalt = BigInteger(fixture.oldSalt),
                oldDailySpent = fixture.oldDailySpent,
                oldMonthlySpent = fixture.oldMonthlySpent,
                oldEpochDay = fixture.oldEpochDay,
                oldEpochMonth = fixture.oldEpochMonth,
                newSalt = NEW_SALT,
                transferAmount = transferAmount,
                recipientPubKey = RECIPIENT_PK,
                noteSalt = NOTE_SALT,
                statePathElements = fixture.statePathElements.map(::BigInteger),
                statePathIndices = fixture.statePathIndices,
                blLowValue = BigInteger(requireNotNull(fixture.blLowValue)),
                blLowNextIndex = BigInteger(requireNotNull(fixture.blLowNextIndex)),
                blLowNextValue = BigInteger(requireNotNull(fixture.blLowNextValue)),
                blPathElements = requireNotNull(fixture.blPathElements).map(::BigInteger),
                blPathIndices = requireNotNull(fixture.blPathIndices)
            )
        } else {
            CircuitInput.StandardTransferInput(
                circuit = type,
                stateRoot = BigInteger(fixture.stateRoot),
                epochDay = epochDay,
                epochMonth = epochMonth,
                maxSingleTxLimit = MAX_SINGLE_TX,
                maxDailyLimit = MAX_DAILY,
                maxMonthlyLimit = MAX_MONTHLY,
                encryptedNoteHash = ENCRYPTED_NOTE_HASH,
                userPrivateKey = BigInteger(fixture.userPrivateKey),
                oldBalance = fixture.oldBalance,
                oldSalt = BigInteger(fixture.oldSalt),
                oldDailySpent = fixture.oldDailySpent,
                oldMonthlySpent = fixture.oldMonthlySpent,
                oldEpochDay = fixture.oldEpochDay,
                oldEpochMonth = fixture.oldEpochMonth,
                newSalt = NEW_SALT,
                transferAmount = transferAmount,
                recipientPubKey = RECIPIENT_PK,
                noteSalt = NOTE_SALT,
                statePathElements = fixture.statePathElements.map(::BigInteger),
                statePathIndices = fixture.statePathIndices
            )
        }
    }
}