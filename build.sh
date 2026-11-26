#!/usr/bin/env bash
#
# build.sh - generate, compile and set up every circuit variant, then build
# the MoPro native library for each one.
#
# For each variant listed in circuit-generation/variants.conf this script:
#   0. generates a main .circom file from the templates in circuits/lib,
#   1. prepares a shared Powers of Tau file (phase 1),
#   2. compiles the circuit, runs the Groth16 setup (phase 2), exports the
#      verification key and builds the MoPro .so libraries and Kotlin bindings.
#
# Everything ends up in circuit-generation/artifacts/<variant>/, together with
# constraints.csv (constraint counts of exactly the circuits that were built).
#
# Usage: ./build.sh [--tau] [--clean-tau] [--only <variant>] [--compile-only]
#
# --compile-only checks that every variant generates and compiles, and writes
# the constraint counts to circuit-generation/artifacts/check/. It skips the
# trusted setup and the MoPro build and leaves the real artifacts untouched.
#
# Environment:
#   PTAU=<file>   use an existing phase-1 file (e.g. a Hermez
#                 powersOfTau28_hez_final_17.ptau) instead of generating one.
set -Eeuo pipefail
trap 'echo "[x] Failed at line $LINENO: $BASH_COMMAND" >&2' ERR

# ==============================================================================
# Paths and settings
# ==============================================================================
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CIRCUITS_DIR="${ROOT_DIR}/circuit-generation/circuits"
LIB_DIR="${CIRCUITS_DIR}/lib"
GENERATED_DIR="${ROOT_DIR}/circuit-generation/generated"
VARIANTS_FILE="${ROOT_DIR}/circuit-generation/variants.conf"
MOPRO_DIR="${ROOT_DIR}/circuit-generation/mopro"
MOPRO_TARGET="${MOPRO_DIR}/test-vectors/circom"
ARTIFACTS_DIR="${ROOT_DIR}/circuit-generation/artifacts"
NODE_MODULES_DIR="${ROOT_DIR}/node_modules"

# 2^17 = 131,072 constraints. The heaviest variant has about 53,700.
PTAU_SIZE=17

# snarkjs keeps the whole FFT domain in memory. When Node runs out of heap
# the process is killed without a useful error message.
export NODE_OPTIONS="${NODE_OPTIONS:---max-old-space-size=8192}"

# Clang in NDK r27b rejects implicit function declarations by default, and
# the C code that w2c2 generates from the witness WASM contains some.
# Downgrade the error to a warning.
export CFLAGS="-Wno-implicit-function-declaration -Wno-error=implicit-function-declaration"
export CFLAGS_x86_64_linux_android="${CFLAGS}"
export CFLAGS_aarch64_linux_android="${CFLAGS}"

PUB_STANDARD='stateRoot, epochDay, epochMonth, maxSingleTxLimit, maxDailyLimit, maxMonthlyLimit, encryptedNoteHash'
PUB_ADVANCED='stateRoot, blacklistRoot, epochDay, epochMonth, maxSingleTxLimit, maxDailyLimit, maxMonthlyLimit, tier1WarningThreshold, encryptedNoteHash'

# ==============================================================================
# Command-line arguments
# ==============================================================================
FORCE_TAU=false
CLEAN_TAU=false
ONLY_CIRCUIT=""
COMPILE_ONLY=false

usage() {
    echo "Usage: $0 [options]"
    echo ""
    echo "Options:"
    echo "  --tau, --force-tau    Regenerate the local Powers of Tau file"
    echo "  --clean-tau           Delete the local .ptau file when the build finishes"
    echo "  --only <name>         Build a single variant (e.g. advanced_union)"
    echo "  --compile-only        Only generate and compile; write constraint counts"
    echo "                        to circuit-generation/artifacts/check/"
    echo "  -h, --help            Show this help message"
}

while [[ $# -gt 0 ]]; do
    case "$1" in
        --tau|--force-tau) FORCE_TAU=true; shift ;;
        --clean-tau)       CLEAN_TAU=true; shift ;;
        --compile-only)    COMPILE_ONLY=true; shift ;;
        --only)
            if [[ $# -lt 2 || "$2" == -* ]]; then
                echo "Error: --only needs a variant name" >&2
                exit 1
            fi
            ONLY_CIRCUIT="$2"
            shift 2
            ;;
        -h|--help) usage; exit 0 ;;
        *) echo "Unknown option: $1" >&2; usage >&2; exit 1 ;;
    esac
done

# ==============================================================================
# Helpers
# ==============================================================================

# Print the variants file without comments and blank lines.
read_variants() {
    sed -e 's/#.*//' -e '/^[[:space:]]*$/d' "$VARIANTS_FILE"
}

