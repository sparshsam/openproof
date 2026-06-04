# OpenProof Architectural Invariants

**Document ID:** OP-DOCTRINE-AI-001
**Classification:** Permanent invariant register
**Hierarchy:** Level 3 — enforceable rules (derived from all higher-level doctrines)
**Scope:** OpenProof, all deployments and forks
**Authority:** Ecosystem governance standards — [ecosystem-standards](https://github.com/sparshsam/ecosystem-standards)
**Freeze level:** Mixed — severity definitions are frozen; invariant classifications may be reassessed.
**Status:** Adopted

**Previous versions:** None (original)
**Supersedes:** None
**Depends on:** [SYSTEMS_DOCTRINE.md](SYSTEMS_DOCTRINE.md), [NON_GOALS.md](NON_GOALS.md), [DESIGN_RESTRAINTS.md](DESIGN_RESTRAINTS.md), [TRUST_BOUNDARIES.md](TRUST_BOUNDARIES.md)

---

## 0. Governance

### 0.1 Document Purpose

This document defines the architectural invariants of OpenProof — properties that must hold across all versions, all deployments, all extensions, and all forks. Violating an invariant breaks the system's identity, security model, or trust guarantees.

Invariants are the most granular level of doctrine. Every invariant maps to at least one higher-level doctrine document. The invariant register is the enforcement layer — it converts philosophical principles into testable properties.

### 0.2 Hierarchy and Dependencies

This document is Level 3 in the doctrine hierarchy. It operationalizes all higher-level doctrines:

```
Level 1: SYSTEMS_DOCTRINE.md (principles)
Level 2: NON_GOALS.md — DESIGN_RESTRAINTS.md — TRUST_BOUNDARIES.md (constraints)
Level 3: ARCHITECTURAL_INVARIANTS.md (enforceable rules)
```

Each invariant references the higher-level doctrine(s) it derives from:

| Domain | Derives From |
|---|---|
| Data invariants (I-1 through I-4) | SYSTEMS_DOCTRINE §3, §4, §6; NON_GOALS §2; DESIGN_RESTRAINTS §2, §4 |
| Contract invariants (II-1 through II-5) | SYSTEMS_DOCTRINE §6.3; DESIGN_RESTRAINTS §5 |
| Frontend invariants (III-1 through III-5) | SYSTEMS_DOCTRINE §4, §6.2; NON_GOALS §2, §9; DESIGN_RESTRAINTS §2, §3, §7 |
| Receipt invariants (IV-1 through IV-3) | SYSTEMS_DOCTRINE §6.4; DESIGN_RESTRAINTS §7.2 |
| Extensibility invariants (V-1 through V-3) | SYSTEMS_DOCTRINE §11; NON_GOALS §7, §10 |
| Deployment invariants (VI-1 through VI-3) | SYSTEMS_DOCTRINE §9; TRUST_BOUNDARIES §2 |
| Dependency invariants (VII-1, VII-2) | SYSTEMS_DOCTRINE §9; DESIGN_RESTRAINTS §3 |
| Freeze invariants (VIII-1 through VIII-3) | SYSTEMS_DOCTRINE §10; DESIGN_RESTRAINTS §5.1 |

### 0.3 Freeze Expectations

- **Severity definitions (Critical/High/Medium) are frozen.** The severity framework is a permanent part of the doctrine system.
- **Individual invariant definitions are controlled.** An invariant's wording may be clarified, but its essential property may not be weakened without governance review.
- **The invariant summary table is controlled.** Severity reassessments, additions, and removals follow the amendment process.
- **The violation protocol is controlled.** Process details may evolve.
- **This governance section (§0) is controlled.**

### 0.4 Amendment Process

Amending this document requires:

1. **Proposal.** A written document describing which invariant is being added, removed, or reclassified, and its rationale.
2. **Higher-doctrine impact.** Every invariant change must be assessed against SYSTEMS_DOCTRINE.md, the relevant Level 2 doctrines, and the affected domain's derivation chain as documented in §0.2.
3. **Governance review.** Ecosystem governance review.
4. **Severity designation.** Clear designation of severity (Critical, High, or Medium) with rationale.
5. **Cross-document update.** All doctrine documents that reference the invariant must be updated.
6. **Version record.** The document footer must be updated with the new version, date, and change summary.

Adding a new Critical-severity invariant requires escalation equivalent to amending SYSTEMS_DOCTRINE.md. Downgrading a Critical invariant to a lower severity requires the same.

### 0.5 Precedence

- All Level 1 and Level 2 doctrine documents take precedence over this document.
- If an invariant conflicts with a higher-level doctrine, the higher-level doctrine wins and the invariant must be corrected.
- If two invariants conflict, the higher-severity invariant governs. If both have the same severity, the parent doctrines resolve the conflict.
- This document is the final enforcement layer. No lower-level document may contradict an invariant without governance review leading to either the invariant's correction or the conflicting document's amendment.

### 0.6 Relationship to Violation Protocol

The violation protocol defined in §IX operationalizes this governance section for runtime violations. A code change that violates an invariant should first follow the violation protocol for immediate correction, then follow §0.4 for permanent amendment if needed.

### 0.7 Cross-Document Map

| Referenced Document | Relationship |
|---|---|
| [SYSTEMS_DOCTRINE.md](SYSTEMS_DOCTRINE.md) | Level 1 — principles each invariant derives from |
| [NON_GOALS.md](NON_GOALS.md) | Level 2 — exclusions encoded in data and frontend invariants |
| [DESIGN_RESTRAINTS.md](DESIGN_RESTRAINTS.md) | Level 2 — restraints encoded in contract, frontend, dependency invariants |
| [TRUST_BOUNDARIES.md](TRUST_BOUNDARIES.md) | Level 2 — trust model encoded in deployment invariants |
| [ecosystem-standards](https://github.com/sparshsam/ecosystem-standards) | External governance authority |

---

## Invariant Definition

An architectural invariant is a property that must hold across all versions, all deployments, all extensions, and all forks of OpenProof. Violating an invariant breaks the system's identity, security model, or trust guarantees.

Invariants are grouped by domain. Within each group, invariants are ordered by severity.

---

## I. Data Invariants

### I-1. Files never leave the browser.

File bytes are read by the browser File API, hashed by the Web Crypto API, and discarded. No file content is transmitted to any server, embedded in any transaction, included in any receipt, or stored in any local persistence layer.

This is the foundational privacy invariant. Violating it would transform OpenProof from a proof-of-existence tool into a file transmission system with entirely different security and trust properties.

**Violation example:** Sending file bytes to a server "for analysis," "for verification," "for convenience," or "for backup."

### I-2. Only the hash reaches the blockchain.

The onchain registry stores exactly three values per proof: `bytes32 fileHash`, `address creator`, `uint64 timestamp`. No file metadata, no file content, no user identity data, no application-specific data is stored onchain.

This invariant constrains both the contract and the frontend. The contract must not accept additional data. The frontend must not encode additional data into the hash or the transaction.

### I-3. Receipts are deterministic and client-generated.

A receipt is produced entirely from data available in the browser at proof time. There is no server-produced field, no randomness, no unique identifier assigned by an external system. Given the same inputs (file hash, wallet address, chain ID, transaction hash), any implementation of the receipt schema produces identical output.

This ensures that receipts can be regenerated and validated without any OpenProof-specific infrastructure.

### I-4. Local history is not authoritative.

Browser localStorage proof history is a convenience feature. It must never be the sole record of a proof, must never be required for verification, and must never be treated as canonical. Users must always be able to download a receipt JSON as the portable proof record.

**Corollary:** Clearing localStorage must not destroy any proof that the user has saved as a receipt. The receipt is the proof record; localStorage is a temporary index.

---

## II. Contract Invariants

### II-1. Immutable after deployment.

The contract has no upgrade mechanism, no proxy contract, no `selfdestruct`, no admin address, no owner functions, no pausable features. Its behavior at deployment time is its behavior forever. The only way to change contract behavior is to deploy a new contract at a new address.

**Rationale:** Upgradeability creates a centralized trust point. An upgradeable proof-of-existence contract is a contradiction — the administrator could alter, delete, or censor proofs.

### II-2. Permissionless registration.

Any wallet can register any `bytes32` hash that has not been registered before. There is no allowlist, blocklist, fee, approval, or access control.

**Rationale:** Permissionless registration is the defining characteristic of a proof-of-existence registry. Any gating mechanism would undermine the system's claim to provide neutral, trustless proof infrastructure.

### II-3. No overwrites, no deletions.

Once a proof is registered, it cannot be removed, overwritten, or modified by any entity, including the original registrant. The only exception is a chain reorganization (block reorg), which is a property of the underlying blockchain, not of the contract.

**Rationale:** Deletable proofs would undermine the system's timestamp guarantees. A proof that can be deleted was not truly proven to exist.

### II-4. Non-financial operation.

The contract must never hold ETH, transfer ETH, or track balances. There is no payable function, no withdrawal function, no fee mechanism, no treasury. The only gas cost is the standard transaction fee paid by the user to the network.

**Rationale:** Financial operations introduce regulatory risk, attack surface (reentrancy, frontrunning), and incentive misalignment. A proof registry that charges fees creates a profit motive that conflicts with its role as neutral infrastructure.

### II-5. No external calls.

The contract must not call any external contract, oracle, or precompile beyond the standard EVM execution environment. This prevents reentrancy vectors, oracle manipulation, and dependency on external contract availability.

---

## III. Frontend Invariants

### III-1. Static export only.

The frontend must produce a fully static export. No server-side rendering, no API routes, no server actions, no middleware that requires a runtime server process. The output directory must be a collection of static files (`index.html`, JS bundles, CSS, assets) that can be served by any HTTP server, CDN, or IPFS gateway.

**Rationale:** A server requirement would introduce uptime dependence, operational cost, and centralized trust. Static export ensures portability and zero-cost hosting.

### III-2. No authentication.

The frontend must never require a user to authenticate, create an account, or provide identifying information. The only "connection" state is the wallet connection, which is a blockchain-level interaction, not an application-level account.

**Rationale:** Authentication creates user profiles, which create data protection obligations, which create privacy risks. Proof-of-existence is inherently anonymous (pseudonymous by wallet address). Adding authentication would introduce a mapping between identity and proofs that undermines this.

### III-3. Wallet connection is optional.

The user must be able to verify a proof, view a proof page, browse local history, import a receipt, and read documentation without connecting a wallet. Wallet connection must be required only for the single action that needs it: registering a new proof.

**Rationale:** Forcing wallet connection for non-write operations is a dark pattern that conditions users to connect without thinking.

### III-4. All third-party requests must be user-initiated.

The frontend must not make network requests to third-party services except in direct response to a user action:

- **RPC queries** — triggered by the user viewing a proof, verifying a receipt, or checking for duplicate hashes
- **Wallet connection** — triggered by the user clicking "Connect Wallet"
- **Transaction submission** — triggered by the user confirming a wallet prompt

Preloading, prefetching, speculative RPC calls, or background wallet queries are not permitted.

### III-5. No client-side telemetry.

The frontend must not include scripts, libraries, or code that reports usage data, errors, performance metrics, or user behavior to any external service. This includes error monitoring services (Sentry, Bugsnag), analytics (Google Analytics, Plausible, Fathom), session recording (Hotjar, FullStory), and CDN analytics that correlate with user behavior.

The only exception is network-level metrics that are inherent to the wallet connection layer and cannot be disabled (e.g., RPC provider request logging).

---

## IV. Receipt Invariants

### IV-1. Receipts must be self-validating in schema.

A receipt must contain enough metadata (schema version, chain ID, contract address, hash algorithm) to determine whether it can be verified against current OpenProof code without external context. A receipt must not rely on a server or API to interpret its contents.

### IV-2. Receipts are not proof.

A receipt is a local artifact. It records what the user knew at the time of generation. It becomes meaningful only when its recorded hash matches an onchain registry entry. A receipt without onchain confirmation is a record of an attempt, not a proof.

### IV-3. Schema changes must be backward-compatible.

Any new receipt schema version must define canonical defaults for all fields that did not exist in the previous version. Validation code must accept multiple schema versions and apply the correct validation rules per version. No user's existing receipt should become unparseable due to a schema update.

---

## V. Extensibility Invariants

### V-1. All extensions must be orthogonal to core operations.

An extension (a new tool, a new integration, a new output format) must not alter or depend on the core registration and verification flow. Core operations must work identically whether or not any extension is installed, configured, or active.

**Example:** A receipt-to-PDF converter is an extension. It reads the receipt JSON and produces a PDF. It does not change how registration or verification works.

**Counterexample:** A "batch registration" feature that calls `registerProof` in a loop is an extension, but a server-side middleware that manages RPC failover is not — it adds a backend dependency.

### V-2. Extensions must not create new trust requirements.

An extension must not introduce a component that the user must trust for proof validity. If an extension introduces a new service, that service must be optional, replaceable, and independently verifiable.

**Counterexample:** An extension that "automatically verifies proofs" by running a proprietary model would create a trust dependency on that model's correctness.

### V-3. Extensions must not add recurring cost.

An extension that requires a paid API key, a subscription, or a cloud service to function is prohibited. Extensions must operate within the zero-spend constraint unless the self-hosting operator explicitly accepts the additional cost.

---

## VI. Deployment Invariants

### VI-1. The contract address must be the root of trust.

Users identify the canonical deployment by its contract address. The frontend domain may change, the hosting provider may change, the RPC endpoint may change — but the contract address remains the permanent identifier of an OpenProof deployment.

Any documentation, UI, or tool that helps users verify a proof must always display the contract address and instruct the user to cross-reference it against a trusted source.

### VI-2. A deployment must be verifiable independently of its frontend.

Proofs registered through any OpenProof deployment must be verifiable without using that deployment's frontend. The canonical verification method is: query the contract at the known address through any means — a block explorer, a script, a different frontend implementation.

### VI-3. No privileged deployments.

All deployments are equal. There is no "official" deployment with special privileges, additional features, or exclusive access. The canonical deployment (openproof.vercel.app) is distinguished by convention and community awareness, not by technical superiority or exclusive capabilities.

---

## VII. Dependency Invariants

### VII-1. No runtime dependency on a specific provider.

No runtime dependency may be tied to a specific company, service, or provider in a way that makes substitution non-trivial. This applies to:

- **RPC providers.** The RPC endpoint must be configurable via environment variable. Multiple RPC providers must be usable without code changes.
- **Wallet connectors.** The wallet connection layer must support standard interfaces. Proprietary connectors that lock the frontend to a single wallet provider are not permitted.
- **Hosting.** The frontend must be deployable to any static host, not only to Vercel.

### VII-2. No implicit network access in dependencies.

No dependency may make network requests, open sockets, or communicate with external services without explicit invocation by user action. This applies especially to analytics, error reporting, and performance monitoring — none of which are permitted.

---

## VIII. Freeze Invariants

### VIII-1. The contract is permanently frozen at deployment.

After the initial deployment transaction, the contract's behavior, storage layout, and event schema are final. No post-deployment changes are possible (no upgrade, no proxy, no `selfdestruct` and redeploy at the same address).

### VIII-2. The receipt schema may evolve but must remain backward-compatible.

New receipt versions may add fields, deprecate old fields, or tighten validation rules. They must not remove fields that existing receipts rely on, change the interpretation of existing fields, or reject receipts from the previous version as invalid format.

### VIII-3. Bundle rules may evolve but must document which rule was used.

Each bundle receipt records the `bundleRuleVersion` used at registration time. Verification code must support all previous bundle rules or must clearly flag that verification drift has occurred. Users with an old receipt must be able to determine why a newer verifier produces a different result.

---

## IX. Invariant Violation Protocol

If an invariant is found to be violated — through a code change, a deployment misconfiguration, an external dependency change, or any other cause — the following steps apply:

1. **Document the violation.** Record what invariant was violated, how, when, and by what change.
2. **Assess the impact.** Determine whether the violation affects existing proofs (data integrity), current users (functional impact), or future users (design divergence).
3. **Restore the invariant.** The violating change must be reverted or corrected. If restoration is not possible (e.g., data has been transmitted), document the permanent consequences.
4. **Prevent recurrence.** Update review processes to catch the same class of violation in the future.
5. **Report to governance.** Submit a violation report to the ecosystem governance process per §0.4.

A willful invariant violation without governance approval constitutes a fork. The violating deployment ceases to be OpenProof in the canonical sense and must be rebranded or clearly distinguished.

### Permanent Invariant Violations

If an invariant violation cannot be reverted (e.g., data was transmitted or onchain state was modified), the following additional steps apply:

1. The violating deployment must publish a disclosure describing what invariant was violated, what data was affected, and what permanent consequences exist.
2. The invariant may need to be reclassified or removed if the violation reveals that the invariant as stated is not enforceable.
3. A corrected deployment must be created that restores all enforceable invariants.
4. The governance record must permanently note why the invariant failed and what was done to prevent recurrence.

---

## Invariant Summary Table

| ID | Invariant | Domain | Severity |
|---|---|---|---|
| I-1 | Files never leave browser | Data | Critical |
| I-2 | Only hash reaches chain | Data | Critical |
| I-3 | Receipts deterministic + client-generated | Data | High |
| I-4 | Local history not authoritative | Data | High |
| II-1 | Immutable contract | Contract | Critical |
| II-2 | Permissionless registration | Contract | Critical |
| II-3 | No overwrites or deletions | Contract | Critical |
| II-4 | Non-financial operation | Contract | Critical |
| II-5 | No external calls | Contract | High |
| III-1 | Static export only | Frontend | Critical |
| III-2 | No authentication | Frontend | Critical |
| III-3 | Wallet connection optional for reads | Frontend | High |
| III-4 | User-initiated requests only | Frontend | High |
| III-5 | No client-side telemetry | Frontend | Critical |
| IV-1 | Self-validating receipts | Receipt | High |
| IV-2 | Receipts not proof without onchain match | Receipt | Critical |
| IV-3 | Backward-compatible schema changes | Receipt | High |
| V-1 | Extensions orthogonal to core | Extensibility | High |
| V-2 | Extensions avoid new trust | Extensibility | High |
| V-3 | Extensions avoid recurring cost | Extensibility | Medium |
| VI-1 | Contract address is root of trust | Deployment | Critical |
| VI-2 | Independently verifiable deployment | Deployment | Critical |
| VI-3 | No privileged deployments | Deployment | High |
| VII-1 | No provider lock-in | Dependencies | High |
| VII-2 | No implicit network access | Dependencies | High |
| VIII-1 | Contract permanently frozen | Freeze | Critical |
| VIII-2 | Receipt schema backward-compatible | Freeze | High |
| VIII-3 | Bundle rules versioned | Freeze | Medium |

**Severity definitions:**

- **Critical** — Violation changes the fundamental identity, security, or trust properties of OpenProof. Must never be violated. Requires governance escalation to amend.
- **High** — Violation significantly degrades privacy, portability, or determinism. Requires explicit waiver through restraint review.
- **Medium** — Violation introduces non-ideal but survivable behavior. Requires documentation and a timeline for correction.

## Changelog

| Version | Date | Change | Author |
|---|---|---|---|
| 001 | 2026-06-04 | Original ratification | Systems Doctrine & Boundaries Editor |
