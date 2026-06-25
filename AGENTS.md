# OpenProof — AI Agent Instructions

## Product Identity

OpenProof is a privacy-first, open-source cryptographic proof-of-existence tool for files, built on Base Sepolia. Users hash files locally in the browser and register only the SHA-256 fingerprint onchain. No uploads, no accounts, no backend.

## Current Version

v0.2.0 — Cryptographic Foundation + Bundle Proofs + Professional Evidence + Verification Engine + Long-Term Preservation + Explorer Improvements.

Deployed at https://proof.kovina.org.

## Architecture

1. **Onchain minimalism.** Smart contract: registerProof, getProof, proofExists, registryVersion. Receipt metadata lives off-chain.
2. **Chain registry.** Chain configuration abstraction supports multiple EVM chains (Base Sepolia active, Base Mainnet prepared).
3. **Wallet-required.** RainbowKit + wagmi. Coinbase Smart Wallet, MetaMask, any EIP-1193 provider.
4. **Receipt schema v3.** Versioned JSON receipts with forward-compatible metadata, registry version, optional chain context. Auto-download on registration.
5. **Merkle tree bundles.** Bundle proofs use SHA-256 Merkle trees. Each file's hash is a leaf; the Merkle root is registered onchain. Individual inclusion proofs are verifiable.
6. **Verification engine.** Full receipt verification pipeline with 11+ checks: schema, chain, contract, onchain, timestamps, registry version, bundle consistency.
7. **Theme toggle.** Light/dark mode with localStorage persistence. System preference on first visit.
8. **Native pages.** `/about`, `/privacy`, `/terms` — no GitHub redirects.
9. **Bundle explorer.** `/bundle/[hash]` — bundle proof page with file listing, Merkle root, inclusion verification.

## Tech Stack

- **Contract:** Solidity 0.8.24 (Hardhat, ethers.js) — v2 (registryVersion getter)
- **Frontend:** Next.js 16, TypeScript, Tailwind v4, wagmi v2, viem, RainbowKit
- **Chain:** Base Sepolia (chain ID 84532), Base Mainnet (pre-configured, inactive)
- **Design:** Black canvas, `#0081CC` accent, pill buttons, Block/Cash App-inspired editorial layout
- **PWA:** Installable, service worker, cross-platform icons
- **Verification:** Receipt schema validation, Merkle inclusion proofs, chain-aware lookups

## Rules

1. Read `CLAUDE.md` before making changes — it is the primary source of truth.
2. Never modify the contract without updating the receipt schema.
3. Keep receipts versioned and backward-compatible.
4. Branch naming: `feat/*`, `fix/*`, `docs/*`, `refactor/*`, `chore/*`.
5. No direct pushes to `main`. CI must pass.
6. Run `npm run lint`, `typecheck`, `build`, `test:contracts` before meaningful changes.
7. Preserve zero-backend, no-upload, local-first architecture.

## Ecosystem Standards

All ecosystem repos follow: https://github.com/sparshsam/ecosystem-standards
