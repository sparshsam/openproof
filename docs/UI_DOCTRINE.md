# OpenProof UI Doctrine

**Classification:** Permanent user interface doctrine
**Scope:** OpenProof, all deployments and forks
**Authority:** Ecosystem governance standards — [ecosystem-standards](https://github.com/sparshsam/ecosystem-standards)
**Status:** Ratified — do not amend without governance review
**Parent doctrines:**
- [SYSTEMS_DOCTRINE.md](SYSTEMS_DOCTRINE.md) §4 (Frontend Role), §6 (Implementation Principles)
- [DESIGN_RESTRAINTS.md](DESIGN_RESTRAINTS.md) — implementation constraints
- [ARCHITECTURAL_INVARIANTS.md](ARCHITECTURAL_INVARIANTS.md) III-1 through III-5 (Frontend Invariants)

**Relationship to existing documents:** UI_DOCTRINE.md governs the visual and interactive surface of the frontend. It does not override architectural invariants or trust boundaries. It translates cold-system properties (determinism, immutability, zero trust) into user-facing presentation rules. Discrepancies between this document and a higher-level doctrine should be resolved in favor of the higher-level doctrine.

---

## 1. Visual Philosophy

### 1.1 Infrastructure, Not Product

The frontend communicates infrastructure, not a product. The difference is fundamental:

| Property | Infrastructure | Product |
|----------|---------------|---------|
| Visual language | Restrained, neutral, functional | Expressive, branded, distinctive |
| Pacing | Self-serve, no onboarding sequence | Guided, progressive onboarding |
| Identity | Minimal — tool name, address | Full — logo, tagline, color system |
| Interaction model | Low-frequency, deliberate | Engagement-optimized |
| Call to action | Accessible utility | Conversion funnel |

OpenProof's visual language must feel like accessing a utility — turning on a light switch, not boarding a spaceship. The UI should be forgettable in the best sense: immediately comprehensible, absent of cognitive friction, and demanding no emotional investment.

### 1.2 Calm Infrastructure Aesthetic

The visual style must evoke calm, stable infrastructure:

- **Low contrast ratios between decorative elements.** Saturated colors reserved for functional alerts only.
- **Generous whitespace.** Content is not competing for attention; it is resting on the page.
- **No background imagery, grain textures, or abstract patterns.** The background is a single flat color.
- **No decorative gradients or glows.** Gradients are reserved for functional indication (hover state, active state) and are minimal.
- **No parallax, scroll-jacking, or motion backgrounds.** The page does not move unless the user moves it.

### 1.3 Functional Minimalism

Every visual element must earn its place through utility:

- Icons are permissible only when they reduce scanning time for a specific action. Decorative icons are prohibited.
- Shadows serve depth hierarchy (cards, modals) only. Decorative drop-shadows on text, decorative borders, and ornamental shapes are prohibited.
- Dividers are used sparingly. Whitespace is the preferred separation mechanism.
- Cards and containers are optically weighted — minimal border, sufficient internal padding, no superfluous corner decorations.

---

## 2. Interaction Philosophy

### 2.1 Binary Interaction Model

OpenProof performs exactly two primary user actions: **Create Proof** and **Verify Proof**. The interaction architecture must reflect this binary simplicity at every level:

- These two actions are the only primary interactions. All other pages (docs, specs, RFCs) are secondary navigation targets.
- At any point, the user should be able to identify which of the two actions they are performing. The UI must not blend or confuse the two paths.
- The two actions are structurally identical in their information architecture: select file → hash locally → compare/register.

### 2.2 Low Friction Without Manipulation

Friction is reduced by removing obstacles, not by dark patterns:

- The file selector should be the first and most prominent interactive element on create/verify pages.
- No interstitial pages, instructional overlays, or tooltip sequences before the primary action.
- The user should never have to "learn how to use" the tool before using it.
- Wallet connection gating applies only to the registration path. Verification requires no wallet.

### 2.3 Deterministic Feedback

All feedback must be deterministic and verifiable:

- **Hash output is shown in full** — no truncation without a copy-expand mechanism.
- **Transaction state transitions are shown explicitly** — the user always knows which phase they are in (hashing, checking, awaiting wallet, submitting, confirming, confirmed, error).
- **Error states are descriptive and actionable** — not "Something went wrong" but "Transaction reverted: hash was already registered by 0x...".
- **Loading indicators communicate what is happening** — not infinite spinners but phase-labeled progress.

### 2.4 Forgiveness, Not Guarding

The UI does not guard the user from their own actions with confirmation dialogs or second-guessing:

- A single deliberate action (click on "Select File") initiates a flow. No "Are you sure?" for starting.
- Destructive actions (cancelling a registration mid-flow) follow the user's intent without friction.
- The user can reload the page at any point without data corruption. State that can be preserved in the URL is preserved there.

---

## 3. Trust Philosophy

### 3.1 Visual Honesty

The UI must never visually overstate what the system provides:

- "Proof" is displayed with the contract address that authored it. A proof is always bound to its contract.
- Timestamps are displayed with their block number and finality status. No representation of "permanent" without qualification.
- Hash values are displayed in full hex. No abbreviated hashes that obscure the fingerprint.
- The "not proved" state is visually equal to the "proved" state — absence is information, not failure.

### 3.2 Transparency, Not Trust Theater

Trust theater is visual design that simulates security without providing it (padlock icons on unencrypted pages, green checkmarks from self-signed certs, "verified by" badges without independent verification):

- No security badges, "audited by" seals, or trust certificates that the user cannot independently verify.
- No green "secure" indicators that serve cosmetic purposes.
- The contract address is displayed verbatim. No branded shorthand that obscures the actual identifier.
- Verification results are binary: hash found (show record) or hash not found (show absent). No confidence scores or qualitative ratings.

### 3.3 Wallet Transparency

Wallet connection is a functional prerequisite for registration, not a visual authentication event:

- The wallet connect button is a plain action button, not a branded gateway. No splash screens, no success animations on connect.
- Transaction parameters are displayed as plain text (function signature, arguments, target address, estimated gas) for user review in their wallet. The frontend does not display a simplified or beautified version that could mask manipulation.
- Disconnection is one click. No "are you sure?" overlay for disconnecting.

---

## 4. Typography Philosophy

### 4.1 Font Selection

- **Primary typeface:** A single neutral sans-serif. Geist (the current choice) is appropriate — it is utilitarian, compact, and carries no brand personality.
- **Monospace:** Reserved exclusively for code, hashes, addresses, and cryptographic output. Using monospace outside these contexts is prohibited.
- **No display typefaces.** No variable fonts with optical size axes tuned for large display text. No headings that function as brand marks.

### 4.2 Typographic Hierarchy

The hierarchy must be minimal:

- **One weight per purpose.** Regular for body, medium/semibold for headings, bold for labels and data. No ultra-light, thin, or black weights.
- **One font size per level.** A single heading size, a single body size, a single label size. Variation is by weight and color, not by additional size increments.
- **No all-caps headings** except for technical labels (e.g., "REGISTRY ADDRESS" in small caps).
- **Line length** capped at approximately 70 characters per line for body text. Wider for data displays.

### 4.3 Reading Mode Orientation

Documentation content (specs, RFCs, architecture) uses a reading-mode layout:

- Single-column prose with comfortable leading (1.6–1.8 line height).
- Code blocks are full-width but within the column bounds.
- No sidebar navigation for reading content. Navigation is a top-level header element.
- Headings are numbered for unambiguous reference (consistent with the documentation convention in existing docs).

---

## 5. Motion Philosophy

### 5.1 Motion Restraint

Motion is a functional signal, not a decorative flourish:

- Transitions are limited to 150ms–200ms. No slow ambient animations.
- Page transitions are instant (static pages). No route transition animations.
- State changes (wallet connecting, transaction pending) use minimal, bounded feedback. No infinite looping animations except explicit progress indicators.
- Hover states are limited to cursor changes and subtle color shifts. No scale, translate, or filter hover effects on structural elements.

### 5.2 Prohibited Motion

- Entrance animations on page load (fade-in, slide-up, staggered reveals)
- Scroll-triggered animations (parallax, reveal on scroll, progress trackers)
- Background or decorative animations (particle systems, floating elements, breathing gradients)
- Celebration animations on proof registration (confetti, sparkles, success fireworks)
- Loading skeletons that animate with shimmer or wave effects

### 5.3 Permitted Motion

- Button hover: subtle background color change
- Progress indicator: determinate progress bar or bounded spinner during hashing
- Transaction confirmation: a single state transition (e.g., color change from pending to confirmed)
- Accordion/collapse: 200ms height transition for content reveal
- Modal overlay: 150ms opacity transition

---

## 6. Spacing Philosophy

### 6.1 Consistent Rhythm

Spacing follows a single linear scale:

| Token | Value | Usage |
|-------|-------|-------|
| xs | 4px | Inline icons, tight tag spacing |
| sm | 8px | Element internal padding (tight) |
| md | 16px | Default element padding, card padding |
| lg | 24px | Section internal spacing |
| xl | 40px | Between major sections |
| 2xl | 64px | Page-level section separation |

- No fractional values. No values outside this scale without documented justification.
- Vertical rhythm is consistent across pages. All pages share the same spacing scale for comparable elements.
- Horizontal padding is consistent within a page. Card padding matches section padding.

### 6.2 Whitespace as Content

Whitespace is part of the content, not empty space:

- Whitespace communicates hierarchy: more whitespace above a section than between its items.
- Whitespace communicates stability: elements do not feel crowded or "squeezed in."
- Whitespace communicates calm: generous margins around the content area suggest the page is not competing for attention.

---

## 7. Infrastructure Aesthetics

### 7.1 The "Utility Interface" Look

The UI should visually resemble a network configuration interface or a hardware control panel more than a consumer web app:

- Flat, matte surfaces. No glassmorphism, no neumorphism, no skeuomorphic elements.
- Borders are hairline (1px), not thick frames.
- Color is used to identify state, not to decorate. A green element means "active/confirmed," a red element means "error/rejected," a neutral element means "idle/pending."
- Dark mode is the default. Light mode is optional. Dark mode communicates "developer tool" rather than "consumer product."

### 7.2 Reading-Document Model

- Proof outputs (hashes, receipts, verification results) are displayed in a reading-document format — like a terminal output or a log file — not in a data-dashboard format.
- Copyable text is copyable with a visible copy button or select-to-copy. No hidden copy mechanisms.
- Long-form content (receipts, bundle manifests) is collapsible into sections, not hidden behind "show more" links.

### 7.3 Address and Hash Display

- Contract addresses are displayed in full, wrapped at a reasonable breakpoint (42 characters per line).
- Transaction hashes link to the block explorer but are also displayed in full.
- Shortened hashes (e.g., `0x8b6f...f54a1`) are used only when the full hash is available on interaction (copy, expand).
- The registry address is always visible on pages where it is relevant (proof pages, verification results).

---

## 8. Documentation Presentation Philosophy

### 8.1 Documentation as Primary Content

Documentation is a first-class navigation target, not a secondary footer link:

- Specs, RFCs, architecture docs, and security docs have dedicated top-level navigation entries.
- Documentation content is rendered in the application theme, not in a separate wiki or external docs site.
- Documents are versioned and linked to the repository commit. A "View on GitHub" link accompanies each document.

### 8.2 Reading-Optimized Presentation

- Documentation pages use a focused reading layout: centered single column, generous whitespace, minimal navigation chrome.
- Technical terms are linked to their specification documents.
- Protocol specifications are presented as numbered steps, not prose paragraphs.
- Diagrams are rendered as ASCII art (per the formal documentation standard), not images or Mermaid.

### 8.3 Governance Visibility

- Each document's governance metadata (classification, status, freeze level) is displayed at the top of the page.
- Ratified documents are visually distinct from drafts or proposals.
- Amendment history is visible and navigable.

---

## 9. Navigation Philosophy

### 9.1 Flat, Non-Hierarchical Navigation

OpenProof's information space is flat — two primary actions and a set of reference documents:

- **Top-level navigation (header):** Create Proof, Verify Proof, Docs
- **Secondary navigation (under Docs):** Spec, RFCs, Architecture, Security, Governance, GitHub
- **Footer navigation:** GitHub, Contract Address, License, Version

No sub-navigation, dropdown menus, or nested navigation structures. Every target is reachable in at most two clicks from any page.

### 9.2 Always-Available Core Actions

Create Proof and Verify Proof are always available from the header, regardless of which page the user is on. The user should never need to "go back to homepage" to start a core action.

### 9.3 No Breadcrumbs

Breadcrumbs are unnecessary in a flat navigation structure. The current page is indicated by the active header entry.

---

## 10. Accessibility Expectations

### 10.1 Standards Conformance

- WCAG 2.2 AA minimum. AAA where feasible without compromising the infrastructure aesthetic.
- Color contrast meets 4.5:1 for normal text and 3:1 for large text.
- All interactive elements are keyboard-navigable with visible focus indicators.

### 10.2 Functional Accessibility

- File selection must work through both click/drag-and-drop and keyboard-activated file input.
- Copy operations (hashing result, addresses, receipts) must be accessible through keyboard shortcuts (Ctrl+C) and visible copy buttons.
- Transaction states are communicated through text, not solely through color or icon changes. Screen readers must receive state transitions.
- Error messages are associated with their triggering elements via `aria-describedby` or equivalent.

### 10.3 Cognitive Accessibility

- Consistent layout across all pages. No page has a fundamentally different structure.
- No auto-playing content, no timed interactions, no transient messages that disappear before being read.
- Form labels are always visible (placeholder-as-label is prohibited).

---

## 11. Anti-Patterns to Avoid

### 11.1 DeFi Dashboard Aesthetics
- Token balance displays, portfolio visualizations, pool health gauges
- Animated charts, price candles, volume bars
- Liquidity pool metrics, APR/APY displays
- "Dashboard" as a page concept

### 11.2 Trading Terminal Aesthetics
- Order book displays, bid/ask spreads, trade history tables
- Green/red price movement flashes, ticker tape animations
- Leverage/slippage controls, stop-loss configurations
- Real-time price feeds of any kind

### 11.3 Gambling/Binary-Options Styling
- Countdown timers, "time remaining" urgency indicators
- "All-in" or "max" action buttons with high-contrast styling
- Slot-machine or wheel animations on result display
- Confetti, sparkles, or celebration animations on success

### 11.4 Startup SaaS Hype
- "Get Started Free" call-to-action buttons
- Pricing tiers, plan comparisons, upgrade prompts
- Onboarding tours, tutorial overlays, product walkthroughs
- Social proof ("Join thousands of users"), testimonials, trust badges
- Email capture forms, waitlist signups, newsletter CTAs

### 11.5 Excessive Gradients and Glows
- Full-gradient backgrounds (especially vibrant color transitions)
- Text shadows, glow effects on text or icons
- Neon effects, blur-based backgrounds, glass effects
- Animated gradients or color-cycling elements

### 11.6 Engagement Mechanics
- Streak tracking, "days active" counters
- Achievement badges, unlocked features
- "Share on social" prompts after proof registration
- "Invite a friend" or referral CTAs

### 11.7 Dopamine UX
- Success animations on every completed action
- Celebration modals that must be dismissed
- Positive reinforcement messages ("Great job! You proved a file!")
- Animations that trigger on basic interactions

### 11.8 Trust Theater
- "Secured by" badge without cryptographic meaning
- "Audited by" without a link to the audit report
- Verification checkmarks without independent verification path
- Padlock icons on non-security-related elements

### 11.9 "AI-Generated" Branding Language
- "Powered by AI" badges or references
- Animated AI avatars, orb animations, neural network visualizations
- Chat-style interfaces where none are needed
- "Intelligent," "smart," "AI-powered" descriptors for deterministic operations

### 11.10 Ecosystem-Marketing-First Identity
- "Built on Base" as the primary visual identity (it is a technical detail, not the brand)
- Ecosystem logos in the hero section
- "Part of the [ecosystem] family" language
- Competition metrics against other ecosystem projects

---

## 12. Exclusions Register

In addition to the anti-patterns above, the following UI elements and patterns are prohibited:

| Exclusion | Rationale |
|-----------|-----------|
| Toast notifications | Transient messages are inaccessible; use inline state display instead |
| Modal dialogs for non-critical information | Breaking the user's flow for non-actionable information is hostile |
| Infinite scroll or auto-loading content | The information space is bounded; paginate explicitly if needed |
| Video backgrounds or hero videos | Video is never infrastructure content |
| Animated logo or rotating mark | Logos do not move |
| Sound effects or audio feedback | Interruptive and low-information |
| Notification badges or counters | OpenProof is not a notification-generating system |
| "Dark mode" toggle as a hero feature | Dark mode is default; light mode is a secondary option in settings |

---

## 13. Implementation Priority

The following are the highest-priority changes to align the current frontend with this doctrine:

1. **Hero section restructure.** Replace the product-style hero ("Cryptographic proof for files, built on Base.") with a binary-action entry point: two large action cards (Create Proof / Verify Proof) above the fold, no decorative illustration card.
2. **Remove ecosystem-first branding.** "Built on Base Sepolia" is a technical detail displayed in the footer or technical notes area, not a hero badge.
3. **Flatten navigation.** Add Docs as a top-level header entry with a dropdown or stacked secondary nav for Spec, RFCs, Architecture, Security, Governance, GitHub.
4. **Restyle cards.** Remove the decorative demo card from the hero. All cards use hairline borders, no shadows deeper than surface depth.
5. **Remove engagement language.** "Five steps. No file upload." → "Register a file's cryptographic fingerprint on Base Sepolia." Prefer statement over instruction.
6. **Trim step visualizations.** The current 5-step "How It Works" section and the 5-step "Utility layer" section duplicate information. Consolidate into a single compact reference.
7. **Hash display consistency.** Never abbreviate hashes on proof pages without a copy-to-expand interaction.
8. **Footer integration.** Add documentation navigation, contract address binding, and license information to the footer.

---

## 14. Changelog

| Version | Date | Change | Author |
|---------|------|--------|--------|
| 001 | 2026-06-04 | Original ratification | UI Doctrine & Information Architect |
