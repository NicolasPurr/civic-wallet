#!/usr/bin/env bash
#
# verify_fixtures.sh — sprawdza, czy każdy wygenerowany wektor testowy
# rzeczywiście spełnia ograniczenia swojego obwodu.
#
# Fakt, że generate_fixtures.mjs zakończył się bez błędu, niczego nie dowodzi:
# skrypt liczy Poseidona niezależnie od obwodu. Rozjechanie się kolejności
# argumentów w ścieżce Merkle'a albo sposobu truncacji klucza tożsamości
# ujawni się dopiero tutaj — i lepiej, żeby ujawniło się na laptopie niż
# w Rust FFI w środku serii pomiarowej na telefonie.
#
set -euo pipefail

ART_DIR="${ART_DIR:-circuit-generation/artifacts}"
INPUTS="${INPUTS:-build/inputs}"
OK=0; FAIL=0

# Weryfikujemy KOMPLETNE wejścia obwodu z build/inputs, nie wektory z assets.
# Wektor w assets zawiera metadane (circuit, stateDepth) i nie zawiera parametrów
# transakcji — generator świadka odrzuciłby go jako niezgodny z interfejsem.
if ! compgen -G "$INPUTS/*.input.json" > /dev/null; then
  echo "Brak wejść w $INPUTS — uruchom: node tools/generate_fixtures.mjs" >&2
  exit 1
fi

for f in "$INPUTS"/*.input.json; do
  NAME=$(basename "$f" .input.json)
  WASM="$ART_DIR/$NAME/${NAME}_js/${NAME}.wasm"
  GEN="$ART_DIR/$NAME/${NAME}_js/generate_witness.js"

  if [[ ! -f "$WASM" ]]; then
    echo "SKIP  $NAME (brak $WASM — uruchom ./build.sh)"
    continue
  fi

  if node "$GEN" "$WASM" "$f" "/tmp/$NAME.wtns" 2> "/tmp/$NAME.err"; then
    # świadek policzony — sprawdź jeszcze pełną ścieżkę dowodzenia
    if snarkjs groth16 prove \
         "$ART_DIR/$NAME/$NAME.zkey" "/tmp/$NAME.wtns" \
         "/tmp/$NAME.proof.json" "/tmp/$NAME.public.json" > /dev/null 2>&1 &&
       snarkjs groth16 verify \
         "$ART_DIR/$NAME/${NAME}_vkey.json" \
         "/tmp/$NAME.public.json" "/tmp/$NAME.proof.json" > /dev/null 2>&1
    then
      SIGNALS=$(python3 -c "import json;print(len(json.load(open('/tmp/$NAME.public.json'))))")
      echo "OK    $NAME  (sygnałów publicznych: $SIGNALS)"
      OK=$((OK+1))
    else
      echo "FAIL  $NAME  — świadek policzony, ale dowód nie przechodzi"
      FAIL=$((FAIL+1))
    fi
  else
    echo "FAIL  $NAME  — generowanie świadka:"
    sed 's/^/          /' "/tmp/$NAME.err" | head -5
    FAIL=$((FAIL+1))
  fi
done

echo
echo "OK: $OK   FAIL: $FAIL"
[[ $FAIL -eq 0 ]]
