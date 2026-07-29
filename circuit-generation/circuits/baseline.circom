pragma circom 2.1.5;

include "circomlib/circuits/poseidon.circom";
include "circomlib/circuits/bitify.circom";
include "circomlib/circuits/comparators.circom";

/**
 * @title BaselineConfidentialBurn
 * @notice Simple burn circuit with a confidential amount.
 */
template ConfidentialBurnUtxoTransfer() {
    // --- PRIVATE INPUTS (Witness) ---
    signal input userPrivateKey;
    signal input oldBalance;
    signal input oldSalt;
    signal input changeSalt;
    signal input transferAmount; // HIDDEN AMOUNT FOR FULL PRIVACY

    // --- PUBLIC INPUTS ---
    signal input publicNullifier;
    signal input oldCommitment;
    signal input changeCommitment;

    // --- INTERMEDIATE SIGNALS ---
    signal newBalance;

    // Range check
    component bitsOldBalance = Num2Bits(64);
    bitsOldBalance.in <== oldBalance;

    component bitsTransferAmount = Num2Bits(64);
    bitsTransferAmount.in <== transferAmount;

    // Old commitment check
    component oldCommitmentHasher = Poseidon(3);
    oldCommitmentHasher.inputs[0] <== userPrivateKey;
    oldCommitmentHasher.inputs[1] <== oldBalance;
    oldCommitmentHasher.inputs[2] <== oldSalt;
    oldCommitmentHasher.out === oldCommitment;

    // Nullifier generation
    component nullifierHasher = Poseidon(2);
    nullifierHasher.inputs[0] <== userPrivateKey;
    nullifierHasher.inputs[1] <== oldSalt;
    nullifierHasher.out === publicNullifier;

    // Solvency check
    component lt = LessThan(64);
    lt.in[0] <== oldBalance;
    lt.in[1] <== transferAmount;
    lt.out === 0; // 0 means that oldBalance NOT < transferAmount => oldBalance >= transferAmount

    // Change commitment
    newBalance <== oldBalance - transferAmount;

    // Additional bit check for the new balance
    component bitsNewBalance = Num2Bits(64);
    bitsNewBalance.in <== newBalance;

    component changeHasher = Poseidon(3);
    changeHasher.inputs[0] <== userPrivateKey;
    changeHasher.inputs[1] <== newBalance;
    changeHasher.inputs[2] <== changeSalt;
    changeHasher.out === changeCommitment;
}

// Main component
component main {
    public [
        publicNullifier,
        oldCommitment,
        changeCommitment
    ]
} = ConfidentialBurnUtxoTransfer();
