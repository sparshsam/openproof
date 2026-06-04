# RFC-0004: Public Proof Page Structure

- **Status:** Proposal
- **Author:** OpenProof RFC Architect
- **Date:** 2026-06-04
- **Supersedes:** None
- **Superseded By:** None
- **Related RFCs:** RFC-0001, RFC-0003, RFC-0005

## Canonical References

This RFC presents RFC-0001 receipt metadata for verification flows defined by
RFC-0003 and QR resolution defined by RFC-0005. It is governed by
`RFC-LIFECYCLE.md`, constrained by `INVARIANT-REFERENCE-MAP.md`, and uses shared
terms from `TERMINOLOGY.md`.

## Freeze-State Note

This RFC is in Proposal status. Public proof page requirements MUST NOT be
represented as frozen until this RFC reaches Frozen status under
`RFC-LIFECYCLE.md`.

## Abstract

This RFC defines the minimal structure of an OpenProof public proof page. A
public proof page presents proof receipt metadata and verification instructions
without becoming a required trust authority or backend dependency.

## Motivation

OpenProof receipts may be shared through public URLs for human inspection and
QR resolution. External implementers need a stable page contract that supports
verification while preserving local-first behavior and avoiding unnecessary
data exposure.

## Terminology

- **Public proof page:** A web page that exposes receipt metadata for a proof.
- **Receipt metadata:** The proof receipt or a structured subset sufficient to
  retrieve or inspect it.
- **Verification affordance:** A link, download, copy action, or instruction
  that helps a verifier obtain proof metadata.

## Specification

### Required Page Properties

A public proof page MUST:

- Identify itself as an OpenProof proof page.
- Display the receipt status without overstating validity.
- Provide the subject name or declared subject identifier.
- Provide the declared digest algorithm.
- Provide the declared subject digest.
- Provide the receipt creation timestamp.
- Provide access to the complete proof receipt as JSON.
- State whether artifact bytes are available on the page.
- Avoid requiring login for receipt inspection.

### Receipt Access

The page MUST provide the full receipt JSON by at least one of:

- A direct `.json` link.
- A `<script type="application/json" id="openproof-receipt">` block.
- A copyable canonical JSON block.

If multiple forms are provided, they MUST describe the same receipt.

### Validity Language

A public proof page MUST distinguish:

- Receipt available.
- Receipt structurally valid.
- Artifact bytes verified.
- Artifact bytes unavailable.

The page MUST NOT state or imply that proof is valid solely because the page
exists or loads successfully.

### Metadata

The page MAY display:

- Producer name and version.
- Bundle member list.
- QR payload.
- Public URL.
- Non-normative metadata.

The page MUST NOT require analytics scripts, account sessions, or external
tracking resources for verification-relevant content.

### Machine-Readable Metadata

The page SHOULD include machine-readable metadata sufficient for verifiers to
locate the receipt JSON. Acceptable mechanisms include:

- `<link rel="alternate" type="application/json" href="...">`
- Embedded JSON receipt block.
- Well-labeled canonical JSON download link.

## Trust Boundary

The public proof page is a publication and retrieval surface. It may expose
receipt metadata, but it is not a verification authority. The receipt and
artifact bytes remain the verification evidence.

## Deterministic Guarantees

The public page is not itself the proof. Deterministic verification depends on
the receipt and artifact bytes.

If a page embeds receipt JSON, the embedded receipt MUST match the downloadable
receipt byte-for-byte after canonical serialization or MUST report the
difference as non-canonical presentation.

## Security Considerations

A public proof page is a transport and presentation surface, not a trust root.
Verifiers MUST NOT treat HTTPS retrieval, page branding, page availability, or
visual status labels as substitutes for digest verification.

Pages SHOULD avoid executing third-party scripts on verification-relevant
content. If scripts are used for presentation, receipt JSON MUST remain
accessible without script execution.

## Privacy Considerations

Public proof pages expose any displayed receipt fields. Producers SHOULD avoid
publishing personal data, local file paths, private filenames, or sensitive
bundle structure unless publication is intentional.

The page MUST NOT require artifact upload for ordinary receipt inspection.

## Failure Modes

Conforming verifiers or page checkers SHOULD distinguish:

- `receipt_json_unavailable`
- `receipt_json_mismatch`
- `page_unavailable`
- `page_requires_authentication`
- `artifact_bytes_unavailable`
- `malformed_embedded_receipt`
- `conflicting_page_metadata`

## Future Compatibility

Future RFCs MAY define a stricter HTML profile or well-known receipt endpoint.
Such additions MUST preserve direct access to receipt JSON and MUST NOT require
a centralized backend.

Unknown page metadata MUST NOT affect verification results unless a later RFC
defines it as normative.

## Explicit Non-Goals

This RFC does not define:

- Page visual design.
- Hosting provider requirements.
- Search indexing behavior.
- Analytics.
- Account systems.
- Artifact storage obligations.
- Legal notice language.
