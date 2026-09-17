#!/usr/bin/env node
/**
 * generate_fixtures.mjs
 *
 * Generuje wektory testowe dla wszystkich wariantów obwodu.
 *
 * Konieczność: obwód v2 sam wylicza zobowiązania i porównuje odtworzony korzeń
 * drzewa z korzeniem publicznym. Nie da się zatem — jak w v1 — wstrzyknąć
 * dowolnych liczb; korzenie muszą być spójne ze ścieżkami i z krotką stanu,
 * co wymaga implementacji Poseidona. Stąd generowanie offline.
 *
 *   npm i circomlibjs
 *   node tools/generate_fixtures.mjs > /dev/null
 *
 * Wynik: build/fixtures/<key>.json  (wektor dla aplikacji)
 *         build/inputs/<key>.input.json  (pełne wejście do weryfikacji)
 */

import { buildPoseidon } from "circomlibjs";
import { writeFileSync, mkdirSync } from "fs";
import { randomBytes } from "crypto";

const OUT_DIR   = process.env.OUT_DIR   ?? "build/fixtures";
const INPUT_DIR = process.env.INPUT_DIR ?? "build/inputs";
// OUT_DIR trafia do assets aplikacji przez run.sh (FIXTURES_SRC), osobno dla
// każdego obwodu — APK obsługuje dokładnie jeden wariant naraz.

// Parametry transakcji. MUSZĄ być identyczne ze stałymi w ZkCircuitInputFactory
// (android/.../ZkCircuitInput.kt) — inaczej weryfikacja na laptopie sprawdzałaby
// coś innego niż to, co aplikacja rzeczywiście wysyła do generatora świadka.
const TX = {
  newSalt:              888222n,
  noteSalt:             424242n,
  recipientPubKey:      55512345678901234567890n,
  encryptedNoteHash:    777888999n,
  transferAmount:       42n,
  maxSingleTxLimit:     2000n,
  maxDailyLimit:        5000n,
  maxMonthlyLimit:      20000n,
  tier1WarningThreshold: 10000n,
};

const VARIANTS = [
  { key: "standard_metro",       stateDepth: 41, blDepth: 0  },
  { key: "standard_nation",      stateDepth: 44, blDepth: 0  },
  { key: "standard_union",       stateDepth: 47, blDepth: 0  },
  { key: "standard_global",      stateDepth: 51, blDepth: 0  },
  { key: "advanced_metro",       stateDepth: 41, blDepth: 23 },
  { key: "advanced_nation",      stateDepth: 44, blDepth: 23 },
  { key: "advanced_union",       stateDepth: 47, blDepth: 26 },
  { key: "advanced_global",      stateDepth: 51, blDepth: 29 },
  // kontrola ablacyjna — nie jest wariantem wdrożeniowym
  { key: "advanced_union_bl160", stateDepth: 47, blDepth: 160 },
];

// Stan konta. Te same wartości muszą trafić do aplikacji, bo z nich liczony
// jest liść drzewa stanu.
const STATE = {
  userPrivateKey: 123456789123456789n,
  oldBalance:     1000n,
  oldSalt:        999111n,
  oldDailySpent:  100n,
  oldMonthlySpent: 500n,
  oldEpochDay:    20000n,   // ~2024-10, licząc od epoki uniksowej w dobach
  oldEpochMonth:  657n,
};

const rand = () => BigInteger254();
function BigInteger254() {
  // losowy element ciała z bezpiecznym marginesem poniżej modułu BN254
  return BigInt("0x" + randomBytes(31).toString("hex"));
}

