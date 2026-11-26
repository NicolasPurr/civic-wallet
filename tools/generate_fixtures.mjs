#!/usr/bin/env node
/**
 * generate_fixtures.mjs - generate a test vector for every circuit variant.
 *
 * The v2 circuits compute the commitments themselves and check that the
 * Merkle root rebuilt from the path equals the public root. Unlike in v1, the
 * app can therefore not use arbitrary numbers: the roots must be consistent
 * with the paths and the account state, which needs a Poseidon
 * implementation. That is why the vectors are generated offline here.
 *
 * Usage (from the project root):
 *   npm i circomlibjs
 *   node tools/generate_fixtures.mjs
 *   FIXTURE_SEED=thesis node tools/generate_fixtures.mjs   # reproducible output
 *
 * Output:
 *   build/fixtures/<variant>.json      test vector for the app (run.sh copies it to assets)
 *   build/inputs/<variant>.input.json  full circuit input, for tools/verify_fixtures.sh
 */

import { buildPoseidon } from "circomlibjs";
import { writeFileSync, mkdirSync, readFileSync } from "fs";
import { randomBytes, createHash } from "crypto";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

const ROOT_DIR = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const OUT_DIR = process.env.OUT_DIR ?? resolve(ROOT_DIR, "build/fixtures");
const INPUT_DIR = process.env.INPUT_DIR ?? resolve(ROOT_DIR, "build/inputs");
const VARIANTS_FILE = resolve(ROOT_DIR, "circuit-generation/variants.conf");

// Transaction parameters. These MUST match the constants in
// ZkCircuitInputFactory (android/.../ZkCircuitInput.kt); otherwise the check
// on the laptop tests something other than what the app actually sends to the
// witness generator.
const TX = {
  newSalt: 888222n,
  noteSalt: 424242n,
  recipientPubKey: 55512345678901234567890n,
  encryptedNoteHash: 777888999n,
  transferAmount: 42n,
  maxSingleTxLimit: 2000n,
  maxDailyLimit: 5000n,
  maxMonthlyLimit: 20000n,
  tier1WarningThreshold: 10000n,
};

// Account state. The app must use the same values, because the state tree
// leaf is computed from them.
const STATE = {
  userPrivateKey: 123456789123456789n,
  oldBalance: 1000n,
  oldSalt: 999111n,
  oldDailySpent: 100n,
  oldMonthlySpent: 500n,
  oldEpochDay: 20000n, // days since 1970-01-01 = 2024-10-04
  oldEpochMonth: 657n, // months since January 1970 = October 2024
};

