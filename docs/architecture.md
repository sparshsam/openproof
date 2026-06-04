# OpenProof Architecture

**Classification:** Permanent architectural documentation
**Scope:** OpenProof, all deployments and forks
**Authority:** Ecosystem governance standards — [ecosystem-standards](https://github.com/sparshsam/ecosystem-standards)
**Status:** Ratified — do not amend without governance review

---

## 1. System Identity

OpenProof is a proof-of-existence infrastructure tool. It registers cryptographic fingerprints of files on a public blockchain so that any party can later verify that a specific hash existed before a known block time.

The system has no backend, no database, no file storage, and no user accounts. It is a static client application that communicates with a minimal smart contract. All file processing occurs in the user's browser. The blockchain is the only persistent state layer.

## 2. High-Level Structure

```
┌──────────────────────────────────────────────────────────────────┐
│                       User Browser                                │
│                                                                  │
│  ┌─────────────┐  ┌──────────────┐  ┌───────────────────────┐  │
│  │ File API    │  │ Web Crypto   │  │ Wallet (RainbowKit/   │  │
│  │ (read file  │──▶│ SHA-256      │──▶│ wagmi)                │  │
│  │ bytes)      │  │ (hash bytes) │  │ (sign & submit tx)    │  │
│  └─────────────┘  └──────────────┘  └───────────┬───────────┘  │
│                                                  │              │
│  ┌─────────────┐  ┌──────────────┐              │              │
│  │ Receipt     │  │ Local        │              │              │
│  │ Generator   │  │ History      │              │              │
│  │ (JSON)      │  │ (localStorage)│             │              │
│  └─────────────┘  └──────────────┘              │              │
│                                                  │              │
│  ┌───────────────────────────────────────────────┘              │
│  │                                                              │
│  ▼                                                              │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Next.js Static Frontend                                  │   │
│  │  • /create — hash, register, receipt                     │   │
│  │  • /verify — hash, compare, receipt import               │   │
│  │  • /proof/[hash] — public proof explorer                 │   │
│  └──────────────────────────────────────────────────────────┘   │
└──────────────────────┬───────────────────────────────────────────┘
                       │ bytes32 hash only
                       │ (single transaction)
                       ▼
┌──────────────────────────────────────────────────────────────────┐
│                     Blockchain Layer                              │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │              OpenProofRegistry (smart contract)            │  │
│  │                                                            │  │
│  │  registerProof(bytes32)  →  stores (creator, timestamp)    │  │
│  │  getProof(bytes32)       →  returns Proof struct or revert │  │
│  │  proofExists(bytes32)    →  returns bool                   │  │
│  │                                                            │  │
│  │  Invariants: no overwrites, no deletions, no upgrades      │  │
│  │  Events: ProofRegistered(bytes32 indexed, address, uint64)│  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                  │
│  Chain: Base Sepolia (EVM, L2)                                   │
│  Status: Immutable per deployment                                 │
└──────────────────────────────────────────────────────────────────┘
```

The architecture separates into two layers: the user's browser (ephemeral, untrusted computation) and the blockchain (persistent, canonical state). No layer between them stores, relays, or processes file bytes.

## 3. Components

### 3.1 Frontend (Static Client Application)

The frontend is a statically served client application. It performs all file operations locally and interacts with the blockchain through the user's wallet.

| Component | Responsibility |
|-----------|----------------|
| File hashing | Reads file bytes via browser File API, computes SHA-256 via Web Crypto API. Deterministic across all browsers and platforms. See [TRUST_MODEL.md](TRUST_MODEL.md) G1. |
| Bundle proof | Hashes multiple files independently, builds a deterministic manifest with sorted entries, computes a combined bundle hash. See [VERIFICATION_LIFECYCLE.md](VERIFICATION_LIFECYCLE.md) §6. |
| Receipt generation | Constructs and validates JSON proof receipts from locally known data (hash, transaction metadata, file metadata). Receipts are local downloads — never transmitted. |
| Onchain reads | Reads proof records from the registry contract through a blockchain RPC interface. Supports bounded event-log scanning for transaction hash discovery. |
| Contract configuration | Stores contract ABI, chain identifier, and contract address from build-time environment variables. These values are public by design. |
| Local proof history | Maintains ephemeral registration and verification records in browser localStorage. Capped at 30 entries. Not synchronized, not authoritative. |
| QR code generation | Generates QR code bitmaps from proof page URLs. Client-side only. QR encodes only the URL; no file data. |

See [IMPLEMENTATION_NOTES.md](IMPLEMENTATION_NOTES.md) for detailed module-level documentation.

### 3.2 Smart Contract (OpenProofRegistry)

The contract is a minimal EVM registry deployed on Base Sepolia. It exposes three functions:

```solidity
function registerProof(bytes32 fileHash) external
function getProof(bytes32 fileHash) external view returns (Proof memory)
function proofExists(bytes32 fileHash) external view returns (bool)
```

Data model:

```solidity
struct Proof {
    address creator;     // wallet that submitted the registration
    uint64 timestamp;    // block timestamp at registration
    bytes32 fileHash;    // the registered fingerprint
}
```

The contract is immutable — no upgradeability, no owner, no access control. It is deployed once per target chain. The deployed bytecode is verified on the chain's block explorer (BaseScan Sepolia for the current deployment), establishing the trust anchor for all proofs registered through that contract address.

### 3.3 Wallet Layer

Wallet connectivity uses RainbowKit and wagmi. The wallet is responsible for:

- Managing private keys (out of OpenProof's scope)
- Rendering transaction parameters for user review
- Signing and broadcasting the `registerProof` transaction

The wallet is the user's trust anchor for key management. OpenProof does not handle private keys, seed phrases, or signing material.

## 4. System Boundaries

### 4.1 What the System Does

- Read file bytes from the local filesystem via the browser File API
- Compute SHA-256 hash of file bytes within the browser
- Register a `bytes32` hash on the target blockchain
- Read back and display onchain proof records
- Generate and validate deterministic local receipt JSON artifacts
- Maintain ephemeral local proof history in browser storage

### 4.2 What the System Does Not Do

- Upload, store, or transmit file bytes beyond the browser
- Require or use a backend server, database, or API
- Store proof data in any centralized index
- Authenticate users, manage accounts, or track sessions
- Implement tokens, fees, staking, or access control
- Collect analytics, telemetry, or user behavior data
- Offer API endpoints for programmatic access
- Recover or reconstruct file content from registered hashes

See [NON_GOALS.md](NON_GOALS.md) for the complete exclusion register.

## 5. External Dependencies

| Dependency | Role | Substitutable |
|------------|------|---------------|
| Target EVM chain (Base Sepolia) | Smart contract execution, data persistence | Yes — any EVM chain |
| Static host (Vercel, self-hosted) | Frontend delivery | Yes — any web server |
| WalletConnect relay (Reown Cloud) | Wallet connection relay | Yes — wagmi supports multiple connectors |
| Public RPC endpoint | Blockchain read access | Yes — any RPC provider or local node |
| Browser Web Crypto API | Native SHA-256 hashing | Not applicable — browser built-in |

No dependency is a hard lock-in. The contract can be redeployed on any EVM chain. The frontend builds to a static export that can be served from any HTTP server, IPFS gateway, or offline medium.

## 6. Architectural Invariants

These invariants are structural. Changing any invariant requires governance review per the [systems doctrine](SYSTEMS_DOCTRINE.md#12-doctrine-amendments) amendment process.

| # | Invariant | Rationale |
|---|-----------|-----------|
| 1 | File bytes never leave the browser | Privacy is the system's primary guarantee |
| 2 | Only `bytes32` hashes cross the network boundary | Contract interface is the data flow constraint |
| 3 | The contract is immutable per deployment | Trust derives from immutability |
| 4 | The frontend is statically served with no server-side logic | Simplifies deployment, eliminates server attack surface |
| 5 | Receipts are local artifacts, not authoritative state | Onchain state is the sole source of truth |
| 6 | Local history is ephemeral and never synchronized | No account system, no backup requirement |
| 7 | Any wallet can register any unregistered hash | Permissionless by design |
| 8 | No token, fee, or access control mechanism exists | Proof-of-existence is not a gated service |
| 9 | Bundle proofs use deterministic, versioned rules | Verification consistency across versions |
| 10 | All hashing uses the browser's native Web Crypto API | Deterministic, auditable, independent of JavaScript libraries |

See [TRUST_MODEL.md](TRUST_MODEL.md) §7 for the corresponding deterministic guarantees and §5 for accepted assumptions.

## 7. Invariant Mapping to Governance Standards

The architectural invariants map to specific standards in the ecosystem governance framework:

| Invariant | Relevant Standard | Section |
|-----------|-------------------|---------|
| I1 — File bytes never leave browser | [public-private-boundary](https://github.com/sparshsam/ecosystem-standards/blob/main/standards/public-private-boundary.md) | Privacy model |
| I3 — Contract immutable per deployment | [security-standard](https://github.com/sparshsam/ecosystem-standards/blob/main/standards/security-standard.md) | Contract deployment |
| I5 — Receipts are not authoritative | [architecture-standard](https://github.com/sparshsam/ecosystem-standards/blob/main/standards/architecture-standard.md) | System boundaries |
| I6 — Local history ephemeral | [security-standard](https://github.com/sparshsam/ecosystem-standards/blob/main/standards/security-standard.md) | Data handling |
| I8 — No token or fee mechanism | [repository-doctrine](https://github.com/sparshsam/ecosystem-standards/blob/main/standards/repository-doctrine.md) | What must never be compromised |
| I10 — Web Crypto API for hashing | [architecture-standard](https://github.com/sparshsam/ecosystem-standards/blob/main/standards/architecture-standard.md) | Security boundaries |

This mapping is for governance traceability. All invariants remain subject to the [systems doctrine](SYSTEMS_DOCTRINE.md#12-doctrine-amendments) amendment process.

## 8. Standards Alignment

This document is written to align with the following ecosystem governance standards:

| Standard | Applicable Requirements | Status |
|----------|------------------------|--------|
| [Architecture Standard](https://github.com/sparshsam/ecosystem-standards/blob/main/standards/architecture-standard.md) | System overview, component diagram, data flow, system boundaries, external dependencies, security boundaries | Compliant |
| [Documentation Standard](https://github.com/sparshsam/ecosystem-standards/blob/main/standards/documentation-standard.md) | Mermaid diagrams with text explanations, documentation structure | Compliant — all diagrams accompanied by prose |
| [Repository Doctrine](https://github.com/sparshsam/ecosystem-standards/blob/main/standards/repository-doctrine.md) | Honest representation, secret safety, tone consistency, long-term stewardship | Compliant |
| [Repo Maturity Model](https://github.com/sparshsam/ecosystem-standards/blob/main/standards/repo-maturity-model.md) | Prototype documentation requirements (README + ARCHITECTURE.md) | Compliant |
| [Security Standard](https://github.com/sparshsam/ecosystem-standards/blob/main/standards/security-standard.md) | .env policy, dependency review, no committed secrets | Compliant — see [security-principles.md](security-principles.md) |
| [DOI/Publication Standard](https://github.com/sparshsam/ecosystem-standards/blob/main/standards/doi-publication-standard.md) | Pre-citation readiness | Compliant — citation metadata exists |
| [Public/Private Boundary](https://github.com/sparshsam/ecosystem-standards/blob/main/standards/public-private-boundary.md) | Full visibility, honest description, privacy model documented | Compliant |

## 9. Operational Architecture

### 9.1 Frontend Deployment

The frontend builds to a static export. Deployment options:

- **Vercel (default).** Zero-config deployment. Environment variables set in Vercel dashboard.
- **Self-hosted.** Build locally with `npm run build`, serve the output directory from any web server.
- **Offline.** The static export can be served from a local machine, USB drive, or air-gapped environment.

### 9.2 Contract Deployment

Contract deployment is a one-time operation per target chain. Deployment steps:

1. Fund deployer wallet with chain-native gas token (test ETH for testnets)
2. Deploy with Hardhat: `npm run deploy:base-sepolia`
3. Verify source code on BlockScout/BaseScan
4. Record deployment transaction hash, deployer address, block number
5. Distribute contract address through the repository README and static documentation

### 9.3 Multi-Instance Consideration

Multiple independent OpenProof deployments can coexist on different chains or the same chain with different contract addresses. Each deployment has its own:

- Contract address (trust anchor)
- Frontend deployment (canonical or custom)
- Receipt artifacts (bound to their contract address)

Cross-deployment proof verification is not supported and is not a goal.

## 10. Portability

The system is designed for deployment portability:

- **Chain portability.** The contract targets standard EVM. No chain-specific opcodes, precompiles, or infrastructure beyond standard EVM execution exist.
- **Frontend portability.** The build output is a directory of static files. No server runtime, database connection, or platform-specific build step is required.
- **Receipt portability.** Receipt JSON artifacts are self-describing (schema version, chain ID, contract address). A receipt can be verified against any deployment of the registry contract by any compatible frontend instance.

## 11. Scalability Characteristics

OpenProof is not designed for high throughput. Each proof registration requires:

- One wallet transaction (gas cost varies by network)
- One contract storage write (~22,000 gas for a cold slot)
- One onchain event emission

The contract does not batch, aggregate, or optimize registrations. Per-proof gas costs are linear. The system's scalability is bounded by the underlying chain's throughput.

Read operations (verification, proof page loads) are stateless and bounded by RPC availability. Event lookups use bounded chunked scanning with a configurable lookback window (default: 50,000 blocks).

## 12. Versioning

| Component | Version source | Stability |
|-----------|---------------|-----------|
| Contract | Immutable per deployment address | No versioning mechanism; redeployment = new address |
| Frontend | `package.json` version, git tags | Semantic versioning per releases |
| Receipt schema | `schemaVersion`, `receiptVersion` fields | Backward-compatible within major schema version |
| Bundle rules | `bundleRuleVersion` field | Versioned independently; forward changes increment version |

See [receipt-schema.md](receipt-schema.md) for schema versioning semantics.

## 13. Diagram Index

- [Trust boundary diagram](TRUST_MODEL.md) — trust zones, trust relationships, cross-component trust summary
- [Verification sequence diagram](VERIFICATION_LIFECYCLE.md) — proof registration and verification flows
- [Data flow diagram](DATA_FLOW.md) — file-to-hash-to-receipt data transformation
- [Failure state diagram](FAILURE_MODES.md) — error states, recovery paths, edge cases
