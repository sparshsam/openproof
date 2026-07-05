# OpenProof Agent Source of Truth

Last updated: 2026-07-05
Update signed by: op-branding-agent

## 1. Project Identity

OpenProof is a privacy-first, open-source proof-of-existence app for files, built on Base Sepolia.
Deployed at **https://proof.kovina.org** (also answers at openproof.vercel.app).

Core phrase:

> Proof without surrender.

OpenProof helps users prove that a file fingerprint existed at a given time without uploading, storing, exposing, or surrendering the underlying file.

The app hashes files locally in the browser with SHA-256 and registers only the resulting `bytes32` fingerprint onchain through a minimal Solidity registry. Receipts are generated locally. Recent proof history is stored only in the browser. Public proof pages read public registry state and never contain the original file.

OpenProof must remain small, intelligible, auditable, and local-first.

## 2. Philosophy

OpenProof exists to make verification portable without turning private files into platform inventory.

Principles:

- Local-first by default.
- Hashes, not files.
- Receipts, not accounts.
- Verification, not surveillance.
- Public infrastructure, minimal exposure.
- Base as settlement infrastructure, not speculation.
- No legal, ownership, authorship, copyright, truth, or compliance overclaims.
- No hidden automation.
- No mandatory backend.
- No product bloat before real users.

OpenProof proves narrow claims well. It should never imply broader claims it cannot support.

## 3. Current State (v1.0.0)

OpenProof currently supports:

- Local SHA-256 hashing in the browser (Web Crypto API).
- Single-file proof registration on Base Sepolia.
- Bundle proof hashing through deterministic Merkle tree manifests.
- Onchain proof lookup through the OpenProof registry.
- JSON proof receipt generation (schema v3), automated download, and local download.
- Receipt import and validation against onchain state.
- Local proof history using browser storage only.
- Public proof pages at `/proof/[hash]`.
- Bundle proof pages at `/bundle/[hash]`.
- Human-readable receipt view with print/PDF support and citation formats.
- Full receipt verification pipeline (11+ checks: schema, chain, contract, onchain, registry version, bundle consistency).
- Merkle tree bundle proofs with individual inclusion proof verification.
- OpenProofRegistry contract v2 with `registryVersion` getter.
- Chain abstraction layer (Base Sepolia active, Base Mainnet prepared).
- Multi-platform icon set from canonical PNG master (light + dark variants).
- Dark/light themed header icon with `[data-theme="dark"]` CSS rules and 0.3s transition.
- Error boundary with graceful reload prompt.
- Offline detection with banner notification.
- Service worker v1.0.0 with PWA app routes pre-cached and update flow.
- Capacitor configuration for Android native packaging.
- MSIX packaging manifest for Windows Store.
- Release validation checklist (regression, cross-browser, mobile, accessibility, Lighthouse 100).
- Store readiness checklist for all platforms.
- Theme toggle (light/dark, localStorage persistence).
- Native pages: `/about`, `/privacy`, `/terms`.
- PWA: installable with service worker, manifest, splash screens, shortcut.
- PWA install prompt with branded UI and localStorage dismissal memory (7-day cooldown).
- PWA shell (PwaShell) for installed mode with desktop header navigation (Create, Verify, History, More).
- PWA landing page with two huge entry cards (Create / Verify) on desktop; direct create form on mobile.
- PWA bottom tab navigation (mobile) and desktop header nav — four tabs: Create, Verify, History, More.
- PWA desktop nav links: Create → `/create`, Verify → `/app/verify`, History → `/app/history`, More → `/app/more`.
- `WalletProvider` at root layout level (app-wide wagmi context, no WagmiProviderNotFoundError).
- Route progress bar (`RouteProgress`) on client-side navigation.
- AppSplash with clean gradient sweep (600ms, no three-dot timer).
- Loading skeleton (`loading.tsx`) for PWA route transitions.
- Hydration-safe shell selection (`ConditionalShell` with hydrated guard).
- Theme initialization at module level (no `next/script`, avoids React 19 script tag errors).
- Kovina wordmark footer in PWA (desktop, centered).
- Shared `CreateProofForm` / `VerifyProofForm` components used by both `/app` (PWA) and standalone pages.
- Website copy across homepage (6 sections: Who uses, How it works, When to timestamp, What a proof means, Registry, Privacy by design), About page (Who uses, When to use), Create/Verify pages.
- SEO metadata with proof-of-existence, file fingerprinting, blockchain timestamping keywords.
- Hydration-safe theme toggle via suppressHydrationWarning on <html>.
- Offline detection via useSyncExternalStore (no flash-of-offline-notice).
- CSP headers allowing WalletConnect pulse + Web3Modal API endpoints.
- Cross-Origin-Opener-Policy set to same-origin-allow-popups (Base Account SDK compat).
- AGPL-3.0-only licensed.

