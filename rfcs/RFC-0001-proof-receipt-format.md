# RFC-0001: Proof Receipt Format

- **Status:** Proposal
- **Author:** OpenProof RFC Architect
- **Date:** 2026-06-04
- **Supersedes:** None
- **Superseded By:** None
- **Related RFCs:** RFC-0002, RFC-0003, RFC-0004, RFC-0005

## Canonical References

This RFC is governed by `RFC-LIFECYCLE.md` and constrained by
`INVARIANT-REFERENCE-MAP.md`. Shared terms are defined in `TERMINOLOGY.md`.
Ecosystem governance, public/private boundary rules, and publication maturity
remain controlled by `ecosystem-standards`.

The canonical OpenProof receipt specification is
[`../docs/receipt-schema.md`](../docs/receipt-schema.md).

The canonical schema implementation is
[`../src/lib/receipt.ts`](../src/lib/receipt.ts).

Receipt test vectors are reserved under
[`test-vectors/`](test-vectors/). Before this RFC can enter Frozen status, that
directory MUST contain receipt fixtures covering valid current receipts,
accepted legacy receipts, malformed receipts, and bundle receipts.

## Freeze-State Note

This RFC is in Proposal status. It MUST NOT be represented as frozen,
publication-stable, or externally canonical until it reaches Frozen status
under `RFC-LIFECYCLE.md`.

## Abstract

This RFC specifies the OpenProof proof receipt as a portable JSON artifact
defined by the canonical receipt schema. A receipt records proof metadata,
onchain context, and verification links while remaining locally stored and
user-controlled.

## Motivation

OpenProof requires a stable receipt contract so receipts can be downloaded,
stored, archived, imported, and verified without relying on browser history,
frontend state, or a server-side receipt registry. The RFC layer records the
normative role of the existing receipt schema without introducing a parallel
format.

## Terminology

- **Artifact:** The file or bundle whose hash is registered and later verified.
- **Canonical receipt schema:** The field contract documented in
  `docs/receipt-schema.md`.
- **Canonical schema implementation:** The TypeScript receipt type, builder,
  and validator in `src/lib/receipt.ts`.
- **Onchain registry:** The deployed OpenProofRegistry contract containing the
  canonical proof state for registered hashes.
- **Proof receipt:** A JSON artifact containing proof metadata, onchain context,
  and verification instructions.
- **Receipt validator:** Software that checks receipt structure and field
  validity before onchain verification.
- **Verifier:** Software that evaluates a receipt and artifact against the
  onchain registry.

## Specification

### Normative Schema Source

The normative receipt field set, versioning rules, validation rules, and
backward-compatibility behavior are defined in `docs/receipt-schema.md`.

Implementations MUST NOT use the field names from this RFC as an alternate
schema if they conflict with `docs/receipt-schema.md`. In case of conflict
inside the OpenProof repository, `docs/receipt-schema.md` and
`src/lib/receipt.ts` are the canonical receipt references until this RFC is
accepted and frozen through the RFC lifecycle.

### Encoding

Receipts MUST be valid JSON objects encoded as UTF-8.

Newly produced receipts MUST conform to the current schema version documented in
`docs/receipt-schema.md`. At the time of this RFC draft, the current receipt
uses:

- `schemaVersion`
- `receiptVersion`
- `appName`
- `appVersion`
- `proofType`
- `hashAlgorithm`
- `fileName`
- `fileSize`
- `fileMimeType`
- `sha256Hash`
- onchain metadata fields
- `createdTimestamp`
- verification link and instruction fields

Bundle receipts additionally use the bundle fields documented by the canonical
receipt schema.

### Versioning

Receipts MUST carry schema version information as defined by the canonical
receipt specification. Receipts without explicit version fields are handled only
according to the backward-compatibility rules in `docs/receipt-schema.md`.

Version fields MUST describe receipt structure and receipt semantics. They MUST
NOT be used as product roadmap markers or deployment identifiers.

