# OpenProof 🔏

OpenProof is a privacy-first, open-source proof-of-existence app for files.

It lets users prove that a specific file existed at a certain time without uploading the file anywhere. Files are hashed locally in the browser using SHA-256, and only the fingerprint is registered on the Base Sepolia blockchain through a minimal Solidity smart contract.

No file uploads. No storage bucket. No database required for the core proof flow.

Built with:

- Next.js 15
- TypeScript
- Tailwind CSS
- Solidity
- wagmi + RainbowKit
- Base Sepolia
- AGPLv3

## Built on Base

OpenProof v0 is built on Base Sepolia, the Base testnet. Base Sepolia is used for the zero-spend MVP because users and contributors can test proof registration without spending real funds.

Current network:

- Chain: Base Sepolia
- Chain ID: `84532`
- Explorer: [BaseScan Sepolia](https://sepolia.basescan.org)
- Registry contract: [`0x60d3DD631E6e4F6D76f761689d6FA229945a874a`](https://sepolia.basescan.org/address/0x60d3DD631E6e4F6D76f761689d6FA229945a874a)

Base mainnet deployment is a future roadmap item. The current public MVP should be treated as a testnet proof-of-existence tool.

## What OpenProof Is

- A privacy-first proof-of-existence MVP.
- A local file hashing app with an onchain hash registry.
- A zero-spend starter that can run on Vercel free tier.
- An AGPLv3 open-source project.

## What OpenProof Is Not

- It is not file storage.
- It is not IPFS.
- It is not a paid database or upload service.
- It is not a legal, financial, or regulated claims product.
- It does not prove file ownership by itself.

## Privacy Model

Files never leave the browser. OpenProof reads the selected file through the browser File API and hashes it with the Web Crypto API. The app sends only the SHA-256 hash to the smart contract. Receipts are generated locally as JSON downloads and are not uploaded anywhere.

Public hashes may still leak information if the file is already known or easy to guess. Do not register hashes for sensitive, guessable, or low-entropy content without understanding that risk.

## Threat Model

OpenProof proves that a matching file hash was registered by a wallet at a certain time. It does not prove authorship, ownership, lawful possession, or the truth of the file contents. If the original file is lost, OpenProof cannot recover it.

See [docs/threat-model.md](docs/threat-model.md) for details.

## Tech Stack

- Next.js 15
- TypeScript
- Tailwind CSS
- wagmi
- viem
- RainbowKit
- Solidity
- Hardhat
- Base Sepolia
- Vercel

## Zero-Spend MVP Setup

1. Use a free WalletConnect project ID from Reown Cloud for RainbowKit.
2. Use Base Sepolia testnet ETH from a faucet.
3. Use the public Base Sepolia RPC or your own free RPC endpoint.
4. Deploy the frontend on Vercel free tier.
5. Do not enable paid storage, databases, domains, IPFS pinning, or mainnet deployment for v0.

## Local Development

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`.

## Smart Contract

Compile and test:

```bash
npm run compile
npm run test:contracts
```

Deploy to Base Sepolia:

```bash
cp .env.example .env
# Fill BASE_SEPOLIA_RPC_URL and DEPLOYER_PRIVATE_KEY.
npm run deploy:base-sepolia
```

After deployment, set the returned address in:

```bash
NEXT_PUBLIC_OPENPROOF_CONTRACT_ADDRESS=
NEXT_PUBLIC_CHAIN_ID=84532
```

Never commit private keys. `.env` and `.env.local` are ignored by git.

## Base Sepolia Faucet ETH

Add Base Sepolia to your wallet, then get test ETH from a Base Sepolia faucet. The deployment wallet only needs enough test ETH to deploy `OpenProofRegistry`.

View the deployed registry on [BaseScan Sepolia](https://sepolia.basescan.org/address/0x60d3DD631E6e4F6D76f761689d6FA229945a874a). Proof registration receipts link to BaseScan Sepolia transaction pages.

## Vercel Deployment

1. Push this repo to a public GitHub repository.
2. Import it in Vercel.
3. Add these environment variables:
   - `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`
   - `NEXT_PUBLIC_CHAIN_ID=84532`
   - `NEXT_PUBLIC_OPENPROOF_CONTRACT_ADDRESS`
4. Deploy with the default Next.js settings.

No server uploads, database, storage bucket, paid domain, or IPFS service is required.

## Validation

```bash
npm run lint
npm run typecheck
npm run build
npm run test:contracts
```

Manual validation:

- Hash generation works after selecting a local file.
- Proof registration works on Base Sepolia after contract deployment.
- Proof verification succeeds for the exact same file.
- Proof verification returns not found for changed or different files.
- Proof receipt JSON downloads locally.

## Roadmap

- Publish a public demo deployment.
- Add imported receipt verification.
- Add optional detached signature support.
- Add better event indexing for large deployments.
- Base mainnet deployment.
- Add reproducible deployment metadata.
- Add multilingual documentation.

## Repository Topics

Suggested GitHub topics:

- base
- base-sepolia
- built-on-base
- onchain
- proof-of-existence
- ethereum
- solidity
- viem
- wagmi
- rainbowkit
- web3
- cryptography

## License

AGPL-3.0-only. See [LICENSE](LICENSE).