The current registry contract (v2) provides:
- `registerProof(bytes32 fileHash)`
- `getProof(bytes32 fileHash)`
- `proofExists(bytes32 fileHash)`
- `registryVersion()` (new in v2)
- duplicate hash prevention
- empty hash rejection
- `ProofRegistered` event emission

The app has no backend, no database, no file upload pipeline, no storage bucket, no account system, no token, no marketplace, no analytics, and no tracking.

## 4. Design & Brand

- **Domain:** proof.kovina.org (parent site kovina.org)
- **Accent color:** `#0081CC`
- **Design:** Black canvas, pill buttons, Block/Cash App-inspired editorial layout
- **Logo:** Shield with checkmark in `#0081CC` on white/transparent background
- **Canonical icon source:** `public/icon-source.png` (1024x1024 PNG master; dark variant from dark master)
- **Icon generation:** 210 assets generated from light + dark PNG masters via Lanczos resampling — Windows ICO, MSIX, Android, iOS, macOS, Web/PWA, social OG, GitHub, header
- **Dark mode assets:** 114 dark assets including `icon-dark-192.png`, `icon-dark-512.png`, `icon-header-dark.png`
- **Themed header icon:** dual-image wrap with `[data-theme="dark"]` CSS rules and 0.3s transition
- **Favicon regenerated** from new master (favicon.ico, favicon-16.png, favicon-32.png)

### Branding Architecture

OpenProof belongs to the **Kovina ecosystem** under the **Open Product Family**:

```
Kovina
└── Open Product Family
    ├── OpenPalette (canonical design reference)
    ├── OpenSend
    ├── OpenProof
    ├── OpenReader
    └── [future open apps]
```

- **OPEN** is the family identifier and **never has an icon**. Only the individual product (Proof) has an icon.
- **Lockup:** `[app icon] OPEN / ProductName` — see `docs/BRANDING.md` for the header implementation.
- **OpenPalette** is the canonical reference for Open Product Family branding.
- The header lockup pattern is specified in `docs/BRANDING.md` and must be preserved across modifications.

## 5. v1.0 Freeze Wall

OpenProof v1.0 is now governed by this wall:

> OpenProof v1.0 — Private Proof Core

The v1.0 goal is not feature expansion. The v1.0 goal is to make the existing proof loop coherent, trustworthy, polished, secure, understandable, standards-oriented, and ready for future ecosystem use.

This wall is concrete. Until real users validate the current product loop, future agents must not add major new product systems.

The v1.0 product loop is:

File or file set
→ Local SHA-256 hashing
→ User review
→ Onchain registration
→ Local receipt generation
→ Verification by file or receipt
→ Local history / public proof page
→ Portable proof reference

## 6. Included in v1.0

OpenProof v1.0 includes:
- Local file hashing.
- Onchain proof registration.
- Receipt generation.
- Receipt import.
- Proof verification.
- Bundle proofs (Merkle tree).
- Public proof pages.
- Bundle proof pages.
- Local proof history.
- Threat model clarity.
- Security posture clarity.
- Strong receipt format (v3).
- Portable verification language.
- Polished proof creation UX.
- Polished proof verification UX.
- Clear disclaimers about what hashes prove and do not prove.
- Human-readable receipt with print/PDF and citations.
- Verification engine with detailed reports.
- Accessibility and mobile polish.
- Self-hosting clarity.
- Contract test strengthening.
- Documentation alignment.
- Error boundary and offline handling.
- Multi-platform readiness (PWA, Windows MSIX, Android Capacitor).

