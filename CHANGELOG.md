# Changelog

All notable changes to OpenProof are documented here.

## 0.1.4 - 2026-06-22

### Added

- Architecture diagram on `/about` showing the two-layer system (browser ↔ blockchain).
- How proof works: six-step numbered walkthrough from file selection to verification.
- Threat model section on `/about`: must-trust, no-trust, and known-risks breakdowns.
- What OpenProof can / cannot prove: structured checkmark and cross lists.
- Registry transparency table: contract address, network, chain ID, explorer, source code, license.
- Block number displayed on proof explorer pages.
- Proof explorer now shows all 6 onchain fields (fingerprint, timestamp, transaction, wallet, block, network) without needing a receipt.

### Changed

- About page fully restructured with editorial sections, matching Block/Cash App design.
- Proof explorer data rows redesigned with clear labels and action buttons.
- Onchain proof type extended to include `blockNumber` from event-log metadata.
- Version bumped to 0.1.4 in package.json, footer, and documentation.

## 0.1.2 - 2026-06-22

### Added

- Light/dark theme toggle with system preference detection and persistence.
- Native `/about` page with brand story, mission, and philosophy.
- Native `/privacy` page with human-readable data practices.
- Native `/terms` page with terms of service.
- Premium light mode design with white background and black typography.

### Changed

- Navigation updated: About link added, theme toggle in top-right corner.
- Footer updated: native page links instead of GitHub redirects.
- All icons regenerated from canonical source.
- Accessibility: keyboard navigation, focus states, WCAG AA contrast.

### Fixed

- Footer and navigation now link to native pages for legal documents.
- Mobile layout: spacing, typography scale, touch targets.

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
