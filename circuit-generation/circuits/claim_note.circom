pragma circom 2.1.5;

include "circomlib/circuits/poseidon.circom";
include "circomlib/circuits/comparators.circom";
include "circomlib/circuits/bitify.circom";
include "lib/merkle.circom";

/*
 * ============================================================================
 *  ClaimNote - strona odbiorcza platnosci.
 * ============================================================================
 *
 *  Domyka model zachowania wartosci (zarzut K2). Obwod platniczy
 *  (Standard/Advanced) zmniejsza saldo platnika o transferAmount i emituje
 *  note o dokladnie tej samej wartosci. Niniejszy obwod pozwala odbiorcy
 *  te note skonsumowac i doliczyc jej wartosc do wlasnego stanu UAS,
 *  nie ujawniajac przy tym ani ktora nota zostala przejeta, ani od kogo
 *  pochodzila, ani jaka byla jej wartosc.
 *
 *  Roszczenie jest operacja PRZYCHODOWA, nie wydatkowa: nie zwieksza
 *  licznikow wydatkow. Liczniki podlegaja jednak rotacji epok, aby stan
 *  konta pozostawal spojny z biezacym okresem rozliczeniowym.
 *
 *  Obwod wykonywany jest po stronie terminala akceptanta lub w tle
 *  aplikacji odbiorcy, a wiec poza sciezka krytyczna czasu obslugi
 *  przy kasie mierzonego w Rozdziale III.
 */
