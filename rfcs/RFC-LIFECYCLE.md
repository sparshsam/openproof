# OpenProof RFC Lifecycle

This document defines the lifecycle for OpenProof RFCs. It extends the
ecosystem RFC standard into OpenProof-specific infrastructure specifications
without replacing ecosystem governance.

Canonical authority:

https://github.com/sparshsam/ecosystem-standards

## Scope

An OpenProof RFC is required for:

- Stable proof receipt fields or encoding rules.
- Bundle proof construction, ordering, hashing, or canonicalization rules.
- Verification flow states or externally visible verifier behavior.
- Public proof page structure that external implementers may rely on.
- QR verification payloads, resolution behavior, or compatibility rules.
- Any change that affects deterministic guarantees, portability, archival
  behavior, backend minimization, or implementation neutrality.

An OpenProof RFC is not required for:

- Typographic corrections.
- Clarifying comments that do not alter behavior.
- Internal implementation refactors.
- Dependency maintenance that does not affect specified behavior.
- User interface wording outside specified verification states.

## Lifecycle States

| State | Meaning |
|-------|---------|
| Proposal | The RFC is drafted and open for review. It is not authoritative. |
| Review | The RFC is undergoing formal review against ecosystem standards and OpenProof invariants. |
| Accepted | The RFC has been accepted as an OpenProof specification. |
| Implemented | The RFC has at least one conforming implementation in OpenProof. |
| Frozen | The RFC is stable for publication, archival reference, or external implementation. |
| Rejected | The RFC was closed with rationale and is not authoritative. |
| Withdrawn | The RFC was withdrawn before acceptance. |
| Deprecated | The RFC remains historically valid but is no longer recommended. |
| Superseded | The RFC has been replaced by another RFC. |

## Lifecycle Rules

1. Every RFC MUST declare exactly one current status.
2. Proposal and Review RFCs MUST NOT be treated as stable external contracts.
3. Accepted RFCs MAY be implemented, but unresolved implementation variance
   MUST be documented before freeze.
4. Implemented RFCs MUST identify the implementation surface covered.
5. Frozen RFCs MUST NOT receive normative changes except through amendment or
   supersession.
6. Rejected and Withdrawn RFC numbers MUST NOT be reused.
7. Deprecated RFCs MUST include a deprecation reason.
8. Superseded RFCs MUST identify the replacement RFC number.
9. Security corrections MAY bypass ordinary review timing, but the rationale
   MUST be documented.

## Review Requirements

OpenProof RFC review MUST evaluate:

- Alignment with ecosystem standards.
- Deterministic behavior.
- Local-first operation.
- Backend minimization.
- Implementation neutrality.
- Portability of proof artifacts.
- Archival friendliness.
- Publication compatibility.
- Public/private boundary safety.
- Absence of telemetry, token systems, AI scoring, cloud dependency
  requirements, engagement systems, and unnecessary operational bloat.

## Numbering

RFC numbers are sequential within OpenProof. The first foundational sequence is
reserved as:

- RFC-0001: Proof Receipt Format
- RFC-0002: Bundle Proof Determinism
- RFC-0003: Verification Flow
- RFC-0004: Public Proof Page Structure
- RFC-0005: QR Verification Standard

Subsequent RFCs MUST use the next available integer. A number remains consumed
once a file using that number enters Proposal status.

## Amendment Rules

An amendment is a change to an existing RFC that preserves the RFC identity.

Amendments MAY be used for:

- Clarifying normative language without changing behavior.
- Adding examples that do not create new requirements.
- Correcting ambiguity discovered during implementation.
- Adding backward-compatible optional fields.

Amendments MUST NOT be used for:

- Changing receipt verification semantics.
- Replacing canonicalization rules.
- Removing required fields.
- Introducing new trust assumptions.
- Requiring a backend service where the RFC previously allowed local
  verification.

Behavior-changing amendments to Accepted, Implemented, or Frozen RFCs require
formal review. Behavior-changing amendments to Frozen RFCs SHOULD instead be
issued as a superseding RFC.

## Supersession Rules

Supersession is required when a new RFC replaces the normative behavior of an
existing RFC.

A superseding RFC MUST include:

- The RFC number it supersedes.
- A precise list of changed guarantees.
- Compatibility expectations for existing receipts, bundles, pages, or QR
  payloads.
- Migration guidance.
- Failure behavior for implementations that encounter older artifacts.

The superseded RFC MUST retain its historical text and add a status header
identifying the replacement RFC.

## Freeze Discipline

Freeze is a specification stability state. A Frozen RFC means external
implementers, archival systems, and academic reviewers may rely on its
requirements without tracking ordinary repository churn.

Before freeze, an RFC MUST have:

- No unresolved normative questions.
- A complete failure-mode section.
- A complete privacy and security review section.
- Deterministic behavior stated in testable terms.
- Compatibility behavior for unknown fields or older versions.
- No dependency on unpublished private implementation details.

## Relationship to Repository Releases

RFC status and repository release status are related but not identical. A
repository release MAY implement a Proposal or Accepted RFC, but publication
claims MUST distinguish draft behavior from Frozen specifications.
