# Security Principles

This document defines the operational, deployment, and trust principles for securing OpenProof.

---

## 1. Operational Security

### 1.1 Local Hashing Trust

OpenProof's core guarantee is that file bytes never leave the browser. This guarantee depends on the integrity of the client-side JavaScript served by the hosting provider. Users who require independent verification should:

- Compute the SHA-256 hash of their file using a trusted offline tool (e.g., `sha256sum`, `openssl dgst -sha256`).
- Query the OpenProof registry directly via a block explorer (e.g., BaseScan) at the known-good contract address.
- Compare the locally computed hash against the onchain hash.

This three-way check eliminates reliance on the frontend for high-stakes verification.

### 1.2 Browser Security

- OpenProof uses the Web Crypto API (`crypto.subtle.digest`) for all hashing operations. This API is implemented in browser native code (not JavaScript), reducing the risk of tampering from malicious JavaScript extensions or framework code.
- No file data is converted to a string, serialized, or transmitted beyond the in-memory `ArrayBuffer` used for hashing.
- Local proof history is stored in `localStorage`. Users in shared or public computer environments should clear history after use or use a private browsing session.

### 1.3 Receipt Handling

Receipt JSON files contain file metadata, wallet address, transaction hash, and chain information. Treat receipts as:

- **Portable proof records** — share intentionally with parties who need to verify.
- **Metadata-bearing documents** — file names, sizes, and types are visible in the raw JSON.
- **Non-authoritative alone** — a receipt is only valid if its hash matches an onchain registry entry.

### 1.4 QR Code Awareness

QR codes encode the public proof page URL. They are equivalent to sharing the hash publicly. Anyone who scans the QR code can:

- View the proof hash on the explorer page.
- See the creator wallet address and timestamp.
- Query the contract for related proofs from the same wallet.

QR codes do not expire and cannot be retracted after distribution.

---

## 2. Self-Hosting Trust

### 2.1 Verifying a Build

Self-hosted operators should verify the deployed build matches a trusted source:

```bash
# Clone the repository at a known tag
git clone https://github.com/sparshsam/openproof.git
git checkout v0.1.0  # or a specific commit

# Build locally
npm ci
npm run build

# Compare the build output digest with the deployed instance
# (e.g., check the hash of .next/ or out/ directory)
```

### 2.2 Supply Chain Defense

- `package-lock.json` is committed to the repository and must be reviewed for unexpected dependency changes.
- Use `npm ci` (not `npm install`) for reproducible builds. `npm ci` installs exact versions from the lockfile and fails if `package-lock.json` is inconsistent with `package.json`.
- Review dependency updates for supply-chain risk before merging.
- Avoid adding runtime dependencies that have filesystem or network access beyond what the Next.js static export requires.

### 2.3 Domain and Hosting

- The official deployment is at `openproof.vercel.app`. Self-hosted deployments on other domains are independent instances with their own trust boundary.
- Users should verify they are on the correct domain before connecting a wallet or registering a proof.
- Self-hosted operators should enable HTTPS and configure HSTS headers.

---

## 3. Deployment Security

### 3.1 Contract Deployment

1. **Use a dedicated deployer wallet.** The deployer wallet should hold only enough test ETH for deployment and be separate from personal or operational wallets.

2. **Verify the contract on BaseScan.** After deployment, submit the source code for verification on BaseScan Sepolia. This allows anyone to verify that the deployed bytecode matches the open-source contract.

3. **Record deployment metadata.** Save the deployment transaction hash, block number, deployer address, and chain ID alongside the contract address. This creates an auditable deployment trail.

4. **Do not reuse the deployer wallet private key.** If a deployer key is compromised, an attacker could deploy a malicious contract under a legitimate-looking address. Use a fresh key for each deploy target.

### 3.2 Frontend Deployment (Vercel)

1. **Review Vercel environment variables** before each deployment. Confirm:
   - `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` is set to a valid project ID.
   - `NEXT_PUBLIC_OPENPROOF_CONTRACT_ADDRESS` points to the correct deployed contract.
   - `NEXT_PUBLIC_CHAIN_ID` is `84532` for Base Sepolia.

2. **Pin the Vercel deployment.** Use Vercel's production deployment pinning to prevent auto-redeployment from branch pushes.

3. **Avoid custom domains with mixed content.** If using a custom domain, ensure all resources load over HTTPS with no mixed-content warnings.

4. **Review Vercel deployment logs** for any unexpected build output or environment variable leakage.

### 3.3 Continuous Integration

- Run all validation checks (`lint`, `typecheck`, `build`, `test:contracts`) before every deployment.
- Review the diff of `package-lock.json` in CI. Unexpected lockfile changes may indicate a compromised dependency.
- Use GitHub Actions (or equivalent) to automate validation on pull requests.

