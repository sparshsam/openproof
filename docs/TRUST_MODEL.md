# OpenProof Trust Model

**Classification:** Permanent trust documentation
**Scope:** OpenProof, all deployments and forks
**Authority:** Ecosystem governance standards — [ecosystem-standards](https://github.com/sparshsam/ecosystem-standards)
**Status:** Adopted — see docs/SYSTEMS_DOCTRINE.md §0 for freeze classification

---

## 1. What Trust Means in This System

Trust in OpenProof refers to the set of assumptions a user must accept for a proof to be meaningful. A system that requires no trust would be one where every operation is independently verifiable by any party using only publicly available information and standard tools.

OpenProof minimizes trust by distributing verification power to the user. The only component that must be trusted for a proof to be meaningful is the smart contract — and that trust derives from the blockchain's consensus mechanism and the contract's immutability, not from any human administrator or centralized service.

## 2. Trust Distribution

```
┌──────────────────────────────────────────────────────────────────┐
│                       TRUSTED ZONE                                │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Smart Contract (OpenProofRegistry)                       │   │
│  │  Trust: Full                                              │   │
│  │  Basis: Immutable, open-source, onchain-verified bytecode │   │
│  │  Derivation: Source audit → bytecode verification →       │   │
│  │              deterministic execution → immutable storage   │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  User's Wallet                                            │   │
│  │  Trust: Full (key management scope)                       │   │
│  │  Basis: User controls private keys                        │   │
│  │  Scope: Key security is outside OpenProof's control       │   │
│  └──────────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│                      UNTRUSTED ZONE                               │
│                                                                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────┐   │
│  │ Frontend │  │ Hosting  │  │ RPC      │  │ Receipt JSON │   │
│  │ (UI +    │  │ (Vercel, │  │ Provider │  │ (local       │   │
│  │  hashing)│  │  self)   │  │ (reads)  │  │  artifact)   │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────────┘   │
│                                                                  │
│  Trust: None required for proof integrity                        │
│  Each component is independently replaceable or verifiable       │
└──────────────────────────────────────────────────────────────────┘
```

The trusted zone is minimal: two components. Everything else is convenience infrastructure that is independently verifiable or replaceable with standard tools.

## 3. Where Trust Enters the System

Trust enters the system at exactly three points. Each is bounded and documented.

### 3.1 Contract Trust Entry

| Property | Value |
|----------|-------|
| **Entry point** | Contract deployment and bytecode verification |
| **What must be trusted** | That the deployed bytecode matches the open-source source code at a known commit |
| **Trust anchor** | The contract address, verified on BaseScan Sepolia |
| **Trust duration** | Permanent (contract is immutable) |
| **Verification method** | BaseScan source code verification; any party can re-verify |

The contract address is the root of trust for the entire system. If the deployed bytecode does not match the published source, all proofs registered through that address are compromised. This trust entry is established once at deployment and does not change over time.

### 3.2 Wallet Trust Entry

| Property | Value |
|----------|-------|
| **Entry point** | User's private key management |
| **What must be trusted** | That the wallet securely manages the private key |
| **Trust anchor** | The user's wallet (browser extension, mobile wallet, hardware wallet) |
| **Trust duration** | Per-session (key security is user-managed) |
| **Verification method** | None within OpenProof; user relies on wallet security guarantees |

The wallet is the user's personal trust anchor. OpenProof does not handle private keys, seed phrases, or signing material. Wallet security is outside OpenProof's scope and is the user's responsibility.

### 3.3 Chain Consensus Trust Entry

| Property | Value |
|----------|-------|
| **Entry point** | Blockchain consensus and finality |
| **What must be trusted** | That the chain correctly executes the contract and finalizes state |
| **Trust anchor** | Base Sepolia consensus mechanism |
| **Trust duration** | Permanent (state is persistent) |
| **Verification method** | Independent node, multiple RPC cross-verification |

The user trusts that the blockchain will not undergo a deep reorganization that removes the registration transaction. For Base Sepolia (testnet), this risk is minimal beyond one epoch. For future mainnet deployments, finality guarantees are stronger but reorg risk is never zero.

## 4. Where Trust Leaves the System

Trust leaves the system at specific boundaries where guarantees cannot be independently verified.

### 4.1 Frontend Trust Exit

| Property | Value |
|----------|-------|
| **Exit point** | JavaScript execution in the user's browser |
| **What cannot be trusted** | That the frontend serves and executes the correct code |
| **Why trust exits** | The frontend is delivered by a third party (Vercel) and executed in an environment the user does not control |
| **Impact** | A compromised frontend can display false hashes, false verification results, or exfiltrate data |
| **Recovery** | Independent verification using `sha256sum` and a block explorer eliminates frontend trust |

The frontend is explicitly not trusted. Every operation it performs — hashing, verification, receipt construction — can be replaced by standard tools. See [DATA_FLOW.md](DATA_FLOW.md) §2.1 for the file-byte path (bytes never leave the browser) and §4 for the network data audit (only `bytes32` hashes cross the network). A compromised frontend cannot forge onchain proofs because registration requires a wallet-signed transaction.

### 4.2 Hosting Trust Exit

| Property | Value |
|----------|-------|
| **Exit point** | Static file delivery from hosting provider |
| **What cannot be trusted** | That the hosting provider serves the authentic build artifact |
| **Why trust exits** | The hosting provider (Vercel) controls the build pipeline and serving infrastructure |
| **Impact** | A compromised host can serve modified JavaScript to all users |
| **Recovery** | Self-hosting with build digest verification |

### 4.3 RPC Trust Exit

| Property | Value |
|----------|-------|
| **Exit point** | Blockchain read path through RPC provider |
| **What cannot be trusted** | That the RPC provider returns accurate data |
| **Why trust exits** | A malicious RPC can return false `getProof` responses |
| **Impact** | False negatives (proof appears not to exist) or false positives (proof appears to exist when it does not) |
| **Recovery** | Cross-verify with multiple RPC providers or run a personal node |

The RPC provider has no influence on the write path. A signed transaction is valid regardless of which RPC node relays it. See [DATA_FLOW.md](DATA_FLOW.md) §4 for the network data size and frequency audit.

### 4.4 Receipt Trust Exit

| Property | Value |
|----------|-------|
| **Exit point** | Local receipt JSON artifact |
| **What cannot be trusted** | That a receipt alone constitutes proof |
| **Why trust exits** | Receipts are locally generated artifacts with no onchain self-authentication |
| **Impact** | A forged receipt with valid JSON structure and a non-existent hash looks superficially valid |
| **Recovery** | Onchain match is required; receipt alone is never sufficient |

## 5. Assumptions Accepted

The following assumptions are intentionally accepted as part of the system design.

| # | Assumption | Rationale | Risk if violated |
|---|-----------|-----------|-----------------|
| A1 | SHA-256 is collision-resistant | Foundation of all proof integrity | Two files produce identical hash; proof is ambiguous |
| A2 | The browser's Web Crypto API is correctly implemented | Native browser implementation, not JavaScript library | Hash mismatch between browser and standard tools |
| A3 | The blockchain's consensus mechanism is sound | Standard L2 security model | Chain reorg removes proof; chain fork splits state |
| A4 | The user's wallet software is secure | Standard assumption for all dapps | Private key theft enables false proof registration under the user's address |
| A5 | The user will maintain custody of the original file | OpenProof does not store files | Proof becomes unverifiable (no file to re-hash) |
| A6 | The user can identify the correct contract address | Trust anchor for the system | User interacts with a fraudulent deployment |
| A7 | Block timestamps are monotonically increasing | Block timestamp is part of the proof record | Timestamps could theoretically be manipulated within the block production window |
| A8 | The user's browser environment is free from malicious extensions | Extensions can modify page behavior | Malicious extension could alter hashing or exfiltrate data |

## 6. Assumptions Intentionally Rejected

The following assumptions are intentionally not accepted. The system is designed to function correctly without them.

| # | Rejected Assumption | Why Rejected | Alternative |
|---|--------------------|-------------|-------------|
| R1 | The user trusts the frontend | Frontend is convenience only, independently verifiable | `sha256sum` + block explorer |
| R2 | The user trusts the hosting provider | Static builds can be self-hosted or build-digest verified | Self-hosted deployment |
| R3 | The user trusts a single RPC provider | Multiple RPC endpoints and block explorers exist for cross-verification | Run personal node or use multiple RPC endpoints |
| R4 | The user trusts the receipt as authoritative | Onchain state is the only authoritative source | Verify receipt hash against contract |
| R5 | The system requires a backend or database | Everything runs client-side with onchain persistence | Static frontend + smart contract |
| R6 | The system requires user authentication | Proof registration is permissionless by design | Any wallet can register any unregistered hash |
| R7 | The system requires centralized coordination | No deployer control, no admin, no DAO | Immutable contract, permissionless usage |
| R8 | The system requires a specific hosting platform | Static export can be served from anywhere | Any HTTP server or offline medium |

## 7. Deterministic Guarantees

These guarantees are absolute — they hold for any deployment, any browser, any tool that implements the same algorithms.

| # | Guarantee | Scope | Verification |
|---|-----------|-------|-------------|
| G1 | SHA-256(file bytes) always produces the same output for the same file bytes | Mathematical property of SHA-256 | Run `sha256sum` on the same file |
| G2 | Bundle hash produces the same output for the same file set under the same bundle rule | Deterministic construction rules | Reconstruct bundle hash manually from receipt |
| G3 | `getProof(hash)` returns the same record for the same hash, or reverts | Deterministic contract execution | Query from any RPC or block explorer |
| G4 | `proofExists(hash)` returns the same boolean for the same hash | Deterministic contract execution | Query from any RPC or block explorer |
| G5 | A registered proof will never be deleted or altered | Immutable contract storage | No `delete` or overwrite code path exists |
| G6 | Receipt validation produces the same result for the same JSON input | Deterministic validation rules | Run `validateProofReceipt` on the same JSON |
| G7 | The receipt schema is backward-compatible within the same major version | Schema versioning policy | New fields are optional with documented defaults |

## 8. Non-Deterministic Guarantees (Intentional)

These are effects that the system does not guarantee, by design.

| # | Non-Guarantee | Reason | What Is Guaranteed Instead |
|---|---------------|--------|---------------------------|
| N1 | The system does not guarantee file authorship | Proof of existence ≠ proof of authorship | The wallet that submitted the registration is recorded |
| N2 | The system does not guarantee file ownership | Anyone with file bytes can compute the hash | Only the hash-onchain link is established |
| N3 | The system does not guarantee content truth | Hash integrity does not validate content | The content's hash matches at registration and verification times |
| N4 | The system does not guarantee registrant identity | Wallet keys can be shared or stolen | A wallet address registered the proof at a time |
| N5 | The system does not guarantee timestamp precision beyond block time | Block timestamps are not precise to the second | The block timestamp is the consensus time of inclusion |
| N6 | The system does not guarantee cross-chain proof portability | Each deployment has its own contract | A receipt carries chain ID and contract address for targeted verification |
| N7 | The system does not guarantee offline verification without the original file | Verification requires re-hashing the exact file bytes | Receipt records the hash but cannot reproduce the file |
| N8 | The system does not guarantee privacy of registered hashes | Hashes are public onchain | Only the hash (not the file) is public; known-file attacks are a disclosure risk |

## 9. Guarantees Intentionally Not Provided

These are guarantees that a user might expect but that OpenProof intentionally does not provide.

### 9.1 Notary or Legal Validity

OpenProof does not provide notarization, legal timestamps, or certification. The system establishes a cryptographic link between a hash, a wallet address, and a block time. Establishing legal significance requires additional attestation mechanisms outside OpenProof's scope.

### 9.2 Service Availability

OpenProof does not provide an SLA, uptime guarantee, or service availability commitment. The frontend is a static application; the blockchain runs independently. If the frontend host is down, users can verify proofs through block explorers. If the blockchain is down, no operations are possible on that chain.

### 9.3 Data Recovery

OpenProof cannot recover the original file from a registered hash. SHA-256 is a one-way function. If the user loses the original file, the proof becomes unverifiable. The receipt records file metadata (name, size, type) but does not contain content bytes.

### 9.4 Privacy of Registration Activity

The blockchain is public. Anyone can enumerate registered hashes by scanning the contract's event logs or storage. The wallet address, hash, and timestamp of every registration are permanently public. OpenProof does not provide stealth or private registration mechanisms.

### 9.5 Future Compatibility

A future version of OpenProof with a different contract address, receipt schema, or bundle rule may not be backward-compatible with proofs registered under the current version. Versioned fields in receipts (schema version, bundle rule version) mitigate this, but forward compatibility is not guaranteed across major protocol changes.

## 10. Trust Boundary Diagram

```
                    ┌─────────────────────────────────────────┐
                    │            FULL TRUST                    │
                    │                                          │
                    │  ┌─────────────────────────────────┐    │
                    │  │  Smart Contract                   │    │
                    │  │  • Immutable bytecode             │    │
                    │  │  • Verified on BaseScan           │    │
                    │  │  • Deterministic execution        │    │
                    │  │  • No upgrade, no admin           │    │
                    │  │  • Permissionless registration    │    │
                    │  └─────────────────────────────────┘    │
                    │                                          │
                    │  ┌─────────────────────────────────┐    │
                    │  │  User's Wallet                    │    │
                    │  │  • Key management (user scope)    │    │
                    │  │  • Transaction signing            │    │
                    │  │  • Transaction rendering          │    │
                    │  └─────────────────────────────────┘    │
                    └─────────────────────────────────────────┘

                    ┌─────────────────────────────────────────┐
                    │           NO TRUST REQUIRED              │
                    │                                          │
                    │  Frontend (hashing + UI)                  │
                    │  Hosting (Vercel or self-hosted)          │
                    │  RPC Provider (read path)                │
                    │  Receipt JSON (local artifact)            │
                    │  Local storage (ephemeral history)        │
                    │                                          │
                    │  All independently replaceable or         │
                    │  verifiable with standard tools           │
                    └─────────────────────────────────────────┘
```

The boundary between the trusted and untrusted zones is defined by two criteria:
1. **Immutability.** The component's behavior is fixed and cannot change after user interaction begins.
2. **Independently verifiable.** The component's output can be reproduced by the user using tools the user controls.

The smart contract passes both criteria. The frontend fails both. The wallet passes the immutability criterion (the wallet's signing behavior is fixed) but is independently verifiable only by the user who controls its private key.

## 11. Trust Expansion Rules

Trust boundaries change only under specific conditions. No trust boundary expansion — adding a component that requires trust — is permitted without governance review.

### 11.1 Permitted Changes

| Change | Impact on Trust | Required Action |
|--------|----------------|-----------------|
| New contract deployment on a different chain | Trust anchor moves to new address | Publish new address from trusted source |
| Receipt schema version increment | No change to onchain trust | Document structural changes |
| Hosting provider migration | Hosting trust shifts to new provider | Self-hosted users manage own trust |
| Wallet connector change (e.g., RainbowKit to alternative) | Wallet trust interface changes | Core assumption (user controls keys) unchanged |

### 11.2 Prohibited Changes Without Governance Review

- Adding a backend server that processes file data
- Adding an API endpoint for proof registration or verification
- Adding analytics, telemetry, or monitoring infrastructure
- Adding a database or cache layer that becomes authoritative
- Adding any component that the user must trust for proof integrity
- Adding token-gated, fee-based, or access-controlled registration

## 12. Trust Minimization

Trust is minimized through the following structural decisions:

| Decision | Trust Minimized |
|----------|----------------|
| Client-side hashing | File bytes never leave user control |
| Web Crypto API (native, not JS library) | Hashing implementation is browser-provided |
| No backend | No server-side component can modify behavior or exfiltrate data |
| Immutable contract | No administrator can alter proof records |
| No proxy/upgradeability | Contract behavior is fixed forever |
| Permissionless registration | No gatekeeper can deny or censor registrations |
| Static frontend export | No server-side execution or state |
| Receipt as local artifact | No receipt server, index, or registry |
| Bounded event lookup | No unbounded queries or data aggregation |
| No analytics/tracking | No surveillance of user behavior |

## 13. Cross-Component Trust Summary

| From → To | Trust Required | Basis | Mitigation if Trust Violated |
|-----------|---------------|-------|------------------------------|
| User → Contract | Full | Immutable, open-source, onchain-verified | Contract can be re-verified; proofs are inspectable |
| User → Frontend | None | Independently reproducible | Use `sha256sum` + block explorer |
| User → Wallet | Full (key management) | Outside OpenProof scope | Use hardware wallet; practice key hygiene |
| User → Hosting | None for verification | Self-host or cross-verify | Verify build digest; use trusted deployment |
| User → RPC | None | Cross-verify with multiple providers | Use personal node for critical verification |
| Contract → External | None | Self-contained, no oracles | Contract calls nothing external |
| Contract → User | None | User obtains data through any channel | Onchain data is public by design |
| Wallet → Contract | Per-transaction | User-reviewed signing | Wallet renders full transaction parameters |
| Receipt → Onchain state | Receipt is not authoritative | Must match onchain record | Always verify against contract |
| Frontend → Contract | Read-only writes | User signs each transaction | Wallet gates all write operations |
# OpenProof Trust Model

**Classification:** Permanent trust documentation
**Scope:** OpenProof, all deployments and forks
**Authority:** Ecosystem governance standards — [ecosystem-standards](https://github.com/sparshsam/ecosystem-standards)
**Status:** Ratified — do not amend without governance review

---

## 1. What Trust Means in This System

Trust in OpenProof refers to the set of assumptions a user must accept for a proof to be meaningful. A system that requires no trust would be one where every operation is independently verifiable by any party using only publicly available information and standard tools.

OpenProof minimizes trust by distributing verification power to the user. The only component that must be trusted for a proof to be meaningful is the smart contract — and that trust derives from the blockchain's consensus mechanism and the contract's immutability, not from any human administrator or centralized service.

## 2. Trust Distribution

```
┌──────────────────────────────────────────────────────────────────┐
│                       TRUSTED ZONE                                │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Smart Contract (OpenProofRegistry)                       │   │
│  │  Trust: Full                                              │   │
│  │  Basis: Immutable, open-source, onchain-verified bytecode │   │
│  │  Derivation: Source audit → bytecode verification →       │   │
│  │              deterministic execution → immutable storage   │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  User's Wallet                                            │   │
│  │  Trust: Full (key management scope)                       │   │
│  │  Basis: User controls private keys                        │   │
│  │  Scope: Key security is outside OpenProof's control       │   │
│  └──────────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│                      UNTRUSTED ZONE                               │
│                                                                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────┐   │
│  │ Frontend │  │ Hosting  │  │ RPC      │  │ Receipt JSON │   │
│  │ (UI +    │  │ (Vercel, │  │ Provider │  │ (local       │   │
│  │  hashing)│  │  self)   │  │ (reads)  │  │  artifact)   │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────────┘   │
│                                                                  │
│  Trust: None required for proof integrity                        │
│  Each component is independently replaceable or verifiable       │
└──────────────────────────────────────────────────────────────────┘
```

The trusted zone is minimal: two components. Everything else is convenience infrastructure that is independently verifiable or replaceable with standard tools.

## 3. Where Trust Enters the System

Trust enters the system at exactly three points. Each is bounded and documented.

### 3.1 Contract Trust Entry

| Property | Value |
|----------|-------|
| **Entry point** | Contract deployment and bytecode verification |
| **What must be trusted** | That the deployed bytecode matches the open-source source code at a known commit |
| **Trust anchor** | The contract address, verified on BaseScan Sepolia |
| **Trust duration** | Permanent (contract is immutable) |
| **Verification method** | BaseScan source code verification; any party can re-verify |

The contract address is the root of trust for the entire system. If the deployed bytecode does not match the published source, all proofs registered through that address are compromised. This trust entry is established once at deployment and does not change over time.

### 3.2 Wallet Trust Entry

| Property | Value |
|----------|-------|
| **Entry point** | User's private key management |
| **What must be trusted** | That the wallet securely manages the private key |
| **Trust anchor** | The user's wallet (browser extension, mobile wallet, hardware wallet) |
| **Trust duration** | Per-session (key security is user-managed) |
| **Verification method** | None within OpenProof; user relies on wallet security guarantees |

The wallet is the user's personal trust anchor. OpenProof does not handle private keys, seed phrases, or signing material. Wallet security is outside OpenProof's scope and is the user's responsibility.

### 3.3 Chain Consensus Trust Entry

| Property | Value |
|----------|-------|
| **Entry point** | Blockchain consensus and finality |
| **What must be trusted** | That the chain correctly executes the contract and finalizes state |
| **Trust anchor** | Base Sepolia consensus mechanism |
| **Trust duration** | Permanent (state is persistent) |
| **Verification method** | Independent node, multiple RPC cross-verification |

The user trusts that the blockchain will not undergo a deep reorganization that removes the registration transaction. For Base Sepolia (testnet), this risk is minimal beyond one epoch. For future mainnet deployments, finality guarantees are stronger but reorg risk is never zero.

## 4. Where Trust Leaves the System

Trust leaves the system at specific boundaries where guarantees cannot be independently verified.

### 4.1 Frontend Trust Exit

| Property | Value |
|----------|-------|
| **Exit point** | JavaScript execution in the user's browser |
| **What cannot be trusted** | That the frontend serves and executes the correct code |
| **Why trust exits** | The frontend is delivered by a third party (Vercel) and executed in an environment the user does not control |
| **Impact** | A compromised frontend can display false hashes, false verification results, or exfiltrate data |
| **Recovery** | Independent verification using `sha256sum` and a block explorer eliminates frontend trust |

The frontend is explicitly not trusted. Every operation it performs — hashing, verification, receipt construction — can be replaced by standard tools. See [DATA_FLOW.md](DATA_FLOW.md) §2.1 for the file-byte path (bytes never leave the browser) and §4 for the network data audit (only `bytes32` hashes cross the network). A compromised frontend cannot forge onchain proofs because registration requires a wallet-signed transaction.

### 4.2 Hosting Trust Exit

| Property | Value |
|----------|-------|
| **Exit point** | Static file delivery from hosting provider |
| **What cannot be trusted** | That the hosting provider serves the authentic build artifact |
| **Why trust exits** | The hosting provider (Vercel) controls the build pipeline and serving infrastructure |
| **Impact** | A compromised host can serve modified JavaScript to all users |
| **Recovery** | Self-hosting with build digest verification |

### 4.3 RPC Trust Exit

| Property | Value |
|----------|-------|
| **Exit point** | Blockchain read path through RPC provider |
| **What cannot be trusted** | That the RPC provider returns accurate data |
| **Why trust exits** | A malicious RPC can return false `getProof` responses |
| **Impact** | False negatives (proof appears not to exist) or false positives (proof appears to exist when it does not) |
| **Recovery** | Cross-verify with multiple RPC providers or run a personal node |

The RPC provider has no influence on the write path. A signed transaction is valid regardless of which RPC node relays it. See [DATA_FLOW.md](DATA_FLOW.md) §4 for the network data size and frequency audit.

### 4.4 Receipt Trust Exit

| Property | Value |
|----------|-------|
| **Exit point** | Local receipt JSON artifact |
| **What cannot be trusted** | That a receipt alone constitutes proof |
| **Why trust exits** | Receipts are locally generated artifacts with no onchain self-authentication |
| **Impact** | A forged receipt with valid JSON structure and a non-existent hash looks superficially valid |
| **Recovery** | Onchain match is required; receipt alone is never sufficient |

## 5. Assumptions Accepted

The following assumptions are intentionally accepted as part of the system design.

| # | Assumption | Rationale | Risk if violated |
|---|-----------|-----------|-----------------|
| A1 | SHA-256 is collision-resistant | Foundation of all proof integrity | Two files produce identical hash; proof is ambiguous |
| A2 | The browser's Web Crypto API is correctly implemented | Native browser implementation, not JavaScript library | Hash mismatch between browser and standard tools |
| A3 | The blockchain's consensus mechanism is sound | Standard L2 security model | Chain reorg removes proof; chain fork splits state |
| A4 | The user's wallet software is secure | Standard assumption for all dapps | Private key theft enables false proof registration under the user's address |
| A5 | The user will maintain custody of the original file | OpenProof does not store files | Proof becomes unverifiable (no file to re-hash) |
| A6 | The user can identify the correct contract address | Trust anchor for the system | User interacts with a fraudulent deployment |
| A7 | Block timestamps are monotonically increasing | Block timestamp is part of the proof record | Timestamps could theoretically be manipulated within the block production window |
| A8 | The user's browser environment is free from malicious extensions | Extensions can modify page behavior | Malicious extension could alter hashing or exfiltrate data |

## 6. Assumptions Intentionally Rejected

The following assumptions are intentionally not accepted. The system is designed to function correctly without them.

| # | Rejected Assumption | Why Rejected | Alternative |
|---|--------------------|-------------|-------------|
| R1 | The user trusts the frontend | Frontend is convenience only, independently verifiable | `sha256sum` + block explorer |
| R2 | The user trusts the hosting provider | Static builds can be self-hosted or build-digest verified | Self-hosted deployment |
| R3 | The user trusts a single RPC provider | Multiple RPC endpoints and block explorers exist for cross-verification | Run personal node or use multiple RPC endpoints |
| R4 | The user trusts the receipt as authoritative | Onchain state is the only authoritative source | Verify receipt hash against contract |
| R5 | The system requires a backend or database | Everything runs client-side with onchain persistence | Static frontend + smart contract |
| R6 | The system requires user authentication | Proof registration is permissionless by design | Any wallet can register any unregistered hash |
| R7 | The system requires centralized coordination | No deployer control, no admin, no DAO | Immutable contract, permissionless usage |
| R8 | The system requires a specific hosting platform | Static export can be served from anywhere | Any HTTP server or offline medium |

## 7. Deterministic Guarantees

These guarantees are absolute — they hold for any deployment, any browser, any tool that implements the same algorithms.

| # | Guarantee | Scope | Verification |
|---|-----------|-------|-------------|
| G1 | SHA-256(file bytes) always produces the same output for the same file bytes | Mathematical property of SHA-256 | Run `sha256sum` on the same file |
| G2 | Bundle hash produces the same output for the same file set under the same bundle rule | Deterministic construction rules | Reconstruct bundle hash manually from receipt |
| G3 | `getProof(hash)` returns the same record for the same hash, or reverts | Deterministic contract execution | Query from any RPC or block explorer |
| G4 | `proofExists(hash)` returns the same boolean for the same hash | Deterministic contract execution | Query from any RPC or block explorer |
| G5 | A registered proof will never be deleted or altered | Immutable contract storage | No `delete` or overwrite code path exists |
| G6 | Receipt validation produces the same result for the same JSON input | Deterministic validation rules | Run `validateProofReceipt` on the same JSON |
| G7 | The receipt schema is backward-compatible within the same major version | Schema versioning policy | New fields are optional with documented defaults |

## 8. Non-Deterministic Guarantees (Intentional)

These are effects that the system does not guarantee, by design.

| # | Non-Guarantee | Reason | What Is Guaranteed Instead |
|---|---------------|--------|---------------------------|
| N1 | The system does not guarantee file authorship | Proof of existence ≠ proof of authorship | The wallet that submitted the registration is recorded |
| N2 | The system does not guarantee file ownership | Anyone with file bytes can compute the hash | Only the hash-onchain link is established |
| N3 | The system does not guarantee content truth | Hash integrity does not validate content | The content's hash matches at registration and verification times |
| N4 | The system does not guarantee registrant identity | Wallet keys can be shared or stolen | A wallet address registered the proof at a time |
| N5 | The system does not guarantee timestamp precision beyond block time | Block timestamps are not precise to the second | The block timestamp is the consensus time of inclusion |
| N6 | The system does not guarantee cross-chain proof portability | Each deployment has its own contract | A receipt carries chain ID and contract address for targeted verification |
| N7 | The system does not guarantee offline verification without the original file | Verification requires re-hashing the exact file bytes | Receipt records the hash but cannot reproduce the file |
| N8 | The system does not guarantee privacy of registered hashes | Hashes are public onchain | Only the hash (not the file) is public; known-file attacks are a disclosure risk |

## 9. Guarantees Intentionally Not Provided

These are guarantees that a user might expect but that OpenProof intentionally does not provide.

### 9.1 Notary or Legal Validity

OpenProof does not provide notarization, legal timestamps, or certification. The system establishes a cryptographic link between a hash, a wallet address, and a block time. Establishing legal significance requires additional attestation mechanisms outside OpenProof's scope.

### 9.2 Service Availability

OpenProof does not provide an SLA, uptime guarantee, or service availability commitment. The frontend is a static application; the blockchain runs independently. If the frontend host is down, users can verify proofs through block explorers. If the blockchain is down, no operations are possible on that chain.

### 9.3 Data Recovery

OpenProof cannot recover the original file from a registered hash. SHA-256 is a one-way function. If the user loses the original file, the proof becomes unverifiable. The receipt records file metadata (name, size, type) but does not contain content bytes.

### 9.4 Privacy of Registration Activity

The blockchain is public. Anyone can enumerate registered hashes by scanning the contract's event logs or storage. The wallet address, hash, and timestamp of every registration are permanently public. OpenProof does not provide stealth or private registration mechanisms.

### 9.5 Future Compatibility

A future version of OpenProof with a different contract address, receipt schema, or bundle rule may not be backward-compatible with proofs registered under the current version. Versioned fields in receipts (schema version, bundle rule version) mitigate this, but forward compatibility is not guaranteed across major protocol changes.

## 10. Trust Boundary Diagram

```
                    ┌─────────────────────────────────────────┐
                    │            FULL TRUST                    │
                    │                                          │
                    │  ┌─────────────────────────────────┐    │
                    │  │  Smart Contract                   │    │
                    │  │  • Immutable bytecode             │    │
                    │  │  • Verified on BaseScan           │    │
                    │  │  • Deterministic execution        │    │
                    │  │  • No upgrade, no admin           │    │
                    │  │  • Permissionless registration    │    │
                    │  └─────────────────────────────────┘    │
                    │                                          │
                    │  ┌─────────────────────────────────┐    │
                    │  │  User's Wallet                    │    │
                    │  │  • Key management (user scope)    │    │
                    │  │  • Transaction signing            │    │
                    │  │  • Transaction rendering          │    │
                    │  └─────────────────────────────────┘    │
                    └─────────────────────────────────────────┘

                    ┌─────────────────────────────────────────┐
                    │           NO TRUST REQUIRED              │
                    │                                          │
                    │  Frontend (hashing + UI)                  │
                    │  Hosting (Vercel or self-hosted)          │
                    │  RPC Provider (read path)                │
                    │  Receipt JSON (local artifact)            │
                    │  Local storage (ephemeral history)        │
                    │                                          │
                    │  All independently replaceable or         │
                    │  verifiable with standard tools           │
                    └─────────────────────────────────────────┘
```

The boundary between the trusted and untrusted zones is defined by two criteria:
1. **Immutability.** The component's behavior is fixed and cannot change after user interaction begins.
2. **Independently verifiable.** The component's output can be reproduced by the user using tools the user controls.

The smart contract passes both criteria. The frontend fails both. The wallet passes the immutability criterion (the wallet's signing behavior is fixed) but is independently verifiable only by the user who controls its private key.

## 11. Trust Expansion Rules

Trust boundaries change only under specific conditions. No trust boundary expansion — adding a component that requires trust — is permitted without governance review.

### 11.1 Permitted Changes

| Change | Impact on Trust | Required Action |
|--------|----------------|-----------------|
| New contract deployment on a different chain | Trust anchor moves to new address | Publish new address from trusted source |
| Receipt schema version increment | No change to onchain trust | Document structural changes |
| Hosting provider migration | Hosting trust shifts to new provider | Self-hosted users manage own trust |
| Wallet connector change (e.g., RainbowKit to alternative) | Wallet trust interface changes | Core assumption (user controls keys) unchanged |

### 11.2 Prohibited Changes Without Governance Review

- Adding a backend server that processes file data
- Adding an API endpoint for proof registration or verification
- Adding analytics, telemetry, or monitoring infrastructure
- Adding a database or cache layer that becomes authoritative
- Adding any component that the user must trust for proof integrity
- Adding token-gated, fee-based, or access-controlled registration

## 12. Trust Minimization

Trust is minimized through the following structural decisions:

| Decision | Trust Minimized |
|----------|----------------|
| Client-side hashing | File bytes never leave user control |
| Web Crypto API (native, not JS library) | Hashing implementation is browser-provided |
| No backend | No server-side component can modify behavior or exfiltrate data |
| Immutable contract | No administrator can alter proof records |
| No proxy/upgradeability | Contract behavior is fixed forever |
| Permissionless registration | No gatekeeper can deny or censor registrations |
| Static frontend export | No server-side execution or state |
| Receipt as local artifact | No receipt server, index, or registry |
| Bounded event lookup | No unbounded queries or data aggregation |
| No analytics/tracking | No surveillance of user behavior |

## 13. Cross-Component Trust Summary

| From → To | Trust Required | Basis | Mitigation if Trust Violated |
|-----------|---------------|-------|------------------------------|
| User → Contract | Full | Immutable, open-source, onchain-verified | Contract can be re-verified; proofs are inspectable |
| User → Frontend | None | Independently reproducible | Use `sha256sum` + block explorer |
| User → Wallet | Full (key management) | Outside OpenProof scope | Use hardware wallet; practice key hygiene |
| User → Hosting | None for verification | Self-host or cross-verify | Verify build digest; use trusted deployment |
| User → RPC | None | Cross-verify with multiple providers | Use personal node for critical verification |
| Contract → External | None | Self-contained, no oracles | Contract calls nothing external |
| Contract → User | None | User obtains data through any channel | Onchain data is public by design |
| Wallet → Contract | Per-transaction | User-reviewed signing | Wallet renders full transaction parameters |
| Receipt → Onchain state | Receipt is not authoritative | Must match onchain record | Always verify against contract |
| Frontend → Contract | Read-only writes | User signs each transaction | Wallet gates all write operations |
