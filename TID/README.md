# TrustID — Sovereign Identity Platform

> **Prove who you are. Share nothing more.**
> Zero-knowledge identity verification powered by Noir ZK circuits, Foundry smart contracts, and Next.js.

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        USER WALLET                          │
│   DID (on-chain)  +  Credentials (encrypted)  +  ZK Proofs │
└────────────────────────┬────────────────────────────────────┘
                         │
         ┌───────────────┴───────────────┐
         ▼                               ▼
┌─────────────────┐             ┌─────────────────┐
│   NEXT.JS APP   │             │  NOIR CIRCUITS  │
│                 │             │                 │
│  /onboarding    │             │  age_proof.nr   │
│  /dashboard     │◄──proofs───►│  cred_proof.nr  │
│  /credentials   │             │  identity.nr    │
│  /verify        │             └────────┬────────┘
└────────┬────────┘                      │ proof bytes
         │ wagmi/ethers                  ▼
         ▼                    ┌─────────────────────┐
┌─────────────────────────────┤  FOUNDRY CONTRACTS  │
│   DIDRegistry.sol           │  (Sepolia / Local)  │
│   CredentialRegistry.sol    └─────────────────────┘
│   ZKVerifier.sol
└─────────────────────────────┘
```

### Three-Party Model
| Role         | Who                          | What they do                                 |
|--------------|------------------------------|----------------------------------------------|
| **Holder**   | End user with wallet         | Stores credentials, generates ZK proofs      |
| **Issuer**   | Govt / University / Employer | Signs & issues Verifiable Credentials (VCs)  |
| **Verifier** | App / Service / Agency       | Scans QR / link, verifies proof on-chain     |

---

## Project Structure

```
trustid/
│
├── contracts/                    # Foundry
│   ├── src/
│   │   ├── DIDRegistry.sol       # On-chain DID creation & management
│   │   ├── CredentialRegistry.sol# VC issuance, revocation, verification
│   │   └── ZKVerifier.sol        # On-chain ZK proof verification
│   ├── test/
│   │   └── TrustID.t.sol         # Forge tests
│   └── script/
│       └── Deploy.s.sol          # Deployment script
│
├── noir/
│   └── circuits/
│       ├── age_proof/            # Prove age >= N without revealing DOB
│       │   └── src/main.nr
│       ├── credential_proof/     # Prove VC ownership without revealing content
│       │   └── src/main.nr
│       └── identity_proof/       # Prove DID ownership without exposing private key
│           └── src/main.nr
│
└── frontend/                     # Next.js 14 (App Router)
    ├── app/
    │   ├── page.tsx              # Landing page
    │   ├── layout.tsx            # Root layout + providers
    │   ├── onboarding/           # DID creation wizard
    │   ├── dashboard/            # Identity wallet home
    │   ├── credentials/          # VC manager
    │   └── verify/               # Proof verifier (for relying parties)
    ├── components/
    │   ├── wallet/DIDCard.tsx    # DID display
    │   ├── credentials/          # CredentialCard, ActivityLog
    │   ├── zkp/ShareProofModal   # ZK proof generator + QR
    │   └── ui/Providers.tsx      # Wagmi + RainbowKit
    ├── hooks/
    │   ├── useDIDRegistry.ts     # Read/write DID on-chain
    │   ├── useCredentials.ts     # Fetch user's VCs
    │   ├── useZKProof.ts         # Generate & submit ZK proofs
    │   └── useZKVerifier.ts      # Verify proofs on-chain
    ├── lib/
    │   ├── blockchain/contracts.ts  # ABIs + addresses
    │   └── zkp/proofGenerator.ts    # Noir + Barretenberg integration
    └── types/index.ts            # Shared TypeScript types
```

---

## Quick Start

### Prerequisites
```bash
# Install Foundry
curl -L https://foundry.paradigm.xyz | bash && foundryup

# Install Nargo (Noir toolchain)
curl -L https://raw.githubusercontent.com/noir-lang/noirup/main/install | bash
noirup

# Install Node (>= 20)
node --version
```

### 1. Smart Contracts
```bash
cd contracts

# Install dependencies
forge install foundry-rs/forge-std

# Run tests
forge test -vv

# Deploy locally
anvil &                           # Start local chain
cp ../.env.example ../.env        # Fill in your values
forge script script/Deploy.s.sol \
  --broadcast \
  --rpc-url localhost \
  --private-key 0xac0974bec39...  # Anvil default key
```

### 2. Noir ZK Circuits
```bash
cd noir/circuits/age_proof

# Check circuit
nargo check

# Run tests
nargo test

# Compile (generates JSON artifact for frontend)
nargo compile

# Generate Solidity verifier (replaces stub in ZKVerifier.sol)
nargo codegen-verifier

# Copy artifacts to frontend
cp target/age_proof.json ../../frontend/public/circuits/
```

Repeat for `credential_proof` and `identity_proof`.

### 3. Frontend
```bash
cd frontend

npm install

cp .env.example .env.local
# Fill in:
#   NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID
#   NEXT_PUBLIC_SEPOLIA_RPC
#   Contract addresses from deploy output

npm run dev
# → http://localhost:3000
```

---

## Key Implementation Notes

### Zero-Knowledge Proof Flow
```
User opens ShareProofModal
  → Selects proof type (age ≥ 18)
  → useGenerateProof() calls proofGenerator.ts
      → Loads age_proof.json circuit
      → Instantiates BarretenbergBackend
      → Calls noir.execute({ birth_year, ..., salt })
      → backend.generateProof(witness)
  → Returns { proof, publicInputs, nullifier, proofLink }
  → Shows QR code with proofLink
  
Verifier scans QR
  → Hits /verify?proof=0x...&nullifier=0x...
  → useZKVerifier() calls ZKVerifier.isProofValid(nullifier)
  → Displays ✓ Valid or ✗ Invalid
```

### Replacing the ZKVerifier Stub
After running `nargo codegen-verifier`, replace the `_verifyUltraPlonk` stub:
```solidity
// contracts/src/ZKVerifier.sol
import "./UltraVerifier.sol";  // generated by nargo

UltraVerifier verifier = new UltraVerifier();

function _verifyUltraPlonk(...) internal view returns (bool) {
    return verifier.verify(proof, publicInputs);
}
```

### Private Key Safety
- Private inputs to Noir circuits **never leave the browser**
- Only the proof and public inputs are sent on-chain
- Use encrypted localStorage or a hardware wallet for key storage in production



## Tech Stack

| Layer      | Technology                                    |
|------------|-----------------------------------------------|
| ZK Circuits| Noir (Aztec) + Barretenberg backend           |
| Contracts  | Solidity 0.8.24 + Foundry                     |
| Frontend   | Next.js 14 + TypeScript + Tailwind CSS        |
| Web3       | wagmi v2 + viem + RainbowKit                  |
| State      | Zustand + TanStack Query                      |
| Styling    | Tailwind CSS + Framer Motion                  |
| Standards  | W3C DID Core + W3C Verifiable Credentials     |
