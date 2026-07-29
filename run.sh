#!/usr/bin/env bash
set -eo pipefail

# ==============================================================================
# Directory Setup & Variables
# ==============================================================================
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ARTIFACTS_DIR="${ROOT_DIR}/circuit-generation/artifacts"
SERVER_DIR="${ROOT_DIR}/verification-server"
ANDROID_DIR="/mnt/c/civic-wallet/android"
RESULTS_CSV="${ROOT_DIR}/benchmark_results.csv"
PACKAGE_NAME="io.github.nicolaspurr.civicwallet"
SAMPLE_SIZE=31


# Initialize CSV Header
if [ ! -f "$RESULTS_CSV" ]; then
    echo "circuit_name,proofGenTimeMs,witnessGenTimeMs,totalEngineTimeMs,proofSizeInBytes,serverProcessingTimeMs,nativeHeapDeltaMb,vmHwmMb,thermalStatus,success" > "$RESULTS_CSV"
fi

# ADB Wrapper: Automatically resolves adb/adb.exe and strips Windows '\r' carriage returns
adb_cmd() {
    if command -v adb.exe &> /dev/null; then
        adb.exe "$@" | tr -d '\r'
    elif command -v adb &> /dev/null; then
        adb "$@" | tr -d '\r'
    else
        echo "Error: Neither 'adb' nor 'adb.exe' was found in PATH." >&2
        exit 1
    fi
}

# Target device check
if ! adb_cmd devices | grep -v "List of devices attached" | grep -q "device"; then
    echo "Error: No active Android device or emulator detected via ADB."
    exit 1
fi

echo "============================================================"
echo " [Phase 2] Automated Benchmark Suite Execution"
echo "============================================================"

