pragma circom 2.1.5;
include "./ref/StandardCbdcConfidential.circom";
component main { public [ publicNullifier, oldCommitment, newCommitment, maxSingleTxLimit, maxDailyLimit, stateRoot ] } = StandardCbdcConfidential(33);
