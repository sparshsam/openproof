# Changelog

All notable changes to OpenProof are documented here.

## 0.1.0 - 2026-05-29

Initial public MVP release.

### Added

- Local SHA-256 file hashing in the browser.
- Base Sepolia proof registration through `OpenProofRegistry`.
- Proof verification by re-hashing local files.
- JSON proof receipts.
- Receipt import and validation.
- Local-only proof history.
- Public proof explorer pages at `/proof/[hash]`.
- QR verification links.
- Deterministic bundle proofs.
- Base-inspired responsive interface.
- CI checks for audit, lint, typecheck, build, and contract tests.

### Security

- Added Vercel security headers.
- Added file and bundle size limits before hashing.
- Added safer wallet and RPC error messages.
- Added explicit WalletConnect missing-config handling.
