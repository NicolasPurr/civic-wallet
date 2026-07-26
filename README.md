# Civic Wallet

**Civic Wallet** is an Android prototype designed for privacy-preserving Central Bank Digital Currency (CBDC) payment schemes. In its initial stage of development, it serves as a functional benchmarking tool to measure the performance, memory usage, and usability of zero-knowledge proof (zk-SNARK) protocols on mobile devices.

---

## Repository Structure

```
.
├── build.sh                # Master compilation & artifact generation script
├── run.sh                  # Automated Android benchmark suite execution script
├── android/                # Android mobile app (Kotlin + JNI bindings)
├── circuit-generation/     # Circom circuits, setup scripts, and MoPro configs
└── verification-server/    # Rust Axum backend server for proof verification
```

For detailed component-specific documentation, refer to the individual README files:
* [`android/README.md`](./android/README.md) — App setup, architecture, and UI structure.
* [`circuit-generation/README.md`](./circuit-generation/README.md) — Circom constraints, mopro guide.
* [`verification-server/README.md`](./verification-server/README.md) — Server endpoints, verification logic, and deployment guide.

---

## Prerequisites

Ensure the following tools are installed on your host system (Linux / WSL2 recommended):

| Dependency                     | Purpose                                       | Recommended Version |
| :----------------------------- | :-------------------------------------------- | :------------------ |
| **Bash & standard UNIX tools** | Script execution (`date`, `find`, `cp`)       | Latest              |
| **Node.js & npm**              | Running `snarkjs`                             | v18+                |
| **Circom**                     | Compiling `.circom` files                     | v2.1.0+             |
| **Rust & Cargo**               | Building backend server & native binaries     | Latest stable       |
| **MoPro CLI**                  | Generating mobile bindings                    | Latest              |
| **Android SDK / NDK**          | Compiling mobile binaries for ARM/x86 targets | NDK r25+            |
| **ADB / ADB.exe**              | Device communication & log scraping           | Latest              |

---

## System Architecture

Civic Wallet integrates Circom circuits, Rust-based mobile bindings via [MoPro](https://github.com/zkmopro/mopro), an Axum verification server, and a native Android application.

```
                 ┌────────────────────────┐
                 │   circuit-generation   │
                 │    (Circom + SnarkJS)  │
                 └───────────┬────────────┘
                             │
              ┌──────────────┴──────────────┐
              ▼                             ▼
        .zkey + .wasm             verification_key.json
              │                             │
              ▼                             ▼
       ┌──────────────┐         ┌────────────────────────┐
       │    MoPro     │         │  verification-server   │
       │ (Rust / JNI) │         │        (Axum)          │
       └──────┬───────┘         └────────────────────────┘
              │
 Kotlin Bindings (.kt) + .so Libraries
              │
              ▼
       ┌──────────────┐
       │   android    │ (Civic Wallet App)
       └──────────────┘
```

---

## Benchmarking

The toolchain spans two main scripts: `build.sh` for compiling circuits into native mobile binaries, and `run.sh` for automated end-to-end benchmarking on Android devices.

### 1. Compile circuits & generate native artifacts (`build.sh`)

The script iterates through all `.circom` circuits located in `circuit-generation/circuits/`, compiles them to WASM/R1CS, performs Groth16 trusted setup ($2^{17}$ max constraints), and builds native Rust/C++ `.so` shared libraries alongside UniFFI `mopro.kt` Kotlin bindings.

```bash
# Standard compilation (reuses existing Powers of Tau if present)
./build.sh

# Force regeneration of Powers of Tau (.ptau)
./build.sh --force-tau

# Automatically remove the large .ptau file after compilation completes
./build.sh --clean-tau

### 2. Perform a clean rebuild

To wipe previous Cargo build caches before regenerating MoPro bindings:

```bash
./build.sh --clean
```

Upon successful completion, compiled outputs are archived per circuit inside circuit-generation/artifacts/<circuit_name>/:
* Groth16 Proving Key (<circuit_name>.zkey
* Verification Key (<circuit_name>_vkey.json)
* Native Shared Libraries (jniLibs/)
* UniFFI Kotlin Bindings (mopro.kt)

### 2. Run Automated Android Benchmarks (`run.sh`)

The execution script automates testing every compiled circuit artifact against a connected physical Android device or emulator.

```Bash
./run.sh

```

1. **Circuit Compilation**: Compiles `cbdc.circom` to WASM/R1CS, executes Powers of Tau (bn128), and generates the Groth16 proving key (`.zkey`) and verification key (`verification_key.json`).
2. **MoPro Compilation**: Invokes mopro build per circuit to synthesize optimized native Rust/C++ shared libraries (`.so`) and UniFFI Kotlin interface files (`mopro.kt`).
3. **Deployment**: `run.sh` injects each circuit's native libraries into `android/app/src/main/jniLibs/` and `.zkey` into `assets/`, triggers a Gradle clean rebuild, installs the APK, and updates the Axum server's verification key.
4. **Execution & Benchmarking**: Launches the application via ADB Intent without manual UI intervention. Android logs (`CIVIC_BENCHMARK:I`) are parsed to record proof generation time, witness calculation time, total engine runtime, server HTTP/verification latency, memory peak ($VmHWM$), native heap delta, thermal status, and proof payload sizes into `benchmark_results.csv`.

---