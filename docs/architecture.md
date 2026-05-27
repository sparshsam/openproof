# OpenProof Architecture

OpenProof has two parts: a static Next.js frontend and a minimal Solidity registry.

## Frontend

- `src/lib/hash.ts` hashes files locally with the browser Web Crypto API.
- `src/lib/receipt.ts` builds and downloads local JSON proof receipts.
- `src/lib/contracts.ts` holds the ABI, chain, and contract address config.
- `src/components/providers/wallet-provider.tsx` isolates RainbowKit and wagmi client-only providers.
- `src/app/create/page.tsx` handles local hashing, wallet connection, proof registration, and receipt generation.
- `src/app/verify/page.tsx` handles local hashing and registry reads.

The frontend does not expose upload endpoints and does not require a database.

## Contract

`OpenProofRegistry` stores proofs by `bytes32 fileHash`.

```solidity
struct Proof {
    address creator;
    uint64 timestamp;
    bytes32 fileHash;
}
```

The contract prevents duplicate registration for the same hash and emits `ProofRegistered` so clients can recover transaction context.

## Data Flow

1. User selects a file.
2. Browser hashes the file locally.
3. User registers the hash with a wallet on Base Sepolia.
4. Contract stores creator, timestamp, and hash.
5. Browser builds a local receipt JSON.
6. Verification repeats local hashing and queries the registry.

No file bytes are intentionally transmitted by OpenProof.
