# Contributing to OpenProof

Thank you for your interest in OpenProof. The project is intentionally small, privacy-first, and zero-backend for the MVP.

## Quick Start

See [`docs/Development.md`](Development.md) for full setup instructions.

## Before Submitting a Pull Request

```bash
npm run lint
npm run typecheck
npm run build
npm run test:contracts
```

For UI changes, include screenshots. For security-sensitive changes, update the threat model or security policy.

## Product Boundaries

- Hash files locally in the browser.
- Register only hashes on Base Sepolia.
- Avoid server-side file uploads, databases, storage buckets, accounts, or IPFS.
- Do not add tokens, NFTs, staking, DeFi, social feeds, or ownership/legal overclaims.
- Do not commit private keys, wallet secrets, or deployment credentials.

## Pull Request Guidelines

- Short description of the change.
- Commands used to validate it.
- Screenshots for UI changes.
- Updated documentation for behavior, setup, or security changes.
- Focused scope; unrelated refactors in separate PRs.

## Commit Style

Use clear, practical commit messages:

```text
Improve receipt import validation
Add proof explorer empty state
Harden Base Sepolia network handling
```

## License

By contributing, you agree that your contributions are licensed under AGPL-3.0-only.

---

*For the full contributing guide, see [`CONTRIBUTING.md`](../CONTRIBUTING.md) at the repository root.*