## 7. Explicitly Not v1

The following are not part of OpenProof v1.0:
- File hosting.
- User accounts.
- Cloud storage.
- IPFS pinning by default.
- Token, rewards, staking, or DeFi features.
- NFT marketplace features.
- Paid plans.
- Legal claim automation.
- AI file analysis.
- Mandatory indexing backend.
- Elora integration.
- Cross-app sync.
- Base mainnet deployment unless testnet UX and contract assumptions are stable.
- Smart-wallet batching unless there is a clear usability or security reason.
- Hidden analytics.
- Any architecture that makes OpenProof a backend-heavy SaaS product.

## 8. Allowed Work During Freeze

- UX polish.
- Receipt format strengthening.
- Verification state clarity.
- Bundle proof clarity.
- Documentation improvement.
- Threat-model improvement.
- Security hardening.
- Accessibility improvements.
- Mobile polish.
- Performance improvements.
- Self-hosting clarity.
- Local-first reliability.
- Proof-page polish.
- Test coverage.
- Contract test strengthening.
- Dependency hygiene.
- Error-state clarity.
- Copy refinement that reduces legal or technical ambiguity.
- Manual platform packaging tasks (MSIX, Capacitor, PWA).
- Store submission tasks.

## 9. Forbidden Work Before Real Users

- New backend systems.
- Accounts.
- Storage systems.
- Tokenization.
- Marketplace features.
- Legal overclaiming.
- Hidden analytics or tracking.
- Forced mainnet migration.
- Speculative ecosystem integrations.
- Elora integration.
- Cross-app sync.
- Unnecessary architecture expansion.
- Features that make the app harder to self-host or audit.

## 10. App Surface Map

Primary app routes:
- `/` — landing and education surface.
- `/create` — single-column transaction terminal flow: file select → hash → connect → register → receipt auto-download.
- `/verify` — scanner-style single column: file select → hash → verify → result as hero.
- `/proof/[hash]` — public proof page. Bundle aware (shows link if bundle manifest stored).
- `/bundle/[hash]` — bundle proof page with file listing and inclusion verification.
- `/about` — brand story, mission, philosophy, details strip.
- `/privacy` — native privacy policy.
- `/terms` — native terms of service.
- `/docs` — documentation index.

## 11. File Map by Layer

Contracts:
- `contracts/OpenProofRegistry.sol` — minimal proof registry (v2).
- `test/OpenProofRegistry.js` — Hardhat contract tests.
- `scripts/deploy.js` — deployment scripts.
- `hardhat.config.js` — compiler and network configuration.

Application routes:
- `src/app/page.tsx` — landing page.
- `src/app/create/page.tsx` — transaction terminal.
- `src/app/verify/page.tsx` — scanner-style verification.
- `src/app/proof/[hash]/page.tsx` — proof page server component.
- `src/app/proof/[hash]/proof-explorer-client.tsx` — proof page client logic.
- `src/app/bundle/[hash]/page.tsx` — bundle proof page.
- `src/app/bundle/[hash]/bundle-explorer-client.tsx` — bundle page client logic.
- `src/app/about/page.tsx` — brand story, mission, threat model.
- `src/app/privacy/page.tsx` — privacy policy.
- `src/app/terms/page.tsx` — terms of service.
- `src/app/docs/page.tsx` — documentation index.

