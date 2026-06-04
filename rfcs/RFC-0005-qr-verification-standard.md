# RFC-0005: QR Verification Standard

- **Status:** Proposal
- **Author:** OpenProof RFC Architect
- **Date:** 2026-06-04
- **Supersedes:** None
- **Superseded By:** None
- **Related RFCs:** RFC-0001, RFC-0003, RFC-0004

## Canonical References

This RFC resolves to RFC-0001 receipts, uses the verification behavior in
RFC-0003, and may reference public proof pages conforming to RFC-0004. It is
governed by `RFC-LIFECYCLE.md`, constrained by `INVARIANT-REFERENCE-MAP.md`,
and uses shared terms from `TERMINOLOGY.md`.

## Freeze-State Note

This RFC is in Proposal status. QR payload forms MUST NOT be represented as
frozen until this RFC reaches Frozen status under `RFC-LIFECYCLE.md`.

## Abstract

This RFC defines the OpenProof QR verification standard. QR payloads provide a
compact way to locate or carry proof metadata while preserving deterministic,
local-first verification semantics.

## Motivation

QR codes are useful for printed documents, public proof pages, and offline
handoff. Without a stable payload standard, QR verification may become dependent
on proprietary links, ambiguous page states, or backend-only interpretation.

## Terminology

- **QR payload:** The string encoded in a QR code.
- **Resolver:** Software that interprets a QR payload and obtains receipt
  metadata.
- **Inline receipt:** Receipt JSON carried directly in the QR payload.
- **Reference payload:** QR payload containing a URL or identifier used to
  retrieve receipt metadata.

## Specification

### Payload Forms

OpenProof QR payloads MUST use one of two forms:

1. Reference payload.
2. Inline payload.

Conforming verifiers MUST support reference payloads. Inline payloads MAY be
supported where size constraints permit.

### Reference Payload

A reference payload MUST be an HTTPS URL or a URI using the `openproof:` scheme.

HTTPS reference payloads SHOULD resolve to a public proof page conforming to
RFC-0004 or directly to receipt JSON conforming to RFC-0001.

An `openproof:` URI MUST use this form:

```text
openproof:v1?url=<percent-encoded-url>&digest=<receipt-digest>
```

The `url` parameter MUST identify a public proof page or receipt JSON. The
`digest` parameter SHOULD contain a digest of the canonical receipt JSON when
available.

### Inline Payload

An inline payload MUST use this form:

```text
openproof:v1;receipt=<base64url-json>
```

The decoded value MUST be UTF-8 JSON conforming to RFC-0001. Base64url padding
MAY be omitted.

### Resolution Behavior

A verifier processing a QR payload MUST:

1. Parse the payload.
2. Identify whether it is reference or inline.
3. Retrieve or decode receipt metadata.
4. Validate receipt structure.
5. Perform verification according to RFC-0003.

If artifact bytes are not available, the verifier MUST report an
indeterminate result rather than a valid result.

## Trust Boundary

The QR payload is a locator or compact receipt carrier. Successful scanning,
payload parsing, URL resolution, or page loading MUST NOT be treated as proof of
artifact validity. Validity depends on the verification flow in RFC-0003.

### URL Requirements

Reference URLs MUST NOT require authentication for receipt metadata retrieval.
They SHOULD use HTTPS. Non-HTTPS URLs MUST be treated as warnings or refused by
security-sensitive verifiers.

### Receipt Digest Parameter

When a reference payload includes `digest`, the verifier SHOULD compare it with
the digest of the retrieved canonical receipt JSON. A mismatch MUST be reported
as retrieval or substitution failure.

## Deterministic Guarantees

For the same QR payload and same retrieved receipt bytes, conforming resolvers
MUST identify the same payload form and produce the same receipt input to the
verification flow.

QR scan time, device identity, resolver implementation name, and network path
MUST NOT affect verification semantics.

## Security Considerations

QR codes can point to substituted, expired, or malicious pages. Verifiers MUST
not infer validity from successful QR scanning. If a payload includes a receipt
digest, verifiers MUST treat digest mismatch as a failure.

Resolvers SHOULD display the destination host before network retrieval when
operating in interactive contexts. Resolvers MUST NOT execute remote page
scripts to obtain receipt metadata when a direct JSON link or embedded receipt
is available.

## Privacy Considerations

QR scanning MUST NOT require telemetry, account login, or device registration.
Resolvers SHOULD avoid transmitting artifact bytes during QR resolution.

QR payloads may expose public URLs, subject identifiers, and receipt digests.
Producers SHOULD avoid embedding personal data directly in inline payloads.

## Failure Modes

Conforming QR resolvers MUST distinguish at least:

- `malformed_qr_payload`
- `unsupported_qr_version`
- `unsupported_payload_form`
- `receipt_decode_failed`
- `receipt_retrieval_failed`
- `receipt_digest_mismatch`
- `malformed_receipt`
- `artifact_bytes_unavailable`

## Future Compatibility

Future QR versions MUST use a version marker distinct from `v1`. Verifiers that
encounter unsupported versions MUST report `unsupported_qr_version`.

Additional query parameters MAY be added to `openproof:v1` reference payloads,
but unknown parameters MUST NOT alter verification semantics.

## Explicit Non-Goals

This RFC does not define:

- QR visual styling.
- QR placement on documents.
- Centralized resolver services.
- Account-based verification.
- Telemetry.
- Link shortening services.
- Claims about legal validity.
