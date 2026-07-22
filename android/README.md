# Civic Wallet — Android Client

This directory contains the Android client application for Civic Wallet. In this initial stage of development, the application functions as a benchmarking tool for empirical performance analysis of zk-SNARK protocols for Central Bank Digital Currency (CBDC) payment schemes.

The primary objective is to measure mobile client execution metrics:
* **Proof Generation Time** (Groth16 / Circom via MoPro)
* **Proof Verification Time** (On-device and Server round-trip)
* **Memory Footprint & Peak Heap Usage** during witness generation and proving (PERHAPS)
* **Battery Drain** during repeated cryptographic execution (PERHAPS)

---

## Biometric Authentication

> **Note:** The TensorFlow Lite model is strictly an interactive UI/UX placeholder to demonstrate end-to-end payment flows.

In a production-ready application, local authentication relies on Android's native **`BiometricPrompt` API** bound to the **Android Keystore System**. Under this security model, cryptographic keys are hardware-isolated inside a **Trusted Execution Environment (TEE)** or **StrongBox** hardware module, requiring a valid hardware-level biometric match before unlocking sensitive operations.

To support rapid mobile benchmarking and emulator environments without hardware TEE access, the current implementation uses a lightweight, modular authentication layer:

* **Current implementation:**
  * **Visual UX placeholder:** Integrates an on-device TensorFlow Lite model trained on the **Labeled Faces in the Wild (LFW)** dataset, configured to recognize **Colin Powell** (reference photo included in the repository for instant visual validation).
  * **Benchmarking without biometric authentication:** To facilitate benchmarking the biometric check can be **bypassed with a single button tap** (TO DO). This enables (WILL ENABLE) quick execution on physical devices and emulators alike.

---

## Architecture Design

The app enforces a strict **Feature-by-Layer Clean Architecture**. Hardware drivers, ML, cryptographic engines are isolated in the `core` package, keeping feature modules platform-agnostic and lightweight.

### Package Directory Structure

```directory
app/src/main/java/io/github/nicolaspurr/civicwallet/
│   MainActivity.kt                       # Edge-to-edge system window orchestration
│   SmartWalletApplication.kt             # Hilt application target
│
├───core                                  # Independent core primitives & drivers
│   ├───di
│   │       BiometricModule.kt            # Binds hardware authenticator streams and sink
│   │       CoreModule.kt                 # Global infrastructure (ModelManager)
│   │       DispatchersModule.kt          # Coroutine threading boundaries (@IoDispatcher, @DefaultDispatcher)
│   │       NetworkModule.kt              # OkHttpClient timeouts & connection pooling
│   │       WalletModule.kt               # Prover client definitions & camera single-threaded executor
│   │
│   ├───hardware
│   │       BiometricAuthenticator.kt     # Read-only streaminterface for UI consumers
│   │       BiometricAuthenticatorImpl.kt # Shared flow capture stream engine & sink implementation
│   │       FaceAnalyzer.kt               # Scoped CameraX frame processor
│   │
│   ├───ml
│   │       ModelManager.kt               # Neural engine runtime lifecycle contract
│   │       TfLiteModelManager.kt         # Memory-mapped TFLite inference runner
│   │
│   ├───theme
│   │       Color.kt / Theme.kt / Type.kt # Compose design tokens & system bar sync
│   │
│   └───zk
│           ZkProofEngine.kt              # Abstract cryptographic boundary interface
│           ZkProofEngineImpl.kt          # Native MoPro engine client implementation
│           ZkProofResult.kt              # Benchmarking metadata payload data class
│           ZkeyStorageManager.kt         # Asset extraction & SHA-256 key hash validator
│
└───feature
    └───payment                                         # Payment domain & execution flow
        ├───data
        │   ├───di
        │   │       PaymentDataModule.kt                # Singleton binding definitions
        │   │
        │   └───session
        │           BiometricSessionOrchestratorImpl.kt # Mutex-serialized session coordinator
        │           PaymentSessionRepositoryImpl.kt     # Volatile single-use in-memory proof buffer
        │           PaymentSettlementRepositoryImpl.kt  # OkHttp client for Axum backend (10.0.2.2:8080)
        │
        ├───domain
        │   ├───session
        │   │       BiometricSessionOrchestrator.kt
        │   │       PaymentSessionRepository.kt
        │   │       PaymentSettlementRepository.kt
        │   │
        │   └───interactor
        │           ZkProofInteractor.kt                 # Orchestrates proof generation & session storage
        │           SubmitPaymentInteractor.kt           # Transaction settlement execution
        │
        └───presentation
            ├───di
            │       PaymentPresentationModule.kt # ViewModel scope bindings
            │
            ├───component
            │       BiometricCameraPreview.kt    # CameraX surface view component
            │
            ├───navigation
            │       PaymentNavGraph.kt           # Compose navigation graph
            │       Screen.kt                    # Type-safe navigation routes
            │
            └───screen
                    ScanScreen.kt                # Biometric scan UI
                    SuccessScreen.kt             # Post-authorization summary layout
                    UnauthorizedScreen.kt        # Verification fail/override terminal
                    VerifyingScreen.kt           # Lifecycle-aware transaction monitor
```

## Layer Responsibilities & Isolation Rules

