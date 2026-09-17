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
FIXTURES_SRC="${ROOT_DIR}/build/fixtures"   # ZMIANA: wektory testowe do assets
PACKAGE_NAME="io.github.nicolaspurr.civicwallet"
<<<<<<< Updated upstream
=======
SAMPLE_SIZE=101

# ==============================================================================
# ZMIANA: jawna lista wariantów zamiast globu po katalogach artefaktów.
# Glob wciągałby również katalogi obwodów v1, które nadal leżą w artifacts/.
# Kolejność rosnąca względem złożoności; kontrola ablacyjna na końcu, bo jest
# najcięższa i najbardziej naraża urządzenie na throttling.
# ==============================================================================
CIRCUITS=(
#    standard_metro
#    standard_nation
#    standard_union
#    standard_global
    advanced_metro
    advanced_nation
#    advanced_union
#    advanced_global
#    advanced_union_bl160
)

# ZMIANA: głębokości do CSV — bez nich nie da się później zestawić czasu
# z liczbą ograniczeń bez ręcznego mapowania nazw.
depth_of() {
    case "$1" in
        *_metro*)  echo 41 ;;
        *_nation*) echo 44 ;;
        *_union*)  echo 47 ;;
        *_global*) echo 51 ;;
        *)         echo 0  ;;
    esac
}
bl_depth_of() {
    case "$1" in
        standard_*)       echo 0   ;;
        *_bl160)          echo 160 ;;
        *_metro|*_nation) echo 23  ;;
        *_union)          echo 26  ;;
        *_global)         echo 29  ;;
        *)                echo 0   ;;
    esac
}
>>>>>>> Stashed changes

# Initialize CSV Header
# ZMIANA: dodane state_depth i bl_depth; pozostałe kolumny bez zmian.
if [ ! -f "$RESULTS_CSV" ]; then
    echo "circuit_name,state_depth,bl_depth,proofGenTimeMs,witnessGenTimeMs,totalEngineTimeMs,proofSizeInBytes,serverProcessingTimeMs,nativeHeapDeltaMb,vmHwmMb,thermalStatus,success" > "$RESULTS_CSV"
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