Components:
- `src/components/app-shell.tsx` — global layout (header, nav, footer, skip link, theme toggle, copyright).
- `src/components/error-boundary.tsx` — global React error boundary.
- `src/components/offline-notice.tsx` — offline banner.
- `src/components/design-system.tsx` — shared primitives (ActionPill, PillLink, ExplorerLink, Label, Section).
- `src/components/file-drop.tsx` — premium dropzone.
- `src/components/hash-display.tsx` — hash display with copy surface.
- `src/components/proof-history.tsx` — local proof history.
- `src/components/proof-timeline.tsx` — proof lifecycle display.
- `src/components/qr-code.tsx` — QR proof URL display and download.
- `src/components/receipt-import.tsx` — receipt import and validation UI.
- `src/components/human-readable-receipt.tsx` — print-friendly receipt with citations.
- `src/components/copy-button.tsx` — accessible copy-to-clipboard pill button.
- `src/components/helper-tooltip.tsx` — accessible tooltip.
- `src/components/base-notice.tsx` — Base Sepolia testnet info banner.
- `src/components/providers/wallet-provider.tsx` — RainbowKit and wagmi provider isolation.
- `src/components/providers/theme-provider.tsx` — ThemeProvider + ThemeToggle.

Libraries:
- `src/lib/hash.ts` — local hashing, byte formatting.
- `src/lib/bundle.ts` — Merkle tree bundle manifests.
- `src/lib/merkle.ts` — binary Merkle tree with inclusion proofs.
- `src/lib/receipt.ts` — receipt type, builder, validator, migration helpers (schema v3).
- `src/lib/history.ts` — browser-local history.
- `src/lib/chains.ts` — chain configuration registry (Base Sepolia active, Base Mainnet prepared).
- `src/lib/contracts.ts` — ABI, chain, and contract configuration.
- `src/lib/proofs.ts` — typed registry reads and event lookup.
- `src/lib/proof-url.ts` — chain-aware shareable proof URL helpers.
- `src/lib/explorer.ts` — chain-aware explorer URL helpers.
- `src/lib/errors.ts` — user-facing error normalization with wallet error detection.
- `src/lib/time.ts` — timestamp formatting with timezone support.
- `src/lib/citations.ts` — citation format generation (APA, MLA, Legal, Plain).
- `src/lib/verify.ts` — full receipt verification pipeline.
- `src/lib/archive.ts` — archive export, hash algorithm abstraction, compatibility checks.
- `src/lib/wallet.ts` — wallet state hook and helpers.
- `src/lib/offline.ts` — online status detection.
- `src/lib/bundle-storage.ts` — bundle manifest localStorage management.

Documentation:
- `README.md` — public project overview.
- `docs/ARCHITECTURE.md` — technical architecture.
- `docs/ARCHITECTURAL_INVARIANTS.md` — permanent invariant register.
- `docs/BRANDING.md` — Open Product Family branding, lockup, hierarchy, OpenPalette reference.
- `docs/threat-model.md` — security and privacy boundaries.
- `docs/receipt-schema.md` — receipt format documentation (v3).
- `docs/deployment-notes.md` — operator wallet and deployment notes.
- `docs/environment.md` — environment variable reference.
- `docs/DESIGN_PLAYBOOK.md` — reusable UI/UX design playbook.
- `docs/RELEASE_CHECKLIST.md` — comprehensive release validation.
- `docs/RELEASE_NOTES.md` — v0.8.0 release notes.
- `docs/UPGRADE_GUIDE.md` — v0.2.0 → v0.8.0 upgrade guide.
- `docs/STORE_READINESS.md` — store publishing checklists.
- `docs/STORE_METADATA.md` — app store metadata, keywords, age ratings.
- `docs/PRIVACY.md` — privacy policy.
- `docs/TERMS.md` — terms of service.
- `docs/PLATFORM_READINESS.md` — PWA, MSIX, DMG, iOS, Android readiness.
- `docs/SECURITY.md` — vulnerability reporting.
- `docs/CONTRIBUTING.md` — contribution rules.
- `CHANGELOG.md` — version history.
- `ROADMAP.md` — completed roadmap.
- `CLAUDE.md` — this file.