### 1. Core Layer (core)
  * Manages hardware resources (CameraX, TFLite models, Coroutine dispatchers, MoPro native bridge).
  * Holds zero dependencies on any feature module.

### 2. Domain Layer (feature.*.domain)
  * Pure, framework-free Kotlin containing core business rules and Interactors.
  * Free of Android framework dependencies (no Compose, ViewModels, or platform libraries).

### 3. Data Layer (feature.*.data)
  * Implements domain repositories and handles raw data streams, memory caches, network calls, and native crypto engine bindings.
 
### 4. Presentation Layer (feature.*.presentation)
  * Contains Jetpack Compose screens, components, and ViewModels.
  * Translates domain states into UI states. Forbidden from direct access to native data sources or MoPro drivers.

## Dependency Injection & Scoping

Dependencies are managed using **Hilt** to match instance lifecycles with runtime resource demands:

| Scope | Hilt Container | Target Usage |
| :--- | :--- | :--- |
| `@Singleton` | `SingletonComponent` | Long-lived, shared background infrastructure (Thread Dispatchers, Neural Engines, Global Repositories, ZK Engines). |
| `@ViewModelScoped` | `ViewModelComponent` | Flow-specific engines (e.g., `BiometricSessionOrchestrator`, `FaceAnalyzer`). Created when a payment flow initialises; discarded upon exit. |

```
               ┌────────────────────────┐
               │    core/di Module      │
               │  (Provides HttpClient) │
               └───────────┬────────────┘
                           │
                           ▼
               ┌────────────────────────┐
               │   payment/di Module    │
               │  (Provides Repository) │
               └───────────┬────────────┘
                           │ (Injects HttpClient)
                           ▼
            ┌──────────────────────────────┐
            │ PaymentSettlementRepository  │
            └──────────────────────────────┘
```

---

## Native ZK Cryptographic Bridge

Zero-Knowledge operations execute in Rust via [MoPro](https://github.com/zkmopro/mopro) native libraries compiled for target ABI architectures.

### Execution Flow & Data Management

```
[ Kotlin UI / ViewModel ] 
       │
       ▼ (suspend)
[ ZkProofInteractor ]
       │
       ▼ (Injected @DefaultDispatcher)
[ ZkProofEngineImpl.kt ]
       │
       ▼ (Auto-generated UniFFI Kotlin Wrapper: mopro.kt)
┌─────────────────────────────────────────────────────────┐
│                    NATIVE BOUNDARY                      │
├─────────────────────────────────────────────────────────┤
│ [ Rust libmopro.so ]                                    │
│  1. generateCircomProof() -> ARKWORKS Groth16 Prover   │
│  2. verifyCircomProof()   -> On-device verification     │
└─────────────────────────────────────────────────────────┘
       │
       ▼ Returns ZkProofResult (SnarkJS format JSON + timings)
[ PaymentSettlementRepositoryImpl ]
       │
       ▼ HTTP POST ([http://10.0.2.2:8080/verify](http://10.0.2.2:8080/verify))
[ Rust Axum Server ]
       │
       │__>Returns valid status + processing_time_ms
```

### Key Technical Implementation Details

1. **Proving Key Management (`getOrExtractZkey`):** Since Rust FFI cannot read assets directly from compressed Android APK assets, `ZkProofEngineImpl` extracts `cbdc.zkey` to `context.filesDir` on launch. SHA-256 digests are compared to automatically sync updated keys when recompiling circuits.
2. **SnarkJS Payload Formatting:** Proof outputs (`pi_a`, `pi_b`, `pi_c`, `public_inputs`) are converted to standard SnarkJS format to guarantee compatibility with the Rust Axum verification server.
3. **Benchmarking Metrics Payload (`ZkProofResult`):**
   * `proofGenTimeMs`: Time taken by MoPro Rust FFI to construct the witness and prove constraints.
   * `totalEngineTimeMs`: Combined time for local proof generation and on-device local verification.
   * `proofSizeInBytes`: Raw byte length of the UTF-8 formatted proof JSON.
   * `serverProcessingTimeMs`: Extracted from the backend Axum verification response.

---

### Deployed Native Artifacts

The native binaries generated by [`build_pipeline.sh`](../build_pipeline.sh) are mapped to the following project locations:

* **UniFFI Interface:** `app/src/main/java/uniffi/mopro/mopro.kt`
* **JNI Shared Libraries:**
  * `app/src/main/jniLibs/arm64-v8a/libmopro.so`
  * `app/src/main/jniLibs/arm64-v8a/libc++_shared.so`
  * `app/src/main/jniLibs/x86_64/libmopro.so`
  * `app/src/main/jniLibs/x86_64/libc++_shared.so`
* **Assets:**
  * `app/src/main/assets/cbdc.zkey`

---

## Architectural Testing

Architectural boundaries are automatically validated during continuous integration using **Konsist** (`ArchitectureTest.kt`). 

The test suite enforces the following constraints:
* `Core` remains isolated and never imports from `feature`.
* `Domain` remains pure Kotlin and only imports allowed abstract infrastructure interfaces.
* `Presentation` never directly accesses `Data`, native TFLite models, or `MoPro` bindings.
* Naming conventions (`*ViewModel` inside `.presentation..`, `*Interactor` inside `.domain.interactor..`).