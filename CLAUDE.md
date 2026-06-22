# OpenProof Agent Source of Truth

Last updated: 2026-06-21
Update signed by: v0.1.1-release-agent

## 1. Project Identity

OpenProof is a privacy-first, open-source proof-of-existence app for files, built on Base Sepolia.

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

## 3. Current State

OpenProof currently supports:

- Local SHA-256 hashing in the browser.
- Single-file proof registration on Base Sepolia.
- Bundle proof hashing through deterministic local manifests.
- Onchain proof lookup through the OpenProof registry.
- JSON proof receipt generation and local download.
- Receipt import and validation against onchain state.
- Local proof history using browser storage only.
- Public proof pages at `/proof/[hash]`.
- QR verification URLs.
- Base Sepolia contract integration.
- Testnet-first deployment posture.
- AGPL-3.0-only open-source licensing.

The current registry contract is intentionally minimal:

- `registerProof(bytes32 fileHash)`
- `getProof(bytes32 fileHash)`
- `proofExists(bytes32 fileHash)`
- duplicate hash prevention
- empty hash rejection
- `ProofRegistered` event emission

The app currently has no backend, no database, no file upload pipeline, no storage bucket, no account system, no token, no marketplace, and no analytics mandate.

## 4. v1.0 Freeze Wall

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

## 5. Included in v1.0

OpenProof v1.0 includes:

- Local file hashing.
- Onchain proof registration.
- Receipt generation.
- Receipt import.
- Proof verification.
- Bundle proofs.
- Public proof pages.
- Local proof history.
- Threat model clarity.
- Security posture clarity.
- Strong receipt format.
- Portable verification language.
- Polished proof creation UX.
- Polished proof verification UX.
- Clear disclaimers about what hashes prove and do not prove.
- Accessibility and mobile polish.
- Self-hosting clarity.
- Contract test strengthening.
- Documentation alignment.

## 6. Explicitly Not v1

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

## 7. Allowed Work During Freeze

Allowed work:

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

## 8. Forbidden Work Before Real Users

Forbidden work without explicit human approval:

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

## 9. App Surface Map

Primary app routes:

- `/` — landing and education surface.
- `/create` — local file or bundle hashing, wallet connection, proof registration, receipt generation.
- `/verify` — local file hashing, receipt import, registry verification, verification states.
- `/proof/[hash]` — public read-only proof page for a registered or queried hash.

Supporting public/static surfaces:

- `public/screenshots/` — documentation and social preview screenshots.
- `public/robots.txt` and sitemap metadata where present.

## 10. File Map by Layer

Contracts:

- `contracts/OpenProofRegistry.sol` — minimal proof registry.
- `test/` — Hardhat contract tests.
- `scripts/` — deployment scripts.
- `hardhat.config.*` — compiler and network configuration.

Application routes:

- `src/app/page.tsx` — public landing page.
- `src/app/create/page.tsx` — create proof flow.
- `src/app/verify/page.tsx` — verify proof and receipt flow.
- `src/app/proof/[hash]/page.tsx` — proof page wrapper.
- `src/app/proof/[hash]/proof-explorer-client.tsx` — proof page client logic.

Components:

- `src/components/app-shell.tsx` — global layout with header, nav, footer, and skip link.
- `src/components/base-notice.tsx` — Base Sepolia testnet info banner.
- `src/components/copy-button.tsx` — accessible copy-to-clipboard button with dark variant.
- `src/components/design-system.tsx` — shared UI primitives (Badge, Card, Section, ButtonLink, etc.).
- `src/components/file-drop.tsx` — local file selection surface with drag-and-drop.
- `src/components/hash-display.tsx` — hash display with copy surface.
- `src/components/helper-tooltip.tsx` — accessible tooltip with keyboard support.
- `src/components/proof-history.tsx` — local proof history UI.
- `src/components/proof-timeline.tsx` — proof lifecycle display.
- `src/components/qr-code.tsx` — QR proof URL display and download.
- `src/components/receipt-import.tsx` — receipt import and validation UI.
- `src/components/providers/wallet-provider.tsx` — RainbowKit and wagmi provider isolation.

Libraries:

- `src/lib/hash.*` — local hashing and byte formatting.
- `src/lib/bundle.*` — deterministic bundle manifest and bundle hashing.
- `src/lib/receipt.*` — receipt schema, receipt building, validation, and download.
- `src/lib/history.*` — browser-local history.
- `src/lib/contracts.*` — ABI, chain, and contract configuration.
- `src/lib/proofs.*` — typed registry reads and event lookup.
- `src/lib/proof-url.*` — shareable proof URL helpers.
- `src/lib/explorer.*` — explorer URL helpers.
- `src/lib/errors.*` — user-facing error normalization.
- `src/lib/time.*` — timestamp formatting.

