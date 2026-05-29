# OpenProof Architecture

OpenProof has two parts: a static Next.js frontend and a minimal Solidity registry.

## Frontend

- `src/lib/hash.ts` hashes files locally with the browser Web Crypto API.
- `src/lib/bundle.ts` creates deterministic local bundle manifests and bundle hashes.
- `src/lib/receipt.ts` builds and downloads local JSON proof receipts.
- `src/lib/history.ts` stores recent proof activity in browser local storage.
- `src/lib/proofs.ts` centralizes typed registry reads and bounded event lookup.
- `src/lib/proof-url.ts` builds shareable proof URLs.
- `src/lib/contracts.ts` holds the ABI, chain, and contract address config.
- `src/components/providers/wallet-provider.tsx` isolates RainbowKit and wagmi client-only providers.
- `src/app/create/page.tsx` handles local hashing, wallet connection, proof registration, and receipt generation.
- `src/app/verify/page.tsx` handles local hashing, receipt import, and registry reads.
- `src/app/proof/[hash]` displays public proof explorer pages.

The frontend does not expose upload endpoints and does not require a database. Local proof history uses browser storage only and is not a backend, account system, or synchronization layer.

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
7. Optional local history is written to browser storage.
8. Optional proof pages and QR codes point to `/proof/[hash]`.

No file bytes are intentionally transmitted by OpenProof.

## Receipt Import

Receipt import is a local JSON workflow:

1. User selects or drops an OpenProof receipt JSON file.
2. Browser parses and validates the expected receipt schema.
3. Browser checks the receipt hash against the Base Sepolia contract.
4. UI reports whether the receipt is valid and whether the proof exists.

Receipts are portable records, not authority. A malformed receipt is rejected locally. A well-formed receipt still needs an onchain match.

## Bundle Proofs

Bundle proofs use the same `registerProof(bytes32)` contract function as single-file proofs. The difference is the local preimage:

1. Hash each selected file locally with SHA-256.
2. Build a manifest with file name, size, MIME type, and file hash.
3. Sort entries by name, size, type, and hash.
4. Stable-stringify the manifest.
5. SHA-256 hash the manifest bytes.
6. Register only the resulting bundle hash onchain.

This keeps bundle proving deterministic without uploading the files or manifest. Verification requires the same exact file set and bundle rule.

## Public Proof Pages and QR

`/proof/[hash]` is a shareable read-only view over the registry. It fetches proof data from Base Sepolia and displays the proof details, not the original file. QR codes encode the proof URL only.
