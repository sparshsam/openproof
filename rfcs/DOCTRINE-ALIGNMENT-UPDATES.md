# OpenProof Doctrine Alignment Updates

This document records the doctrine-alignment updates made during the RFC
integration hardening pass. It is descriptive and does not create new
governance authority.

## Ecosystem Authority

The RFC index, lifecycle, template, and numbered RFCs now state or reference
that ecosystem-wide governance remains authoritative through:

https://github.com/sparshsam/ecosystem-standards

## OpenProof Doctrine References

The RFC layer now references the live OpenProof doctrine and architecture
documents:

- `docs/SYSTEMS_DOCTRINE.md`
- `docs/ARCHITECTURAL_INVARIANTS.md`
- `docs/TRUST_BOUNDARIES.md`
- `docs/NON_GOALS.md`
- `docs/DESIGN_RESTRAINTS.md`
- `docs/architecture.md`
- `docs/receipt-schema.md`

## Maintained-System Posture

The RFC layer now distinguishes:

- Proposal status from Frozen status.
- Specification stability from repository maturity.
- Receipt availability from verified artifact validity.
- Public page availability from verification success.
- Receipt schema validity from onchain proof verification.

This preserves honest representation and avoids overclaiming maturity,
security, or capability.

## Architecture Boundary Alignment

The RFC layer now explicitly identifies trust boundaries:

- RFC-0001: receipt fields are not all trust inputs.
- RFC-0002: bundle manifests and member digests are evidence; filesystem and
  archive metadata are not trust anchors.
- RFC-0003: verification evidence is limited to evaluated receipts and bytes.
- RFC-0004: public proof pages are retrieval and presentation surfaces.
- RFC-0005: QR payloads are locators or compact receipt carriers.

RFC-0001 now explicitly defers receipt field semantics to
`docs/receipt-schema.md` and `src/lib/receipt.ts`.

## Public/Private Boundary Alignment

The RFC layer preserves public/private boundary discipline by requiring or
recommending exclusion of:

- Local filesystem paths unless explicitly chosen.
- Sensitive member names or private structure where logical names suffice.
- Personal data in public proof pages and QR payloads.
- Private implementation details as verification requirements.

## Permanent Exclusions

The pass confirmed and cross-referenced permanent exclusions for:

- Token systems.
- Repository-local governance mechanics.
- Social trust systems.
- Telemetry requirements.
- AI scoring.
- Cloud dependency requirements.
- Engagement systems.
- Product or roadmap claims.

## No Scope Expansion

No new protocol feature, roadmap RFC, governance mechanism, or speculative
system was introduced. The changes are limited to cross-references,
terminology, trust-boundary language, freeze-state language, and coherence
documentation.
