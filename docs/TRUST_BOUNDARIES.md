# OpenProof Trust Boundaries

**Document ID:** OP-DOCTRINE-TB-001
**Classification:** Permanent trust documentation
**Hierarchy:** Level 2 — peer doctrine (with NON_GOALS and DESIGN_RESTRAINTS)
**Scope:** OpenProof, all deployments and forks
**Authority:** Ecosystem governance standards — [ecosystem-standards](https://github.com/sparshsam/ecosystem-standards)
**Freeze level:** Controlled — trust model is stable, individual trust assessments may evolve.
**Status:** Adopted

**Previous versions:** None (original)
**Supersedes:** None
**Depends on:** [SYSTEMS_DOCTRINE.md](SYSTEMS_DOCTRINE.md) §4 (Frontend Role), §5 (Data Model)

---

## 0. Governance

### 0.1 Document Purpose

This document defines the trust model, trust assumptions, per-component trust analysis, and trust perimeter of OpenProof. It describes which components must be trusted, which are untrusted, and what happens when trust boundaries change.

### 0.2 Hierarchy and Dependencies

This document derives from SYSTEMS_DOCTRINE.md §4 (Frontend Role) and §5 (Data Model). The trust analysis here is an expansion of the principle that the frontend is not authoritative and the onchain state is canonical.

| Document | Relationship |
|---|---|
| [SYSTEMS_DOCTRINE.md](SYSTEMS_DOCTRINE.md) | Parent doctrine — frontend role and data model defined in §4, §5 |
| [NON_GOALS.md](NON_GOALS.md) | Peer — trust model reinforces privacy/analytics exclusions |
| [DESIGN_RESTRAINTS.md](DESIGN_RESTRAINTS.md) | Peer — backend minimization supports untrusted-frontend model |
| [ARCHITECTURAL_INVARIANTS.md](ARCHITECTURAL_INVARIANTS.md) | Enforceable rules — several invariants encode trust boundaries (I-1, I-2, III-4, III-5, VI-1, VI-2) |

### 0.3 Freeze Expectations

- **The trust model structure (§1, §8, §9) is frozen.** The definition of which components are trusted versus untrusted, and the trusted zone composition, are permanent.
- **Individual component analyses (§2–§7) are controlled.** Specific mitigations, threat examples, and dependency details may evolve as external conditions change.
- **Trust evolution conditions (§10) are controlled.** The specific conditions may be refined, but the principle that trust boundary expansion requires governance review is frozen.
- **This governance section (§0) is controlled.**

### 0.4 Amendment Process

Amending this document requires:

1. **Proposal.** A written document describing the change and its rationale.
2. **Parent doctrine check.** Any change must be assessed against SYSTEMS_DOCTRINE.md §4 and §5. If the change contradicts the parent doctrine, SYSTEMS_DOCTRINE.md must be addressed first.
3. **Governance review.** Ecosystem governance review.
4. **Invariant impact.** Assessment against ARCHITECTURAL_INVARIANTS.md — particularly the Contract, Frontend, and Deployment domains.
5. **Version record.** The document footer must be updated with the new version, date, and change summary.

Adding a new component to the trusted zone (§9) requires escalation to ecosystem governance regardless of scope.

### 0.5 Precedence

- SYSTEMS_DOCTRINE.md takes precedence over this document.
- This document and NON_GOALS.md / DESIGN_RESTRAINTS.md are peers. Where they overlap, the more specific document governs.
- This document takes precedence over ARCHITECTURAL_INVARIANTS.md where the invariant would contradict a trust analysis (the invariant must be corrected).

### 0.6 Cross-Document Map

| Referenced Document | Relationship |
|---|---|
| [SYSTEMS_DOCTRINE.md](SYSTEMS_DOCTRINE.md) §4, §5 | Parent doctrine — frontend role and data model |
| [NON_GOALS.md](NON_GOALS.md) | Peer — surveillance/analytics exclusions reinforce trust model |
| [DESIGN_RESTRAINTS.md](DESIGN_RESTRAINTS.md) | Peer — no-backend restraint supports zero-trust frontend |
| [ARCHITECTURAL_INVARIANTS.md](ARCHITECTURAL_INVARIANTS.md) | Enforceable rules — invariant references noted in §0.2 |
| [security-principles.md](security-principles.md) | Operational guidelines referenced in §5 |
| [ecosystem-standards](https://github.com/sparshsam/ecosystem-standards) | External governance authority |

---

## 1. Trust Model Overview

OpenProof minimizes trust requirements by distributing verification power to the user. The only component that must be trusted for a proof to be meaningful is the smart contract — and that trust derives from the blockchain's consensus mechanism and the contract's immutability, not from any human administrator.

```
Trust distribution:

  Smart contract ── Trusted (deterministic, immutable, onchain)
  Frontend       ── Not trusted (convenience layer, independently verifiable)
  Receipt        ── Not authoritative (local artifact, not self-validating)
  Wallet         ── Trusted by user (user controls keys)
  Hosting        ── Not trusted (can serve modified code)
  RPC provider   ── Not trusted (can return false data; cross-verify)
```

## 2. Smart Contract Trust

### 2.1 What Must Be Trusted

The contract's deployed bytecode must match the open-source source code at a known commit. This is verified through BlockScout/BaseScan source code verification.

The contract's behavior must be:

- **Immutable** — no upgradeability, no proxy, no owner functions
- **Deterministic** — same inputs always produce the same outputs
- **Permissionless** — no access control, no fee, no approval gate
- **Non-destructive** — no overwrites, no deletions, no rollbacks

### 2.2 Trust Derivation

Trust in the contract derives from three sources:

1. **Source code transparency.** The full contract source is published. Anyone can audit it.
2. **Onchain verification.** The deployed bytecode hash matches the verified source on BaseScan Sepolia.
3. **Immutability.** No entity can alter the contract after deployment. The contract address is the permanent trust anchor.

### 2.3 Trust Boundary

The contract trusts nothing outside itself. It reads from its own storage, validates its own inputs (`bytes32(0)` rejection), and emits events that serve as an independently verifiable log. It does not call external contracts, delegate to upgradeable proxies, or rely on oracles.

## 3. Frontend Trust

### 3.1 No Trust Required

The frontend is explicitly **not trusted**. Its behavior must be independently reproducible:

- Hashing is performed by the browser's native Web Crypto API, not by JavaScript libraries. The result can be reproduced with `sha256sum` or any SHA-256 tool.
- Contract interactions use the user's wallet (RainbowKit/wagmi), which renders transaction parameters to the user for review before signing.
- Verification queries can be replicated through any block explorer at the known contract address.

### 3.2 What a Compromised Frontend Can Do

A malicious or compromised frontend can:

- Display a different hash than what was actually registered
- Direct the user to a different contract address
- Return false verification results
- Attempt to exfiltrate file bytes (though this requires browser-level access beyond what typical static hosting provides)

### 3.3 What a Compromised Frontend Cannot Do

A compromised frontend cannot:

- Register a proof on the user's behalf without the user signing a transaction (wallet gating)
- Modify onchain state (limited by the contract's interface and the user's wallet)
- Forge a proof in the canonical registry (requires transaction signing)
- Alter past onchain records (immutable contract)

### 3.4 Mitigation Pattern

For high-stakes proofs, the user should:

1. Compute `sha256sum` of the file using a trusted offline tool
2. Cross-reference the contract address against the canonical address from a trusted source
3. Verify the onchain record through a block explorer, not through the OpenProof frontend

This three-way check eliminates reliance on the frontend.

## 4. Wallet Trust

### 4.1 User-to-Wallet Trust

The user trusts their wallet to:

- Securely manage private keys
- Correctly render transaction parameters for review
- Sign only the transactions the user approves
- Broadcast to the correct chain

Wallet security is outside OpenProof's scope. OpenProof interacts with wallets through standard wagmi/RainbowKit interfaces and does not handle private keys, seed phrases, or signing material.

### 4.2 Wallet-to-Contract Trust

The wallet interacts with the contract through the user's signed transactions. The wallet does not need to trust the frontend — it renders the raw transaction parameters (function selector, arguments, value, target address) for the user to approve.

## 5. Hosting Trust

### 5.1 Vercel (Default Deployment)

The default deployment serves the frontend from Vercel's CDN. Trust assumptions:

- Vercel serves the correct build artifact (not a modified version)
- Vercel's build pipeline produces deterministic output from the same source
- Vercel's TLS configuration is correct and current
- Vercel does not inject scripts, modify assets, or alter behavior

These assumptions are **not independently verifiable by end users** without self-hosting. Users who require verifiable hosting should self-host the static export.

### 5.2 Self-Hosted Deployments

Self-hosting shifts trust from Vercel to the operator's hosting infrastructure. The relevant trust assumptions are:

- The server delivers the correct build artifact
- TLS is properly configured
- The build artifact matches a known-good build from the source repository

See [security-principles.md](security-principles.md) for self-hosting verification steps.

## 6. RPC Provider Trust

### 6.1 Read Path

Verification depends on RPC queries to the blockchain. A malicious RPC provider can:

- Return false responses to `getProof` calls (claiming a proof does not exist when it does, or vice versa)
- Return stale data from a fork or replay
- Block access to specific contracts or functions
- Correlate user IP addresses with queried hashes

### 6.2 Mitigation

- Verification can be performed through any RPC endpoint that can read the target chain
- Multiple RPC providers can be compared for agreement
- Independent verification through a block explorer does not use OpenProof's RPC configuration
- For high-stakes verification, run a personal RPC node

### 6.3 Write Path

The RPC provider has no influence on the write path beyond transaction relay. A signed transaction is valid regardless of which RPC node relays it. The RPC provider cannot modify the transaction or create fraudulent transactions.

## 7. User Trust

OpenProof does not trust the user in any security-critical sense. The user is an untrusted participant in the protocol:

- Any user can register any previously unregistered hash
- No user can overwrite or delete another user's proof
- No user can forge a proof for a hash they did not register (requires the signing wallet)
- No user can prevent another user from registering a proof

The user's own trust concern is that their wallet key remains under their control. OpenProof does not mitigate wallet key exposure, loss, or theft.

## 8. Cross-Component Trust Summary

| From → To | Trust Required | Basis |
|---|---|---|
| User → Contract | Full | Immutable, open-source, onchain-verified |
| User → Frontend | None | Independently reproducible |
| User → Wallet | Full (key management) | Outside OpenProof scope |
| User → Hosting | None for verification | Self-host or cross-verify |
| User → RPC | None | Cross-verify with multiple providers |
| Contract → External | None | Self-contained, no oracles |
| Frontend → Contract | Read-only | Public RPC or direct node query |
| Wallet → Contract | Per-transaction | User-reviewed signing |
| Receipt → Onchain state | Receipt is not authoritative | Must match onchain record |

## 9. Trust Perimeter Diagram

```
                    ┌──────────────────────────────┐
                    │       Trusted Zone           │
                    │                              │
                    │  ┌──────────────────────┐    │
                    │  │  Smart Contract      │    │
                    │  │  (immutable, onchain) │    │
                    │  └──────────────────────┘    │
                    │                              │
                    │  ┌──────────────────────┐    │
                    │  │  User's Wallet       │    │
                    │  │  (key management)    │    │
                    │  └──────────────────────┘    │
                    └──────────────────────────────┘

                    ┌──────────────────────────────┐
                    │     Untrusted Zone           │
                    │                              │
                    │  Frontend (convenience)      │
                    │  Hosting (delivery)          │
                    │  RPC Provider (reads)        │
                    │  Receipt JSON (artifact)     │
                    │  Local storage (ephemeral)   │
                    └──────────────────────────────┘
```

The trusted zone is minimal: the contract and the user's wallet. Everything else is convenience infrastructure that is independently verifiable or replaceable.

## 10. Trust Evolution

Trust boundaries change only under these conditions:

- **Contract upgrade.** A new deployment to a different chain or address shifts the trust anchor. Users must verify the new contract address from a trusted source.
- **Receipt schema change.** A new schema version changes what data a receipt carries but does not change onchain trust. Old receipts remain valid against the old schema.
- **Hosting migration.** Moving from Vercel to another host shifts hosting trust from one provider to another. Self-hosted users manage their own hosting trust.
- **Wallet connector change.** Switching from RainbowKit to another connector changes the wallet trust interface. The core assumption (user controls keys) remains unchanged.

No trust boundary expansion — adding a component that requires trust — is permitted without governance review. See §0.4 for the amendment process.

## 11. Changelog

| Version | Date | Change | Author |
|---|---|---|---|
| 001 | 2026-06-04 | Original ratification | Systems Doctrine & Boundaries Editor |
