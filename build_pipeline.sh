#!/bin/bash
set -eo pipefail # Exit on command fail OR pipe failure

# ==============================================================================
# Directory Structures & Variables
# ==============================================================================
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

CIRCUIT_DIR="${ROOT_DIR}/circuit-generation/circuits"
MOPRO_DIR="${ROOT_DIR}/circuit-generation/mopro"
SERVER_DIR="${ROOT_DIR}/verification-server"
ANDROID_DIR="/mnt/c/civic-wallet/android"

CIRCUIT_NAME="cbdc"
PTAU_SIZE=12        # Max 4,096 constraints (increase if circuit grows)

echo "============================================================"
echo " [1/5] Compiling Circuit & Generating Keys (${CIRCUIT_NAME})"
echo "============================================================"
pushd "$CIRCUIT_DIR" > /dev/null

# 1.1. Compile Circom to WASM and R1CS
circom "${CIRCUIT_NAME}.circom" --wasm --r1cs -o .

# 1.2. Ceremony setup & Phase 2 zkey generation
snarkjs powersoftau new bn128 ${PTAU_SIZE} pot12_0000.ptau -v
snarkjs powersoftau contribute pot12_0000.ptau pot12_0001.ptau --name="Phase 1" -v -e="$(date +%s)"
snarkjs powersoftau prepare phase2 pot12_0001.ptau pot12_final.ptau -v

snarkjs groth16 setup "${CIRCUIT_NAME}.r1cs" pot12_final.ptau "${CIRCUIT_NAME}_0000.zkey"
snarkjs zkey contribute "${CIRCUIT_NAME}_0000.zkey" "${CIRCUIT_NAME}.zkey" --name="Phase 2" -v -e="$(date +%N)"

# 1.3. Export verification_key.json for Axum verification server
snarkjs zkey export verificationkey "${CIRCUIT_NAME}.zkey" verification_key.json

popd > /dev/null

echo "============================================================"
echo " [2/5] Distributing Keys & Circuit Artifacts"
echo "============================================================"
MOPRO_TARGET="${MOPRO_DIR}/test-vectors/circom"
mkdir -p "$MOPRO_TARGET"
mkdir -p "$SERVER_DIR"

# Copy WASM and Proving Key to MoPro test-vectors
cp "${CIRCUIT_DIR}/${CIRCUIT_NAME}_js/${CIRCUIT_NAME}.wasm" "${MOPRO_TARGET}/${CIRCUIT_NAME}.wasm"
cp "${CIRCUIT_DIR}/${CIRCUIT_NAME}.zkey" "${MOPRO_TARGET}/${CIRCUIT_NAME}.zkey"

# Copy Verification Key directly to Axum Server root
cp "${CIRCUIT_DIR}/verification_key.json" "${SERVER_DIR}/verification_key.json"

# Clean intermediate ceremony files
rm -rf "${CIRCUIT_DIR}/${CIRCUIT_NAME}_js"
rm -f "${CIRCUIT_DIR}/${CIRCUIT_NAME}.r1cs" "${CIRCUIT_DIR}"/pot12_*.ptau "${CIRCUIT_DIR}/${CIRCUIT_NAME}_0000.zkey"


echo "============================================================"
echo " [3/5] Building MoPro Native Libraries & UniFFI Bindings"
echo "============================================================"
pushd "$MOPRO_DIR" > /dev/null

# Optional clean via flag: run script as `./script.sh --clean` if needed
if [[ "$1" == "--clean" ]]; then
    echo "Performing clean build..."
    cargo clean
fi

mopro build

popd > /dev/null

echo "============================================================"
echo " [4/5] Deploying Bindings to Android Workspace"
echo "============================================================"
KOTLIN_DEST="${ANDROID_DIR}/app/src/main/java/uniffi/mopro"
JNILIBS_DEST="${ANDROID_DIR}/app/src/main/jniLibs"

mkdir -p "$KOTLIN_DEST"
mkdir -p "$JNILIBS_DEST"

# Locate and deploy mopro.kt
MOPRO_KT=$(find . -name "mopro.kt" | head -n 1)
if [ -n "$MOPRO_KT" ]; then
    cp "$MOPRO_KT" "${KOTLIN_DEST}/mopro.kt"
    echo "[+] Copied mopro.kt -> ${KOTLIN_DEST}/mopro.kt"
else
    echo "[x] Error: mopro.kt not found after mopro build!"
    exit 1
fi

# Locate and deploy .so architecture binaries (arm64-v8a, x86_64, etc.)
MOPRO_JNILIBS=$(find . -type d -name "jniLibs" | head -n 1)
if [ -n "$MOPRO_JNILIBS" ]; then
    cp -r "${MOPRO_JNILIBS}/"* "${JNILIBS_DEST}/"
    echo "[+] Copied JNI .so libraries -> ${JNILIBS_DEST}/"
else
    echo "[!] Warning: jniLibs directory not found automatically. Check build output target."
fi

echo "============================================================"
echo " [5/5] Deploying Proving Key (.zkey) via ADB"
echo "============================================================"

# Resolve ADB binary across WSL / Linux environments
#ADB_CMD=""
#if comm+and -v adb &> /dev/null; then
#    ADB_CMD="adb"
#elif command -v adb.exe &> /dev/null; then
#    ADB_CMD="adb.exe"
#fi
#
#if [ -n "$ADB_CMD" ]; then
#    if $ADB_CMD devices | grep -q -v "List of devices attached" | grep -q "device"; then
#        echo "Pushing ${CIRCUIT_NAME}.zkey to active Android target..."
#        $ADB_CMD push "${MOPRO_TARGET}/${CIRCUIT_NAME}.zkey" "/data/local/tmp/${CIRCUIT_NAME}.zkey"
#        echo "✓ Pushed key to /data/local/tmp/${CIRCUIT_NAME}.zkey"
#    else
#        echo "! No active Android device/emulator detected. Skipping adb push."
#    fi
#else
#    echo "! ADB binary not found in PATH. Skipping adb push."
#fi
#

ASSETS_DEST="${ANDROID_DIR}/app/src/main/assets"
mkdir -p "$ASSETS_DEST"

# Copy zkey straight into Android assets
cp "${MOPRO_TARGET}/${CIRCUIT_NAME}.zkey" "${ASSETS_DEST}/${CIRCUIT_NAME}.zkey"

echo "[+] Pushed key to ${ASSETS_DEST}/${CIRCUIT_NAME}.zkey"

# Clean remaining local files
rm -f "${CIRCUIT_DIR}/${CIRCUIT_NAME}.zkey" "${CIRCUIT_DIR}/verification_key.json"

echo "[+] Cleaned up remaining local files"

echo "============================================================"
echo " Pipeline Complete!"
echo "============================================================"