PWA and assets:
- `public/manifest.json` — PWA web manifest.
- `public/sw.js` — service worker (v1.0.0, cache-first + network-first).
- `public/icon-source.png` — canonical icon master (1024x1024, light).
- `public/icon.svg` — vector icon source.
- `public/icon.png` — generated single-size PNG.
- `public/icon-192.png` — PWA icon (from master).
- `public/icon-512.png` — PWA icon (from master).
- `public/icon-dark-192.png` — dark mode PWA icon (from dark master).
- `public/icon-dark-512.png` — dark mode PWA icon (from dark master).
- `public/icon-header.png` — header icon, light variant.
- `public/icon-header-dark.png` — header icon, dark variant.
- `public/apple-touch-icon.png` — iOS icon (from master).
- `public/favicon.ico` — multi-res favicon (from master).
- `public/favicon-16.png` — 16px favicon.
- `public/favicon-32.png` — 32px favicon.
- `public/favicon.png` — fallback favicon (from master).
- `public/og.png` — social preview image (from master).
- `public/robots.txt`, `public/sitemap.xml` — SEO.
- `public/splash/` — iOS and web splash screens.
- `public/screenshots/` — PWA store screenshots.
- `assets/branding/` — brand source files (icon.svg, og.png).
- `assets/gallery/` — gallery screenshots (home, create, verify, proof on desktop + mobile).
- `assets/hero/` — hero image.
- `assets/icon.iconset/` — macOS icon set (10 sizes, 16x16 to 512x512@2x).
- `assets/ios-icons/` — iOS icon set (8 sizes, 40x40 to 1024x1024).
- `assets/android/` — Android icon set (mipmap densities + Play Store).
- `assets/windows/` — Windows icon set (ICO, MSIX manifest, store logos, splash screens).
- `capacitor.config.json` — Capacitor native app config.

## 12. Security and Threat-Model Notes

OpenProof can support these claims:
- A wallet registered a specific SHA-256 hash on the configured chain.
- The registry recorded a timestamp for that registration.
- A later file can be hashed locally and compared against the registered hash.

OpenProof cannot support these claims by itself:
- Authorship.
- Ownership.
- Copyright.
- Lawful possession.
- Legal validity.
- Truth of file contents.
- File recovery.
- Privacy against known-file or low-entropy hash guessing.

## 13. Agent Coordination Rules

1. Read `CLAUDE.md` before making changes.
2. Treat `CLAUDE.md` as the primary source of truth for product boundaries.
3. Inspect the repository directly before planning work.
4. Keep changes inside the v1.0 freeze wall unless explicitly approved by Sparsh.
5. Update `CLAUDE.md` after meaningful product, architecture, security, or documentation changes.
6. Sign `CLAUDE.md` updates with your assigned agent name and date.
7. Avoid broad refactors mixed with product changes.
8. Avoid legal, authorship, ownership, copyright, or compliance overclaims.
9. Preserve zero-backend, no-upload, local-first architecture unless explicitly approved.
10. Never commit secrets.
11. Check `manualtasksforsparsh.md` before planning platform packaging or store submission work.
12. No scope expansion without explicit approval.

## 14. Validation Rules

Before pushing meaningful changes, run:
```bash
npm run lint
npm run typecheck
npm run build
npm run test:contracts
```

## 15. Secret Handling

Never commit: `.env`, `.env.local`, private keys, RPC secrets, WalletConnect/Reown secrets, deployment credentials, Vercel secrets, seed phrases, wallet JSON files.

