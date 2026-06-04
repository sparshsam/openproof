# OpenProof RFC Index

This directory contains OpenProof Request for Comments documents.

OpenProof RFCs specify stable infrastructure behavior for proof receipts,
bundle proofs, verification flows, public proof pages, and QR verification.
They are repository-local specifications governed by the canonical ecosystem
standards repository:

https://github.com/sparshsam/ecosystem-standards

OpenProof RFCs do not create an independent governance system. Repository
governance, documentation standards, terminology discipline, publication
readiness, public/private boundaries, maturity expectations, and freeze
discipline remain subordinate to ecosystem-wide standards.

## Directory Structure

```text
rfcs/
|-- README.md
|-- CONTRIBUTING.md
|-- COHERENCE-PASS-REPORT.md
|-- DOCTRINE-ALIGNMENT-UPDATES.md
|-- INVARIANT-REFERENCE-MAP.md
|-- RFC-LIFECYCLE.md
|-- RFC-STATE-MODEL.md
|-- TERMINOLOGY.md
|-- RFC-0001-proof-receipt-format.md
|-- RFC-0002-bundle-proof-determinism.md
|-- RFC-0003-verification-flow.md
|-- RFC-0004-public-proof-page-structure.md
|-- RFC-0005-qr-verification-standard.md
|-- test-vectors/
`-- templates/
    `-- RFC-0000-template.md
```

## RFC Index

| RFC | Title | Status | Scope |
|-----|-------|--------|-------|
| RFC-0001 | Proof Receipt Format | Proposal | Portable receipt structure and canonical fields |
| RFC-0002 | Bundle Proof Determinism | Proposal | Deterministic bundle proof construction |
| RFC-0003 | Verification Flow | Proposal | Local-first verifier behavior and result states |
| RFC-0004 | Public Proof Page Structure | Proposal | Minimal public proof page contract |
| RFC-0005 | QR Verification Standard | Proposal | QR payload, resolution, and verification behavior |

## Status Values

OpenProof RFC status values are defined in
[`RFC-LIFECYCLE.md`](RFC-LIFECYCLE.md). They are aligned with the ecosystem RFC
standard and adapted only where OpenProof needs implementation freeze states.

## Canonical Invariants

OpenProof RFCs are constrained by the invariant map in
[`INVARIANT-REFERENCE-MAP.md`](INVARIANT-REFERENCE-MAP.md). These invariants are
not a separate governance system; they are OpenProof-specific applications of
ecosystem doctrine, architecture discipline, public/private boundary rules, and
RFC lifecycle expectations.

## Terminology

Shared terminology is maintained in [`TERMINOLOGY.md`](TERMINOLOGY.md). RFCs may
define additional local terms, but they MUST NOT redefine shared terms in a
conflicting way.

## Coherence Artifacts

The refinement pass is recorded in
[`COHERENCE-PASS-REPORT.md`](COHERENCE-PASS-REPORT.md). Doctrine alignment
updates are summarized in
[`DOCTRINE-ALIGNMENT-UPDATES.md`](DOCTRINE-ALIGNMENT-UPDATES.md).

## Numbering

OpenProof RFCs use the format `RFC-NNNN`, where `NNNN` is a zero-padded
integer. Numbers are assigned sequentially within OpenProof and must not be
reused after withdrawal, rejection, deprecation, or supersession.

## Normative Language

The words "MUST", "MUST NOT", "SHOULD", "SHOULD NOT", and "MAY" are used in
their ordinary standards-engineering sense. OpenProof RFCs avoid product,
marketing, roadmap, engagement, telemetry, token, and social-governance
language.

## Canonical Authority

If an OpenProof RFC conflicts with `ecosystem-standards`, the ecosystem
standard takes precedence unless the ecosystem standard is amended through its
own RFC process.
