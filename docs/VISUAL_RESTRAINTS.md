# OpenProof Visual Restraints

**Classification:** Permanent visual restraint documentation
**Scope:** OpenProof, all deployments and forks
**Authority:** Ecosystem governance standards — [ecosystem-standards](https://github.com/sparshsam/ecosystem-standards)
**Status:** Ratified — do not amend without governance review
**Parent doctrines:**
- [UI_DOCTRINE.md](UI_DOCTRINE.md) §1 (Visual Philosophy), §11 (Anti-Patterns)
- [DESIGN_RESTRAINTS.md](DESIGN_RESTRAINTS.md) — implementation constraints
- [NON_GOALS.md](NON_GOALS.md) — permanent exclusions

**Relationship to existing documents:** VISUAL_RESTRAINTS.md is an operational subset of UI_DOCTRINE.md's anti-pattern register. It enumerates what the visual design must not become — the explicit prohibition list. UI_DOCTRINE.md provides the positive philosophy; this document provides the negative constraints.

---

## 1. Visual Identity Prohibitions

### 1.1 What the Interface Must Not Communicate

The visual identity must never communicate:

| Prohibited Communication | Why | Example |
|--------------------------|-----|---------|
| "This is a crypto product" | Crypto product styling primes financial expectations | Wallet balance displays, gas price gauges, transaction history lists |
| "This is a startup landing page" | Startup pages use persuasive design to convert visitors | Hero sections with value propositions, testimonial quotes, user counts |
| "This is an ecosystem showcase" | Ecosystem branding subordinates the tool's identity to its chain | Base logo as primary visual element, ecosystem partner badges |
| "This is an exciting technology" | Excitement is incompatible with infrastructure trust | Animated particle backgrounds, glitch effects, holographic elements |
| "This is a secure product" | Security claims must be cryptographic, not visual | Green padlocks, "secured by" badges, trust seals |
| "This is a premium service" | Premium implies tiers, subscription, exclusivity | Gold/diamond accents, "pro" labels, gradient brand marks |
| "This is a modern web app" | Modern web app styling prioritizes engagement over utility | Skeleton loaders, micro-interactions, hover animations on every element |

### 1.2 Visual Language Constraints

| Element | Permitted | Prohibited |
|---------|-----------|------------|
| Background | Single flat dark color (#0a0a0a or equivalent) | Gradients, patterns, images, textures, particle effects |
| Primary surface | #1a1a1a or equivalent dark surface | Glass, translucent, frosted glass, blurred backgrounds |
| Borders | Hairline 1px, rgba(255,255,255,0.1) or subtler | Thick borders, colored borders, animated borders, dashed patterns |
| Shadows | Single level: card depth (e.g., 0 2px 8px rgba(0,0,0,0.3)) | Multiple shadow layers, colored shadows, inset shadows on non-input elements |
| Corners | 8px radius on cards, 4px on buttons | Pill-shaped (9999px) elements, asymmetric corners, decorative cutouts |
| Dividers | Hairline horizontal line, same color as borders | Vertical dividers, decorative divider patterns, icon dividers |
| Accents | Single accent color for actionable elements only | Multi-color accent palette, color-coding by category, rainbow elements |
| Icons | Line-style icons, 1.5px stroke, matching text color | Filled icons, multi-color icons, animated icons, brand-mark icons |

---

## 2. Color Restraints

### 2.1 Palette Structure

The color palette is limited to exactly the following roles:

| Role | Usage | Quantity |
|------|-------|----------|
| Background | Page and section backgrounds | 2 (base, surface) |
| Text | All readable content | 2 (primary, secondary/muted) |
| Accent | Interactive elements, active states | 1 |
| Success | Confirmed states, verified results | 1 |
| Error | Failed states, error messages | 1 |
| Warning | Transient or attention-requiring states | 1 (optional) |

No additional color roles. No "brand" color outside the accent role. No gradient of any color.

### 2.2 Specific Color Prohibitions

| Prohibited | Reason |
|------------|--------|
| Neon green, electric blue, hot pink | Gaming/casino aesthetic |
| Gold, bronze, silver | Premium/tier signaling |
| Rainbow or multi-color palettes | Consumer product identity |
| Bright saturated backgrounds | Attention competition |
| Color transitions (any → any) | Animated or static; prohibits decay/aging/temporal visual effects |
| Color-coded file types | Unnecessary visual complexity for a single-function tool |
| Green/red exclusively without text labels | Accessibility; color is not the only indicator |

### 2.3 Color Semantics

Color must carry consistent, unambiguous meaning:

| Color | Semantic | Used For |
|-------|----------|----------|
| Green (subdued) | Confirmed, exists, verified | Transaction confirmed, proof found, hash match |
| Red (subdued) | Error, rejected, absent | Transaction reverted, proof not found, validation error |
| Grey/neutral | Idle, pending, informational | Default state, in-progress, secondary information |

No use of green for "secure" or red for "dangerous" outside the explicit semantics above. A green badge does not say "safe" — it says "confirmed."

---

## 3. Typography Restraints

### 3.1 Typeface Constraints

| Property | Permitted | Prohibited |
|----------|-----------|------------|
| Family | Single sans-serif (Geist) | Multiple families, serif, display, handwritten, decorative |
| Variants | Regular, Medium, Semibold | Thin, ExtraLight, Light, Black, Bold (if it creates excessive weight contrast) |
| Monospace | Single monospace (Geist Mono) | Multiple monospace families |
| Sizes | System: 12/14/16/20/24/32px | Fractional sizes, size variations beyond the system scale |
| Line height | Body: 1.6, Headings: 1.2, Monospace: 1.4 | Tight line heights that compress text, loose line heights for decorative effect |

### 3.2 Typographic Behavior Prohibitions

- **No type mismatch.** Do not pair Geist Sans with a different sans-serif for headings.
- **No all-caps body text.** All-caps is permitted only for labels shorter than 5 words and technical identifiers.
- **No letter-spacing changes.** Do not tighten or loosen tracking for visual effect.
- **No font-size variation for emphasis.** Use weight (semibold) or color (secondary text) for emphasis within headings, not size changes.
- **No drop-caps or decorative initial letters.**
- **No justified text alignment.** Left-align for English text.

---

## 4. Spacing and Layout Restraints

### 4.1 Layout Constraints

| Property | Permitted | Prohibited |
|----------|-----------|------------|
| Max content width | 1200px (desktop) | Full-width content that requires horizontal head movement |
| Grid | Symmetrical, equal-column grids | Asymmetrical grids, diagonal layouts, overlapping elements |
| Content density | Generous whitespace between sections | Dense layouts that compress multiple information layers into the viewport |
| Element staggering | Even, predictable placement | Alternating left/right layouts, zigzag content patterns |
| Z-index layering | Maximum 3 layers (background, content, overlay) | Floating elements, layered backgrounds, elements that overlap the main content |

### 4.2 Specific Layout Prohibitions

- **No full-bleed sections.** Content is always within the max-width container.
- **No fixed-position elements** except the header.
- **No overlapping elements** without explicit functional need (e.g., a modal overlay).
- **No horizontal scroll** on any page at any breakpoint.
- **No asymmetric card layouts** (e.g., a 2/3 + 1/3 split on the homepage).
- **No cards extending beyond the content boundary** (e.g., cards with negative margins).

---

## 5. Interactive Element Restraints

### 5.1 Button Constraints

| Property | Permitted | Prohibited |
|----------|-----------|------------|
| Shape | Rounded rectangle (4px–8px radius) | Pill-shaped, icon-only without text label, ghost buttons (no border, no background) |
| Hover state | Subtle background lightening or border highlight | Scale, translate, glow, shadow expansion, color shift to bright accent |
| Active state | Slight darkening or border emphasis | Ripple effects, flash animations, particle burst |
| Loading state | Text label + inline spinner | Full-button spinner replacement, "loading..." text fade |
| Size | One size per context (default, small for inline) | Multiple sizes on the same page, oversized CTAs, tiny tap targets |

### 5.2 Form Element Constraints

- **File drop zones** are large rectangular areas with clear visual borders. No drag-to-nothing interaction.
- **Copy buttons** are inline text buttons with a clipboard icon. No "copied!" toast — show inline state change.
- **Links** are underlined only in body text. Navigation links are not underlined.
- **Select/dropdown** are native HTML select elements. No custom-styled dropdowns with animation.
- **Text inputs** are simple bordered boxes. No floating labels, no animated placeholders.

### 5.3 Prohibited Interactive Patterns

- **Skeleton loaders.** The system has no dynamic loading that would benefit from skeleton placeholders. Use spinner or phase text.
- **Infinite scroll.** All content is bounded and paginated explicitly if needed.
- **Pull-to-refresh.** Not a mobile-native pattern for this use case.
- **Swipe gestures.** Swipe has no functional role in proof creation or verification.
- **Drag-to-reorder.** There is nothing to reorder.
- **Context menus / right-click actions.** All actions are surface-level buttons.

---

## 6. Data Display Restraints

### 6.1 Hash and Address Display

| Property | Required | Prohibited |
|----------|----------|------------|
| Hash format | Full 66-character hex with `0x` prefix | Truncation without visible expand mechanism |
| Address format | Full 42-character hex with `0x` prefix | ENS name as primary display (ENS as secondary annotation is acceptable) |
| Line wrapping | Break at 42 chars for addresses, 66 for hashes | No wrapping, inline truncation |
| Copy mechanism | Visible copy button + select-to-copy | Hidden copy, "copied" toast without inline indicator |

### 6.2 Receipt Display

- Receipts are displayed as structured JSON, not as a formatted data card. The user should see the raw structure.
- Receipt fields are labeled inline (key-value pairs), not rebranded in UI-friendly terms.
- No "pretty" receipt rendering that obscures the actual data structure.

### 6.3 Prohibited Data Displays

- **Charts and graphs.** There is no quantitative data to visualize.
- **Progress bars for non-progress items.** File hashing uses a text status, not a progress bar.
- **Timeline visualizations** beyond the explicit phase timeline on the create page.
- **Data tables** with sort, filter, search functionality. The only data is proof records, which are individually addressable.
- **Mini-maps or geographic displays.** No location data exists in the system.

---

## 7. Documentation Display Restraints

### 7.1 Markdown Rendering

When rendering documentation (specs, RFCs, architecture documents), the following rules apply:

- **Code blocks** use a dark background with monospace font. No syntax highlighting beyond a single color.
- **Tables** are simple bordered grids. No alternating row colors, no sticky headers (content fits viewport).
- **Blockquotes** use a left border accent. No background color.
- **Headings** use weight and size, not color, for hierarchy.
- **Images/diagrams** are rendered as ASCII art or as referenced SVG files with a monospace fallback. No embedded image diagrams.

### 7.2 Prohibited Documentation Patterns

- **Side-by-side comparison views.** Documents are read from top to bottom.
- **Collapsible sections with animation.** Use simple expand/collapse with no transition.
- **Tabbed interfaces.** Content is not grouped into tabs.
- **Automatic table of contents generation** beyond what the document headings provide.

---

## 8. State and Transition Restraints

### 8.1 State Display

- States are communicated through text labels, not decorative changes.
- A state change (e.g., "hashing" → "hash ready") is signaled by text replacement, not by animation.
- Loading states show a bounded progress indicator with a phase description. Never an infinite spinner without context.
- Empty states (no proofs, no history) are informative: "No proofs in local history. Register a file to create your first proof." Not whimsical: "It's quiet here..." with an illustration.

### 8.2 Transition Restraints

| Transition | Permitted | Prohibited |
|------------|-----------|------------|
| Page navigation | Instant (static pages) | Route transition animations, fade-in, slide-in |
| State change | Text replacement, optional 150ms opacity shift | Color flash, scale bounce, rotation |
| Modal open | 150ms opacity transition | Slide-up from bottom, scale from zero, spring animation |
| Hover | Cursor change, subtle (5%) background shift | Scale, translateZ, filter blur, brightness change |
| Loading | Bounded determinate bar or phase-labeled spinner | Indeterminate spinner without phase label, shimmer skeleton, pulsing placeholder |

---

## 9. Responsive Restraints

### 9.1 Mobile Considerations

On mobile (<640px):

| Element | Restraint |
|---------|-----------|
| Header | Collapse to hamburger. No slide-in drawer — simple overlay menu. |
| Action cards | Full-width buttons with icon + label. Same visual weight for Create and Verify. |
| File drop zone | Replace drag-and-drop with tap-to-select button. Drag-and-drop is supplementary. |
| Docs navigation | Horizontal scrollable tabs or select dropdown. No sidebar toggle. |
| Hash display | Wrapping is acceptable. Full hash remains visible. |
| Copy button | Tap-target minimum 44×44px. |

### 9.2 Prohibited Responsive Patterns

- **Mobile-only features.** The mobile and desktop versions offer identical functionality.
- **Touch gesture requirements** beyond tap. No swipe, pinch, or long-press for core actions.
- **Responsive font scaling** that varies more than ±2px from the desktop size.
- **Viewport-dependent layout shifts** that move interface elements between breakpoints (e.g., sidebar to top nav).
- **"View desktop version"** link. The responsive version is the complete version.

---

## 10. Visual Reference Alignment

### 10.1 Positive References (Aspirations)

| Reference | What to Emulate |
|-----------|-----------------|
| [ethereum.org](https://ethereum.org) | Documentation-first structure, restrained color, content hierarchy without decorative elements |
| [bitcoin.org](https://bitcoin.org) | Utility-first landing page, binary action orientation (Bitcoin for Individuals / for Businesses) |
| [signal.org](https://signal.org) | Calm, neutral, information-dense without being overwhelming. Minimal branding, maximum clarity |
| [proton.me](https://proton.me) | Clean typography, high information density without clutter, restrained accent color |
| [IPFS docs](https://docs.ipfs.tech) | Reading-mode documentation, code-block-first presentation, minimal navigation chrome |
| [Internet Archive](https://archive.org) | Utilitarian, functional, no-thrills interface. Service delivery over visual polish |

### 10.2 Negative References (What to Avoid)

| Reference | What to Avoid |
|-----------|---------------|
| Uniswap / 1inch / SushiSwap | DeFi dashboard aesthetics, token balances, transaction history lists, pool metrics |
| dYdX / GMX / Hyperliquid | Trading terminal aesthetics, order books, PnL displays, leverage controls |
| Rollbit / Stake / gambling platforms | Countdown timers, flashy green/red, celebration animations, "all-in" buttons |
| Stripe / Linear / Vercel (marketing site) | Startup SaaS landing page aesthetics, testimonial sections, value prop stacking, gradient gradients |
| Coinbase / OpenSea | Marketplace aesthetics, asset cards, price displays, collection layouts |
| NFT minting sites / profile pages | Gallery grids, rarity scores, animated assets, profile badges |
| Base ecosystem showcase sites | Ecosystem-marketing-first identity, "Built on Base" hero, partner logo walls |

---

## 11. Visual Restraint Register

| # | Restraint | Severity | Domain |
|---|-----------|----------|--------|
| VR-1 | No gradients or glows | Hard | Color |
| VR-2 | No decorative animations | Hard | Motion |
| VR-3 | Single accent color only | Hard | Color |
| VR-4 | Full hash display only | Hard | Typography |
| VR-5 | No brand-mark logo | Hard | Identity |
| VR-6 | No ecosystem-first branding | Hard | Identity |
| VR-7 | No trust theater elements | Hard | Trust |
| VR-8 | No DeFi/trading/gambling aesthetics | Hard | Visual language |
| VR-9 | Max 2 interactive element sizes per page | Soft | Layout |
| VR-10 | No skeleton loaders | Hard | Interaction |
| VR-11 | States communicated by text, not color alone | Hard | Accessibility |
| VR-12 | No chart, graph, or data visualization | Hard | Data display |
| VR-13 | Max 10 top-level pages | Hard | Architecture |
| VR-14 | No feedback animations (celebration, congratulatory) | Hard | Interaction |
| VR-15 | No social proof or user counts | Hard | Trust |
| VR-16 | Documentation rendered in-application, not external | Soft | Documentation |

**Severity definitions:**
- **Hard** — Must never be violated. Requires governance escalation.
- **Soft** — May be relaxed under documented justification. Requires restraint review per DESIGN_RESTRAINTS.md §10.

---

## 12. Changelog

| Version | Date | Change | Author |
|---------|------|--------|--------|
| 001 | 2026-06-04 | Original ratification | UI Doctrine & Information Architect |
