pragma circom 2.1.5;

include "circomlib/circuits/poseidon.circom";
include "circomlib/circuits/comparators.circom";
include "circomlib/circuits/bitify.circom";
include "merkle.circom";

/*
 * ============================================================================
 *  UasCore - Core Transaction Circuit
 * ============================================================================
 *
 *  Account State Tuple:
 *      state = ( sk, balance, salt, dailySpent, monthlySpent, epochDay, epochMonth )
 *      cm    = Poseidon(7)(state)
 *
 *  Privacy Model:
 *      - oldCommitment: Private witness. Proven to exist in the state tree via 
 *        a Merkle membership proof without revealing the account index or leaf.
 *      - newCommitment: Public output. Appended as a new leaf in the state tree.
 *      Linkability between sequential states is severed because the old state
 *      is spent via an unlinkable nullifier.
 */
template UasCore(STATE_DEPTH) {

    // ---------------------------------------------------------------- //
    //  Public Inputs                                                   //
    // ---------------------------------------------------------------- //
    signal input stateRoot;             // Merkle root of the append-only state tree
    signal input epochDay;              // Current day index published by the coordinator
    signal input epochMonth;            // Current month index published by the coordinator
    signal input maxSingleTxLimit;      // Maximum limit allowed for a single transaction
    signal input maxDailyLimit;         // Maximum cumulative spending limit per day
    signal input maxMonthlyLimit;       // Maximum cumulative spending limit per month
    signal input encryptedNoteHash;     // Hash of the encrypted payload intended for recipient

    // ---------------------------------------------------------------- //
    //  Private Inputs (Witness)                                        //
    // ---------------------------------------------------------------- //
    signal input userPrivateKey;
    signal input oldBalance;
    signal input oldSalt;
    signal input oldDailySpent;
    signal input oldMonthlySpent;
    signal input oldEpochDay;
    signal input oldEpochMonth;

    signal input newSalt;
    signal input transferAmount;

    signal input recipientPubKey;       // Recipient's public key (kept hidden)
    signal input noteSalt;              // Blinding randomness for the transfer note

    signal input statePathElements[STATE_DEPTH];
    signal input statePathIndices[STATE_DEPTH];

    // ---------------------------------------------------------------- //
    //  Outputs                                                         //
    // ---------------------------------------------------------------- //
    signal output nullifier;            // Public nullifier to prevent double-spending
    signal output newCommitment;        // Public leaf to append to the state tree
    signal output noteCommitment;       // Public leaf to append to the recipient note tree

    // Internal intermediate output for optional AML/audit extensions
    signal output newMonthlySpentOut;

    // ================================================================ //
    //  1. Input Range Checks                                           //
    // ================================================================ //
    //  Constrain balances, amounts, and spending counters to 64 bits to
    //  prevent field arithmetic wrap-around (mod p) and ensure comparator
    //  soundness. Epochs are constrained to 32 bits.

    component rangeOldBalance      = Num2Bits(64);
    component rangeTransferAmount  = Num2Bits(64);
    component rangeOldDaily        = Num2Bits(64);
    component rangeOldMonthly      = Num2Bits(64);

    rangeOldBalance.in     <== oldBalance;
    rangeTransferAmount.in <== transferAmount;
    rangeOldDaily.in       <== oldDailySpent;
    rangeOldMonthly.in     <== oldMonthlySpent;

    component rangeOldEpochDay   = Num2Bits(32);
    component rangeOldEpochMonth = Num2Bits(32);
    rangeOldEpochDay.in   <== oldEpochDay;
    rangeOldEpochMonth.in <== oldEpochMonth;

    // ================================================================ //
    //  2. State Commitment Opening & Merkle Inclusion Proof            //
    // ================================================================ //

    component oldCommitmentHasher = Poseidon(7);
    oldCommitmentHasher.inputs[0] <== userPrivateKey;
    oldCommitmentHasher.inputs[1] <== oldBalance;
    oldCommitmentHasher.inputs[2] <== oldSalt;
    oldCommitmentHasher.inputs[3] <== oldDailySpent;
    oldCommitmentHasher.inputs[4] <== oldMonthlySpent;
    oldCommitmentHasher.inputs[5] <== oldEpochDay;
    oldCommitmentHasher.inputs[6] <== oldEpochMonth;

    // The existing state commitment remains private to the circuit
    signal oldCommitment;
    oldCommitment <== oldCommitmentHasher.out;

    component stateMerkle = MerkleInclusion(STATE_DEPTH);
    stateMerkle.leaf <== oldCommitment;
    for (var i = 0; i < STATE_DEPTH; i++) {
        stateMerkle.pathElements[i] <== statePathElements[i];
        stateMerkle.pathIndices[i]  <== statePathIndices[i];
    }
    stateMerkle.root === stateRoot;

    // ================================================================ //
    //  3. Nullifier Derivation                                         //
    // ================================================================ //
    //  Derives a deterministic, pseudorandom nullifier from the secret
    //  key and old state salt to uniquely invalidate the spent commitment.

    component nullifierHasher = Poseidon(2);
    nullifierHasher.inputs[0] <== userPrivateKey;
    nullifierHasher.inputs[1] <== oldSalt;
    nullifier <== nullifierHasher.out;

    // ================================================================ //
    //  4. Epoch Rollover & Spending Accumulation                       //
    // ================================================================ //
    //  Enforces non-decreasing epoch advancement and resets counters
    //  if a new period has started; otherwise, accumulates spending.

    component dayNotInPast   = LessEqThan(32);
    dayNotInPast.in[0]   <== oldEpochDay;
    dayNotInPast.in[1]   <== epochDay;
    dayNotInPast.out === 1;

    component monthNotInPast = LessEqThan(32);
    monthNotInPast.in[0] <== oldEpochMonth;
    monthNotInPast.in[1] <== epochMonth;
    monthNotInPast.out === 1;

    component sameDay   = IsEqual();
    sameDay.in[0]   <== oldEpochDay;
    sameDay.in[1]   <== epochDay;

    component sameMonth = IsEqual();
    sameMonth.in[0] <== oldEpochMonth;
    sameMonth.in[1] <== epochMonth;

    // Reset counters to 0 on new epoch; retain accumulated spend if same epoch
    signal carryDaily;
    signal carryMonthly;
    carryDaily   <== sameDay.out   * oldDailySpent;
    carryMonthly <== sameMonth.out * oldMonthlySpent;

    signal newDailySpent;
    signal newMonthlySpent;
    newDailySpent   <== carryDaily   + transferAmount;
    newMonthlySpent <== carryMonthly + transferAmount;

    newMonthlySpentOut <== newMonthlySpent;

    component rangeNewDaily   = Num2Bits(64);
    component rangeNewMonthly = Num2Bits(64);
    rangeNewDaily.in   <== newDailySpent;
    rangeNewMonthly.in <== newMonthlySpent;

    // ================================================================ //
    //  5. Solvency & Balance Conservation                              //
    // ================================================================ //

    signal newBalance;
    newBalance <== oldBalance - transferAmount;

    //  Constraining newBalance to 64 bits implicitly proves solvency:
    //  if transferAmount > oldBalance, underflow would wrap modulo p,
    //  violating the 64-bit boundary.
    component rangeNewBalance = Num2Bits(64);
    rangeNewBalance.in <== newBalance;

    // ================================================================ //
    //  6. Spending Limit Verification                                  //
    // ================================================================ //

    component singleTxOk = LessEqThan(64);
    singleTxOk.in[0] <== transferAmount;
    singleTxOk.in[1] <== maxSingleTxLimit;
    singleTxOk.out === 1;

    component dailyOk = LessEqThan(64);
    dailyOk.in[0] <== newDailySpent;
    dailyOk.in[1] <== maxDailyLimit;
    dailyOk.out === 1;

    component monthlyOk = LessEqThan(64);
    monthlyOk.in[0] <== newMonthlySpent;
    monthlyOk.in[1] <== maxMonthlyLimit;
    monthlyOk.out === 1;

    // ================================================================ //
    //  7. Updated State Commitment                                     //
    // ================================================================ //

    component newCommitmentHasher = Poseidon(7);
    newCommitmentHasher.inputs[0] <== userPrivateKey;
    newCommitmentHasher.inputs[1] <== newBalance;
    newCommitmentHasher.inputs[2] <== newSalt;
    newCommitmentHasher.inputs[3] <== newDailySpent;
    newCommitmentHasher.inputs[4] <== newMonthlySpent;
    newCommitmentHasher.inputs[5] <== epochDay;
    newCommitmentHasher.inputs[6] <== epochMonth;

    newCommitment <== newCommitmentHasher.out;

    // ================================================================ //
    //  8. Recipient Note Output                                        //
    // ================================================================ //
    //  Deducted funds are committed into an output note for the recipient.
    //  Using the same transferAmount signal in both balance deduction and 
    //  note commitment enforces conservation of value.

    component noteHasher = Poseidon(4);
    noteHasher.inputs[0] <== recipientPubKey;
    noteHasher.inputs[1] <== transferAmount;
    noteHasher.inputs[2] <== noteSalt;
    noteHasher.inputs[3] <== epochDay;

    noteCommitment <== noteHasher.out;

    // ================================================================ //
    //  9. Encrypted Note Binding                                       //
    // ================================================================ //
    //  Binds the encrypted note hash to the public inputs, preventing
    //  man-in-the-middle payload substitution. The quadratic constraint
    //  ensures the compiler optimizer does not discard this signal.
    signal encryptedNoteHashSquared;
    encryptedNoteHashSquared <== encryptedNoteHash * encryptedNoteHash;
}
