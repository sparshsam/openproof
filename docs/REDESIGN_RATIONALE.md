# OpenProof Frontend Redesign — Rationale

**Date:** 2026-06-04
**Scope:** Homepage, header, footer, design system, global styles
**Authority:** UI_DOCTRINE.md, VISUAL_RESTRAINTS.md, HOMEPAGE_STRUCTURE.md, INFORMATION_ARCHITECTURE.md, INTERACTION_PRINCIPLES.md

---

## Before/After Philosophy Summary

### Before (old homepage)

The old homepage was a product landing page structure:

- Hero section with grid background patterns, multiple gradient layers, and glow effects
- Tagline: "Cryptographic proof for files, built on Base." (startup framing)
- Decorative dashboard-style demo card showing a mock proof receipt
- "Built on Base Sepolia" badge as primary visual identity element
- Five-step "How It Works" section (numbered step cards with icons)
- "Utility layer" section duplicating the step structure
- Two-card privacy/explainer section
- Registry address in a decorative card at the bottom

Visual language: crypto-product (blue glow, gradient backgrounds, dashboard preview), startup (step-by-step walkthrough, value proposition hero), ecosystem-first ("Built on Base" as hero badge).

### After (redesigned homepage)

The new homepage is an infrastructure utility threshold:

- **Binary action cards** — two equal-sized cards (Create Proof, Verify Proof) as the dominant visual element above the fold
- **Registry identity block** — contract address (full), network, chain ID, contract properties in a compact information block
- **System overview card** — canonical text describing what OpenProof is, bullet properties, verification independence note
- **Documentation links row** — Spec, Architecture, Security, Governance as flat text links

All other sections removed: no hero, no step walkthrough, no feature grids, no dashboard, no ecosystem badges, no decorative demo card.

---

## Design Decisions

### 1. Dark Mode as Default

Per UI_DOCTRINE §7.1, dark mode is the default. The CSS variable system (`:root`) now sets dark values as the base. Light mode is a secondary `@media (prefers-color-scheme: light)` override.

**Why:** Dark mode communicates "developer tool" rather than "consumer product." It reduces visual noise and aligns with the infrastructure aesthetic.

### 2. Single Flat Background

The old grid gradient background (`.base-grid`) with multiple radial gradients and a repeating grid pattern was removed entirely. The new background is `#0a0a0a` — a single flat dark color.

**Why:** Per VISUAL_RESTRAINTS §1.2, background imagery, patterns, gradients, and textures are prohibited. A flat background communicates stability and calm.

### 3. No Logo Mark

The header now shows "OpenProof" as plain text with no shield icon.

**Why:** Per VISUAL_RESTRAINTS VR-5, no brand-mark logo. The shield icon was decorative branding, not functional. Icons are permitted only when they reduce scanning time (UI_DOCTRINE §1.3).

### 4. Hairline Borders, 8px Radius

All cards use `border-border-default` (rgba(255,255,255,0.1)) with `rounded-lg` (8px radius). The old `rounded-[2rem]` (32px) and `rounded-3xl` were decorative.

**Why:** Per VISUAL_RESTRAINTS §1.2, borders are hairline 1px. Card corners are 8px. Pill-shaped (9999px) elements are prohibited for buttons.

### 5. No Glow Effects

All `blue-glow` class references, `shadow-[0_18px_45px_rgba(0,82,255,0.28)]`, and similar glow/glassy shadows were removed.

**Why:** Per VISUAL_RESTRAINTS VR-1, no gradients or glows. Shadows serve depth hierarchy only (single level: `0 2px 8px rgba(0,0,0,0.3)`).

### 6. Single Accent Color

The accent color (`--accent: #6aa2ff`) is used only for actionable elements (buttons, links, active states). Semantic colors (`--success: #6ee7b7`, `--error: #ff8a8f`) are subdued.

**Why:** Per VISUAL_RESTRAINTS §2.1, a single accent color for actionable elements. No multi-color palette. Green = confirmed, red = error, both subdued.

### 7. No Animations

All CSS animations (`.success-pop`, `.soft-fade-in`) removed. All motion-related CSS (entrance animations, transition effects) stripped.

**Why:** Per UI_DOCTRINE §5 and VISUAL_RESTRAINTS §8.2, motion is limited to 150-200ms state transitions. No entrance animations, no decorative motion, no scroll-triggered effects.

### 8. Equal Action Cards