|## 16. Privacy & Legal Standard
|
|OpenProof follows the Kovina Privacy & Terms Standard for all legal/legal-facing pages.
|
|- **Privacy policy** (`/privacy`): 9 sections — Commitment, Local-First Data Model, No Cloud/Sync/Backup, What We Collect (nothing), Third-Party Services, Data Deletion, Data Export, Changes, Contact.
|- **Terms of service** (`/terms`): 9 sections — Acceptance, License (AGPL-3.0), No Legal Advice, No Warranty, Data Responsibility, Service Availability, User Conduct, Changes, Contact.
|- Both pages must be updated together when the Kovina standard is revised.
|- Legal disclaimers: OpenProof is a tool for timestamping file fingerprints. It does not provide legal advice. Proofs on testnet (Base Sepolia) have no guarantee of permanence. Only SHA-256 hashes are registered, never file content.
|- License: AGPL-3.0-only (https://github.com/sparshsam/openproof/blob/main/LICENSE).
|
|## 17. Session History

### 2026-07-05 — v1.0.0

**Stable Release**
- Version finalized to v1.0.0
- GitHub release created — proof.kovina.org deployed
- All docs updated for stable release
- CI verified — build, tests, lint all passing

### 2026-07-05 — v0.9.6

**Zero Warnings**
- Lint: 0 errors, 0 warnings (`@next/next/no-img-element` globally suppressed)
- TypeScript: 0 errors
- Build: 0 warnings, 16/16 static pages
- Tests: 5/5 passing

**Release Freeze**
- All eslint-disable comments cleaned up
- eslint config refined for static export
- Service worker v0.9.6
- Final lockfile audit
- Version bumped to 0.9.6

### 2026-07-05 — v0.9.5

**Accessibility**
- Skip-to-content link added to PwaShell.
- RouteProgress respects `prefers-reduced-motion` (static pulse when enabled).

**PWA Hardening**
- Service worker updated to v0.9.5 with PWA app routes pre-cached.
- SW `STATIC_ASSETS` includes `/app`, `/app/verify`, `/app/history`, `/app/more`.

**Codebase Cleanup**
- Removed unused `hasBundleManifest` import from bundle explorer.
- Removed dead `public/scripts/` (theme-init.js, sw-register.js).
- Safe dependency updates applied.

**Documentation & Release**
- CHANGELOG updated with v0.9.4 and v0.9.5 entries.
- README version journey updated.
- Package version bumped to 0.9.5.

### 2026-07-05 — v0.9.4

**PWA Shell & Desktop Support**
- Desktop PWA now uses PwaShell (no marketing footer) via `display-mode` detection.
- Desktop header navigation added: Create (`/create`), Verify (`/app/verify`), History (`/app/history`), More (`/app/more`).
- OPEN/Proof stacked branding lockup in PwaShell header.
- Kovina wordmark footer in PWA (desktop, centered, SVG `text-anchor` fix).

**Tab Restructure**
- `/app` page: desktop landing with two huge entry cards (Create / Verify); mobile keeps direct create form.
- `/app/verify`: full verify flow (file → hash → check onchain) + receipt import section.
- `/app/history`: expanded with bundle proofs CTA + Base Sepolia testnet notice.
- `/app/more`: About, Documentation, Privacy Policy, Terms of Service, GitHub with descriptions.
- Shared `CreateProofForm` and `VerifyProofForm` components extracted.

**Loading & Hydration**
- `RouteProgress` bar on every client-side navigation.
- `AppSplash` replaced with clean gradient sweep (600ms).
- `loading.tsx` skeleton for PWA route transitions.
- Hydration guard in `ConditionalShell` prevents SSR mismatch for PWA.

**Bug Fixes**
- `WalletProvider` moved to root layout (fixes `WagmiProviderNotFoundError` in PWA mode).
- Theme initialization moved to module level (eliminates React 19 `<script>` tag warnings).
- No `next/script` usage anywhere (avoids React 19 incompatibility).
- `usePwaMode` state initializer now checks `display-mode` synchronously (no flash).
- PwaShell `pb-24` made unconditional (fixes hydration mismatch on mobile).

**Kovina Wordmark SVG**
- Light and dark SVGs updated: `text-anchor="middle" x="156"` for proper centering.

### 2026-07-03 — v0.9.1

**Branding**
- Header lockup: `[shield icon] OPEN / Proof` stacked
- `docs/BRANDING.md` created
- OpenPalette canonical spec alignment

**Icons**
- 210 assets generated from light + dark masters (1024x1024) via Lanczos (Windows ICO, MSIX, Android, iOS, macOS, Web/PWA, Social OG, GitHub, Header)
- 114 dark mode assets
- Favicon: replaced old favicon.png/icon-192x192.png with new generated assets
- Header icon switched from icon.svg to icon-header.png for reliable rendering

**Dark/Light Theme**
- Dual-image wrap with `[data-theme="dark"]` CSS rules and 0.3s transition
