#!/usr/bin/env bash
#
# verify_fixtures.sh - check that every generated test vector satisfies its
# circuit, by computing the witness and running a full prove + verify.
#
# generate_fixtures.mjs computes Poseidon independently of the circuit, so it
# finishing without errors proves nothing. A wrong argument order in the
# Merkle path or a wrong truncation of the identity key only shows up here,
# which is better than finding it on the phone in the middle of a benchmark.
#
# Usage (after ./build.sh and node tools/generate_fixtures.mjs):
#   bash tools/verify_fixtures.sh
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ART_DIR="${ART_DIR:-${ROOT_DIR}/circuit-generation/artifacts}"
INPUTS="${INPUTS:-${ROOT_DIR}/build/inputs}"
WORK_DIR="$(mktemp -d)"
trap 'rm -rf "$WORK_DIR"' EXIT

OK=0; FAIL=0; SKIP=0

# Check the full circuit inputs from build/inputs, not the app test vectors:
# those contain metadata (circuit, stateDepth) and lack the transaction
# parameters, so the witness generator would reject them.
if ! compgen -G "$INPUTS/*.input.json" > /dev/null; then
    echo "No inputs in $INPUTS - run: node tools/generate_fixtures.mjs" >&2
    exit 1
fi

for f in "$INPUTS"/*.input.json; do
    NAME=$(basename "$f" .input.json)
    JS_DIR="$ART_DIR/$NAME/${NAME}_js"
    WASM="$JS_DIR/${NAME}.wasm"
    WTNS="$WORK_DIR/$NAME.wtns"
    PROOF="$WORK_DIR/$NAME.proof.json"
    PUBLIC="$WORK_DIR/$NAME.public.json"
    LOG="$WORK_DIR/$NAME.log"

    if [[ ! -f "$WASM" ]]; then
        echo "SKIP  $NAME (no $WASM - run ./build.sh)"
        SKIP=$((SKIP + 1))
        continue
    fi

    if ! node "$JS_DIR/generate_witness.js" "$WASM" "$f" "$WTNS" > "$LOG" 2>&1; then
        echo "FAIL  $NAME - witness generation:"
        sed 's/^/          /' "$LOG" | head -n 5
        FAIL=$((FAIL + 1))
        continue
    fi

    # The witness exists; now check the whole proving path.
    if snarkjs groth16 prove "$ART_DIR/$NAME/$NAME.zkey" "$WTNS" "$PROOF" "$PUBLIC" > "$LOG" 2>&1 &&
       snarkjs groth16 verify "$ART_DIR/$NAME/${NAME}_vkey.json" "$PUBLIC" "$PROOF" >> "$LOG" 2>&1
    then
        SIGNALS=$(node -e 'console.log(JSON.parse(require("fs").readFileSync(process.argv[1])).length)' "$PUBLIC")
        echo "OK    $NAME  (public signals: $SIGNALS)"
        OK=$((OK + 1))
    else
        echo "FAIL  $NAME - witness computed, but the proof does not verify:"
        sed 's/^/          /' "$LOG" | tail -n 5
        FAIL=$((FAIL + 1))
    fi
done

echo
echo "OK: $OK   FAIL: $FAIL   SKIP: $SKIP"
# Fail if anything failed, or if nothing was actually checked.
[[ $FAIL -eq 0 && $OK -gt 0 ]]
