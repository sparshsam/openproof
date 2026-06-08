# OpenProof — AI Agent Instructions

## Product Identity

OpenProof is a minimal, verifiable proof-of-existence app on Base Sepolia. Users submit document fingerprints (hashes) onchain to create timestamped, immutable attestations.

## Architecture Boundaries

1. **Onchain minimalism.** The smart contract is intentionally simple — just hash submission and verification. Receipt metadata lives off-chain.
2. **Base Sepolia only.** Testnet deployment. No mainnet until vetted.
3. **Wallet-required.** All attestations require a connected wallet (Coinbase Smart Wallet, MetaMask, or any EIP-1193 provider).
4. **Receipt schema v2.** Receipts are versioned JSON documents. See [docs/receipt-spec.md](docs/receipt-spec.md) for the canonical schema.

## Tech Stack

- **Contract:** Solidity (Hardhat, ethers.js)
- **Frontend:** Next.js 16, TypeScript, Tailwind v4, wagmi, viem, @coinbase/onchainkit
- **Chain:** Base Sepolia
- **AI agenting:** Base MCP server for agent-created attestations

## Rules

1. Never modify the contract without updating the receipt schema.
2. Keep the contract gas-efficient and minimal.
3. Receipt design is guided by [docs/receipt-spec.md](docs/receipt-spec.md) and CLAUDE.md.
4. Branch naming: `feat/*`, `fix/*`, `docs/*`, `refactor/*`, `chore/*`.
5. No direct pushes to `main`. PRs require CI pass.

## Ecosystem Standards

All ecosystem repos follow: https://github.com/sparshsam/ecosystem-standards
