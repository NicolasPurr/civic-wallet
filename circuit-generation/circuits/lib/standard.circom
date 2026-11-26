pragma circom 2.1.5;

include "uas_core.circom";

/*
 * StandardCbdcConfidential - micropayment confidential transfer circuit.
 *
 * Circuit template without a main component.
 * Enforces periodic spending limits (daily and monthly) via UasCore to prevent
 * structuring/smurfing, omitting blacklist checks and tier-1 monitoring flags.
 */
template StandardCbdcConfidential(STATE_DEPTH) {

    signal input stateRoot;
    signal input epochDay;
    signal input epochMonth;
    signal input maxSingleTxLimit;
    signal input maxDailyLimit;
    signal input maxMonthlyLimit;
    signal input encryptedNoteHash;

    signal input userPrivateKey;
    signal input oldBalance;
    signal input oldSalt;
    signal input oldDailySpent;
    signal input oldMonthlySpent;
    signal input oldEpochDay;
    signal input oldEpochMonth;
    signal input newSalt;
    signal input transferAmount;
    signal input recipientPubKey;
    signal input noteSalt;
    signal input statePathElements[STATE_DEPTH];
    signal input statePathIndices[STATE_DEPTH];

    signal output nullifier;
    signal output newCommitment;
    signal output noteCommitment;

    component core = UasCore(STATE_DEPTH);

    core.stateRoot          <== stateRoot;
    core.epochDay           <== epochDay;
    core.epochMonth         <== epochMonth;
    core.maxSingleTxLimit   <== maxSingleTxLimit;
    core.maxDailyLimit      <== maxDailyLimit;
    core.maxMonthlyLimit    <== maxMonthlyLimit;
    core.encryptedNoteHash  <== encryptedNoteHash;

    core.userPrivateKey  <== userPrivateKey;
    core.oldBalance      <== oldBalance;
    core.oldSalt         <== oldSalt;
    core.oldDailySpent   <== oldDailySpent;
    core.oldMonthlySpent <== oldMonthlySpent;
    core.oldEpochDay     <== oldEpochDay;
    core.oldEpochMonth   <== oldEpochMonth;
    core.newSalt         <== newSalt;
    core.transferAmount  <== transferAmount;
    core.recipientPubKey <== recipientPubKey;
    core.noteSalt        <== noteSalt;

    for (var i = 0; i < STATE_DEPTH; i++) {
        core.statePathElements[i] <== statePathElements[i];
        core.statePathIndices[i]  <== statePathIndices[i];
    }

    nullifier      <== core.nullifier;
    newCommitment  <== core.newCommitment;
    noteCommitment <== core.noteCommitment;
}
