#!/usr/bin/env bash
#
# build_circuits.sh — generuje pliki main dla wszystkich wariantów głębokości,
# kompiluje je i przeprowadza konfigurację Groth16.
#
# Uruchamiać z katalogu głównego projektu:
#     bash tools/build_circuits.sh
#
# Wymagania:
#     npm i -g circom snarkjs        (lub npx)
#     npm i circomlib
#     powersOfTau28_hez_final_16.ptau w katalogu ptau/
#
# Pobranie pliku ptau (jednorazowo, ~600 MB):
#     mkdir -p ptau && curl -L -o ptau/powersOfTau28_hez_final_16.ptau \
#       https://storage.googleapis.com/zkevm/ptau/powersOfTau28_hez_final_16.ptau
#
set -Eeuo pipefail

# Bez tego skrypt kończy się po cichu na pierwszym niezerowym kodzie wyjścia,
# co przy przekierowanym wyjściu narzędzi nie daje żadnej wskazówki.
trap 'rc=$?; echo; echo "PRZERWANO: linia $LINENO, kod wyjścia $rc" >&2; \
      echo "Ostatnie polecenie: $BASH_COMMAND" >&2; exit $rc' ERR

PTAU="${PTAU:-ptau/powersOfTau28_hez_final_17.ptau}"
LIB_DIR="${LIB_DIR:-circuits/lib}"
GEN_DIR="${GEN_DIR:-circuits/generated}"
BUILD_DIR="${BUILD_DIR:-build}"
CSV="$BUILD_DIR/constraints.csv"

# snarkjs trzyma w pamięci całą dziedzinę FFT; domyślny limit sterty Node
# bywa za mały, a przekroczenie objawia się ubiciem procesu bez komunikatu.
export NODE_OPTIONS="${NODE_OPTIONS:---max-old-space-size=8192}"

# nazwa | szablon  | STATE_DEPTH | BL_DEPTH
VARIANTS=(
  "standard_metro        standard  41   0"
  "standard_nation       standard  44   0"
  "standard_union        standard  46   0"
  "standard_global       standard  51   0"
  "advanced_metro        advanced  41  23"
  "advanced_nation       advanced  44  23"
  "advanced_union        advanced  46  25"
  "advanced_global       advanced  51  29"
  # kontrola ablacyjna — odtwarza kosztowo wariant v1, nie jest wariantem wdrożeniowym
  "advanced_union_bl160  advanced  46 160"
)

PUB_STANDARD='stateRoot, epochDay, epochMonth, maxSingleTxLimit, maxDailyLimit, maxMonthlyLimit, encryptedNoteHash'
PUB_ADVANCED='stateRoot, blacklistRoot, epochDay, epochMonth, maxSingleTxLimit, maxDailyLimit, maxMonthlyLimit, tier1WarningThreshold, encryptedNoteHash'

for t in circom snarkjs node; do
  command -v "$t" > /dev/null || { echo "Brak narzędzia: $t" >&2; exit 1; }
done
echo "circom:  $(circom --version 2>&1 | head -1)"
echo "snarkjs: $(snarkjs --help 2>&1 | grep -oiE 'snarkjs@?[ v]*[0-9.]+' | head -1 || echo '(wersja nieustalona)')"
echo

[[ -f "$PTAU" ]] || { echo "Brak $PTAU — zob. nagłówek skryptu" >&2; exit 1; }

# Najczęstsza przyczyna awarii `groth16 setup`: plik ptau pobrał się częściowo
# albo jest stroną błędu HTML zapisaną pod nazwą .ptau. Rozmiar
# powersOfTau28_hez_final_16.ptau to ok. 290 MB.
PTAU_BYTES=$(stat -c%s "$PTAU")
if (( PTAU_BYTES < 100000000 )); then
  echo "Plik $PTAU ma tylko $((PTAU_BYTES/1024/1024)) MB — prawdopodobnie jest niekompletny." >&2
  echo "Pierwsze bajty:" >&2
  head -c 120 "$PTAU" | cat -v >&2; echo >&2
  exit 1
fi
[[ -d node_modules/circomlib ]] || { echo "Brak circomlib — npm i circomlib" >&2; exit 1; }

# ---- preflight: kompletność biblioteki ------------------------------- #
# Pliki pobrane z przeglądarki trafiają zwykle płasko do ~/Downloads, więc
# najczęstszą przyczyną błędu "file to be included has not been found" jest
# po prostu brak któregoś pliku w LIB_DIR. Sprawdzamy to zawczasu, bo komunikat
# circom wskazuje ścieżkę po normalizacji i bywa mylący.
MISSING=()
for f in merkle.circom uas_core.circom blacklist.circom standard.circom advanced.circom; do
  [[ -f "$LIB_DIR/$f" ]] || MISSING+=("$f")
