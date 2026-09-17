#!/usr/bin/env bash
set -eo pipefail

# ==============================================================================
# Directory Setup & Variables
# ==============================================================================
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CIRCUITS_DIR="${ROOT_DIR}/circuit-generation/circuits"
GENERATED_DIR="${ROOT_DIR}/circuit-generation/generated"   # ZMIANA: pliki main generowane
LIB_DIR="${CIRCUITS_DIR}/lib"                              # ZMIANA: szablony obwodów
MOPRO_DIR="${ROOT_DIR}/circuit-generation/mopro"
ARTIFACTS_DIR="${ROOT_DIR}/circuit-generation/artifacts"
NODE_MODULES_DIR="${ROOT_DIR}/node_modules"

PTAU_SIZE=17 # $2^17 = 131,072 max constraints (najcięższy obwód: 53 702)

mkdir -p "$ARTIFACTS_DIR" "$GENERATED_DIR"

# ==============================================================================
# ZMIANA: Definicje wariantów
# ------------------------------------------------------------------------------
# Obwody nie są już pisane ręcznie — istnieją jako sparametryzowane szablony
# w circuit-generation/circuits/lib/. Poniższa lista wyznacza, dla jakich
# głębokości drzew wygenerować pliki main. Głębokości wyprowadzono ze scenariuszy
# wdrożeniowych (zob. DEPTHS.md), nie dobrano arbitralnie.
#
#   nazwa | szablon | STATE_DEPTH | BL_DEPTH
# ==============================================================================
VARIANTS=(
    "standard_metro        standard  41   0"
    "standard_nation       standard  44   0"
    "standard_union        standard  47   0"
    "standard_global       standard  51   0"
    "advanced_metro        advanced  41  23"
    "advanced_nation       advanced  44  23"
    "advanced_union        advanced  47  26"
    "advanced_global       advanced  51  29"
    "advanced_union_bl160  advanced  47 160"   # kontrola ablacyjna (odtwarza koszt v1)
)

PUB_STANDARD='stateRoot, epochDay, epochMonth, maxSingleTxLimit, maxDailyLimit, maxMonthlyLimit, encryptedNoteHash'
PUB_ADVANCED='stateRoot, blacklistRoot, epochDay, epochMonth, maxSingleTxLimit, maxDailyLimit, maxMonthlyLimit, tier1WarningThreshold, encryptedNoteHash'

# ==============================================================================
# CLI Argument Parsing
# ==============================================================================
FORCE_TAU=false
CLEAN_TAU=false
ONLY_CIRCUIT=""

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
        --only)
            ONLY_CIRCUIT="$2"   # ZMIANA: przebuduj pojedynczy wariant
            shift 2
            ;;
        -h|--help)
            echo "Usage: $0 [options]"
            echo ""
            echo "Options:"
            echo "  --tau, --force-tau    Force regeneration of Powers of Tau (.ptau)"
            echo "  --clean-tau           Remove the .ptau file after compilation finishes"
            echo "  --only <name>         Build a single variant (e.g. advanced_union)"
            echo "  -h, --help            Show this help message"
            exit 0
            ;;
        *)
            echo "Unknown option: $1"
            exit 1
            ;;
    esac
done

# ==============================================================================
# ZMIANA: [0/3] Generowanie plików main z szablonów
# ==============================================================================
echo "============================================================"
echo " [0/3] Generating circuit entry points from templates"
echo "============================================================"

for f in merkle.circom uas_core.circom blacklist.circom standard.circom advanced.circom; do
    if [ ! -f "${LIB_DIR}/${f}" ]; then
        echo "Error: missing ${LIB_DIR}/${f}" >&2
        echo "Templates expected in: ${LIB_DIR}" >&2
        exit 1
    fi
done