# ZMIANA: adb.exe to binarka Windows i nie rozumie ścieżek /mnt/c/... — dostaje
# je dosłownie i zgłasza "cannot stat", mimo że bash widzi plik. Ścieżki lokalne
# przekazywane do `adb push` muszą zostać przekonwertowane przez wslpath.
adb_push() {
    local local_path="$1" remote_path="$2"
    if command -v adb.exe &> /dev/null && command -v wslpath &> /dev/null; then
        local win_path
        win_path=$(wslpath -w "$local_path")
        adb.exe push "$win_path" "$remote_path" | tr -d '\r'
    else
        adb_cmd push "$local_path" "$remote_path"
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

for CIRCUIT_NAME in "${CIRCUITS[@]}"; do
    circuit_dir="${ARTIFACTS_DIR}/${CIRCUIT_NAME}"

    ZKEY_PATH="${circuit_dir}/${CIRCUIT_NAME}.zkey"
    VKEY_PATH="${circuit_dir}/${CIRCUIT_NAME}_vkey.json"
    MOPRO_KT_PATH="${circuit_dir}/mopro.kt"
    JNILIBS_PATH="${circuit_dir}/jniLibs"

    if [ ! -f "$ZKEY_PATH" ]; then
        echo "[!] Skipping ${CIRCUIT_NAME}: no .zkey in ${circuit_dir}"
        continue
    fi

    STATE_DEPTH=$(depth_of "$CIRCUIT_NAME")
    BL_DEPTH=$(bl_depth_of "$CIRCUIT_NAME")

    echo ""
    echo "------------------------------------------------------------"
    echo " Benchmarking Circuit: ${CIRCUIT_NAME} (D=${STATE_DEPTH}, BL=${BL_DEPTH})"
    echo "------------------------------------------------------------"

    # 1. Deploy native libraries, Kotlin bindings, & assets to Android source workspace
    echo "[+] Deploying ${CIRCUIT_NAME} native libraries, bindings, and assets..."
    KOTLIN_DEST="${ANDROID_DIR}/app/src/main/java/uniffi/mopro"
    JNILIBS_DEST="${ANDROID_DIR}/app/src/main/jniLibs"
    ASSETS_DEST="${ANDROID_DIR}/app/src/main/assets"

    mkdir -p "$KOTLIN_DEST" "$JNILIBS_DEST" "$ASSETS_DEST"

    #cp "$MOPRO_KT_PATH" "${KOTLIN_DEST}/mopro.kt"
    rm -rf "${JNILIBS_DEST:?}"/*
    cp -r "${JNILIBS_PATH}/"* "${JNILIBS_DEST}/"

    # Copy zkey to Android assets before compiling
    # Nazwa cbdc.zkey pozostaje wspólna: biblioteka natywna MoPro ma wkompilowany
    # generator świadka konkretnego obwodu, więc każdy APK obsługuje dokładnie
    # jeden wariant i rozróżnianie plików kluczy byłoby zbędne.
    cp "$ZKEY_PATH" "${ASSETS_DEST}/cbdc.zkey"

<<<<<<< Updated upstream
    # 2. Uninstall old app instance from device to purge cached .so dynamic libraries
=======
    # ZMIANA: wektor testowy tego obwodu do assets.
    # Obwody v2 wyliczają zobowiązania samodzielnie i porównują odtworzony
    # korzeń drzewa z korzeniem publicznym, więc aplikacja nie może już
    # podstawiać dowolnych liczb — potrzebuje wektora spójnego z Poseidonem.
    if [ -f "${FIXTURES_SRC}/${CIRCUIT_NAME}.json" ]; then
        mkdir -p "${ASSETS_DEST}/zk_fixtures"
        cp "${FIXTURES_SRC}/${CIRCUIT_NAME}.json" "${ASSETS_DEST}/zk_fixtures/${CIRCUIT_NAME}.json"
        echo "[+] Deployed test fixture for ${CIRCUIT_NAME}"
    else
        echo "[!] Warning: no fixture at ${FIXTURES_SRC}/${CIRCUIT_NAME}.json" >&2
    fi

    # 2.
    # Uninstall old app instance from device to purge cached .so dynamic libraries
>>>>>>> Stashed changes
    echo "[+] Uninstalling previous APK from device..."
    adb_cmd uninstall "${PACKAGE_NAME}" 2>/dev/null || true

    # 3. Clean, rebuild, and reinstall fresh APK via Windows Gradle
    echo "[+] Rebuilding and installing fresh Android APK via Gradle..."
    pushd "$ANDROID_DIR" > /dev/null
    cmd.exe /c "gradlew.bat clean installDebug" > /dev/null
    popd > /dev/null

    # 4. Update verification key for Axum backend server
    if [ -d "$SERVER_DIR" ]; then
        cp "$VKEY_PATH" "${SERVER_DIR}/verification_key.json"
        #pkill -f "verification-server" || true
        echo "[+] Updated Axum server verification key"
    fi

    # 5. Push .zkey directly to internal storage (AFTER fresh APK install)
    TEMP_STAGE="/data/local/tmp/temp_circuit.zkey"
    adb_push "$ZKEY_PATH" "$TEMP_STAGE" > /dev/null
    adb_cmd shell "chmod 666 ${TEMP_STAGE}"

    adb_cmd shell "run-as ${PACKAGE_NAME} mkdir -p files"
    adb_cmd shell "run-as ${PACKAGE_NAME} cp ${TEMP_STAGE} files/cbdc.zkey"

    EXT_FILES_DIR="/storage/emulated/0/Android/data/${PACKAGE_NAME}/files"
    adb_cmd shell "run-as ${PACKAGE_NAME} mkdir -p ${EXT_FILES_DIR}" 2>/dev/null || true
    adb_cmd shell "run-as ${PACKAGE_NAME} cp ${TEMP_STAGE} ${EXT_FILES_DIR}/cbdc.zkey" 2>/dev/null || true

    adb_cmd shell "rm -f ${TEMP_STAGE}"
    echo "[+] Staged and copied ${CIRCUIT_NAME}.zkey to app storage"

<<<<<<< Updated upstream
    # 6. Clear Logcat buffer
    adb_cmd logcat -c

    # 7. Launch app cleanly in benchmark mode
    echo "[+] Force-stopping old instance and launching app via ADB Intent..."
    adb_cmd shell am force-stop "${PACKAGE_NAME}"
    sleep 1

    adb_cmd shell am start -S \
        -n "${PACKAGE_NAME}/.MainActivity" \
        --ez benchmark_mode true \
        --es target_circuit "${CIRCUIT_NAME}" > /dev/null

    # 8. Non-blocking loop with timeout & crash detection
    echo "[+] Awaiting cryptographic execution metrics..."
    JSON_STR=""
    TIMEOUT=60
    ELAPSED=0

    while [ -z "$JSON_STR" ]; do
=======
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
            TIMEOUT=90
            ELAPSED=0

            while [ -z "$JSON_STR" ]; do
            sleep 2
            ELAPSED=$((ELAPSED + 2))

            # Check if app process died unexpectedly (OOM / Exception)
            PID=$(adb_cmd shell pidof "${PACKAGE_NAME}" || true)
            if [ -z "$PID" ] && [ "$ELAPSED" -gt 4 ]; then
                # ZMIANA: proces kończy się normalnie przez finishAndRemoveTask,
                # więc brak PID nie musi oznaczać awarii — sprawdź logcat zanim
                # uznasz przebieg za nieudany.
                JSON_STR=$(adb_cmd logcat -d -v raw -s "CIVIC_BENCHMARK:I" | grep "{" | head -n 1 || true)
                if [ -n "$JSON_STR" ]; then break; fi

                echo "Error: App process died unexpectedly (likely OOM crash on large circuit)." >&2
                # ZMIANA: poprawna liczba kolumn (12). Poprzednio wiersze błędów
                # miały 7 lub 10 pól, przez co CSV rozjeżdżał się przy imporcie.
                echo "${CIRCUIT_NAME},${STATE_DEPTH},${BL_DEPTH},ERROR_APP_CRASHED,,,,,,,,false" >> "$RESULTS_CSV"
                # ZMIANA: zrzut diagnostyczny — bez niego nie odróżnisz OOM
                # od błędu generowania świadka.
                adb_cmd logcat -d -v brief | grep -iE "AndroidRuntime|ZkProofEngine|lowmemorykiller|CivicWallet" | tail -8 >&2 || true
                break
            fi

            if [ "$ELAPSED" -ge "$TIMEOUT" ]; then
                echo "Error: Timed out waiting for benchmark log output (${TIMEOUT}s)." >&2
                echo "${CIRCUIT_NAME},${STATE_DEPTH},${BL_DEPTH},ERROR_TIMEOUT,,,,,,,,false" >> "$RESULTS_CSV"
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
            # ZMIANA: nazwy pól tolerancyjne — skrypt działa zarówno ze starym,
            # jak i z nowym ZkProofResult, więc nie wymaga synchronicznej zmiany
            # po stronie Kotlina.
            PROOF_GEN=$(echo "$JSON_STR"    | jq -r '.proofGenTimeMs // .witnessAndProofGenTimeMs // "NA"')
            LOCAL_VER=$(echo "$JSON_STR"    | jq -r '.verificationTimeMs // .localVerificationTimeMs // "NA"')
            TOTAL_ENGINE=$(echo "$JSON_STR" | jq -r '.totalEngineTimeMs // "NA"')
            SIZE=$(echo "$JSON_STR"         | jq -r '.payloadBytes // .proofSizeInBytes // "NA"')
            SERVER_TIME=$(echo "$JSON_STR"  | jq -r '.serverProcessingTimeMs // "NA"')
            HEAP_DELTA=$(echo "$JSON_STR"   | jq -r '.nativeHeapDeltaMb // "NA"')
            VM_HWM=$(echo "$JSON_STR"       | jq -r '.vmHwmMb // "NA"')
            THERMAL=$(echo "$JSON_STR"      | jq -r '.thermalStatus // .thermalStatusAfter // "NA"')
            SUCCESS=$(echo "$JSON_STR"      | jq -r '.success // true')

            echo "${CIRCUIT_NAME},${STATE_DEPTH},${BL_DEPTH},${PROOF_GEN},${LOCAL_VER},${TOTAL_ENGINE},${SIZE},${SERVER_TIME},${HEAP_DELTA},${VM_HWM},${THERMAL},${SUCCESS}" >> "$RESULTS_CSV"
            echo "Recorded metrics to $RESULTS_CSV"
            else
            echo "${CIRCUIT_NAME},RAW_JSON: ${JSON_STR}" >> "$RESULTS_CSV"
        fi

        # Allow 2-second cooldown for memory garbage collection
>>>>>>> Stashed changes
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

        # Fetch log output (added `|| true` to prevent `set -eo pipefail` from aborting)
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

    # 9. Parse JSON and append to CSV using jq
    if command -v jq &> /dev/null; then
        PROOF_GEN=$(echo "$JSON_STR" | jq -r '.proofGenTimeMs')
        WITNESS_GEN=$(echo "$JSON_STR" | jq -r '.witnessGenTimeMs')
        TOTAL_ENGINE=$(echo "$JSON_STR" | jq -r '.totalEngineTimeMs')
        SIZE=$(echo "$JSON_STR" | jq -r '.proofSizeInBytes')
        SERVER_TIME=$(echo "$JSON_STR" | jq -r '.serverProcessingTimeMs')
        HEAP_DELTA=$(echo "$JSON_STR" | jq -r '.nativeHeapDeltaMb')
        VM_HWM=$(echo "$JSON_STR" | jq -r '.vmHwmMb')
        THERMAL=$(echo "$JSON_STR" | jq -r '.thermalStatus')
        SUCCESS=$(echo "$JSON_STR" | jq -r '.success')

        echo "${CIRCUIT_NAME},${PROOF_GEN},${WITNESS_GEN},${TOTAL_ENGINE},${SIZE},${SERVER_TIME},${HEAP_DELTA},${VM_HWM},${THERMAL},${SUCCESS}" >> "$RESULTS_CSV"
        echo "Recorded metrics to $RESULTS_CSV"
    else
        echo "${CIRCUIT_NAME},RAW_JSON: ${JSON_STR}" >> "$RESULTS_CSV"
    fi

    # Allow 2-second cooldown for memory garbage collection
    sleep 2
done

echo ""
echo "============================================================"
echo " Benchmark Run Finished! Results saved to: $RESULTS_CSV"
echo "============================================================"