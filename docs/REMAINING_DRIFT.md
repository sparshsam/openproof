# OpenProof Remaining Drift Register

**Date:** 2026-06-04
**Classification:** Intentional legacy carryovers, deferred improvements, and non-goals

---

## 1. Intentional Legacy Carryovers

These items are intentionally preserved from the pre-redesign frontend. They are not fully aligned with the doctrine but are retained for pragmatic reasons.

### 1.1 RainbowKit Wallet Connect Button

**File:** `src/app/create/page.tsx`
**Issue:** RainbowKit's `<ConnectButton />` is a pre-styled component that doesn't follow the OpenProof design system. It has its own button styling, hover effects, and modal.

**Resolution:** Intentionally preserved. Replacing RainbowKit's ConnectButton would require either custom wallet connection logic (high risk, potential security issues) or custom RainbowKit theming (significant effort, risk of breaking wallet flows). This is a known dependency constraint.

**Impact:** The wallet connect button visually differs from OpenProof's ActionButton. Acceptable — wallet connection is a third-party concern and the RainbowKit UI is itself restrained.

### 1.2 RainbowKit CSS Import

**File:** `src/app/layout.tsx` uses `@import '@rainbow-me/rainbowkit/styles.css';`
**Issue:** Brings in RainbowKit's own styling, which may conflict with OpenProof's token system.

**Resolution:** Intentionally preserved. Required for RainbowKit to function correctly.

**Impact:** Low — RainbowKit's styles are scoped to its own components.

### 1.3 Base Sepolia Notice Component

**File:** `src/components/base-notice.tsx`
**Issue:** Shows "This MVP uses Base Sepolia testnet." — this is temporary text that will become obsolete after mainnet deployment.

**Resolution:** Intentionally preserved. The notice serves a functional purpose during testnet phase. It will be removed or updated during mainnet deployment.

### 1.4 `animate-spin` on Loader2

**Files:** `src/app/create/page.tsx`, `src/app/proof/[hash]/proof-explorer-client.tsx`
**Issue:** UI_DOCTRINE §5.1 suggests bounded progress indicators over infinite animations.

**Resolution:** Intentionally preserved. The spinner is always accompanied by phase-description text ("Checking proof", "Loading proof record"). The spinner provides visual confirmation of activity while the text provides deterministic context. Per UI_DOCTRINE §5.3, "bounded spinner" is listed as permitted motion.

---

## 2. Deferred Improvements

These items are recognized as desirable improvements that were deferred due to scope/risk constraints.

### 2.1 Docs Sub-Pages

**Paths:** `/docs/spec`, `/docs/architecture`, `/docs/security`, `/docs/governance`
**Status:** Not implemented (404)
**Priority:** Medium
**Deferred because:** Requires creating 5+ documentation pages with reading-optimized layouts, secondary navigation, and markdown rendering. This is a separate implementation task not scoped in the redesign pass.

**Workaround:** The `/docs` hub links to these paths. They will 404 until implemented.

### 2.2 Create/Verify Page Visual Alignment Pass

**Status:** Tokens updated, drift removed. But the page structure itself (card layout, vertical flow, receipt display) carries over from the pre-redesign architecture.
**Priority:** Low
**Deferred because:** INFORMATION_ARCHITECTURE §3.2-3.3 specifies ideal page structures (file drop → file info → hash → registration flow → receipt). The current structure approximates this but is not pixel-for-pixel identical. A future structural pass could further align the page layouts with the IA specification.

### 2.3 Light Mode Visual Verification

**Status:** Light mode CSS variables defined but not visually verified.
**Priority:** Low
**Deferred because:** Dark mode is the default and primary presentation. Light mode tokens are mapped to reasonable values but may need pixel-level adjustment.

### 2.4 Focus Ring Consistency

**Status:** Focus ring style uses the accent color but some interactive elements may have inconsistent focus styling.
**Priority:** Low
**Deferred because:** Comprehensive focus ring audit is a standalone accessibility task.

### 2.5 Reduced Motion Query Harmonization

**Status:** The `@media (prefers-reduced-motion: reduce)` block in globals.css strips all transitions. This may be overly aggressive.
**Priority:** Low
**Deferred because:** Correct behavior for a tool with minimal motion. The block is intentionally broad to prevent unexpected motion in any component.

---

## 3. Non-Goals (Explicitly Not In Scope)

These items are excluded per the redesign constraints and NON_GOALS.md.

| Item | Reason |
|------|--------|
| New product features | Redesign is visual/foundational only |
| Architecture changes | Not a redesign concern |
| Gamification/dopamine loops | Prohibited by UI_DOCTRINE §11 and NON_GOALS |
| AI features | Prohibited by design constraints |
| Analytics/tracking | Prohibited by NON_GOALS §7 |
| Social systems | Prohibited by NON_GOALS §3 |
| Wallet-first flows | Prohibited by INTERACTION_PRINCIPLES IP-5 |
| Enterprise SaaS aesthetics | Prohibited by VISUAL_RESTRAINTS §1.1 |
| Crypto-fintech styling | Prohibited by UI_DOCTRINE §11.1 |
| Marketing/landing page structure | Prohibited by HOMEPAGE_STRUCTURE §1.2 |
| Feature additions of any kind | Redesign constraint |

---

## 4. Token Drift Register (Closed Items)

| Token | File | Fixed? |
|-------|------|--------|
| `base-grid` | create/page.tsx, verify/page.tsx | ✅ Removed |
| `success-pop` | create/page.tsx | ✅ Removed |
| `bg-base-dark` | create/page.tsx, verify/page.tsx | ✅ → `bg-bg-base` |
| `text-blue-100` | create/page.tsx, verify/page.tsx | ✅ → `text-text-secondary` |
| `rounded-3xl` | All component files | ✅ → `rounded-lg` |
| `rounded-\[2rem\]` | file-drop.tsx, receipt-import.tsx | ✅ → `rounded-lg` |
| `rounded-full` (button) | copy-button.tsx | ✅ → `rounded-\[6px\]` |
| `bg-base-blue` | All component files | ✅ → `bg-accent` |
| `text-base-blue` | All component files | ✅ → `text-accent` |
| `border-base-blue` | All component files | ✅ → `border-accent` |
| `bg-surface` | All component files | ✅ → `bg-bg-surface` |
| `text-muted` | All component files | ✅ → `text-text-muted` |
| `border-border` | All component files | ✅ → `border-border-default` |
| `tracking-\[0.16em\]` | All component files | ✅ Removed |
| `Sparkles` icon | create/page.tsx | ✅ → `ShieldCheck` |
| `bg-white/10` | base-notice.tsx | ✅ → `bg-bg-surface-muted` |
| `bg-white/15` | app-shell.tsx (old) | ✅ Already removed in redesign |

---

## 5. Summary

| Category | Count | Status |
|----------|-------|--------|
| Fixed token drift | 17 token types across 12 files | ✅ Complete |
| Intentional legacy carryovers | 4 items | 📝 Documented |
| Deferred improvements | 5 items | 📝 Documented |
| Non-goals | 13 items | ❌ Excluded by policy |
| Total open items | 9 | Open, tracked |
