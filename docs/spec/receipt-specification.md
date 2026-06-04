# OpenProof Receipt Specification

**Canonical Proof Receipt Format & Deterministic Verification Layer**

- **Status:** Prototype
- **Version:** 1 (specification version)
- **Governance:** [ecosystem-standards](https://github.com/sparshsam/ecosystem-standards)
- **Repository:** [sparshsam/openproof](https://github.com/sparshsam/openproof)
- **License:** MIT

---

## 1. Introduction

An OpenProof receipt is a portable, self-contained cryptographic attestation that some content existed at a stated point in time, signed by an identified key. Receipts are:

- **Deterministic** — every field, encoding, hash, and signature is fully specified.
- **Portable** — any implementation in any language can verify any receipt without external infrastructure.
- **Offline-verifiable** — no network access, no cloud services, no blockchain required.
- **Immutable after creation** — the canonical form and signature together create a tamper-evident seal.

This specification defines the canonical receipt format, serialization rules, cryptographic commitments, signature scheme, QR encoding, bundle proofs, and deterministic verification protocol. It is the single authority for what constitutes a valid OpenProof receipt.

### 1.1 Design Principles

| Principle | Implication |
|-----------|-------------|
| Simplicity | Fewer fields, fewer options. No extensibility mechanisms that permit ambiguity. |
| Determinism | Every valid receipt produces exactly one verification outcome regardless of implementation. |
| Portability | JSON + SHA-256 + Ed25519 are available in every modern language runtime. |
| Archival resilience | Receipts remain verifiable for decades without dependency on any external system. |
| Offline verification | Verification requires only the receipt bytes and the claimed public key. |
| Implementation neutrality | This spec contains no reference to any specific codebase, library, or runtime. |

### 1.2 Conventions

The key words **MUST**, **MUST NOT**, **REQUIRED**, **SHALL**, **SHALL NOT**, **SHOULD**, **SHOULD NOT**, **RECOMMENDED**, **MAY**, and **OPTIONAL** in this document are to be interpreted as described in [RFC 2119](https://tools.ietf.org/html/rfc2119).

Throughout this specification, the term **canonical JSON** refers to the deterministic JSON serialization defined in §4.

---

## 2. Receipt Structure

### 2.1 Top-Level Fields

A receipt is a single JSON object. The following table lists all possible fields in **canonical order** (lexicographic byte order of field names):

| # | Field | Type | Required | Description |
|---|-------|------|----------|-------------|
| 1 | `commitment` | String | computed | SHA-256 hash of the canonical receipt body (§5.1). Included for self-description; verification MUST recompute and compare. |
| 2 | `commitments` | Array | conditional | Array of commitment hash strings (`sha256:<hex>`). REQUIRED when `type` is `"bundle"`. MUST be absent when `type` is `"proof-receipt"`. |
| 3 | `metadata` | Object | optional | Key-value metadata (§2.2). |
| 4 | `signature` | Object | required | Cryptographic signature (§6). |
| 5 | `subject` | String | required | Hash of the content being attested to (§2.3). |
| 6 | `timestamp` | Integer | required | Unix epoch seconds (§2.4). |
| 7 | `type` | String | required | Receipt type (§2.5). |
| 8 | `version` | Integer | required | Format version. Currently always `1`. |

### 2.2 Metadata Structure

The `metadata` field, when present, is a JSON object with the following constraints:

- All keys MUST be strings matching `^[a-zA-Z0-9_-]{1,64}$`.
- All values MUST be one of: String, Number (integer or finite float), Boolean, or null.
- Nested objects and arrays are NOT permitted in metadata values.
- Duplicate keys at any nesting level are invalid (§4.3).
- All strings MUST be NFC-normalized (§4.1).

Implementations SHOULD interpret the following conventional metadata keys:

| Key | Value Type | Convention |
|-----|------------|------------|
| `name` | String | A human-readable label for the attested content |
| `description` | String | A short description of the attestation |
| `origin` | String | Identifier for the creating system or application |
| `nonce` | String | A unique value preventing replay of identical receipts |

### 2.3 Subject Format

The `subject` field identifies the content being attested to. Format:

```
sha256:<64-lowercase-hex-characters>
```

Example: `sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

The hash is SHA-256 of the content bytes. The content itself is not stored in the receipt — only its hash. This is by design: receipts are attestations of existence, not content delivery mechanisms.

### 2.4 Timestamp Encoding

- Type: Unsigned 64-bit integer.
- Value: Unix epoch seconds (seconds since 1970-01-01T00:00:00Z).
- Timezone: UTC. No timezone offset is stored or implied.
- Range: `0` to `253402300799` (year 9999).
- The timestamp MUST be non-negative.
- Fractional seconds are NOT permitted.
- The timestamp is the time at which the attestation was created, according to the signer.

### 2.5 Type Field

| Value | Meaning |
|-------|---------|
| `"proof-receipt"` | A standard proof receipt attesting to a single subject (§3, §9). |
| `"bundle"` | A bundle receipt aggregating multiple receipt commitments (§8). |

No other type values are valid in version 1.

### 2.6 JSON Schema

The canonical JSON Schema for OpenProof receipts is defined in Appendix A. Implementations SHOULD use it for structural validation before attempting cryptographic verification.

---

## 3. Canonical Serialization

Canonical serialization is the process of converting a receipt object into a deterministic byte sequence. This byte sequence is the input to all cryptographic operations. Any deviation from these rules produces a different byte sequence, which will fail cryptographic verification.

### 3.1 Field Ordering

All JSON objects in the receipt — including the top level, the `signature` object, the `metadata` object, and any nested object — MUST have their keys sorted in **lexicographic byte order of their UTF-8 encoded field names**.

For the top-level receipt object, the canonical ordering is:

```
commitment  →  commitments  →  metadata  →  signature  →  subject  →  timestamp  →  type  →  version
```

For the signature object:

```
algorithm  →  publicKey  →  value
```

**Rule:** Sort by UTF-8 byte value of the key string. In practice, for ASCII field names, this is equivalent to ASCII/Unicode code-point order.

### 3.2 Unicode Normalization

**All strings in the receipt MUST be Unicode NFC-normalized** (Normalization Form C, as defined in Unicode Standard Annex #15).

This applies to:
- All field-name strings (already NFC-stable for the defined ASCII field names).
- All string values in `metadata`.
- Any string value that appears anywhere in the receipt.

**Rationale:** String comparison in hashing depends on byte-for-byte identity. Different Unicode normalization forms of the same character (e.g., `é` as U+00E9 vs. `e` + U+0301) produce different byte sequences. NFC is the most compact canonical form and is recommended by the W3C for the web.

Implementations MUST NFC-normalize all strings before serialization.

### 3.3 Whitespace Rules

**Canonical JSON MUST contain no whitespace characters between tokens.**

Prohibited characters:
- Space (U+0020)
- Horizontal tab (U+0009)  
- Line feed (U+000A)
- Carriage return (U+000D)

This produces the most compact deterministic representation. No indentation, no line breaks.

Example valid serialization fragment:
```json
{"commitments":["sha256:abc"],"metadata":{"origin":"app-v1"},"subject":"sha256:def","timestamp":1717488000,"type":"bundle","version":1}
```

### 3.4 Numeric Encoding

- Integers: Serialized as decimal strings with no leading zeros, no leading plus sign, and no decimal point.
- All numeric values in version 1 of this specification are integers. Implementations MUST reject floating-point values where integers are expected.
- There is no distinction between integer and floating-point in JSON; implementations MUST treat the absence of `.`, `e`, or `E` in the serialized form as indicating an integer.

### 3.5 String Encoding

- All strings are UTF-8 encoded.
- Control characters (U+0000–U+001F) in strings are permitted only through standard JSON escape sequences (`\n`, `\t`, `\uXXXX`).
- JSON strings MUST use standard JSON escaping rules as defined by RFC 8259.
- Canonical JSON MUST use the minimal escape sequence: `\"` not `"`, `\n` not `
`, etc.
- Non-ASCII characters SHOULD be encoded as raw UTF-8 bytes, not as `\uXXXX` escapes, for compactness.

### 3.6 Duplicate-Key Handling

**Duplicate keys are INVALID at all levels of the receipt.**

A JSON object containing two or more identical field names MUST be rejected as malformed.

**Rationale:** JSON parsers vary in how they handle duplicate keys — some take the last value, some take the first, some error. This cannot be tolerated in a deterministic system. The canonical form simply forbids them.

Implementations MUST reject any receipt with duplicate keys before attempting verification.

### 3.7 Canonical Byte Serialization Algorithm

To serialize a receipt object to canonical bytes:

```
1. NFC-normalize all string values.
2. Verify no duplicate keys exist at any nesting level.
3. Serialize to JSON with sorted keys, no whitespace.
4. Verify numeric values use canonical form (no leading zeros, etc.).
5. Encode as UTF-8 bytes. No BOM (byte order mark).
```

These bytes are the **canonical byte representation** of the receipt.

---

## 4. Cryptographic Hashing

### 4.1 Commitment Computation

The **commitment** is a SHA-256 hash that binds the receipt body to prevent tampering.

**Receipt body** is defined as the canonical JSON representation of the receipt with two fields removed:

1. The `commitment` field (if present).
2. The `signature` field.

The body is serialized using the canonical serialization rules from §3, then hashed.

**Algorithm:**

```
1. Reconstruct the receipt object excluding the commitment and signature fields.
2. Serialize the remaining fields using canonical JSON rules (§3).
3. Compute SHA-256 of the resulting UTF-8 bytes.
4. Encode the 32-byte digest as 64 lowercase hex characters.
5. Format: "sha256:<64-hex-chars>"
```

**The receipt body bytes (before hashing) are the canonical commitment payload.**

### 4.2 What Gets Signed

The Ed25519 signature signs the **raw 32-byte SHA-256 digest** (not the hex string, not the `"sha256:"` prefixed string).

```
signature_input = SHA-256(receipt_body_bytes)    // 32 raw bytes
signature = Ed25519-Sign(private_key, signature_input)
```

---

## 5. Digital Signatures

### 5.1 Algorithm: Ed25519

- **Algorithm:** Ed25519 (EdDSA with Curve25519), as defined in RFC 8032.
- **Deterministic:** Ed25519 signature generation is deterministic — it does not require a random number generator. Same key + same message = same signature.
- **Key size:** 32-byte secret key, 32-byte public key, 64-byte signature.
- **Rationale:** Ed25519 is chosen for its deterministic signatures, compact keys, and universal library availability.

### 5.2 Key and Signature Encoding

All keys and signatures are **base64url-encoded** (RFC 4648 §5) **without padding**.

| Value | Raw Size | Base64url Size | Format |
|-------|----------|----------------|--------|
| Public key | 32 bytes | 43 characters | `^[A-Za-z0-9_-]{43}$` |
| Signature | 64 bytes | 86 characters | `^[A-Za-z0-9_-]{86}$` |

### 5.3 Signature Field Structure

```json
{
  "algorithm": "ed25519",
  "publicKey": "<43-char-base64url>",
  "value": "<86-char-base64url>"
}
```

- `algorithm` — constant `"ed25519"`. No other value is valid.
- `publicKey` — the base64url-encoded 32-byte Ed25519 public key.
- `value` — the base64url-encoded 64-byte Ed25519 signature.

All three fields are REQUIRED. No additional fields are permitted.

### 5.4 Signature Generation

```
1. Serialize receipt body (excluding commitment and signature fields) to canonical bytes.
2. Compute SHA-256 of body bytes → 32-byte digest.
3. Sign the 32-byte digest with Ed25519 private key → 64-byte signature.
4. Base64url-encode the public key (32 bytes → 43 chars).
5. Base64url-encode the signature (64 bytes → 86 chars).
6. Set signature.publicKey and signature.value.
7. Compute commitment hash from body bytes.
8. Set commitment field.
```

The order of operations matters: the commitment is computed from the body BEFORE the signature is embedded, and the signature is embedded before the commitment is stored in the receipt.

### 5.5 Signature Verification

```
1. Extract publicKey from receipt.signature.
2. Extract claimed signature value from receipt.signature.value.
3. Reconstruct receipt body (strip commitment and signature fields).
4. Serialize body to canonical bytes.
5. Compute SHA-256 of body bytes → 32-byte digest.
6. Base64url-decode public key → 32 bytes.
7. Base64url-decode signature value → 64 bytes.
8. Verify: Ed25519-Verify(public_key_32, digest_32, signature_64) == true.
```

---

## 6. QR Encoding

### 6.1 Encoding Format

To encode an OpenProof receipt for QR display:

```
1. Serialize receipt to canonical JSON bytes (§3).
2. If bytes > 256 bytes, optionally gzip-compress (step 3).
3. If compressed: prepend "opr1:" to base64url(compressed_bytes).
   If uncompressed: prepend "opr1:" to base64url(canonical_bytes).
```

Wait — let me reconsider. I should be clearer about when compression is used.

Revised:

```
1. Serialize receipt to canonical JSON bytes.
2. Encode bytes as base64url (no padding).
3. If encoded length ≤ 2953 characters: prefix "opr1:" and encode as QR.
4. If encoded length > 2953 characters:
   a. Gzip-compress the canonical JSON bytes.
   b. Base64url-encode the compressed bytes.
   c. If still > 2953 characters: receipt is too large for a single QR code. 
      Use a bundle or split receipt.
   d. Otherwise: prefix "opr1z:" and encode as QR.
```

### 6.2 QR Parameters

| Parameter | Value |
|-----------|-------|
| Encoding mode | Byte mode |
| Error correction | M (15%) |
| Version | Auto-selected (up to version 40) |
| Character set | UTF-8 |
| Mask pattern | Auto-selected |

### 6.3 Decoding

```
1. Scan QR code → text string.
2. If text starts with "opr1:":
   a. Strip prefix.
   b. Base64url-decode → canonical JSON bytes.
3. If text starts with "opr1z:":
   a. Strip prefix.
   b. Base64url-decode → gzip-compressed bytes.
   c. Gunzip → canonical JSON bytes.
4. Parse JSON and verify receipt per §9.
```

The `opr1:` and `opr1z:` prefixes serve as magic bytes for QR readers to identify OpenProof receipts.

---

## 7. Bundle Proofs

### 7.1 Purpose

A bundle proof aggregates multiple receipt commitments into a single receipt. This enables:

- Attesting to multiple subjects in a single signed structure.
- Compact verification of a set of receipts.
- Efficient sharing of related attestations.

### 7.2 Bundle Structure

A bundle receipt uses `type: "bundle"` and includes a `commitments` array:

```json
{
  "commitments": [
    "sha256:abc123...",
    "sha256:def456...",
    "sha256:ghi789..."
  ],
  "metadata": { "name": "Batch attestation" },
  "subject": "sha256:<bundle-subject>",
  "timestamp": 1717488000,
  "type": "bundle",
  "version": 1
}
```

### 7.3 Bundle Subject

For a `"bundle"`-type receipt, the `subject` field is computed deterministically from the `commitments` array:

```
1. Sort the commitments array lexicographically by string value.
2. Serialize the sorted array to canonical JSON (no whitespace): ["sha256:...","sha256:..."]
3. Compute SHA-256 of these UTF-8 bytes → 32-byte digest.
4. subject = "sha256:" + lowercase-hex(digest)
```

**The subject MUST be computed in this manner** for bundle receipts. An implementation MUST reject a bundle receipt whose subject does not match the computed value.

**Rationale for sorting:** The sorted array ensures that the same set of commitments always produces the same bundle subject, regardless of the order in which they were inserted.

### 7.4 Bundle Commitment

The bundle receipt's own commitment (the hash that is signed) is computed identically to a standard receipt (§5.1): SHA-256 of the canonical body bytes (excluding `commitment` and `signature` fields).

### 7.5 Inclusion Verification

To verify that a specific receipt is included in a bundle:

```
1. Compute the receipt's commitment:
   a. Strip its commitment and signature fields.
   b. Serialize remaining fields to canonical bytes.
   c. SHA-256 → digest → format: "sha256:<hex>"
2. Locate the computed commitment string in bundle.commitments array.
   - If not found: receipt NOT included in bundle. FAIL.
3. Verify the bundle receipt's subject:
   a. Sort bundle.commitments lexicographically.
   b. Serialize sorted array to canonical JSON bytes.
   c. SHA-256 → hex → "sha256:<hex>"
   d. Compare to bundle.subject. MUST match.
4. Verify the bundle receipt's signature per §5.5.
5. Verify the component receipt's signature independently per §5.5.
```

A component receipt MUST also be independently verifiable — inclusion in a bundle does not substitute for the component receipt's own signature verification.

---

## 8. Deterministic Verification

### 8.1 Verification Algorithm (Pseudocode)

```
FUNCTION VerifyReceipt(receipt_bytes: bytes) → VerificationResult

    // STEP 1: Parse
    receipt = ParseCanonicalJSON(receipt_bytes)
    IF receipt is null:
        RETURN FAILURE("Invalid JSON")

    // STEP 2: Structural Validation
    IF NOT ValidateAgainstSchema(receipt):
        RETURN FAILURE("Structural validation failed")

    IF ContainsDuplicateKeys(receipt):
        RETURN FAILURE("Duplicate keys detected")

    // STEP 3: Field Validation
    IF receipt.version != 1:
        RETURN FAILURE("Unsupported version")

    IF receipt.type NOT IN ["proof-receipt", "bundle"]:
        RETURN FAILURE("Invalid receipt type")

    IF NOT MatchesPattern(receipt.subject, "^sha256:[a-f0-9]{64}$"):
        RETURN FAILURE("Invalid subject format")

    IF receipt.timestamp < 0:
        RETURN FAILURE("Timestamp must be non-negative")

    IF receipt.timestamp > 253402300799:
        RETURN FAILURE("Timestamp out of range")

    IF receipt.signature.algorithm != "ed25519":
        RETURN FAILURE("Unsupported signature algorithm")

    IF NOT MatchesPattern(receipt.signature.publicKey, "^[A-Za-z0-9_-]{43}$"):
        RETURN FAILURE("Invalid public key format")

    IF NOT MatchesPattern(receipt.signature.value, "^[A-Za-z0-9_-]{86}$"):
        RETURN FAILURE("Invalid signature format")

    // STEP 4: Bundle-specific validation
    IF receipt.type == "bundle":
        IF receipt.commitments is null OR !IsArray(receipt.commitments):
            RETURN FAILURE("Bundle must contain commitments array")
        IF IsEmpty(receipt.commitments):
            RETURN FAILURE("Bundle must contain at least one commitment")
        FOR EACH c IN receipt.commitments:
            IF NOT MatchesPattern(c, "^sha256:[a-f0-9]{64}$"):
                RETURN FAILURE("Invalid commitment hash in bundle")

        // Verify computed subject
        sorted_commitments = SortLexicographically(receipt.commitments)
        array_bytes = CanonicalJSONBytes(sorted_commitments)
        computed_subject_hash = SHA256(array_bytes)
        expected_subject = "sha256:" + HexEncode(computed_subject_hash)
        IF receipt.subject != expected_subject:
            RETURN FAILURE("Bundle subject does not match commitments")

    // STEP 5: Recompute Commitment
    // Build body: exclude commitment and signature fields
    body = Clone(receipt)
    DeleteField(body, "commitment")
    DeleteField(body, "signature")

    body_bytes = CanonicalJSONBytes(body)   // NFC-normalized, sorted keys, no whitespace
    computed_commitment_hash = SHA256(body_bytes)
    computed_commitment = "sha256:" + HexEncode(computed_commitment_hash)

    // STEP 6: Verify stored commitment (if present)
    IF receipt.commitment EXISTS:
        IF receipt.commitment != computed_commitment:
            RETURN FAILURE("Commitment mismatch — receipt has been tampered with")
    // If commitment field is absent, accept recomputed value
    // (some implementations may omit it for compactness)

    // STEP 7: Verify Signature
    public_key = Base64URLDecode(receipt.signature.publicKey)
    signature_value = Base64URLDecode(receipt.signature.value)
    IF Length(public_key) != 32:
        RETURN FAILURE("Invalid public key length")
    IF Length(signature_value) != 64:
        RETURN FAILURE("Invalid signature length")

    // Ed25519 verification over raw 32-byte hash
    is_valid = Ed25519Verify(public_key, computed_commitment_hash, signature_value)
    IF NOT is_valid:
        RETURN FAILURE("Signature verification failed")

    // STEP 8: Optional — verify subject hash (for proof-receipt type)
    // The subject hash is provided by the user as the content they expect
    // to be attested. This step is context-dependent and left to the
    // calling application.
    // IF provided_expected_subject IS GIVEN AND provided_expected_subject != receipt.subject:
    //     RETURN FAILURE("Subject mismatch")

    RETURN SUCCESS
END FUNCTION
```

### 8.2 Verification Checklist

When implementing an OpenProof verifier, the following checks MUST be performed in order:

| # | Check | Failure Condition |
|---|-------|-------------------|
| 1 | JSON parseability | Receipt is not valid JSON |
| 2 | Structural schema validity | Missing required fields, type mismatches |
| 3 | No duplicate keys | Any JSON object contains duplicate keys |
| 4 | Version check | `version` is not `1` |
| 5 | Type check | `type` is not `"proof-receipt"` or `"bundle"` |
| 6 | Subject format | `subject` does not match `^sha256:[a-f0-9]{64}$` |
| 7 | Timestamp range | `timestamp` is negative or exceeds year 9999 |
| 8 | Signature algorithm | `signature.algorithm` is not `"ed25519"` |
| 9 | Public key format | `signature.publicKey` is not 43 base64url chars |
| 10 | Signature value format | `signature.value` is not 86 base64url chars |
| 11 | Bundle commitments | (if bundle) commitments array is valid and subject is correct |
| 12 | Commitment recomputation | Stored commitment matches recomputed value (if present) |
| 13 | Signature verification | Ed25519 verification over commitment hash fails |

### 8.3 Determinism Guarantees

The following determinism guarantees hold for any compliant implementation:

| Feature | Guarantee |
|---------|-----------|
| Receipt serialization | Same logical receipt → identical canonical bytes |
| Hash computation | Same receipt → same commitment hash |
| Signature generation | Same key + same message → same signature (Ed25519 determinism) |
| Bundle subject | Same set of commitments → same bundle subject |
| Verification outcome | Same receipt → same pass/fail result across all implementations |
| Field ordering | All objects sorted lexicographically by UTF-8 key bytes |
| String encoding | NFC-normalized, UTF-8, no BOM |
| Number encoding | No leading zeros, no decimal points for integers |
| Timestamp | UTC epoch seconds, no timezone interpretation |

---

## 9. Portability Guarantees

### 9.1 What Portability Means

A receipt is portable if it can be created by one implementation and verified by any other implementation, in any language, on any platform, at any future time, without additional context.

### 9.2 Guarantees

| Guarantee | Mechanism |
|-----------|-----------|
| **Language independence** | JSON is parseable in every language. SHA-256 and Ed25519 are standard library or widely available. |
| **Platform independence** | No architecture-dependent encoding (no endianness issues, no word-size assumptions aside from the timestamp's 64-bit range). |
| **Time independence** | Unix epoch seconds are unambiguous. Timestamps do not reference external time services. |
| **No external dependencies** | Verification requires no network, no database, no API, no blockchain. |
| **No account system** | Receipts reference public keys, not user accounts. No identity provider needed. |
| **Format stability** | Canonical JSON is frozen per version. Breaking changes require a new version field. |
| **Archival durability** | A receipt saved as a file, QR code, or printed hex will be verifiable as long as SHA-256 and Ed25519 remain cryptographically sound. |

### 9.3 What Does NOT Affect Portability

The following are explicitly NOT required for portability:

- Network connectivity
- DNS resolution
- Certificate authorities
- Blockchain nodes
- Centralized timestamp authorities
- API keys or tokens
- Specific programming language runtime
- Specific operating system
- Specific file format (beyond canonical JSON)
- Cloud infrastructure of any kind

---

## 10. Trust Assumptions

### 10.1 Explicit Trust Model

| Trust Assumption | Details |
|-----------------|---------|
| **Key ownership** | The signature proves that the holder of the Ed25519 private key signed the commitment. It does NOT prove the identity of the key holder. Identity binding is outside the scope of this specification. |
| **Timestamp truthfulness** | The timestamp is set by the signer. The receipt attests that the signer claims the content existed at that time. It does NOT prove that the timestamp is objectively correct. |
| **Hash collision resistance** | The security model depends on SHA-256 collision resistance. A break in SHA-256 would weaken the binding between the receipt and the content. |
| **Ed25519 security** | The signature provides authentication and integrity. An Ed25519 break would allow forgery. |

### 10.2 What This Specification Does NOT Provide

- **Identity verification.** The spec does not define how public keys map to real-world identities.
- **Timestamp authority.** The spec does not provide decentralized or third-party timestamp verification.
- **Content retrieval.** The spec does not store or host the attested content.
- **Revocation.** The spec does not define key revocation or receipt invalidation mechanisms.
- **Key discovery.** The spec does not define how to discover public keys.
- **Anchoring.** The spec does not define anchoring to blockchains, DLTs, or other external ledgers.

These are application-layer concerns. The spec defines the proof layer only.

### 10.3 Tamper Evidence

Any modification to the receipt after signing is detectable:

| Modification | Detection Mechanism |
|--------------|---------------------|
| Change subject hash | Commitment recomputation mismatch → signature fails |
| Change timestamp | Commitment recomputation mismatch → signature fails |
| Change metadata | Commitment recomputation mismatch → signature fails |
| Change signature value | Ed25519 verification fails |
| Change public key | Ed25519 verification with wrong key fails |
| Change type | Commitment recomputation mismatch → signature fails |
| Add/remove field from body | Commitment recomputation mismatch → signature fails |
| Reorder fields (non-canonical) | Verified only if canonicalized before verification |

### 10.4 Replay Assumptions

- A receipt is a statement that "subject S existed at timestamp T, attested by key K."
- Verification does not check whether the receipt has been seen before. Replay detection is an application-layer concern.
- Two receipts with the same subject, timestamp, and key but different metadata are distinct receipts because their body bytes differ (different canonical JSON), producing different commitments and signatures.

---

## 11. Failure States

### 11.1 Malformed Receipt Handling

A receipt is malformed and MUST be rejected without verification attempt when any of the following conditions are met:

| Condition | Classification | Handling |
|-----------|----------------|----------|
| Not valid JSON | Syntax | Return error, do not attempt verification |
| Empty input (zero bytes) | Structural | Return error |
| Truncated JSON | Syntax | Return error |
| Contains duplicate keys | Structural | Return error |
| Missing required field | Schema | Return error |
| Field value type mismatch | Schema | Return error |
| Version not `1` | Version | Return error — unknown format |
| Invalid type value | Schema | Return error |
| Subject not matching `sha256:<hex>` | Format | Return error |
| Timestamp not integer | Schema | Return error |
| Timestamp negative | Range | Return error |
| Metadata value type not allowed | Schema | Return error |
| Metadata key too long / illegal chars | Format | Return error |
| Signature algorithm not `"ed25519"` | Schema | Return error |
| Public key not valid base64url/43 chars | Format | Return error |
| Signature value not valid base64url/86 chars | Format | Return error |
| Bundle type without commitments | Schema | Return error |
| Bundle type with empty commitments | Schema | Return error |
| Bundle commitment hash not valid format | Format | Return error |
| Non-NFC strings (detected during canonicalization) | Encoding | Implementations SHOULD reject; minimally MUST NFC-normalize before hashing |
| Numeric overflow (timestamp > 2^63-1 in 32-bit implementations) | Range | Implementations MUST use 64-bit integer or reject as out of range |

### 11.2 Verification Failures

Verification failures are ordered and deterministic. The first failure encountered is the definitive failure reason:

| Failure Mode | Cause | Result |
|-------------|-------|--------|
| **Commitment mismatch** | `commitment` field does not match SHA-256 of receipt body | FAIL — tampering detected |
| **Signature invalid** | Ed25519 verification returns false | FAIL — signature does not match public key and/or commitment |
| **Key format invalid** | Public key not 32 bytes after decode | FAIL — malformed |
| **Signature format invalid** | Signature not 64 bytes after decode | FAIL — malformed |
| **Bundle subject mismatch** | Computed subject from commitments does not match bundle.subject | FAIL — bundle tampering detected |

These four failure modes are cryptographically definitive. All other validation errors (schema, format, range) are structural and MUST be caught before cryptographic verification begins.

---

## 12. Examples

### 12.1 Canonical Receipt Examples

#### Example 1: Minimal proof receipt

```json
{"metadata":{},"signature":{"algorithm":"ed25519","publicKey":"kgL6Jw4C63fX6v8ZA1pB2qD3rE4tY5uI6oP7aQ8sS9dF0gH1jK2lL3zX4cV5bN6m","value":"W7xY8zA1bC2dE3fG4hI5jK6lM7nO8pQ9rS0tU1vW2xY3zA4bC5dE6fG7hI8jK9lM0nO1pQ2rS3tU4vW5xY6zA7bC8dE9fG0gH1iJ2kL3mN4oP5qR6sS7tT8uU9vV0wW1xX2yY3zZ4aA5bB6cC7dD8eE9fF0gG1hH2iI3jJ4kK5lL6mM7nN8oO9pP0qQ1rR2sS3tT4uU5vV6wW7xX8yY9zZ0aA1bB2cC3dD4eE5fF6gG7hH8iI9jJ0kK1lL2mM3nN4oO5pP6qQ7rR8sS9tT0uU1vV2wW3xX4yY5zZ6aA7bB8cC9dD0eE1fF2gG3hH4iI5jJ6kK7lL8mM9nN0oO1pP2qQ3rR4sS5tT6uU7vV8wW9xX0yY1zZ2aA3bB4cC5dD6eE7fF8gG9hH0iI1jJ2kK3lL4mM5nN6oO7pP8qQ9rR0sS1tT2uU3vV4wW5xX6yY7zZ8aA9bB0cC1dD2eE3fF4gG5hH6iI7jJ8kK9lL0mM1nN2oO3pP4qQ5rR6sS7tT8uU9vV0wW1"}}
```

#### Example 2: Proof receipt with metadata

```json
{"metadata":{"name":"Contract agreement v2","nonce":"a1b2c3d4-e5f6-7890-abcd-ef1234567890","origin":"openproof-cli-0.1.0"},"signature":{"algorithm":"ed25519","publicKey":"kgL6Jw4C63fX6v8ZA1pB2qD3rE4tY5uI6oP7aQ8sS9dF0gH1jK2lL3zX4cV5bN6m","value":"W7xY8zA1bC2dE3fG4hI5jK6lM7nO8pQ9rS0tU1vW2xY3zA4bC5dE6fG7hI8jK9lM0nO1pQ2rS3tU4vW5xY6zA7bC8dE9fG0gH1iJ2kL3mN4oP5qR6sS7tT8uU9vV0wW1xX2yY3zZ4aA5bB6cC7dD8eE9fF0gG1hH2iI3jJ4kK5lL6mM7nN8oO9pP0qQ1rR2sS3tT4uU5vV6wW7xX8yY9zZ0aA1bB2cC3dD4eE5fF6gG7hH8iI9jJ0kK1lL2mM3nN4oO5pP6qQ7rR8sS9tT0uU1vV2wW3xX4yY5zZ6aA7bB8cC9dD0eE1fF2gG3hH4iI5jJ6kK7lL8mM9nN0oO1pP2qQ3rR4sS5tT6uU7vV8wW9xX0yY1zZ2aA3bB4cC5dD6eE7fF8gG9hH0iI1jJ2kK3lL4mM5nN6oO7pP8qQ9rR0sS1tT2uU3vV4wW5xX6yY7zZ8aA9bB0cC1dD2eE3fF4gG5hH6iI7jJ8kK9lL0mM1nN2oO3pP4qQ5rR6sS7tT8uU9vV0wW1"}}
```

#### Example 3: Bundle receipt (three commitments)

```json
{"commitment":"sha256:9999999999999999999999999999999999999999999999999999999999999999","commitments":["sha256:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa","sha256:bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb","sha256:cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc"],"metadata":{"name":"Weekly batch 2024-W23"},"signature":{"algorithm":"ed25519","publicKey":"kgL6Jw4C63fX6v8ZA1pB2qD3rE4tY5uI6oP7aQ8sS9dF0gH1jK2lL3zX4cV5bN6m","value":"W7xY8zA1bC2dE3fG4hI5jK6lM7nO8pQ9rS0tU1vW2xY3zA4bC5dE6fG7hI8jK9lM0nO1pQ2rS3tU4vW5xY6zA7bC8dE9fG0gH1iJ2kL3mN4oP5qR6sS7tT8uU9vV0wW1xX2yY3zZ4aA5bB6cC7dD8eE9fF0gG1hH2iI3jJ4kK5lL6mM7nN8oO9pP0qQ1rR2sS3tT4uU5vV6wW7xX8yY9zZ0aA1bB2cC3dD4eE5fF6gG7hH8iI9jJ0kK1lL2mM3nN4oO5pP6qQ7rR8sS9tT0uU1vV2wW3xX4yY5zZ6aA7bB8cC9dD0eE1fF2gG3hH4iI5jJ6kK7lL8mM9nN0oO1pP2qQ3rR4sS5tT6uU7vV8wW9xX0yY1zZ2aA3bB4cC5dD6eE7fF8gG9hH0iI1jJ2kK3lL4mM5nN6oO7pP8qQ9rR0sS1tT2uU3vV4wW5xX6yY7zZ8aA9bB0cC1dD2eE3fF4gG5hH6iI7jJ8kK9lL0mM1nN2oO3pP4qQ5rR6sS7tT8uU9vV0wW1","subject":"sha256:d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2","timestamp":1717488000,"type":"bundle","version":1}
```

#### Example 4: Receipt with single metadata field

```json
{"metadata":{"name":"Git commit 4a8c3d2f"},"signature":{"algorithm":"ed25519","publicKey":"kgL6Jw4C63fX6v8ZA1pB2qD3rE4tY5uI6oP7aQ8sS9dF0gH1jK2lL3zX4cV5bN6m","value":"W7xY8zA1bC2dE3fG4hI5jK6lM7nO8pQ9rS0tU1vW2xY3zA4bC5dE6fG7hI8jK9lM0nO1pQ2rS3tU4vW5xY6zA7bC8dE9fG0gH1iJ2kL3mN4oP5qR6sS7tT8uU9vV0wW1xX2yY3zZ4aA5bB6cC7dD8eE9fF0gG1hH2iI3jJ4kK5lL6mM7nN8oO9pP0qQ1rR2sS3tT4uU5vV6wW7xX8yY9zZ0aA1bB2cC3dD4eE5fF6gG7hH8iI9jJ0kK1lL2mM3nN4oO5pP6qQ7rR8sS9tT0uU1vV2wW3xX4yY5zZ6aA7bB8cC9dD0eE1fF2gG3hH4iI5jJ6kK7lL8mM9nN0oO1pP2qQ3rR4sS5tT6uU7vV8wW9xX0yY1zZ2aA3bB4cC5dD6eE7fF8gG9hH0iI1jJ2kK3lL4mM5nN6oO7pP8qQ9rR0sS1tT2uU3vV4wW5xX6yY7zZ8aA9bB0cC1dD2eE3fF4gG5hH6iI7jJ8kK9lL0mM1nN2oO3pP4qQ5rR6sS7tT8uU9vV0wW1"}}
```

#### Example 5: Proof receipt with boolean metadata value

```json
{"metadata":{"verified":true,"origin":"scanner-v2.1"},"signature":{"algorithm":"ed25519","publicKey":"kgL6Jw4C63fX6v8ZA1pB2qD3rE4tY5uI6oP7aQ8sS9dF0gH1jK2lL3zX4cV5bN6m","value":"W7xY8zA1bC2dE3fG4hI5jK6lM7nO8pQ9rS0tU1vW2xY3zA4bC5dE6fG7hI8jK9lM0nO1pQ2rS3tU4vW5xY6zA7bC8dE9fG0gH1iJ2kL3mN4oP5qR6sS7tT8uU9vV0wW1xX2yY3zZ4aA5bB6cC7dD8eE9fF0gG1hH2iI3jJ4kK5lL6mM7nN8oO9pP0qQ1rR2sS3tT4uU5vV6wW7xX8yY9zZ0aA1bB2cC3dD4eE5fF6gG7hH8iI9jJ0kK1lL2mM3nN4oO5pP6qQ7rR8sS9tT0uU1vV2wW3xX4yY5zZ6aA7bB8cC9dD0eE1fF2gG3hH4iI5jJ6kK7lL8mM9nN0oO1pP2qQ3rR4sS5tT6uU7vV8wW9xX0yY1zZ2aA3bB4cC5dD6eE7fF8gG9hH0iI1jJ2kK3lL4mM5nN6oO7pP8qQ9rR0sS1tT2uU3vV4wW5xX6yY7zZ8aA9bB0cC1dD2eE3fF4gG5hH6iI7jJ8kK9lL0mM1nN2oO3pP4qQ5rR6sS7tT8uU9vV0wW1"}}
```

### 12.2 Invalid Receipt Examples

#### Example 6: Non-canonical field ordering

```json
{"version":1,"type":"proof-receipt","signature":{"algorithm":"ed25519","publicKey":"...","value":"..."},"subject":"sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855","timestamp":1717488000}
```

**Why invalid:** Fields are in wrong canonical order (`version` before `type` before `signature`). An implementation receiving this MUST canonicalize before hashing. This receipt either passes verification (if canonicalized) or fails (if byte-compared as-is) — deterministic verification REQUIRES canonicalization first.

#### Example 7: Duplicate keys

```json
{"subject":"sha256:abc123...","subject":"sha256:def456...","timestamp":1717488000,"type":"proof-receipt","version":1}
```

**Why invalid:** Duplicate `subject` field. MUST be rejected as malformed before any verification attempt.

#### Example 8: Negative timestamp

```json
{"metadata":{},"subject":"sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855","signature":{"algorithm":"ed25519","publicKey":"kgL6Jw4C63fX6v8ZA1pB2qD3rE4tY5uI6oP7aQ8sS9dF0gH1jK2lL3zX4cV5bN6m","value":"W7xY8zA1bC2dE3fG4hI5jK6lM7nO8pQ9rS0tU1vW2xY3zA4bC5dE6fG7hI8jK9lM0nO1pQ2rS3tU4vW5xY6zA7bC8dE9fG0gH1iJ2kL3mN4oP5qR6sS7tT8uU9vV0wW1xX2yY3zZ4aA5bB6cC7dD8eE9fF0gG1hH2iI3jJ4kK5lL6mM7nN8oO9pP0qQ1rR2sS3tT4uU5vV6wW7xX8yY9zZ0aA1bB2cC3dD4eE5fF6gG7hH8iI9jJ0kK1lL2mM3nN4oO5pP6qQ7rR8sS9tT0uU1vV2wW3xX4yY5zZ6aA7bB8cC9dD0eE1fF2gG3hH4iI5jJ6kK7lL8mM9nN0oO1pP2qQ3rR4sS5tT6uU7vV8wW9xX0yY1zZ2aA3bB4cC5dD6eE7fF8gG9hH0iI1jJ2kK3lL4mM5nN6oO7pP8qQ9rR0sS1tT2uU3vV4wW5xX6yY7zZ8aA9bB0cC1dD2eE3fF4gG5hH6iI7jJ8kK9lL0mM1nN2oO3pP4qQ5rR6sS7tT8uU9vV0wW1","timestamp":-1717488000,"type":"proof-receipt","version":1}
```

**Why invalid:** Negative timestamp. Must be non-negative per §2.4.

#### Example 9: Bundle with empty commitments

```json
{"commitments":[],"metadata":{},"subject":"sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855","signature":{"algorithm":"ed25519","publicKey":"kgL6Jw4C63fX6v8ZA1pB2qD3rE4tY5uI6oP7aQ8sS9dF0gH1jK2lL3zX4cV5bN6m","value":"W7xY8zA1bC2dE3fG4hI5jK6lM7nO8pQ9rS0tU1vW2xY3zA4bC5dE6fG7hI8jK9lM0nO1pQ2rS3tU4vW5xY6zA7bC8dE9fG0gH1iJ2kL3mN4oP5qR6sS7tT8uU9vV0wW1xX2yY3zZ4aA5bB6cC7dD8eE9fF0gG1hH2iI3jJ4kK5lL6mM7nN8oO9pP0qQ1rR2sS3tT4uU5vV6wW7xX8yY9zZ0aA1bB2cC3dD4eE5fF6gG7hH8iI9jJ0kK1lL2mM3nN4oO5pP6qQ7rR8sS9tT0uU1vV2wW3xX4yY5zZ6aA7bB8cC9dD0eE1fF2gG3hH4iI5jJ6kK7lL8mM9nN0oO1pP2qQ3rR4sS5tT6uU7vV8wW9xX0yY1zZ2aA3bB4cC5dD6eE7fF8gG9hH0iI1jJ2kK3lL4mM5nN6oO7pP8qQ9rR0sS1tT2uU3vV4wW5xX6yY7zZ8aA9bB0cC1dD2eE3fF4gG5hH6iI7jJ8kK9lL0mM1nN2oO3pP4qQ5rR6sS7tT8uU9vV0wW1","timestamp":1717488000,"type":"bundle","version":1}
```

**Why invalid:** Type is `"bundle"` but `commitments` is empty. A bundle must contain at least one commitment (§8.2, §8 verification checklist).

#### Example 10: Signature value too short

```json
{"metadata":{},"signature":{"algorithm":"ed25519","publicKey":"kgL6Jw4C63fX6v8ZA1pB2qD3rE4tY5uI6oP7aQ8sS9dF0gH1jK2lL3zX4cV5bN6m","value":"abc123"},"subject":"sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855","timestamp":1717488000,"type":"proof-receipt","version":1}
```

**Why invalid:** Signature value is too short. Ed25519 signatures are 64 bytes = 86 base64url characters. A 6-character value is malformed.

### 12.3 Bundle Proof Example

A bundle proof aggregating three independent receipts:

**Component Receipt A** (commitment only, full receipt omitted for brevity):
```
Commitment: sha256:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
```

**Component Receipt B:**
```
Commitment: sha256:bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
```

**Component Receipt C:**
```
Commitment: sha256:cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc
```

**Bundle receipt:**

```json
{"commitment":"sha256:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff","commitments":["sha256:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa","sha256:bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb","sha256:cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc"],"metadata":{},"signature":{"algorithm":"ed25519","publicKey":"kgL6Jw4C63fX6v8ZA1pB2qD3rE4tY5uI6oP7aQ8sS9dF0gH1jK2lL3zX4cV5bN6m","value":"W7xY8zA1bC2dE3fG4hI5jK6lM7nO8pQ9rS0tU1vW2xY3zA4bC5dE6fG7hI8jK9lM0nO1pQ2rS3tU4vW5xY6zA7bC8dE9fG0gH1iJ2kL3mN4oP5qR6sS7tT8uU9vV0wW1xX2yY3zZ4aA5bB6cC7dD8eE9fF0gG1hH2iI3jJ4kK5lL6mM7nN8oO9pP0qQ1rR2sS3tT4uU5vV6wW7xX8yY9zZ0aA1bB2cC3dD4eE5fF6gG7hH8iI9jJ0kK1lL2mM3nN4oO5pP6qQ7rR8sS9tT0uU1vV2wW3xX4yY5zZ6aA7bB8cC9dD0eE1fF2gG3hH4iI5jJ6kK7lL8mM9nN0oO1pP2qQ3rR4sS5tT6uU7vV8wW9xX0yY1zZ2aA3bB4cC5dD6eE7fF8gG9hH0iI1jJ2kK3lL4mM5nN6oO7pP8qQ9rR0sS1tT2uU3vV4wW5xX6yY7zZ8aA9bB0cC1dD2eE3fF4gG5hH6iI7jJ8kK9lL0mM1nN2oO3pP4qQ5rR6sS7tT8uU9vV0wW1","subject":"sha256:d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2","timestamp":1717488000,"type":"bundle","version":1}
```

**Verification of inclusion:**

1. Compute commitment of Receipt A: SHA-256(canonical body without commitment/signature) → verify against `sha256:aaa...`  
2. Confirm `sha256:aaa...` is in bundle's `commitments` array.
3. Sort commitments array: `[aaa..., bbb..., ccc...]` (already sorted in example).
4. Serialize sorted array to canonical JSON bytes.
5. SHA-256 → compare to `sha256:d2d2...` (bundle.subject).
6. Verify bundle signature per §5.5.

---

## 13. Implementation Guidance

### 13.1 Minimum Implementation Requirements

A conforming implementation MUST:

- Parse JSON per RFC 8259.
- Reject duplicate JSON keys.
- NFC-normalize all strings before hashing.
- Serialize objects with lexicographically sorted keys (by UTF-8 byte value).
- Serialize with zero whitespace between tokens.
- Implement SHA-256 hashing.
- Implement Ed25519 signature verification.
- Support base64url encoding/decoding (RFC 4648 §5) without padding.
- Perform all verification checks in the order specified in §8.

### 13.2 What an Implementation Should NOT Do

- Implement speculative or post-quantum cryptography. This specification uses SHA-256 and Ed25519 only. Future versions may upgrade; this version does not.
- Implement blockchain, DLT, or ledger anchoring. Receipts are self-contained.
- Implement telemetry, phone-home, or verification callbacks.
- Implement cloud-based verification services.
- Implement mutable receipt structures. All receipt fields are final upon creation.
- Implement AI or ML verification logic. Verification is deterministic arithmetic.
- Implement custom or non-standard JSON serialization. Use a standard JSON library with the canonicalization rules from §3.

### 13.3 Testing

Implementers should test against the following scenarios:

- Receipt with correct signature → verify returns SUCCESS.
- Receipt with wrong public key → verify returns FAILURE (signature invalid).
- Receipt with tampered body → verify returns FAILURE (commitment mismatch).
- Receipt with mismatched commitment field → verify returns FAILURE.
- Bundle with wrong subject → verify returns FAILURE (bundle subject mismatch).
- Receipt with duplicate keys → structural validation FAILURE.
- Receipt with non-canonical field order → pass after canonicalization.
- Receipt with non-NFC strings → pass if canonicalized, fail if compared raw.
- Empty receipt → structural validation FAILURE.
- Truncated signature value → structural validation FAILURE.

### 13.4 Language Portability Notes

| Concern | Guidance |
|---------|----------|
| JSON library | Use a library that allows sorted key serialization and whitespace control. |
| NFC normalization | Use the Unicode normalization library for your language (ICU, utf8proc, or built-in). |
| SHA-256 | Available in standard libraries of all major languages. |
| Ed25519 | Available via libsodium, OpenSSL, or language-specific crypto libraries. |
| Base64url | Standard base64 with `+/` replaced by `-_` and padding removed. |
| uint64 timestamps | Languages with only 32-bit integers (JS number) — timestamp is safe up to 2^53-1 (year ~287,396). Use BigInt if needed beyond that. |

---

## Appendix A: Canonical JSON Schema

See [`docs/spec/openproof-receipt-schema.json`](openproof-receipt-schema.json) in this repository.

---

## Appendix B: Deterministic Verification Checklist

A one-page reference for implementers. Each check is ordered.

### Pre-Verification (Structural)

- [ ] Input is non-empty
- [ ] Input is valid JSON
- [ ] No duplicate keys at any level
- [ ] All required fields present: `version`, `type`, `subject`, `timestamp`, `signature`
- [ ] `version` is integer `1`
- [ ] `type` is `"proof-receipt"` or `"bundle"`
- [ ] `subject` matches `^sha256:[a-f0-9]{64}$`
- [ ] `timestamp` is non-negative integer ≤ 253402300799
- [ ] `signature.algorithm` is `"ed25519"`
- [ ] `signature.publicKey` matches `^[A-Za-z0-9_-]{43}$`
- [ ] `signature.value` matches `^[A-Za-z0-9_-]{86}$`
- [ ] If `type` is `"bundle"`: `commitments` is present, non-empty array of valid hash strings
- [ ] If `metadata` present: all values are String/Number/Boolean/null (not Array/Object)

### Cryptographic Verification

- [ ] Canonicalize: NFC-normalize strings, sort keys, remove whitespace
- [ ] Strip `commitment` and `signature` fields
- [ ] Serialize remaining body to canonical JSON bytes
- [ ] Compute SHA-256 of body bytes → 32-byte digest
- [ ] Format as `"sha256:<hex>"` → compare to stored `commitment` (if present)
- [ ] Base64url-decode `signature.publicKey` → verify 32 bytes
- [ ] Base64url-decode `signature.value` → verify 64 bytes
- [ ] Ed25519.Verify(publicKey, digest_32_bytes, signature_64_bytes) → true

### Bundle-Specific

- [ ] Sort `commitments` lexicographically
- [ ] Serialize sorted array to canonical JSON bytes
- [ ] SHA-256 → `"sha256:<hex>"` → MUST equal `subject`

---

## Appendix C: Terminology

| Term | Definition |
|------|------------|
| **Receipt** | A canonical JSON structure containing a proof attestation and its signature. |
| **Commitment** | SHA-256 hash of the canonical receipt body (excluding commitment and signature fields). |
| **Subject** | SHA-256 hash of the external content being attested to. |
| **Body** | The receipt object with commitment and signature fields removed, before hashing. |
| **Canonical JSON** | JSON with sorted keys, no whitespace, NFC-normalized strings. |
| **Bundle** | A receipt whose subject is derived from an ordered set of receipt commitments. |
| **Ed25519** | EdDSA signature scheme over Curve25519 (RFC 8032). |
| **SHA-256** | SHA-2 with 256-bit digest (FIPS 180-4). |
| **Base64url** | Base64 encoding with URL-safe alphabet, no padding (RFC 4648 §5). |
| **NFC** | Unicode Normalization Form C (Unicode Standard Annex #15). |
| **Prototype** | The ecosystem maturity level for this specification (ecosystem-standards repo-maturity-model). |

---

## Appendix D: References

| Reference | Description |
|-----------|-------------|
| [RFC 2119](https://tools.ietf.org/html/rfc2119) | Key words for use in RFCs |
| [RFC 8259](https://tools.ietf.org/html/rfc8259) | JSON specification |
| [RFC 8032](https://tools.ietf.org/html/rfc8032) | Ed25519 signature algorithm |
| [RFC 4648 §5](https://tools.ietf.org/html/rfc4648#section-5) | Base64url encoding |
| [FIPS 180-4](https://nvlpubs.nist.gov/nistpubs/FIPS/NIST.FIPS.180-4.pdf) | SHA-2 hash functions |
| [Unicode Standard Annex #15](https://unicode.org/reports/tr15/) | Unicode normalization forms |
| [ecosystem-standards](https://github.com/sparshsam/ecosystem-standards) | Governance and doctrine for this ecosystem |
