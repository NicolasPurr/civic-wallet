#!/usr/bin/env bash
#
# run.sh - benchmark every circuit variant on a connected Android device.
#
# For each variant this script deploys the variant's native libraries, Kotlin
# bindings, proving key (always as cbdc.zkey) and test vector into the Android
# project, rebuilds and reinstalls the APK, restarts the verification server
# (with cargo run) on the matching verification key, forwards the phone's
# localhost:8080 to this machine (adb reverse), and then launches the app
# SAMPLE_SIZE times in benchmark mode. Each run appends one row to
# benchmark_results.csv and the raw JSON to benchmark_raw.tsv.
#
# Usage:
#   ./run.sh                                  # all variants in variants.conf
#   ./run.sh advanced_metro advanced_nation   # only the named variants
#
# Environment overrides: ANDROID_DIR, SAMPLE_SIZE, RUN_TIMEOUT, COOLDOWN,
# SERVER_START_TIMEOUT.
set -Eeuo pipefail
trap 'echo "[x] Failed at line $LINENO: $BASH_COMMAND" >&2' ERR

# ==============================================================================
# Paths and settings
# ==============================================================================
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ARTIFACTS_DIR="${ROOT_DIR}/circuit-generation/artifacts"
VARIANTS_FILE="${ROOT_DIR}/circuit-generation/variants.conf"
FIXTURES_SRC="${ROOT_DIR}/build/fixtures"
SERVER_DIR="${ROOT_DIR}/verification-server"
SERVER_PORT=8080
LOG_DIR="${ROOT_DIR}/logs"
ANDROID_DIR="${ANDROID_DIR:-/mnt/c/civic-wallet/android}"
RESULTS_CSV="${ROOT_DIR}/benchmark_results.csv"
RAW_LOG="${ROOT_DIR}/benchmark_raw.tsv"
PACKAGE_NAME="io.github.nicolaspurr.civicwallet"

SAMPLE_SIZE="${SAMPLE_SIZE:-101}"   # runs per variant
RUN_TIMEOUT="${RUN_TIMEOUT:-90}"    # seconds to wait for one run's result
COOLDOWN="${COOLDOWN:-3}"           # seconds between runs, lets the device cool down
SERVER_START_TIMEOUT="${SERVER_START_TIMEOUT:-300}"  # seconds; the server seeds 10M DB rows at startup
POLL_INTERVAL=2

# Columns are named exactly like the ZkProofResult properties that
# PaymentViewModel.logBenchmarkResults() logs, so a value can be traced from
# the app to the CSV by name. Missing fields are written as NA. If you add a
# field in the app, add it here too (header and JQ_ROW in the same position).
#   proofGenTimeMs       witness + proof generation (one MoPro call)
#   payloadBytes*        size of the JSON request body, not of the raw proof
CSV_HEADER="circuit_name,state_depth,bl_depth,run,status,proofGenTimeMs,verificationTimeMs,totalEngineTimeMs,serverProcessingTimeMs,payloadBytesCompact,payloadBytesVerbose,publicSignalCount,nativeHeapBeforeMb,nativeHeapAfterMb,nativeHeapDeltaMb,vmHwmMb,thermalStatusBefore,thermalStatusAfter,success,error"
JQ_ROW='[
    .proofGenTimeMs,
    .verificationTimeMs,
    .totalEngineTimeMs,
    .serverProcessingTimeMs,
    .payloadBytesCompact,
    .payloadBytesVerbose,
    .publicSignalCount,
    .nativeHeapBeforeMb,
    .nativeHeapAfterMb,
    .nativeHeapDeltaMb,
    .vmHwmMb,
    .thermalStatusBefore,
    .thermalStatusAfter,
    .success,
    (.error // "" | gsub("[,\r\n]"; " "))
] | map(if . == null then "NA" else tostring end) | join(",")'
METRIC_COLUMNS=13   # number of fields in JQ_ROW before success and error

# ==============================================================================
# Helpers
# ==============================================================================

read_variants() {
    sed -e 's/#.*//' -e '/^[[:space:]]*$/d' "$VARIANTS_FILE"
}

