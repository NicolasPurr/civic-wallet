plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.plugin.compose")
    id("com.google.dagger.hilt.android")
    id("com.google.devtools.ksp")
}

android {
    namespace = "io.github.nicolaspurr.civicwallet"
    compileSdk = 37

    defaultConfig {
        applicationId = "io.github.nicolaspurr.civicwallet"
        minSdk = 24

        //noinspection EditedTargetSdkVersion
        targetSdk = 37 // Aligned with compileSdk to resolve warnings

        versionCode = 1
        versionName = "1.0"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
        buildConfigField("float", "TRIGGER_THRESHOLD", "0.93f")
        buildConfigField("int", "IMG_SIZE", "160")
        buildConfigField("float", "RETRAIN_THRESHOLD", "0.60f")
        buildConfigField("long", "WINDOW_DURATION_MS", "500L")
    }

    buildTypes {
        release {
            isMinifyEnabled = false
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_11
        targetCompatibility = JavaVersion.VERSION_11
    }
    buildFeatures {
        compose = true
        buildConfig = true
    }
    testOptions {
        unitTests.all {
            it.useJUnitPlatform()
        }
    }
}

dependencies {
    // Jetpack Compose (using Compose BOM for automatic version matching)
    implementation(platform("androidx.compose:compose-bom:2026.06.01"))
    implementation("androidx.activity:activity-compose:1.13.0")
    implementation("androidx.compose.material3:material3")
    implementation("androidx.compose.ui:ui")
    implementation("androidx.compose.ui:ui-graphics")
    implementation("androidx.compose.ui:ui-tooling-preview")
    debugImplementation("androidx.compose.ui:ui-tooling")
    debugImplementation("androidx.compose.ui:ui-test-manifest")

    // Core Android libraries
    implementation("androidx.core:core-ktx:1.19.0")
    implementation("androidx.lifecycle:lifecycle-runtime-ktx:2.11.0")

    // Navigation & Lifecycle Compose
    implementation("androidx.navigation:navigation-compose:2.9.8")
    implementation("androidx.lifecycle:lifecycle-runtime-compose:2.11.0")

    // CameraX (declared individually since we can't reference catalog bundles)
    implementation("androidx.camera:camera-core:1.6.1")
    implementation("androidx.camera:camera-camera2:1.6.1")
    implementation("androidx.camera:camera-lifecycle:1.6.1")
    implementation("androidx.camera:camera-view:1.6.1")

    // LiteRT
    implementation("com.google.ai.edge.litert:litert-support-api:1.4.2")
    implementation("com.google.ai.edge.litert:litert:2.1.6")
    implementation("com.google.ai.edge.litert:litert-support:1.4.2")

    // Networking & Web
    implementation("com.squareup.okhttp3:okhttp:5.4.0")
    implementation("androidx.webkit:webkit:1.16.0")

    // Dependency Injection (Dagger Hilt)
    implementation("com.google.dagger:hilt-android:2.60.1")
    ksp("com.google.dagger:hilt-compiler:2.60.1")
    implementation("androidx.hilt:hilt-navigation-compose:1.4.0")
    implementation("javax.inject:javax.inject:1")

    // Testing
    testImplementation("junit:junit:4.13.2")
    androidTestImplementation(platform("androidx.compose:compose-bom:2026.06.01"))
    androidTestImplementation("androidx.compose.ui:ui-test-junit4")
    androidTestImplementation("androidx.test.espresso:espresso-core:3.7.0")
    androidTestImplementation("androidx.test.ext:junit:1.3.0")

    // Konsist API
    testImplementation("com.lemonappdev:konsist:0.17.3") // Use the latest stable version

    // JUnit 5 (Jupiter) Engine & API
    testImplementation("org.junit.jupiter:junit-jupiter-api:6.1.2")
    testRuntimeOnly("org.junit.jupiter:junit-jupiter-engine:6.1.2")
    testRuntimeOnly("org.junit.platform:junit-platform-launcher")

    // Standard Jetpack Biometric library
    implementation("androidx.biometric:biometric:1.1.0")

    // JVM Unit Testing dependencies
    testImplementation("io.mockk:mockk:1.14.11")
    testImplementation("org.jetbrains.kotlinx:kotlinx-coroutines-test:1.11.0")

    // Add the Java Native Access library for Android
    implementation("net.java.dev.jna:jna:5.14.0@aar")

    // Ensure you also have the standard coroutines dependency if not already present
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:1.7.3")
}