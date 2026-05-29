# Threat Model

OpenProof is a proof-of-existence tool, not a proof-of-ownership or legal attestation system.

## Claims OpenProof Can Support

- A wallet registered a specific SHA-256 hash on the configured chain.
- The contract recorded a timestamp for that registration.
- A later file can be hashed locally and compared against the registered hash.

## Claims OpenProof Does Not Support

- OpenProof does not prove file ownership by itself.
- OpenProof does not prove authorship.
- OpenProof does not prove that the file contents are true.
- OpenProof does not prove legal validity.
- OpenProof does not recover the original file if it is lost.

## Privacy Risks

Files are hashed locally. Only the hash is sent onchain. However, public hashes may leak information if the file is already known, guessable, low entropy, or available to an attacker for comparison.

Local proof history is stored in the user's browser. It can reveal file names, hashes, transaction hashes, and timestamps to anyone with access to that browser profile. Users can clear this history from the UI or by clearing browser data.

Receipt JSON files are local artifacts. They can reveal file names, file sizes, MIME types, hashes, wallet addresses, and transaction hashes to anyone who receives or accesses the receipt file. A receipt should be treated as a portable proof record, not a private document.

Proof explorer pages and QR codes expose the hash in the URL. Sharing a proof page or QR code publicly shares the registered hash and associated onchain metadata.

Bundle proofs may reveal the combined bundle hash publicly. If a bundle manifest or the original file set is known to an attacker, the bundle can be checked by recomputing the deterministic bundle hash.

Do not use OpenProof for legal, financial, or regulated claims without professional advice.

## Operational Risks

- The frontend must be served honestly. A malicious deployment could alter hashing or transaction behavior.
- Users should verify the contract address and chain before relying on a proof.
- Wallets may show confusing transaction prompts; users should confirm the target chain is Base Sepolia for the MVP.
- Public RPC providers may rate-limit log queries.
- Browser local storage can be cleared, corrupted, or unavailable in some privacy modes.
- Receipt import depends on the receipt schema and onchain state. A valid receipt file is not sufficient without a matching registry entry.
- Bundle verification requires the same deterministic rules. If future versions change bundle rules, receipts should identify the rule used.

## MVP Boundaries

- No paid database.
- No paid storage.
- No file uploads.
- No IPFS.
- No mainnet deployment.
- Base Sepolia first.

## Feature Boundaries

- Local history is convenience storage only, not a backup or account system.
- Receipt import validates OpenProof receipts and onchain existence, not legal ownership.
- Proof explorer pages expose public onchain metadata only.
- QR verification links to proof pages; it does not encode or store files.
- Bundle proofs register a deterministic combined hash; OpenProof cannot recover, reconstruct, or inspect the bundled files.
