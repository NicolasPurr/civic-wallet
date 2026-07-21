# Civic Wallet

**Civic Wallet** is an Android prototype designed for privacy-preserving Central Bank Digital Currency (CBDC) payment schemes. In its initial stage of development, it serves as a functional benchmarking tool to measure the performance, memory usage, and usability of zero-knowledge proof (zk-SNARK) protocols on mobile devices.

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
.zkey + .wasm            verification_key.json
    │                             │
    ▼                             ▼
┌──────────────┐         ┌────────────────────────┐
│    MoPro     │         │ zk-verification-server │
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

### Circuit Compilation&Deployment Pipeline

1. **Circuit Compilation & Ceremony**: Compiles `cbdc.circom` to WASM/R1CS, executes Powers of Tau (bn128), and generates the Groth16 proving key (`.zkey`) and verification key (`verification_key.json`).
2. **Artifact Distribution**: Delivers `verification_key.json` to the Axum server and `.zkey`/WASM files to the MoPro target directory.
3. **MoPro Library Generation**: Compiles native C/C++ shared libraries (`.so`) and UniFFI Kotlin bindings (`mopro.kt`) for mobile targets.
4. **Android Deployment**: Copies generated Kotlin bindings to `app/src/main/java/uniffi/mopro`, `.so` libraries to `jniLibs/`, and the proving key into Android `assets/`.

---

## Repository Structure

```
.
├── build_pipeline.sh         # Master build and artifact orchestration script
├── android/                  # Android mobile app (Kotlin + JNI bindings)
├── circuit-generation/       # Circom circuits, setup scripts, and MoPro configs
└── zk-verification-server/   # Rust Axum backend server for proof verification
```

For detailed component-specific documentation, refer to the individual README files:
* [`android/README.md`](./android/README.md) — App setup, architecture, and UI structure.
* [`circuit-generation/README.md`](./circuit-generation/README.md) — Circom constraints, mopro guide.
* [`zk-verification-server/README.md`](./zk-verification-server/README.md) — Server endpoints, verification logic, and deployment guide.

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

---

## Building the Project

The entire toolchain from circuit compilation to Android artifact injection is automated via `build_pipeline.sh`. Verify that the paths defined correspond to the layout on your machine.

### 1. Run full build pipeline

```bash
./build_pipeline.sh
```

### 2. Perform a clean rebuild

To wipe previous Cargo build caches before regenerating MoPro bindings:

```bash
./build_pipeline.sh --clean
```

Upon successful execution, the required `.zkey`, JNI `.so` binaries, and `mopro.kt` interface files will automatically be synced into the Android source tree, and `verification_key.json` will be ready in the Axum server root.