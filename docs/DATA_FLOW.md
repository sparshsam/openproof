# OpenProof Data Flow

**Classification:** Permanent data flow documentation
**Scope:** OpenProof, all deployments and forks
**Authority:** Ecosystem governance standards — [ecosystem-standards](https://github.com/sparshsam/ecosystem-standards)
**Status:** Adopted — see docs/SYSTEMS_DOCTRINE.md §0 for freeze classification

---

## 1. Data at Rest

OpenProof stores data in exactly two locations. No other persistent storage exists.

| Location | Data | Lifespan | Authority |
|----------|------|----------|-----------|
| Blockchain (EVM contract storage) | `Proof` structs: hash → (creator, timestamp) | Permanent (immutable contract) | Canonical source of truth |
| Browser localStorage | `ProofHistoryItem[]` — ephemeral history records | Ephemeral (cleared on browser data clear, not synchronized) | Convenience only, not authoritative |

### 1.1 Onchain Data Model

```solidity
struct Proof {
    address creator;     // 20 bytes
    uint64 timestamp;    // 8 bytes
    bytes32 fileHash;    // 32 bytes (redundant with mapping key)
}
// Total: 60 bytes per proof (2 cold storage slots)
```

The `bytes32 fileHash` field in the struct is redundant with the mapping key. It exists for convenience when reading the struct without external key context. This doubles storage per proof (~40,000 gas vs ~22,000 for a single-slot mapping) but has no security impact.

### 1.2 Browser Storage Model

```typescript
type ProofHistoryItem = {
  id: string;               // composite key: proofType:fileHash:txHash|timestamp
  proofType: "registered" | "verified";
  fileName: string;         // original file name (informational)
  fileHash: string;         // hex-encoded SHA-256 hash
  txHash?: string;          // optional transaction hash
  chainName: string;
  chainId: number;
  timestamp: string;        // ISO-8601
  verificationUrl: string;
  baseScanUrl?: string;
};
```

Storage key: `openproof:proof-history:v1`, capped at 30 entries. No data is ever transmitted from this storage.

## 2. Data in Motion

### 2.1 File Bytes

File bytes follow a single path:

```
File on disk  ──▶  Browser File API  ──▶  ArrayBuffer (in-memory)
                                                │
                                                ▼
                                        Web Crypto SHA-256
                                                │
                                                ▼
                                        bytes32 hash (64 hex chars + 0x prefix)
```

File bytes are read through the browser's native File API. The `ArrayBuffer` is passed directly to `crypto.subtle.digest`. See [TRUST_MODEL.md](TRUST_MODEL.md) A2 (Web Crypto API correctness assumption). No file bytes are:

- Converted to string representation
- Serialized to JSON
- Sent over the network
- Written to persistent storage (localStorage or otherwise)
- Exposed to JavaScript string manipulation after the digest call

**Boundary condition:** If a user selects a file and the same file is selected again through the native file picker, a new `ArrayBuffer` is created. OpenProof does not retain file bytes across page loads.

### 2.2 Hash Data

The `bytes32` hash follows this path:

```
Web Crypto SHA-256
        │
        ▼
UI display (hex string, shortened for readability)
        │
        ├── ▶  Wallet transaction: `registerProof(bytes32 hash)`
        │              │
        │              ▼
        │       Blockchain: contract storage + event emission
        │
        ├── ▶  Receipt construction: hash embedded in JSON receipt
        │              │
        │              ▼
        │       Local file download (JSON blob, user-triggered)
        │
        └── ▶  URL construction: `/proof/{hash}` for shareable page
```

The hash leaves the browser twice: (1) inside a signed transaction to the blockchain, and (2) optionally in a downloaded JSON receipt file. Neither path transmits the hash to a server controlled by OpenProof. See [TRUST_MODEL.md](TRUST_MODEL.md) §4.1 for the frontend trust implications of this path.

### 2.3 Receipt Data Flow

```
Block confirmation
        │
        ▼
Fetch block timestamp ──▶  Build ProofReceipt object
                                   │
                                   ▼
                          Create JSON blob (in-memory)
                                   │
                          ┌────────┴────────┐
                          ▼                 ▼
                   Download JSON      Display in UI
                   (user-initiated)   (no transmission)
```

Receipt construction occurs entirely client-side. The receipt object is built from locally known data:

- File metadata (from the original `File` object in browser memory)
- Hash (from the hashing step)
- Transaction hash and block timestamp (from the blockchain receipt)
- Contract configuration (from environment variables embedded in the build)

The receipt is never uploaded, transmitted, or stored on any server. The user initiates the download through a browser download prompt.

### 2.4 Bundle Proof Data Flow

Bundle proofs follow a more structured path:

```
Select N files
        │
        ▼
Hash each file independently with SHA-256 ──▶  N individual hash values
        │
        ▼
Build manifest array:
  [{ name, size, type, sha256 }, ...]
        │
        ▼
Sort entries by concat(name, size, type, sha256) using localeCompare
        │
        ▼
Stable-stringify manifest (sorted keys, deterministic JSON)
        │
        ▼
Encode string as UTF-8 bytes ──▶  SHA-256 hash of manifest bytes
        │
        ▼
Register bundle hash onchain (same contract function)
```

The bundle hash is a SHA-256 digest of the stable-stringified manifest. The manifest itself is not registered onchain — only the final digest. This means:

- The individual file hashes are not directly onchain
- The bundle file set is not discoverable from the onchain record
- Verification requires the same exact file set and bundle rule
- The receipt carries `bundleFiles` (individual file hashes) for offline verification

### 2.5 QR Code Data Flow

```
Block confirmation
        │
        ▼
Build proof URL: https://{origin}/proof/{hash}
        │
        ▼
Generate QR code (qrcode library, client-side only)
        │
        ▼
Display QR code in UI ──▶  User downloads QR as PNG
```

The QR code encodes only the proof page URL. No file data, hash data beyond the URL, or metadata is embedded in the QR code bitmap.

## 3. Data Flow Diagram (Complete System)

```
┌─────────────────────────────────────────────────────────────────────┐
│                            BROWSER                                  │
│                                                                     │
│  ┌──────────┐   ┌──────────┐   ┌────────────┐   ┌──────────────┐   │
│  │  File    │   │ SHA-256  │   │ Receipt    │   │ Local Storage│   │
│  │  API     │──▶│ (Web     │──▶│ Builder    │──▶│ (history,    │   │
│  │          │   │  Crypto) │   │            │   │  localStorage)│   │
│  └──────────┘   └────┬─────┘   └─────┬──────┘   └──────────────┘   │
│                      │               │                              │
│                      │               └──────▶ JSON download         │
│                      │                                              │
│                      │  ┌────────────┐   ┌──────────────────┐      │
│                      │  │ Bundle     │   │ QR Generator     │      │
│                      │  │ Manifest   │──▶│ (qrcode lib)     │      │
│                      │  │ Builder    │   └────────┬─────────┘      │
│                      │  └────────────┘            │                 │
│                      │                            ▼                 │
│                      │                     PNG download             │
│                      │                                              │
│                      ▼                                              │
│              ┌───────────────┐                                      │
│              │  wagmi / viem│                                      │
│              │  writeContract│                                      │
│              └───────┬───────┘                                      │
│                      │                                              │
└──────────────────────┼──────────────────────────────────────────────┘
                       │ signed transaction
                       │ (bytes32 hash only)
                       ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         BLOCKCHAIN                                  │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │              OpenProofRegistry                                │   │
│  │                                                               │   │
│  │  registerProof(hash)                                          │   │
│  │     │                                                         │   │
│  │     ├── bytes32(0) revert → EmptyFileHash error               │   │
│  │     ├── already registered → ProofAlreadyRegistered revert    │   │
│  │     └── new registration →                                    │   │
│  │           ├── Storage write: proofs[hash] = Proof(...)       │   │
│  │           └── Event emit: ProofRegistered(hash, addr, time)  │   │
│  │                                                               │   │
│  │  getProof(hash)                                               │   │
│  │     ├── not found → ProofNotFound revert                     │   │
│  │     └── found → return Proof struct                           │   │
│  │                                                               │   │
│  │  proofExists(hash) → return bool                              │   │
│  └──────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
```

## 4. Network Data

The following data types cross the network boundary:

| Data | Direction | Size | Frequency |
|------|-----------|------|-----------|
| `registerProof(bytes32)` transaction | Browser → Chain | ~60 bytes calldata | Once per proof registration |
| `proofExists(bytes32)` RPC call | Browser → RPC | ~68 bytes request | Once per registration attempt, once per verification |
| `getProof(bytes32)` RPC call | Browser → RPC | ~100 bytes request | Once per verification (on success) |
| `ProofRegistered` event logs | RPC → Browser | ~200 bytes per log | Bounded lookback (50,000 block window) |
| Static frontend assets | Host → Browser | ~2 MB initial load | Once per session (browser-cached) |
| WalletConnect relay traffic | Browser ↔ Relay | Variable | During wallet session |

No data in any of these network messages contains file bytes. The largest data transfer is the initial frontend page load.

## 5. Data Not Collected

The system intentionally never collects, stores, or transmits:

- User IP addresses
- Browser fingerprints or device identifiers
- Session identifiers or cookies (beyond Next.js defaults)
- Clickstream data or interaction logs
- File content, file previews, or thumbnails
- Wallet addresses (beyond what is publicly visible on the blockchain)
- Registration patterns or usage statistics
- Referrer headers or navigation history
- Timing data or performance metrics

## 6. Data Transformations

### 6.1 Single-File Hash Transform

```
Input: File (binary bytes)
Step 1: Read bytes via FileReader.arrayBuffer() → ArrayBuffer
Step 2: crypto.subtle.digest("SHA-256", buffer) → ArrayBuffer (32 bytes)
Step 3: Encode as hex string → `0x` + 64 hex chars
Output: `0x{64 hex chars}` — deterministic
```

### 6.2 Bundle Hash Transform

```
Input: File[] (N files)
Step 1: For each File: hashFileSha256(file) → hex hash
Step 2: Build BundleManifestFile[] with name, size, type, sha256
Step 3: Sort by localeCompare of "name:size:type:sha256"
Step 4: JSON.stringify(sorted array) with sorted object keys (stable stringify)
Step 5: new TextEncoder().encode(manifestString) → Uint8Array
Step 6: crypto.subtle.digest("SHA-256", encoded) → ArrayBuffer
Step 7: Encode as hex → `0x{64 hex chars}`
Output: `0x{64 hex chars}` — deterministic given same files and rules
```

### 6.3 Receipt Construction

```
Inputs: hash, txHash, block timestamp, contract config, file metadata
Step 1: Build ProofReceipt object with all 20+ fields
Step 2: Set defaults: appVersion="0.1.1", schemaVersion=2, etc.
Step 3: JSON.stringify(object, null, 2) → formatted JSON string
Output: JSON string (downloaded as .json file)
```

## 7. Data Deletion

- **Onchain data** cannot be deleted. Proofs are immutable once registered.
- **localStorage history** can be cleared from the UI (clear all or filter by type) or by clearing browser data.
- **File bytes** exist in browser memory only during the hashing step. They are garbage-collected when the `File` object goes out of scope or the page is navigated away from.
- **Receipt JSON files** are under the user's control after download. OpenProof cannot delete or modify downloaded files.
# OpenProof Data Flow

**Classification:** Permanent data flow documentation
**Scope:** OpenProof, all deployments and forks
**Authority:** Ecosystem governance standards — [ecosystem-standards](https://github.com/sparshsam/ecosystem-standards)
**Status:** Ratified — do not amend without governance review

---

## 1. Data at Rest

OpenProof stores data in exactly two locations. No other persistent storage exists.

| Location | Data | Lifespan | Authority |
|----------|------|----------|-----------|
| Blockchain (EVM contract storage) | `Proof` structs: hash → (creator, timestamp) | Permanent (immutable contract) | Canonical source of truth |
| Browser localStorage | `ProofHistoryItem[]` — ephemeral history records | Ephemeral (cleared on browser data clear, not synchronized) | Convenience only, not authoritative |

### 1.1 Onchain Data Model

```solidity
struct Proof {
    address creator;     // 20 bytes
    uint64 timestamp;    // 8 bytes
    bytes32 fileHash;    // 32 bytes (redundant with mapping key)
}
// Total: 60 bytes per proof (2 cold storage slots)
```

The `bytes32 fileHash` field in the struct is redundant with the mapping key. It exists for convenience when reading the struct without external key context. This doubles storage per proof (~40,000 gas vs ~22,000 for a single-slot mapping) but has no security impact.

### 1.2 Browser Storage Model

```typescript
type ProofHistoryItem = {
  id: string;               // composite key: proofType:fileHash:txHash|timestamp
  proofType: "registered" | "verified";
  fileName: string;         // original file name (informational)
  fileHash: string;         // hex-encoded SHA-256 hash
  txHash?: string;          // optional transaction hash
  chainName: string;
  chainId: number;
  timestamp: string;        // ISO-8601
  verificationUrl: string;
  baseScanUrl?: string;
};
```

Storage key: `openproof:proof-history:v1`, capped at 30 entries. No data is ever transmitted from this storage.

## 2. Data in Motion

### 2.1 File Bytes

File bytes follow a single path:

```
File on disk  ──▶  Browser File API  ──▶  ArrayBuffer (in-memory)
                                                │
                                                ▼
                                        Web Crypto SHA-256
                                                │
                                                ▼
                                        bytes32 hash (64 hex chars + 0x prefix)
```

File bytes are read through the browser's native File API. The `ArrayBuffer` is passed directly to `crypto.subtle.digest`. See [TRUST_MODEL.md](TRUST_MODEL.md) A2 (Web Crypto API correctness assumption). No file bytes are:

- Converted to string representation
- Serialized to JSON
- Sent over the network
- Written to persistent storage (localStorage or otherwise)
- Exposed to JavaScript string manipulation after the digest call

**Boundary condition:** If a user selects a file and the same file is selected again through the native file picker, a new `ArrayBuffer` is created. OpenProof does not retain file bytes across page loads.

### 2.2 Hash Data

The `bytes32` hash follows this path:

```
Web Crypto SHA-256
        │
        ▼
UI display (hex string, shortened for readability)
        │
        ├── ▶  Wallet transaction: `registerProof(bytes32 hash)`
        │              │
        │              ▼
        │       Blockchain: contract storage + event emission
        │
        ├── ▶  Receipt construction: hash embedded in JSON receipt
        │              │
        │              ▼
        │       Local file download (JSON blob, user-triggered)
        │
        └── ▶  URL construction: `/proof/{hash}` for shareable page
```

The hash leaves the browser twice: (1) inside a signed transaction to the blockchain, and (2) optionally in a downloaded JSON receipt file. Neither path transmits the hash to a server controlled by OpenProof. See [TRUST_MODEL.md](TRUST_MODEL.md) §4.1 for the frontend trust implications of this path.

### 2.3 Receipt Data Flow

```
Block confirmation
        │
        ▼
Fetch block timestamp ──▶  Build ProofReceipt object
                                   │
                                   ▼
                          Create JSON blob (in-memory)
                                   │
                          ┌────────┴────────┐
                          ▼                 ▼
                   Download JSON      Display in UI
                   (user-initiated)   (no transmission)
```

Receipt construction occurs entirely client-side. The receipt object is built from locally known data:

- File metadata (from the original `File` object in browser memory)
- Hash (from the hashing step)
- Transaction hash and block timestamp (from the blockchain receipt)
- Contract configuration (from environment variables embedded in the build)

The receipt is never uploaded, transmitted, or stored on any server. The user initiates the download through a browser download prompt.

### 2.4 Bundle Proof Data Flow

Bundle proofs follow a more structured path:

```
Select N files
        │
        ▼
Hash each file independently with SHA-256 ──▶  N individual hash values
        │
        ▼
Build manifest array:
  [{ name, size, type, sha256 }, ...]
        │
        ▼
Sort entries by concat(name, size, type, sha256) using localeCompare
        │
        ▼
Stable-stringify manifest (sorted keys, deterministic JSON)
        │
        ▼
Encode string as UTF-8 bytes ──▶  SHA-256 hash of manifest bytes
        │
        ▼
Register bundle hash onchain (same contract function)
```

The bundle hash is a SHA-256 digest of the stable-stringified manifest. The manifest itself is not registered onchain — only the final digest. This means:

- The individual file hashes are not directly onchain
- The bundle file set is not discoverable from the onchain record
- Verification requires the same exact file set and bundle rule
- The receipt carries `bundleFiles` (individual file hashes) for offline verification

### 2.5 QR Code Data Flow

```
Block confirmation
        │
        ▼
Build proof URL: https://{origin}/proof/{hash}
        │
        ▼
Generate QR code (qrcode library, client-side only)
        │
        ▼
Display QR code in UI ──▶  User downloads QR as PNG
```

The QR code encodes only the proof page URL. No file data, hash data beyond the URL, or metadata is embedded in the QR code bitmap.

## 3. Data Flow Diagram (Complete System)

```
┌─────────────────────────────────────────────────────────────────────┐
│                            BROWSER                                  │
│                                                                     │
│  ┌──────────┐   ┌──────────┐   ┌────────────┐   ┌──────────────┐   │
│  │  File    │   │ SHA-256  │   │ Receipt    │   │ Local Storage│   │
│  │  API     │──▶│ (Web     │──▶│ Builder    │──▶│ (history,    │   │
│  │          │   │  Crypto) │   │            │   │  localStorage)│   │
│  └──────────┘   └────┬─────┘   └─────┬──────┘   └──────────────┘   │
│                      │               │                              │
│                      │               └──────▶ JSON download         │
│                      │                                              │
│                      │  ┌────────────┐   ┌──────────────────┐      │
│                      │  │ Bundle     │   │ QR Generator     │      │
│                      │  │ Manifest   │──▶│ (qrcode lib)     │      │
│                      │  │ Builder    │   └────────┬─────────┘      │
│                      │  └────────────┘            │                 │
│                      │                            ▼                 │
│                      │                     PNG download             │
│                      │                                              │
│                      ▼                                              │
│              ┌───────────────┐                                      │
│              │  wagmi / viem│                                      │
│              │  writeContract│                                      │
│              └───────┬───────┘                                      │
│                      │                                              │
└──────────────────────┼──────────────────────────────────────────────┘
                       │ signed transaction
                       │ (bytes32 hash only)
                       ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         BLOCKCHAIN                                  │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │              OpenProofRegistry                                │   │
│  │                                                               │   │
│  │  registerProof(hash)                                          │   │
│  │     │                                                         │   │
│  │     ├── bytes32(0) revert → EmptyFileHash error               │   │
│  │     ├── already registered → ProofAlreadyRegistered revert    │   │
│  │     └── new registration →                                    │   │
│  │           ├── Storage write: proofs[hash] = Proof(...)       │   │
│  │           └── Event emit: ProofRegistered(hash, addr, time)  │   │
│  │                                                               │   │
│  │  getProof(hash)                                               │   │
│  │     ├── not found → ProofNotFound revert                     │   │
│  │     └── found → return Proof struct                           │   │
│  │                                                               │   │
│  │  proofExists(hash) → return bool                              │   │
│  └──────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
```

## 4. Network Data

The following data types cross the network boundary:

| Data | Direction | Size | Frequency |
|------|-----------|------|-----------|
| `registerProof(bytes32)` transaction | Browser → Chain | ~60 bytes calldata | Once per proof registration |
| `proofExists(bytes32)` RPC call | Browser → RPC | ~68 bytes request | Once per registration attempt, once per verification |
| `getProof(bytes32)` RPC call | Browser → RPC | ~100 bytes request | Once per verification (on success) |
| `ProofRegistered` event logs | RPC → Browser | ~200 bytes per log | Bounded lookback (50,000 block window) |
| Static frontend assets | Host → Browser | ~2 MB initial load | Once per session (browser-cached) |
| WalletConnect relay traffic | Browser ↔ Relay | Variable | During wallet session |

No data in any of these network messages contains file bytes. The largest data transfer is the initial frontend page load.

## 5. Data Not Collected

The system intentionally never collects, stores, or transmits:

- User IP addresses
- Browser fingerprints or device identifiers
- Session identifiers or cookies (beyond Next.js defaults)
- Clickstream data or interaction logs
- File content, file previews, or thumbnails
- Wallet addresses (beyond what is publicly visible on the blockchain)
- Registration patterns or usage statistics
- Referrer headers or navigation history
- Timing data or performance metrics

## 6. Data Transformations

### 6.1 Single-File Hash Transform

```
Input: File (binary bytes)
Step 1: Read bytes via FileReader.arrayBuffer() → ArrayBuffer
Step 2: crypto.subtle.digest("SHA-256", buffer) → ArrayBuffer (32 bytes)
Step 3: Encode as hex string → `0x` + 64 hex chars
Output: `0x{64 hex chars}` — deterministic
```

### 6.2 Bundle Hash Transform

```
Input: File[] (N files)
Step 1: For each File: hashFileSha256(file) → hex hash
Step 2: Build BundleManifestFile[] with name, size, type, sha256
Step 3: Sort by localeCompare of "name:size:type:sha256"
Step 4: JSON.stringify(sorted array) with sorted object keys (stable stringify)
Step 5: new TextEncoder().encode(manifestString) → Uint8Array
Step 6: crypto.subtle.digest("SHA-256", encoded) → ArrayBuffer
Step 7: Encode as hex → `0x{64 hex chars}`
Output: `0x{64 hex chars}` — deterministic given same files and rules
```

### 6.3 Receipt Construction

```
Inputs: hash, txHash, block timestamp, contract config, file metadata
Step 1: Build ProofReceipt object with all 20+ fields
Step 2: Set defaults: appVersion="0.1.1", schemaVersion=2, etc.
Step 3: JSON.stringify(object, null, 2) → formatted JSON string
Output: JSON string (downloaded as .json file)
```

## 7. Data Deletion

- **Onchain data** cannot be deleted. Proofs are immutable once registered.
- **localStorage history** can be cleared from the UI (clear all or filter by type) or by clearing browser data.
- **File bytes** exist in browser memory only during the hashing step. They are garbage-collected when the `File` object goes out of scope or the page is navigated away from.
- **Receipt JSON files** are under the user's control after download. OpenProof cannot delete or modify downloaded files.