Documentation:

- `README.md` — public project overview.
- `docs/architecture.md` — technical architecture.
- `docs/threat-model.md` — security and privacy boundaries.
- `docs/deployment-notes.md` — operator wallet and deployment configuration notes.
- `docs/repo-metadata.md` — GitHub description, website, and topic recommendations.
- `docs/RELEASE_CHECKLIST.md` — release process checklist.
- `docs/STORE_METADATA.md` — app store metadata, keywords, age ratings.
- `docs/PRIVACY.md` — privacy policy.
- `docs/TERMS.md` — terms of service.
- `docs/PLATFORM_READINESS.md` — PWA, MSIX, DMG, iOS, Android readiness.
- `SECURITY.md` — vulnerability reporting and security posture.
- `CONTRIBUTING.md` — contribution rules and validation.
- `CHANGELOG.md` — release/change history where maintained.
- `CLAUDE.md` — primary agent/project source of truth.

PWA and assets:

- `public/manifest.json` — PWA web manifest.
- `public/sw.js` — service worker with cache-first strategy.
- `public/icon-192x192.png`, `public/icon-512x512.png` — PWA icons.
- `public/apple-touch-icon.png` — iOS home screen icon.
- `public/favicon.ico`, `public/favicon.png` — favicons.
- `public/og.png` — Open Graph / social preview image.
- `public/splash/` — iOS and web splash screens.
- `assets/icon.iconset/` — macOS app icon set.
- `assets/ios-icons/` — iOS app icon set.
- `assets/windows/` — Windows ICO and Store assets.
- `assets/android/` — Android adaptive icons and Play Store icon.

## 11. Security and Threat-Model Notes

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

Security priorities during v1.0 freeze:

- Make receipt schema assumptions explicit and versioned.
- Make bundle hashing rules explicit and stable.
- Make chain ID and contract address visible before users rely on a proof.
- Keep file bytes local.
- Avoid accidental metadata leakage beyond user-controlled receipt fields.
- Warn users that receipts can reveal file names, file sizes, MIME types, hashes, wallet addresses, transaction hashes, timestamps, and verification URLs.
- Warn users that public proof URLs expose hashes and public onchain metadata.
- Keep deployment and wallet secrets out of git.
- Keep contract behavior minimal and test-covered.

Known risks to keep documented:

- Malicious frontend deployments can lie about what is being hashed or submitted.
- Public hashes can leak information for known, small, or guessable files.
- Browser local storage can be cleared, corrupted, or inspected by someone with device/browser access.
- Wallet prompts may confuse users about chain, contract, and transaction intent.
- RPC providers can rate-limit or fail.
- Testnet proofs are not production legal/compliance instruments.

## 12. Documentation Gaps Still Open

The repository has strong baseline documentation but the following gaps identified at freeze start remain open as of the v1.0 final review. Future agents should consider these priorities:

- **Receipt schema documentation** — a formal `docs/receipt-schema.md` with field descriptions, versioning expectations, and example JSON.
- **Bundle proof rule documentation** — a standalone explanation of deterministic ordering, stable-stringify, and future compatibility.
- **Frontend integrity guidance** — explicit instructions for users who need high assurance that the served frontend hashes correctly.
- **Release checklist** — a v1.0 release checklist covering build validation, docs review, security review, screenshots, and deploy.
- **Receipt sharing guidance** — more accessible language about what a receipt reveals to recipients.
- **Self-hosting notes** — a standalone `docs/self-hosting.md` for custom contract deployments, custom RPCs, and static hosting.
- **Testnet vs mainnet language** — ensure all references to Base mainnet are consistently marked as roadmap items, not promises.

These gaps do not block v1.0 freeze. They are documentation improvements to pursue after real user validation.

## 13. UX Surfaces Needing Polish

Prioritize clarity over novelty:

- Create proof preflight: file hash, chain, contract, wallet, and irreversible public hash warning.
- Registration lifecycle: waiting for wallet, submitted, confirming, confirmed, duplicate proof, failed transaction.
- Receipt generation: what is included, what is not included, what sharing reveals.
- Verify proof result states: exact match, no onchain proof, malformed receipt, unsupported chain, mismatched contract, RPC failure.
- Bundle proofs: explain that the bundle manifest is local and verification requires the same files and same deterministic rules.
- Public proof pages: make it unmistakable that they display hash metadata only, not the underlying file.
- Mobile: keep file selection, copy actions, QR display, and receipt import readable and tappable.
- Accessibility: maintain keyboard navigation, visible focus, reduced motion, semantic status messages, and useful labels.

