# OpenProof v0.2.0 → v0.8.0 Upgrade Guide

## Version Path

This release hardens the v0.2.0 codebase for production readiness without changing
the core proof loop. No contract changes, no schema changes, no breaking changes
to the receipt format.

## What Changed

### Infrastructure
- Error boundary component catches React render errors gracefully
- Offline detection with banner notification
- Store readiness checklist (`docs/STORE_READINESS.md`)
- Environment variable documentation (`docs/environment.md`)
- Performance and bundle size monitoring in CI

### Security
- Content Security Policy refined with stricter `connect-src` and `frame-src`
- `npm audit` suppression documented and tracked
- Dependency supply-chain review performed

### Documentation
- Upgrade guide (this file)
- Release notes (`docs/RELEASE_NOTES.md`)
- Environment variable reference (`docs/environment.md`)
- Existing docs: `CHANGELOG.md`, `docs/receipt-schema.md`, `README.md`

### Quality
- All audit documents consolidated
- WCAG accessibility baseline reviewed
- Lighthouse targets documented

## Migration Steps

1. **No migration required.** This release is purely additive — no receipt schema
   changes, no contract upgrades, no data migrations.

2. **Environment variables.** Review `docs/environment.md` to ensure your
   `.env` file includes all documented variables. No new required variables.

3. **Deployment.** Standard static export to Vercel. No server-side dependencies.

## Verification

After deploying v0.8.0:

- [ ] App loads without errors
- [ ] Error boundary shows on broken pages (test by navigating to invalid hash)
- [ ] Offline banner appears when disconnected
- [ ] All existing proof, receipt, and verification flows work unchanged
- [ ] Store readiness checklist items are complete for target platforms
