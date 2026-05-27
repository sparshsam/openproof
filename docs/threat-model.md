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

Do not use OpenProof for legal, financial, or regulated claims without professional advice.

## Operational Risks

- The frontend must be served honestly. A malicious deployment could alter hashing or transaction behavior.
- Users should verify the contract address and chain before relying on a proof.
- Wallets may show confusing transaction prompts; users should confirm the target chain is Base Sepolia for the MVP.
- Public RPC providers may rate-limit log queries.

## MVP Boundaries

- No paid database.
- No paid storage.
- No file uploads.
- No IPFS.
- No mainnet deployment.
- Base Sepolia first.
