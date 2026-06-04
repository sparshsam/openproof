# Contributing

Thanks for helping improve OpenProof. The project is intentionally small, privacy-first, and zero-backend for the MVP.

## Development Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Before opening a pull request, run:

```bash
npm run lint
npm run typecheck
npm run build
npm run test:contracts
```

## Product Boundaries

Keep contributions aligned with the core model:

- Hash files locally in the browser.
- Register only hashes on Base Sepolia.
- Avoid server-side file uploads.
- Avoid mandatory databases, storage buckets, accounts, or IPFS.
- Do not add tokens, NFTs, staking, DeFi, social feeds, or ownership/legal overclaims.
- Do not commit private keys, wallet secrets, RPC secrets, or deployment credentials.

## Pull Requests

Good pull requests include:

- A short description of the change.
- The commands used to validate it.
- Screenshots or recordings for UI changes.
- Updated documentation for behavior, setup, or security changes.
- Focused scope; unrelated refactors should be separate.

Security-sensitive changes should also update [`SECURITY.md`](SECURITY.md) or [`docs/threat-model.md`](docs/threat-model.md) when relevant.

## Commit Style

Use clear, practical commit messages. Prefer:

```text
Improve receipt import validation
Add proof explorer empty state
Harden Base Sepolia network handling
```

## License

By contributing, you agree that your contribution is licensed under AGPL-3.0-only.
