pragma circom 2.1.5;

include "circomlib/circuits/poseidon.circom";
include "circomlib/circuits/bitify.circom";
include "circomlib/circuits/comparators.circom";
include "circomlib/circuits/switcher.circom";

/**
 * @title StandardCbdcConfidential
 * @notice Standard mobile CBDC transaction.
 * @param levels State MT depth (e.g., 21, 27, 33).
 */
template StandardCbdcConfidential(levels) {
    // --- PRIVATE INPUTS (Witness) ---
    signal input userPrivateKey;
    signal input oldBalance;
    signal input oldSalt;
    signal input newSalt;
    signal input currentDailySpent;
    signal input transferAmount; // HIDDEN AMOUNT FOR FULL PRIVACY

    // Merkle path for verification
    signal input pathElements[levels];
    signal input pathIndices[levels];

    // --- PUBLIC INPUTS ---
    signal input publicNullifier;
    signal input oldCommitment;
    signal input newCommitment;
    signal input maxSingleTxLimit;
    signal input maxDailyLimit;
    signal input stateRoot;

    // --- INTERMEDIATE SIGNALS ---
    signal newBalance;
    signal newDailySpent;

    // 64-bit range checks
    component bitsOldBalance = Num2Bits(64);
    bitsOldBalance.in <== oldBalance;

    component bitsTransferAmount = Num2Bits(64);
    bitsTransferAmount.in <== transferAmount;

    component bitsDailySpent = Num2Bits(64);
    bitsDailySpent.in <== currentDailySpent;

    // Old commitment verification (Poseidon 4)
    component oldCommitmentHasher = Poseidon(4);
    oldCommitmentHasher.inputs[0] <== userPrivateKey;
    oldCommitmentHasher.inputs[1] <== oldBalance;
    oldCommitmentHasher.inputs[2] <== oldSalt;
    oldCommitmentHasher.inputs[3] <== currentDailySpent;
    oldCommitmentHasher.out === oldCommitment;

    // MT inclusion verification
    component hashers[levels];
    component switchers[levels];

    signal currentHash[levels + 1];
    currentHash[0] <== oldCommitment;

    for (var i = 0; i < levels; i++) {
        pathIndices[i] * (1 - pathIndices[i]) === 0; // Checking the index bit

        switchers[i] = Switcher();
        switchers[i].L <== currentHash[i];
        switchers[i].R <== pathElements[i];
        switchers[i].sel <== pathIndices[i];

        hashers[i] = Poseidon(2);
        hashers[i].inputs[0] <== switchers[i].outL;
        hashers[i].inputs[1] <== switchers[i].outR;

        currentHash[i + 1] <== hashers[i].out;
    }
    currentHash[levels] === stateRoot;

    // Nullifier generation (anti-double-spending)
    component nullifierHasher = Poseidon(2);
    nullifierHasher.inputs[0] <== userPrivateKey;
    nullifierHasher.inputs[1] <== oldSalt;
    nullifierHasher.out === publicNullifier;

    //  AML controls
    // Single transacion limit
    component ltSingleTx = LessThan(64);
    ltSingleTx.in[0] <== maxSingleTxLimit;
    ltSingleTx.in[1] <== transferAmount;
    ltSingleTx.out === 0; // Wymusza: maxSingleTxLimit >= transferAmount

    // Daily limit
    newDailySpent <== currentDailySpent + transferAmount;

    component bitsNewDailySpent = Num2Bits(64);
    bitsNewDailySpent.in <== newDailySpent;

    component ltDailyLimit = LessThan(64);
    ltDailyLimit.in[0] <== maxDailyLimit;
    ltDailyLimit.in[1] <== newDailySpent;
    ltDailyLimit.out === 0; // Enforces maxDailyLimit >= newDailySpent

    // Solvency check
    component ltSolvency = LessThan(64);
    ltSolvency.in[0] <== oldBalance;
    ltSolvency.in[1] <== transferAmount;
    ltSolvency.out === 0;

    // New state commitment
    newBalance <== oldBalance - transferAmount;

    component newCommitmentHasher = Poseidon(4);
    newCommitmentHasher.inputs[0] <== userPrivateKey;
    newCommitmentHasher.inputs[1] <== newBalance;
    newCommitmentHasher.inputs[2] <== newSalt;
    newCommitmentHasher.inputs[3] <== newDailySpent;
    newCommitmentHasher.out === newCommitment;
}
