# OpenProof Visual Refinement Summary

**Date:** 2026-06-04
**Scope:** Color-system migration, typography migration, token harmonization

---

## Changes Made

### Accent Color: Blue → Green

The visual identity accent shifted from `#6aa2ff` (blue) to `#29BF12` (green):

- All interactive elements now use green: buttons, hover states, focus rings, links
- Green is used sparingly — not as a decorative color, not as a success indicator
- Semantic success (`--success: #6ee7b7`) is a separate, paler green for confirmed states only
- No visual saturation: only 12 background uses, 20 text uses (mostly hover states)

### Neutral Surface

Light mode surface refined to `#F4F5F4` — a warm off-white that's less stark than pure white. Dark mode surfaces unchanged.

### Typography: Geist → Stack Sans Notch

- Self-hosted variable font via Fontsource
- All headings moved from `font-black` (900) to `font-semibold` (600)
- Button labels use `font-medium` (500)
- 12 `font-black` references removed
- Geist Mono retained for monospace

### No Visual Drift Introduced

- No gradients, no glow, no decorative elements
- No SaaS branding, no fintech aesthetics
- No cyberpunk/Web3 styling
- Calm infrastructure identity preserved
- Binary interaction structure unchanged
- Layout architecture unchanged

## Doctrine Alignment

| Document | Provision | Status |
|----------|-----------|--------|
| UI_DOCTRINE §4 | Typography restraint | ✅ Single neutral typeface, restrained weights |
| UI_DOCTRINE §7 | Infrastructure aesthetics | ✅ Green is infrastructural, not brand/glow |
| VISUAL_RESTRAINTS §2 | Color restraints | ✅ Single accent, subdued semantic colors |
| VISUAL_RESTRAINTS §3 | Typography restraints | ✅ No display faces, no thin weights |
| HOMEPAGE_STRUCTURE | Layout | ✅ Unchanged |
| INTERACTION_PRINCIPLES | Interaction | ✅ Unchanged |

## Files Changed

**7 files modified, 1 added:**
- `docs/TOKEN_MIGRATION_REPORT.md` (new)
- `docs/TYPOGRAPHY_INTEGRATION_NOTES.md` (new)
- `docs/VISUAL_REFINEMENT_SUMMARY.md` (new)
- `src/app/layout.tsx`
- `src/app/globals.css`
- `src/app/create/page.tsx`
- `src/app/verify/page.tsx`
- `src/app/proof/[hash]/proof-explorer-client.tsx`
- `src/components/proof-history.tsx`
- `package.json` (dependency added)
- `package-lock.json`

## Remaining

- Docs sub-pages still unimplemented (5 paths, 404)
- RainbowKit ConnectButton retains its own styling (3rd party)
- Light mode needs visual verification (CI has no browser tests)
