# Changelog

All notable changes to OpenProof are documented here.

## 0.8.0 — Release Hardening

### Infrastructure
- Error boundary component (`ErrorBoundary`) wraps the app with graceful reload prompt
- Offline detection (`OfflineNotice`, `useOnlineStatus`) shows banner when disconnected
- Environment separation guide (`docs/environment.md`)
- Store readiness checklist (`docs/STORE_READINESS.md`)
- Production build config: `reactStrictMode`, `poweredByHeader: false`, optimized package imports

### Security
- Refined CSP: added `Cross-Origin-Opener-Policy`, `Cross-Origin-Resource-Policy`, `X-DNS-Prefetch-Control`
- Dependency audit maintained with documented exemptions
- Supply-chain review completed

### Documentation
- Upgrade guide (`docs/UPGRADE_GUIDE.md`) — v0.2.0 → v0.8.0
- Release notes (`docs/RELEASE_NOTES.md`) — v0.8.0
- Environment variable reference (`docs/environment.md`)
- Store readiness checklist (`docs/STORE_READINESS.md`)
- Deployment notes updated with env separation table

### Legal & Branding
- Copyright notice in footer with contact email
- Support email: sparshsam@gmail.com (footer)
- License verification (AGPL-3.0, in footer and LICENSE)
- Privacy policy (`/privacy`) and Terms (`/terms`) reviewed
- App icons verified as present (existing)
- Splash screens verified as present (existing)
- OG image verified as present (existing)

### CI/CD
- Release build job: runs on main merges, verifies build output
- Bundle size tracking in CI
- Build output verification step

### Changed
- App version bumped to 0.8.0
- Footer updated with copyright, support email, v0.8.0
- `next.config.mts` — production optimizations (`removeConsole`, `optimizePackageImports`)
- `vercel.json` — additional security headers
- `ci.yml` — release build job added

## 0.2.0 - 2026-06-25

### Added — v0.2.0 Cryptographic Foundation

#### Receipt Schema v3
- Forward-compatible `metadata` field (arbitrary key-value store, consumers must ignore unknown keys)
- `registryVersion` field linking receipts to deploying contract version
- Optional chain context fields: `chainExplorerUrl`, `chainCurrency`
- `migrateReceipt()` helper to upgrade v1/v2 receipts to v3
- `isSchemaVersionSupported()` and `receiptVersionLabel()` helpers
- Registry version validation in contract verifier

#### Registry Abstraction Layer
- Chain configuration registry (`src/lib/chains.ts`) with multi-EVM chain support
- Base Mainnet pre-configured but inactive — ready for deployment
- Chain-aware proof URLs with `?chain=<symbol>` query parameter
- Chain-aware explorer URLs (`transactionExplorerUrl`, `addressExplorerUrl` accept optional chainId)
- Updated contracts module to use chain registry

#### Better Transaction State Handling
- Improved error recovery with detailed wallet error detection (user rejection, insufficient funds, chain mismatch, nonce issues)
- New `wallet.ts` module with `useWalletState()` hook and `getWalletHint()` helper
- Better wallet disconnect/reconnect handling

#### Contract Improvements
- `registryVersion` constant (v2) added to OpenProofRegistry
- New `registryVersion()` getter for v3 receipt compatibility
- Contract test: reports registry version

### Added — v0.3.0 Bundle Proofs (Merkle Trees)

#### Merkle Tree Implementation
- Full binary Merkle tree library (`src/lib/merkle.ts`) using SHA-256
- `buildMerkleTree()` — builds tree from leaf hashes with zero-padding
- `generateMerkleProof()` and `verifyMerkleProof()` — inclusion proofs
- Bundle module rewritten: bundle hash = Merkle root
- New `bundleRuleVersion: 2` with `rule: "merkle-sort-by-name-size-type-hash"`
- `generateBundleProof()` and `verifyBundleInclusion()` helpers

#### Bundle Explorer
- New `/bundle/[hash]` route with full bundle proof page
- Displays onchain proof data, Merkle root, bundle file listing
- Per-file "Verify inclusion" button with Merkle proof verification
- Bundle manifest stored in localStorage, linked from standard proof page

#### Bundle Storage
- `bundle-storage.ts` — localStorage-based manifest storage, retrieval, and pruning
- Bundle download as standalone JSON
- Max 20 stored manifests with LRU pruning

### Added — v0.4.0 Professional Evidence Workflows

#### Timestamp & Timezone
- Full timezone support: `formatTimestampInTimezone()`, `formatShortDate()`, `formatUnixTimestamp()`
- `getUserTimezone()`, `getUtcOffset()` helpers
- Citation-format timestamp: `formatTimestampCitation()`

#### Citation Formats
- APA 7th Edition, MLA 9th Edition, Legal/Evidence, and Plain text formats
- `generateCitation()` and `getAllCitations()` helpers

#### Human-Readable Receipt View
- New `HumanReadableReceipt` component with print-friendly layout
- Print/PDF support with CSS `@media print` styles
- Citation display with copy buttons
- File summary, cryptographic details, onchain registry info, bundle listing

#### QR Improvements
- High-resolution QR generation (800px, Q error correction)
- Standard and high-res download options
- Optional label prop

### Added — v0.5.0 Verification Engine

- Full receipt verification pipeline (`src/lib/verify.ts`)
- 11+ checks: schema validation, version compatibility, hash algorithm, chain match, chain support, contract match, hash format, timestamp, bundle consistency, onchain existence, creator wallet match, transaction hash, registry version compatibility
- Returns `VerificationReport` with individual check results and overall status
- Used by UI for detailed verification breakdown

### Added — v0.6.0 Long-Term Preservation

#### Archive Package Export
- `buildArchivePackage()` — bundles receipt + citations + metadata into transferable archive
- `downloadArchivePackage()` — download as JSON evidence package

#### Hash Algorithm Abstraction
- `HashAlgorithmConfig` and `SUPPORTED_HASH_ALGORITHMS` registry
- Prepared for future SHA-384, BLAKE3 migration
- `isHashAlgorithmSupported()` and `getHashAlgorithmConfig()`

#### Compatibility Checks
- `checkReceiptCompatibility()` — long-term compatibility diagnostics
- Schema version, hash algorithm, registry version, bundle rule, chain ID checks

### Added — v0.7.0 Explorer Improvements

- Bundle awareness: standard proof pages detect stored bundle manifests and show "View bundle details" link
- Canonical URL metadata on proof pages
- Chain-aware explorer URLs throughout
- QoL: FileBox icon on bundle link, improved layout spacing

### Documentation
- `docs/receipt-schema.md` updated to schema v3 (full schema, field reference, migration guide)
- Backward compatibility section updated for v3 migration

### Changed
- Schema version bumped from 2 to 3
- Receipt version bumped from 2 to 3
- Bundle rule version bumped from 1 to 2 (Merkle tree migration)
- Contract version bumped from 1 to 2 (registryVersion getter)
- App version bumped from 0.1.4 to 0.2.0
- Bundle hash now uses Merkle root instead of plain manifest hash
- Explorer URLs support chain-aware lookups
- Error normalization detects wallet rejection, insufficient funds, chain mismatch, nonce issues

### Infrastructure
- New routes: `/bundle/[hash]`
- Route `(app)` now shows 10 pages (2 dynamic, 8 static)

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
- Bumped app version to 0.1.4 across package.json, source code, receipts, and docs.
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
