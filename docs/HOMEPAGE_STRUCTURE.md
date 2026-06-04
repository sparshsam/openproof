# OpenProof Homepage Structure

**Classification:** Permanent homepage specification
**Scope:** OpenProof, all deployments and forks
**Authority:** Ecosystem governance standards — [ecosystem-standards](https://github.com/sparshsam/ecosystem-standards)
**Status:** Ratified — do not amend without governance review
**Parent documents:**
- [UI_DOCTRINE.md](UI_DOCTRINE.md) — visual philosophy, anti-patterns
- [INFORMATION_ARCHITECTURE.md](INFORMATION_ARCHITECTURE.md) §3.1 — homepage page architecture
- [INTERACTION_PRINCIPLES.md](INTERACTION_PRINCIPLES.md) — binary interaction model, action-card philosophy
- [VISUAL_RESTRAINTS.md](VISUAL_RESTRAINTS.md) — color, typography, spacing constraints

**Relationship to existing documents:** HOMEPAGE_STRUCTURE.md is a direct specification of the homepage layout within the framework defined by the other doctrine documents. It is the most concrete specification — it describes exactly one page, exactly one layout.

---

## 1. Homepage Identity

### 1.1 Purpose Statement

The OpenProof homepage is an entry point. It answers exactly three questions:

1. **What is this?** A tool that registers cryptographic fingerprints of files on a blockchain.
2. **What can I do here?** Create a proof or verify a proof.
3. **Where do I start?** Select a file to create, or select a file to verify.

The homepage does not sell, persuade, onboard, or explain beyond what is needed to answer these three questions. It is a utility threshold.

### 1.2 What the Homepage Is Not

- Not a landing page — there is no funnel, no conversion goal, no CTA hierarchy.
- Not a dashboard — there is no aggregate state, no user metrics, no activity feed.
- Not an about page — the system description is functional, not narrative.
- Not a marketing page — there is no brand story, no mission statement, no team section.
- Not a portal — there is no login, no signup, no email capture.

### 1.3 Emotional Direction

The homepage should feel like:

- **Infrastructure.** A tool that exists reliably and is available when needed.
- **Calm.** No urgency, no competition for attention, no sensory overload.
- **Deterministic.** What is presented is what the system does — no ambiguity, no aspirational language.
- **Immediately useful.** The primary action surfaces are visible and operable without reading.

The homepage should not feel like:

- A product launch page. (Excitement, anticipation, "wow" factor.)
- A corporate homepage. (Brand statement, about us, values.)
- A developer portal. (API keys, documentation-first, "for developers" framing.)
- A community hub. (Join us, follow us, stay updated.)

---

## 2. Layout Specification (Desktop)

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  HEADER: OpenProof  Create Proof  Verify Proof  Docs  [github]              │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────┐    │
│  │                                                                      │    │
│  │  ┌────────────────────────┐  ┌────────────────────────┐              │    │
│  │  │   Create Proof          │  │   Verify Proof          │             │    │
│  │  │                        │  │                        │             │    │
│  │  │  Register a file's     │  │  Check a file or       │             │    │
│  │  │  cryptographic finger- │  │  receipt against the   │             │    │
│  │  │  print on Base Sepolia.│  │  onchain registry.     │             │    │
│  │  │                        │  │                        │             │    │
│  │  │  [ Select File ]       │  │  [ Select File ]       │             │    │
│  │  │                        │  │  [ Import Receipt ]    │             │    │
│  │  └────────────────────────┘  └────────────────────────┘              │    │
│  │                                                                      │    │
│  │  ┌────────────────────────────────────────────────────────────┐     │    │
│  │  │  Registry: 0x60d3DD631E6e4F6D76f761689d6FA229945a874a      │     │    │
│  │  │  Network: Base Sepolia · Chain: 84532                       │     │    │
│  │  │  Contract: Immutable · Ownerless · No fees · No upgrades   │     │    │
│  │  └────────────────────────────────────────────────────────────┘     │    │
│  │                                                                      │    │
│  │  ┌────────────────────────────────────────────────────────────┐     │    │
│  │  │  System Overview                                             │     │    │
│  │  │                                                            │     │    │
│  │  │  OpenProof is a proof-of-existence infrastructure tool.     │     │    │
│  │  │  It registers a SHA-256 fingerprint of a file on Base       │     │    │
│  │  │  Sepolia. The file itself never leaves your browser.        │     │    │
│  │  │                                                            │     │    │
│  │  │  • No backend  • No database  • No accounts                 │     │    │
│  │  │  • Files never uploaded  • No tracking  • No telemetry      │     │    │
│  │  │                                                            │     │    │
│  │  │  Verification is independent of this frontend. Anyone       │     │    │
│  │  │  with the contract address can verify through any block     │     │    │
│  │  │  explorer or RPC client.                                    │     │    │
│  │  └────────────────────────────────────────────────────────────┘     │    │
│  │                                                                      │    │
│  │  ┌────────────────────────────────────────────────────────────┐     │    │
│  │  │  Documentation Links                                         │     │    │
│  │  │                                                            │     │    │
│  │  │  [Spec]  [Architecture]  [Security]  [Governance]           │     │    │
│  │  └────────────────────────────────────────────────────────────┘     │    │
│  │                                                                      │    │
│  └──────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
├──────────────────────────────────────────────────────────────────────────────┤
│  FOOTER: GitHub · Contract 0x60d3... · AGPL-3.0 · v0.x.y                   │
└──────────────────────────────────────────────────────────────────────────────┘
```

### 2.1 Section Descriptions

#### Section 1: Action Cards (Primary Zone)

- **Purpose:** Present the two core actions simultaneously, with equal visual weight.
- **Layout:** Two equal-width cards side by side.
- **Content per card:** Action label (large), description (one sentence), entry point(s) (buttons).
- **Behavior:** Clicking anywhere on a card navigates to the corresponding action page.
- **Constraints:** No visual priority between the two cards. No illustration, icon, or decorative element. No "featured" or "recommended" distinction.

#### Section 2: Registry Identity (Information Zone)

- **Purpose:** Establish the infrastructure identity — what contract, what chain, what properties.
- **Layout:** A single line or compact block below the action cards.
- **Content:** Contract address (full), network name, chain ID, key contract properties (immutable, ownerless, no fees, no upgrades).
- **Constraints:** This is the only place on the homepage where contract-specific information is displayed. No "View on BaseScan" link here — that belongs on action pages and proof pages.

#### Section 3: System Overview (Context Zone)

- **Purpose:** Provide enough context for a first-time visitor to understand what OpenProof is and is not.
- **Layout:** A single compact card or text block.
- **Content:** Two-sentence system identity + bullet properties + verification independence statement.
- **Constraints:** No more than 5 bullet points. No feature list. No step-by-step "how it works." No technical depth — that belongs in docs.

#### Section 4: Documentation Links (Reference Zone)

- **Purpose:** Provide navigation entry points for readers seeking deeper documentation.
- **Layout:** A single row of text links.
- **Content:** Links to Spec, Architecture, Security, Governance.
- **Constraints:** This is not a primary navigation zone. It exists to serve visitors who arrived expecting documentation. The header "Docs" entry serves the same purpose for returning visitors.

---

## 3. Section Order and Priority

### 3.1 Vertical Priority

The homepage sections are ordered by descending importance:

1. **Action Cards** — the functional purpose of the page. Must occupy the most prominent visual position (above the fold on desktop).
2. **Registry Identity** — the system's infrastructure anchor. Placed immediately below the action cards so the user can see "what powers this."
3. **System Overview** — explanatory context for first-time visitors. Below the identity information.
4. **Documentation Links** — secondary reference navigation. At the bottom of the content area.

No section may be omitted. No section may be visually elevated above its priority rank. The action cards must always be the dominant visual element.

### 3.2 Above-the-Fold Requirement

On a 1920×1080 display (the reference viewport), the following must be visible without scrolling:

- Header (all entries)
- Both action cards (full height)
- Registry identity (at minimum, partially visible at the bottom of the fold)

The system overview section may fall below the fold. This is acceptable — returning users do not need to re-read the system description. First-time visitors will scroll.

---

## 4. Mobile Layout Specification (<640px)

```
┌──────────────────────────┐
│  HEADER: [≡]  OpenProof  │
├──────────────────────────┤
│                          │
│  ┌──────────────────┐   │
│  │  Create Proof     │   │
│  │                   │   │
│  │  Register a       │   │
│  │  file's crypto    │   │
│  │  fingerprint on   │   │
│  │  Base Sepolia.    │   │
│  │                   │   │
│  │  [ Select File ]  │   │
│  └──────────────────┘   │
│                          │
│  ┌──────────────────┐   │
│  │  Verify Proof     │   │
│  │                   │   │
│  │  Check a file or  │   │
│  │  receipt against  │   │
│  │  the onchain      │   │
│  │  registry.        │   │
│  │                   │   │
│  │  [ Select File ]  │   │
│  │  [ Import Receipt]│   │
│  └──────────────────┘   │
│                          │
│  Registry: 0x60d3...    │
│  Base Sepolia · 84532   │
│                          │
│  ┌──────────────────┐   │
│  │  System Overview  │   │
│  │  ...              │   │
│  └──────────────────┘   │
│                          │
│  Doc Links               │
│                          │
├──────────────────────────┤
│  FOOTER                  │
└──────────────────────────┘
```

**Mobile-specific rules:**
- Action cards stack vertically.
- Action cards are full-width, minimum touch-target height 120px.
- Registry identity collapses to a single compact line showing abbreviated contract address, network, and chain ID.
- System overview text may be further compressed but must retain all key information points.
- Documentation links are inline text, not a card.

---

## 5. Elements Excluded from the Homepage

The following elements must not appear on the homepage under any condition:

| Element | Reasoning |
|---------|-----------|
| Hero illustration or image | Per UI_DOCTRINE §1: no background imagery, no decorative graphics |
| Animated background or gradient | Per VISUAL_RESTRAINTS §1.2: single flat background color |
| "Built on Base" badge or logo | Ecosystem branding is secondary; Base Sepolia is a technical detail in the registry identity section |
| Wallet connect button | Per INTERACTION_PRINCIPLES §5.1: wallet connection appears only when needed on /create |
| Step-by-step walkthrough | The system is two actions, not five steps. Step visualization belongs on /create and /verify pages |
| "How it works" section | Redundant with the system overview; the action cards themselves communicate "how it works" |
| Feature grid / feature list | The system overview card covers all key properties in a single compact block |
| Testimonials, social proof, user counts | Per NON_GOALS §3, §5: no social features, no growth metrics |
| Email capture or newsletter signup | Per NON_GOALS §5: no email collection |
| Changelog or version history | Belongs in the footer |
| Blog or news feed | Per NON_GOALS §5: no blog content |
| Status indicators | There is no service to report status for |
| Search bar | There is nothing to search across |
| Language selector | There is one language |
| Theme toggle | Dark mode is the default; light mode is a secondary option |
| Cookie consent banner | OpenProof does not set tracking cookies; no consent is needed |
| "Get started" button | The action cards are the "get started" mechanism — a separate CTA would imply a funnel |

---

## 6. Responsive Behavior Rules

### 6.1 Breakpoints

| Breakpoint | Layout | Changes from Desktop |
|------------|--------|---------------------|
| ≥1024px | Two-column action cards | Full desktop layout |
| 640–1023px | Single-column action cards | Action cards stack vertically; content remains readable at same sizes |
| <640px | Single-column, compact | Action labels may reduce by one size; descriptions compress to fit; entry buttons remain tappable |

### 6.2 Content Adaptations

| Element | Desktop (≥1024px) | Tablet (640–1023px) | Mobile (<640px) |
|---------|-------------------|---------------------|-----------------|
| Action cards | Side by side, ~400px each | Stacked, full-width | Stacked, full-width, text compressed |
| Registry identity | Three-line block | Two-line block | Single-line compact |
| System overview | Full text | Full text | Compressed text |
| Documentation links | Horizontal row | Horizontal row (wrap) | Vertical list |

### 6.3 Visual Weight Preservation

At all breakpoints, the action cards must occupy at least 50% of the viewport height before scrolling. No other section should visually compete with them.

---

## 7. Interaction Behavior

### 7.1 Initial Page Load

- No loading screen. The homepage is a static page with no dynamic content.
- No animations on load. Content appears as rendered HTML.
- No late-loading images or fonts.
- The wallet connection status is not checked on page load. No RPC calls are made.

### 7.2 Card Interaction

- Clicking the **Create Proof** card navigates to `/create`.
- Clicking the **Verify Proof** card navigates to `/verify`.
- The "Select File" button inside the Create Proof card navigates to `/create` — the file selection happens on the create page, not on the homepage.
- Both cards have identical hover and active states.

### 7.3 Link Behavior

- Documentation links navigate within the same tab. The user is not sent to an external page.
- The GitHub link in the header opens in a new tab.
- All internal navigation is instant (static pages, no JS router delay).

---

## 8. Content Specification

### 8.1 Action Card: Create Proof

| Element | Content | Constraints |
|---------|---------|-------------|
| Label | "Create Proof" | Large heading weight. Not "Create" alone. Not "New Proof." Not "Register." |
| Description | "Register a file's cryptographic fingerprint on Base Sepolia." | One sentence. Declarative, not imperative. "Register," not "Timestamp." Not "Prove your file existed." |
| Entry button | [ Select File ] | Navigates to `/create`. Identical button styling to Verify's "Select File." |
| Context note | "No wallet connection required until registration." | Optional — shown only if space permits. Prevents surprise wallet requirement. |

### 8.2 Action Card: Verify Proof

| Element | Content | Constraints |
|---------|---------|-------------|
| Label | "Verify Proof" | Large heading weight. Not "Verify" alone. Not "Check Proof." |
| Description | "Check a file or receipt against the onchain registry." | One sentence. Declarative. "Check" not "Confirm." Not "Prove your proof is real." |
| Entry button | [ Select File ] | Navigates to `/verify`. Identical button styling to Create's "Select File." |
| Secondary entry | [ Import Receipt ] | Smaller text link below the primary button. Navigates to `/verify` in receipt-import mode. |

### 8.3 Registry Identity Block

| Element | Content | Notes |
|---------|---------|-------|
| Contract address | `0x60d3DD631E6e4F6D76f761689d6FA229945a874a` | Displayed in full on desktop. On mobile, abbreviated: `0x60d3...4a`. |
| Network | "Base Sepolia" | Chain name only. No "powered by," no chain description. |
| Chain ID | "84532" | Parenthetical. |
| Properties | "Immutable · Ownerless · No fees · No upgrades" | Dot-separated list. Fixed text — matches contract invariants II-1 and II-4. |

### 8.4 System Overview Text

```
OpenProof is a proof-of-existence infrastructure tool. It registers a SHA-256
fingerprint of a file on Base Sepolia. The file itself never leaves your browser.

• No backend  • No database  • No accounts
• Files never uploaded  • No tracking  • No telemetry

Verification is independent of this frontend. Anyone with the contract address
can verify through any block explorer or RPC client.
```

This is the canonical text. It must not be expanded, rephrased as marketing copy, or supplemented with additional claims. It may be abbreviated on mobile to fit viewport constraints, but no new claims may be introduced.

### 8.5 Documentation Links

- [Spec] → `/docs/spec`
- [Architecture] → `/docs/architecture`
- [Security] → `/docs/security`
- [Governance] → `/docs/governance`

All links are the same visual weight. No "Read the docs" CTA — the links are presented as what they are.

---

## 9. Homepage Anti-Patterns

The following patterns are explicitly prohibited on the homepage:

| # | Anti-Pattern | Why | Proposed Alternative |
|---|-------------|-----|---------------------|
| 1 | Hero section with tagline, subtitle, and illustration | Product landing page structure. Communicates "startup" not "infrastructure." | Replace with dual action cards. The tagline is the action cards themselves. |
| 2 | "Built on Base" as primary visual identity | Ecosystem-first branding. Subordinates tool identity to chain identity. | Move chain reference to registry identity block as technical detail. |
| 3 | "Get Started" link or button | Implies an onboarding sequence before core actions. | The action cards ARE "get started." No separate CTA. |
| 4 | Step-by-step "How It Works" section with 5 numbered steps | Redundant. The action cards communicate "how it works" directly. The system has 2 steps from the user's perspective, not 5. | If needed, a single system overview card with no step numbering. |
| 5 | Utility feature grid (5 columns of feature cards) | Product page pattern. Feature lists imply a competitive market position. | Replace with single system overview card. |
| 6 | Wallet connection prompt | Premature. The user may only want to verify or read docs. | Wallet connection appears only on /create after file selection. |
| 7 | "Why OpenProof" or "Why proof of existence" section | Assumes user needs persuasion. Infrastructure does not persuade. | The action cards communicate utility. If the user needs to understand, they read docs. |
| 8 | Security trust badges or padlocks | Trust theater. Security is cryptographic, not visual. | Contract immutability and verification independence are stated in the system overview. |
| 9 | "Latest proofs" feed or history preview | Social proof pattern. Proof activity is personal and private. | No proof history visible without wallet connection and explicit navigation to history. |
| 10 | Scroll-triggered animations or reveals | Decorative motion. Increases page load latency and cognitive load. | Static page. No JS-based scroll interactions. |

---

## 10. Future Considerations (Non-Binding)

The following may be considered for homepage evolution but are not currently required. None are design defects — they are alternative configurations that may be evaluated as user behavior data (anecdotal) accumulates.

| Option | Description | When to Consider |
|--------|-------------|------------------|
| Single action card homepage | If 90%+ of visits are to `/create` or `/verify` directly (bypassed), the homepage could simplify further | After analytics (if consent-gated) show navigation patterns |
| URL-embedded action selection | `/create` and `/verify` could serve as standalone entry points with no homepage visit needed | This is already supported. The homepage is a reference point |
| Documentation-only mode | A stripped-down homepage that emphasizes docs over actions for technical reference visitors | If documentation traffic exceeds action traffic significantly |

None of these should be implemented without governance review and alignment with the parent doctrine documents.

---

## 11. Verification Checklist

Use the following checklist to verify that any homepage implementation conforms to this specification:

- [ ] Both action cards are present and visually equal in size, weight, and position
- [ ] No action card has priority treatment (color, size, animation, label emphasis)
- [ ] The header contains exactly: OpenProof, Create Proof, Verify Proof, Docs, GitHub
- [ ] The registry identity block displays the full contract address and network
- [ ] The system overview uses the canonical text
- [ ] Documentation links are present: Spec, Architecture, Security, Governance
- [ ] No wallet connection UI appears on the homepage
- [ ] No ecosystem badges, partner logos, or "powered by" indicators appear
- [ ] No illustration, animation, or background pattern appears
- [ ] No testimonials, social proof, user counts, or "join us" calls appear
- [ ] No step-by-step visualizations or "how it works" sections appear
- [ ] No email capture, newsletter signup, or "stay updated" prompts appear
- [ ] No trust theater (badges, seals, padlocks, "secured by") appears
- [ ] No breadcrumbs, sub-navigation, or non-standard navigation elements
- [ ] Footer contains: GitHub link, contract address, license, version
- [ ] Mobile breakpoints maintain the same content and priority order
- [ ] All internal links navigate within the same tab
- [ ] The page loads as static HTML with no dynamic or streaming content

---

## 12. Changelog

| Version | Date | Change | Author |
|---------|------|--------|--------|
| 001 | 2026-06-04 | Original ratification | UI Doctrine & Information Architect |
