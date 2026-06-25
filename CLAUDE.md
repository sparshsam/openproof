# OpenProof Agent Source of Truth

Last updated: 2026-06-25
Update signed by: v0.9.0-release-hardening-agent

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

## 3. Current State (v0.9.0)

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
- Multi-platform icon set from canonical SVG.
- Error boundary with graceful reload prompt.
- Offline detection with banner notification.
- Service worker v0.9.0 with cache migration and update flow.
- Capacitor configuration for Android native packaging.
- MSIX packaging manifest for Windows Store.
- Release validation checklist (regression, cross-browser, mobile, accessibility, Lighthouse 100).
- Store readiness checklist for all platforms.
- Theme toggle (light/dark, localStorage persistence).
- Native pages: `/about`, `/privacy`, `/terms`.
- PWA: installable with service worker, manifest, splash screens, shortcut.
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
- **Canonical icon source:** `public/icon.svg`
- **All icon variants regenerated from SVG** (PWA, Apple, iOS, Android, Windows, macOS)

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
- `public/sw.js` — service worker (v0.9.0, cache-first + network-first).
- `public/icon.svg` — canonical icon source (your SVG design).
- `public/icon-192x192.png` — PWA icon (from SVG).
- `public/icon-512x512.png` — PWA icon (from SVG).
- `public/apple-touch-icon.png` — iOS icon (from SVG).
- `public/favicon.ico` — multi-res favicon (from SVG).
- `public/favicon.png` — favicon (from SVG).
- `public/og.png` — social preview image (from your PNG source).
- `public/robots.txt`, `public/sitemap.xml` — SEO.
- `public/splash/` — iOS and web splash screens.
- `public/screenshots/` — PWA store screenshots.
- `assets/` — multi-platform icon sets for Android, iOS, macOS, Windows.
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
