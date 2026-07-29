pragma circom 2.1.5;

include "circomlib/circuits/poseidon.circom";
include "circomlib/circuits/bitify.circom";
include "circomlib/circuits/comparators.circom";
include "circomlib/circuits/switcher.circom";

/**
 * @title AdvancedAmlConfidential
 * @notice Advanced circuit with an SMT blacklist and an AML flag.
 */
template AdvancedAmlConfidential(stateTreeDepth, blacklistTreeDepth) {
    // --- PRIVATE INPUTS (Witness) ---
    signal input userPrivateKey;
    signal input oldBalance;
    signal input oldSalt;
    signal input newSalt;
    signal input currentDailySpent;
    signal input currentMonthlySpent;
    signal input transferAmount; // HIDDEN AMOUNT FOR FULL PRIVACY

    // State Tree inclusion
    signal input statePathElements[stateTreeDepth];
    signal input statePathIndices[stateTreeDepth];

    // Blacklist SMT non-inclusion
    signal input blacklistPathElements[blacklistTreeDepth];

    // --- PUBLIC INPUTS ---
    signal input publicNullifier;
    signal input oldCommitment;
    signal input newCommitment;
    signal input maxSingleTxLimit;
    signal input maxDailyLimit;
    signal input maxMonthlyLimit;
    signal input tier1WarningThreshold;
    signal input stateRoot;
    signal input blacklistRoot;

    // --- PUBLIC OUTPUTS ---
    signal output isTier1Exceeded; // AML flag

    // INTERMEDIATE SIGNALS
    signal newDailySpent;
    signal newMonthlySpent;
    signal newBalance;

    // BIT RESTRICTIONS (64-bit)
    component bitsOldBalance = Num2Bits(64);
    bitsOldBalance.in <== oldBalance;

    component bitsTransferAmount = Num2Bits(64);
    bitsTransferAmount.in <== transferAmount;

    component bitsDailySpent = Num2Bits(64);
    bitsDailySpent.in <== currentDailySpent;

    component bitsMonthlySpent = Num2Bits(64);
    bitsMonthlySpent.in <== currentMonthlySpent;

    // Old Commitment (Poseidon 5)
    component oldCommitmentHasher = Poseidon(5);
    oldCommitmentHasher.inputs[0] <== userPrivateKey;
    oldCommitmentHasher.inputs[1] <== oldBalance;
    oldCommitmentHasher.inputs[2] <== oldSalt;
    oldCommitmentHasher.inputs[3] <== currentDailySpent;
    oldCommitmentHasher.inputs[4] <== currentMonthlySpent;
    oldCommitmentHasher.out === oldCommitment;

    // State Merkle Tree
    component stateHashers[stateTreeDepth];
    component stateSwitchers[stateTreeDepth];

    signal currentStateHash[stateTreeDepth + 1];
    currentStateHash[0] <== oldCommitment;

    for (var i = 0; i < stateTreeDepth; i++) {
        statePathIndices[i] * (1 - statePathIndices[i]) === 0;

        stateSwitchers[i] = Switcher();
        stateSwitchers[i].L <== currentStateHash[i];
        stateSwitchers[i].R <== statePathElements[i];
        stateSwitchers[i].sel <== statePathIndices[i];

        stateHashers[i] = Poseidon(2);
        stateHashers[i].inputs[0] <== stateSwitchers[i].outL;
        stateHashers[i].inputs[1] <== stateSwitchers[i].outR;

        currentStateHash[i + 1] <== stateHashers[i].out;
    }
    currentStateHash[stateTreeDepth] === stateRoot;

    // Blacklist: proof of non-inclusion (Sparse Merkle Tree)
    component userIdentityHasher = Poseidon(1);
    userIdentityHasher.inputs[0] <== userPrivateKey;

    component identityBits = Num2Bits(254);
    identityBits.in <== userIdentityHasher.out;

    component blacklistHashers[blacklistTreeDepth];
    component blacklistSwitchers[blacklistTreeDepth];

    signal currentBlacklistHash[blacklistTreeDepth + 1];
    currentBlacklistHash[0] <== 0; // Empty leaf (value of 0 = not in the blacklist)

    for (var j = 0; j < blacklistTreeDepth; j++) {
        blacklistSwitchers[j] = Switcher();
        blacklistSwitchers[j].L <== currentBlacklistHash[j];
        blacklistSwitchers[j].R <== blacklistPathElements[j];
        blacklistSwitchers[j].sel <== identityBits.out[j];

        blacklistHashers[j] = Poseidon(2);
        blacklistHashers[j].inputs[0] <== blacklistSwitchers[j].outL;
        blacklistHashers[j].inputs[1] <== blacklistSwitchers[j].outR;

        currentBlacklistHash[j + 1] <== blacklistHashers[j].out;
    }
    currentBlacklistHash[blacklistTreeDepth] === blacklistRoot;

    // Nullifier generation
    component nullifierHasher = Poseidon(2);
    nullifierHasher.inputs[0] <== userPrivateKey;
    nullifierHasher.inputs[1] <== oldSalt;
    nullifierHasher.out === publicNullifier;

    // AML controls
    // A. Single transaction limit
    component ltSingleTx = LessThan(64);
    ltSingleTx.in[0] <== maxSingleTxLimit;
    ltSingleTx.in[1] <== transferAmount;
    ltSingleTx.out === 0;

    // B. Daily limit
    newDailySpent <== currentDailySpent + transferAmount;
    component bitsNewDailySpent = Num2Bits(64);
    bitsNewDailySpent.in <== newDailySpent;

    component ltDailyLimit = LessThan(64);
    ltDailyLimit.in[0] <== maxDailyLimit;
    ltDailyLimit.in[1] <== newDailySpent;
    ltDailyLimit.out === 0;

    // C. Monthly limit
    newMonthlySpent <== currentMonthlySpent + transferAmount;
    component bitsNewMonthlySpent = Num2Bits(64);
    bitsNewMonthlySpent.in <== newMonthlySpent;

    component ltMonthlyLimit = LessThan(64);
    ltMonthlyLimit.in[0] <== maxMonthlyLimit;
    ltMonthlyLimit.in[1] <== newMonthlySpent;
    ltMonthlyLimit.out === 0;

    // D. Tier-1 warning threshold
    // Zwraca 1 jeśli newMonthlySpent > tier1WarningThreshold, w przeciwnym razie 0
    component ltTier1 = LessThan(64);
    ltTier1.in[0] <== tier1WarningThreshold;
    ltTier1.in[1] <== newMonthlySpent;
    
    isTier1Exceeded <== ltTier1.out;

    // Solvency and new commitment
    component ltSolvency = LessThan(64);
    ltSolvency.in[0] <== oldBalance;
    ltSolvency.in[1] <== transferAmount;
    ltSolvency.out === 0;

    newBalance <== oldBalance - transferAmount;

    component newCommitmentHasher = Poseidon(5);
    newCommitmentHasher.inputs[0] <== userPrivateKey;
    newCommitmentHasher.inputs[1] <== newBalance;
    newCommitmentHasher.inputs[2] <== newSalt;
    newCommitmentHasher.inputs[3] <== newDailySpent;
    newCommitmentHasher.inputs[4] <== newMonthlySpent;
    newCommitmentHasher.out === newCommitment;
}