## 14. Future Ecosystem Notes

OpenProof may eventually become the proof layer for a calm software ecosystem, including Elora and other quiet tools.

Possible future uses:

- Prove a policy snapshot existed at a given time.
- Prove a vault state export without exposing private contents.
- Prove a local activity ledger export.
- Prove an app release bundle.
- Prove a personal document, research artifact, creative work, or project archive.
- Provide portable receipts across tools.
- Allow future ecosystem apps to generate, import, and verify standardized proof receipts.

Rules for ecosystem readiness:

- Build standards before integrations.
- Keep receipt format portable.
- Keep proof semantics narrow.
- Do not add Elora-specific assumptions to OpenProof v1.0.
- Do not add cross-app sync.
- Do not add accounts.
- Do not add storage.
- Do not turn OpenProof into a platform silo.

OpenProof's future role is private proof and verification infrastructure. Elora's role is behavioral capital protection infrastructure. They may align philosophically without sharing runtime systems yet.

## 15. Agent Coordination Rules

Future agents must:

1. Read `CLAUDE.md` before making changes.
2. Treat `CLAUDE.md` as the primary source of truth for product boundaries.
3. Inspect the repository directly before planning work.
4. Keep changes inside the v1.0 freeze wall unless explicitly approved by Sparsh.
5. Update `CLAUDE.md` after meaningful product, architecture, security, or documentation changes.
6. Sign `CLAUDE.md` updates with their assigned agent/model name and date.
7. Avoid broad refactors mixed with product changes.
8. Avoid legal, authorship, ownership, copyright, or compliance overclaims.
9. Preserve zero-backend, no-upload, local-first architecture unless explicitly approved.
10. Never commit secrets.

No scope expansion without explicit approval.

## 16. Validation Rules

Before pushing meaningful changes, run:

```bash
npm run lint
npm run typecheck
npm run build
npm run test:contracts
```

If a command fails, document:

- command
- failure summary
- whether the failure appears related to the change
- recommended fix

For UI changes:

- include screenshots or describe tested responsive states.
- verify mobile and desktop layouts where practical.

For security-sensitive changes:

- update `docs/threat-model.md` or `SECURITY.md` if assumptions changed.
- update receipt, bundle, or contract documentation if proof semantics changed.

For contract changes:

- update tests.
- document deployment implications.
- do not silently change the registry address in documentation.

## 17. Secret Handling Rules

Never commit:

- `.env`
- `.env.local`
- private keys
- RPC secrets
- WalletConnect/Reown secrets
- deployment credentials
- database credentials
- Vercel secrets
- seed phrases
- wallet JSON files

Public client environment variables may be documented when they are intentionally public, but private deployment credentials must stay local or in the deployment provider's secret store.

## 18. Immediate v1.0 Refinement Backlog

Recommended next tasks:

1. Define and document a versioned OpenProof receipt schema. ✅ *Delivered in v0.1.0*
2. Strengthen receipt validation states for unsupported chain, mismatched contract, malformed receipt, and missing onchain proof.
3. Add or expand bundle determinism tests and documentation.
4. Add a v1.0 release checklist covering docs, validation, security review, and screenshots. ✅ *Delivered in v0.1.1 — see `docs/RELEASE_CHECKLIST.md`*
5. Polish proof creation and proof verification copy around what hashes prove and do not prove.

### Delivered in v0.1.1

- PWA support: manifest, service worker, app icons, splash screens.
- Cross-platform icon set for Web/PWA, Windows (MSIX/Icons), macOS (.iconset), iOS, Android (adaptive).
- Release documentation: `docs/RELEASE_CHECKLIST.md`, `docs/STORE_METADATA.md`, `docs/PRIVACY.md`, `docs/TERMS.md`.
- Platform readiness documentation: `docs/PLATFORM_READINESS.md` covering crash reporting, analytics, versioning, updates, permissions, data deletion, and accessibility.
- Version bump to 0.1.1 in all locations (package.json, receipts, footer).
- README tech stack corrected from Next.js 15 to Next.js 16.
- ROADMAP.md and AGENTS.md accuracy fixes (3 incorrectly marked `[x]` items reverted to `[ ]`).
- All four validation commands pass: `npm run lint`, `npm run typecheck`, `npm run build`, `npm run test:contracts`.
