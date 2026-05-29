# OpenProof

OpenProof is a privacy-first, open-source proof-of-existence app for files, built on Base Sepolia.

It lets users create timestamped blockchain proofs for file fingerprints without uploading or storing the files themselves. Files are hashed locally in the browser with SHA-256, and only the resulting `bytes32` hash is registered onchain through a minimal Solidity contract.

[![Live app](https://img.shields.io/badge/live-openproof.vercel.app-0052FF?style=for-the-badge)](https://openproof.vercel.app)
[![CI](https://img.shields.io/github/actions/workflow/status/sparshsam/openproof/ci.yml?branch=main&style=for-the-badge&label=CI)](https://github.com/sparshsam/openproof/actions/workflows/ci.yml)
[![License: AGPL v3](https://img.shields.io/github/license/sparshsam/openproof?style=for-the-badge)](LICENSE)
[![Built on Base Sepolia](https://img.shields.io/badge/Built%20on-Base%20Sepolia-0052FF?style=for-the-badge)](https://sepolia.basescan.org/address/0x60d3DD631E6e4F6D76f761689d6FA229945a874a)

![OpenProof landing page](assets/screenshot-main.png)

## Quick Links

- [Live app](https://openproof.vercel.app)
- [BaseScan contract](https://sepolia.basescan.org/address/0x60d3DD631E6e4F6D76f761689d6FA229945a874a)
- [Architecture](docs/architecture.md)
- [Threat model](docs/threat-model.md)
- [Security policy](SECURITY.md)
- [Contributing](CONTRIBUTING.md)
- [Changelog](CHANGELOG.md)

## What OpenProof Does

OpenProof creates a verifiable timestamp for a file hash:

1. Select a file in the browser.
2. OpenProof hashes the file locally using SHA-256.
3. Connect a wallet on Base Sepolia.
4. Register only the hash in `OpenProofRegistry`.
5. Download a local JSON receipt or share the proof page.
6. Verify later by hashing the exact same file again.

No file uploads. No server-side storage. No database. No IPFS dependency for the MVP.

## Screenshots

| Create proof | Verify proof |
| --- | --- |
| ![Create proof screen](assets/screenshot-create.png) | ![Verify proof screen](assets/screenshot-verify.png) |

Additional screenshots are available in [`public/screenshots`](public/screenshots).

## Features

| Feature | Status | Notes |
| --- | --- | --- |
| Local SHA-256 hashing | Available | Uses the browser Web Crypto API. File bytes stay local. |
| Proof registration | Available | Registers `bytes32` hashes on Base Sepolia. |
| Proof verification | Available | Re-hashes local files and checks the registry. |
| JSON proof receipts | Available | Generated and downloaded locally; never uploaded by OpenProof. |
| Receipt import | Available | Validates OpenProof receipt JSON and checks the hash onchain. |
| Local proof history | Available | Stored only in browser local storage. |
| Public proof pages | Available | `/proof/[hash]` reads public registry state. |
| QR verification | Available | Encodes the proof page URL, not the file. |
| Bundle proofs | Available | Deterministic combined hash for multiple local files. |
| Base mainnet | Roadmap | Current MVP is Base Sepolia testnet only. |

## Built on Base Sepolia

OpenProof v0 uses Base Sepolia so contributors and users can test the proof flow without real funds.

- Chain: Base Sepolia
- Chain ID: `84532`
- Explorer: [BaseScan Sepolia](https://sepolia.basescan.org)
- Registry contract: [`0x60d3DD631E6e4F6D76f761689d6FA229945a874a`](https://sepolia.basescan.org/address/0x60d3DD631E6e4F6D76f761689d6FA229945a874a)

The current public app is a testnet proof-of-existence utility. Base mainnet deployment is a roadmap item, not a current production claim.

## Privacy Model

OpenProof is designed around local-first proof creation:

- Files are read through the browser File API.
- Hashing happens locally with the Web Crypto API.
- Only the SHA-256 hash is sent to the smart contract.
- Receipts are local JSON downloads.
- Recent proof history stays in browser local storage.
- There is no backend upload endpoint, database, storage bucket, or account system.

Important caveat: public hashes can leak information if the original file is already known, small, or easy to guess. Do not register hashes for sensitive guessable content without understanding that risk.

## Security Notes

OpenProof proves that a matching hash was registered by a wallet at a recorded chain timestamp. It does not prove authorship, ownership, lawful possession, legal validity, or the truth of a file's contents.

If the original file is lost, OpenProof cannot recover it. The chain stores only the hash.

Do not use OpenProof for legal, financial, medical, compliance, or regulated claims without professional advice. See [`docs/threat-model.md`](docs/threat-model.md) and [`SECURITY.md`](SECURITY.md).

## Install and Run

Requirements:

- Node.js 22 or newer
- npm
- A WalletConnect project ID from Reown Cloud
- Base Sepolia test ETH for contract deployment or proof registration

```bash
git clone https://github.com/sparshsam/openproof.git
cd openproof
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`.

Fill these values in `.env.local`:

```bash
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=
NEXT_PUBLIC_CHAIN_ID=84532
NEXT_PUBLIC_OPENPROOF_CONTRACT_ADDRESS=0x60d3DD631E6e4F6D76f761689d6FA229945a874a
BASE_SEPOLIA_RPC_URL=https://sepolia.base.org
DEPLOYER_PRIVATE_KEY=
```

Never commit private keys. `.env` and `.env.local` are ignored by git.

## Build From Source

```bash
npm run lint
npm run typecheck
npm run build
npm run test:contracts
```

## Tech Stack

- Next.js 15
- TypeScript
- Tailwind CSS
- wagmi, viem, RainbowKit
- Solidity and Hardhat
- Base Sepolia
- Vercel

Contract commands:

```bash
npm run compile
npm run test:contracts
npm run deploy:base-sepolia
```

Deployment requires `BASE_SEPOLIA_RPC_URL` and `DEPLOYER_PRIVATE_KEY` in `.env`.

## Deploy to Vercel

OpenProof deploys as a static Next.js app with no backend services required.

1. Fork or clone this repository.
2. Import it into Vercel.
3. Add the public environment variables:
   - `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`
   - `NEXT_PUBLIC_CHAIN_ID=84532`
   - `NEXT_PUBLIC_OPENPROOF_CONTRACT_ADDRESS`
4. Deploy with the default Next.js settings.

No paid domain, database, storage bucket, file uploads, or IPFS pinning service is required for the MVP.

## Project Structure

```text
contracts/                  Solidity registry contract
docs/                       Architecture, threat model, deployment notes
public/screenshots/         App screenshots used by docs and social previews
scripts/                    Contract deployment script
src/app/                    Next.js App Router pages
src/components/             Reusable UI and wallet components
src/lib/                    Hashing, receipts, contracts, history, proof utilities
test/                       Hardhat contract tests
```

## Roadmap

- Optional detached signature support.
- Better event indexing for larger deployments.
- Base mainnet deployment.
- Reproducible deployment metadata.
- Expanded documentation for self-hosting.
- Multilingual documentation.

## Contributing

Contributions are welcome when they preserve the core architecture: local hashing, no file uploads, no mandatory backend, and no speculative token or DeFi features.

Before opening a pull request:

```bash
npm run lint
npm run typecheck
npm run build
npm run test:contracts
```

For UI changes, include screenshots. For security-sensitive changes, update the threat model or security policy where relevant. See [`CONTRIBUTING.md`](CONTRIBUTING.md).

## Repository Metadata

Recommended GitHub topics:

```text
base, base-sepolia, built-on-base, onchain, proof-of-existence, ethereum,
solidity, viem, wagmi, rainbowkit, web3, cryptography, privacy-first,
nextjs, typescript, tailwindcss, vercel, agplv3
```

## License

OpenProof is licensed under AGPL-3.0-only. See [`LICENSE`](LICENSE).