# Run adb from WSL or Linux. Uses adb.exe when present and strips the
# Windows '\r' line endings from its output.
adb_cmd() {
    if command -v adb.exe &> /dev/null; then
        adb.exe "$@" | tr -d '\r'
    elif command -v adb &> /dev/null; then
        adb "$@" | tr -d '\r'
    else
        echo "Error: neither 'adb' nor 'adb.exe' found in PATH" >&2
        exit 1
    fi
}

# adb.exe is a Windows program and cannot open WSL paths such as /mnt/c/...
# ("cannot stat"), so convert local paths with wslpath before pushing.
adb_push() {
    local local_path="$1" remote_path="$2"
    if command -v adb.exe &> /dev/null && command -v wslpath &> /dev/null; then
        adb.exe push "$(wslpath -w "$local_path")" "$remote_path" | tr -d '\r'
    else
        adb_cmd push "$local_path" "$remote_path"
    fi
}

# Write a result row for a run that produced no metrics.
write_error_row() {
    local status="$1" na="" i
    for ((i = 0; i < METRIC_COLUMNS; i++)); do na+="NA,"; done
    echo "${CIRCUIT_NAME},${STATE_DEPTH},${BL_DEPTH},${run},${status},${na}false,${status}" >> "$RESULTS_CSV"
}

# Forward the phone's localhost:SERVER_PORT to this machine, where the
# verification server runs. Without it the app cannot reach the server.
setup_reverse() {
    if ! adb_cmd reverse "tcp:${SERVER_PORT}" "tcp:${SERVER_PORT}" > /dev/null; then
        echo "Error: 'adb reverse tcp:${SERVER_PORT} tcp:${SERVER_PORT}' failed." >&2
        exit 1
    fi
    if ! adb_cmd reverse --list | grep -q "tcp:${SERVER_PORT}"; then
        echo "Error: 'adb reverse tcp:${SERVER_PORT} tcp:${SERVER_PORT}' did not take effect." >&2
        exit 1
    fi
}

# Library name that a mopro.kt loads (its findLibraryName), e.g. "mopro_fresh"
# for libmopro_fresh.so.
bindings_lib_name() {
    sed -n '/fun findLibraryName/,/^}/s/.*return "\([^"]*\)".*/\1/p' "$1" | tail -n 1
}

# First benchmark JSON line in logcat, or nothing.
fetch_result() {
    adb_cmd logcat -d -v raw -s "CIVIC_BENCHMARK:I" | grep -m 1 "{" || true
}

SERVER_PID=""

stop_server() {
    if [[ -n "$SERVER_PID" ]] && kill -0 "$SERVER_PID" 2> /dev/null; then
        # The server runs in its own process group; stop the whole group.
        kill -- -"$SERVER_PID" 2> /dev/null || kill "$SERVER_PID"
        wait "$SERVER_PID" 2> /dev/null || true
    fi
    SERVER_PID=""
}
trap stop_server EXIT

# Restart the server so it loads the verification key of the current variant.
start_server() {
    stop_server

    if nc -z localhost "$SERVER_PORT" 2> /dev/null; then
        echo "Error: port ${SERVER_PORT} is used by another process (an old server?)." >&2
        echo "       Stop it first, e.g.: pkill -f verification-server" >&2
        exit 1
    fi

    local log="${LOG_DIR}/server_${CIRCUIT_NAME}.log"
    # Same start command as before (cargo run), so the binary name does not matter.
    (cd "$SERVER_DIR" && exec setsid cargo run --release) > "$log" 2>&1 &
    SERVER_PID=$!

    # The server binds the port before it seeds its database, so an open port
    # does not mean it is ready. Wait for its "listening on" log line instead.
    local waited=0
    until grep -q "listening on" "$log" 2> /dev/null; do
        if ! kill -0 "$SERVER_PID" 2> /dev/null || (( waited >= SERVER_START_TIMEOUT )); then
            echo "Error: verification server did not start. Last lines of $log:" >&2
            tail -n 20 "$log" >&2
            exit 1
        fi
        sleep 1
        waited=$((waited + 1))
    done
    echo "[+] Verification server running with ${CIRCUIT_NAME}_vkey.json"
}

# ==============================================================================
# Pre-flight checks
# ==============================================================================
for tool in jq nc cmd.exe; do
    command -v "$tool" > /dev/null || { echo "Error: '$tool' not found in PATH" >&2; exit 1; }