rm -f "${GENERATED_DIR:?}"/*.circom

for row in "${VARIANTS[@]}"; do
    read -r NAME TPL D BL <<< "$row"

    if [ "$TPL" = "standard" ]; then
        INSTANCE="StandardCbdcConfidential($D)"
        PUBLIC="$PUB_STANDARD"
        INCLUDE="standard.circom"
    else
        INSTANCE="AdvancedAmlConfidential($D, $BL)"
        PUBLIC="$PUB_ADVANCED"
        INCLUDE="advanced.circom"
    fi

    cat > "${GENERATED_DIR}/${NAME}.circom" <<EOF
pragma circom 2.1.5;

// GENERATED FILE — do not edit. Produced by build.sh from circuits/lib templates.
// Variant: ${NAME}   STATE_DEPTH=${D}   BL_DEPTH=${BL}

include "../circuits/lib/${INCLUDE}";

component main {
    public [ ${PUBLIC} ]
} = ${INSTANCE};
EOF

    echo "[+] ${NAME}.circom (D=${D}, BL=${BL})"
done

echo ""
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
# ZMIANA: źródłem są wygenerowane pliki main, nie ręcznie pisane obwody.
CIRCUIT_FILES=("$GENERATED_DIR"/*.circom)

if [ ! -f "${CIRCUIT_FILES[0]}" ]; then
    echo "Error: No .circom files found in $GENERATED_DIR"
    exit 1
fi

MOPRO_TARGET="${MOPRO_DIR}/test-vectors/circom"
mkdir -p "$MOPRO_TARGET"

for circuit_path in "${CIRCUIT_FILES[@]}"; do
    CIRCUIT_FILE=$(basename "$circuit_path")
    CIRCUIT_NAME="${CIRCUIT_FILE%.circom}"

    # ZMIANA: obsługa --only
    if [ -n "$ONLY_CIRCUIT" ] && [ "$CIRCUIT_NAME" != "$ONLY_CIRCUIT" ]; then
        continue
    fi

    echo ""
    echo "============================================================"
    echo " Processing Circuit: ${CIRCUIT_NAME}"
    echo "============================================================"

    CIRCUIT_ARTIFACT_DIR="${ARTIFACTS_DIR}/${CIRCUIT_NAME}"
    TMP_DIR="${ARTIFACTS_DIR}/tmp_${CIRCUIT_NAME}"
    mkdir -p "$CIRCUIT_ARTIFACT_DIR" "$TMP_DIR"

    # Step A: Compile Circom to WASM + R1CS
    # ZMIANA: dodatkowe ścieżki -l dla szablonów obwodów (zagnieżdżone include).
    echo "[*] Compiling Circom to WASM & R1CS..."
    circom "$circuit_path" --c --wasm --r1cs \
        -l "$NODE_MODULES_DIR" -l "$CIRCUITS_DIR" -l "$LIB_DIR" \
        -o "$TMP_DIR" | tee "${CIRCUIT_ARTIFACT_DIR}/compile.log" | grep -E "constraints|wires|inputs|outputs" || true

    # Step B: Groth16 Setup & Key Export
    echo "[*] Running Groth16 Setup & Exporting Keys..."
    ZKEY_0="${TMP_DIR}/${CIRCUIT_NAME}_0000.zkey"
    ZKEY_FINAL="${CIRCUIT_ARTIFACT_DIR}/${CIRCUIT_NAME}.zkey"
    VKEY="${CIRCUIT_ARTIFACT_DIR}/${CIRCUIT_NAME}_vkey.json"

    snarkjs groth16 setup "${TMP_DIR}/${CIRCUIT_NAME}.r1cs" "$PTAU_FINAL" "$ZKEY_0" > /dev/null
    snarkjs zkey contribute "$ZKEY_0" "$ZKEY_FINAL" --name="Phase 2" -v -e="$(date +%N)" > /dev/null
    snarkjs zkey export verificationkey "$ZKEY_FINAL" "$VKEY" > /dev/null

    # ZMIANA: zachowaj r1cs — potrzebny do weryfikacji wektorów testowych
    cp "${TMP_DIR}/${CIRCUIT_NAME}.r1cs" "${CIRCUIT_ARTIFACT_DIR}/${CIRCUIT_NAME}.r1cs"
    rm -rf "${CIRCUIT_ARTIFACT_DIR}/${CIRCUIT_NAME}_js"
    cp -r "${TMP_DIR}/${CIRCUIT_NAME}_js" "${CIRCUIT_ARTIFACT_DIR}/${CIRCUIT_NAME}_js"

    # Step C: Build MoPro Native Libraries (.so & mopro.kt) for this circuit
    echo "[*] Building MoPro Native Libraries (.so & bindings)..."
    rm -rf "${MOPRO_TARGET:?}"/*
    cp "${TMP_DIR}/${CIRCUIT_NAME}_js/${CIRCUIT_NAME}.wasm" "${MOPRO_TARGET}/cbdc.wasm"
    cp "$ZKEY_FINAL" "${MOPRO_TARGET}/cbdc.zkey"
<<<<<<< Updated upstream
=======

    # Clean w2c2 files
    find "${MOPRO_DIR}/build" -type d -name "mopro-*" -exec rm -rf {} + 2>/dev/null || true

    # Turn off strict C99 errors in Clangu NDK r27b
    export CFLAGS="-Wno-implicit-function-declaration -Wno-error=implicit-function-declaration"
    export CFLAGS_x86_64_linux_android="${CFLAGS}"
    export CFLAGS_aarch64_linux_android="${CFLAGS}"
>>>>>>> Stashed changes

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