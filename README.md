# OpenProof

OpenProof is an open-source proof-of-existence tool. It lets users create timestamped blockchain proofs for files without uploading or storing the files themselves.

Users drag in a file, OpenProof hashes it locally in the browser with SHA-256, and the connected wallet registers only the `bytes32` hash on Base Sepolia. Later, anyone can select the same file, hash it locally again, and verify whether that exact hash was registered.

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
- Add reproducible deployment metadata.
- Add multilingual documentation.

## License

AGPL-3.0-only. See [LICENSE](LICENSE).