done
[[ -f "$VARIANTS_FILE" ]] || { echo "Error: missing $VARIANTS_FILE" >&2; exit 1; }
[[ -d "$ANDROID_DIR" ]]   || { echo "Error: ANDROID_DIR=$ANDROID_DIR does not exist" >&2; exit 1; }

if ! adb_cmd devices | awk 'NR > 1 && $2 == "device"' | grep -q .; then
    echo "Error: no Android device or emulator connected (adb devices)." >&2
    exit 1
fi

setup_reverse
DEVICE_ABI=$(adb_cmd shell getprop ro.product.cpu.abi | tr -d '[:space:]')
echo "[+] Device CPU type: ${DEVICE_ABI}; adb reverse tcp:${SERVER_PORT} is active"

# Never mix rows of different layouts in one file.
if [[ -f "$RESULTS_CSV" ]]; then
    if [[ "$(head -n 1 "$RESULTS_CSV")" != "$CSV_HEADER" ]]; then
        echo "Error: $RESULTS_CSV has a different column layout." >&2
        echo "       Rename or move it, then run again." >&2
        exit 1
    fi
else
    echo "$CSV_HEADER" > "$RESULTS_CSV"
fi

mkdir -p "$LOG_DIR"

declare -A STATE_DEPTHS BL_DEPTHS
ALL_CIRCUITS=()
mapfile -t VARIANT_ROWS < <(read_variants)
for row in "${VARIANT_ROWS[@]}"; do
    read -r name _ d bl <<< "$row"
    ALL_CIRCUITS+=("$name")
    STATE_DEPTHS[$name]="$d"
    BL_DEPTHS[$name]="$bl"
done

