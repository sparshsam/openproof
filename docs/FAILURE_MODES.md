# OpenProof Failure Modes

**Classification:** Permanent failure mode documentation
**Scope:** OpenProof, all deployments and forks
**Authority:** Ecosystem governance standards — [ecosystem-standards](https://github.com/sparshsam/ecosystem-standards)
**Status:** Ratified — do not amend without governance review

---

## 1. Failure Mode Classification

Each failure mode is classified by:

| Dimension | Values | Meaning |
|-----------|--------|---------|
| Severity | Critical, High, Medium, Low | Impact on proof integrity or usability |
| Detectability | Immediate, Delayed, Silent | Time before the user or system can detect the failure |
| Scope | Single-user, Multi-user, All users | Population affected |
| Recoverability | Automatic, Manual, Irrecoverable | Whether state can be restored |

---

## 2. Registration Failures

### F-R1: Wallet Transaction Rejected by User

| Property | Value |
|----------|-------|
| **Severity** | Low |
| **Detectability** | Immediate |
| **Scope** | Single-user |
| **Recoverability** | Automatic |

**Trigger:** User closes wallet prompt or presses "Reject" during transaction signing.

**Behavior:** The wallet returns a "User rejected" error. The frontend captures this error pattern and transitions to error state with message: "The wallet transaction was cancelled." The system returns to idle state.

**User impact:** No state change. No gas spent. The user can retry at any time.

**Mitigation:** The frontend distinguishes rejection from other errors and provides a clear "try again" CTA.

---

### F-R2: Insufficient Gas Funds

| Property | Value |
|----------|-------|
| **Severity** | Medium |
| **Detectability** | Immediate |
| **Scope** | Single-user |
| **Recoverability** | Manual |

**Trigger:** The connected wallet does not have enough test ETH (Base Sepolia) to pay for the registration transaction's gas.

**Behavior:** The RPC node rejects the transaction before broadcasting. The frontend detects the "insufficient funds" error pattern and displays: "Insufficient test ETH to pay for gas on Base Sepolia."

**User impact:** No state change. No gas spent. The user must acquire test ETH from a faucet before retrying.

**Mitigation:** The frontend identifies this specific error pattern and provides a targeted message rather than a generic error.

---

### F-R3: Duplicate Registration Attempt

| Property | Value |
|----------|-------|
| **Severity** | Low |
| **Detectability** | Immediate |
| **Scope** | Single-user |
| **Recoverability** | Automatic |

**Trigger:** User attempts to register a hash that is already registered onchain. This can happen in two ways:
1. The preflight `proofExists` check catches it (optimistic path)
2. The contract reverts with `ProofAlreadyRegistered` if the preflight check was bypassed or stale

**Behavior:** If preflight catches it, the UI shows the existing proof details. If the contract reverts, the transaction fails with no state change.

**User impact:** No proof created. No gas spent (if preflight catches) or gas spent on reverted transaction (if contract reverts).

**Mitigation:** The preflight check prevents unnecessary wallet prompts. The duplicate detection is a contract invariant (ARCHITECTURE.md I3) — no hash can be registered twice even without the preflight check.

---

### F-R4: RPC Rate Limit During Preflight

| Property | Value |
|----------|-------|
| **Severity** | Medium |
| **Detectability** | Immediate |
| **Scope** | All users (public RPC) |
| **Recoverability** | Automatic |

**Trigger:** The public RPC endpoint returns HTTP 429 (rate limit exceeded) during the preflight `proofExists` check.

**Behavior:** The frontend catches rate limit error patterns and transitions to error state with: "The RPC provider rate-limited this request. Please wait a moment and try again."

**User impact:** Registration cannot proceed. No state change. No gas spent.

**Mitigation:** The frontend distinguishes rate limit errors from other RPC failures. Users can switch to a different RPC provider by modifying their wallet's RPC configuration. Self-hosted users can use their own RPC endpoint.

---

### F-R5: Network Connectivity Failure

| Property | Value |
|----------|-------|
| **Severity** | Medium |
| **Detectability** | Immediate |
| **Scope** | Single-user |
| **Recoverability** | Automatic |

**Trigger:** The browser cannot reach the Base Sepolia RPC endpoint due to network outage, DNS failure, or connectivity interruption.

**Behavior:** The `publicClient.readContract` call throws a network error. The frontend catches this and displays: "Could not reach the Base Sepolia RPC. Check your connection and try again."

**User impact:** Registration and verification are unavailable until connectivity is restored.

**Mitigation:** The frontend distinguishes network errors from other failures with a targeted message. Users can retry when connectivity is restored.

---

### F-R6: Transaction Reverted Onchain

| Property | Value |
|----------|-------|
| **Severity** | Medium |
| **Detectability** | Immediate (on receipt) |
| **Scope** | Single-user |
| **Recoverability** | Automatic |

**Trigger:** The transaction is mined but reverts. Possible causes: frontrunning duplicate registration (rare), out-of-gas, internal contract error.

**Behavior:** `useWaitForTransactionReceipt` returns a receipt with status "reverted." The frontend transitions to error state.

**User impact:** Gas is consumed (the transaction was mined). No proof is registered.

**Mitigation:** The contract has no external calls, so reentrancy or out-of-gas during execution is not possible. The most likely revert cause is a frontrun duplicate — the hash was registered in the same block (ARCHITECTURE.md I3 protects against overwrites).

---

### F-R7: Transaction Stuck in Mempool

| Property | Value |
|----------|-------|
| **Severity** | Low |
| **Detectability** | Delayed |
| **Scope** | Single-user |
| **Reсoverability** | Manual |

**Trigger:** The signed transaction is broadcast but not included in a block within a reasonable time.

**Behavior:** The frontend remains in "submitted" state. No timeout is enforced at the application level. The user can check BaseScan using the transaction hash.

**User impact:** Wallet is potentially blocked if the same nonce is pending. User may need to replace the transaction (speed up or cancel) from their wallet.

**Mitigation:** The frontend provides the transaction hash and a BaseScan link so the user can monitor. No application-level timeout is desirable because confirmation times vary with network conditions.

---

### F-R8: Hashing Failure

| Property | Value |
|----------|-------|
| **Severity** | High |
| **Detectability** | Immediate |
| **Scope** | Single-user |
| **Recoverability** | Automatic |

**Trigger:** The Web Crypto API throws an error during SHA-256 computation. Possible causes: file too large for available memory, corrupted file, browser limitation.

**Behavior:** The promise rejection is caught, and the error is surfaced as: "The browser could not hash this file."

**User impact:** Proof cannot be created for this file through the browser.

**Mitigation:** This is a browser-level limitation. Users can compute SHA-256 with an external tool (`sha256sum`, `openssl`) and verify the resulting hash against the onchain registry through a block explorer — independent of the OpenProof frontend. Registration of external hashes through the OpenProof frontend is not supported; users requiring registration must use a different browser or device that can read the file.

---

## 3. Verification Failures

### F-V1: RPC Unreachable

| Property | Value |
|----------|-------|
| **Severity** | Medium |
| **Detectability** | Immediate |
| **Scope** | Single-user |
| **Recoverability** | Automatic |

Same as F-R5 but scoped to verification operation. Verification cannot complete without RPC access. Users can verify through a block explorer directly.

---

### F-V2: Stale or Incomplete Event Lookup

| Property | Value |
|----------|-------|
| **Severity** | Low |
| **Detectability** | Delayed |
| **Scope** | Single-user |
| **Recoverability** | Automatic |

**Trigger:** The event log lookup for a specific hash's transaction hash exceeds the 50,000-block lookback window.

**Behavior:** `findProofTransactionHash` returns `undefined`. The proof data (creator, timestamp) is still returned from `getProof`, but the transaction hash is unavailable through the frontend.

**User impact:** The proof page shows proof data without a transaction link. The transaction hash can still be found through BaseScan by searching for the `ProofRegistered` event.

**Mitigation:** Event lookup is best-effort. The proof record comes from `getProof` (see [TRUST_MODEL.md](TRUST_MODEL.md) G3 for the deterministic guarantee), which is always authoritative regardless of event log availability.

---

### F-V3: Receipt Schema Validation Failure

| Property | Value |
|----------|-------|
| **Severity** | Low |
| **Detectability** | Immediate |
| **Scope** | Single-user |
| **Recoverability** | Manual |

**Trigger:** User imports a JSON file that does not match the expected receipt schema. Possible causes: corrupted file, receipt from a different application, manual editing, old schema version.

**Behavior:** The validator returns detailed errors for each failed field check. Multiple errors are collected and reported together.

**User impact:** The receipt cannot be verified through the import flow. The user may still verify the hash manually if the `sha256Hash` field is intact.

**Mitigation:** Error messages specify exactly which fields failed and why. The user can inspect the file and correct it (if it's a known format issue) or obtain a valid receipt from the original registration.

---

### F-V4: Receipt Contract Address Mismatch

| Property | Value |
|----------|-------|
| **Severity** | Medium |
| **Detectability** | Immediate |
| **Scope** | Single-user |
| **Recoverability** | Manual |

**Trigger:** The receipt's `contractAddress` does not match the contract address configured in the current frontend deployment.

**Behavior:** The verification flow proceeds — it reads the receipt hash from the receipt's configured contract address (not the current frontend's configured address). If that contract exists and the hash is registered, it reports success. If not, it reports not found.

**User impact:** A valid proof registered on a different deployment will not verify through a frontend configured for a different contract address, unless the receipt carries the matching address.

**Mitigation:** Receipts carry their own contract address. Verification reads from the receipt's contract address. The user should confirm they are querying the correct contract.

---

### F-V5: Bundle Verification Drift

| Property | Value |
|----------|-------|
| **Severity** | High |
| **Detectability** | Delayed |
| **Scope** | All users (version-dependent) |
| **Recoverability** | Manual |

**Trigger:** Verification of a bundle receipt using a different bundle rule than the one used at registration. This occurs when the bundle algorithm changes between versions and the verifier applies the new rule.

**Behavior:** The recomputed bundle hash will not match the registered hash, even with the same file set.

**User impact:** A bundle that should verify successfully reports a mismatch.

**Mitigation:** The receipt carries `bundleRuleVersion` (currently `1`, rule: `"sort-by-name-size-type-hash"`). Verifiers must apply the matching rule for the stored version. If the rule is ever updated, backward-compatible verification code must be maintained. Users can reconstruct the bundle hash manually using the `bundleFiles` hashes in the receipt.

---

## 4. Infrastructure Failures

### F-I1: Frontend Deployment Compromise

| Property | Value |
|----------|-------|
| **Severity** | Critical |
| **Detectability** | Silent |
| **Scope** | All users |
| **Recoverability** | Manual |

**Trigger:** The hosted frontend (Vercel or self-hosted) serves modified JavaScript that alters behavior. Possible causes: CDN compromise, Vercel account takeover, supply-chain attack on build dependencies.

**Behavior:** A compromised frontend could:
- Hash a different value than the selected file
- Send file bytes to an external server
- Display a different contract address
- Return false verification results
- Inject phishing prompts into wallet interactions

**User impact:** Potentially catastrophic — user could register a different hash than intended, verify against a false registry, or expose file bytes.

**Mitigation:**
- Users can independently verify proofs without the OpenProof frontend (see [TRUST_MODEL.md](TRUST_MODEL.md))
- Self-hosted users should verify build digests
- The wallet renders transaction parameters independently, so a compromised frontend cannot register a proof without user approval
- The contract is immutable: even a compromised frontend cannot modify onchain state without signed transactions

---

### F-I2: Smart Contract Vulnerability

| Property | Value |
|----------|-------|
| **Severity** | Critical |
| **Detectability** | Delayed |
| **Scope** | All users |
| **Recoverability** | Irrecoverable |

**Trigger:** An undiscovered vulnerability in the deployed contract allows unauthorized modification of proof records.

**The contract is 48 lines of Solidity and has been reviewed for:**
- Reentrancy: No external calls after state changes
- Access control: None (by design — anyone can register any new hash)
- Integer overflow: `uint64` timestamp cast from `block.timestamp` — safe (Unix epoch is ~1.7×10⁹, uint64 max is ~1.8×10¹⁹)
- Zero timestamp sentinel: `timestamp == 0` is used for "not found" — safe because no valid block timestamp can be zero
- Zero hash rejection: `bytes32(0)` is rejected — SHA-256 of empty input is `0xe3b0c44...`, not zero
- No upgrade vulnerability: No proxy, no delegatecall, no owner functions

**User impact:** Depending on the vulnerability: proof records could be corrupted, overwritten, or deleted. An immutable contract with no upgrade mechanism means a vulnerable contract cannot be patched — it must be abandoned and redeployed.

**Mitigation:** The contract is minimal enough for full manual audit. Source code is published and verified on BaseScan. Any vulnerability discovered would require all users to migrate proofs to a new deployment (proofs cannot be transferred or copied; users would register new proofs).

---

### F-I3: Chain Cessation or Fork

| Property | Value |
|----------|-------|
| **Severity** | Medium |
| **Detectability** | Immediate |
| **Scope** | All users |
| **Recoverability** | Manual |

**Trigger:** Base Sepolia is deprecated, shut down, or experiences a reorganization that reverts the registration block.

**Behavior:** Proofs registered on the affected chain are no longer verifiable through the original chain state. If the chain is replaced by a fork that did not include the registration transaction, the proof is lost.

**User impact:** Loss of all proofs registered on the affected chain. Receipts become historical artifacts with no onchain match.

**Mitigation:** This risk is inherent to testnet usage. Production deployments should target a mainnet chain with stronger finality guarantees. The contract can be redeployed on any EVM chain; users would need to re-register proofs. No proof migration mechanism exists (and none is planned).

---

### F-I4: Public RPC Deprecation

| Property | Value |
|----------|-------|
| **Severity** | Low |
| **Detectability** | Delayed |
| **Scope** | All users |
| **Recoverability** | Manual |

**Trigger:** The public RPC endpoint used by the default frontend configuration becomes unavailable or changes its URL.

**Behavior:** The frontend cannot read blockchain state. Verification and proof page loads fail.

**User impact:** Verification through the default frontend is unavailable.

**Mitigation:** The contract's ABI and address are public. Verification can be performed through any RPC endpoint, block explorer, or local node. Self-hosted deployments can configure a different RPC endpoint.

---

## 5. User-Initiated Failures

### F-U1: Wrong Chain Connection

| Property | Value |
|----------|-------|
| **Severity** | Medium |
| **Detectability** | Immediate |
| **Scope** | Single-user |
| **Recoverability** | Automatic |

**Trigger:** User connects a wallet that is on a different chain (e.g., Ethereum mainnet, Arbitrum) instead of Base Sepolia.

**Behavior:** The frontend detects `chainId !== expectedChainId` and displays a network notice. The "Register" button is disabled. A chain switch prompt is available.

**User impact:** Registration is blocked until the wallet switches to Base Sepolia.

**Mitigation:** The frontend provides a one-click chain switch button using `switchChain`. The verification flow (read-only) works regardless of wallet chain because it uses a dedicated public client configured for Base Sepolia.

---

### F-U2: File Changed Between Selection and Registration

| Property | Value |
|----------|-------|
| **Severity** | Low |
| **Detectability** | Delayed |
| **Scope** | Single-user |
| **Recoverability** | Manual |

**Trigger:** User selects a file, the hash is computed, then the file is modified or replaced on disk before the registration transaction is submitted.

**Behavior:** The frontend holds the originally computed hash. The registration goes through with the original hash. When the user later verifies with the modified file, the hashes will not match.

**User impact:** The proof will not verify with the modified file. The user must keep the original file for verification.

**Mitigation:** This is a user-side file management issue. OpenProof hashes the bytes present in the browser at selection time. The receipt records the file metadata (name, size, type) that was present at hash time.

---

### F-U3: File Too Large for Browser

| Property | Value |
|----------|-------|
| **Severity** | High |
| **Detectability** | Immediate |
| **Scope** | Single-user |
| **Recoverability** | Automatic |

**Trigger:** User selects a file whose size exceeds browser/device memory limits for `arrayBuffer()` read. This is browser-dependent (typically 2 GB on modern Chrome, lower on mobile or constrained devices).

**Behavior:** The file is selected but `arrayBuffer()` fails or `crypto.subtle.digest` throws a DOMException. The error is surfaced as a hashing failure.

**User impact:** The file cannot be hashed through the OpenProof frontend.

**Mitigation:** Users can hash large files with `sha256sum` or `openssl` on their native OS. The resulting hash can be registered via a different tool that can submit the transaction to the contract, or by pasting a precomputed hash if such a feature is supported.

---

## 6. Failure Mode Summary

### Registration

| ID | Failure | Severity | Recovery | 
|----|---------|----------|----------|
| F-R1 | Wallet rejection | Low | Automatic |
| F-R2 | Insufficient gas | Medium | Manual |
| F-R3 | Duplicate registration | Low | Automatic |
| F-R4 | RPC rate limit | Medium | Automatic |
| F-R5 | Network connectivity | Medium | Automatic |
| F-R6 | Transaction revert | Medium | Automatic |
| F-R7 | Stuck mempool | Low | Manual |
| F-R8 | Hashing failure | High | Automatic |

### Verification

| ID | Failure | Severity | Recovery |
|----|---------|----------|----------|
| F-V1 | RPC unreachable | Medium | Automatic |
| F-V2 | Stale event lookup | Low | Automatic |
| F-V3 | Receipt schema validation | Low | Manual |
| F-V4 | Contract address mismatch | Medium | Manual |
| F-V5 | Bundle verification drift | High | Manual |

### Infrastructure

| ID | Failure | Severity | Recovery |
|----|---------|----------|----------|
| F-I1 | Frontend compromise | Critical | Manual |
| F-I2 | Contract vulnerability | Critical | Irrecoverable |
| F-I3 | Chain cessation/fork | Medium | Manual |
| F-I4 | RPC deprecation | Low | Manual |

### User-Initiated

| ID | Failure | Severity | Recovery |
|----|---------|----------|----------|
| F-U1 | Wrong chain | Medium | Automatic |
| F-U2 | File changed after selection | Low | Manual |
| F-U3 | File too large | High | Automatic |

## 7. Failure Mode Verification Matrix

The following table maps each failure mode to the invariant that would be violated if the failure were not caught:

| Failure | Invariant | Defense |
|---------|-----------|---------|
| F-R3 duplicate | No hash registered twice | Contract revert `ProofAlreadyRegistered` |
| F-R6 tx revert | Registration requires valid tx | Receipt not generated without confirmation |
| F-I1 frontend compromise | File bytes never leave browser | Wallet renders tx independently |
| F-I2 contract vuln | Immutable, deterministic contract | Open-source audit, verified bytecode |
| F-V5 bundle drift | Deterministic bundle hashing | Versioned rules, receipt records version |
| F-U1 wrong chain | Registration on target chain | Chain ID check on frontend |
