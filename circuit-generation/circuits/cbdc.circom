pragma circom 2.1.5;

template MockCbdcTransfer() {
    // Private Inputs (Witness)
    signal input currentBalance;
    signal input privateKey; 
    
    // Public Inputs
    signal input transferAmount;
    
    // Output
    signal output newBalance;

    // Constraint 1: Ensure balance covers the transfer
    assert(currentBalance >= transferAmount);
    
    // Constraint 2: Calculate new state
    newBalance <== currentBalance - transferAmount;
    
    // (In a real CBDC, you'd add Pedersen Hashes & EdDSA signature verification here)
}

component main {public [transferAmount]} = MockCbdcTransfer();
