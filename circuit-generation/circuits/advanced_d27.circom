pragma circom 2.1.5;
include "./ref/AdvancedAmlConfidential.circom";
component main { public [ publicNullifier, oldCommitment, newCommitment, maxSingleTxLimit, maxDailyLimit, maxMonthlyLimit, tier1WarningThreshold, stateRoot, blacklistRoot ] } = AdvancedAmlConfidential(27, 160);
