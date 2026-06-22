# Changelog

All notable changes to OpenProof are documented here.

## 0.1.1 - 2026-06-21

### Added

- PWA support with web manifest, service worker, and app icons.
- Cross-platform icon set (Web/PWA, Windows, macOS, iOS, Android adaptive).
- Release checklist, store metadata, privacy policy, and terms of service documentation.
- Platform readiness documentation for PWA, MSIX, DMG, iOS, and Android deployment.

### Changed

- Bumped app version to 0.1.1 across package.json, source code, receipts, and docs.
- Updated README tech stack to reflect Next.js 16 (was incorrectly listed as Next.js 15).
- Updated all stale version references and documentation drift.
- Improved PWA security headers and permissions policy.

### Documentation

- `docs/RELEASE_CHECKLIST.md` — comprehensive release process checklist.
- `docs/STORE_METADATA.md` — app store metadata, keywords, age ratings.
- `docs/PRIVACY.md` — privacy policy covering local-first architecture.
- `docs/TERMS.md` — terms of service.

### Infrastructure

- Generated all required icon sizes from canonical source.
- PWA manifest with proper display mode, theme color, and icon references.
- Documented crash reporting, analytics, versioning, and update strategies per platform.

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