---

## 4. Secret Handling

### 4.1 Environment Variables

OpenProof requires these secrets:

| Variable | Purpose | Risk if leaked |
|---|---|---|
| `DEPLOYER_PRIVATE_KEY` | Deploys the smart contract | Full control of the deployer wallet |
| `BASE_SEPOLIA_RPC_URL` | RPC endpoint for deployment | Low risk (public endpoint is the default) |
| `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` | RainbowKit WalletConnect integration | Low risk (public-facing, but should be unique per deployment) |
| `NEXT_PUBLIC_OPENPROOF_CONTRACT_ADDRESS` | Contract address the frontend reads | Public by design after deployment |
| `NEXT_PUBLIC_CHAIN_ID` | Target chain identifier | Public by design |

### 4.2 Private Key Protection

The **only** secret requiring high-security handling is `DEPLOYER_PRIVATE_KEY`.

**Do:**
- Store the deployer private key in a password manager, encrypted vault, or hardware wallet.
- Use a `.env` file that is git-ignored (already configured in `.gitignore`: `.env*` except `.env.example`).
- Set the environment variable directly in CI/CD secret stores (GitHub Secrets, Vercel Environment Variables) for automated deployments.
- Use a wallet whose private key is generated specifically for deployment and has no other use.

**Do not:**
- Commit the private key to any git branch, including feature or staging branches.
- Share the private key via email, chat, or any unencrypted channel.
- Paste the private key in logs, terminal history, or screenshots.
- Use the same private key across multiple chains or environments.
- Store the private key in environment files that are loaded by the frontend build (NEXT_PUBLIC_* variables are embedded in the client bundle).

### 4.3 WalletConnect Project ID

While `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` is a public-facing value (it is embedded in the client-side bundle), it should still be:

- Unique per deployment instance (not shared across unrelated projects).
- Rotated if it appears in public logs or if the associated Reown Cloud project is compromised.
- Generated through the Reown Cloud dashboard, not hardcoded or inherited from examples.

### 4.4 Preventing Accidental Leakage

- The `.gitignore` file excludes all `.env*` files except `.env.example`. Verify this before committing.
- `npm run build` outputs to `.next/` — do not commit this directory (already ignored).
- Vercel build logs may echo environment variable names but will mask secret values — review logs for any plaintext secret output.
- If a secret is accidentally committed, rotate it immediately and rewrite git history using `git filter-branch` or `bfg-repo-cleaner`.

---

## 5. Trust Model

### 5.1 What You Can Trust

- A SHA-256 hash registered on Base Sepolia's OpenProofRegistry at the known address was submitted by the creator wallet at the recorded block timestamp.
- The hash is the deterministic output of hashing the file bytes through SHA-256 (for single-file proofs) or the stable-stringified bundle manifest (for bundle proofs).
- The contract is immutable — no entity can alter, delete, or overwrite a registered proof.

### 5.2 What You Cannot Assume

- That the creator wallet was under the control of the named registrant at the time of registration. (Wallet keys can be stolen, shared, or delegated.)
- That the file existed before the timestamp on the proof. (Only the hash is registered, not the file.)
- That the file content is true, accurate, or lawful. (Proof-of-existence does not verify content truth.)
- That the file belonged to the wallet owner. (Anyone with the file bytes can compute the hash.)
- That OpenProof's frontend served the correct code at the time of registration. (The frontend is a static client app; verify against the source if needed.)

### 5.3 Third-Party Dependencies

OpenProof depends on these external services:

| Service | Role | Trust assumption |
|---|---|---|
| Base Sepolia | Smart contract chain | Standard L2 security model; block reorgs up to finality (typically ~1 epoch) |
| Vercel | Frontend hosting | Vercel's CDN and build pipeline serve the correct build artifact |
| Reown Cloud | WalletConnect project ID | Provides the WalletConnect relay infrastructure |
| RainbowKit / wagmi | Wallet connection | Open-source libraries with their own security audits |
| Public RPC (sepolia.base.org) | Blockchain read access | Rate-limited, public endpoint; no trust for write operations |

These are minimum-viable dependencies. Future roadmaps may reduce external reliance (e.g., multi-RPC fallback, self-hosted RPC).

---

## 6. Audit Trail

All security-relevant changes to the repository should:

1. Reference this document in the commit message or PR description.
2. Update the threat model if a new risk category is introduced or an existing one is materially changed.
3. Update `docs/deployment-notes.md` for any changes to the deployment workflow.
4. Pass all validation checks (`npm run lint`, `npm run typecheck`, `npm run build`, `npm run test:contracts`).

The contract address, deployer address, and deployment transaction hash form the root of trust for each deployment. Record these externally (e.g., in the repository README and on the project website) so they can be cross-referenced independently of the frontend.
