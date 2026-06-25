# OpenProof Environment Variables

## Required

| Variable | Description | Default | Example |
|----------|-------------|---------|---------|
| `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` | WalletConnect/Reown project ID | — | `abc123...` |
| `NEXT_PUBLIC_OPENPROOF_CONTRACT_ADDRESS` | Deployed OpenProofRegistry address | — | `0x60d3...` |

## Optional

| Variable | Description | Default | Example |
|----------|-------------|---------|---------|
| `NEXT_PUBLIC_CHAIN_ID` | Target chain ID | `84532` (Base Sepolia) | `8453` (Base Mainnet) |
| `BASE_SEPOLIA_RPC_URL` | Custom RPC endpoint for contract deployment | `https://sepolia.base.org` | `https://base-sepolia.g.alchemy.com/v2/...` |
| `DEPLOYER_PRIVATE_KEY` | Private key for Hardhat deployments | — | `0x...` |

## Environment Separation

| Environment | CHAIN_ID | Contract | Notes |
|-------------|----------|----------|-------|
| Development | `84532` | Testnet | `NEXT_PUBLIC_OPENPROOF_CONTRACT_ADDRESS` required |
| Preview | `84532` | Testnet | Vercel preview deployments use same contract |
| Production | `84532` (or `8453`) | Testnet (or Mainnet) | Mainnet requires deployed contract and audit |

## Security Notes

- `NEXT_PUBLIC_*` vars are bundled into the client-side JS. Never put secrets here.
- `DEPLOYER_PRIVATE_KEY` is used only in Hardhat scripts. Never commit to git.
- WalletConnect project ID is public but should be scoped to the app domain.
