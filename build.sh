#!/usr/bin/env bash
set -eo pipefail

# ==============================================================================
# Directory Setup & Variables
# ==============================================================================
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CIRCUITS_DIR="${ROOT_DIR}/circuit-generation/circuits"
MOPRO_DIR="${ROOT_DIR}/circuit-generation/mopro"
ARTIFACTS_DIR="${ROOT_DIR}/circuit-generation/artifacts"
NODE_MODULES_DIR="${ROOT_DIR}/node_modules"

PTAU_SIZE=17 # $2^17 = 131,072 max constraints

mkdir -p "$ARTIFACTS_DIR"

# ==============================================================================
# CLI Argument Parsing
# ==============================================================================
FORCE_TAU=false
CLEAN_TAU=false

while [[ $# -gt 0 ]]; do
    case "$1" in
        --tau|--force-tau)
            FORCE_TAU=true
            shift
            ;;
        --clean-tau)
            CLEAN_TAU=true
            shift
            ;;
        -h|--help)
            echo "Usage: $0 [options]"
            echo ""
            echo "Options:"
            echo "  --tau, --force-tau    Force regeneration of Powers of Tau (.ptau)"
            echo "  --clean-tau            Remove the .ptau file after compilation finishes"
            echo "  -h, --help            Show this help message"
            exit 0
            ;;
        *)
            echo "Unknown option: $1"
            exit 1
            ;;
    esac
done

echo "============================================================"
echo " [1/3] Preparing Shared Powers of Tau (Size ${PTAU_SIZE})"
echo "============================================================"

PTAU_FINAL="${ARTIFACTS_DIR}/pot${PTAU_SIZE}_final.ptau"

if [ ! -f "$PTAU_FINAL" ] || [ "$FORCE_TAU" = true ]; then
    if [ "$FORCE_TAU" = true ]; then
        echo "[+] Flag --tau detected: Forcing regeneration..."
    else
        echo "[+] PTAU file missing: Generating degree ${PTAU_SIZE} Powers of Tau..."
    fi

    PTAU_0="${ARTIFACTS_DIR}/pot${PTAU_SIZE}_0000.ptau"
    PTAU_1="${ARTIFACTS_DIR}/pot${PTAU_SIZE}_0001.ptau"

    snarkjs powersoftau new bn128 ${PTAU_SIZE} "$PTAU_0" -v
    snarkjs powersoftau contribute "$PTAU_0" "$PTAU_1" --name="Phase 1" -v -e="$(date +%s)"
    snarkjs powersoftau prepare phase2 "$PTAU_1" "$PTAU_FINAL" -v

    rm -f "$PTAU_0" "$PTAU_1"
    echo "[+] Created $PTAU_FINAL"
else
    echo "[+] Reusing existing $PTAU_FINAL"
fi

# ==============================================================================
# [2/3] Circuit Compilation & MoPro Build Phase
# ==============================================================================
CIRCUIT_FILES=("$CIRCUITS_DIR"/*.circom)

if [ ! -f "${CIRCUIT_FILES[0]}" ]; then
    echo "Error: No .circom files found in $CIRCUITS_DIR"
    exit 1
fi

MOPRO_TARGET="${MOPRO_DIR}/test-vectors/circom"
mkdir -p "$MOPRO_TARGET"

for circuit_path in "${CIRCUIT_FILES[@]}"; do
    CIRCUIT_FILE=$(basename "$circuit_path")
    CIRCUIT_NAME="${CIRCUIT_FILE%.circom}"

    echo ""
    echo "============================================================"
    echo " Processing Circuit: ${CIRCUIT_NAME}"
    echo "============================================================"

    CIRCUIT_ARTIFACT_DIR="${ARTIFACTS_DIR}/${CIRCUIT_NAME}"
    TMP_DIR="${ARTIFACTS_DIR}/tmp_${CIRCUIT_NAME}"
    mkdir -p "$CIRCUIT_ARTIFACT_DIR" "$TMP_DIR"

    # Step A: Compile Circom to WASM + R1CS
    echo "[*] Compiling Circom to WASM & R1CS..."
    circom "$circuit_path" --c --wasm --r1cs -l "$NODE_MODULES_DIR" -o "$TMP_DIR" > /dev/null

    # Step B: Groth16 Setup & Key Export
    echo "[*] Running Groth16 Setup & Exporting Keys..."
    ZKEY_0="${TMP_DIR}/${CIRCUIT_NAME}_0000.zkey"
    ZKEY_FINAL="${CIRCUIT_ARTIFACT_DIR}/${CIRCUIT_NAME}.zkey"
    VKEY="${CIRCUIT_ARTIFACT_DIR}/${CIRCUIT_NAME}_vkey.json"

    snarkjs groth16 setup "${TMP_DIR}/${CIRCUIT_NAME}.r1cs" "$PTAU_FINAL" "$ZKEY_0" > /dev/null
    snarkjs zkey contribute "$ZKEY_0" "$ZKEY_FINAL" --name="Phase 2" -v -e="$(date +%N)" > /dev/null
    snarkjs zkey export verificationkey "$ZKEY_FINAL" "$VKEY" > /dev/null

    # Step C: Build MoPro Native Libraries (.so & mopro.kt) for this circuit
    echo "[*] Building MoPro Native Libraries (.so & bindings)..."
    rm -rf "${MOPRO_TARGET:?}"/*
    cp "${TMP_DIR}/${CIRCUIT_NAME}_js/${CIRCUIT_NAME}.wasm" "${MOPRO_TARGET}/cbdc.wasm"
    cp "$ZKEY_FINAL" "${MOPRO_TARGET}/cbdc.zkey"

    pushd "$MOPRO_DIR" > /dev/null
    cargo clean
    mopro build
    popd > /dev/null

    # Locate generated bindings and jniLibs
    MOPRO_KT=$(find "$MOPRO_DIR" -name "mopro.kt" | head -n 1)
    MOPRO_JNILIBS=$(find "$MOPRO_DIR" -type d -name "jniLibs" | head -n 1)

    if [ -z "$MOPRO_KT" ] || [ -z "$MOPRO_JNILIBS" ]; then
        echo "[x] Error: MoPro build output (.kt or jniLibs) missing for ${CIRCUIT_NAME}!" >&2
        exit 1
    fi

    # Archive native binaries into the circuit's artifact folder
    cp "$MOPRO_KT" "${CIRCUIT_ARTIFACT_DIR}/mopro.kt"
    rm -rf "${CIRCUIT_ARTIFACT_DIR}/jniLibs"
    cp -r "${MOPRO_JNILIBS}" "${CIRCUIT_ARTIFACT_DIR}/jniLibs"

    # Cleanup temp build directory
    rm -rf "$TMP_DIR"

    echo "[✓] Successfully built artifacts for: ${CIRCUIT_NAME}"
done

# ==============================================================================
# [3/3] Cleanup & Completion
# ==============================================================================
if [ "$CLEAN_TAU" = true ]; then
    echo "[+] Flag --clean-tau set: Removing Powers of Tau file..."
    rm -f "$PTAU_FINAL"
fi

echo "============================================================"
echo " [3/3] All Artifacts Generated Successfully!"
echo " Artifacts location: $ARTIFACTS_DIR"
echo "============================================================"