# Run a command with its output in a log file. Print the log only on failure.
run_logged() {
    local log="$1"; shift
    if ! "$@" > "$log" 2>&1; then
        echo "[x] Command failed: $*" >&2
        sed 's/^/    /' "$log" >&2
        exit 1
    fi
}

# Read one number from circom's summary, e.g. "non-linear constraints: 1234".
# Prints NA if the label is missing, so a changed label never becomes a 0.
circom_metric() {
    local log="$1" label="$2" value
    value=$(sed 's/\x1b\[[0-9;]*m//g' "$log" \
        | sed -n "s/^[[:space:]]*${label}:[[:space:]]*\([0-9][0-9]*\).*/\1/p" \
        | head -n 1)
    echo "${value:-NA}"
}

# ==============================================================================
# Pre-flight checks
# ==============================================================================
TOOLS=(circom snarkjs node cargo mopro)
if [[ "$COMPILE_ONLY" == true ]]; then TOOLS=(circom); fi
for tool in "${TOOLS[@]}"; do
    command -v "$tool" > /dev/null || { echo "Error: '$tool' not found in PATH" >&2; exit 1; }
done

[[ -f "$VARIANTS_FILE" ]] || { echo "Error: missing $VARIANTS_FILE" >&2; exit 1; }
[[ -d "${NODE_MODULES_DIR}/circomlib" ]] || { echo "Error: circomlib missing, run: npm i circomlib" >&2; exit 1; }

for f in merkle.circom uas_core.circom blacklist.circom standard.circom advanced.circom; do
    [[ -f "${LIB_DIR}/${f}" ]] || { echo "Error: missing template ${LIB_DIR}/${f}" >&2; exit 1; }
done

# In --compile-only mode, results go to artifacts/check/ instead.
RESULTS_DIR="$ARTIFACTS_DIR"
if [[ "$COMPILE_ONLY" == true ]]; then RESULTS_DIR="${ARTIFACTS_DIR}/check"; fi

mkdir -p "$ARTIFACTS_DIR" "$RESULTS_DIR" "$GENERATED_DIR" "$MOPRO_TARGET"

# Load the variants into an array. Looping with `while read ... < file` would
# let commands inside the loop (cargo, mopro, snarkjs) read from the same stdin.
mapfile -t VARIANT_ROWS < <(read_variants)

if [[ -n "$ONLY_CIRCUIT" ]]; then
    found=false
    for row in "${VARIANT_ROWS[@]}"; do
        read -r n _ <<< "$row"
        if [[ "$n" == "$ONLY_CIRCUIT" ]]; then found=true; fi
    done
    if [[ "$found" != true ]]; then
        echo "Error: '$ONLY_CIRCUIT' is not listed in $VARIANTS_FILE" >&2
        exit 1
    fi
fi

# ==============================================================================
# [0/3] Generate circuit entry points from the templates
# ==============================================================================
echo "============================================================"
echo " [0/3] Generating circuit entry points from templates"
echo "============================================================"

