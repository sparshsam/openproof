# OpenProof Non-Goals

**Document ID:** OP-DOCTRINE-NG-001
**Classification:** Permanent exclusion register
**Hierarchy:** Level 2 — peer doctrine (with DESIGN_RESTRAINTS and TRUST_BOUNDARIES)
**Scope:** OpenProof, all deployments and forks
**Authority:** Ecosystem governance standards — [ecosystem-standards](https://github.com/sparshsam/ecosystem-standards)
**Freeze level:** Controlled — individual exclusions are permanent, the register format and process are controlled.
**Status:** Adopted

**Previous versions:** None (original)
**Supersedes:** None
**Depends on:** [SYSTEMS_DOCTRINE.md](SYSTEMS_DOCTRINE.md) §11 (Scope Boundary)

---

## 0. Governance

### 0.1 Document Purpose

This document enumerates what OpenProof is not, what it will never become, and which features will never be added. These exclusions are structural. They are not deferrals, not "not yet" items, and not roadmap gaps. They are intentional constraints that preserve the system's identity, security properties, and trust model.

### 0.2 Hierarchy and Dependencies

This document derives from SYSTEMS_DOCTRINE.md §11 (Scope Boundary). The exclusions defined here are expansions of the scope boundary, not independent prohibitions. If SYSTEMS_DOCTRINE.md §11 is amended, this document must be reviewed and updated in lockstep.

| Document | Relationship |
|---|---|
| [SYSTEMS_DOCTRINE.md](SYSTEMS_DOCTRINE.md) | Parent doctrine — scope boundary defined in §11 |
| [DESIGN_RESTRAINTS.md](DESIGN_RESTRAINTS.md) | Peer — restraints operationalize similar exclusions |
| [TRUST_BOUNDARIES.md](TRUST_BOUNDARIES.md) | Peer — trust model reinforces exclusion rationale |
| [ARCHITECTURAL_INVARIANTS.md](ARCHITECTURAL_INVARIANTS.md) | Enforceable rules — several invariants encode these exclusions (I-1, I-2, III-2, III-5, II-4) |

### 0.3 Freeze Expectations

- **Individual exclusion entries are permanent.** Each entry in the exclusions register is a permanent constraint. Removing or modifying an entry requires ecosystem governance review and amendment of SYSTEMS_DOCTRINE.md §11 as the parent scope boundary.
- **This governance section (§0) is controlled.** May be updated as governance processes evolve.
- **The exclusions register format (§1–§10) is controlled.** Individual exclusions are permanent, but the presentation and ordering may evolve.
- **The register summary table is controlled.** Presentation details may be updated.

### 0.4 Amendment Process

Amending this document requires:

1. **Proposal.** A written document describing which exclusion is being added, removed, or modified, and its rationale.
2. **Parent doctrine check.** Any change to an exclusion must be assessed against SYSTEMS_DOCTRINE.md §11. If the exclusion is not covered by the existing scope boundary, SYSTEMS_DOCTRINE.md must be amended first.
3. **Governance review.** Ecosystem governance review against all applicable ecosystem standards.
4. **Cross-document impact.** Assessment of impact on DESIGN_RESTRAINTS.md, TRUST_BOUNDARIES.md, and ARCHITECTURAL_INVARIANTS.md.
5. **Version record.** The document footer must be updated with the new version, date, and change summary.

Adding a new exclusion category requires the same process as removing one. The bar for adding exclusions is lower than for removing them, but must still meet governance review.

### 0.5 Precedence

This document derives from SYSTEMS_DOCTRINE.md §11. In case of conflict:

- SYSTEMS_DOCTRINE.md takes precedence over this document.
- This document and DESIGN_RESTRAINTS.md are peers. Where they overlap, the more specific document governs.
- This document takes precedence over ARCHITECTURAL_INVARIANTS.md where the invariant would conflict with an exclusion (the invariant must be corrected).

### 0.6 Cross-Document Map

| Referenced Document | Relationship |
|---|---|
| [SYSTEMS_DOCTRINE.md](SYSTEMS_DOCTRINE.md) §11 | Parent scope boundary from which exclusions derive |
| [DESIGN_RESTRAINTS.md](DESIGN_RESTRAINTS.md) | Peer — constraint implementation details |
| [TRUST_BOUNDARIES.md](TRUST_BOUNDARIES.md) | Peer — trust model reinforcing privacy/analytics exclusions |
| [ARCHITECTURAL_INVARIANTS.md](ARCHITECTURAL_INVARIANTS.md) | Enforceable rules — invariant references noted in §0.2 |
| [ecosystem-standards](https://github.com/sparshsam/ecosystem-standards) | External governance authority |

---

## 1. Token Systems

OpenProof will never:

- Issue a native token (ERC-20, ERC-721, ERC-1155, or any other standard)
- Require token holding for proof registration or verification
- Implement staking, bonding, or yield mechanisms
- Charge fees in any cryptocurrency beyond network gas costs
- Create a token-gated access tier
- Launch an airdrop, community sale, or token distribution event
- Implement governance tokens, voting power, or DAO structures

**Rationale:** Tokens introduce financial incentives, regulatory complexity, speculation, and attack surface. A proof-of-existence tool should not require users to hold, trade, or consider any token. The only cost should be the gas fee for the registration transaction.

## 2. Surveillance and Tracking

OpenProof will never:

- Collect user IP addresses, browser fingerprints, or device identifiers
- Implement analytics scripts, trackers, or beacons
- Monitor which files users hash or which wallets register proofs
- Correlate wallet addresses across sessions or devices
- Record session replays, clickstreams, or interaction logs
- Serve third-party tracking scripts (Google Analytics, Meta Pixel, etc.)
- Implement referral tracking, affiliate codes, or attribution links
- Report usage statistics to any third party

**Rationale:** Surveillance destroys trust. A tool that helps users prove file existence should not surveil those users. Collection of any telemetry creates a data breach liability, a privacy harm, and an ethical contradiction.

## 3. Social Features

OpenProof will never:

- Implement user profiles, avatars, or display names
- Add commenting, likes, shares, or reactions on proofs
- Create feeds, timelines, or activity streams
- Enable direct messaging, chat, or notifications
- Support following, friending, or social graphs
- Implement leaderboards, badges, or reputation scores
- Allow public proof galleries or showcase pages

**Rationale:** Social features introduce content moderation requirements, spam vectors, harassment risk, and network effects pressure. OpenProof is an infrastructure tool, not a social platform. Proofs exist onchain; there is nothing to moderate, curate, or rank.

## 4. Engagement Mechanics

OpenProof will never:

- Implement streaks, daily rewards, or gamification
- Show push notifications, badges, or alerts
- Use progress bars, achievement systems, or leveling
- Send email or wallet notifications about proof activity
- Implement onboarding tutorials, tooltips, or walkthrough sequences beyond what the core flow requires
- Measure or optimize "user engagement" or "time in app"
- Use A/B testing, conversion optimization, or growth experiments
- Implement "social login" or friction-reducing authentication that compromises privacy

**Rationale:** Engagement mechanics are manipulation vectors. OpenProof's goal is to be used when needed and forgotten when not. It does not compete for attention, time, or daily active users.

## 5. Growth and Marketing

OpenProof will never:

- Implement referral programs, invite systems, or viral loops
- Add "share on social media" prompts or integrations
- Optimize for viral coefficient, DAU/MAU, or retention metrics
- Run ad campaigns, sponsored content, or paid acquisition
- Collect email addresses or contact information
- Implement onboarding email sequences or drip campaigns
- Track conversion funnels or attribution
- Use SEO-optimized content or blog posts about proof activity
- Add "Powered by OpenProof" branding requirements

**Rationale:** Growth tactics are antithetical to infrastructure. OpenProof does not need to grow; it needs to exist and be reliable. Marketing optimization would prioritize metrics over user sovereignty.

## 6. AI and Automated Processing

OpenProof will never:

- Score or rank proofs by "quality," "importance," or "relevance"
- Analyze proof content or file metadata for patterns
- Implement automated verification pipelines for third-party services
- Provide AI-powered search, discovery, or proof recommendations
- Train models on user data, proof metadata, or registration patterns
- Offer API endpoints for AI agents to register or verify proofs programmatically
- Implement "proof quality" or "trustworthiness" scoring

**Rationale:** AI integration in a proof-of-existence context would require centralizing, analyzing, and processing user data — violating privacy and determinism. Proofs should be evaluated by cryptographic matching, not by model inference.

## 7. Enterprise Features

OpenProof will never:

- Implement team accounts, organizations, or role-based access control
- Build admin dashboards, audit logs, or reporting interfaces
- Offer SLA guarantees or paid support tiers
- Implement multi-tenant architecture with isolated environments
- Provide API keys, rate limiting, or usage metering
- Integrate with identity providers (SSO, SAML, OIDC)
- Create a managed cloud service with billing
- Offer custom deployments with feature gating

**Rationale:** Enterprise features introduce complexity, operational burden, and governance requirements that exceed OpenProof's scope. Teams needing organizational proof management should independently evaluate blockchain-native solutions without centralized coordination.

## 8. Cloud Lock-In

OpenProof will never:

- Require a specific hosting provider for frontend deployment
- Use cloud-specific services that prevent cross-provider portability
- Store proof data in a centralized database or cloud storage
- Implement provider-specific authentication or authorization
- Depend on proprietary APIs or SDKs that cannot be self-hosted
- Require a paid cloud plan for any core function
- Use cloud-native data formats that cannot be exported

**Rationale:** Cloud lock-in contradicts proof-of-existence portability. If a proof requires a specific cloud provider to verify, it is not independently verifiable. OpenProof's frontend is a static export that can be served from any web server, IPFS gateway, or offline medium.

## 9. Behavioral Manipulation

OpenProof will never:

- Use dark patterns, deceptive UI, or choice architecture to influence user decisions
- Default-enable features that compromise privacy or increase usage
- Use confirmation bias, loss aversion, or scarcity framing
- Implement "confirmshaming" or guilt-inducing messaging
- Hide or obscure wallet connection opt-outs
- Pre-check any consent, sharing, or data collection option
- Use urgency timers, limited availability, or FOMO mechanics
- Implement "nudge" systems that steer user behavior

**Rationale:** Behavioral manipulation has no place in infrastructure. Users should register proofs when they intend to, not because the UI was designed to encourage it.

## 10. Feature Creep Categories

The following categories of features will never be added, even as optional modules or plugins:

- **Chat, messaging, or communication** — real-time or async
- **File storage or sharing** — temporary or permanent
- **Media transcoding, compression, or transformation** — images, video, audio
- **Content moderation or filtering** — of hashes, files, or proofs
- **Identity verification or KYC** — any form
- **Dispute resolution or arbitration** — human or automated
- **Marketplace or exchange** — of proofs, tokens, or data
- **Derivatives, synthetic assets, or financial instruments**

**Rationale:** Each of these categories would fundamentally change the nature of the system from a verification tool into something with content, community, or financial characteristics. None are compatible with the architectural invariants.

---

## Exclusions Register

| Category | Exclusion | Status |
|---|---|---|
| Token systems | All token standards, fees, staking | Permanent |
| Surveillance | Analytics, tracking, fingerprinting | Permanent |
| Social features | Profiles, comments, feeds, messaging | Permanent |
| Engagement mechanics | Gamification, streaks, notifications | Permanent |
| Growth/marketing | Referrals, viral loops, attribution | Permanent |
| AI processing | Scoring, analysis, recommendations | Permanent |
| Enterprise features | Teams, dashboards, SSO, metering | Permanent |
| Cloud lock-in | Provider-specific dependencies | Permanent |
| Behavioral manipulation | Dark patterns, nudges, FOMO | Permanent |
| Feature creep | File storage, chat, moderation, KYC, ML, dispute resolution | Permanent |

Each entry in this register is a permanent exclusion. The amendment process defined in §0.4 applies to all modifications. See SYSTEMS_DOCTRINE.md §0.6 for escalation requirements.

## Changelog

| Version | Date | Change | Author |
|---|---|---|---|
| 001 | 2026-06-04 | Original ratification | Systems Doctrine & Boundaries Editor |
