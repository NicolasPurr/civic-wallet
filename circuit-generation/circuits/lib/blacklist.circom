pragma circom 2.1.5;

include "circomlib/circuits/poseidon.circom";
include "circomlib/circuits/comparators.circom";
include "circomlib/circuits/bitify.circom";
include "circomlib/circuits/aliascheck.circom";
include "circomlib/circuits/compconstant.circom";
include "merkle.circom";

/*
 * BlacklistNonMembership - proves non-membership in a blacklist using an
 * indexed (sorted) Merkle tree.
 *
 * Mechanism:
 * Leaves represent nodes of a sorted, singly linked list:
 *     leaf = ( value, nextIndex, nextValue )
 * The list originates from an initial leaf (0, 0, 0) and remains sorted
 * in ascending order by the `value` field.
 *
 * To prove that a key `q` is NOT in the list, the prover provides an inclusion
 * proof for an existing leaf `L` ("low leaf") such that:
 *     L.value < q < L.nextValue        (standard case)
 * or:
 *     L.value < q and L.nextValue = 0  (L is the terminal/tail element)
 *
 * Because the list is sorted, such a leaf exists if and only if
 * `q` is absent from the tree.
 *
 * Key standardisation:
 * The sorting key is the 128 least significant bits of Poseidon(userPrivateKey).
 * Using Num2Bits_strict (with alias checking) is required: without it, an attacker
 * could submit a non-standard field representation to derive an alternative key
 * and circumvent blacklist inclusion.
 */
template BlacklistNonMembership(BL_DEPTH) {

    signal input userPrivateKey;
    signal input blacklistRoot;

    // Witness: preceding leaf ("low leaf") and its inclusion path
    signal input blLowValue;
    signal input blLowNextIndex;
    signal input blLowNextValue;
    signal input blPathElements[BL_DEPTH];
    signal input blPathIndices[BL_DEPTH];

    signal output identityKey;

    // ---------------------------------------------------------------- //
    //  1. Canonical 128-bit identity key                               //
    // ---------------------------------------------------------------- //
    component idHasher = Poseidon(1);
    idHasher.inputs[0] <== userPrivateKey;

    component idBits = Num2Bits_strict();
    idBits.in <== idHasher.out;

    component idKey = Bits2Num(128);
    for (var i = 0; i < 128; i++) {
        idKey.in[i] <== idBits.out[i];
    }
    identityKey <== idKey.out;

    // ---------------------------------------------------------------- //
    //  2. Verify low leaf inclusion in the blacklist Merkle tree       //
    // ---------------------------------------------------------------- //
    component lowLeafHasher = Poseidon(3);
    lowLeafHasher.inputs[0] <== blLowValue;
    lowLeafHasher.inputs[1] <== blLowNextIndex;
    lowLeafHasher.inputs[2] <== blLowNextValue;

    component blMerkle = MerkleInclusion(BL_DEPTH);
    blMerkle.leaf <== lowLeafHasher.out;
    for (var i = 0; i < BL_DEPTH; i++) {
        blMerkle.pathElements[i] <== blPathElements[i];
        blMerkle.pathIndices[i]  <== blPathIndices[i];
    }
    blMerkle.root === blacklistRoot;

    // ---------------------------------------------------------------- //
    //  3. Verify key falls strictly within the interval                //
    //     (blLowValue, blLowNextValue)                                 //
    // ---------------------------------------------------------------- //

    //  blLowValue < identityKey
    component lowerBound = LessThan(128);
    lowerBound.in[0] <== blLowValue;
    lowerBound.in[1] <== identityKey;
    lowerBound.out === 1;

    //  identityKey < blLowNextValue OR leaf is the tail (nextValue == 0)
    component isLastLeaf = IsZero();
    isLastLeaf.in <== blLowNextValue;

    component upperBound = LessThan(128);
    upperBound.in[0] <== identityKey;
    upperBound.in[1] <== blLowNextValue;

    //  OR(isLastLeaf, upperBound) === 1
    signal orTerm;
    orTerm <== isLastLeaf.out * upperBound.out;
    isLastLeaf.out + upperBound.out - orTerm === 1;

    //  Range checks on leaf fields (required for comparator soundness)
    component rangeLowValue     = Num2Bits(128);
    component rangeLowNextValue = Num2Bits(128);
    rangeLowValue.in     <== blLowValue;
    rangeLowNextValue.in <== blLowNextValue;
}
