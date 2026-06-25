# OpenProof — Roadmap

> A minimal, verifiable proof-of-existence app on Base Sepolia.

## v0.2.0 — Cryptographic Foundation ✅

- [x] Receipt schema v3 (forward-compatible metadata, registry version, optional chain context)
- [x] Registry abstraction layer (chain config registry, multi-EVM support, Base Mainnet prepared)
- [x] Chain-aware proof URLs and explorer links
- [x] Improved error recovery (wallet rejection, chain mismatch, nonce, funds detection)
- [x] Wallet reconnect/disconnect handling (useWalletState hook)
- [x] Contract: registryVersion getter (v2)
- [x] Receipt migration helpers (migrateReceipt, isSchemaVersionSupported)

## v0.3.0 — Bundle Proofs ✅

- [x] Merkle tree implementation (SHA-256, binary tree, zero-padding)
- [x] Merkle root registration (bundle hash = Merkle root)
- [x] Individual inclusion proof generation
- [x] Inclusion proof verification
- [x] Bundle receipt schema (bundleRuleVersion: 2, merkle-sort rule)
- [x] Bundle explorer page (/bundle/[hash])
- [x] Bundle download as standalone JSON
- [x] Bundle storage in localStorage (linked from proof explorer)
- [x] Bundle file listing with per-file verify inclusion

## v0.4.0 — Professional Evidence Workflows ✅

- [x] Human-readable receipt view (HumanReadableReceipt component)
- [x] Printable evidence reports (@media print CSS)
- [x] PDF export via browser print
- [x] Evidence package generation (archive.ts)
- [x] Citation formats (APA 7th, MLA 9th, Legal, Plain)
- [x] Timezone localization (formatTimestampInTimezone, getUserTimezone)
- [x] Better timestamp formatting (formatShortDate, formatUnixTimestamp)
- [x] Copy citation formats (with copy buttons)
- [x] QR improvements (high-res, standard + high download options)

## v0.5.0 — Verification Engine ✅

- [x] Full receipt verification pipeline (verifyReceipt)
- [x] Receipt integrity validation (schema, format, hash)
- [x] Registry version compatibility check
- [x] Network/chain validation and chain mismatch detection
- [x] Contract match validation
- [x] Onchain proof existence check
- [x] Creator wallet match check
- [x] Transaction hash cross-check
- [x] Bundle consistency check
- [x] Detailed verification report

## v0.6.0 — Long-Term Preservation ✅

- [x] Receipt migration tools (migrateReceipt, schema v3)
- [x] Version upgrade engine (schema/version detection)
- [x] Hash algorithm abstraction (HashAlgorithmConfig registry)
- [x] Future SHA migration architecture (SHA-384, BLAKE3 slots pre-configured)
- [x] Archive package export (buildArchivePackage, downloadArchivePackage)
- [x] Long-term compatibility checks (checkReceiptCompatibility)
- [x] Legacy receipt support (schema v1/v2 → v3 migration)

## v0.7.0 — Explorer Improvements ✅

- [x] Better proof page layout
- [x] Rich metadata display (onchain records, fingerprint, timestamps)
- [x] Timeline visualization (ProofTimeline component)
- [x] Related bundle navigation (proof → bundle link)
- [x] Better explorer links (chain-aware)
- [x] Better mobile layouts (responsive throughout)
- [x] Better permalink support (canonical URL metadata)
- [x] Bundle awareness on standard proof pages

## Future

- [ ] Multi-chain UI switching (chain selector in app)
- [ ] Base Mainnet deployment and activation
- [ ] Proof revocation (contract upgrade)
- [ ] API for programmatic attestations
- [ ] Verification API endpoint
- [ ] MCP server integration for agentic attestations