rm -f "${GENERATED_DIR:?}"/*.circom

for row in "${VARIANT_ROWS[@]}"; do
    read -r NAME TPL D BL <<< "$row"
    if [[ "$TPL" == "standard" ]]; then
        INSTANCE="StandardCbdcConfidential($D)"
        PUBLIC="$PUB_STANDARD"
        INCLUDE="standard.circom"
    elif [[ "$TPL" == "advanced" ]]; then
        INSTANCE="AdvancedAmlConfidential($D, $BL)"
        PUBLIC="$PUB_ADVANCED"
        INCLUDE="advanced.circom"
    else
        echo "Error: unknown template '$TPL' for variant $NAME" >&2
        exit 1
    fi

    cat > "${GENERATED_DIR}/${NAME}.circom" <<EOF
pragma circom 2.1.5;

// GENERATED FILE - do not edit. Produced by build.sh from circuits/lib.
// Variant: ${NAME}   STATE_DEPTH=${D}   BL_DEPTH=${BL}

include "../circuits/lib/${INCLUDE}";

component main {
    public [ ${PUBLIC} ]
} = ${INSTANCE};
EOF
    echo "[+] ${NAME}.circom (D=${D}, BL=${BL})"
done

# ==============================================================================
# [1/3] Shared Powers of Tau (phase 1)
# ==============================================================================
echo ""
echo "============================================================"
echo " [1/3] Preparing shared Powers of Tau (2^${PTAU_SIZE})"
echo "============================================================"

LOCAL_PTAU="${ARTIFACTS_DIR}/pot${PTAU_SIZE}_final.ptau"

if [[ "$COMPILE_ONLY" == true ]]; then
    echo "[+] --compile-only: skipped"
elif [[ -n "${PTAU:-}" ]]; then
    [[ -f "$PTAU" ]] || { echo "Error: PTAU=$PTAU does not exist" >&2; exit 1; }
    PTAU_FINAL="$PTAU"
    echo "[+] Using external phase-1 file: $PTAU_FINAL"
elif [[ ! -f "$LOCAL_PTAU" || "$FORCE_TAU" == true ]]; then
    # Single-party phase 1. Good enough for a research prototype; a real
    # deployment needs a multi-party ceremony (or a public one such as Hermez).
    echo "[+] Generating local Powers of Tau..."
    PTAU_0="${ARTIFACTS_DIR}/pot${PTAU_SIZE}_0000.ptau"
    PTAU_1="${ARTIFACTS_DIR}/pot${PTAU_SIZE}_0001.ptau"

    snarkjs powersoftau new bn128 "${PTAU_SIZE}" "$PTAU_0" -v
    snarkjs powersoftau contribute "$PTAU_0" "$PTAU_1" --name="Phase 1" -v \
        -e="$(head -c 64 /dev/urandom | base64 | tr -d '\n')"
    snarkjs powersoftau prepare phase2 "$PTAU_1" "$LOCAL_PTAU" -v

    rm -f "$PTAU_0" "$PTAU_1"
    PTAU_FINAL="$LOCAL_PTAU"
    echo "[+] Created $PTAU_FINAL"
else
    PTAU_FINAL="$LOCAL_PTAU"
    echo "[+] Reusing existing $PTAU_FINAL"
fi

# ==============================================================================
# [2/3] Compile, Groth16 setup and MoPro build for each variant
# ==============================================================================
for row in "${VARIANT_ROWS[@]}"; do
    read -r NAME TPL D BL <<< "$row"
    if [[ -n "$ONLY_CIRCUIT" && "$NAME" != "$ONLY_CIRCUIT" ]]; then
        continue
    fi

    echo ""
    echo "============================================================"
    echo " [2/3] Processing circuit: ${NAME}"
    echo "============================================================"

    CIRCUIT_SRC="${GENERATED_DIR}/${NAME}.circom"
    OUT_DIR="${RESULTS_DIR}/${NAME}"
    TMP_DIR="${RESULTS_DIR}/tmp_${NAME}"
    rm -rf "$TMP_DIR"
    mkdir -p "$OUT_DIR" "$TMP_DIR"

    # Step A: compile to R1CS and WASM. MoPro builds the witness generator
    # from the WASM, so no C witness code is needed. --O1 is circom's default;
    # it is written out because the constraint counts depend on it.
    echo "[*] Compiling circom to R1CS and WASM..."
    COMPILE_LOG="${OUT_DIR}/compile.log"
    if ! circom "$CIRCUIT_SRC" --r1cs --wasm --O1 \
            -l "$NODE_MODULES_DIR" -l "$CIRCUITS_DIR" -l "$LIB_DIR" \
            -o "$TMP_DIR" > "$COMPILE_LOG" 2>&1; then
        echo "[x] circom failed for ${NAME}:" >&2
        sed 's/^/    /' "$COMPILE_LOG" >&2
        exit 1
    fi
    grep -E 'constraints|wires|inputs|outputs' "$COMPILE_LOG" | sed 's/^/    /' || true

    {
        echo "circuit,state_depth,bl_depth,nonlinear,linear,public_inputs,private_inputs,public_outputs,wires"
        echo "${NAME},${D},${BL},$(circom_metric "$COMPILE_LOG" 'non-linear constraints'),$(circom_metric "$COMPILE_LOG" 'linear constraints'),$(circom_metric "$COMPILE_LOG" 'public inputs'),$(circom_metric "$COMPILE_LOG" 'private inputs'),$(circom_metric "$COMPILE_LOG" 'public outputs'),$(circom_metric "$COMPILE_LOG" 'wires')"
    } > "${OUT_DIR}/metrics.csv"

    if [[ "$COMPILE_ONLY" == true ]]; then
        rm -rf "$TMP_DIR"
        echo "[+] ${NAME} compiles"
        continue
    fi

    # Step B: Groth16 setup (phase 2) and verification key export.
    # Single contribution with random entropy: fine for a prototype, not for
    # deployment (see the phase-1 note above).
    echo "[*] Running Groth16 setup and exporting keys..."
    ZKEY_0="${TMP_DIR}/${NAME}_0000.zkey"
    ZKEY_FINAL="${OUT_DIR}/${NAME}.zkey"
    VKEY="${OUT_DIR}/${NAME}_vkey.json"

    run_logged "${TMP_DIR}/setup.log" \
        snarkjs groth16 setup "${TMP_DIR}/${NAME}.r1cs" "$PTAU_FINAL" "$ZKEY_0"
    run_logged "${TMP_DIR}/contribute.log" \
        snarkjs zkey contribute "$ZKEY_0" "$ZKEY_FINAL" --name="Phase 2" \
        -e="$(head -c 64 /dev/urandom | base64 | tr -d '\n')"
    run_logged "${TMP_DIR}/vkey.log" \
        snarkjs zkey export verificationkey "$ZKEY_FINAL" "$VKEY"

    # Keep the R1CS and the WASM witness generator: tools/verify_fixtures.sh
    # needs them to check the test vectors on the laptop.
    cp "${TMP_DIR}/${NAME}.r1cs" "${OUT_DIR}/${NAME}.r1cs"
    rm -rf "${OUT_DIR:?}/${NAME}_js"
    cp -r "${TMP_DIR}/${NAME}_js" "${OUT_DIR}/${NAME}_js"

    # Step C: build the MoPro native libraries (.so) and Kotlin bindings.
    # MoPro always reads cbdc.wasm / cbdc.zkey, so each build serves exactly
    # one variant.
    echo "[*] Building MoPro native libraries..."
    rm -rf "${MOPRO_TARGET:?}"/*
    cp "${TMP_DIR}/${NAME}_js/${NAME}.wasm" "${MOPRO_TARGET}/cbdc.wasm"
    cp "$ZKEY_FINAL" "${MOPRO_TARGET}/cbdc.zkey"

    # Remove the C files w2c2 generated for the previous variant, and run
    # cargo clean so the witness generator is rebuilt from the new cbdc.wasm
    # (the file name is the same for every variant).
    find "${MOPRO_DIR}/build" -type d -name "mopro-*" -exec rm -rf {} + 2>/dev/null || true

    STAMP="${TMP_DIR}/.mopro_build_start"
    touch "$STAMP"

    pushd "$MOPRO_DIR" > /dev/null
    cargo clean
    mopro build
    popd > /dev/null

    # Only accept outputs written by this build, never a leftover from an
    # earlier variant.
    MOPRO_KT=$(find "$MOPRO_DIR" -name "mopro.kt" -newer "$STAMP" -print -quit)
    MOPRO_SO=$(find "$MOPRO_DIR" -path "*jniLibs*" -name "*.so" -newer "$STAMP" -print -quit)

    if [[ -z "$MOPRO_KT" || -z "$MOPRO_SO" ]]; then
        echo "[x] MoPro build output (mopro.kt or jniLibs/*.so) missing for ${NAME}" >&2
        exit 1
    fi
    # .../jniLibs/<abi>/libX.so -> .../jniLibs
    MOPRO_JNILIBS="$(dirname "$(dirname "$MOPRO_SO")")"

    cp "$MOPRO_KT" "${OUT_DIR}/mopro.kt"
    rm -rf "${OUT_DIR:?}/jniLibs"
    cp -r "$MOPRO_JNILIBS" "${OUT_DIR}/jniLibs"

    rm -rf "$TMP_DIR"
    echo "[+] Built artifacts for ${NAME}"
done

# ==============================================================================
# [3/3] Constraint summary and cleanup
# ==============================================================================
CSV="${RESULTS_DIR}/constraints.csv"
echo "circuit,state_depth,bl_depth,nonlinear,linear,public_inputs,private_inputs,public_outputs,wires" > "$CSV"
for row in "${VARIANT_ROWS[@]}"; do
    read -r NAME _ <<< "$row"
    if [[ -f "${RESULTS_DIR}/${NAME}/metrics.csv" ]]; then
        tail -n 1 "${RESULTS_DIR}/${NAME}/metrics.csv" >> "$CSV"
    fi
done

if [[ "$CLEAN_TAU" == true && -f "$LOCAL_PTAU" ]]; then
    echo "[+] --clean-tau set: removing $LOCAL_PTAU"
    rm -f "$LOCAL_PTAU"
fi

echo ""
echo "============================================================"
echo " [3/3] Done"
echo " Artifacts:   $RESULTS_DIR"
echo " Constraints: $CSV"
echo "============================================================"
if [[ "$COMPILE_ONLY" == true ]]; then
    column -s, -t "$CSV" 2> /dev/null || cat "$CSV"
    exit 0
fi
echo "Next steps:"
echo "  node tools/generate_fixtures.mjs"
echo "  bash tools/verify_fixtures.sh"
