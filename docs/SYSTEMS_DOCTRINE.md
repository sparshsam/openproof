# OpenProof Systems Doctrine

**Document ID:** OP-DOCTRINE-SD-001
**Classification:** Permanent architectural doctrine
**Hierarchy:** Level 1 — root doctrine
**Scope:** OpenProof, all deployments and forks
**Authority:** Ecosystem governance standards — [ecosystem-standards](https://github.com/sparshsam/ecosystem-standards)
**Freeze level:** Frozen — sections 1–11 are permanently frozen. Section 12 is controlled.
**Status:** Ratified

**Previous versions:** None (original)
**Supersedes:** None
**Depends on:** [ecosystem-standards](https://github.com/sparshsam/ecosystem-standards) (external governance authority)

---

## 0. Governance

### 0.1 Document Purpose

This governance section defines how this document relates to other doctrine documents, how it is amended, what freeze level applies, and how precedence is resolved.

### 0.2 Hierarchy Position

SYSTEMS_DOCTRINE.md is the root document in the OpenProof doctrine hierarchy:

```
Level 0: Ecosystem Governance Standards (external authority)
Level 1: SYSTEMS_DOCTRINE.md (identity, scope, core functions)
Level 2: NON_GOALS.md — DESIGN_RESTRAINTS.md — TRUST_BOUNDARIES.md (peer doctrines)
Level 3: ARCHITECTURAL_INVARIANTS.md (enforceable rules derived from all higher levels)
```

All lower-level doctrine derives from this document. An amendment to sections 3 (Architectural Boundary), 6 (Implementation Principles), or 11 (Scope Boundary) requires corresponding amendments to dependent documents.

### 0.3 Relationship to Ecosystem Standards

This document extends ecosystem governance standards into OpenProof-specific operational boundaries. It does not replace or override ecosystem standards. In case of conflict, ecosystem standards take precedence.

The following ecosystem standards apply directly to OpenProof:

| Ecosystem Standard | OpenProof Codification |
|---|---|
| Restrained infrastructure design | §6 Implementation Principles, ARCHITECTURAL_INVARIANTS (Deployment, Dependency domains) |
| Local-first systems | §4 Frontend Role, §9 Minimal Dependencies |
| Deterministic behavior | §6.4 Deterministic receipts, §7 What the System Proves |
| Anti-bloat philosophy | §11 Scope Boundary, NON_GOALS.md |
| Publication readiness | §10 Versioning and Stability, TRUST_BOUNDARIES.md |
| Architectural invariants | ARCHITECTURAL_INVARIANTS.md (full register) |
| Trust boundaries | TRUST_BOUNDARIES.md (full model) |
| Freeze discipline | §0.5 Freeze Expectations, ARCHITECTURAL_INVARIANTS (Freeze domain) |

### 0.4 Precedence Rules

Conflicts between doctrine documents are resolved as follows:

1. Ecosystem standards take precedence over all OpenProof doctrine.
2. SYSTEMS_DOCTRINE takes precedence over all other OpenProof doctrine documents.
3. NON_GOALS.md, DESIGN_RESTRAINTS.md, and TRUST_BOUNDARIES.md are peer documents. Conflicts between them are resolved by reference to SYSTEMS_DOCTRINE.
4. ARCHITECTURAL_INVARIANTS.md operationalizes all higher-level doctrines. If an invariant contradicts a higher-level doctrine, the higher-level doctrine wins and the invariant must be corrected.
5. Where SYSTEMS_DOCTRINE is silent on a matter, the remaining documents govern in their respective domains: NON_GOALS.md defines scope boundaries, DESIGN_RESTRAINTS.md defines implementation constraints, TRUST_BOUNDARIES.md defines trust assumptions, and ARCHITECTURAL_INVARIANTS.md defines enforceable rules.

### 0.5 Freeze Expectations

- **Sections 1–11 are frozen.** These define permanent system identity, architecture, and scope. They cannot be amended. Any change to these sections constitutes a new system, not an evolution of OpenProof.
- **This section (§0) is controlled.** Governance metadata and process descriptions may be updated as the governance framework evolves.
- **Section 12 (Governance Process) is controlled.** Procedural details may be updated without altering the frozen sections.

Freeze classification definitions:

| Classification | Meaning | Amendment Required |
|---|---|---|
| **Frozen** | Permanent. Cannot be changed. | None — cannot be amended. Requires governance escalation to reclassify. |
| **Controlled** | Stable but may evolve. | Governance review required. |
| **Mutable** | May be updated through normal development. | Standard PR review. |

Frozen sections currently exist only in SYSTEMS_DOCTRINE.md and ARCHITECTURAL_INVARIANTS.md. Lower-level doctrines (NON_GOALS.md, DESIGN_RESTRAINTS.md, TRUST_BOUNDARIES.md) are controlled.

A frozen section becoming controlled requires ecosystem governance review and a version bump (e.g., SD-001 to SD-002) that records what changed and why.

### 0.6 Amendment Process

Amending this document requires:

1. **Proposal.** A written document describing the change, its rationale, its impact on all dependent doctrine documents, and its effect on each invariant in ARCHITECTURAL_INVARIANTS.md.
2. **Review.** Ecosystem governance review against all applicable ecosystem standards.
3. **Impact assessment.** Assessment of impact on NON_GOALS.md, DESIGN_RESTRAINTS.md, TRUST_BOUNDARIES.md, and ARCHITECTURAL_INVARIANTS.md. Dependent documents must be updated in lockstep.
4. **Designation.** Clear designation of which sections are superseded, added, or modified.
5. **Version record.** The document footer must be updated with the new version, date, and change summary.

Amendment proposals that touch sections 3, 6, or 11 require escalation to ecosystem governance regardless of the proposer's role.

### 0.7 Supersession Tracking

When sections of this document are superseded:

- Old text is retained and marked as superseded, not deleted.
- A supersession notice appears at the point of change: *"Superseded by [document ID, date] — see [new location]."*
- The document footer maintains a changelog of all supersessions.

### 0.8 Cross-Document Map

| Referenced Document | Relationship | Reference(s) in this document |
|---|---|---|
| [NON_GOALS.md](NON_GOALS.md) | Full exclusion enumeration derived from §11 | §8, §11 |
| [TRUST_BOUNDARIES.md](TRUST_BOUNDARIES.md) | Trust model and perimeters derived from §4, §5 | §4, §5 |
| [DESIGN_RESTRAINTS.md](DESIGN_RESTRAINTS.md) | Implementation constraint details derived from §6 | §11 |
| [ARCHITECTURAL_INVARIANTS.md](ARCHITECTURAL_INVARIANTS.md) | Enforceable invariant register | §0.6, §3 |
| [receipt-schema.md](receipt-schema.md) | Receipt format specification | §6.4, §10 |
| [architecture.md](architecture.md) | Implementation architecture | §10 |
| [ecosystem-standards](https://github.com/sparshsam/ecosystem-standards) | External governance authority | §0.3 |

---

## 1. Identity

OpenProof is a proof-of-existence tool. It registers cryptographic fingerprints of files on a public blockchain so that an observer can later verify that a particular hash existed before a block time.

It is not a notary service, intellectual property registry, authorship claim, legal attestation, or certification authority. These are all higher-level claims that require social, legal, or institutional attestation beyond what a hash registry provides.

OpenProof's value is narrow and specific: it makes the existence of a hash at a time independently verifiable by any party with access to the blockchain.

## 2. Core Functions

The system performs exactly two operations:

1. **Register.** Given a `bytes32` hash, store it onchain with the sender's address and current block timestamp. Cost: one contract write per proof.
2. **Verify.** Given a `bytes32` hash, return the onchain record (creator, timestamp) or a null result. Cost: one contract read per lookup.

These correspond to three surface-level user actions:
- **Create proof** — hash a file locally, register the hash onchain, download a receipt
- **Verify proof** — hash a file locally, compare against an onchain record, or import a receipt JSON and look it up
- **View proof** — read an onchain proof record by hash via a public proof page

All three derive entirely from the two contract operations. No other operations exist.

## 3. Architectural Boundary

```
┌─────────────────────────────────────────────────────┐
│                   User Environment                   │
│                                                      │
│  File → SHA-256 → hash → wallet → signed tx         │
│  Receipt JSON → verify locally → onchain lookup     │
│                                                      │
│  No file bytes cross this boundary                   │
└──────────────────────┬──────────────────────────────┘
                       │ bytes32 hash only
                       ▼
┌─────────────────────────────────────────────────────┐
│             OpenProofRegistry (smart contract)       │
│                                                      │
│  store: hash → (creator, timestamp)                  │
│  read:  hash → (creator, timestamp) or null          │
│  invariant: no overwrites, no deletions              │
└─────────────────────────────────────────────────────┘
```

The boundary is the blockchain itself. The contract knows nothing about files, names, types, or users. It stores three values per proof: a hash, an address, and a timestamp. That is the full data model.

## 4. Frontend Role

The frontend is a convenience layer — a statically served client application that:

- Reads a file via the browser File API
- Computes SHA-256 via the Web Crypto API (native implementation)
- Formats transaction parameters for wallet submission
- Parses and displays onchain records
- Generates deterministic local receipt JSON
- Maintains ephemeral local proof history in browser storage

The frontend is **not authoritative**. Every operation it performs can be replaced by independent tools:

- `sha256sum file` replaces the browser hashing
- A block explorer query replaces the verification UI
- The contract ABI and address replace the formatted transaction

A compromised or malicious frontend cannot falsify onchain state. The worst it can do is trick the user about what they are signing or where they are looking. This is a limitation of all dapp frontends, not specific to OpenProof.

## 5. Data Model

The canonical data model exists onchain. There is no secondary index, cache, database, or logging system that duplicates or replaces onchain state.

```solidity
struct Proof {
    address creator;     // wallet that submitted the registration
    uint64 timestamp;    // block timestamp at registration
    bytes32 fileHash;    // the registered fingerprint
}
```

Receipts are local JSON artifacts. They are generated client-side from deterministic rules. A receipt is valid only when its hash matches an onchain record. Receipts are portable — they contain all metadata needed for verification — but they are not authoritative without onchain confirmation.

## 6. Implementation Principles

**6.1 No file uploads.** Files never leave the device. All hashing occurs in the browser. There is no upload endpoint, storage bucket, or server-side file processing. This is non-negotiable.

**6.2 No backend.** The system has zero server-side application logic. The frontend is a static export. The contract runs on the blockchain. There is no API server, database server, cache layer, or application middleware.

**6.3 Minimal contract surface.** The contract exposes `registerProof(bytes32)`, `getProof(bytes32)`, and `proofExists(bytes32)`. No token functions, no ownership, no upgradeability, no fees, no access control. Immutable after deployment.

**6.4 Deterministic receipts.** Receipts are generated from locally known data using a fixed schema and sorting rules (see [receipt-schema.md](receipt-schema.md)). No server-produced identifiers, no signatures, no randomness. Two identical files produce identical receipts.

**6.5 Local history is ephemeral.** Proof history exists in browser local storage only. It is not synchronized, backed up, or recoverable across devices. It is a convenience for the user, not a system requirement.

**6.6 Permissionless registration.** Any wallet can register any hash that has not been registered before. There is no approval, whitelist, fee, or gate. This is by design.

## 7. What the System Proves

OpenProof establishes exactly one fact: **a specific cryptographic hash was registered by a specific wallet address at a specific block time.**

All claims beyond this — ownership, authorship, legal validity, content truth — require additional evidence and attestation mechanisms that OpenProof does not and will not provide.

## 8. What the System Does Not Prove

- Identity of the registrant (wallet keys can be shared or stolen)
- File content truth or accuracy
- Authorship or intellectual property ownership
- Legal enforceability or notarization
- Timestamp accuracy beyond block time (subject to chain finality)

See [NON_GOALS.md](NON_GOALS.md) for a complete enumeration.

## 9. Minimal Dependencies

OpenProof depends on exactly three external systems:

| Dependency | Role | Substitutable? |
|---|---|---|
| Base Sepolia (or target chain) | Smart contract execution, data persistence | Yes — different EVM chain |
| Vercel (or host) | Static frontend delivery | Yes — any static host |
| Reown Cloud | WalletConnect relay infrastructure | Yes — different relayer |

No dependency is a hard lock-in. The contract can be redeployed on any EVM chain. The frontend builds to a static export that can be hosted anywhere. The wallet connection layer uses wagmi, which supports multiple connectors.

## 10. Versioning and Stability

- Contract is immutable per deployment. Upgrades require redeployment to a new address.
- Receipt schema is versioned (`schemaVersion`) with documented backward-compatible defaults for v1. See [receipt-schema.md](receipt-schema.md).
- Frontend versioning follows the repository's git tags. No automatic updates or forced upgrades.
- Bundle rules are versioned (`bundleRuleVersion`) to prevent verification drift. See [architecture.md](architecture.md).

## 11. Scope Boundary

OpenProof does one thing and does not expand its scope. The following are explicitly out of scope:

- Multi-chain registries or cross-chain relay
- Identity, authentication, or account systems
- File storage, IPFS, Arweave, or content hosting
- Token-gated access, payments, or premium tiers
- Social features, commenting, or collaboration
- Analytics, telemetry, or user tracking
- AI integration, proof scoring, or automated verification pipelines
- Mobile apps, API access, or SDK distribution
- Enterprise features, dashboards, or team management
- Any form of surveillance, monitoring, or behavioral tracking

See [NON_GOALS.md](NON_GOALS.md) for the full enumeration and [DESIGN_RESTRAINTS.md](DESIGN_RESTRAINTS.md) for the rationale.

## 12. Governance Process

This document is governed by the rules defined in §0. This section provides procedural reference only.

### 12.1 Amendment Authority

See §0.6 for the full amendment process. In summary:

- Amendments to frozen sections (§1–§11) are not permitted without freeze reclassification via ecosystem governance.
- Amendments to controlled sections (§0, §12) require governance review.
- All amendments require impact assessment against ARCHITECTURAL_INVARIANTS.md and all dependent doctrine documents.
- Amendments touching section 3, 6, or 11 require ecosystem governance escalation.

### 12.2 Freeze Classification

See §0.5 for full freeze definitions. The current classification:

| Section | Classification |
|---|---|
| §1–§11 (Identity through Scope Boundary) | Frozen |
| §0 (Governance) | Controlled |
| §12 (Governance Process) | Controlled |

Frozen sections define permanent system identity. Reclassification requires ecosystem governance review.

### 12.3 Precedence

See §0.4 for full precedence rules. In case of conflict with another doctrine document, SYSTEMS_DOCTRINE takes precedence over all other OpenProof doctrine, and ecosystem standards take precedence over all.

### 12.4 Changelog

| Version | Date | Change | Author |
|---|---|---|---|
| 001 | 2026-06-04 | Original ratification | Systems Doctrine & Boundaries Editor |
