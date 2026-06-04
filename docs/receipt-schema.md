# OpenProof Receipt Schema

This document describes the OpenProof receipt JSON format, its version history, field semantics, validation rules, and backward compatibility guidance.

---

## Overview

OpenProof receipts are local JSON files generated after a proof registration succeeds. They contain the proof metadata, onchain context, and verification links — everything needed to re-check the registry entry without re-registering the file.

Receipts are **not** uploaded, stored, or transmitted by OpenProof. They are downloaded directly from the browser and live under the user's control.

---

## Schema Versioning

OpenProof receipts use two version numbers to track schema evolution independently of the app release cycle:

| Field | Current | Purpose |
|-------|---------|---------|
| `schemaVersion` | `2` | Tracks the structural schema of the receipt JSON. Incremented when fields are added, removed, or renamed. |
| `receiptVersion` | `2` | Tracks the receipt format iteration. Incremented when the semantic content changes (new validation rules, new optional fields, etc.) within a schema version. |

New receipts are always created at the latest version pair. Old receipts without these fields are treated as version `1` by the validator.

---

## Full Schema (v2)

```typescript
{
  // ── Schema versioning ──
  "schemaVersion": 2,                          // number, required
  "receiptVersion": 2,                         // number, required
  "appName": "OpenProof",                      // string, must be "OpenProof"
  "appVersion": "0.1.0",                       // string, required

  // ── Proof metadata ──
  "proofType": "single-file",                  // "single-file" | "bundle"
  "hashAlgorithm": "SHA-256",                  // string, required, "SHA-256"

  // ── File info ──
  "fileName": "report.pdf",                    // string, required
  "fileSize": 204800,                          // number, bytes, required
  "fileMimeType": "application/pdf",           // string, required
  "sha256Hash": "0xabc...",                    // string, 64-char hex with 0x prefix

  // ── Bundle info (bundle proofs only) ──
  "bundleFiles": [                             // array, present for bundle proofs
    {
      "name": "photo.jpg",                     // string, required
      "size": 102400,                          // number, bytes, required
      "type": "image/jpeg",                    // string, required
      "sha256": "0xdef..."                     // string, 64-char hex with 0x prefix
    }
  ],
  "bundleRuleVersion": 1,                      // number, present for bundle proofs

  // ── Onchain metadata ──
  "chainId": 84532,                            // number, positive integer
  "chainName": "Base Sepolia",                 // string, required
  "contractAddress": "0x60d3...",              // string, 40-char hex with 0x prefix
  "transactionHash": "0x1234...",              // string, 64-char hex with 0x prefix
  "transactionUrl": "https://sepolia.basescan.org/tx/0x1234...",
  "creatorWallet": "0xabcd...",                // string, 40-char hex with 0x prefix

  // ── Timestamp ──
  "createdTimestamp": "2025-01-15T10:30:00.000Z",  // ISO-8601 string

  // ── Verification links ──
  "verificationUrl": "https://openproof.vercel.app/proof/0xabc...",
  "verificationInstructions": "Open OpenProof, choose Verify Proof..."
}
```

---

## Field Reference

### Version Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `schemaVersion` | `number` | Yes | Structural schema version. `1` = implicit original layout. `2` = explicit version fields, strict validation. |
| `receiptVersion` | `number` | Yes | Receipt format version within the schema. Semver-independent of appVersion. |
| `appName` | `string` | Yes | Must equal `"OpenProof"`. Used to distinguish OpenProof receipts from other tools. |
| `appVersion` | `string` | Yes | The OpenProof app version that created the receipt. Informational; does not affect validation. |

### Proof Metadata

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `proofType` | `string` | Yes | `"single-file"` for a single file proof. `"bundle"` for a multi-file bundle proof. Determines whether `bundleFiles` is expected. |
| `hashAlgorithm` | `string` | Yes | Always `"SHA-256"`. Reserved for future algorithm migration (e.g., SHA-3, BLAKE3). |

### File Info

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `fileName` | `string` | Yes | Original file name. Not used for verification; informational only. |
| `fileSize` | `number` | Yes | File size in bytes. Must be ≥ 0. |
| `fileMimeType` | `string` | Yes | MIME type. For bundles, `"application/vnd.openproof.bundle+json"`. Use `"unknown"` when unavailable. |
| `sha256Hash` | `string` | Yes | The registered SHA-256 fingerprint, hex-encoded with `0x` prefix. Must be exactly 64 hex characters. |

