# OpenProof Privacy Policy

**Last updated:** 2026-06-21  
**App version:** 0.1.1  
**Contact:** [GitHub Issues](https://github.com/sparshsam/openproof/issues)

## Summary

OpenProof is a privacy-first, local-first proof-of-existence app. It is designed so that user files never leave the user's device. The app has no backend, no database, no analytics, and no account system. This policy describes what happens (and does not happen) with your information.

## What OpenProof Does NOT Do

- **No file uploads.** Files selected in the app are read through the browser File API. They are hashed locally using the Web Crypto API. The file bytes are never sent to any server.
- **No backend.** The app is a fully static web application. There is no server-side application, database, storage bucket, or API endpoint that receives or stores user data.
- **No accounts.** OpenProof does not have user accounts, profiles, or registration. Wallet connection is optional and user-initiated.
- **No analytics or tracking.** The app does not include analytics scripts, tracking pixels, fingerprinting, cookies for advertising, or any other data collection mechanisms.
- **No persistent storage of files.** Proof receipts are generated locally and downloaded by the user. Recent proof history is stored only in the browser's local storage and can be cleared by the user at any time.
- **No email collection.** The app does not ask for or collect email addresses.

## What OpenProof Does

### File Hashing

When you select a file to create or verify a proof, OpenProof reads the file contents into browser memory and computes a SHA-256 hash using the Web Crypto API. The hash computation happens entirely on your device. The file contents exist in browser memory only for the duration of the hashing operation and are not stored, transmitted, or logged.

### Onchain Registration

If you choose to register a proof on the Base Sepolia blockchain, the following information is submitted to the `OpenProofRegistry` smart contract via your connected wallet:

- A 32-byte SHA-256 hash of your file (the "file fingerprint")

This transaction is public on the Base Sepolia blockchain. Anyone can see the hash, the timestamp, and the wallet address that submitted it.

### Proof Receipts

When a proof is registered, OpenProof generates a local JSON receipt that may include:

- File name and MIME type
- SHA-256 hash
- Wallet address used for registration
- Transaction hash and explorer URL
- Timestamp of registration
- Chain and contract information

Receipts are generated locally and offered to you as a download. OpenProof never stores or transmits your receipts.

### Local Proof History

OpenProof saves recent proof hashes in your browser's local storage so you can revisit your proofs. This data stays on your device and can be cleared by clearing browser data or using the app's clear-history action.

### Wallet Connection

Wallet connections are handled by RainbowKit and WalletConnect. When you connect a wallet, OpenProof reads your wallet address and chain ID. The wallet connection is managed entirely by the wallet provider (e.g., Coinbase Wallet, MetaMask). OpenProof does not have access to your private keys or seed phrase.

## Data Sharing

OpenProof does not sell, rent, share, or otherwise transfer your personal information to third parties. The onchain registration data (SHA-256 hash, wallet address, timestamp) is public by nature of the blockchain — this is an intentional design property of the proof-of-existence system, not a data-sharing practice.

## Third-Party Services

OpenProof interacts with the following third-party services, all initiated by user action:

| Service | Purpose | Data | User Initiation |
|---------|---------|------|-----------------|
| Base Sepolia RPC (sepolia.base.org) | Blockchain read/write | Transaction data, contract state | User clicks "Register" or "Verify" |
| WalletConnect Cloud (cloud.walletconnect.com) | Wallet connection | Wallet address, chain ID | User clicks "Connect Wallet" |
| Reown Cloud (reown.com) | Wallet connection relay | Connection metadata | User initiates wallet connection |
| BaseScan (sepolia.basescan.org) | Block explorer links | Transaction hash (read-only) | User clicks explorer link |
| Vercel | Hosting | Standard HTTP logs (IP, user agent, timestamps) | User visits the app |

Each of these services operates under its own privacy policy. OpenProof does not control their data practices.

## Cryptography Notice

OpenProof uses SHA-256 (Web Crypto API) for file hashing and Ed25519 (optional, for receipt signing) as described in the [receipt specification](spec/receipt-specification.md). These are standard cryptographic operations performed locally in the browser.

## Children's Privacy

OpenProof does not knowingly collect any personal information from children. The app has no user registration, data collection, or interactive features that would require age verification.

## Changes to This Policy

If this policy changes materially, the "Last updated" date at the top will be updated. Given OpenProof's local-first architecture, material changes would most likely involve adding optional features; core file-hashing privacy guarantees are architectural, not merely policy.

## Contact

For privacy-related questions or concerns, please open an issue at:

https://github.com/sparshsam/openproof/issues

For sensitive security concerns, see [SECURITY.md](../SECURITY.md) for responsible disclosure instructions.
