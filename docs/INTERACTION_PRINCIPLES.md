# OpenProof Interaction Principles

**Classification:** Permanent interaction documentation
**Scope:** OpenProof, all deployments and forks
**Authority:** Ecosystem governance standards — [ecosystem-standards](https://github.com/sparshsam/ecosystem-standards)
**Status:** Ratified — do not amend without governance review
**Parent doctrines:**
- [UI_DOCTRINE.md](UI_DOCTRINE.md) §2 (Interaction Philosophy), §3 (Trust Philosophy)
- [INFORMATION_ARCHITECTURE.md](INFORMATION_ARCHITECTURE.md) — page structure and navigation
- [VERIFICATION_LIFECYCLE.md](VERIFICATION_LIFECYCLE.md) — state machine definitions

**Relationship to existing documents:** INTERACTION_PRINCIPLES.md defines the user-facing interaction models — how the user moves through the system. VERIFICATION_LIFECYCLE.md defines the internal state machines. These documents are complementary: interaction principles describe the user's experience of the state machine.

---

## 1. Binary Interaction Model

### 1.1 Two Actions: Create and Verify

OpenProof has exactly two primary user-facing actions. This is not an abstraction — it is the interaction architecture.

```
┌────────────────────────────────────────────────────────────┐
│                      OpenProof                              │
│                                                             │
│  ┌────────────────────┐    ┌────────────────────┐          │
│  │   Create Proof      │    │   Verify Proof     │          │
│  │                     │    │                    │          │
│  │  File → Hash →      │    │  File/Receipt →    │          │
│  │  Register onchain   │    │  Hash → Compare    │          │
│  └────────────────────┘    └────────────────────┘          │
│                                                             │
│  Everything else is documentation or reference.             │
└────────────────────────────────────────────────────────────┘
```

At every level of UI design, the user must be able to answer two questions:
1. "Am I creating a proof or verifying one?"
2. "What is the next step in this action?"

### 1.2 Action-Exclusive Design

- A page is either a Create page or a Verify page. No page serves both purposes.
- The two actions are never visually blended. Different pages, different paths, different interaction surfaces.
- Navigation between the two actions is available through the header, not through in-page cross-linking that suggests a shared workflow.
- The user should not need to re-read the page to determine which action they are performing. The page title and primary interaction surface make it unambiguous.

### 1.3 No Tertiary Actions

The following are explicitly **not** primary actions and must not be presented as such:

- "View proof" (a sub-action of Verification — triggered by exploring a verification result or by following a shared URL)
- "Download receipt" (a sub-action of Create — triggered at the end of the registration flow)
- "Import receipt" (a sub-action of Verification — an alternative input method for the same action)
- "Browse history" (a local convenience feature, not a system action)

These are interface elements within the two primary action pages, not standalone navigation targets.

---

## 2. Action-Card Philosophy

### 2.1 Large Functional Surfaces

The two primary actions are presented as large, equal-sized surfaces — action cards — not as buttons, links, or list items:

| Property | Action Card | Traditional Button | SaaS Landing Page CTA |
|----------|-------------|-------------------|-----------------------|
| Size | Minimum 300×200px | ~120×40px | Variable |
| Content | Title + description + action entry point | Single label | Title + subtitle + icon |
| Cognitive weight | Equal — neither prioritized | Different — one is "primary" | One is "hero" |
| Information density | Sufficient to identify the action | Minimal | Marketing copy |

### 2.2 Action Card Anatomy

```
┌─────────────────────────────────────┐
│                                     │
│  Create Proof                       │ ← Action label (large, bold)
│                                     │
│  Register a file's cryptographic    │ ← Action description (single line, clear)
│  fingerprint on Base Sepolia.       │
│                                     │
│  ┌───────────────────────────────┐  │
│  │ [ Select File ]               │  │ ← First action step (entry point)
│  └───────────────────────────────┘  │
│                                     │
│  No wallet connection required      │ ← Context note (if applicable)
│  until registration.                │
│                                     │
└─────────────────────────────────────┘
```

**Rules:**
- Both action cards are identical in size, layout, and visual weight.
- The action label is the largest text in the card.
- The description is a single declarative sentence — not a value proposition.
- The entry point is a single button — the first step of the action.
- Context notes provide functional boundary information, not marketing framing.

### 2.3 Action Card Behavior

- Clicking the "Select File" button on the Create card navigates to `/create`.
- Clicking anywhere else on the Create card also navigates to `/create`.
- Both cards are clickable as a whole. The entry-point button is a secondary, visual signal.
- Hover state: subtle background lightening or border emphasis. No scale or translate.
- Active state: standard click feedback (momentary darkening).

---

## 3. Decision-Surface Simplicity

### 3.1 Single Decision Per Interaction

Each interaction surface presents exactly one decision to the user:

| Page | Decision | Options |
|------|----------|---------|
| Homepage | What action to perform? | Create Proof, Verify Proof, or read docs |
| Create | Which file to register? | Select file(s) |
| Verify | Which verification method? | Select file or import receipt |
| Docs | Which document to read? | Spec, RFCs, Architecture, Security, Governance |

No interaction surface presents more than 3 meaningful options. If more than 3 options exist, they are grouped into categories with a second-level decision.

### 3.2 The Three-Click Rule

Any primary action (Create or Verify) must be completable within three clicks from the homepage:

```
Homepage (1 click: Create card)
  → /create (1 click: Select File)
    → File selected → flow auto-progresses (0 additional clicks for hashing)
      → (optional: 1 click: Register Proof if wallet already connected)
```

```
Homepage (1 click: Verify card)
  → /verify (1 click: Select File or Import Receipt)
    → File/receipt selected → flow auto-progresses (0 additional clicks for hashing)
      → Result displayed (click to explore: View on BaseScan)
```

Three clicks is the maximum. The system does not introduce interstitial pages, confirmation dialogs, or onboarding progress steps between the user's intent and the action result.

### 3.3 No Forced Linear Sequences

The user may enter any page directly via URL:

- `/create` — bypasses homepage entirely. The create action card's content is presented as the page itself.
- `/verify` — same. The verify action card's content becomes the page.
- `/proof/[hash]` — goes directly to a proof page without passing through verify.

No interaction surface should assume the user arrived from the homepage or follows a prescribed journey.

---

## 4. Low-Friction Interaction Hierarchy

### 4.1 Action Progression

The user's progression through an action follows a natural, self-revealing hierarchy:

```
Step 1: Select input (file or receipt)
   → The most important action. The largest interactive element on the page.
   → Always visible, never hidden behind another action.

Step 2: Wait for automatic processing (hashing, schema validation)
   → No user action required. Progress is communicated as phase text.
   → The user can read the hash output while waiting.

Step 3: Confirm intent (if registration)
   → Only appears after Step 2 completes successfully.
   → The "Register Proof" button replaces the file selector area or appears below it.

Step 4: Wait for external system (wallet, transaction)
   → Feedback is phase-labeled. No "please wait" without context.

Step 5: Receive result
   → The result is the final state. No celebration, no "share this" prompt.
   → The user can copy, download, or navigate to another action.
```

### 4.2 Action Visibility Principle

All available actions for the current context are visible at all times. No actions are hidden behind hover states, right-click menus, or "more" overflow buttons.

| Context | Visible Actions |
|---------|-----------------|
| Hash output | Copy hash, Register (if wallet connected), Clear/Start over |
| Verification result | Copy hash, View on BaseScan, Verify another file, Import receipt |
| Proof page | View on BaseScan, Download receipt, Verify this proof |
| Receipt after registration | Download receipt, View on BaseScan, Create another proof |

### 4.3 State Mirroring

The UI surface mirrors the underlying state machine (defined in [VERIFICATION_LIFECYCLE.md](VERIFICATION_LIFECYCLE.md) §3). Each state machine state has a corresponding UI state that is:

- **Visually distinct** from other states (text label, color change)
- **Stable** — the UI stays in that state until a transition occurs
- **Deterministic** — the same state always produces the same UI

State machine states map to interaction states:

| State Machine | Interaction State | UI Signal |
|---------------|------------------|-----------|
| IDLE | Awaiting input | File drop zone visible |
| HASHING | Processing | "Hashing..." phase label |
| HASH_READY | Hash complete | Full hash displayed + next action button |
| AWAITING_WALLET | Waiting for user in wallet | "Approve transaction in your wallet" |
| SUBMITTED | Transaction broadcast | "Transaction submitted — waiting for confirmation" |
| CONFIRMED | Registration confirmed | "Proof registered" + onchain record display |
| ERROR | Error state | Error description + recovery action |

---

## 5. Wallet Interaction Model

### 5.1 Wallet Connection: Progressive Disclosure

Wallet connection follows the principle of progressive disclosure — it is revealed only when it is needed:

- **On the homepage:** No wallet UI. No "Connect Wallet" button. The user is not prompted to connect for the homepage.
- **On `/create`:** A "Connect Wallet" button appears **after** the user has selected a file and the hash is computed. The user's first interaction is with the file system, not their wallet.
- **On `/verify`:** No wallet UI. Verification is read-only and does not require a wallet.
- **On `/proof/[hash]`:** No wallet UI.
- **On `/docs/*`:** No wallet UI.

### 5.2 Wallet Interaction Surface

When wallet connection is needed:

```
┌──────────────────────────────────────────────────────────────┐
│  Wallet Connection Required                                   │
│                                                               │
│  Registration requires a wallet on Base Sepolia (chain ID     │
│  84532) to submit the registerProof(bytes32) transaction.     │
│                                                               │
│  [ Connect Wallet ]                                           │
│                                                               │
│  Hash: 0x...full hash...                                      │
│  Contract: 0x60d3DD631E6e4F6D76f761689d6FA229945a874a       │
│  Action: registerProof(bytes32)                               │
└──────────────────────────────────────────────────────────────┘
```

**Rules:**
- The wallet connect button is a standard button — no special styling, no animation, no emphasis.
- The transaction parameters (contract, function, hash) are displayed above or beside the connect button so the user can review them.
- The user is told what they are signing and why, in plain language.
- No branded wallet selector list before the button. RainbowKit's injected wallet detection handles this in the background.

### 5.3 Transaction Feedback

Once the wallet prompt is open:

- The UI enters "Awaiting wallet" state with the phase label: "Review and approve the transaction in your wallet."
- If the user rejects: transition to error state with "Transaction rejected by user. [Try again]"
- If the user approves: transition to "Submitted" state with the transaction hash.
- If the wallet disconnects mid-flow (timeout, network switch): error state with "Wallet disconnected. [Reconnect]"

No polling for wallet state. No auto-retry on rejection. The user controls wallet interaction entirely.

---

## 6. Error Interaction Pattern

### 6.1 Error Display

All errors follow a consistent pattern:

```
┌──────────────────────────────────────────────────────────────┐
│  [Error indicator icon]  [Error type label]                   │
│                                                               │
│  [Clear, specific description of what happened]                │
│  [Why it happened, in plain language]                          │
│  [What the user can do about it]                              │
│                                                               │
│  [Recovery action button]   [Optional: technical detail]      │
└──────────────────────────────────────────────────────────────┘
```

### 6.2 Error Types and Responses

| Error | Display | Recovery Action |
|-------|---------|-----------------|
| File too large | "File exceeds the maximum supported size." | [Select a different file] |
| Hash already registered | "This file's fingerprint is already registered." | [View proof] [Verify] |
| Wallet rejected | "Transaction was rejected in your wallet." | [Try again] |
| Transaction reverted | "Transaction reverted on Base Sepolia." | [Show revert reason] [Try again] |
| Network mismatch | "Your wallet is on the wrong network." | [Switch to Base Sepolia] |
| RPC error | "Could not reach the Base Sepolia registry." | [Retry] [Use BasScan directly] |
| Invalid receipt | "Receipt JSON is invalid or from an unrecognized schema." | [List validation errors] |

### 6.3 Error Philosophy

- **No generic errors.** Every error state includes a specific description of what went wrong.
- **No error codes without explanation.** An error number is never the primary error message.
- **No destructive silence.** If a transaction fails, the user is notified. No silent retry loops.
- **Error recovery is part of the flow.** The user is never dropped back to "start over" without context.
- **Errors are not failures.** An unregistered hash is information, not an error. A duplicate registration is a redirect, not a crash.

---

## 7. Non-Interactive Feedback

### 7.1 What Does Not Require User Interaction

The following happen automatically, without user action:

- File hashing begins immediately upon file selection
- Preflight duplicate check begins immediately upon hash completion
- Verification begins immediately upon file/receipt selection
- Transaction confirmation monitoring begins immediately upon submission

The user does not click "Start Hashing" or "Begin Verification." The system progresses as far as it can without user action.

### 7.2 What Requires Deliberate User Action

| Action | When it appears | Why it requires action |
|--------|----------------|------------------------|
| Connect Wallet | After hash + preflight check (create page only) | User must authorize wallet connection |
| Register Proof | After wallet is connected and hash is ready | User must approve the transaction |
| Download Receipt | After transaction is confirmed | User chooses whether to download |
| Copy Hash | Always available when hash is displayed | User chooses when to copy |

---

## 8. Documentation Interaction Model

### 8.1 Reading Mode

Documentation pages use a reading-optimized interaction model:

- **No interactive elements** beyond links, copy buttons for code blocks, and the secondary navigation.
- **No collapsible sections** that hide content by default. Documents are read from top to bottom.
- **No inline code execution** or "try it" buttons. Documentation is reference material.
- **No comment or feedback sections.** Documentation has one author and requires governance review to amend.

### 8.2 Document-to-Action Linking

When a documentation page references a system action (e.g., "To verify an import receipt, see `/verify`"), the reference is a direct link to the action page. The user does not navigate back to the homepage to find the action.

---

## 9. Interaction Anti-Patterns

| Anti-Pattern | Why | Example |
|--------------|-----|---------|
| "Get Started" as a CTA | Implies onboarding sequence | Button that leads to a multi-step wizard before the actual action |
| Interstitial onboarding | User must learn before doing | "First, let's set up your wallet" page |
| Confirmation on every action | Assumes user error | "Are you sure you want to register this proof?" |
| "Success" modal after completion | Implies celebration | "Congratulations! Your proof is registered!" modal requiring dismissal |
| Countdown or progress race | Creates urgency | "Register within 5 minutes or your hash expires" |
| Undo button for irreversible actions | Creates false expectation | "Undo" on a submitted transaction |
| Loading states that don't describe the phase | No user context | Generic spinner without "Hashing file..." label |
| Auto-dismissing messages | Inaccessible, user may miss information | Toast that disappears after 3 seconds |
| "Next" button progression | Implies linear wizard | Page-based flow that forces a prescribed sequence |
| "Skip" links on non-linear flows | Implies optional content the user should not skip | "Skip tutorial" on a two-action tool |

---

## 10. Interaction Principle Register

| # | Principle | Domain | Description |
|---|-----------|--------|-------------|
| IP-1 | Binary polarity | Interaction model | Exactly two primary actions: Create and Verify. They are never blended. |
| IP-2 | Equal action weight | Visual interaction | Create and Verify are always presented with identical visual weight. |
| IP-3 | Single decision per surface | Cognitive load | Each page presents exactly one decision to the user. |
| IP-4 | Three-click maximum | Efficiency | Any primary action completes in ≤3 clicks from the homepage. |
| IP-5 | Progressive wallet disclosure | Trust | Wallet connection is revealed only when needed for registration. |
| IP-6 | Self-revealing progression | Flow | The next action step becomes visible only when the current step enables it. |
| IP-7 | Automatic processing for deterministic steps | Efficiency | Hashing, schema validation, and duplicate checks begin automatically. |
| IP-8 | State mirroring | Transparency | Every state machine state has a corresponding UI state with text label. |
| IP-9 | Specific error recovery | Resilience | Every error includes description, cause, and recovery action. |
| IP-10 | Direct URL entry | Portability | Every page is reachable by direct URL. No assumptions about user journey. |
| IP-11 | No forced linearity | Autonomy | The user can navigate freely between all pages without losing context. |
| IP-12 | Documentation as second-class surface | Priority | Documentation is accessible but not visually prioritized over the two core actions. |

---

## 11. Changelog

| Version | Date | Change | Author |
|---------|------|--------|--------|
| 001 | 2026-06-04 | Original ratification | UI Doctrine & Information Architect |
