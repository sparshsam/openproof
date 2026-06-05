# OpenProof Typography Integration Notes

**Font:** Stack Sans Notch Variable
**Source:** Self-hosted via `@fontsource-variable/stack-sans-notch`
**Monospace:** Geist Mono (unchanged, via `next/font/google`)

---

## 1. Weight Strategy

Per spec: 500-600 for headings, 400-500 for interface copy.

| Element | Weight | Class |
|---------|--------|-------|
| Page titles (h1) | 600 | `font-semibold` |
| Section headings (h2) | 600 | `font-semibold` |
| Card headings | 600 | `font-semibold` |
| Buttons (primary) | 500 | `font-medium` |
| Buttons (secondary) | 500 | `font-medium` |
| Body text | 400 | default |
| Labels | 500-600 | `font-medium` / `font-semibold` |
| Monospace (hashes) | 400 | default |

No weight below 400 is used. No weight above 700 is used. The variable font responds smoothly across the 200-700 axis.

## 2. Font Size Scale

Per UI_DOCTRINE §4.2 and VISUAL_RESTRAINTS §3.1:

| Size | Usage |
|------|-------|
| 12px | Labels, badges, metadata |
| 14px | Body text, button text |
| 16px | Default text |
| 20px | Sub-headings |
| 24px | Section headings |
| 32px | Page titles (desktop) |

## 3. Integration Points

- **layout.tsx:** `import "@fontsource-variable/stack-sans-notch"`
- **globals.css:** `--font-sans: "Stack Sans Notch Variable", "Stack Sans Notch", ui-sans-serif, system-ui, sans-serif`
- **body:** `font-family: var(--font-sans)`
- **@theme inline:** `--font-sans` mapped to Tailwind's font-sans utility

## 4. Why Self-Hosted Over Google Fonts CDN

1. **Zero layout shift** — font is available immediately, no FOIT/FOUT
2. **Privacy** — no request to fonts.googleapis.com
3. **Offline capable** — font bundles in the JS bundle
4. **Reliability** — no CDN outage dependency
5. **Performance** — one fewer critical request chain

## 5. Monospace Strategy

Geist Mono is retained as the monospace font. It pairs well with Stack Sans Notch (same designer, similar proportions). Used for:
- Cryptographic hashes
- Contract addresses  
- Transaction hashes
- Receipt data display
- Code blocks

## 6. No Display Typefaces

Per UI_DOCTRINE §4.1, no display typefaces are used. Stack Sans Notch is a neutral sans-serif with no optical size axis optimized for display. Same font, same family, across all contexts.
