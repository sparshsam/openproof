# OpenProof — Store Metadata

## App Description (Short)

> Open-source proof-of-existence for files on Base Sepolia. Hash files locally, register only the fingerprint onchain — never upload the file itself.

## App Description (Full)

OpenProof is a privacy-first, open-source cryptographic proof-of-existence app built on Base Sepolia.

**How it works:**

1. Select a file in the browser.
2. OpenProof hashes the file locally using SHA-256 (Web Crypto API).
3. Connect a wallet on Base Sepolia.
4. Register only the resulting `bytes32` fingerprint in the `OpenProofRegistry` smart contract.
5. Download a local JSON receipt or share the proof page.
6. Verify later by hashing the exact same file again and checking the onchain registry.

**What makes OpenProof different:**

- **No file uploads.** Files are hashed locally in the browser. Only the 32-byte SHA-256 hash is sent to the blockchain.
- **No backend, no database, no accounts.** OpenProof is a fully static app. No signup, no login, no cloud storage.
- **Local-first receipts.** Proof receipts are JSON files generated and downloaded locally. Recent proof history stays in browser local storage.
- **Open source (AGPL-3.0).** The full source code, contract, and specification are public and auditable.

**Use cases:**

- Prove a document existed at a specific point in time
- Archive a research artifact with a verifiable timestamp
- Create a cryptographic fingerprint for a release archive
- Verify file integrity without revealing the file contents

**Important:** OpenProof records that a specific SHA-256 hash was registered by a wallet at a given timestamp. It does not prove authorship, ownership, copyright, legal validity, or the truth of a file's contents. See the app documentation for full security and threat-model details.

## Keywords

openproof,proof-of-existence,base-sepolia,blockchain,ethereum,solidity,sha-256,cryptographic-proof,privacy-first,timestamp,file-integrity,verification,web3,onchain

## Category

Utilities / Productivity

## Age Rating (App Store)

| Area | Answer |
|------|--------|
| Unrestricted web access | No |
| Gambling, simulations | No |
| Gambling, contests | No |
| Gambling, lotteries | No |
| Sexual content, explicit | No |
| Sexual content, nudity | No |
| Sexual content, suggestive | No |
| Profanity or crude humor | No |
| Horror or fear | No |
| Violence, cartoon/fantasy | No |
| Violence, realistic | No |
| Violence, realistic (blood) | No |
| Alcohol, tobacco, drugs | No |
| Medical or treatment info | No |
| Contests | No |
| Location | No (read-only, user-initiated) |
| User registration | No (wallet connection is optional and user-initiated) |

**Recommended age rating:** 4+ (no objectionable content)
**Rating reason:** No restricted content. App involves cryptographic operations with no adult themes.

## Age Rating (Google Play)

| Area | Answer |
|------|--------|
| Email, social, or web sharing | No (sharing is manual URL copy) |
| Sharing location | No |
| Digital purchases | No (onchain transaction fees are not app purchases) |
| Physical purchases | No |
| Advertising | No |
| Analytics | No |
| User-generated content | No |
| Unrestricted web browsing | No |

**Recommended rating:** Everyone (no restricted content)

## Search Keywords

- "proof of existence blockchain"
- "file hash verification"
- "SHA-256 timestamp"
- "cryptographic proof app"
- "Base Sepolia dapp"
- "local file hashing"
- "free file fingerprinting"
- "open source blockchain utility"

## Privacy Notes for Store Listing

> OpenProof never uploads, stores, or transmits user files. All file hashing occurs locally in the browser using the Web Crypto API. Only the resulting 32-byte SHA-256 hash may be sent to the blockchain if the user chooses to register a proof. No analytics, no tracking, no accounts, no backend. See full privacy policy at https://proof.kovina.org/docs/privacy

## Support URL

https://github.com/sparshsam/openproof/issues

## Marketing URL

https://proof.kovina.org

## Privacy Policy URL

https://proof.kovina.org/docs/privacy — or refer to the published policy.

## Screenshot Specifications

| Screenshot | Platform | Dimensions | Content |
|------------|----------|-----------|---------|
| home-desktop.png | Web/Desktop | 1280×800 | Landing page with action cards |
| create-desktop.png | Web/Desktop | 1280×800 | File selection + hash + registration |
| verify-desktop.png | Web/Desktop | 1280×800 | File selection + receipt import + verification |
| proof-desktop.png | Web/Desktop | 1280×800 | Public proof page with hash metadata |
| create-mobile.png | Web/Mobile | 414×896 | Create proof flow on mobile viewport |