### Validation

Receipt validation MUST be local. A conforming validator MUST check field
presence, field types, supported proof type, supported hash algorithm, hex
format, timestamp validity, bundle consistency, and schema-version behavior as
defined by the canonical receipt specification.

A structurally valid receipt is not sufficient proof by itself. Verification
requires checking the receipt hash and supplied artifact evidence against the
onchain registry according to RFC-0003.

### Receipt Authority

The receipt is a portable record. The onchain registry is the authoritative
state for whether a hash was registered. Browser history, downloaded receipts,
public proof pages, QR payloads, and frontend state MUST NOT replace onchain
verification.

### Unknown Fields

Unknown receipt fields MUST NOT affect verification unless a later accepted RFC
or schema version explicitly assigns them verification semantics. Validators MAY
preserve unknown fields for archival purposes, but MUST NOT treat them as trust
anchors.

## Trust Boundary

The receipt is evidence only when evaluated with the artifact or bundle bytes
and the onchain registry state. Informational fields such as file name,
application version, verification instructions, transaction URL, and display
metadata do not establish validity by themselves.

The frontend that creates or imports a receipt is not authoritative. It may
construct, validate, display, or export receipt JSON, but the registry state and
local hash computation remain the verification boundary.

## Deterministic Guarantees

Receipt generation MUST use deterministic values available at proof time as
defined by the canonical receipt schema and systems doctrine. It MUST NOT depend
on server-produced identifiers, randomness, telemetry state, account sessions,
or mutable backend records.

For identical proof inputs, onchain context, schema version, and receipt
construction rules, conforming implementations SHOULD produce equivalent
receipt content under the canonical schema. Display formatting of downloaded
JSON MAY vary and is not itself the proof.

## Security Considerations

A receipt does not prove authorship, ownership, authorization, legal custody, or
external endorsement. It records metadata needed to re-check registry state.

Validators MUST fail closed when:

- The receipt is not a JSON object.
- Required fields are missing or malformed.
- Version fields are unsupported.
- Hex fields are invalid.
- The hash algorithm is unsupported.
- Bundle fields are inconsistent.

Producer metadata, frontend origin, transaction URL, and public proof page
availability MUST NOT be treated as trust anchors.

## Privacy Considerations

Receipts may expose file names, file sizes, MIME types, wallet addresses,
transaction hashes, contract addresses, timestamps, and verification URLs.
OpenProof does not require receipts to be uploaded, stored, transmitted, or
retained by a backend service.

Implementations SHOULD avoid adding personal data, local filesystem paths,
device identifiers, account identifiers, or operational metadata to receipts.

## Failure Modes

Conforming implementations MUST distinguish at least:

- `valid_schema`
- `invalid_schema`
- `unsupported_schema_version`
- `unsupported_hash_algorithm`
- `malformed_json`
- `missing_required_field`
- `invalid_hex_field`
- `invalid_timestamp`
- `invalid_bundle_fields`
- `onchain_proof_not_found`
- `artifact_hash_mismatch`

The exact user-facing wording MAY vary, but structurally valid receipts MUST
NOT be described as verified unless onchain and artifact checks succeed.

## Future Compatibility

Receipt schema evolution MUST follow the backward-compatibility rules in
`docs/receipt-schema.md` and the freeze discipline in `RFC-LIFECYCLE.md`.

Future schema versions SHOULD preserve existing fields where possible and add
new optional fields with documented defaults. Breaking changes require RFC
review and SHOULD be expressed as a superseding RFC once this RFC is frozen.

## Explicit Non-Goals

This RFC does not define:

- A second receipt schema separate from `docs/receipt-schema.md`.
- Identity, authorship, ownership, or authorization systems.
- Token, payment, governance, reputation, or social trust mechanics.
- Remote receipt storage requirements.
- Telemetry or analytics behavior.
- Legal evidentiary sufficiency.
- User interface presentation beyond verification-relevant behavior.
