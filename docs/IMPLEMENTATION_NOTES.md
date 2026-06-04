# OpenProof Implementation Notes

**Classification:** Implementation documentation
**Scope:** OpenProof, all deployments and forks
**Authority:** Ecosystem governance standards — [ecosystem-standards](https://github.com/sparshsam/ecosystem-standards)
**Status:** Adopted — see docs/SYSTEMS_DOCTRINE.md §0 for freeze classification

---

## 1. Repository Structure

```
openproof/
├── contracts/
│   └── OpenProofRegistry.sol      # EVM smart contract (48 lines)
├── src/
│   ├── app/
│   │   ├── page.tsx                # Landing page
│   │   ├── layout.tsx              # Root layout, providers
│   │   ├── create/page.tsx         # Proof registration flow
│   │   ├── verify/page.tsx         # Proof verification flow
│   │   └── proof/[hash]/page.tsx   # Public proof explorer
│   ├── components/
│   │   ├── providers/
│   │   │   └── wallet-provider.tsx # RainbowKit + wagmi setup
│   │   ├── design-system/          # Reusable UI primitives
│   │   ├── file-drop.tsx           # File selection with drag-drop
│   │   ├── hash-display.tsx        # Hash display with copy
│   │   ├── qr-code.tsx             # QR code generation
│   │   ├── receipt-import.tsx      # Receipt JSON import
│   │   └── proof-history.tsx       # Local history display
│   ├── lib/
│   │   ├── hash.ts                 # SHA-256 hashing (Web Crypto API)
│   │   ├── bundle.ts               # Bundle manifest + hash computation
│   │   ├── receipt.ts              # Receipt type, builder, validator
│   │   ├── proofs.ts               # Onchain proof reads, event lookup
│   │   ├── contracts.ts            # ABI, chain config, contract address
│   │   ├── history.ts              # localStorage proof history
│   │   ├── proof-url.ts            # Shareable URL construction
│   │   ├── explorer.ts             # Block explorer URL helpers
│   │   └── time.ts                 # Timestamp formatting
│   └── ...
├── docs/                           # Permanent documentation
│   ├── ARCHITECTURE.md
│   ├── VERIFICATION_LIFECYCLE.md
│   ├── DATA_FLOW.md
│   ├── FAILURE_MODES.md
│   ├── IMPLEMENTATION_NOTES.md
│   ├── TRUST_MODEL.md
│   ├── architecture.md             # Legacy architecture doc (superseded)
│   ├── SYSTEMS_DOCTRINE.md         # Permanent architectural doctrine
│   ├── TRUST_BOUNDARIES.md         # Permanent trust documentation
│   ├── NON_GOALS.md                # Permanent exclusion register
│   ├── threat-model.md             # Extended threat analysis
│   ├── receipt-schema.md           # Receipt JSON schema specification
│   ├── security-principles.md      # Operational, deployment, trust principles
│   ├── deployment-notes.md         # Deployment guidance
│   └── design-philosophy.md        # Design rationale
├── test/                           # Contract tests (Hardhat/Chai)
├── scripts/
│   └── deploy.js                   # Hardhat deployment script
├── hardhat.config.js               # Hardhat configuration
├── next.config.ts                  # Next.js configuration
└── package.json                    # Dependencies and scripts
```

## 2. Core Modules

### 2.1 Hashing (`src/lib/hash.ts`)

The hashing module has one exported function and two utilities:

```typescript
export async function hashFileSha256(file: File): Promise<`0x${string}`>
```

**Implementation details:**
- Uses `file.arrayBuffer()` to read file bytes into an in-memory buffer
- Passes the buffer to `crypto.subtle.digest("SHA-256", buffer)` — a native browser API implemented in C/C++ (not JavaScript)
- Encodes the resulting `ArrayBuffer` as a hex string with `0x` prefix

**Determinism:** SHA-256 is a deterministic hash function. The same file bytes always produce the same output, regardless of browser, OS, or device. This is a property of the SHA-256 algorithm, not of OpenProof.

**Portability:** `sha256sum <file>` on Linux, `certutil -hashfile <file> SHA256` on Windows, and `shasum -a 256 <file>` on macOS all produce the same output for the same file.

### 2.2 Bundle Proofs (`src/lib/bundle.ts`)

```typescript
export async function hashBundleFiles(files: File[]): Promise<{
  bundleHash: `0x${string}`;
  manifest: BundleManifest;
}>
```

**Implementation details:**
1. Each file is hashed independently with `hashFileSha256`
2. A `BundleManifest` is assembled with file name, size, MIME type, and SHA-256 hash per file
3. Entries are sorted by the string `name:size:type:sha256` using `localeCompare`
4. The manifest is serialized using a custom `stableStringify` function that produces deterministic JSON output (sorted object keys, no whitespace)
5. The stringified manifest is encoded as UTF-8 bytes
6. The bytes are hashed with SHA-256

**BundleManifest schema (v1):**

```typescript
type BundleManifest = {
  appName: "OpenProof";                    // fixed string
  bundleVersion: 1;                        // manifest schema version
  bundleRuleVersion: 1;                    // sort rule version
  hashAlgorithm: "SHA-256";                // fixed string
  rule: "sort-by-name-size-type-hash";     // rule identifier
  files: Array<{
    name: string;                          // file name from OS
    size: number;                          // bytes
    type: string;                          // MIME type or "unknown"
    sha256: `0x${string}`;                // per-file hash
  }>;
};
```

**Determinism considerations:**
- `localeCompare` behavior can vary by browser locale, but this affects only the sort order of files with identical `name:size:type:sha256` strings, which is a degenerate case (two files with identical name, size, type, and hash — the same file selected twice)
- `JSON.stringify` has implementation-dependent key ordering in older JavaScript engines; the custom `stableStringify` avoids this by explicitly sorting keys
- The UTF-8 encoding of the manifest is stable across all platforms

### 2.3 Receipt Generation (`src/lib/receipt.ts`)

```typescript
export function buildProofReceipt(input: ...): ProofReceipt
export function validateProofReceipt(value: unknown): ReceiptValidation
export function downloadJson(filename: string, data: unknown): void
```

**Receipt construction** happens after onchain confirmation. The receipt object is built from:

- **Schema metadata:** Schema version, receipt version (both `2`), app name and version
- **Proof metadata:** Proof type, hash algorithm
- **File info:** Name, size, MIME type, SHA-256 hash
- **Bundle info:** Bundle files array, bundle rule version (present for bundle proofs only)
- **Onchain metadata:** Chain ID, chain name, contract address, transaction hash, transaction URL, creator wallet
- **Timestamp:** ISO-8601 timestamp from the block timestamp
- **Verification links:** URL and instructions

**Receipt validation** performs 20+ checks before accepting a receipt:

1. JSON object type check
2. 13 required string field presence checks
3. `appName` must equal `"OpenProof"`
4. `fileSize` must be non-negative number
5. `chainId` must be positive integer
6. Optional `schemaVersion`/`receiptVersion` must be positive integers if present
7. `hashAlgorithm` must be `"SHA-256"` if present
8. `proofType` must be `"single-file"` or `"bundle"` if present
9. Hex format checks: `sha256Hash` (64 chars), `transactionHash` (64 chars), `contractAddress` (40 chars), `creatorWallet` (40 chars)
10. ISO-8601 timestamp must parse to a date between 2020 and 2100
11. Bundle consistency: if bundle type, `bundleFiles` must be non-empty array; each entry validated

All errors are collected and reported together — validation does not short-circuit on first failure.

### 2.4 Onchain Proof Reads (`src/lib/proofs.ts`)

```typescript
export async function readOnchainProof(
  publicClient: PublicClient,
  fileHash: `0x${string}`,
): Promise<OnchainProof | null>

export async function findProofTransactionHash(
  publicClient: PublicClient,
  fileHash: `0x${string}`,
): Promise<`0x${string}` | undefined>
```

**`readOnchainProof`** is a two-step process:
1. Call `proofExists(hash)` as a cheap existence check
2. If exists, call `getProof(hash)` for the full record

**`findProofTransactionHash`** uses bounded chunked event log scanning:

- Chunk size: 1,900 blocks per request
- Maximum lookback: 50,000 blocks from the latest block
- Searches backward from the latest block, filtering by `ProofRegistered` event with matching `fileHash` index
- Returns the first matching transaction hash found, or `undefined`

This is a best-effort lookup. The proof record from `getProof` is always authoritative regardless of whether the transaction hash is found.

### 2.5 Local History (`src/lib/history.ts`)

```typescript
export function getProofHistory(): ProofHistoryItem[]
export function addProofHistoryItem(item: ...): void
export function clearProofHistory(type?: ProofHistoryType): void
export function removeProofHistoryItem(id: string): void
```

**Storage details:**
- Key: `openproof:proof-history:v1`
- Format: JSON array of `ProofHistoryItem` objects
- Capacity: 30 entries maximum (oldest entries evicted first)
- Deduplication: Items with the same `id` (composite of proofType, fileHash, txHash/timestamp) replace rather than duplicate
- Updates: A custom DOM event (`openproof:history-updated`) is dispatched on mutation so the UI can react

**Ephemeral guarantees:**
- Data is stored in browser `localStorage` only
- Not synchronized across devices, browsers, or browser profiles
- Not recoverable if cleared
- Not available in private/incognito browsing modes (localStorage is isolated or unavailable)
- Not a backup or authoritative record

## 3. Smart Contract Implementation

```solidity
contract OpenProofRegistry {
    struct Proof {
        address creator;
        uint64 timestamp;
        bytes32 fileHash;
    }

    error EmptyFileHash();
    error ProofAlreadyRegistered(bytes32 fileHash);
    error ProofNotFound(bytes32 fileHash);

    event ProofRegistered(
        bytes32 indexed fileHash,
        address indexed creator,
        uint64 timestamp
    );

    mapping(bytes32 => Proof) private proofs;

    function registerProof(bytes32 fileHash) external { ... }
    function getProof(bytes32 fileHash) external view returns (Proof memory) { ... }
    function proofExists(bytes32 fileHash) external view returns (bool) { ... }
}
```

**Gas profile (approximate, Base Sepolia):**
- `registerProof` (first registration): ~44,000 gas (cold storage write, event emission)
- `registerProof` (duplicate revert): ~22,000 gas (warm storage read, revert)
- `getProof` (exists): ~12,000 gas (warm storage read)
- `proofExists` (exists): ~8,000 gas (warm storage read)
- `proofExists` (not exists): ~2,200 gas (cold storage read returning sentinel)

**Contract invariants:**
- No overwrites: `registerProof` reverts if `proofs[hash].timestamp != 0`
- No deletions: No `delete` or code path that removes a proof
- No upgrades: No `delegatecall`, proxy, or owner pattern
- No external calls: No `call`, `staticcall`, or `delegatecall` to other contracts
- Zero-protected: `registerProof(bytes32(0))` reverts with `EmptyFileHash`
- Timestamp sentinel guard: `proof.timestamp == 0` distinguishes "not found" from valid proof

## 4. Wallets and Provider Integration

Wallet connectivity uses RainbowKit with wagmi. Key integration points:

- `wagmiProvider` wraps the app with React Query and wagmi configuration
- `RainbowKitProvider` provides the wallet connection UI
- `useWriteContract` handles the `registerProof` write call
- `useWaitForTransactionReceipt` polls for transaction confirmation
- `usePublicClient` provides a read-only client for chain queries

The wallet is responsible for:
1. Displaying the transaction parameters to the user
2. Collecting the user's signature approval
3. Broadcasting the signed transaction to the network
4. Returning the transaction hash or error

OpenProof does not:
- Handle private keys or seed phrases
- Construct transactions outside the user's wallet
- Bypass wallet prompts or confirmation dialogs
- Access the user's wallet balance or transaction history beyond what wagmi exposes

## 5. Deterministic Guarantees

The following operations are deterministic:

| Operation | Deterministic? | Independent verification method |
|-----------|---------------|--------------------------------|
| SHA-256 hash of file bytes | Yes (algorithm property) | `sha256sum`, `openssl dgst -sha256` |
| Bundle manifest construction | Yes (sorted entries, stable stringify) | Manual reconstruction from receipt |
| Bundle hash computation | Yes (SHA-256 of manifest UTF-8) | Manual reconstruction from receipt |
| Receipt JSON generation | Yes (fixed schema, deterministic fields) | Any JSON validator |
| Contract `getProof` output | Yes (pure function of storage) | Block explorer query |
| Contract `proofExists` output | Yes (pure function of storage) | Block explorer query |

The following operations are not deterministic:

| Operation | Non-deterministic | Source of variation |
|-----------|------------------|-------------------|
| Transaction hash | No — different nonce/gas/wallet | Each registration is a distinct transaction |
| Block timestamp | No — varies by block inclusion time | Network conditions |
| Receipt `createdTimestamp` | No — derived from block timestamp | Chain conditions |
| Event log scan results | No — depends on RPC node's data availability | RPC node synchronization state |

## 6. Portability

### 6.1 Cross-Platform Hashes

SHA-256 is a cross-platform algorithm. The hash computed by OpenProof's Web Crypto API is identical to:
- `sha256sum` output (Linux, macOS, WSL)
- `certutil -hashfile <file> SHA256` output (Windows)
- `shasum -a 256 <file>` output (macOS)
- Any SHA-256 library in any programming language

### 6.2 Cross-Platform Receipts

Receipt JSON files are plain UTF-8 JSON:
- No platform-specific encoding
- No binary serialization
- No timestamps in local time (always ISO-8601 UTC)
- No file paths (file names only)
- No environment-specific identifiers

### 6.3 Deployment Portability

The frontend static export can be served from:
- Vercel (default)
- Any web server (nginx, Apache, Caddy, IIS)
- IPFS gateway
- Local file system (file:// protocol)
- USB drive / offline medium
- Containerized environments (Docker, k8s with static file server)

### 6.4 Cross-Contract Verification

A receipt from any OpenProof deployment can be verified against any compatible frontend instance by:
1. Extracting the receipt's `contractAddress` and `chainId`
2. Configuring the frontend (or an independent tool) to read from that contract
3. Looking up the `sha256Hash` from the receipt

This is supported by the receipt schema, which carries all necessary chain and contract metadata.

## 7. Build and Validation

```bash
# Install exact dependencies
npm ci

# Development
npm run dev

# Type checking
npm run typecheck

# Linting
npm run lint

# Contract compilation
npm run compile

# Contract tests
npm run test:contracts

# Full build
npm run build

# Deployment
npm run deploy:base-sepolia
```

Validation gates:
- TypeScript `--noEmit` for type correctness
- ESLint for code quality
- Hardhat compilation for Solidity syntax
- Chai contract tests for contract behavior
- Next.js build for production readiness

## 8. Dependencies

### Runtime Dependencies

| Package | Version | Purpose | Risk Assessment |
|---------|---------|---------|----------------|
| `next` | ^15.5.18 | React framework, static export | Established framework |
| `react`, `react-dom` | 19.2.4 | UI rendering | Core web dependency |
| `viem` | ^2.51.0 | Typed Ethereum interactions | Active maintenance |
| `wagmi` | ^2.19.5 | Wallet connection hooks | Active maintenance |
| `@rainbow-me/rainbowkit` | ^2.2.11 | Wallet connection UI | Active maintenance |
| `@tanstack/react-query` | ^5.100.14 | Server state management | Established library |
| `qrcode` | ^1.5.4 | QR code generation | Lightweight, client-only |

### Development Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `hardhat` | ^2.22.19 | Solidity development framework |
| `@nomicfoundation/hardhat-toolbox` | ^5.0.0 | Hardhat testing tools |
| `chai` | ^4.5.0 | Test assertions |
| `typescript` | ^5 | Type checking |
| `eslint`, `eslint-config-next` | ^9, ^15.5.18 | Linting |
| `tailwindcss` | ^4 | CSS framework |
| `dotenv` | ^17.4.2 | Environment variable loading for scripts |

## 9. Receipt Schema Evolution

Receipts carry two version fields to decouple schema evolution from app releases:

```typescript
schemaVersion: 2;   // structural schema version
receiptVersion: 2;  // semantic format version
```

**Backward-compatibility guarantees:**
- Validators accept all v1 receipts indefinitely
- New fields are optional with documented defaults
- Existing field names are never removed or renamed within the same major schema version
- Unknown schema versions are rejected with a clear error message

See [receipt-schema.md](receipt-schema.md) for the complete schema specification and versioning documentation.

## 10. Bundle Rule Versioning

Bundle rules are versioned independently of the receipt schema:

| `bundleRuleVersion` | Rule Identifier | Description |
|-------------------|----------------|-------------|
| 1 | `sort-by-name-size-type-hash` | Sort by concatenated `name:size:type:sha256`, stable-stringify, SHA-256 hash manifest |

When the bundle rule changes:
1. `bundleRuleVersion` is incremented
2. The new rule identifier is updated
3. The receipt carries the `bundleRuleVersion` used at registration
4. Verifiers must apply the matching rule

This prevents verification drift when the bundle algorithm evolves. Old receipts remain verifiable under their original rule even as new rules are added.
# OpenProof Implementation Notes

**Classification:** Implementation documentation
**Scope:** OpenProof, all deployments and forks
**Authority:** Ecosystem governance standards — [ecosystem-standards](https://github.com/sparshsam/ecosystem-standards)
**Status:** Ratified — do not amend without governance review

---

## 1. Repository Structure

```
openproof/
├── contracts/
│   └── OpenProofRegistry.sol      # EVM smart contract (48 lines)
├── src/
│   ├── app/
│   │   ├── page.tsx                # Landing page
│   │   ├── layout.tsx              # Root layout, providers
│   │   ├── create/page.tsx         # Proof registration flow
│   │   ├── verify/page.tsx         # Proof verification flow
│   │   └── proof/[hash]/page.tsx   # Public proof explorer
│   ├── components/
│   │   ├── providers/
│   │   │   └── wallet-provider.tsx # RainbowKit + wagmi setup
│   │   ├── design-system/          # Reusable UI primitives
│   │   ├── file-drop.tsx           # File selection with drag-drop
│   │   ├── hash-display.tsx        # Hash display with copy
│   │   ├── qr-code.tsx             # QR code generation
│   │   ├── receipt-import.tsx      # Receipt JSON import
│   │   └── proof-history.tsx       # Local history display
│   ├── lib/
│   │   ├── hash.ts                 # SHA-256 hashing (Web Crypto API)
│   │   ├── bundle.ts               # Bundle manifest + hash computation
│   │   ├── receipt.ts              # Receipt type, builder, validator
│   │   ├── proofs.ts               # Onchain proof reads, event lookup
│   │   ├── contracts.ts            # ABI, chain config, contract address
│   │   ├── history.ts              # localStorage proof history
│   │   ├── proof-url.ts            # Shareable URL construction
│   │   ├── explorer.ts             # Block explorer URL helpers
│   │   └── time.ts                 # Timestamp formatting
│   └── ...
├── docs/                           # Permanent documentation
│   ├── ARCHITECTURE.md
│   ├── VERIFICATION_LIFECYCLE.md
│   ├── DATA_FLOW.md
│   ├── FAILURE_MODES.md
│   ├── IMPLEMENTATION_NOTES.md
│   ├── TRUST_MODEL.md
│   ├── architecture.md             # Legacy architecture doc (superseded)
│   ├── SYSTEMS_DOCTRINE.md         # Permanent architectural doctrine
│   ├── TRUST_BOUNDARIES.md         # Permanent trust documentation
│   ├── NON_GOALS.md                # Permanent exclusion register
│   ├── threat-model.md             # Extended threat analysis
│   ├── receipt-schema.md           # Receipt JSON schema specification
│   ├── security-principles.md      # Operational, deployment, trust principles
│   ├── deployment-notes.md         # Deployment guidance
│   └── design-philosophy.md        # Design rationale
├── test/                           # Contract tests (Hardhat/Chai)
├── scripts/
│   └── deploy.js                   # Hardhat deployment script
├── hardhat.config.js               # Hardhat configuration
├── next.config.ts                  # Next.js configuration
└── package.json                    # Dependencies and scripts
```

## 2. Core Modules

### 2.1 Hashing (`src/lib/hash.ts`)

The hashing module has one exported function and two utilities:

```typescript
export async function hashFileSha256(file: File): Promise<`0x${string}`>
```

**Implementation details:**
- Uses `file.arrayBuffer()` to read file bytes into an in-memory buffer
- Passes the buffer to `crypto.subtle.digest("SHA-256", buffer)` — a native browser API implemented in C/C++ (not JavaScript)
- Encodes the resulting `ArrayBuffer` as a hex string with `0x` prefix

**Determinism:** SHA-256 is a deterministic hash function. The same file bytes always produce the same output, regardless of browser, OS, or device. This is a property of the SHA-256 algorithm, not of OpenProof.

**Portability:** `sha256sum <file>` on Linux, `certutil -hashfile <file> SHA256` on Windows, and `shasum -a 256 <file>` on macOS all produce the same output for the same file.

### 2.2 Bundle Proofs (`src/lib/bundle.ts`)

```typescript
export async function hashBundleFiles(files: File[]): Promise<{
  bundleHash: `0x${string}`;
  manifest: BundleManifest;
}>
```

**Implementation details:**
1. Each file is hashed independently with `hashFileSha256`
2. A `BundleManifest` is assembled with file name, size, MIME type, and SHA-256 hash per file
3. Entries are sorted by the string `name:size:type:sha256` using `localeCompare`
4. The manifest is serialized using a custom `stableStringify` function that produces deterministic JSON output (sorted object keys, no whitespace)
5. The stringified manifest is encoded as UTF-8 bytes
6. The bytes are hashed with SHA-256

**BundleManifest schema (v1):**

```typescript
type BundleManifest = {
  appName: "OpenProof";                    // fixed string
  bundleVersion: 1;                        // manifest schema version
  bundleRuleVersion: 1;                    // sort rule version
  hashAlgorithm: "SHA-256";                // fixed string
  rule: "sort-by-name-size-type-hash";     // rule identifier
  files: Array<{
    name: string;                          // file name from OS
    size: number;                          // bytes
    type: string;                          // MIME type or "unknown"
    sha256: `0x${string}`;                // per-file hash
  }>;
};
```

**Determinism considerations:**
- `localeCompare` behavior can vary by browser locale, but this affects only the sort order of files with identical `name:size:type:sha256` strings, which is a degenerate case (two files with identical name, size, type, and hash — the same file selected twice)
- `JSON.stringify` has implementation-dependent key ordering in older JavaScript engines; the custom `stableStringify` avoids this by explicitly sorting keys
- The UTF-8 encoding of the manifest is stable across all platforms

### 2.3 Receipt Generation (`src/lib/receipt.ts`)

```typescript
export function buildProofReceipt(input: ...): ProofReceipt
export function validateProofReceipt(value: unknown): ReceiptValidation
export function downloadJson(filename: string, data: unknown): void
```

**Receipt construction** happens after onchain confirmation. The receipt object is built from:

- **Schema metadata:** Schema version, receipt version (both `2`), app name and version
- **Proof metadata:** Proof type, hash algorithm
- **File info:** Name, size, MIME type, SHA-256 hash
- **Bundle info:** Bundle files array, bundle rule version (present for bundle proofs only)
- **Onchain metadata:** Chain ID, chain name, contract address, transaction hash, transaction URL, creator wallet
- **Timestamp:** ISO-8601 timestamp from the block timestamp
- **Verification links:** URL and instructions

**Receipt validation** performs 20+ checks before accepting a receipt:

1. JSON object type check
2. 13 required string field presence checks
3. `appName` must equal `"OpenProof"`
4. `fileSize` must be non-negative number
5. `chainId` must be positive integer
6. Optional `schemaVersion`/`receiptVersion` must be positive integers if present
7. `hashAlgorithm` must be `"SHA-256"` if present
8. `proofType` must be `"single-file"` or `"bundle"` if present
9. Hex format checks: `sha256Hash` (64 chars), `transactionHash` (64 chars), `contractAddress` (40 chars), `creatorWallet` (40 chars)
10. ISO-8601 timestamp must parse to a date between 2020 and 2100
11. Bundle consistency: if bundle type, `bundleFiles` must be non-empty array; each entry validated

All errors are collected and reported together — validation does not short-circuit on first failure.

### 2.4 Onchain Proof Reads (`src/lib/proofs.ts`)

```typescript
export async function readOnchainProof(
  publicClient: PublicClient,
  fileHash: `0x${string}`,
): Promise<OnchainProof | null>

export async function findProofTransactionHash(
  publicClient: PublicClient,
  fileHash: `0x${string}`,
): Promise<`0x${string}` | undefined>
```

**`readOnchainProof`** is a two-step process:
1. Call `proofExists(hash)` as a cheap existence check
2. If exists, call `getProof(hash)` for the full record

**`findProofTransactionHash`** uses bounded chunked event log scanning:

- Chunk size: 1,900 blocks per request
- Maximum lookback: 50,000 blocks from the latest block
- Searches backward from the latest block, filtering by `ProofRegistered` event with matching `fileHash` index
- Returns the first matching transaction hash found, or `undefined`

This is a best-effort lookup. The proof record from `getProof` is always authoritative regardless of whether the transaction hash is found.

### 2.5 Local History (`src/lib/history.ts`)

```typescript
export function getProofHistory(): ProofHistoryItem[]
export function addProofHistoryItem(item: ...): void
export function clearProofHistory(type?: ProofHistoryType): void
export function removeProofHistoryItem(id: string): void
```

**Storage details:**
- Key: `openproof:proof-history:v1`
- Format: JSON array of `ProofHistoryItem` objects
- Capacity: 30 entries maximum (oldest entries evicted first)
- Deduplication: Items with the same `id` (composite of proofType, fileHash, txHash/timestamp) replace rather than duplicate
- Updates: A custom DOM event (`openproof:history-updated`) is dispatched on mutation so the UI can react

**Ephemeral guarantees:**
- Data is stored in browser `localStorage` only
- Not synchronized across devices, browsers, or browser profiles
- Not recoverable if cleared
- Not available in private/incognito browsing modes (localStorage is isolated or unavailable)
- Not a backup or authoritative record

## 3. Smart Contract Implementation

```solidity
contract OpenProofRegistry {
    struct Proof {
        address creator;
        uint64 timestamp;
        bytes32 fileHash;
    }

    error EmptyFileHash();
    error ProofAlreadyRegistered(bytes32 fileHash);
    error ProofNotFound(bytes32 fileHash);

    event ProofRegistered(
        bytes32 indexed fileHash,
        address indexed creator,
        uint64 timestamp
    );

    mapping(bytes32 => Proof) private proofs;

    function registerProof(bytes32 fileHash) external { ... }
    function getProof(bytes32 fileHash) external view returns (Proof memory) { ... }
    function proofExists(bytes32 fileHash) external view returns (bool) { ... }
}
```

**Gas profile (approximate, Base Sepolia):**
- `registerProof` (first registration): ~44,000 gas (cold storage write, event emission)
- `registerProof` (duplicate revert): ~22,000 gas (warm storage read, revert)
- `getProof` (exists): ~12,000 gas (warm storage read)
- `proofExists` (exists): ~8,000 gas (warm storage read)
- `proofExists` (not exists): ~2,200 gas (cold storage read returning sentinel)

**Contract invariants:**
- No overwrites: `registerProof` reverts if `proofs[hash].timestamp != 0`
- No deletions: No `delete` or code path that removes a proof
- No upgrades: No `delegatecall`, proxy, or owner pattern
- No external calls: No `call`, `staticcall`, or `delegatecall` to other contracts
- Zero-protected: `registerProof(bytes32(0))` reverts with `EmptyFileHash`
- Timestamp sentinel guard: `proof.timestamp == 0` distinguishes "not found" from valid proof

## 4. Wallets and Provider Integration

Wallet connectivity uses RainbowKit with wagmi. Key integration points:

- `wagmiProvider` wraps the app with React Query and wagmi configuration
- `RainbowKitProvider` provides the wallet connection UI
- `useWriteContract` handles the `registerProof` write call
- `useWaitForTransactionReceipt` polls for transaction confirmation
- `usePublicClient` provides a read-only client for chain queries

The wallet is responsible for:
1. Displaying the transaction parameters to the user
2. Collecting the user's signature approval
3. Broadcasting the signed transaction to the network
4. Returning the transaction hash or error

OpenProof does not:
- Handle private keys or seed phrases
- Construct transactions outside the user's wallet
- Bypass wallet prompts or confirmation dialogs
- Access the user's wallet balance or transaction history beyond what wagmi exposes

## 5. Deterministic Guarantees

The following operations are deterministic:

| Operation | Deterministic? | Independent verification method |
|-----------|---------------|--------------------------------|
| SHA-256 hash of file bytes | Yes (algorithm property) | `sha256sum`, `openssl dgst -sha256` |
| Bundle manifest construction | Yes (sorted entries, stable stringify) | Manual reconstruction from receipt |
| Bundle hash computation | Yes (SHA-256 of manifest UTF-8) | Manual reconstruction from receipt |
| Receipt JSON generation | Yes (fixed schema, deterministic fields) | Any JSON validator |
| Contract `getProof` output | Yes (pure function of storage) | Block explorer query |
| Contract `proofExists` output | Yes (pure function of storage) | Block explorer query |

The following operations are not deterministic:

| Operation | Non-deterministic | Source of variation |
|-----------|------------------|-------------------|
| Transaction hash | No — different nonce/gas/wallet | Each registration is a distinct transaction |
| Block timestamp | No — varies by block inclusion time | Network conditions |
| Receipt `createdTimestamp` | No — derived from block timestamp | Chain conditions |
| Event log scan results | No — depends on RPC node's data availability | RPC node synchronization state |

## 6. Portability

### 6.1 Cross-Platform Hashes

SHA-256 is a cross-platform algorithm. The hash computed by OpenProof's Web Crypto API is identical to:
- `sha256sum` output (Linux, macOS, WSL)
- `certutil -hashfile <file> SHA256` output (Windows)
- `shasum -a 256 <file>` output (macOS)
- Any SHA-256 library in any programming language

### 6.2 Cross-Platform Receipts

Receipt JSON files are plain UTF-8 JSON:
- No platform-specific encoding
- No binary serialization
- No timestamps in local time (always ISO-8601 UTC)
- No file paths (file names only)
- No environment-specific identifiers

### 6.3 Deployment Portability

The frontend static export can be served from:
- Vercel (default)
- Any web server (nginx, Apache, Caddy, IIS)
- IPFS gateway
- Local file system (file:// protocol)
- USB drive / offline medium
- Containerized environments (Docker, k8s with static file server)

### 6.4 Cross-Contract Verification

A receipt from any OpenProof deployment can be verified against any compatible frontend instance by:
1. Extracting the receipt's `contractAddress` and `chainId`
2. Configuring the frontend (or an independent tool) to read from that contract
3. Looking up the `sha256Hash` from the receipt

This is supported by the receipt schema, which carries all necessary chain and contract metadata.

## 7. Build and Validation

```bash
# Install exact dependencies
npm ci

# Development
npm run dev

# Type checking
npm run typecheck

# Linting
npm run lint

# Contract compilation
npm run compile

# Contract tests
npm run test:contracts

# Full build
npm run build

# Deployment
npm run deploy:base-sepolia
```

Validation gates:
- TypeScript `--noEmit` for type correctness
- ESLint for code quality
- Hardhat compilation for Solidity syntax
- Chai contract tests for contract behavior
- Next.js build for production readiness

## 8. Dependencies

### Runtime Dependencies

| Package | Version | Purpose | Risk Assessment |
|---------|---------|---------|----------------|
| `next` | ^15.5.18 | React framework, static export | Established framework |
| `react`, `react-dom` | 19.2.4 | UI rendering | Core web dependency |
| `viem` | ^2.51.0 | Typed Ethereum interactions | Active maintenance |
| `wagmi` | ^2.19.5 | Wallet connection hooks | Active maintenance |
| `@rainbow-me/rainbowkit` | ^2.2.11 | Wallet connection UI | Active maintenance |
| `@tanstack/react-query` | ^5.100.14 | Server state management | Established library |
| `qrcode` | ^1.5.4 | QR code generation | Lightweight, client-only |

### Development Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `hardhat` | ^2.22.19 | Solidity development framework |
| `@nomicfoundation/hardhat-toolbox` | ^5.0.0 | Hardhat testing tools |
| `chai` | ^4.5.0 | Test assertions |
| `typescript` | ^5 | Type checking |
| `eslint`, `eslint-config-next` | ^9, ^15.5.18 | Linting |
| `tailwindcss` | ^4 | CSS framework |
| `dotenv` | ^17.4.2 | Environment variable loading for scripts |

## 9. Receipt Schema Evolution

Receipts carry two version fields to decouple schema evolution from app releases:

```typescript
schemaVersion: 2;   // structural schema version
receiptVersion: 2;  // semantic format version
```

**Backward-compatibility guarantees:**
- Validators accept all v1 receipts indefinitely
- New fields are optional with documented defaults
- Existing field names are never removed or renamed within the same major schema version
- Unknown schema versions are rejected with a clear error message

See [receipt-schema.md](receipt-schema.md) for the complete schema specification and versioning documentation.

## 10. Bundle Rule Versioning

Bundle rules are versioned independently of the receipt schema:

| `bundleRuleVersion` | Rule Identifier | Description |
|-------------------|----------------|-------------|
| 1 | `sort-by-name-size-type-hash` | Sort by concatenated `name:size:type:sha256`, stable-stringify, SHA-256 hash manifest |

When the bundle rule changes:
1. `bundleRuleVersion` is incremented
2. The new rule identifier is updated
3. The receipt carries the `bundleRuleVersion` used at registration
4. Verifiers must apply the matching rule

This prevents verification drift when the bundle algorithm evolves. Old receipts remain verifiable under their original rule even as new rules are added.
