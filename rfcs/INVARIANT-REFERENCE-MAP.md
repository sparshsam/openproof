# OpenProof Invariant Reference Map

This map records the canonical invariants that constrain OpenProof RFCs. It is
an integration aid, not a governance expansion.

Canonical ecosystem authority remains:

https://github.com/sparshsam/ecosystem-standards

## Source Standards

| Ecosystem source | OpenProof use |
|------------------|---------------|
| `standards/repository-doctrine.md` | Restrained infrastructure language, honest representation, maintained-system posture. |
| `standards/rfc-standard.md` | RFC lifecycle basis, numbering discipline, review expectations. |
| `standards/documentation-standard.md` | Formal specification expectations for canonical infrastructure. |
| `standards/architecture-standard.md` | System boundaries, external dependency disclosure, risk and failure-mode discipline. |
| `standards/public-private-boundary.md` | Public proof pages and receipts must avoid leaking private operational details. |
| `standards/repo-maturity-model.md` | Freeze and publication-readiness language must not overclaim repository maturity. |
| `standards/security-standard.md` | Secret safety and explicit failure behavior. |

## OpenProof Doctrine Sources

| OpenProof source | RFC-layer use |
|------------------|---------------|
| [`../docs/SYSTEMS_DOCTRINE.md`](../docs/SYSTEMS_DOCTRINE.md) | Root OpenProof doctrine, deterministic receipts, scope boundary, freeze hierarchy. |
| [`../docs/ARCHITECTURAL_INVARIANTS.md`](../docs/ARCHITECTURAL_INVARIANTS.md) | Enforceable invariant register, receipt invariants, deployment invariants, freeze invariants. |
| [`../docs/TRUST_BOUNDARIES.md`](../docs/TRUST_BOUNDARIES.md) | Trust boundaries for frontend, receipts, registry state, and verification surfaces. |
| [`../docs/NON_GOALS.md`](../docs/NON_GOALS.md) | Permanent exclusions that RFCs must preserve. |
| [`../docs/DESIGN_RESTRAINTS.md`](../docs/DESIGN_RESTRAINTS.md) | Implementation restraints and backend-minimal design constraints. |
| [`../docs/architecture.md`](../docs/architecture.md) | System architecture, data flow, receipt portability, and verification architecture. |
| [`../docs/receipt-schema.md`](../docs/receipt-schema.md) | Canonical receipt schema and compatibility behavior. |

## OpenProof Invariants

| Invariant | Meaning | RFC references |
|-----------|---------|----------------|
| Deterministic verification | Same receipt, same canonical bytes, same algorithms, and same supported rules produce the same verification result. | RFC-0001, RFC-0002, RFC-0003, RFC-0005 |
| Portable receipts | Receipts are UTF-8 JSON artifacts that can be stored, transmitted, and verified without a proprietary runtime. | RFC-0001, RFC-0004, RFC-0005 |
| Local-first operation | Verification works locally when receipt and artifact bytes are available. | RFC-0001, RFC-0003, RFC-0005 |
| Backend minimization | Remote services may transport receipts or pages but are not verification authorities. | RFC-0001, RFC-0003, RFC-0004, RFC-0005 |
| Implementation neutrality | Specifications define observable behavior, not a required language, framework, vendor, or hosting model. | All RFCs |
| Explicit trust boundaries | Receipts, public pages, QR codes, producer metadata, and transport security are not trust roots. | RFC-0001, RFC-0003, RFC-0004, RFC-0005 |
| Archival friendliness | Historical RFCs and proof artifacts remain interpretable without private systems or mutable backend state. | RFC-LIFECYCLE, RFC-0001, RFC-0002, RFC-0004 |
| Fail-closed verification | Unsupported, malformed, missing, or contradictory inputs are not reported as valid. | RFC-0001, RFC-0002, RFC-0003, RFC-0005 |
| Public/private boundary safety | Public proof material must avoid unnecessary personal data, local paths, operational details, or private repository information. | RFC-0001, RFC-0002, RFC-0004, RFC-0005 |
| Permanent exclusions | Token systems, telemetry requirements, AI scoring, engagement mechanics, cloud dependency requirements, and repository-local governance mechanics remain out of scope. | CONTRIBUTING, RFC-LIFECYCLE, all RFC non-goals |

## Freeze Interpretation

Freeze applies to specification stability, not to claims of legal validity,
external endorsement, security certification, or repository maturity. A Frozen
OpenProof RFC means the specified behavior is stable for implementation and
archival reference under the ecosystem standards lifecycle.