Both action cards are structurally identical: same size (equal grid columns), same layout (heading + description + button + context note), same visual weight. Neither is prioritized.

**Why:** Per INTERACTION_PRINCIPLES IP-2, Create and Verify always have identical visual weight. The user chooses by reading the label, not by scanning for a prioritized option.

### 9. Binary Page Structure

The homepage now has exactly four sections in priority order:
1. Action Cards (primary zone, 50%+ of viewport)
2. Registry Identity (information zone)
3. System Overview (context zone)
4. Documentation Links (reference zone)

**Why:** Per HOMEPAGE_STRUCTURE §3, sections are ordered by descending importance. No section may be omitted. The action cards must always be the dominant visual element.

### 10. Header Restructure

- Removed: shield icon logo mark
- Removed: "Start" CTA button 
- Removed: backdrop-blur effect
- Added: Docs link (pages to `/docs`)
- Added: GitHub link (external, with external icon)
- Simplified: no dropdowns, no sub-navigation

**Why:** Per INFORMATION_ARCHITECTURE §2.1, the header contains exactly: OpenProof, Create Proof, Verify Proof, Docs, GitHub. No logo image, no additional CTAs.

### 11. Footer Restructure

- Replaced marketing language ("app built on Base") with infrastructure description
- Added: contract address (truncated), AGPL-3.0 license, version
- Added: GitHub link
- Removed: ecosystem references ("Base Sepolia testnet")

**Why:** Per INFORMATION_ARCHITECTURE §2.3, footer contains: GitHub, contract, license, version. The tagline is "OpenProof — cryptographic proof infrastructure."

### 12. Design System Simplification

- Card: no `dark` variant, no `blue-glow` class, consistent 8px radius
- ButtonLink: no glow shadow, rounded-[6px] instead of rounded-full
- ActionButton: same simplification
- Badge: simplified, supports tone prop for backward compat
- RegistryInfo: new component for contract identity display
- DocLink: new component for flat documentation navigation
- StepIndicator/PhaseTimeline: new components for state machine feedback
- StatusPill, StepCard, NetworkNotice: preserved for backward compat

---

## Files Changed

| File | Change Type | Description |
|------|-------------|-------------|
| `src/app/globals.css` | Rewrite | New token system, dark default, removed animations/gradients |
| `src/app/page.tsx` | Rewrite | Binary action cards, no hero, no step sections |
| `src/components/app-shell.tsx` | Rewrite | Simplified header, infrastructure footer |
| `src/components/design-system.tsx` | Rewrite | Simplified components, new utility components |
| `docs/REDESIGN_RATIONALE.md` | New | This document |

---

## Verification

Per HOMEPAGE_STRUCTURE §11 checklist:

- [x] Both action cards present and visually equal
- [x] No action card has priority treatment
- [x] Header contains: OpenProof, Create Proof, Verify Proof, Docs, GitHub
- [x] Registry identity block displays full contract address and network
- [x] System overview uses canonical text
- [x] Documentation links present: Spec, Architecture, Security, Governance
- [x] No wallet connection UI on homepage
- [x] No ecosystem badges, partner logos, "powered by" indicators
- [x] No illustration, animation, or background pattern
- [x] No testimonials, social proof, user counts
- [x] No step-by-step visualizations or "how it works" sections
- [x] No email capture, newsletter signup
- [x] No trust theater (badges, seals, padlocks)
- [x] No breadcrumbs, sub-navigation, non-standard nav
- [x] Footer: GitHub, contract, license, version
- [x] Mobile breakpoints maintain content and priority order
- [x] All internal links navigate within same tab
- [x] Page loads as static HTML with no dynamic content
- [x] Dark mode is default

---

## Open Items

1. **Docs pages** — `/docs`, `/docs/spec`, `/docs/architecture`, `/docs/security`, `/docs/governance` routes need to be created with the documentation hub layout and secondary navigation as specified in INFORMATION_ARCHITECTURE §2.2. This is a separate implementation task.

2. **Create/Verify pages** — These pages still use the old design system components (StatusPill, StepCard, NetworkNotice) and old CSS tokens. They need a separate pass for full alignment with the new visual language. They are functionally unchanged but visually carry over from the previous design.

3. **Light mode testing** — The light mode variables exist as a `@media (prefers-color-scheme: light)` override but have not been visually verified. Some token mappings may need adjustment.

4. **TypeScript strict check** — The WSL environment does not have enough memory for `tsc --noEmit`. A CI pipeline should verify type correctness.
