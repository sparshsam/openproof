# Design Philosophy

## Why Proof-of-Existence?

A file's hash on a public blockchain is not proof of authorship, ownership, or truthfulness. It is proof that *some piece of data existed before a certain block time* and was registered by a particular address. That is the only claim OpenProof makes.

This limitation is intrinsic to the technique, not a shortcoming of this implementation. A cryptographic hash proves the existence of its preimage at a point in time — nothing more, nothing less. All higher claims (authorship, intellectual property, notarisation) require legal and social attestation beyond what a hash registry can provide.

## Design Constraints

### No File Uploads

The most important architectural decision was also the simplest: never accept a file on the server. There is no upload endpoint, no storage bucket, no database for file content. The file never leaves the owner's device.

This eliminates the entire class of server-side data exposure risks. It also keeps the project zero-cost to operate on Vercel's free tier, which is a deliberate property — a proof-of-existence tool that requires a paid server plan would be a contradiction.

### Minimal Contract Surface

The smart contract exposes exactly two operations: `registerProof(bytes32)` and `getProof(bytes32)`. No token approvals, no ETH transfers, no proxy patterns, no upgradeability. The contract is immutable after deployment.

A minimal surface means a minimal attack surface. Every line of Solidity that is not written is a bug that cannot exist.

### Deterministic Receipts

Receipts are JSON files generated locally from deterministic rules. They contain no server-produced identifiers or signatures. A receipt is valid if its hash matches the onchain registry — no intermediate authority required.

This means receipts remain verifiable as long as the contract exists. No API key, no server uptime, no SaaS dependency.

### Bundle Proofs as a Logical Extension

Single-file and bundle proofs use the same `registerProof(bytes32)` function. A bundle is simply the hash of a deterministic manifest of file hashes. This keeps the contract ignorant of what is being proved while enabling multi-file workflows.

## Trust Model

OpenProof does not ask users to trust the frontend. Every proof can be verified independently:

1. Compute `sha256sum` of the file with any trusted tool.
2. Look up the hash on BaseScan Sepolia.
3. Cross-reference the contract address against the canonical address in this repository.

The frontend is a convenience, not an authority.

## On Open Source

OpenProof is AGPLv3 because the problem it addresses — verifiable document timestamps — benefits from being fully inspectable. A closed-source proof-of-existence tool would be a contradiction: if you cannot inspect the hashing logic, you cannot trust the proof.
