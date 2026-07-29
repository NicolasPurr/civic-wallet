const fs = require("fs");
const path = require("path");
const { buildPoseidon } = require("circomlibjs");

// BigInt conversion
function toLittleEndianBits(bigintVal, bitLength) {
    const bits = [];
    let temp = BigInt(bigintVal);
    for (let i = 0; i < bitLength; i++) {
        bits.push(Number(temp & 1n));
        temp >>= 1n;
    }
    return bits;
}

async function main() {
    const poseidon = await buildPoseidon();
    const F = poseidon.F;

    // Helper for Poseidon hasing
    const hash = (arr) => F.toObject(poseidon(arr.map(x => BigInt(x)))).toString();

    // --- SHARED INPUT DATA ---
    const userPrivateKey = "123456789123456789";
    const oldBalance = "1000";
    const transferAmount = "42";
    const oldSalt = "999111";
    const newSalt = "888222";
    const changeSalt = "777333";

    const newBalance = (BigInt(oldBalance) - BigInt(transferAmount)).toString();
    const publicNullifier = hash([userPrivateKey, oldSalt]);

    console.log("=========================================");
    console.log(" GENEROWANIE WEKTORÓW TESTOWYCH (7 CIRCUITS)");
    console.log("=========================================\n");

    // =========================================================================
    // Circuit A: Confidential Burn (Baseline)
    // =========================================================================
    {
        console.log("[+] Generate: Base Confidential Burn...");
        const oldCommitment = hash([userPrivateKey, oldBalance, oldSalt]);
        const changeCommitment = hash([userPrivateKey, newBalance, changeSalt]);

        const input = {
            userPrivateKey,
            oldBalance,
            oldSalt,
            changeSalt,
            transferAmount,
            publicNullifier,
            oldCommitment,
            changeCommitment
        };

        fs.writeFileSync("input_burn.json", JSON.stringify(input, null, 2));
        console.log("    -> Zapisano: input_burn.json");
    }

    // =========================================================================
    // Circuit B: Standard CBDC dla D in {21, 27, 33}
    // =========================================================================
    const standardDepths = [21, 27, 33];
    const currentDailySpent = "100";
    const maxSingleTxLimit = "2000";
    const maxDailyLimit = "5000";
    const newDailySpent = (BigInt(currentDailySpent) + BigInt(transferAmount)).toString();

    // Poseidon 4 commitment: [userPrivateKey, balance, salt, dailySpent]
    const oldCommitmentStandard = hash([userPrivateKey, oldBalance, oldSalt, currentDailySpent]);
    const newCommitmentStandard = hash([userPrivateKey, newBalance, newSalt, newDailySpent]);

    for (const depth of standardDepths) {
        console.log(`[+] Generating: Standard CBDC (D=${depth})...`);

        const pathElements = [];
        const pathIndices = [];
        let currentHash = oldCommitmentStandard;

        for (let i = 0; i < depth; i++) {
            const elem = (BigInt(i) + 100n).toString();
            const idx = i % 2;

            pathElements.push(elem);
            pathIndices.push(idx);

            const left = idx === 0 ? currentHash : elem;
            const right = idx === 0 ? elem : currentHash;
            currentHash = hash([left, right]);
        }

        const stateRoot = currentHash;

        const input = {
            userPrivateKey,
            oldBalance,
            oldSalt,
            newSalt,
            currentDailySpent,
            transferAmount,
            pathElements,
            pathIndices,
            publicNullifier,
            oldCommitment: oldCommitmentStandard,
            newCommitment: newCommitmentStandard,
            maxSingleTxLimit,
            maxDailyLimit,
            stateRoot
        };

        const filename = `input_standard_d${depth}.json`;
        fs.writeFileSync(filename, JSON.stringify(input, null, 2));
        console.log(`    -> Saved: ${filename}`);
    }

    // =========================================================================
    // 3. OBWÓD C: Advanced AML dla D in {21, 27, 33} (Blacklist SMT = 160)
    // =========================================================================
    const advancedDepths = [21, 27, 33];
    const blacklistDepth = 160;

    const currentMonthlySpent = "500";
    const maxMonthlyLimit = "20000";
    const tier1WarningThreshold = "10000";
    const newMonthlySpent = (BigInt(currentMonthlySpent) + BigInt(transferAmount)).toString();

    // Poseidon 5 commitment: [userPrivateKey, balance, salt, dailySpent, monthlySpent]
    const oldCommitmentAdvanced = hash([userPrivateKey, oldBalance, oldSalt, currentDailySpent, currentMonthlySpent]);
    const newCommitmentAdvanced = hash([userPrivateKey, newBalance, newSalt, newDailySpent, newMonthlySpent]);

    // Calculating SMT black-list path (independent of state tree depth)
    const userIdentity = hash([userPrivateKey]);
    const identityBits = toLittleEndianBits(userIdentity, 254);

    const blacklistPathElements = [];
    let currentBlacklistHash = "0"; // Empty leaf = 0

    for (let j = 0; j < blacklistDepth; j++) {
        const elem = (BigInt(j) + 1000n).toString();
        blacklistPathElements.push(elem);

        const sel = identityBits[j];
        const left = sel === 0 ? currentBlacklistHash : elem;
        const right = sel === 0 ? elem : currentBlacklistHash;
        currentBlacklistHash = hash([left, right]);
    }
    const blacklistRoot = currentBlacklistHash;

    for (const depth of advancedDepths) {
        console.log(`[+] Generating: Advanced AML (State D=${depth}, SMT=${blacklistDepth})...`);

        const statePathElements = [];
        const statePathIndices = [];
        let currentStateHash = oldCommitmentAdvanced;

        for (let i = 0; i < depth; i++) {
            const elem = (BigInt(i) + 500n).toString();
            const idx = i % 2;

            statePathElements.push(elem);
            statePathIndices.push(idx);

            const left = idx === 0 ? currentStateHash : elem;
            const right = idx === 0 ? elem : currentStateHash;
            currentStateHash = hash([left, right]);
        }
        const stateRoot = currentStateHash;

        const input = {
            userPrivateKey,
            oldBalance,
            oldSalt,
            newSalt,
            currentDailySpent,
            currentMonthlySpent,
            transferAmount,
            statePathElements,
            statePathIndices,
            blacklistPathElements,
            publicNullifier,
            oldCommitment: oldCommitmentAdvanced,
            newCommitment: newCommitmentAdvanced,
            maxSingleTxLimit,
            maxDailyLimit,
            maxMonthlyLimit,
            tier1WarningThreshold,
            stateRoot,
            blacklistRoot
        };

        const filename = `input_advanced_d${depth}.json`;
        fs.writeFileSync(filename, JSON.stringify(input, null, 2));
        console.log(`    -> Saved: ${filename}`);
    }

    console.log("\n=========================================");
    console.log(" SUCCESS!");
    console.log("=========================================");
}

main().catch(console.error);
