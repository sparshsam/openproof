# RFC-0003: Verification Flow

- **Status:** Proposal
- **Author:** OpenProof RFC Architect
- **Date:** 2026-06-04
- **Supersedes:** None
- **Superseded By:** None
- **Related RFCs:** RFC-0001, RFC-0002, RFC-0004, RFC-0005

## Canonical References

This RFC coordinates verification behavior for RFC-0001 receipts, RFC-0002
bundles, RFC-0004 public proof pages, and RFC-0005 QR payloads. It is governed
by `RFC-LIFECYCLE.md`, constrained by `INVARIANT-REFERENCE-MAP.md`, and uses
shared terms from `TERMINOLOGY.md`.

## Freeze-State Note

This RFC is in Proposal status. Result states and reason codes MUST NOT be
represented as frozen until this RFC reaches Frozen status under
`RFC-LIFECYCLE.md`.

## Abstract

This RFC defines the OpenProof verification flow and result states. Verification
is a deterministic comparison between supplied artifacts and proof metadata,
designed to operate locally and without reliance on a persistent backend.

## Motivation

Implementers need consistent verification behavior across command-line tools,
web pages, local applications, and QR flows. A shared flow prevents silent
acceptance, ambiguous status wording, and backend-dependent verification
semantics.

## Terminology

- **Claimed receipt:** The receipt presented for verification.
- **Computed digest:** Digest calculated by the verifier from supplied bytes.
- **Evidence input:** Artifact bytes, bundle members, or receipt metadata used
  during verification.
- **Verification result:** Structured outcome emitted by a verifier.
- **Verifier:** Software performing verification.

## Specification

### Inputs

A verifier MAY accept:

- A proof receipt.
- One artifact.
- A set of bundle members.
- A QR payload resolving to a receipt or public proof page.
- A public proof page containing receipt metadata.

When artifact bytes are available, verification MUST compute digests locally.
When artifact bytes are not available, the verifier MUST report that content
verification was not performed.

### Verification Steps

A conforming verifier MUST:

1. Parse the receipt.
2. Validate required fields and field types.
3. Validate supported `schemaVersion` and `receiptVersion` behavior.
4. Validate supported `hashAlgorithm`.
5. Resolve proof type and bundle rule version when applicable.
6. Compute artifact or bundle digests when bytes are supplied.
7. Compare computed values with receipt values.
8. Emit a structured verification result.

### Result States

The primary result state MUST be one of:

| State | Meaning |
|-------|---------|
| `valid` | Supplied evidence matches the receipt. |
| `invalid` | Supplied evidence contradicts the receipt. |
| `indeterminate` | Verification could not complete because required evidence or support is unavailable. |
| `malformed` | The receipt or payload is structurally invalid. |

The result MUST include a machine-readable reason code.

### Required Reason Codes

Verifiers MUST support:

- `digest_match`
- `digest_mismatch`
- `bundle_hash_match`
- `bundle_hash_mismatch`
- `missing_artifact_bytes`
- `missing_bundle_member`
- `unsupported_algorithm`
- `unsupported_canonicalization`
- `unsupported_version`
- `malformed_receipt`
- `malformed_qr_payload`
- `network_unavailable`
- `retrieval_failed`

### Local-First Requirement

Verification MUST NOT require account login, telemetry submission, remote
attestation, or backend state when the receipt and artifact bytes are available
locally.

Remote retrieval MAY be used to obtain a receipt or public proof page, but
remote retrieval MUST NOT replace local digest verification when bytes are
available.

### Output

A verification result SHOULD include:

- `state`
- `reason_code`
- `receipt_digest` when applicable
- `sha256Hash`
- `computed_digest` when artifact bytes are supplied
- `verified_at`
- `warnings`

Human-readable output MUST NOT describe an indeterminate result as valid.

## Trust Boundary

Verification evidence consists of the receipt and the artifact or bundle bytes
actually evaluated by the verifier. Public pages, QR codes, producer labels,
network retrieval success, and visual presentation are transport or descriptive
inputs and MUST NOT be treated as proof of validity.

## Deterministic Guarantees

For the same receipt, evidence bytes, canonicalization rules, and supported
algorithm set, a conforming verifier MUST produce the same primary result state
and reason code.

Display language MAY vary across implementations, but machine-readable states
and reason codes MUST remain stable.

## Security Considerations

Verifiers MUST fail closed for malformed receipts, unsupported algorithms, and
unsupported canonicalization. They MUST NOT infer validity from a public page,
QR code, URL, producer name, or successful network retrieval.

Remote content retrieval introduces substitution risk. When a receipt is
retrieved remotely, the verifier SHOULD identify the retrieval source in the
result and SHOULD allow the user to inspect the receipt.

## Privacy Considerations

Local verification SHOULD avoid transmitting artifact bytes. If remote
retrieval is used, implementations SHOULD retrieve only the minimum proof page
or receipt metadata required.

Verification flows MUST NOT require telemetry, account identifiers, analytics,
or remote logging.

## Failure Modes

Conforming verifiers MUST report failures explicitly. They MUST NOT collapse
all failures into a generic invalid state.

Expected failure modes include:

- Receipt parse failure.
- Unsupported version.
- Unsupported digest algorithm.
- Unsupported canonicalization.
- Missing artifact bytes.
- Missing bundle member.
- Digest mismatch.
- Network retrieval failure.
- QR payload parse failure.

## Future Compatibility

New result reason codes MAY be added. Existing primary states MUST retain their
meaning unless superseded by a later RFC.

Implementations encountering unknown reason codes from another verifier SHOULD
display them as warnings rather than treating them as successful verification.

## Explicit Non-Goals

This RFC does not define:

- Visual design of verifier interfaces.
- Remote trust services.
- Identity verification.
- Legal claims about evidence.
- Analytics, telemetry, or usage reporting.
- AI-based authenticity scoring.
