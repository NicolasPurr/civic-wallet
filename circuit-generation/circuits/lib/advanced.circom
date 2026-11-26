pragma circom 2.1.5;

include "circomlib/circuits/comparators.circom";
include "uas_core.circom";
include "blacklist.circom";

/*
 * AdvancedAmlConfidential - full compliance confidential transfer circuit.
 *
 * Circuit template without a main component.
 * Integrates UasCore (account state transitions, periodic spending limits,
 * and Poseidon(7) state commitments) with BlacklistNonMembership to enforce
 * blacklist exclusion checks on the sender.
 */
template AdvancedAmlConfidential(STATE_DEPTH, BL_DEPTH) {

    signal input stateRoot;
    signal input blacklistRoot;
    signal input epochDay;
    signal input epochMonth;
    signal input maxSingleTxLimit;
    signal input maxDailyLimit;
    signal input maxMonthlyLimit;
    signal input tier1WarningThreshold;
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

    signal input blLowValue;
    signal input blLowNextIndex;
    signal input blLowNextValue;
    signal input blPathElements[BL_DEPTH];
    signal input blPathIndices[BL_DEPTH];

    signal output nullifier;
    signal output newCommitment;
    signal output noteCommitment;
    signal output isTier1Exceeded;

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

    component blacklist = BlacklistNonMembership(BL_DEPTH);
    blacklist.userPrivateKey <== userPrivateKey;
    blacklist.blacklistRoot  <== blacklistRoot;
    blacklist.blLowValue     <== blLowValue;
    blacklist.blLowNextIndex <== blLowNextIndex;
    blacklist.blLowNextValue <== blLowNextValue;
    for (var i = 0; i < BL_DEPTH; i++) {
        blacklist.blPathElements[i] <== blPathElements[i];
        blacklist.blPathIndices[i]  <== blPathIndices[i];
    }

    // Tier-1 AML warning flag: exposes a single bit indicating whether
    // monthly spending exceeds the threshold without revealing the actual spent amount.
    component tier1 = LessThan(64);
    tier1.in[0] <== tier1WarningThreshold;
    tier1.in[1] <== core.newMonthlySpentOut;
    isTier1Exceeded <== tier1.out;
}