if [[ $# -gt 0 ]]; then
    CIRCUITS=("$@")
    for c in "${CIRCUITS[@]}"; do
        [[ -n "${STATE_DEPTHS[$c]:-}" ]] || { echo "Error: '$c' is not listed in $VARIANTS_FILE" >&2; exit 1; }
    done
else
    CIRCUITS=("${ALL_CIRCUITS[@]}")
fi

if [[ -d "$SERVER_DIR" ]]; then
    echo "[+] Building verification server..."
    (cd "$SERVER_DIR" && cargo build --release > "${LOG_DIR}/server_build.log" 2>&1) || {
        echo "Error: server build failed, see ${LOG_DIR}/server_build.log" >&2
        exit 1
    }
else
    echo "[!] Warning: $SERVER_DIR not found; serverProcessingTimeMs will be missing." >&2
fi

echo "============================================================"
echo " Benchmark suite: ${#CIRCUITS[@]} variant(s), ${SAMPLE_SIZE} runs each"
echo "============================================================"

SKIPPED=()

for CIRCUIT_NAME in "${CIRCUITS[@]}"; do
    circuit_dir="${ARTIFACTS_DIR}/${CIRCUIT_NAME}"
    ZKEY_PATH="${circuit_dir}/${CIRCUIT_NAME}.zkey"
    VKEY_PATH="${circuit_dir}/${CIRCUIT_NAME}_vkey.json"
    JNILIBS_PATH="${circuit_dir}/jniLibs"
    FIXTURE_PATH="${FIXTURES_SRC}/${CIRCUIT_NAME}.json"
    STATE_DEPTH="${STATE_DEPTHS[$CIRCUIT_NAME]}"
    BL_DEPTH="${BL_DEPTHS[$CIRCUIT_NAME]}"

    missing=""
    for f in "$ZKEY_PATH" "$VKEY_PATH" "$JNILIBS_PATH" "${circuit_dir}/mopro.kt" "$FIXTURE_PATH"; do
        [[ -e "$f" ]] || missing="$f"
    done
    if [[ -n "$missing" ]]; then
        echo "[!] Skipping ${CIRCUIT_NAME}: missing $missing" >&2
        SKIPPED+=("$CIRCUIT_NAME")
        continue
    fi

    # mopro.kt must load a library that this build produced for the phone's
    # CPU type, and must be in package uniffi.mopro (the app imports it there).
    LIB_NAME=$(bindings_lib_name "${circuit_dir}/mopro.kt")
    if [[ -z "$LIB_NAME" || ! -f "${JNILIBS_PATH}/${DEVICE_ABI}/lib${LIB_NAME}.so" ]]; then
        echo "[!] Skipping ${CIRCUIT_NAME}: mopro.kt loads '${LIB_NAME:-?}', but there is no ${JNILIBS_PATH}/${DEVICE_ABI}/lib${LIB_NAME:-?}.so" >&2
        SKIPPED+=("$CIRCUIT_NAME")
        continue
    fi
    if ! grep -qE '^package uniffi\.mopro;?[[:space:]]*$' "${circuit_dir}/mopro.kt"; then
        echo "[!] Skipping ${CIRCUIT_NAME}: ${circuit_dir}/mopro.kt is not in package uniffi.mopro" >&2
        SKIPPED+=("$CIRCUIT_NAME")
        continue
    fi

    echo ""
    echo "------------------------------------------------------------"
    echo " Benchmarking ${CIRCUIT_NAME} (D=${STATE_DEPTH}, BL=${BL_DEPTH})"
    echo "------------------------------------------------------------"

    # 1. Copy the variant's files into the Android project.
    #    mopro.kt and the .so files must come from the same build: the bindings
    #    load the library by name (e.g. "mopro_fresh" -> libmopro_fresh.so).
    #    The proving key is always called cbdc.zkey: the witness generator is
    #    compiled into the .so, so each APK serves exactly one variant anyway.
    echo "[+] Deploying native libraries, bindings, proving key and test vector..."
    KOTLIN_DEST="${ANDROID_DIR}/app/src/main/java/uniffi/mopro"
    JNILIBS_DEST="${ANDROID_DIR}/app/src/main/jniLibs"
    ASSETS_DEST="${ANDROID_DIR}/app/src/main/assets"
    FIXTURES_DEST="${ASSETS_DEST}/zk_fixtures"
    mkdir -p "$KOTLIN_DEST" "$JNILIBS_DEST" "$FIXTURES_DEST"

    rm -rf "${JNILIBS_DEST:?}"/*
    cp -r "${JNILIBS_PATH}/"* "${JNILIBS_DEST}/"
    cp "${circuit_dir}/mopro.kt" "${KOTLIN_DEST}/mopro.kt"
    cp "$ZKEY_PATH" "${ASSETS_DEST}/cbdc.zkey"
    echo "[+] Bindings load lib${LIB_NAME}.so; proving key deployed as cbdc.zkey"

    # The circuit recomputes the Merkle root from the witness, so the app needs
    # a test vector that is consistent with Poseidon (see generate_fixtures.mjs).
    rm -f "${FIXTURES_DEST:?}"/*.json
    cp "$FIXTURE_PATH" "${FIXTURES_DEST}/${CIRCUIT_NAME}.json"

    # 2. Uninstall the old APK so no cached .so from another variant survives.
    echo "[+] Uninstalling previous APK..."
    adb_cmd uninstall "${PACKAGE_NAME}" > /dev/null 2>&1 || true

    # 3. Clean build and install with the Windows Gradle wrapper.
    echo "[+] Building and installing APK with Gradle..."
    GRADLE_LOG="${LOG_DIR}/gradle_${CIRCUIT_NAME}.log"
    pushd "$ANDROID_DIR" > /dev/null
    if ! cmd.exe /c "gradlew.bat clean installDebug" > "$GRADLE_LOG" 2>&1; then
        echo "Error: Gradle build failed. Last lines of $GRADLE_LOG:" >&2
        tail -n 30 "$GRADLE_LOG" >&2
        exit 1
    fi
    popd > /dev/null

    # 4. Restart the verification server with this variant's verification key.
    if [[ -d "$SERVER_DIR" ]]; then
        cp "$VKEY_PATH" "${SERVER_DIR}/verification_key.json"
        start_server
    fi

    # 5. Copy the proving key into the app's internal and external storage.
    #    This must happen after the install, because uninstalling deletes them.
    TEMP_STAGE="/data/local/tmp/temp_circuit.zkey"
    adb_push "$ZKEY_PATH" "$TEMP_STAGE" > /dev/null
    adb_cmd shell "chmod 666 ${TEMP_STAGE}"

    adb_cmd shell "run-as ${PACKAGE_NAME} mkdir -p files"
    adb_cmd shell "run-as ${PACKAGE_NAME} cp ${TEMP_STAGE} files/cbdc.zkey"

    EXT_FILES_DIR="/storage/emulated/0/Android/data/${PACKAGE_NAME}/files"
    adb_cmd shell "run-as ${PACKAGE_NAME} mkdir -p ${EXT_FILES_DIR}" > /dev/null 2>&1 || true
    adb_cmd shell "run-as ${PACKAGE_NAME} cp ${TEMP_STAGE} ${EXT_FILES_DIR}/cbdc.zkey" > /dev/null 2>&1 || true

    adb_cmd shell "rm -f ${TEMP_STAGE}"
    echo "[+] Copied ${CIRCUIT_NAME}.zkey to app storage as cbdc.zkey"

    # Re-apply the port forwarding in case the phone reconnected meanwhile.
    setup_reverse

    # 6. Benchmark runs. Every run is a cold start of the app process.
    for run in $(seq 1 "$SAMPLE_SIZE"); do
        echo "[${CIRCUIT_NAME}] run ${run}/${SAMPLE_SIZE}"

        adb_cmd logcat -c
        # -S force-stops any running instance before starting.
        adb_cmd shell am start -S \
            -n "${PACKAGE_NAME}/.MainActivity" \
            --ez benchmark_mode true \
            --es target_circuit "${CIRCUIT_NAME}" > /dev/null

        # Poll logcat until the result appears, the app dies, or we time out.
        JSON_STR=""
        STATUS=""
        ELAPSED=0
        while true; do
            sleep "$POLL_INTERVAL"
            ELAPSED=$((ELAPSED + POLL_INTERVAL))

            JSON_STR=$(fetch_result)
            [[ -n "$JSON_STR" ]] && break

            PID=$(adb_cmd shell pidof "${PACKAGE_NAME}" || true)
            if [[ -z "$PID" && "$ELAPSED" -gt 4 ]]; then
                # The app also exits on success (finishAndRemoveTask), possibly
                # right after our last logcat read. Check once more before
                # calling it a crash.
                JSON_STR=$(fetch_result)
                [[ -n "$JSON_STR" ]] && break

                echo "Error: app process died without a result (OOM or exception?)" >&2
                adb_cmd logcat -d -v brief \
                    | grep -iE "AndroidRuntime|ZkProofEngine|lowmemorykiller|CivicWallet" \
                    | tail -n 8 >&2 || true
                STATUS="ERROR_APP_CRASHED"
                break
            fi

            if [[ "$ELAPSED" -ge "$RUN_TIMEOUT" ]]; then
                echo "Error: no result after ${RUN_TIMEOUT}s" >&2
                STATUS="ERROR_TIMEOUT"
                break
            fi
        done

        if [[ -n "$STATUS" ]]; then
            write_error_row "$STATUS"
        else
            printf '%s\t%s\t%s\n' "$CIRCUIT_NAME" "$run" "$JSON_STR" >> "$RAW_LOG"
            if ROW=$(jq -r "$JQ_ROW" <<< "$JSON_STR" 2> /dev/null) && [[ -n "$ROW" ]]; then
                # The app must have proven the circuit this run is for.
                APP_CIRCUIT=$(jq -r '.circuitKey // empty' <<< "$JSON_STR")
                RUN_STATUS="OK"
                if [[ -n "$APP_CIRCUIT" && "$APP_CIRCUIT" != "$CIRCUIT_NAME" ]]; then
                    echo "Error: app reports circuit '${APP_CIRCUIT}', expected '${CIRCUIT_NAME}'" >&2
                    RUN_STATUS="CIRCUIT_MISMATCH"
                fi
                echo "${CIRCUIT_NAME},${STATE_DEPTH},${BL_DEPTH},${run},${RUN_STATUS},${ROW}" >> "$RESULTS_CSV"
                echo "    ${ROW}"
            else
                # Usually a JSON line cut off by logcat's line length limit.
                echo "Error: could not parse result JSON (kept in $RAW_LOG)" >&2
                write_error_row "ERROR_PARSE"
            fi
        fi

        sleep "$COOLDOWN"
    done
done

stop_server

echo ""
echo "============================================================"
echo " Benchmark finished. Results: $RESULTS_CSV"
echo "                     Raw JSON: $RAW_LOG"
if [[ ${#SKIPPED[@]} -gt 0 ]]; then
    echo " Skipped: ${SKIPPED[*]}"
fi
echo "============================================================"