template ClaimNote(STATE_DEPTH, NOTE_DEPTH) {

    // --- wejscia publiczne ---
    signal input stateRoot;
    signal input noteRoot;
    signal input epochDay;
    signal input epochMonth;

    // --- wejscia prywatne: nota ---
    signal input noteValue;
    signal input noteSalt;
    signal input noteEpochDay;
    signal input notePathElements[NOTE_DEPTH];
    signal input notePathIndices[NOTE_DEPTH];

    // --- wejscia prywatne: stan odbiorcy ---
    signal input userPrivateKey;
    signal input oldBalance;
    signal input oldSalt;
    signal input oldDailySpent;
    signal input oldMonthlySpent;
    signal input oldEpochDay;
    signal input oldEpochMonth;
    signal input newSalt;
    signal input statePathElements[STATE_DEPTH];
    signal input statePathIndices[STATE_DEPTH];

    // --- wyjscia publiczne ---
    signal output noteNullifier;
    signal output stateNullifier;
    signal output newCommitment;

    // ---------------------------------------------------------------- //
    //  1. Zakresy                                                       //
    // ---------------------------------------------------------------- //
    component rangeNoteValue   = Num2Bits(64);
    component rangeOldBalance  = Num2Bits(64);
    component rangeOldDaily    = Num2Bits(64);
    component rangeOldMonthly  = Num2Bits(64);
    component rangeOldEpochD   = Num2Bits(32);
    component rangeOldEpochM   = Num2Bits(32);

    rangeNoteValue.in  <== noteValue;
    rangeOldBalance.in <== oldBalance;
    rangeOldDaily.in   <== oldDailySpent;
    rangeOldMonthly.in <== oldMonthlySpent;
    rangeOldEpochD.in  <== oldEpochDay;
    rangeOldEpochM.in  <== oldEpochMonth;

    // ---------------------------------------------------------------- //
    //  2. Nota istnieje w drzewie notatek i nalezy do odbiorcy          //
    // ---------------------------------------------------------------- //
    //  Klucz publiczny odbiorcy jest wyprowadzany z klucza prywatnego,
    //  co dowodzi uprawnienia do przejecia noty bez ujawniania tozsamosci.
    component pkHasher = Poseidon(1);
    pkHasher.inputs[0] <== userPrivateKey;

    component noteHasher = Poseidon(4);
    noteHasher.inputs[0] <== pkHasher.out;
    noteHasher.inputs[1] <== noteValue;
    noteHasher.inputs[2] <== noteSalt;
    noteHasher.inputs[3] <== noteEpochDay;

    component noteMerkle = MerkleInclusion(NOTE_DEPTH);
    noteMerkle.leaf <== noteHasher.out;
    for (var i = 0; i < NOTE_DEPTH; i++) {
        noteMerkle.pathElements[i] <== notePathElements[i];
        noteMerkle.pathIndices[i]  <== notePathIndices[i];
    }
    noteMerkle.root === noteRoot;

    //  Unieważniacz noty. Wyprowadzony ze zobowiazania noty, a nie z samej
    //  soli - dzieki temu platnik, ktory zna noteSalt, nie moze przewidziec
    //  wartosci unieważniacza ani go wyprzedzic.
    component noteNfHasher = Poseidon(2);
    noteNfHasher.inputs[0] <== userPrivateKey;
    noteNfHasher.inputs[1] <== noteHasher.out;
    noteNullifier <== noteNfHasher.out;

    // ---------------------------------------------------------------- //
    //  3. Otwarcie i uniewaznienie dotychczasowego stanu odbiorcy       //
    // ---------------------------------------------------------------- //
    component oldCommitmentHasher = Poseidon(7);
    oldCommitmentHasher.inputs[0] <== userPrivateKey;
    oldCommitmentHasher.inputs[1] <== oldBalance;
    oldCommitmentHasher.inputs[2] <== oldSalt;
    oldCommitmentHasher.inputs[3] <== oldDailySpent;
    oldCommitmentHasher.inputs[4] <== oldMonthlySpent;
    oldCommitmentHasher.inputs[5] <== oldEpochDay;
    oldCommitmentHasher.inputs[6] <== oldEpochMonth;

    component stateMerkle = MerkleInclusion(STATE_DEPTH);
    stateMerkle.leaf <== oldCommitmentHasher.out;
    for (var i = 0; i < STATE_DEPTH; i++) {
        stateMerkle.pathElements[i] <== statePathElements[i];
        stateMerkle.pathIndices[i]  <== statePathIndices[i];
    }
    stateMerkle.root === stateRoot;

    component stateNfHasher = Poseidon(2);
    stateNfHasher.inputs[0] <== userPrivateKey;
    stateNfHasher.inputs[1] <== oldSalt;
    stateNullifier <== stateNfHasher.out;

    // ---------------------------------------------------------------- //
    //  4. Rotacja epok (bez zwiekszania licznikow wydatkow)             //
    // ---------------------------------------------------------------- //
    component dayNotInPast = LessEqThan(32);
    dayNotInPast.in[0] <== oldEpochDay;
    dayNotInPast.in[1] <== epochDay;
    dayNotInPast.out === 1;

    component monthNotInPast = LessEqThan(32);
    monthNotInPast.in[0] <== oldEpochMonth;
    monthNotInPast.in[1] <== epochMonth;
    monthNotInPast.out === 1;

    component sameDay = IsEqual();
    sameDay.in[0] <== oldEpochDay;
    sameDay.in[1] <== epochDay;

    component sameMonth = IsEqual();
    sameMonth.in[0] <== oldEpochMonth;
    sameMonth.in[1] <== epochMonth;

    signal newDailySpent;
    signal newMonthlySpent;
    newDailySpent   <== sameDay.out   * oldDailySpent;
    newMonthlySpent <== sameMonth.out * oldMonthlySpent;

    // ---------------------------------------------------------------- //
    //  5. Doksiegowanie wartosci noty                                   //
    // ---------------------------------------------------------------- //
    signal newBalance;
    newBalance <== oldBalance + noteValue;

    //  Zapobiega przepelnieniu zakresu 64-bitowego salda.
    component rangeNewBalance = Num2Bits(64);
    rangeNewBalance.in <== newBalance;

    component newCommitmentHasher = Poseidon(7);
    newCommitmentHasher.inputs[0] <== userPrivateKey;
    newCommitmentHasher.inputs[1] <== newBalance;
    newCommitmentHasher.inputs[2] <== newSalt;
    newCommitmentHasher.inputs[3] <== newDailySpent;
    newCommitmentHasher.inputs[4] <== newMonthlySpent;
    newCommitmentHasher.inputs[5] <== epochDay;
    newCommitmentHasher.inputs[6] <== epochMonth;

    newCommitment <== newCommitmentHasher.out;
}


component main {
    public [
        stateRoot,
        noteRoot,
        epochDay,
        epochMonth
    ]
} = ClaimNote(33, 33);
