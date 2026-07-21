import uniffi.mopro_fresh.*

var helloWorld = moproHelloWorld()
assert(helloWorld == "Hello, World!") { "Test string mismatch" }
