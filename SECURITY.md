# Security Policy

OpenProof is a testnet MVP and should not be used for legal, financial, medical, compliance, or regulated claims without professional advice.

## Reporting Vulnerabilities

Please report security issues privately before public disclosure.

Preferred path:

1. Open a private GitHub security advisory if available.
2. If advisories are unavailable, contact the maintainers privately through GitHub.
3. Include reproduction steps, affected versions or commits, and expected impact.

Please do not publish exploit details until maintainers have had a reasonable chance to respond.

## In Scope

Relevant security issues include:

- Smart contract bugs.
- Incorrect proof registration or verification results.
- Accidental file upload, persistence, or metadata leakage.
- Receipt data that misrepresents the onchain proof.
- Bundle hashing determinism bugs.
- Secret handling problems in deployment scripts, docs, or workflows.
- Wallet or network handling that could cause users to submit unintended transactions.

## Out of Scope

OpenProof intentionally does not claim to solve:

- File storage or recovery.
- Authorship, ownership, lawful possession, or content truth.
- Legal notarization.
- Mainnet finality or production-grade compliance workflows.
- Protection against hash guessing for known, small, or low-entropy files.

## Security Model Summary

OpenProof proves that a matching SHA-256 hash was registered by a wallet at a recorded Base Sepolia contract timestamp. Files are hashed locally in the browser, and only hashes are sent onchain.

The public registry, proof pages, transaction links, and receipts may expose file hashes, wallet addresses, timestamps, transaction hashes, and user-provided file metadata contained in locally generated receipts.