### Bundle Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `bundleFiles` | `array` | For bundles | Array of file entries in the bundle. Each entry has `name` (string), `size` (number), `type` (string), `sha256` (hex string). |
| `bundleRuleVersion` | `number` | For bundles | Version of the deterministic bundle rule. Version `1` = `"sort-by-name-size-type-hash"`. Incrementing this field signals a rule change that would produce a different bundle hash for the same file set. |

### Chain Metadata

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `chainId` | `number` | Yes | EIP-155 chain ID. Must be a positive integer. `84532` = Base Sepolia. |
| `chainName` | `string` | Yes | Human-readable chain name (e.g., `"Base Sepolia"`). Not validated programmatically; informational. |
| `contractAddress` | `string` | Yes | OpenProofRegistry contract address, hex-encoded with `0x` prefix. Must be exactly 40 hex characters. |
| `transactionHash` | `string` | Yes | Registration transaction hash, hex-encoded with `0x` prefix. Must be exactly 64 hex characters. |
| `transactionUrl` | `string` | Yes | Full block explorer URL to the registration transaction. |
| `creatorWallet` | `string` | Yes | The wallet address that submitted the registration transaction, hex-encoded with `0x` prefix. Must be exactly 40 hex characters. |

### Timestamp

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `createdTimestamp` | `string` | Yes | ISO-8601 date string. Generated from the contract block timestamp. Must parse to a valid Date between year 2020 and 2100. |

### Verification

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `verificationUrl` | `string` | Yes | Shareable URL to the OpenProof proof explorer page for this hash. |
| `verificationInstructions` | `string` | Yes | Human-readable instructions for verifying the proof via OpenProof. |

---

## Bundle Rule Semantics

### Current Rule (Version 1)

Rule identifier: `"sort-by-name-size-type-hash"`

1. Each file is hashed independently with SHA-256.
2. A manifest is built with `name`, `size`, `type`, and `sha256` per file.
3. Entries are sorted by the concatenation `"name:size:type:sha256"` using `localeCompare`.
4. The sorted manifest is serialized with a stable (deterministic) JSON stringify function.
5. The resulting UTF-8 bytes are SHA-256 hashed to produce the bundle hash.
6. Only the bundle hash is registered onchain.

### Future Rule Changes

When the bundle rule changes, `bundleRuleVersion` is incremented and the manifest `rule` string is updated. Receipts always carry the `bundleRuleVersion` used so that verification can apply the correct rule.

Verification of a bundle receipt requires:
- The same exact file set.
- The same `bundleRuleVersion` and rule algorithm.
- The same stable-stringify implementation.

---

## Validation Rules

Receipt validation is local-only and checks:

| Check | Description |
|-------|-------------|
| JSON parse | Must be a valid JSON object. |
| Required strings | All 13 string fields must be present and non-empty. |
| appName | Must equal `"OpenProof"`. |
| Numbers | `fileSize` must be ≥ 0. `chainId` must be a positive integer. `schemaVersion` and `receiptVersion` must be positive integers when present. |
| Hex format | `sha256Hash`, `transactionHash` must match `0x` + 64 hex chars. `contractAddress`, `creatorWallet` must match `0x` + 40 hex chars. |
| Timestamp | Must parse to a Date between 2020 and 2100. |
| Proof type | If `proofType` is present, must be `"single-file"` or `"bundle"`. If `bundleFiles` is present, type is inferred as `"bundle"`. |
| Bundle consistency | If bundle type, `bundleFiles` must be a non-empty array. Each entry is validated for the same format rules as top-level fields. |
| Hash algorithm | If `hashAlgorithm` is present, must be `"SHA-256"`. |

**Multiple errors are collected and reported together** — validation does not short-circuit on the first failure.

---

## Validation by Schema Version

### Schema v1 (implicit, original layout)

Receipts without `schemaVersion` are implicitly version `1`. These receipts are accepted by the validator with these default values:

| Missing field | Default value |
|---------------|---------------|
| `schemaVersion` | `1` |
| `receiptVersion` | `1` |
| `proofType` | Inferred from bundleFiles presence |
| `hashAlgorithm` | `"SHA-256"` |
| `bundleRuleVersion` | `1` (if bundle type) |

All v1 receipts must still pass the hex format and field-type checks. A v1 receipt with valid data is accepted; only receipts with structural issues are rejected.

### Schema v2 (current)

All newly created receipts use schema v2. The canonical `ProofReceipt` type in the codebase always includes all fields with defaults filled in, so consumers never deal with partial data.

---

## Backward Compatibility

