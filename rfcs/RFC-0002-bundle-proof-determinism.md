# RFC-0002: Bundle Proof Determinism

- **Status:** Proposal
- **Author:** OpenProof RFC Architect
- **Date:** 2026-06-04
- **Supersedes:** None
- **Superseded By:** None
- **Related RFCs:** RFC-0001, RFC-0003

## Canonical References

This RFC depends on the receipt format in RFC-0001 and the verification flow in
RFC-0003. It is governed by `RFC-LIFECYCLE.md`, constrained by
`INVARIANT-REFERENCE-MAP.md`, and uses shared terms from `TERMINOLOGY.md`.
The current bundle implementation is documented in
[`../docs/receipt-schema.md`](../docs/receipt-schema.md) and implemented in
[`../src/lib/bundle.ts`](../src/lib/bundle.ts).

## Freeze-State Note

This RFC is in Proposal status. Bundle construction rules MUST NOT be treated
as frozen until the RFC reaches Frozen status under `RFC-LIFECYCLE.md`.

## Abstract

This RFC defines deterministic construction of OpenProof bundle proofs. A bundle
proof binds an ordered set of member artifacts to a single bundle digest using
stable member canonicalization, ordering, and manifest encoding rules.

## Motivation

Bundles allow multiple artifacts to be verified as a single proof unit. Without
strict deterministic rules, equivalent bundles may produce different digests
across implementations. OpenProof requires bundle proofs to remain portable,
locally verifiable, and independent of filesystem behavior.

## Terminology

- **Bundle:** A collection of one or more member artifacts proven together.
- **Bundle digest:** Digest computed over the canonical bundle manifest.
- **Bundle manifest:** Canonical JSON document describing bundle members.
- **Member:** One artifact included in a bundle.
- **Member digest:** Digest computed over canonical bytes for one member.
- **Member name:** Stable member name recorded in the bundle manifest.

## Specification

### Bundle Receipt

A bundle proof MUST be represented as a proof receipt with `proofType` set to
`bundle` as defined in RFC-0001 and `docs/receipt-schema.md`.

The receipt MUST include:

- `proofType`
- `hashAlgorithm`
- `sha256Hash`
- `bundleFiles`
- `bundleRuleVersion`

### Member Records

Each member record MUST include:

| Field | Type | Requirement |
|-------|------|-------------|
| `name` | string | Stable member name. |
| `size` | integer | Size of member bytes. |
| `type` | string | Member MIME type or `unknown`. |
| `sha256` | string | SHA-256 member digest as a `0x`-prefixed 64-character hex string. |

Member names MUST:

- Be non-empty strings.
- Be treated as receipt metadata, not filesystem authority.
- Not be used to read from local paths during verification without explicit
  user selection.

### Member Ordering

For `bundleRuleVersion` 1, members MUST be sorted by the concatenation
`name:size:type:sha256` using the rule documented in
`docs/receipt-schema.md`.

Filesystem enumeration order MUST NOT affect bundle output.

### Bundle Manifest

For `bundleRuleVersion` 1, the bundle manifest is the structure implemented by
`src/lib/bundle.ts` and includes:

- `appName`
- `bundleVersion`
- `bundleRuleVersion`
- `hashAlgorithm`
- `rule`
- `files`

The manifest MUST be serialized using the stable stringify implementation
defined for the active bundle rule. The `files` array MUST use the deterministic
member ordering defined above.

### Bundle Digest

The receipt `sha256Hash` for a bundle MUST be the SHA-256 digest computed over
the canonical bundle manifest bytes for the declared `bundleRuleVersion`.

The bundle digest MUST NOT be computed over archive container bytes unless the
archive format and ordering rules are explicitly specified by a later RFC.

## Trust Boundary

The bundle manifest and member digests define the verification evidence. Local
filesystem metadata, archive container metadata, producer metadata, and member
display order outside the canonical manifest are not trust anchors.

## Deterministic Guarantees

Given the same member names, sizes, MIME types, member digests,
`bundleRuleVersion`, and hash algorithm, conforming producers MUST produce the
same:

- Member ordering.
- Member digests.
- Canonical bundle manifest bytes.
- Bundle `sha256Hash`.

Creation timestamps, local filesystem metadata, absolute paths, file owner
metadata, permissions, archive compression settings, and producer metadata MUST
NOT affect the bundle digest.

## Security Considerations

Verifiers MUST reject bundle receipts when:

- A member digest does not match supplied member bytes.
- Receipt `sha256Hash` does not match the canonical manifest digest.
- Required member fields are missing or malformed.
- The digest algorithm is unsupported.

Bundle verification does not prove that all original files are present unless
the verifier is supplied with the expected member bytes or verifier-controlled
access to them.

## Privacy Considerations

Member paths may reveal sensitive names or structure. Producers SHOULD use
logical names when filesystem paths contain personal or private information.

The bundle proof format does not require uploading member contents, receipt
contents, or member paths to a backend service.

## Failure Modes

Conforming verifiers MUST distinguish at least:

- `valid_bundle`
- `member_digest_mismatch`
- `bundle_hash_mismatch`
- `missing_member`
- `unexpected_member`
- `invalid_member_record`
- `unsupported_algorithm`
- `malformed_bundle_receipt`

## Future Compatibility

Future RFCs MAY define archive-specific bundle canonicalization. Such RFCs MUST
state whether the archive container bytes or the manifest bytes are normative.

Additional member fields MAY be added under namespaced extensions if they do
not alter bundle digest computation.

## Explicit Non-Goals

This RFC does not define:

- Compression formats.
- Archive file layout.
- File synchronization.
- Cloud bundle storage.
- Access control.
- Authorship or ownership claims.
- Social approval or endorsement mechanisms.
