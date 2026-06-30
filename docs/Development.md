# Development

## Prerequisites

- Node.js 22 or newer
- npm
- A WalletConnect project ID from [Reown Cloud](https://cloud.reown.com/)
- Base Sepolia test ETH for contract deployment or proof registration

## Setup

```bash
git clone https://github.com/sparshsam/openproof.git
cd openproof
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`.

## Environment Variables

Fill these values in `.env.local`:

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` | WalletConnect project ID (required) |
| `NEXT_PUBLIC_CHAIN_ID` | Chain ID — set to `84532` for Base Sepolia |
| `NEXT_PUBLIC_OPENPROOF_CONTRACT_ADDRESS` | Deployed registry contract address |
| `BASE_SEPOLIA_RPC_URL` | RPC URL for Base Sepolia (`https://sepolia.base.org`) |
| `DEPLOYER_PRIVATE_KEY` | Private key for contract deployment (never commit) |

Never commit private keys. `.env` and `.env.local` are ignored by git.

## Useful Commands

```bash
npm run dev          # Start development server
npm run lint         # Run ESLint
npm run typecheck    # Run TypeScript type checking
npm run build        # Production build
npm run compile      # Compile Solidity contracts
npm run test:contracts  # Run Hardhat contract tests
npm run deploy:base-sepolia  # Deploy registry contract
```

## Contract Commands

```bash
npm run compile                # Compile Solidity contracts
npm run test:contracts         # Run contract tests
npm run deploy:base-sepolia    # Deploy to Base Sepolia
```

Deployment requires `BASE_SEPOLIA_RPC_URL` and `DEPLOYER_PRIVATE_KEY` in `.env`.
