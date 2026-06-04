# OpenProof Verification Lifecycle

**Classification:** Permanent verification documentation
**Scope:** OpenProof, all deployments and forks
**Authority:** Ecosystem governance standards — [ecosystem-standards](https://github.com/sparshsam/ecosystem-standards)
**Status:** Adopted — see docs/SYSTEMS_DOCTRINE.md §0 for freeze classification

---

## 1. Proof Registration Lifecycle

A proof passes through seven distinct phases from user intent to onchain finality.

```
┌─────────┐   ┌──────────┐   ┌─────────────┐   ┌───────────┐
│ SELECT  │──▶│ HASH     │──▶│ PREFLIGHT    │──▶│ WALLET    │
│ FILE    │   │ LOCALLY  │   │ CHECK        │   │ SIGN      │
└─────────┘   └──────────┘   └─────────────┘   └─────┬─────┘
                                                      │
                    ┌──────────┐   ┌─────────────┐   │
                    │ RECEIPT  │◀──│ CONFIRM      │◀──│
                    │ GENERATE │   │ ONCHAIN      │   │
                    └──────────┘   └─────────────┘   │
                         │                     ┌─────┴─────┐
                         ▼                     │ SUBMIT    │
                    ┌──────────┐               │ TX        │
                    │ HISTORY  │               └───────────┘
                    │ (LOCAL)  │
                    └──────────┘
```

### Phase 1 — File Selection

The user selects one or more files through the browser's file picker or drag-and-drop. File bytes are read into an `ArrayBuffer` in browser memory. No file bytes are transmitted.

**Deterministic inputs:** File bytes, file name, file size, MIME type (as reported by the browser).

### Phase 2 — Local Hashing

The file `ArrayBuffer` is passed to the Web Crypto API's `crypto.subtle.digest("SHA-256", ...)`. For single-file proofs, the result is the SHA-256 digest of the file bytes. For bundle proofs, each file is hashed independently first (see [DATA_FLOW.md](DATA_FLOW.md) for bundle-specific steps).

**Deterministic guarantee:** The same file bytes always produce the same SHA-256 hash. This is a property of SHA-256, not of OpenProof.

**Independently reproducible:** `sha256sum <file>` or `openssl dgst -sha256 <file>` produce the same output. See [IMPLEMENTATION_NOTES.md](IMPLEMENTATION_NOTES.md) §6.1 for cross-platform hash portability.

### Phase 3 — Preflight Check

Before submitting a transaction, the frontend queries the contract's `proofExists(bytes32)` function. If the hash is already registered, the flow terminates with a "duplicate" state showing the existing registration's creator and timestamp. This check is a convenience — the contract's duplicate check is authoritative.

### Phase 4 — Wallet Signature

The frontend calls `writeContract` with the ABI-encoded `registerProof(bytes32)` call. The user's wallet renders the transaction parameters for review:

- Target contract address
- Function selector (`registerProof`)
- Arguments (single `bytes32` hash)
- Network (Base Sepolia, chain ID 84532)
- Estimated gas

The user must approve the transaction in their wallet. The frontend cannot initiate registration without user approval.

### Phase 5 — Transaction Submission

Once signed, the transaction is broadcast through the configured RPC provider. The frontend tracks submission and waits for a transaction hash. Transaction propagation time depends on network conditions.

### Phase 6 — Onchain Confirmation

The frontend monitors the transaction receipt using `useWaitForTransactionReceipt`. Confirmation occurs when the transaction is included in a block on Base Sepolia. The contract's `ProofRegistered` event is emitted atomically with the state write.

**Finality note:** Base Sepolia is an L2 with typical finality within one epoch (~15 minutes on mainnet; faster on testnet). A confirmed transaction receipt indicates inclusion, not irreversible finality.

### Phase 7 — Receipt Generation and History

After confirmation, the frontend:

1. Fetches the block timestamp from the confirmed block
2. Builds a `ProofReceipt` object with all proof metadata (see [receipt-schema.md](receipt-schema.md))
3. Offers the receipt as a local JSON download
4. Records the proof in local browser history (localStorage)

Receipt generation is a local cosmetic operation. No receipt data is transmitted.

## 2. Verification Lifecycle

Verification is a stateless, read-only operation. It does not require a wallet or transaction.

```
┌─────────┐   ┌──────────┐   ┌─────────────┐   ┌───────────┐
│ SELECT  │──▶│ HASH     │──▶│ QUERY        │──▶│ DISPLAY   │
│ FILE    │   │ LOCALLY  │   │ REGISTRY     │   │ RESULT    │
└─────────┘   └──────────┘   └─────────────┘   └───────────┘
                                  │
                    ┌─────────────┴─────────────┐
                    ▼                           ▼
            ┌──────────────┐           ┌──────────────┐
            │ FOUND        │           │ NOT FOUND    │
            │ Show creator │           │ Show absent  │
            │ Show time    │           │ message      │
            └──────────────┘           └──────────────┘
```

### 2.1 File Verification

1. **Select file.** User selects the original file through the browser.
2. **Hash locally.** SHA-256 is computed identically to the registration flow.
3. **Query registry.** The frontend calls `getProof(bytes32)` on the contract.
4. **Display result.** If the hash exists onchain, the proof record is displayed. If not, a "not found" state is shown.

### 2.2 Receipt Import Verification

A separate verification path for users who have a previously downloaded receipt JSON:

1. **Import receipt.** User selects or drops a `.json` file.
2. **Validate schema.** The frontend validates field types, hex formats, and date ranges. Multiple errors are collected and reported together.
3. **Query registry.** The receipt's `sha256Hash` is looked up onchain.
4. **Cross-reference.** The frontend reports whether the hash exists and whether the receipt metadata (contract address, chain ID) matches.

### 2.3 Independent Verification (No Frontend)

The system can be verified without the OpenProof frontend:

```bash
# 1. Compute hash
$ sha256sum <file>

# 2. Check onchain record (via any block explorer or RPC)
$ cast call <contract-address> "getProof(bytes32)" <hash> --rpc-url <rpc-endpoint>
$ cast call <contract-address> "proofExists(bytes32)" <hash> --rpc-url <rpc-endpoint>
```

This path eliminates all frontend trust. See [TRUST_MODEL.md](TRUST_MODEL.md) §4.1 (Frontend Trust Exit) for the trust analysis.

## 3. State Transitions

### 3.1 Registration State Machine

```
IDLE ──file selected──▶ HASHING ──hash ready──▶ HASH_READY
                                                    │
                        ┌───────────────────────────┤
                        │                           │
                        ▼                           ▼
               CHECKING_DUP                IDLE (file changed)
                        │
              ┌─────────┴─────────┐
              ▼                   ▼
           DUPLICATE            AWAITING_WALLET
                                    │
                                    ▼
                                SUBMITTED
                                    │
                                    ▼
                              CONFIRMING
                                    │
                              ┌─────┴─────┐
                              ▼           ▼
                         CONFIRMED     ERROR
```

Transitions:

| From | To | Trigger |
|------|----|---------|
| IDLE | HASHING | File selected |
| HASHING | HASH_READY | SHA-256 computed |
| HASHING | ERROR | Hashing failure (file too large, Web Crypto error) |
| HASH_READY | CHECKING_DUP | User clicks "Register" |
| CHECKING_DUP | IDLE | File changed during check |
| CHECKING_DUP | DUPLICATE | `proofExists` returns true |
| CHECKING_DUP | AWAITING_WALLET | `proofExists` returns false, wallet transaction initiated |
| AWAITING_WALLET | SUBMITTED | Transaction hash received |
| AWAITING_WALLET | ERROR | User rejects wallet prompt |
| SUBMITTED | CONFIRMING | Transaction receipt poll begins |
| SUBMITTED | ERROR | Transaction broadcast failure |
| CONFIRMING | CONFIRMED | Transaction receipt received |
| CONFIRMING | ERROR | Confirmation timeout or reverted transaction |
| CONFIRMED | — | Terminal state; receipt downloaded or shared |

### 3.2 Verification State Machine

```
IDLE ──file selected──▶ HASHING ──hash ready──▶ HASH_READY
                                                    │
                        ┌───────────────────────────┤
                        │                           │
                        ▼                           ▼
                     CHECKING                   IDLE (file changed)
                          │
                    ┌─────┴─────┐
                    ▼           ▼
               VERIFIED     NOT_FOUND
               or ERROR
```

## 4. Verification Invariants

These invariants hold across all verification operations.

| # | Invariant | Detail |
|---|-----------|--------|
| 1 | Hash repeatability | Same file bytes always produce the same SHA-256 hash. See [TRUST_MODEL.md](TRUST_MODEL.md) G1. |
| 2 | Registry consistency | `getProof` always returns the same record for the same hash, or reverts. See [TRUST_MODEL.md](TRUST_MODEL.md) G3. |
| 3 | No false positives | No mechanism exists to register a proof without a valid wallet transaction |
| 4 | No false negatives | A registered hash remains verifiable indefinitely (no deletion, no expiry). See [TRUST_MODEL.md](TRUST_MODEL.md) G5. |
| 5 | Deterministic bundle hashing | Same file set with same rules produces same bundle hash. See [TRUST_MODEL.md](TRUST_MODEL.md) G2. |
| 6 | Receipt validation completeness | Receipt validation catches all structural errors before onchain lookup. See [IMPLEMENTATION_NOTES.md](IMPLEMENTATION_NOTES.md) §2.3 for the validation rule list. |
| 7 | Verification independence | Proof verification does not require wallet, transaction, or registration |
| 8 | Cross-verifiability | Onchain state can be read through any block explorer or RPC, not only the OpenProof frontend |
| 9 | Bundle verification parity | Bundle verification uses the same deterministic rules as registration |
| 10 | Receipt non-authoritativeness | A valid receipt alone is insufficient; onchain match is required. See [TRUST_MODEL.md](TRUST_MODEL.md) R4. |

## 5. Duplicate Detection

The contract enforces duplicate detection at the state level:

```solidity
if (proofs[fileHash].timestamp != 0) {
    revert ProofAlreadyRegistered(fileHash);
}
```

Because `timestamp == 0` is the sentinel value for "unregistered" and no valid block can have timestamp zero, this check is safe. The frontend also performs an optimistic preflight check (`proofExists`) to avoid unnecessary wallet prompts, but this check is non-authoritative — the contract's check is the source of truth.

## 6. Bundle Verification Requirements

Bundle verification is a stricter variant of single-file verification. See [IMPLEMENTATION_NOTES.md](IMPLEMENTATION_NOTES.md) §2.2 for the bundle hash algorithm and [IMPLEMENTATION_NOTES.md](IMPLEMENTATION_NOTES.md) §10 for bundle rule versioning:

1. **Exact file set.** The same set of files (same names, sizes, content) must be provided in the same browser session.
2. **Same rules.** The `bundleRuleVersion` used at registration must be applied at verification.
3. **Same stable stringify.** JSON key ordering and array ordering must match the registration-time algorithm.

The bundle manifest embedded in the receipt records the file-level hashes and the `bundleRuleVersion`, enabling off-frontend recomputation:

```bash
$ sha256sum file1 > hash1
$ sha256sum file2 > hash2
# Build manifest with sorted entries per bundle rule v1
# Stable-stringify the manifest
# SHA-256 hash the manifest bytes
```

## 7. Lifecycle Edge Cases

### 7.1 Registration Reverted

If the transaction reverts (e.g., frontrun duplicate, out-of-gas, contract error), the frontend detects the revert through `useWaitForTransactionReceipt` and transitions to an error state. The hash is not registered and no receipt is generated.

### 7.2 Stalled Wallet Prompt

If the user opens the wallet prompt but never approves or rejects it, the frontend remains in "awaiting-wallet" indefinitely. No timeout is enforced at the application level. The user can cancel by reloading or closing the page.

### 7.3 Lost Transaction

A transaction that is broadcast but never confirmed (e.g., stuck in the mempool) will keep the frontend in "submitted" or "confirming" state. The user can check the transaction hash on BaseScan directly.

### 7.4 Verification of Unregistered Hash

Querying a hash that has never been registered returns `null`. The contract's `getProof` reverts for unregistered hashes; the frontend catches this and displays a "not found" state. The `proofExists` function returns `false`.

### 7.5 Verification After Chain Reorganization

A chain reorg that removes the registration block would cause `getProof` to revert for a previously registered hash. The frontend would display "not found." The reorg risk on Base Sepolia is minimal beyond one epoch; for mainnet deployments, deeper reorgs are possible but uncommon.
# OpenProof Verification Lifecycle

**Classification:** Permanent verification documentation
**Scope:** OpenProof, all deployments and forks
**Authority:** Ecosystem governance standards — [ecosystem-standards](https://github.com/sparshsam/ecosystem-standards)
**Status:** Ratified — do not amend without governance review

---

## 1. Proof Registration Lifecycle

A proof passes through seven distinct phases from user intent to onchain finality.

```
┌─────────┐   ┌──────────┐   ┌─────────────┐   ┌───────────┐
│ SELECT  │──▶│ HASH     │──▶│ PREFLIGHT    │──▶│ WALLET    │
│ FILE    │   │ LOCALLY  │   │ CHECK        │   │ SIGN      │
└─────────┘   └──────────┘   └─────────────┘   └─────┬─────┘
                                                      │
                    ┌──────────┐   ┌─────────────┐   │
                    │ RECEIPT  │◀──│ CONFIRM      │◀──│
                    │ GENERATE │   │ ONCHAIN      │   │
                    └──────────┘   └─────────────┘   │
                         │                     ┌─────┴─────┐
                         ▼                     │ SUBMIT    │
                    ┌──────────┐               │ TX        │
                    │ HISTORY  │               └───────────┘
                    │ (LOCAL)  │
                    └──────────┘
```

### Phase 1 — File Selection

The user selects one or more files through the browser's file picker or drag-and-drop. File bytes are read into an `ArrayBuffer` in browser memory. No file bytes are transmitted.

**Deterministic inputs:** File bytes, file name, file size, MIME type (as reported by the browser).

### Phase 2 — Local Hashing

The file `ArrayBuffer` is passed to the Web Crypto API's `crypto.subtle.digest("SHA-256", ...)`. For single-file proofs, the result is the SHA-256 digest of the file bytes. For bundle proofs, each file is hashed independently first (see [DATA_FLOW.md](DATA_FLOW.md) for bundle-specific steps).

**Deterministic guarantee:** The same file bytes always produce the same SHA-256 hash. This is a property of SHA-256, not of OpenProof.

**Independently reproducible:** `sha256sum <file>` or `openssl dgst -sha256 <file>` produce the same output. See [IMPLEMENTATION_NOTES.md](IMPLEMENTATION_NOTES.md) §6.1 for cross-platform hash portability.

### Phase 3 — Preflight Check

Before submitting a transaction, the frontend queries the contract's `proofExists(bytes32)` function. If the hash is already registered, the flow terminates with a "duplicate" state showing the existing registration's creator and timestamp. This check is a convenience — the contract's duplicate check is authoritative.

### Phase 4 — Wallet Signature

The frontend calls `writeContract` with the ABI-encoded `registerProof(bytes32)` call. The user's wallet renders the transaction parameters for review:

- Target contract address
- Function selector (`registerProof`)
- Arguments (single `bytes32` hash)
- Network (Base Sepolia, chain ID 84532)
- Estimated gas

The user must approve the transaction in their wallet. The frontend cannot initiate registration without user approval.

### Phase 5 — Transaction Submission

Once signed, the transaction is broadcast through the configured RPC provider. The frontend tracks submission and waits for a transaction hash. Transaction propagation time depends on network conditions.

### Phase 6 — Onchain Confirmation

The frontend monitors the transaction receipt using `useWaitForTransactionReceipt`. Confirmation occurs when the transaction is included in a block on Base Sepolia. The contract's `ProofRegistered` event is emitted atomically with the state write.

**Finality note:** Base Sepolia is an L2 with typical finality within one epoch (~15 minutes on mainnet; faster on testnet). A confirmed transaction receipt indicates inclusion, not irreversible finality.

### Phase 7 — Receipt Generation and History

After confirmation, the frontend:

1. Fetches the block timestamp from the confirmed block
2. Builds a `ProofReceipt` object with all proof metadata (see [receipt-schema.md](receipt-schema.md))
3. Offers the receipt as a local JSON download
4. Records the proof in local browser history (localStorage)

Receipt generation is a local cosmetic operation. No receipt data is transmitted.

## 2. Verification Lifecycle

Verification is a stateless, read-only operation. It does not require a wallet or transaction.

```
┌─────────┐   ┌──────────┐   ┌─────────────┐   ┌───────────┐
│ SELECT  │──▶│ HASH     │──▶│ QUERY        │──▶│ DISPLAY   │
│ FILE    │   │ LOCALLY  │   │ REGISTRY     │   │ RESULT    │
└─────────┘   └──────────┘   └─────────────┘   └───────────┘
                                  │
                    ┌─────────────┴─────────────┐
                    ▼                           ▼
            ┌──────────────┐           ┌──────────────┐
            │ FOUND        │           │ NOT FOUND    │
            │ Show creator │           │ Show absent  │
            │ Show time    │           │ message      │
            └──────────────┘           └──────────────┘
```

### 2.1 File Verification

1. **Select file.** User selects the original file through the browser.
2. **Hash locally.** SHA-256 is computed identically to the registration flow.
3. **Query registry.** The frontend calls `getProof(bytes32)` on the contract.
4. **Display result.** If the hash exists onchain, the proof record is displayed. If not, a "not found" state is shown.

### 2.2 Receipt Import Verification

A separate verification path for users who have a previously downloaded receipt JSON:

1. **Import receipt.** User selects or drops a `.json` file.
2. **Validate schema.** The frontend validates field types, hex formats, and date ranges. Multiple errors are collected and reported together.
3. **Query registry.** The receipt's `sha256Hash` is looked up onchain.
4. **Cross-reference.** The frontend reports whether the hash exists and whether the receipt metadata (contract address, chain ID) matches.

### 2.3 Independent Verification (No Frontend)

The system can be verified without the OpenProof frontend:

```bash
# 1. Compute hash
$ sha256sum <file>

# 2. Check onchain record (via any block explorer or RPC)
$ cast call <contract-address> "getProof(bytes32)" <hash> --rpc-url <rpc-endpoint>
$ cast call <contract-address> "proofExists(bytes32)" <hash> --rpc-url <rpc-endpoint>
```

This path eliminates all frontend trust. See [TRUST_MODEL.md](TRUST_MODEL.md) §4.1 (Frontend Trust Exit) for the trust analysis.

## 3. State Transitions

### 3.1 Registration State Machine

```
IDLE ──file selected──▶ HASHING ──hash ready──▶ HASH_READY
                                                    │
                        ┌───────────────────────────┤
                        │                           │
                        ▼                           ▼
               CHECKING_DUP                IDLE (file changed)
                        │
              ┌─────────┴─────────┐
              ▼                   ▼
           DUPLICATE            AWAITING_WALLET
                                    │
                                    ▼
                                SUBMITTED
                                    │
                                    ▼
                              CONFIRMING
                                    │
                              ┌─────┴─────┐
                              ▼           ▼
                         CONFIRMED     ERROR
```

Transitions:

| From | To | Trigger |
|------|----|---------|
| IDLE | HASHING | File selected |
| HASHING | HASH_READY | SHA-256 computed |
| HASHING | ERROR | Hashing failure (file too large, Web Crypto error) |
| HASH_READY | CHECKING_DUP | User clicks "Register" |
| CHECKING_DUP | IDLE | File changed during check |
| CHECKING_DUP | DUPLICATE | `proofExists` returns true |
| CHECKING_DUP | AWAITING_WALLET | `proofExists` returns false, wallet transaction initiated |
| AWAITING_WALLET | SUBMITTED | Transaction hash received |
| AWAITING_WALLET | ERROR | User rejects wallet prompt |
| SUBMITTED | CONFIRMING | Transaction receipt poll begins |
| SUBMITTED | ERROR | Transaction broadcast failure |
| CONFIRMING | CONFIRMED | Transaction receipt received |
| CONFIRMING | ERROR | Confirmation timeout or reverted transaction |
| CONFIRMED | — | Terminal state; receipt downloaded or shared |

### 3.2 Verification State Machine

```
IDLE ──file selected──▶ HASHING ──hash ready──▶ HASH_READY
                                                    │
                        ┌───────────────────────────┤
                        │                           │
                        ▼                           ▼
                     CHECKING                   IDLE (file changed)
                          │
                    ┌─────┴─────┐
                    ▼           ▼
               VERIFIED     NOT_FOUND
               or ERROR
```

## 4. Verification Invariants

These invariants hold across all verification operations.

| # | Invariant | Detail |
|---|-----------|--------|
| 1 | Hash repeatability | Same file bytes always produce the same SHA-256 hash. See [TRUST_MODEL.md](TRUST_MODEL.md) G1. |
| 2 | Registry consistency | `getProof` always returns the same record for the same hash, or reverts. See [TRUST_MODEL.md](TRUST_MODEL.md) G3. |
| 3 | No false positives | No mechanism exists to register a proof without a valid wallet transaction |
| 4 | No false negatives | A registered hash remains verifiable indefinitely (no deletion, no expiry). See [TRUST_MODEL.md](TRUST_MODEL.md) G5. |
| 5 | Deterministic bundle hashing | Same file set with same rules produces same bundle hash. See [TRUST_MODEL.md](TRUST_MODEL.md) G2. |
| 6 | Receipt validation completeness | Receipt validation catches all structural errors before onchain lookup. See [IMPLEMENTATION_NOTES.md](IMPLEMENTATION_NOTES.md) §2.3 for the validation rule list. |
| 7 | Verification independence | Proof verification does not require wallet, transaction, or registration |
| 8 | Cross-verifiability | Onchain state can be read through any block explorer or RPC, not only the OpenProof frontend |
| 9 | Bundle verification parity | Bundle verification uses the same deterministic rules as registration |
| 10 | Receipt non-authoritativeness | A valid receipt alone is insufficient; onchain match is required. See [TRUST_MODEL.md](TRUST_MODEL.md) R4. |

## 5. Duplicate Detection

The contract enforces duplicate detection at the state level:

```solidity
if (proofs[fileHash].timestamp != 0) {
    revert ProofAlreadyRegistered(fileHash);
}
```

Because `timestamp == 0` is the sentinel value for "unregistered" and no valid block can have timestamp zero, this check is safe. The frontend also performs an optimistic preflight check (`proofExists`) to avoid unnecessary wallet prompts, but this check is non-authoritative — the contract's check is the source of truth.

## 6. Bundle Verification Requirements

Bundle verification is a stricter variant of single-file verification. See [IMPLEMENTATION_NOTES.md](IMPLEMENTATION_NOTES.md) §2.2 for the bundle hash algorithm and [IMPLEMENTATION_NOTES.md](IMPLEMENTATION_NOTES.md) §10 for bundle rule versioning:

1. **Exact file set.** The same set of files (same names, sizes, content) must be provided in the same browser session.
2. **Same rules.** The `bundleRuleVersion` used at registration must be applied at verification.
3. **Same stable stringify.** JSON key ordering and array ordering must match the registration-time algorithm.

The bundle manifest embedded in the receipt records the file-level hashes and the `bundleRuleVersion`, enabling off-frontend recomputation:

```bash
$ sha256sum file1 > hash1
$ sha256sum file2 > hash2
# Build manifest with sorted entries per bundle rule v1
# Stable-stringify the manifest
# SHA-256 hash the manifest bytes
```

## 7. Lifecycle Edge Cases

### 7.1 Registration Reverted

If the transaction reverts (e.g., frontrun duplicate, out-of-gas, contract error), the frontend detects the revert through `useWaitForTransactionReceipt` and transitions to an error state. The hash is not registered and no receipt is generated.

### 7.2 Stalled Wallet Prompt

If the user opens the wallet prompt but never approves or rejects it, the frontend remains in "awaiting-wallet" indefinitely. No timeout is enforced at the application level. The user can cancel by reloading or closing the page.

### 7.3 Lost Transaction

A transaction that is broadcast but never confirmed (e.g., stuck in the mempool) will keep the frontend in "submitted" or "confirming" state. The user can check the transaction hash on BaseScan directly.

### 7.4 Verification of Unregistered Hash

Querying a hash that has never been registered returns `null`. The contract's `getProof` reverts for unregistered hashes; the frontend catches this and displays a "not found" state. The `proofExists` function returns `false`.

### 7.5 Verification After Chain Reorganization

A chain reorg that removes the registration block would cause `getProof` to revert for a previously registered hash. The frontend would display "not found." The reorg risk on Base Sepolia is minimal beyond one epoch; for mainnet deployments, deeper reorgs are possible but uncommon.
