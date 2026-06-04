# OpenProof Design Restraints

**Document ID:** OP-DOCTRINE-DR-001
**Classification:** Permanent restraint documentation
**Hierarchy:** Level 2 — peer doctrine (with NON_GOALS and TRUST_BOUNDARIES)
**Scope:** OpenProof, all deployments and forks
**Authority:** Ecosystem governance standards — [ecosystem-standards](https://github.com/sparshsam/ecosystem-standards)
**Freeze level:** Controlled — restraint register is stable, individual restraint severity may be reassessed.
**Status:** Adopted

**Previous versions:** None (original)
**Supersedes:** None
**Depends on:** [SYSTEMS_DOCTRINE.md](SYSTEMS_DOCTRINE.md) §6 (Implementation Principles)

---

## 0. Governance

### 0.1 Document Purpose

This document defines the restraint philosophy, implementation constraints, and forced tradeoffs that govern OpenProof's development. It describes what OpenProof chooses not to do and why — the deliberate omissions that preserve the system's properties.

### 0.2 Hierarchy and Dependencies

This document derives from SYSTEMS_DOCTRINE.md §6 (Implementation Principles). Each restraint in this document is an operational extension of a principle defined in the parent doctrine.

| Document | Relationship |
|---|---|
| [SYSTEMS_DOCTRINE.md](SYSTEMS_DOCTRINE.md) | Parent doctrine — implementation principles defined in §6 |
| [NON_GOALS.md](NON_GOALS.md) | Peer — exclusions complement restraints |
| [TRUST_BOUNDARIES.md](TRUST_BOUNDARIES.md) | Peer — trust model reinforces no-backend restraint |
| [ARCHITECTURAL_INVARIANTS.md](ARCHITECTURAL_INVARIANTS.md) | Enforceable rules — several invariants encode restraints (III-1, III-2, VII-1, VII-2) |

### 0.3 Freeze Expectations

- **The restraint register (§11, the Restraint Register) is controlled.** Individual restraint severity classifications (hard/soft) may be reassessed through governance review. The register itself is permanent.
- **Backend minimization (§2), contract minimization (§5), and portability constraint (§7) are frozen.** These define structural implementation boundaries that cannot be relaxed.
- **Dependency minimization (§3), state minimization (§4), cost restraint (§6), implementation simplicity (§8), and testing restraint (§9) are controlled.** Specific thresholds and checklists may be refined.
- **The restraint review process (§10) is controlled.** Process details may evolve.
- **This governance section (§0) is controlled.**

### 0.4 Amendment Process

Amending this document requires:

1. **Proposal.** A written document describing which restraint is being added, modified, or relaxed, and its rationale.
2. **Parent doctrine check.** Any change must be assessed against SYSTEMS_DOCTRINE.md §6. If the restraint contradicts the parent doctrine, SYSTEMS_DOCTRINE.md must be addressed first.
3. **Governance review.** Ecosystem governance review.
4. **Cross-document impact.** Assessment of impact on NON_GOALS.md, TRUST_BOUNDARIES.md, and ARCHITECTURAL_INVARIANTS.md.
5. **Invariant check.** Assessment against all affected invariants in ARCHITECTURAL_INVARIANTS.md.
6. **Severity designation.** For restraint register changes, clear designation of whether the restraint is hard or soft.
7. **Version record.** The document footer must be updated with the new version, date, and change summary.

A hard restraint becoming soft requires governance escalation equivalent to amending SYSTEMS_DOCTRINE.md.

### 0.5 Precedence

- SYSTEMS_DOCTRINE.md takes precedence over this document.
- This document and NON_GOALS.md / TRUST_BOUNDARIES.md are peers. Where they overlap, the more specific document governs.
- This document takes precedence over ARCHITECTURAL_INVARIANTS.md where the invariant would contradict a documented restraint (the invariant must be corrected).

### 0.6 Cross-Document Map

| Referenced Document | Relationship |
|---|---|
| [SYSTEMS_DOCTRINE.md](SYSTEMS_DOCTRINE.md) §6 | Parent doctrine — implementation principles |
| [NON_GOALS.md](NON_GOALS.md) | Peer — feature exclusions reference these restraints |
| [TRUST_BOUNDARIES.md](TRUST_BOUNDARIES.md) | Peer — trust model reinforces no-backend restraint |
| [ARCHITECTURAL_INVARIANTS.md](ARCHITECTURAL_INVARIANTS.md) | Enforceable rules — invariant references noted in §0.2 |
| [architecture.md](architecture.md) | Implementation architecture referenced in §8.3 |
| [ecosystem-standards](https://github.com/sparshsam/ecosystem-standards) | External governance authority |

---

## 1. Restraint Philosophy

OpenProof achieves its properties through what it does not build, not through what it builds.

Every feature that is not added is a class of bugs, vulnerabilities, and maintenance burden that does not exist. Every external dependency that is not introduced is an attack surface, a license obligation, and a supply-chain risk that does not exist. Every integration that is refused is a privacy leak, a trust requirement, and an operational cost that does not exist.

This is not a concession. It is the design strategy.

## 2. Backend Minimization

### 2.1 Rule

**The system has no backend.** The frontend is a static Next.js export. The contract runs on the blockchain. There is no application server, API server, database server, cache layer, job queue, or middleware between them.

### 2.2 Why

- A backend requires server management, patching, monitoring, and scaling
- A backend creates a centralized trust point and a single point of failure
- A backend incurs recurring operational cost; cost requires funding; funding creates incentives misalignment
- A backend must authenticate requests; authentication requires user accounts; accounts require data protection

### 2.3 What This Means in Practice

- All state is either in the browser (localStorage) or on the blockchain (contract storage)
- All computation is either in the browser (hashing, receipt generation) or in the wallet (transaction signing)
- There is no server-side secret to protect (the only secret is the deployer key, used only at deployment time)
- There is no server-side session, cookie, or token to manage
- There is no endpoint to rate-limit, firewall, or DDoS-protect beyond the static CDN delivery

### 2.4 Boundary Conditions

The following are **not** backend additions:

- Adding a second RPC provider for failover (RPC is a client-side configuration, not a server)
- Adding a client-side cache of known proofs (in-memory or localStorage, not a server)
- Adding a static fallback page for offline proof viewing (static build output, not dynamic)

The following **are** backend additions and are prohibited:

- A proxy API that aggregates RPC queries
- A server-side cache with an API endpoint
- A database for storing proof metadata
- A server-side receipt generation service
- Any endpoint that handles user-submitted data

## 3. Dependency Minimization

### 3.1 Rule

**Runtime dependencies must be justified by essential functionality, not convenience.** Every dependency is a supply-chain risk, a bundle size cost, and a maintenance obligation.

### 3.2 Dependency Checklist

Before adding a new runtime dependency, the following must be true:

- The functionality cannot be implemented in fewer than 50 lines of straightforward code
- The functionality is not available through a browser built-in (Web Crypto, File API, etc.)
- The dependency has no transitive dependencies that introduce network access or filesystem access
- The dependency is actively maintained (security patches within the last 6 months)
- The dependency's license is compatible with AGPL-3.0

If any of these conditions is not met, the dependency must be implemented manually or the feature must be omitted.

### 3.3 Current Approved Dependencies

| Package | Purpose | Why Approved |
|---|---|---|
| next, react, react-dom | Framework | Core UI framework; no substitute |
| wagmi, viem | Contract interaction | Standard Ethereum interface library |
| @rainbow-me/rainbowkit | Wallet connection | Standard wallet connection UI |
| tailwindcss, @tailwindcss/postcss | Styling | Build-time, zero runtime |
| typescript, typechain | Type safety | Build-time only |
| hardhat, hardhat-toolbox | Contract development | Dev dependency only |

All other dependencies require restraint review before addition.

## 4. State Minimization

### 4.1 Onchain State

The onchain state model is fixed:

```solidity
mapping(bytes32 => Proof) public proofs;
```

One mapping, one struct with three fields. No accumulators, no counters, no registries of registries, no lists, no pagination state. Each proof is independently addressable by its hash.

### 4.2 Local State

The only local state is:

- **Browser localStorage** — proof history (list of recent registration records). This is a convenience cache, not authoritative state.
- **In-memory state** — current hashing progress, active wallet connection, current UI phase. Lost on page refresh.
- **Receipt JSON files** — downloaded by the user, stored in their filesystem. OpenProof has no access to these after download.

### 4.3 What Is Not Stored

- No user accounts or profiles
- No session tokens or API keys
- No file content or file bytes
- No IP addresses or device fingerprints
- No interaction logs or usage metrics
- No wallet connection history beyond localStorage voluntary history

## 5. Contract Minimization

### 5.1 Surface Rules

The contract must remain:

- **Immutable.** No proxy, no upgradeability pattern, no selfdestruct. Once deployed, it cannot be changed.
- **Stateless between proofs.** No global state beyond the proof mapping. No configurable parameters. No accumulated counters.
- **Non-financial.** No ETH transfers, no balance tracking, no fee collection, no treasury functions.
- **Ownerless.** No admin, no owner address, no privileged functions. The contract cannot be paused, migrated, or drained.

### 5.2 What the Contract Will Never Do

- Transfer ETH or tokens
- Call external contracts (except the implicit EVM precompiles if needed)
- Maintain an allowlist or blocklist
- Charge fees or require payments
- Store file metadata (names, types, sizes)
- Implement access control of any kind
- Emit events beyond `ProofRegistered`
- Use upgradeable proxy patterns (UUPS, transparent, beacon)
- Support ERC standards of any kind

## 6. Cost Restraint

### 6.1 Zero-Spend Constraint

OpenProof's MVP operates at zero recurring cost:

| Category | Cost | Strategy |
|---|---|---|
| Frontend hosting | $0 | Vercel free tier, static export |
| Blockchain gas | $0 | Base Sepolia testnet (faucet ETH) |
| WalletConnect | $0 | Reown Cloud free tier |
| Contract deployment | $0 | Testnet gas (faucet) |
| RPC access | $0 | Public Base Sepolia RPC |

### 6.2 Why Zero-Spend Matters

A proof-of-existence tool that requires a paid subscription to operate is a contradiction in terms. If the tool cannot exist without recurring revenue, its availability depends on its business model surviving, not on its technical soundness.

Zero-spend operation ensures that:

- The tool can exist indefinitely without a funding source
- There is no pressure to monetize users or their data
- There is no dependency on venture capital or grant funding
- The tool can be forked and run independently by anyone at zero cost

### 6.3 When Cost Is Permitted

The only acceptable ongoing costs are:

- Blockchain gas fees (paid by the user per registration, not by the project)
- Voluntary self-hosting infrastructure (paid by the self-hosting operator, not by the project)
- Contract deployment gas (one-time, paid by the deployer)

The project itself must never require recurring payment to remain accessible.

## 7. Portability Constraint

### 7.1 Frontend Portability

The frontend must remain a static export. This means:

- No server-side rendering that requires a Node.js runtime
- No API routes that require a server process
- No server actions that couple the frontend to a specific host
- No ISR, SSR, or dynamic server features
- The build output must be a directory of static files that can be served by any web server, S3 bucket, or IPFS gateway

### 7.2 Receipt Portability

Receipts must be:

- Single-file JSON documents (no directory, no sidecar files)
- Self-contained (all verification metadata is in the JSON)
- Deterministic (same inputs produce identical output across all implementations)
- Human-readable (plain JSON, not binary, not encoded, not encrypted)

### 7.3 Wallet Portability

The wallet connection layer must support:

- At minimum: injected wallets (MetaMask, Coinbase Wallet), WalletConnect
- The wagmi library provides this by default. Any replacement must support the same breadth of connection methods without server-side components.

## 8. Implementation Simplicity

### 8.1 File Size Budget

No single source file in `src/` should exceed 500 lines of meaningful code (excluding imports, comments, and whitespace). Files approaching this limit should be decomposed along natural module boundaries.

This is a guideline, not a hard limit. The principle is: code should be small enough that a single developer can hold the full implementation of any module in working memory.

### 8.2 Function Complexity

Functions should fit within the following bounds:

- A single function should perform one logical operation
- A function should not have more than three levels of indentation
- A function should not accept more than four parameters (use an options object beyond that)
- Side effects should be explicit and localized

### 8.3 State Machines

Non-trivial UI flows (registration, verification) should be modeled as explicit state machines with:

- A finite set of named states
- Explicit transition conditions
- Dedicated handling for each state
- No hidden state encoded in boolean flags

This is already implemented for the registration lifecycle (see [architecture.md](architecture.md)).

## 9. Testing Restraint

Testing must cover:

- Contract behavior (all functions, error paths, edge cases) — currently 4/4 passing
- Receipt schema validation (all error patterns, version handling)
- Bundle manifest generation (determinism, sorting, edge cases)
- Type correctness (TypeScript strict mode)
- Build output (production build succeeds with no errors)

Testing must not cover:

- Visual regression or snapshot testing (high maintenance, low value for a minimal UI)
- End-to-end browser testing of wallet interactions (not reproducible without real wallet state)
- Performance benchmarking (not performance-sensitive at this scale)
- Cross-browser rendering tests (standardized by the framework and Tailwind)

## 10. Restraint Review Process

Any proposed change that affects a restraint boundary must undergo restraint review. A restraint review evaluates:

1. Does the change violate a documented restraint?
2. Is the change's functionality achievable within existing constraints?
3. Does the change create a dependency on a new external system?
4. Does the change introduce recurring cost?
5. Does the change create a new trust requirement for users?
6. Does the change increase the system's attack surface?
7. Does the change reduce portability or increase lock-in?

A change that fails any of these questions requires governance review before implementation. A change that passes all questions can proceed through normal development processes.

## 11. Restraint Register

| Restraint | Domain | Severity |
|---|---|---|
| No backend | Architecture | Hard |
| No file uploads | Privacy | Hard |
| Immutable contract | Trust | Hard |
| No token system | Economics | Hard |
| No analytics | Privacy | Hard |
| No user accounts | Identity | Hard |
| No social features | Feature | Hard |
| Zero-spend operation | Cost | Soft (MVP only) |
| Static frontend export | Portability | Hard |
| Receipt portability | Data | Hard |
| Minimal dependencies | Supply chain | Soft (guideline) |
| File size budget | Code | Soft (guideline) |

- **Hard** — Must never be violated. Requires governance escalation to amend.
- **Soft** — May be relaxed under documented justification. Require restraint review.

A hard restraint becoming soft requires governance escalation equivalent to amending SYSTEMS_DOCTRINE.md. See §0.4 for the full amendment process.

## 12. Changelog

| Version | Date | Change | Author |
|---|---|---|---|
| 001 | 2026-06-04 | Original ratification | Systems Doctrine & Boundaries Editor |