done
if (( ${#MISSING[@]} )); then
  echo "Brakujące pliki w $LIB_DIR:" >&2
  printf '    %s\n' "${MISSING[@]}" >&2
  echo >&2
  echo "Znalezione gdzie indziej w projekcie:" >&2
  for f in "${MISSING[@]}"; do
    find . -name "$f" -not -path './node_modules/*' -printf '    %p\n' 2>/dev/null
  done
  exit 1
fi

mkdir -p "$GEN_DIR" "$BUILD_DIR"/{r1cs,wasm,zkeys,vkeys}
# Uruchamia snarkjs, zbierając wyjście do logu i wypisując je wyłącznie
# przy niepowodzeniu — cisza przy sukcesie, pełny komunikat przy błędzie.
run_snarkjs() {
  local tag="$1"; shift
  local log="$BUILD_DIR/$tag.log"
  if ! "$@" > "$log" 2>&1; then
    echo "    BŁĄD: $tag" >&2
    sed 's/^/      /' "$log" >&2
    exit 1
  fi
}

echo "circuit,state_depth,bl_depth,nonlinear,linear,public_inputs,public_outputs,private_inputs,wires" > "$CSV"

for row in "${VARIANTS[@]}"; do
  read -r NAME TPL D BL <<< "$row"

  # ---- 1. wygeneruj plik main ---------------------------------------- #
  if [[ "$TPL" == "standard" ]]; then
    TEMPLATE="StandardCbdcConfidential($D)"; PUBLIC="$PUB_STANDARD"; INC="standard.circom"
  else
    TEMPLATE="AdvancedAmlConfidential($D, $BL)"; PUBLIC="$PUB_ADVANCED"; INC="advanced.circom"
  fi

  cat > "$GEN_DIR/$NAME.circom" <<EOF
pragma circom 2.1.5;

// PLIK GENEROWANY AUTOMATYCZNIE przez tools/build_circuits.sh — nie edytować.
// Wariant: $NAME   STATE_DEPTH=$D   BL_DEPTH=$BL

include "../lib/$INC";

component main {
    public [ $PUBLIC ]
} = $TEMPLATE;
EOF

  echo "==> $NAME (D=$D, BL=$BL)"

  # ---- 2. kompilacja -------------------------------------------------- #
  if ! circom "$GEN_DIR/$NAME.circom" \
      --r1cs --wasm --O2 \
      -l node_modules -l circuits -l "$LIB_DIR" \
      -o "$BUILD_DIR" > "$BUILD_DIR/$NAME.compile.log" 2>&1
  then
    echo "    BŁĄD KOMPILACJI:" >&2
    sed 's/^/      /' "$BUILD_DIR/$NAME.compile.log" >&2
    exit 1
  fi
  grep -E 'constraints|wires|inputs|outputs' "$BUILD_DIR/$NAME.compile.log" | sed 's/^/    /' || true

  [[ -f "$BUILD_DIR/$NAME.r1cs" ]] || {
    echo "    circom nie wyprodukował $BUILD_DIR/$NAME.r1cs" >&2
    sed 's/^/      /' "$BUILD_DIR/$NAME.compile.log" >&2
    exit 1
  }

  mv "$BUILD_DIR/$NAME.r1cs" "$BUILD_DIR/r1cs/"
  rm -rf "$BUILD_DIR/wasm/${NAME}_js"
  mv "$BUILD_DIR/${NAME}_js" "$BUILD_DIR/wasm/"

  # ---- 3. metryki do CSV ---------------------------------------------- #
  INFO=$(snarkjs r1cs info "$BUILD_DIR/r1cs/$NAME.r1cs" 2>&1 || true)
  # `|| echo 0` jest konieczne: grep bez dopasowania zwraca 1, co przy
  # `set -o pipefail` przerwałoby skrypt na etykiecie, która akurat zmieniła
  # nazwę w nowszej wersji snarkjs.
  grab() { echo "$INFO" | grep -i "$1" | grep -o '[0-9]\+' | tail -1 || echo 0; }
  echo "$NAME,$D,$BL,$(grab 'non-linear constraints'),$(grab 'linear constraints'),\
$(grab 'public inputs'),$(grab 'public outputs'),$(grab 'private inputs'),$(grab 'wires')" >> "$CSV"

  # ---- 4. konfiguracja Groth16 ---------------------------------------- #
  # Jednoosobowa ceremonia + beacon. Wystarczająca dla prototypu badawczego,
  # NIE dla wdrożenia: bezpieczeństwo wymaga wielostronnej ceremonii MPC,
  # w której co najmniej jeden uczestnik uczciwie zniszczy swój udział sekretu.
  run_snarkjs "$NAME-setup" \
      snarkjs groth16 setup \
      "$BUILD_DIR/r1cs/$NAME.r1cs" "$PTAU" "$BUILD_DIR/zkeys/${NAME}_0000.zkey"

  run_snarkjs "$NAME-contribute" \
      snarkjs zkey contribute \
      "$BUILD_DIR/zkeys/${NAME}_0000.zkey" "$BUILD_DIR/zkeys/${NAME}_0001.zkey" \
      --name="thesis-prototype" -e="$(head -c 64 /dev/urandom | base64 | tr -d '\n')"

  run_snarkjs "$NAME-beacon" \
      snarkjs zkey beacon \
      "$BUILD_DIR/zkeys/${NAME}_0001.zkey" "$BUILD_DIR/zkeys/$NAME.zkey" \
      0102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f20 10 \
      -n="final beacon"

  run_snarkjs "$NAME-vkey" \
      snarkjs zkey export verificationkey \
      "$BUILD_DIR/zkeys/$NAME.zkey" "$BUILD_DIR/vkeys/$NAME.vkey.json"

  rm -f "$BUILD_DIR/zkeys/${NAME}_0000.zkey" "$BUILD_DIR/zkeys/${NAME}_0001.zkey"

  SIZE=$(du -h "$BUILD_DIR/zkeys/$NAME.zkey" | cut -f1)
  echo "    zkey: $SIZE"
done

echo
echo "Metryki kompilacji -> $CSV"
column -s, -t "$CSV"
echo
echo "Następny krok:"
echo "  node tools/generate_fixtures.mjs"
echo "  bash tools/verify_fixtures.sh"
