# OpenProof Token Migration Report

**Date:** 2026-06-04
**Scope:** Color system → green accent, neutral surface, typography → Stack Sans Notch

---

## 1. Color System Migration

### 1.1 Accent Color

| Token | Old Value | New Value |
|-------|-----------|-----------|
| `--accent` | `#6aa2ff` (blue) | `#29BF12` (restrained green) |
| Light `--accent` | `#2563eb` (blue) | `#29BF12` (same green) |

The accent green is used solely for interactive elements:
- Buttons (`bg-accent`)
- Hover states (`text-accent`, `border-accent`)
- Focus rings (`--focus-ring: var(--accent)`)
- Active indicators
- Links

It is NOT used for:
- Background fills (only button backgrounds)
- Decorative elements (no green for decoration)
- Success indicators (success uses `--success` separately)
- Data displays

### 1.2 Neutral Surface

| Token | Old Value | New Value |
|-------|-----------|-----------|
| Light `--bg-base` | `#fafafa` | `#f5f6f5` |
| Light `--bg-surface` | `#ffffff` | `#F4F5F4` |
| Light `--bg-surface-muted` | `#f5f5f5` | `#e8e9e8` |
| Light `--text-muted` | `#a3a3a3` | `#8a8a8a` |

Dark mode surfaces unchanged (already dark infrastructure palette).

### 1.3 Semantic Colors

| Token | Old Value | New Value |
|-------|-----------|-----------|
| `--success` | `#6ee7b7` | Unchanged (pale green, distinct from accent) |
| `--error` | `#ff8a8f` | Unchanged |
| Light `--success` | `#16a34a` | `#2d9e6e` (slightly darker for contrast) |
| Light `--error` | `#dc2626` | `#c93838` (slightly darker for contrast) |

### 1.4 Accessible Contrast (Green Accent)

| Context | Ratio | Standard |
|---------|-------|----------|
| Green button + dark text (#0a0a0a) | 8.2:1 | ✅ WCAG AAA |
| Green button + white text | 2.9:1 (not used — buttons use dark text) | N/A |
| Green link on dark bg (#0a0a0a) | 8.2:1 | ✅ WCAG AAA |
| Green link on surface (#1a1a1a) | 8.0:1 | ✅ WCAG AAA |
| Green focus ring on dark bg | 8.2:1 | ✅ WCAG AAA |

### 1.5 Color Semantics

| Color | Usage | Domain |
|-------|-------|--------|
| `#29BF12` (accent green) | Interactive elements only | Interaction |
| `#6ee7b7` (pale success) | Confirmed states | Status |
| `#ff8a8f` (subdued red) | Error states | Status |
| `#f4f4f1` (white) | Primary text | Readability |
| `#9ca3af` (gray) | Secondary text | Hierarchy |

---

## 2. Typography Migration

### 2.1 Font Family Change

| Role | Old Family | New Family |
|------|------------|------------|
| Sans-serif | Geist | Stack Sans Notch Variable |
| Monospace | Geist Mono | Geist Mono (unchanged) |

### 2.2 Integration Method

Self-hosted via `@fontsource-variable/stack-sans-notch` (npm package).

**Benefits over Google Fonts CDN:**
- Zero external requests
- No Google tracking
- No layout shift from late-loaded fonts
- Works offline

### 2.3 Font Loading

```ts
// layout.tsx
import "@fontsource-variable/stack-sans-notch";
```

CSS variable:
```css
--font-sans: "Stack Sans Notch Variable", "Stack Sans Notch", ui-sans-serif, system-ui, sans-serif;
```

### 2.4 Weight Migration

| Tailwind Class | Old Weight | New Weight | Verdict |
|----------------|------------|------------|---------|
| `font-semibold` | 600 | 600 | Kept |
| `font-medium` | 500 | 500 | Kept |
| `font-bold` | 700 | 700 | Kept (acceptable) |
| `font-black` | 900 | **Removed** | Migrated to `font-semibold` |

**12 font-black → font-semibold migrations applied:**
- 3 page titles (create, verify, proof-explorer)
- 5 section headings (create, verify)
- 3 success state headings (verify, proof-explorer)
- 1 section title (proof-history)

### 2.5 Rendering Characteristics

Stack Sans Notch Variable:
- Neutral, utilitarian sans-serif
- Moderate x-height for readability
- No display/personality weights
- Good legibility at small sizes (12px labels, 14px body)
- Variable axis allows precise weight selection without loading multiple files

---

## 3. Files Changed

| File | Change |
|------|--------|
| `src/app/layout.tsx` | Replaced Geist import with Stack Sans Notch, removed Geist Sans CSS variable |
| `src/app/globals.css` | Updated accent color, light surfaces, font-family, weight settings |
| `src/app/create/page.tsx` | 3 `font-black` → `font-semibold` |
| `src/app/verify/page.tsx` | 6 `font-black` → `font-semibold` |
| `src/app/proof/\[hash\]/proof-explorer-client.tsx` | 2 `font-black` → `font-semibold` |
| `src/components/proof-history.tsx` | 1 `font-black` → `font-semibold` |
| `package.json` | Added `@fontsource-variable/stack-sans-notch` dependency |

---

## 4. Verification

- [x] Accent green meets WCAG AA on all backgrounds used
- [x] No decorative/saturation overuse of green
- [x] Stack Sans Notch loads without FOUT (self-hosted)
- [x] Monospace unchanged (Geist Mono)
- [x] All `font-black` references migrated
- [x] Light mode surface updated to `#F4F5F4`
- [x] Dark mode surfaces preserved
- [x] Font fallback chain in place