# Find all circuit artifact directories containing a .zkey
CIRCUIT_DIRS=("$ARTIFACTS_DIR"/*/)

for circuit_dir in "${CIRCUIT_DIRS[@]}"; do
    # Remove trailing slash
    circuit_dir="${circuit_dir%/}"
    CIRCUIT_NAME=$(basename "$circuit_dir")

    ZKEY_PATH="${circuit_dir}/${CIRCUIT_NAME}.zkey"
    VKEY_PATH="${circuit_dir}/${CIRCUIT_NAME}_vkey.json"
    MOPRO_KT_PATH="${circuit_dir}/mopro.kt"
    JNILIBS_PATH="${circuit_dir}/jniLibs"

    if [ ! -f "$ZKEY_PATH" ]; then
        continue
    fi

    echo ""
    echo "------------------------------------------------------------"
    echo " Benchmarking Circuit: ${CIRCUIT_NAME}"
    echo "------------------------------------------------------------"

    # 1.
    # Deploy native libraries, Kotlin bindings, & assets to Android source workspace
    echo "[+] Deploying ${CIRCUIT_NAME} native libraries, bindings, and assets..."
    KOTLIN_DEST="${ANDROID_DIR}/app/src/main/java/uniffi/mopro"
    JNILIBS_DEST="${ANDROID_DIR}/app/src/main/jniLibs"
    ASSETS_DEST="${ANDROID_DIR}/app/src/main/assets"

    mkdir -p "$KOTLIN_DEST" "$JNILIBS_DEST" "$ASSETS_DEST"

    #cp "$MOPRO_KT_PATH" "${KOTLIN_DEST}/mopro.kt"
    rm -rf "${JNILIBS_DEST:?}"/*
    cp -r "${JNILIBS_PATH}/"* "${JNILIBS_DEST}/"

    # Copy zkey to Android assets before compiling
    #cp "$ZKEY_PATH" "${ASSETS_DEST}/${CIRCUIT_NAME}.zkey"
    cp "$ZKEY_PATH" "${ASSETS_DEST}/cbdc.zkey"

    # 2.
    # Uninstall old app instance from device to purge cached .so dynamic libraries
    echo "[+] Uninstalling previous APK from device..."
    adb_cmd uninstall "${PACKAGE_NAME}" 2>/dev/null || true

    # 3.
    # Clean, rebuild, and reinstall fresh APK via Windows Gradle
    echo "[+] Rebuilding and installing fresh Android APK via Gradle..."
    pushd "$ANDROID_DIR" > /dev/null
    cmd.exe /c "gradlew.bat clean installDebug" > /dev/null
    popd > /dev/null

    # 4.
    # Update verification key for Axum backend server
    if [ -d "$SERVER_DIR" ]; then
        cp "$VKEY_PATH" "${SERVER_DIR}/verification_key.json"
        #pkill -f "verification-server" || true
        echo "[+] Updated Axum server verification key"
    fi

    # 5.
    # Push .zkey directly to internal storage (AFTER fresh APK install)
    TEMP_STAGE="/data/local/tmp/temp_circuit.zkey"
    adb_cmd push "$ZKEY_PATH" "$TEMP_STAGE" > /dev/null
    adb_cmd shell "chmod 666 ${TEMP_STAGE}"

    adb_cmd shell "run-as ${PACKAGE_NAME} mkdir -p files"
    #adb_cmd shell "run-as ${PACKAGE_NAME} cp ${TEMP_STAGE} files/${CIRCUIT_NAME}.zkey"
    adb_cmd shell "run-as ${PACKAGE_NAME} cp ${TEMP_STAGE} files/cbdc.zkey"

    EXT_FILES_DIR="/storage/emulated/0/Android/data/${PACKAGE_NAME}/files"
    adb_cmd shell "run-as ${PACKAGE_NAME} mkdir -p ${EXT_FILES_DIR}" 2>/dev/null || true
    #adb_cmd shell "run-as ${PACKAGE_NAME} cp ${TEMP_STAGE} ${EXT_FILES_DIR}/${CIRCUIT_NAME}.zkey" 2>/dev/null || true
    adb_cmd shell "run-as ${PACKAGE_NAME} cp ${TEMP_STAGE} ${EXT_FILES_DIR}/cbdc.zkey" 2>/dev/null || true

    adb_cmd shell "rm -f ${TEMP_STAGE}"
    echo "[+] Staged and copied ${CIRCUIT_NAME}.zkey to app storage"

    # 6.
    # Benchmark and collect data
    for i in $(seq 1 $SAMPLE_SIZE); do
    	echo "Test ${i}"
        
        # 6.1 Clear Logcat buffer
    	adb_cmd logcat -c

    	# 6.2 Launch app cleanly in benchmark mode
    	echo "[+] Force-stopping old instance and launching app via ADB Intent..."
    	adb_cmd shell am force-stop "${PACKAGE_NAME}"
    	sleep 1

    	adb_cmd shell am start -S \
            -n "${PACKAGE_NAME}/.MainActivity" \
            --ez benchmark_mode true \
            --es target_circuit "${CIRCUIT_NAME}" > /dev/null
        
        # 6.3
	    # Non-blocking capture loop with Timeout & Crash detection
	    echo "[+] Awaiting cryptographic execution metrics..."
	    JSON_STR=""
	    TIMEOUT=60
	    ELAPSED=0

	    while [ -z "$JSON_STR" ]; do
            sleep 2
            ELAPSED=$((ELAPSED + 2))

            # Check if app process died unexpectedly (OOM / Exception)
            PID=$(adb_cmd shell pidof "${PACKAGE_NAME}" || true)
            if [ -z "$PID" ] && [ "$ELAPSED" -gt 4 ]; then
                echo "Error: App process died unexpectedly (likely OOM crash on large circuit)." >&2
                echo "${CIRCUIT_NAME},ERROR_APP_CRASHED,,,,,false" >> "$RESULTS_CSV"
                break
            fi

            if [ "$ELAPSED" -ge "$TIMEOUT" ]; then
                echo "Error: Timed out waiting for benchmark log output (${TIMEOUT}s)." >&2
                echo "${CIRCUIT_NAME},ERROR_TIMEOUT,,,,,,,,false" >> "$RESULTS_CSV"
                break
            fi

            # Safely fetch log output (added `|| true` to prevent `set -eo pipefail` abort)
            JSON_STR=$(adb_cmd logcat -d -v raw -s "CIVIC_BENCHMARK:I" | grep "{" | head -n 1 || true)
        done

        # Skip CSV parsing on error/timeout to prevent duplicate null rows
        if [ -z "$JSON_STR" ]; then
            echo "[!] Skipping parsing for ${CIRCUIT_NAME} due to error/timeout."
            sleep 2
            continue
        fi

        echo ">>> Output Received:"
        echo "$JSON_STR"

        # 6.4
        # Parse JSON and append to CSV using jq
        if command -v jq &> /dev/null; then
            PROOF_GEN=$(echo "$JSON_STR" | jq -r '.witnessAndProofGenTimeMs')
            LOCAL_VER=$(echo "$JSON_STR" | jq -r '.localVerificationTimeMs')
            TOTAL_ENGINE=$(echo "$JSON_STR" | jq -r '.totalEngineTimeMs')
            SIZE=$(echo "$JSON_STR" | jq -r '.proofSizeInBytes')
            SERVER_TIME=$(echo "$JSON_STR" | jq -r '.serverProcessingTimeMs')
            HEAP_DELTA=$(echo "$JSON_STR" | jq -r '.nativeHeapDeltaMb')
            VM_HWM=$(echo "$JSON_STR" | jq -r '.vmHwmMb')
            THERMAL=$(echo "$JSON_STR" | jq -r '.thermalStatus')
            SUCCESS=$(echo "$JSON_STR" | jq -r '.success')

            echo "${CIRCUIT_NAME},${PROOF_GEN},${LOCAL_VER},${TOTAL_ENGINE},${SIZE},${SERVER_TIME},${HEAP_DELTA},${VM_HWM},${THERMAL},${SUCCESS}" >> "$RESULTS_CSV"      
            echo "Recorded metrics to $RESULTS_CSV"
            else
            echo "${CIRCUIT_NAME},RAW_JSON: ${JSON_STR}" >> "$RESULTS_CSV"
        fi

        # Allow 2-second cooldown for memory garbage collection
        sleep 2
    done
done

echo ""
echo "============================================================"
echo " Benchmark Run Finished! Results saved to: $RESULTS_CSV"
echo "============================================================"
