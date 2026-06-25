# OpenProof v0.8.0 — Release Notes

## Release Hardening

This release focuses on infrastructure quality, security hardening, store
readiness, and documentation completeness. No new product features.

## Highlights

### Infrastructure
- **Error boundary** — global React error boundary with graceful reload prompt
- **Offline detection** — banner notification when network is unavailable
- **Environment separation** — documented env variables per deployment target
- **Store readiness checklist** — comprehensive checklist for all app stores
- **Performance** — bundle size tracking in CI

### Security
- **CSP refinement** — stricter `connect-src`, `frame-src`, `img-src` policies
- **Dependency audit** — tracked with documented exemptions for library-level issues
- **Supply-chain review** — all 284 dependencies audited for origin and maintenance

### Documentation
- **Upgrade guide** — v0.2.0 → v0.8.0 migration path
- **Release notes** — this document
- **Environment reference** — all env vars documented with defaults and purposes
- **Store readiness** — per-platform publishing checklists

### Quality
- Accessibility baseline established (WCAG 2.2 AA target)
- Lighthouse audit targets documented
- Responsive and mobile audit checklists

## Breaking Changes

None. This is purely hardening — no receipt schema changes, no contract
changes, no API changes.

## Upgrade Path

See `docs/UPGRADE_GUIDE.md` for details. TL;DR: deploy as-is, no migration needed.

## Known Issues

- WalletConnect integration requires a project ID from Reown (free tier available)
- Base Sepolia testnet RPC may occasionally rate-limit public requests
- 3 transitive dependency warnings exist in RainbowKit/WalletConnect (low severity)

## Changelog

See `CHANGELOG.md` for the full version history.

---

**Deployed at:** https://openproof.vercel.app  
**Source:** https://github.com/sparshsam/openproof  
**License:** AGPL-3.0-only  
**Contact:** sparshsam@gmail.com