const main = async () => {
  const poseidon = await buildPoseidon();
  const F = poseidon.F;
  const H = (arr) => F.toObject(poseidon(arr));

  mkdirSync(OUT_DIR, { recursive: true });
  mkdirSync(INPUT_DIR, { recursive: true });

  for (const v of VARIANTS) {
    // ---- liść drzewa stanu -------------------------------------------- //
    const stateLeaf = H([
      STATE.userPrivateKey, STATE.oldBalance, STATE.oldSalt,
      STATE.oldDailySpent, STATE.oldMonthlySpent,
      STATE.oldEpochDay, STATE.oldEpochMonth,
    ]);

    // Dowolna ścieżka jest poprawna, o ile korzeń wyliczymy z niej samej.
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

    // ---- dowód nie-członkostwa na liście sankcyjnej -------------------- //
    if (v.blDepth > 0) {
      // Klucz tożsamości: 128 najmłodszych bitów kanonicznej reprezentacji
      // Poseidon(sk). Musi odpowiadać Num2Bits_strict + Bits2Num(128) w obwodzie.
      const idFull = H([STATE.userPrivateKey]);
      const idKey = idFull & ((1n << 128n) - 1n);

      if (idKey === 0n || idKey === (1n << 128n) - 1n) {
        throw new Error("Degenerate identity key; change userPrivateKey");
      }

      // Liść poprzedzający domykający lukę wokół idKey.
      const lowValue = idKey - 1n;
      const nextValue = idKey + 1n;
      const nextIndex = 7n; // dowolny indeks następnika

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

    // --- 1. wektor dla aplikacji (z metadanymi) ------------------------ //
    const fixturePath = `${OUT_DIR}/${v.key}.json`;
    writeFileSync(fixturePath, JSON.stringify(fixture, null, 2));

    // --- 2. kompletne wejście obwodu (do weryfikacji na laptopie) ------- //
    // Odtwarza dokładnie to, co buduje ZkCircuitInputFactory.fromFixture():
    // rotację doby przy zachowaniu miesiąca oraz konwencję zapisu skalarów
    // jako jednoelementowych tablic.
    const epochDay = BigInt(fixture.oldEpochDay) + 1n;
    const epochMonth = BigInt(fixture.oldEpochMonth);
    const S = (x) => [String(x)];

    const input = {
      stateRoot:         S(fixture.stateRoot),
      epochDay:          S(epochDay),
      epochMonth:        S(epochMonth),
      maxSingleTxLimit:  S(TX.maxSingleTxLimit),
      maxDailyLimit:     S(TX.maxDailyLimit),
      maxMonthlyLimit:   S(TX.maxMonthlyLimit),
      encryptedNoteHash: S(TX.encryptedNoteHash),
      userPrivateKey:    S(fixture.userPrivateKey),
      oldBalance:        S(fixture.oldBalance),
      oldSalt:           S(fixture.oldSalt),
      oldDailySpent:     S(fixture.oldDailySpent),
      oldMonthlySpent:   S(fixture.oldMonthlySpent),
      oldEpochDay:       S(fixture.oldEpochDay),
      oldEpochMonth:     S(fixture.oldEpochMonth),
      newSalt:           S(TX.newSalt),
      transferAmount:    S(TX.transferAmount),
      recipientPubKey:   S(TX.recipientPubKey),
      noteSalt:          S(TX.noteSalt),
      statePathElements: fixture.statePathElements,
      statePathIndices:  fixture.statePathIndices.map(String),
    };

    if (v.blDepth > 0) {
      Object.assign(input, {
        blacklistRoot:         S(fixture.blacklistRoot),
        tier1WarningThreshold: S(TX.tier1WarningThreshold),
        blLowValue:            S(fixture.blLowValue),
        blLowNextIndex:        S(fixture.blLowNextIndex),
        blLowNextValue:        S(fixture.blLowNextValue),
        blPathElements:        fixture.blPathElements,
        blPathIndices:         fixture.blPathIndices.map(String),
      });
    }

    const inputPath = `${INPUT_DIR}/${v.key}.input.json`;
    writeFileSync(inputPath, JSON.stringify(input, null, 2));

    console.error(`wrote ${fixturePath} + ${inputPath}  (D=${v.stateDepth}, BL=${v.blDepth})`);
  }
};

/**
 * Buduje losową ścieżkę uwierzytelniającą i wylicza z niej korzeń.
 * Kierunek mieszania musi odpowiadać DualMux w merkle.circom:
 *   index = 0 -> (node, sibling);  index = 1 -> (sibling, node)
 */
function buildPath(H, leaf, depth) {
  const elements = [];
  const indices = [];
  let node = leaf;
  for (let i = 0; i < depth; i++) {
    const sibling = BigInteger254();
    const idx = randomBytes(1)[0] & 1;
    elements.push(sibling);
    indices.push(idx);
    node = idx === 0 ? H([node, sibling]) : H([sibling, node]);
  }
  return { root: node, elements, indices };
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