// Variants come from the same file that build.sh and run.sh use.
function readVariants() {
  return readFileSync(VARIANTS_FILE, "utf8")
    .split("\n")
    .map((line) => line.replace(/#.*/, "").trim())
    .filter((line) => line.length > 0)
    .map((line) => {
      const [key, , stateDepth, blDepth] = line.split(/\s+/);
      return { key, stateDepth: Number(stateDepth), blDepth: Number(blDepth) };
    });
}

// Random bytes. With FIXTURE_SEED set, the bytes are derived from the seed
// (SHA-256 of seed and counter), so the same seed always gives the same vectors.
const SEED = process.env.FIXTURE_SEED;
let seedCounter = 0;
function randomBytesN(n) {
  if (SEED === undefined) return randomBytes(n);
  return createHash("sha256").update(`${SEED}:${seedCounter++}`).digest().subarray(0, n);
}

// Random 248-bit value: always below the BN254 field modulus (~2^254).
function randomFieldElement() {
  return BigInt("0x" + randomBytesN(31).toString("hex"));
}

/**
 * Build a random Merkle path for `leaf` and compute the root from it.
 * Any path is valid as long as the root is computed from that same path.
 * The hashing order must match DualMux in merkle.circom:
 *   index 0 -> H(node, sibling);  index 1 -> H(sibling, node)
 */
function buildPath(H, leaf, depth) {
  const elements = [];
  const indices = [];
  let node = leaf;
  for (let i = 0; i < depth; i++) {
    const sibling = randomFieldElement();
    const idx = randomBytesN(1)[0] & 1;
    elements.push(sibling);
    indices.push(idx);
    node = idx === 0 ? H([node, sibling]) : H([sibling, node]);
  }
  return { root: node, elements, indices };
}

async function main() {
  const poseidon = await buildPoseidon();
  const F = poseidon.F;
  const H = (arr) => F.toObject(poseidon(arr));

  mkdirSync(OUT_DIR, { recursive: true });
  mkdirSync(INPUT_DIR, { recursive: true });

  for (const v of readVariants()) {
    // ---- State tree leaf and membership path ---------------------------- //
    const stateLeaf = H([
      STATE.userPrivateKey, STATE.oldBalance, STATE.oldSalt,
      STATE.oldDailySpent, STATE.oldMonthlySpent,
      STATE.oldEpochDay, STATE.oldEpochMonth,
    ]);

    const { root: stateRoot, elements: stateEls, indices: stateIdx } =
      buildPath(H, stateLeaf, v.stateDepth);

    const fixture = {
      circuit: v.key,
      stateDepth: v.stateDepth,
      blacklistDepth: v.blDepth,
      userPrivateKey: STATE.userPrivateKey.toString(),
      oldBalance: Number(STATE.oldBalance),
      oldSalt: STATE.oldSalt.toString(),
      oldDailySpent: Number(STATE.oldDailySpent),
      oldMonthlySpent: Number(STATE.oldMonthlySpent),
      oldEpochDay: Number(STATE.oldEpochDay),
      oldEpochMonth: Number(STATE.oldEpochMonth),
      stateRoot: stateRoot.toString(),
      statePathElements: stateEls.map(String),
      statePathIndices: stateIdx,
    };

    // ---- Blacklist non-membership proof (advanced variants only) -------- //
    if (v.blDepth > 0) {
      // Identity key: the low 128 bits of the canonical Poseidon(sk). Must
      // match Num2Bits_strict + Bits2Num(128) in the circuit.
      const idFull = H([STATE.userPrivateKey]);
      const idKey = idFull & ((1n << 128n) - 1n);

      if (idKey === 0n || idKey === (1n << 128n) - 1n) {
        throw new Error("Degenerate identity key; change userPrivateKey");
      }

      // Low leaf of the indexed tree: lowValue < idKey < nextValue proves
      // that idKey is not in the list.
      const lowValue = idKey - 1n;
      const nextValue = idKey + 1n;
      const nextIndex = 7n; // arbitrary; the circuit only hashes it

      const blLeaf = H([lowValue, nextIndex, nextValue]);
      const { root: blRoot, elements: blEls, indices: blIdx } =
        buildPath(H, blLeaf, v.blDepth);

      Object.assign(fixture, {
        blacklistRoot: blRoot.toString(),
        blLowValue: lowValue.toString(),
        blLowNextIndex: nextIndex.toString(),
        blLowNextValue: nextValue.toString(),
        blPathElements: blEls.map(String),
        blPathIndices: blIdx,
      });
    }

    // ---- 1. Test vector for the app (with metadata) --------------------- //
    const fixturePath = `${OUT_DIR}/${v.key}.json`;
    writeFileSync(fixturePath, JSON.stringify(fixture, null, 2));

    // ---- 2. Full circuit input, for checking on the laptop -------------- //
    // Mirrors ZkCircuitInputFactory.fromFixture(): the day moves forward by
    // one within the same month, and scalars are written as one-element arrays.
    const epochDay = BigInt(fixture.oldEpochDay) + 1n;
    const epochMonth = BigInt(fixture.oldEpochMonth);
    const S = (x) => [String(x)];

    const input = {
      stateRoot: S(fixture.stateRoot),
      epochDay: S(epochDay),
      epochMonth: S(epochMonth),
      maxSingleTxLimit: S(TX.maxSingleTxLimit),
      maxDailyLimit: S(TX.maxDailyLimit),
      maxMonthlyLimit: S(TX.maxMonthlyLimit),
      encryptedNoteHash: S(TX.encryptedNoteHash),
      userPrivateKey: S(fixture.userPrivateKey),
      oldBalance: S(fixture.oldBalance),
      oldSalt: S(fixture.oldSalt),
      oldDailySpent: S(fixture.oldDailySpent),
      oldMonthlySpent: S(fixture.oldMonthlySpent),
      oldEpochDay: S(fixture.oldEpochDay),
      oldEpochMonth: S(fixture.oldEpochMonth),
      newSalt: S(TX.newSalt),
      transferAmount: S(TX.transferAmount),
      recipientPubKey: S(TX.recipientPubKey),
      noteSalt: S(TX.noteSalt),
      statePathElements: fixture.statePathElements,
      statePathIndices: fixture.statePathIndices.map(String),
    };

    if (v.blDepth > 0) {
      Object.assign(input, {
        blacklistRoot: S(fixture.blacklistRoot),
        tier1WarningThreshold: S(TX.tier1WarningThreshold),
        blLowValue: S(fixture.blLowValue),
        blLowNextIndex: S(fixture.blLowNextIndex),
        blLowNextValue: S(fixture.blLowNextValue),
        blPathElements: fixture.blPathElements,
        blPathIndices: fixture.blPathIndices.map(String),
      });
    }

    const inputPath = `${INPUT_DIR}/${v.key}.input.json`;
    writeFileSync(inputPath, JSON.stringify(input, null, 2));

    console.log(`wrote ${fixturePath} + ${inputPath}  (D=${v.stateDepth}, BL=${v.blDepth})`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
