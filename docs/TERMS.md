# OpenProof Terms of Service

**Last updated:** 2026-06-21  
**App version:** 0.1.1  
**Contact:** [GitHub Issues](https://github.com/sparshsam/openproof/issues)

## 1. Acceptance

By using OpenProof ("the App"), you agree to these Terms of Service. If you do not agree, do not use the App.

## 2. What OpenProof Is

OpenProof is an open-source (AGPL-3.0), privacy-first proof-of-existence utility that lets users:

- Hash files locally in the browser using SHA-256
- Register the resulting hash on the Base Sepolia blockchain
- Generate local proof receipts
- Verify file hashes against the onchain registry

OpenProof is provided as a free, public-good tool. It is not a legal service, notarization platform, document storage service, or compliance tool.

## 3. What OpenProof Does Not Do

OpenProof does not provide legal, financial, medical, or compliance advice. Registering a hash on a blockchain does not:

- Prove authorship or ownership of a file
- Prove the truth or accuracy of a file's contents
- Constitute a legally binding timestamp or notarization
- Create a copyright, patent, trademark, or other intellectual property right
- Satisfy any regulatory or compliance requirement

Users should consult qualified professionals for legal, financial, or compliance advice.

## 4. User Responsibilities

### 4.1 File Selection

You are solely responsible for the files you hash and register. Do not register hashes of:

- Illegal or infringing content
- Malware, exploits, or harmful code
- Private keys, passwords, or secrets (registering a hash can still leak information about guessable values)

### 4.2 Wallet and Transactions

- You are responsible for securing your wallet and private keys.
- Onchain transactions (proof registration) require gas fees on Base Sepolia. These are not controlled by OpenProof.
- Testnet proofs have no monetary value and may be reset at any time.

### 4.3 Compliance

You are responsible for ensuring your use of OpenProof complies with all applicable laws and regulations in your jurisdiction.

## 5. Intellectual Property

### 5.1 App Code

The OpenProof source code is licensed under AGPL-3.0-only. See the [`LICENSE`](../LICENSE) file for the full license text.

### 5.2 Receipt Specification

The OpenProof receipt specification is licensed under MIT. See [`docs/spec/receipt-specification.md`](spec/receipt-specification.md) for details.

### 5.3 User Files and Receipts

OpenProof claims no ownership of any files, hashes, receipts, or data you create using the App. Your files remain yours. Your receipts are generated locally.

## 6. Disclaimer of Warranties

OPENPROOF IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT ANY WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, NON-INFRINGEMENT, OR AVAILABILITY.

THE BASE SEPOLIA TESTNET MAY BE RESET, PAUSED, OR UNEXPECTEDLY CHANGED. PROOFS REGISTERED ON TESTNET HAVE NO GUARANTEE OF PERMANENCE.

## 7. Limitation of Liability

TO THE MAXIMUM EXTENT PERMITTED BY LAW, THE OPENPROOF CONTRIBUTORS AND MAINTAINERS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING FROM YOUR USE OF THE APP, INCLUDING BUT NOT LIMITED TO LOSS OF DATA, LOSS OF ACCESS TO PROOFS, BLOCKCHAIN-RELATED LOSSES, OR LEGAL CLAIMS BASED ON PROOF CONTENT.

## 8. No Responsible Party for Losses

OpenProof does not store or back up files. If you lose the original file for which you registered a proof, OpenProof cannot recover it. The blockchain stores only the SHA-256 hash. Maintain your own backups.

## 9. Changes to These Terms

These Terms may be updated from time to time. Continued use of the App after changes constitutes acceptance of the updated Terms. Material changes will be noted in the app's [CHANGELOG.md](../CHANGELOG.md).

## 10. Governing Law

These Terms are governed by the laws of the Republic of India, without regard to conflict-of-law principles. However, because OpenProof is a global, decentralized application, you agree that:

- No party is subjecting themselves to the jurisdiction of any specific court.
- Disputes should first be raised via GitHub Issues for informal resolution.
- If legal action is unavoidable, it shall be brought in the courts of Bangalore, India.

## 11. Contact

For questions about these Terms, please open an issue at:

https://github.com/sparshsam/openproof/issues

For security vulnerabilities, see [SECURITY.md](../SECURITY.md).
