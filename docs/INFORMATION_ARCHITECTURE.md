# OpenProof Information Architecture

**Classification:** Permanent information architecture documentation
**Scope:** OpenProof, all deployments and forks
**Authority:** Ecosystem governance standards — [ecosystem-standards](https://github.com/sparshsam/ecosystem-standards)
**Status:** Ratified — do not amend without governance review
**Parent documents:** [UI_DOCTRINE.md](UI_DOCTRINE.md) — visual and interaction rules governing the surface that this IA shapes

**Relationship to existing documents:** INFORMATION_ARCHITECTURE.md defines the structural navigation of the frontend. It does not prescribe visual styling (see UI_DOCTRINE.md) or functional behavior (see ARCHITECTURE.md). The IA is the map; other documents govern the territory.

---

## 1. Page Inventory and Structure

OpenProof has exactly 10 top-level surfaces:

| # | Path | Page | Primary Function | Wallet Required |
|---|------|------|------------------|-----------------|
| 1 | `/` | Homepage | Binary action entry point + system summary | No |
| 2 | `/create` | Create Proof | Hash file, register onchain, download receipt | Yes (for registration step) |
| 3 | `/verify` | Verify Proof | Hash file or import receipt, compare against onchain state | No |
| 4 | `/proof/[hash]` | Proof Page | Public, read-only display of an onchain proof record | No |
| 5 | `/docs` | Documentation Hub | Index of all governance and specification documents | No |
| 6 | `/docs/spec` | Specification | Canonical proof receipt specification | No |
| 7 | `/docs/rfcs` | RFCs | Request-for-comment proposals | No |
| 8 | `/docs/architecture` | Architecture | System architecture, components, data flow | No |
| 9 | `/docs/security` | Security | Trust model, threat analysis, security principles | No |
| 10 | `/docs/governance` | Governance | Doctrine hierarchy, amendment process, freeze register | No |

**Additional functional surfaces (not full pages):**
- Footer: GitHub link, contract address, license, version
- URL-linked proof pages (`/proof/[hash]`) are shareable, read-only views

### 1.1 Page Count Rationale

Ten pages is the maximum. Adding a new top-level page requires governance review. The system performs two primary actions and provides reference documentation — neither domain justifies more pages.

---

## 2. Navigation Architecture

### 2.1 Header Navigation (Persistent Across All Pages)

```
┌─────────────────────────────────────────────────────────────────────────┐
│  OpenProof           Create Proof   Verify Proof   Docs         [github]│
│  (home link)                                                                  │
└─────────────────────────────────────────────────────────────────────────┘
```

- **OpenProof** — links to `/` (homepage). Text only, no logo image.
- **Create Proof** — links to `/create`. Primary action 1. Always visible.
- **Verify Proof** — links to `/verify`. Primary action 2. Always visible.
- **Docs** — links to `/docs`. Secondary navigation hub. Active state indicates current page is within `/docs/*`.
- **GitHub** — external link to `https://github.com/sparshsam/openproof`. External link indicator (small arrow icon).

### 2.2 Docs Sub-Navigation (On `/docs` and `/docs/*` Pages)

When on a Docs page, a left or top secondary navigation appears:

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Docs                                                                    │
│                                                                          │
│  Spec · RFCs · Architecture · Security · Governance · GitHub            │
└─────────────────────────────────────────────────────────────────────────┘
```

All entries are sibling-level. No hierarchy beyond this flat structure. The current page is indicated by active styling.

Navigation items and their targets:

| Nav Entry | Path | Content |
|-----------|------|---------|
| Spec | `/docs/spec` | [receipt-specification.md](/docs/spec/receipt-specification.md) |
| RFCs | `/docs/rfcs` | Index of RFC documents |
| Architecture | `/docs/architecture` | [ARCHITECTURE.md](/docs/ARCHITECTURE.md) |
| Security | `/docs/security` | [security-principles.md](/docs/security-principles.md), [threat-model.md](/docs/threat-model.md) |
| Governance | `/docs/governance` | [SYSTEMS_DOCTRINE.md](/docs/SYSTEMS_DOCTRINE.md), [NON_GOALS.md](/docs/NON_GOALS.md), [TRUST_BOUNDARIES.md](/docs/TRUST_BOUNDARIES.md), [ARCHITECTURAL_INVARIANTS.md](/docs/ARCHITECTURAL_INVARIANTS.md), [DESIGN_RESTRAINTS.md](/docs/DESIGN_RESTRAINTS.md) |
| GitHub | `/docs/governance` (external) | Repository link with governance context |

### 2.3 Footer Navigation

```
┌─────────────────────────────────────────────────────────────────────────┐
│  GitHub  ·  Contract 0x60d3...  ·  License AGPL-3.0  ·  v0.x.y        │
│                                                                          │
│  OpenProof — cryptographic proof infrastructure                         │
└─────────────────────────────────────────────────────────────────────────┘
```

Footer is minimal: repository reference, contract address, license, current version. No social media links, email capture, or "about" page.

---

## 3. Page Architectures

### 3.1 Homepage (`/`)

**Purpose:** Binary action entry point. The user should be able to start either core action (Create or Verify) within 1 second of page load, with minimum cognitive overhead.

**Layout:**

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  HEADER: OpenProof  Create Proof  Verify Proof  Docs  [github]              │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌────────────────────────────┐  ┌────────────────────────────┐              │
│  │      Create Proof           │  │      Verify Proof          │              │
│  │                             │  │                             │              │
│  │  Register a file's          │  │  Check a file or receipt   │              │
│  │  cryptographic fingerprint  │  │  against the onchain       │              │
│  │  on Base Sepolia.           │  │  registry.                 │              │
│  │                             │  │                             │              │
│  │  [ Select File ]            │  │  [ Select File ]           │              │
│  │                             │  │  [ Import Receipt ]        │              │
│  └────────────────────────────┘  └────────────────────────────┘              │
│                                                                              │
│  Registry: 0x60d3DD631E6e4F6D76f761689d6FA229945a874a                       │
│  Network: Base Sepolia (chain ID 84532)                                      │
│  Contract: Immutable · No owner · No fees                                    │
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────────┐│
│  │  System Overview (compact)                                                ││
│  │                                                                           ││
│  │  • Files never leave your browser — hashing is local                      ││
│  │  • SHA-256 fingerprint registered onchain                                ││
│  │  • No backend, no database, no accounts                                   ││
│  │  • Verifiable independently via any block explorer                        ││
│  │                                                                           ││
│  │  [ View Docs ]  [ View Architecture ]                                     ││
│  └──────────────────────────────────────────────────────────────────────────┘│
│                                                                              │
├──────────────────────────────────────────────────────────────────────────────┤
│  FOOTER                                                                      │
└──────────────────────────────────────────────────────────────────────────────┘
```

**Rules:**
- The two action cards are the dominant visual element. Everything else is secondary.
- No hero illustration, no step visualization, no feature list above the action cards.
- The system overview is a single compact card below the action cards.
- The registry address and contract properties are displayed between the action cards and the overview — they are infrastructure identity, not marketing.
- The action cards are structurally identical: same size, same layout, same interaction pattern. The user chooses by reading the label, not by scanning for a visually prioritized option.

### 3.2 Create Proof (`/create`)

**Purpose:** Hash a file and register its fingerprint on the blockchain. The only page that requires a wallet connection.

**Layout:**

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  HEADER                                                                      │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Create Proof                                                                │
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────────┐│
│  │  [ Drop file here or click to select ]                                    ││
│  │  (Supports multiple files for bundle proof)                               ││
│  └──────────────────────────────────────────────────────────────────────────┘│
│                                                                              │
│  ┌──────────────────┐  ┌────────────────────────────────────────────────────┐│
│  │  File Info        │  │  Hash Output                                       ││
│  │  name: ...        │  │  0x...full hash...                                 ││
│  │  size: ...        │  │  [ Copy ]                                          ││
│  │  type: ...        │  └────────────────────────────────────────────────────┘│
│  └──────────────────┘                                                        │
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────────┐│
│  │  Registration Flow                                                        ││
│  │                                                                           ││
│  │  Phase 1: File selected ✓                                                 ││
│  │  Phase 2: Hashed ✓                                                        ││
│  │  Phase 3: Preflight check [checking...]                                   ││
│  │  Phase 4: Wallet approval [pending]                                       ││
│  │  Phase 5: Transaction submitted [pending]                                 ││
│  │  Phase 6: Onchain confirmation [pending]                                  ││
│  │  Phase 7: Receipt download [pending]                                      ││
│  └──────────────────────────────────────────────────────────────────────────┘│
│                                                                              │
│  [ Connect Wallet ]  (shown only when wallet not connected)                  │
│  [ Register Proof ]  (active when wallet connected, file hashed, no dup)     │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

**Rules:**
- The file drop zone is the primary interaction surface. It is the first thing below the page title.
- The registration flow is a vertical timeline showing all 7 phases with current/next status.
- Wallet connection prompt appears inline when needed, not as a blocking modal.
- On completion, a receipt download prompt appears in the flow, not as a popup.
- The "Register Proof" button is the only action button in the registration flow. No secondary actions compete with it.

### 3.3 Verify Proof (`/verify`)

**Purpose:** Verify a file against the onchain registry, or import and validate a receipt.

**Layout:**

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  HEADER                                                                      │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Verify Proof                                                                │
│                                                                              │
│  ┌──────────────────────┐  ┌──────────────────────┐                          │
│  │  Verify a File        │  │  Import a Receipt    │                          │
│  │                       │  │                       │                          │
│  │  [ Select File ]      │  │  [ Select .json ]    │                          │
│  └──────────────────────┘  └──────────────────────┘                          │
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────────┐│
│  │  Result                                                                   ││
│  │                                                                           ││
│  │  Hash: 0x...full hash...                                                  ││
│  │                                                                           ││
│  │  ┌──────────────────────────────┐  OR  ┌──────────────────────────────┐  ││
│  │  │ FOUND on chain               │      │ NOT FOUND on chain           │  ││
│  │  │                              │      │                              │  ││
│  │  │ Creator: 0x...               │      │ This hash has not been       │  ││
│  │  │ Timestamp: 2026-06-04 12:34  │      │ registered on this registry. │  ││
│  │  │ Block: 12345678              │      │                              │  ││
│  │  │ Registry: 0x60d3...         │      │ If you registered this file, │  ││
│  │  │ [ View on BaseScan ]         │      │ verify the contract address  │  ││
│  │  └──────────────────────────────┘      │ and network.                  │  ││
│  │                                        └──────────────────────────────┘  ││
│  └──────────────────────────────────────────────────────────────────────────┘│
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

**Rules:**
- Two equal-sized cards at the top: Verify File and Import Receipt. The user selects their verification mode.
- No wallet connection required anywhere on this page.
- The result area is always visible — it starts as an "awaiting input" state and transitions to FOUND or NOT_FOUND.
- Both result states are displayed with the same layout weight. "Not found" is not a failure state; it is information.
- The contract address and verification path are always displayed alongside the result.

### 3.4 Proof Page (`/proof/[hash]`)

**Purpose:** A shareable, public, read-only page displaying a proof record.

**Layout:**

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  HEADER                                                                      │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Proof Record                                                                │
│                                                                              │
│  Hash: 0x...full hash...                                                     │
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────────┐│
│  │  Onchain Record                                                           ││
│  │                                                                           ││
│  │  Creator:     0x...wallet address...                                      ││
│  │  Timestamp:   2026-06-04 12:34:56 UTC  (Block #12345678)                 ││
│  │  Network:     Base Sepolia (chain ID 84532)                               ││
│  │  Registry:    0x60d3DD631E6e4F6D76f761689d6FA229945a874a                ││
│  │  Status:      Registered — immutable                                      ││
│  │                                                                           ││
│  │  [ View on BaseScan ]  [ Download Receipt ]                               ││
│  └──────────────────────────────────────────────────────────────────────────┘│
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────────┐│
│  │  Verify This Proof                                                        ││
│  │                                                                           ││
│  │  To verify that a file matches this proof:                                ││
│  │                                                                           ││
│  │  1. Compute sha256sum of the file                                         ││
│  │  2. Compare against the hash above                                        ││
│  │  3. Confirm the contract address matches                                  ││
│  │                                                                           ││
│  │  [ Verify a File ] → /verify                                              ││
│  └──────────────────────────────────────────────────────────────────────────┘│
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

**Rules:**
- No wallet connection required.
- The page is fully deterministic from the hash — a static page with an RPC query.
- The "Verify This Proof" section provides clear, language-independent instructions for off-frontend verification.
- If the hash does not exist onchain, the page displays a clear "no proof found" state with the hash displayed for reference.

### 3.5 Documentation Hub (`/docs`)

**Purpose:** Index of all governance and specification documents.

**Layout:**

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  HEADER                                                                      │
├──────────────────────────────────────────────────────────────────────────────┤
│  Secondary Nav: Spec · RFCs · Architecture · Security · Governance · GitHub │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Documentation                                                               │
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────────┐│
│  │  Specification                                                            ││
│  │  • Receipt Specification — canonical proof receipt format                ││
│  │  • Receipt JSON Schema (Draft 2020-12)                                   ││
│  │  • Test Vectors (23 deterministic vectors)                                ││
│  └──────────────────────────────────────────────────────────────────────────┘│
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────────┐│
│  │  Architecture                                                             ││
│  │  • ARCHITECTURE.md — system overview, components, boundaries              ││
│  │  • VERIFICATION_LIFECYCLE.md — registration and verification flows       ││
│  │  • DATA_FLOW.md — data transformations and network audit                  ││
│  └──────────────────────────────────────────────────────────────────────────┘│
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────────┐│
│  │  Security                                                                 ││
│  │  • TRUST_MODEL.md — trust boundaries and deterministic guarantees         ││
│  │  • TRUST_BOUNDARIES.md — trust perimeters and analysis                    ││
│  │  • FAILURE_MODES.md — failure classification and mitigations              ││
│  │  • security-principles.md — operational security guidelines               ││
│  │  • threat-model.md — threat analysis                                      ││
│  └──────────────────────────────────────────────────────────────────────────┘│
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────────┐│
│  │  Governance                                                               ││
│  │  • SYSTEMS_DOCTRINE.md — root doctrine, identity, scope                  ││
│  │  • NON_GOALS.md — permanent exclusion register                           ││
│  │  • DESIGN_RESTRAINTS.md — implementation constraints                     ││
│  │  • ARCHITECTURAL_INVARIANTS.md — enforceable rules                       ││
│  │  • UI_DOCTRINE.md — visual and interaction philosophy                    ││
│  │  • INFORMATION_ARCHITECTURE.md — this document                           ││
│  └──────────────────────────────────────────────────────────────────────────┘│
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────────┐│
│  │  RFCs                                                                     ││
│  │  • No RFCs currently ratified                                            ││
│  └──────────────────────────────────────────────────────────────────────────┘│
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

**Rules:**
- The documentation hub is a flat index of document cards grouped by category.
- Each card lists the documents in that category with a brief description.
- Governance documents show their classification and freeze level.
- The secondary nav is persistent when browsing any `/docs/*` page.

---

## 4. Interaction Flow Diagrams

### 4.1 User Decision Tree (Entry Point)

```
                    ┌─────────────────┐
                    │  Landing on      │
                    │  homepage        │
                    └────────┬────────┘
                             │
                  ┌──────────┴──────────┐
                  ▼                     ▼
         ┌──────────────┐     ┌──────────────┐
         │ Create Proof  │     │ Verify Proof │
         └──────┬───────┘     └──────┬───────┘
                │                     │
                ▼                     ├──────────────────┐
         ┌──────────────┐           ▼                  ▼
         │ Select file   │   ┌──────────────┐  ┌──────────────┐
         │ Hash locally  │   │ Select file  │  │ Import       │
         │ Connect       │   │ Hash locally │  │ receipt.json │
         │ wallet        │   │ Query chain  │  │ Validate     │
         │ Sign tx       │   │ Show result  │  │ Query chain  │
         │ Confirm       │   └──────────────┘  │ Show result  │
         │ Download      │                     └──────────────┘
         │ receipt       │
         └──────────────┘
```

### 4.2 Docs Browsing Flow

```
        ┌──────┐
        │ Docs │
        └──┬───┘
           │
           ▼
   ┌────────────────┐
   │ Documentation   │ ← Secondary nav always visible
   │ Hub (index)     │
   └───┬────┬────┬──┘
       │    │    │
       ▼    ▼    ▼
   ┌──────┐┌──────┐┌──────────┐
   │ Spec ││ Arch ││ Security │  ← Each links to its doc pages
   └──────┘└──────┘└──────────┘
```

---

## 5. URL Scheme

| Path | Purpose | Notes |
|------|---------|-------|
| `/` | Homepage | Binary action entry point |
| `/create` | Create Proof | Wallet-required page |
| `/verify` | Verify Proof | Read-only page |
| `/proof/[hash]` | Proof page | Hash is 64-char hex. If invalid format, redirect to `/verify` |
| `/docs` | Documentation hub | Index page |
| `/docs/spec` | Specification | Receipt specification entry point |
| `/docs/spec/receipt` | Receipt specification | Renders receipt-specification.md |
| `/docs/spec/schema` | JSON Schema | Renders openproof-receipt-schema.json |
| `/docs/spec/vectors` | Test vectors | Renders openproof-test-vectors.md |
| `/docs/rfcs` | RFC index | Lists RFC proposals |
| `/docs/rfcs/[id]` | Individual RFC | Renders the RFC document |
| `/docs/architecture` | Architecture | Renders ARCHITECTURE.md |
| `/docs/architecture/verification` | Verification lifecycle | Renders VERIFICATION_LIFECYCLE.md |
| `/docs/architecture/data-flow` | Data flow | Renders DATA_FLOW.md |
| `/docs/security` | Security hub | Index of security docs |
| `/docs/security/trust-model` | Trust model | Renders TRUST_MODEL.md |
| `/docs/security/failure-modes` | Failure modes | Renders FAILURE_MODES.md |
| `/docs/security/principles` | Security principles | Renders security-principles.md |
| `/docs/security/threat-model` | Threat model | Renders threat-model.md |
| `/docs/governance` | Governance hub | Index of governance docs |
| `/docs/governance/systems-doctrine` | Systems doctrine | Renders SYSTEMS_DOCTRINE.md |
| `/docs/governance/non-goals` | Non-goals | Renders NON_GOALS.md |
| `/docs/governance/design-restraints` | Design restraints | Renders DESIGN_RESTRAINTS.md |
| `/docs/governance/architectural-invariants` | Architectural invariants | Renders ARCHITECTURAL_INVARIANTS.md |
| `/docs/governance/trust-boundaries` | Trust boundaries | Renders TRUST_BOUNDARIES.md |
| `/docs/governance/ui-doctrine` | UI doctrine | Renders UI_DOCTRINE.md |

**URL hierarchy rules:**
- All doc paths are under `/docs/`. No top-level doc paths.
- Governance documents have precedence: `/docs/governance/` is the base for all doctrine.
- Path slugs match document filenames (lowercased, hyphens). This is a 1-to-1 mapping: every `.md` file in `docs/` has a URL under its category.

---

## 6. Navigation Priority

When designing or modifying the navigation, the following priority governs:

1. **Core actions** (Create Proof, Verify Proof) — always accessible from any page
2. **System identity information** (registry address, contract properties) — present on homepage and relevant action pages
3. **Documentation** (spec, architecture, security, governance) — accessible through a single click from any page
4. **Secondary system information** (changelog, license, repository) — accessible through footer

No navigation element should compete with or obscure the two core actions.

---

## 7. Responsive Behavior

### 7.1 Desktop (≥1024px)

- Two-column layout for action cards on homepage
- Secondary navigation is a left sidebar or horizontal bar on docs pages
- Proof pages are single-column, centered, max-width constrained

### 7.2 Tablet (640px–1023px)

- Single-column layout for all pages
- Secondary navigation is a horizontal scrollable bar on docs pages
- Action cards on homepage stack vertically
- File drop zone remains full-width

### 7.3 Mobile (<640px)

- Single-column layout
- Header collapses to hamburger menu
- Docs secondary navigation is a select/dropdown
- Action cards are full-width buttons rather than cards
- File drop zone is a tap-target-optimized button rather than a drag-and-drop zone
- Proof pages use the same single-column layout

---

## 8. Exclusions

The following are intentionally excluded from the information architecture:

- **Dashboard page.** There is nothing to dashboard. The system has no aggregate state to display.
- **Settings page.** There are no user-configurable settings beyond wallet connection.
- **Profile page.** No user accounts, no profiles.
- **Search.** There is nothing to search across. Proofs are individually addressable by hash.
- **Notifications.** OpenProof does not generate notifications.
- **API docs.** There is no public API to document.
- **Blog or news.** OpenProof is infrastructure, not a publication.
- **Status page.** There is no service to report status for — the contract is the service.

---

## 9. Changelog

| Version | Date | Change | Author |
|---------|------|--------|--------|
| 001 | 2026-06-04 | Original ratification | UI Doctrine & Information Architect |
