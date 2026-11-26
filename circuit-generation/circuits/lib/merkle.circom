pragma circom 2.1.5;

include "circomlib/circuits/poseidon.circom";

/*
 * DualMux - swaps the order of two input signals based on a path bit.
 *   s = 0  ->  (out[0], out[1]) = (in[0], in[1])   // current node is the left child
 *   s = 1  ->  (out[0], out[1]) = (in[1], in[0])   // current node is the right child
 *
 * Cost: 3 constraints (boolean constraint on s + two multiplications).
 */
template DualMux() {
    signal input in[2];
    signal input s;
    signal output out[2];

    s * (1 - s) === 0;

    out[0] <== (in[1] - in[0]) * s + in[0];
    out[1] <== (in[0] - in[1]) * s + in[1];
}

/*
 * MerkleInclusion - computes the Merkle root from a leaf and an authentication path.
 * The root is an output signal, allowing the parent circuit to decide whether to
 * constrain it against a public root.
 *
 * Cost per level: Poseidon(2) = 243 + DualMux = 3 -> 246 constraints.
 */
template MerkleInclusion(DEPTH) {
    signal input leaf;
    signal input pathElements[DEPTH];
    signal input pathIndices[DEPTH];
    signal output root;

    component mux[DEPTH];
    component hasher[DEPTH];
    signal node[DEPTH + 1];

    node[0] <== leaf;

    for (var i = 0; i < DEPTH; i++) {
        mux[i] = DualMux();
        mux[i].in[0] <== node[i];
        mux[i].in[1] <== pathElements[i];
        mux[i].s     <== pathIndices[i];

        hasher[i] = Poseidon(2);
        hasher[i].inputs[0] <== mux[i].out[0];
        hasher[i].inputs[1] <== mux[i].out[1];

        node[i + 1] <== hasher[i].out;
    }

    root <== node[DEPTH];
}