| Change | Impact |
|--------|--------|
| New fields added | V1 validators that do strict field checks will reject v2 receipts missing v1 fields. The OpenProof validator is forward-compatible: it accepts v1 receipts and fills defaults. |
| proofType made required | V1 receipts without proofType are accepted with inferred value. |
| sha256Hash string type | Runtime hex format check is unchanged. |
| bundleRuleVersion added | V1 bundle receipts default to version 1. New bundle receipts carry the version explicitly. |

### Compatibility Guarantees

- The OpenProof validator will accept all valid v1 receipts indefinitely.
- Future schema versions will not remove or rename existing fields.
- New fields will be optional (with documented defaults) until the next major schema version.

---

## Example: Single-File Receipt v2

```json
{
  "schemaVersion": 2,
  "receiptVersion": 2,
  "appName": "OpenProof",
  "appVersion": "0.1.0",
  "proofType": "single-file",
  "hashAlgorithm": "SHA-256",
  "fileName": "report.pdf",
  "fileSize": 204800,
  "fileMimeType": "application/pdf",
  "sha256Hash": "0x9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08",
  "chainId": 84532,
  "chainName": "Base Sepolia",
  "contractAddress": "0x60d3dd631e6e4f6d76f761689d6fa229945a874a",
  "transactionHash": "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
  "transactionUrl": "https://sepolia.basescan.org/tx/0xabcdef...",
  "creatorWallet": "0x1234567890abcdef1234567890abcdef12345678",
  "createdTimestamp": "2025-01-15T10:30:00.000Z",
  "verificationUrl": "https://openproof.vercel.app/proof/0x9f86d0818...",
  "verificationInstructions": "Open OpenProof, choose Verify Proof, select the original file, and compare the locally generated SHA-256 hash against the onchain registry entry. The file must match exactly."
}
```

## Example: Bundle Receipt v2

```json
{
  "schemaVersion": 2,
  "receiptVersion": 2,
  "appName": "OpenProof",
  "appVersion": "0.1.0",
  "proofType": "bundle",
  "hashAlgorithm": "SHA-256",
  "fileName": "photos.tar.gz",
  "fileSize": 5120000,
  "fileMimeType": "application/vnd.openproof.bundle+json",
  "sha256Hash": "0x55aabbccddee...",
  "bundleFiles": [
    {
      "name": "photo1.jpg",
      "size": 2048000,
      "type": "image/jpeg",
      "sha256": "0x1111..."
    },
    {
      "name": "photo2.jpg",
      "size": 3072000,
      "type": "image/jpeg",
      "sha256": "0x2222..."
    }
  ],
  "bundleRuleVersion": 1,
  "chainId": 84532,
  "chainName": "Base Sepolia",
  "contractAddress": "0x60d3dd631e6e4f6d76f761689d6fa229945a874a",
  "transactionHash": "0x1234...",
  "transactionUrl": "https://sepolia.basescan.org/tx/0x1234...",
  "creatorWallet": "0x1234...",
  "createdTimestamp": "2025-01-15T10:30:00.000Z",
  "verificationUrl": "https://openproof.vercel.app/proof/0x55aabbccddee...",
  "verificationInstructions": "Open OpenProof, choose Verify Proof..."
}
```

---

## Future-Proofing Notes

- **New hash algorithms**: When a new algorithm is introduced, `hashAlgorithm` distinguishes receipts by the algorithm used. Algorithm-agnostic consumers can skip verification of receipts with unknown algorithms.
- **Bundle rule changes**: When the deterministic bundle sort rule changes, `bundleRuleVersion` is incremented. Consumers must use the matching rule to verify bundle receipts.
- **chainId validation**: The validator accepts any positive integer chain ID, not only known values. This allows receipts from future chain deployments to be stored and imported without code changes.
- **schemaVersion resolution**: If a future receipt carries an unknown `schemaVersion`, the validator can reject it with a clear message rather than silently corrupting data.

---

## Related Files

- `src/lib/receipt.ts` — Receipt type definition, builder, and validator.
- `src/lib/bundle.ts` — Bundle manifest type definition and bundle hash computation.
- `src/app/create/page.tsx` — Receipt generation after proof registration.
- `src/app/verify/page.tsx` — Receipt import and onchain verification.
- `src/components/receipt-import.tsx` — Receipt file import UI component.
- `docs/threat-model.md` — Privacy and trust considerations for receipts and bundle proofs.
- `docs/architecture.md` — Overall system architecture and receipt import workflow.
