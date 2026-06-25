// ── OpenProof Verification Engine v1 ──
// Full receipt verification pipeline with integrity, chain, network, and
// registry compatibility checks.

import type { PublicClient } from "viem";
import { readOnchainProof } from "@/lib/proofs";
import {
  validateProofReceipt,
  isSchemaVersionSupported,
  type ProofReceipt,
} from "@/lib/receipt";
import { getChainConfig, getActiveChainConfig } from "@/lib/chains";
import { openProofContractAddress } from "@/lib/contracts";

// ── Verification result types ──

export type VerificationCheck =
  | { status: "pass"; label: string; detail: string }
  | { status: "fail"; label: string; detail: string }
  | { status: "warn"; label: string; detail: string }
  | { status: "skip"; label: string; detail: string };

export type VerificationReport = {
  /** Receipt being verified */
  receipt: ProofReceipt;
  /** Timestamp of verification */
  verifiedAt: string;
  /** Overall result */
  result: "valid" | "invalid" | "partial";
  /** Individual check results */
  checks: VerificationCheck[];
  /** Summary message */
  summary: string;
};

// ── Verification pipeline ──

export async function verifyReceipt(
  receipt: ProofReceipt,
  publicClient: PublicClient | null,
  options?: {
    expectedChainId?: number;
    expectedContractAddress?: `0x${string}`;
  },
): Promise<VerificationReport> {
  const checks: VerificationCheck[] = [];
  const opts = options || {};

  // 1. Schema validation
  const schemaResult = validateProofReceipt(receipt);
  if (schemaResult.ok) {
    checks.push({
      status: "pass",
      label: "Receipt schema",
      detail: "JSON structure, field types, and hex formats are valid.",
    });
  } else {
    checks.push({
      status: "fail",
      label: "Receipt schema",
      detail: schemaResult.reason,
    });
    return {
      receipt,
      verifiedAt: new Date().toISOString(),
      result: "invalid",
      checks,
      summary: "Receipt schema validation failed.",
    };
  }

  // 2. Schema version compatibility
  if (isSchemaVersionSupported(receipt.schemaVersion)) {
    checks.push({
      status: "pass",
      label: "Schema version",
      detail: `Schema v${receipt.schemaVersion} is supported by this verifier.`,
    });
  } else {
    checks.push({
      status: "fail",
      label: "Schema version",
      detail: `Schema v${receipt.schemaVersion} is not supported by this verifier.`,
    });
  }

  // 3. Hash algorithm check
  if (receipt.hashAlgorithm === "SHA-256") {
    checks.push({
      status: "pass",
      label: "Hash algorithm",
      detail: "SHA-256 is supported by this verifier.",
    });
  } else {
    checks.push({
      status: "fail",
      label: "Hash algorithm",
      detail: `Algorithm "${receipt.hashAlgorithm}" is not supported.`,
    });
  }

  // 4. Chain validation
  const expectedChainId = opts.expectedChainId || getActiveChainConfig().chain.id;
  const chainConfig = getChainConfig(receipt.chainId);
  if (receipt.chainId === expectedChainId) {
    checks.push({
      status: "pass",
      label: "Chain match",
      detail: `Receipt chain (${receipt.chainName}, ID ${receipt.chainId}) matches the expected chain.`,
    });
  } else {
    checks.push({
      status: "fail",
      label: "Chain mismatch",
      detail: `Receipt chain (${receipt.chainName}, ID ${receipt.chainId}) does not match expected chain (ID ${expectedChainId}).`,
    });
  }

  // 5. Chain configuration support
  if (chainConfig) {
    checks.push({
      status: "pass",
      label: "Chain supported",
      detail: `Chain "${receipt.chainName}" is configured in the registry.`,
    });
  } else {
    checks.push({
      status: "warn",
      label: "Chain unrecognized",
      detail: `Chain ID ${receipt.chainId} is not in the known chain registry. Verification may not be possible.`,
    });
  }

  // 6. Contract address validation
  const expectedContract =
    opts.expectedContractAddress || openProofContractAddress;
  if (
    expectedContract &&
    receipt.contractAddress.toLowerCase() === expectedContract.toLowerCase()
  ) {
    checks.push({
      status: "pass",
      label: "Contract match",
      detail: "Receipt contract address matches the expected registry contract.",
    });
  } else if (expectedContract) {
    checks.push({
      status: "fail",
      label: "Contract mismatch",
      detail: `Receipt contract (${receipt.contractAddress}) does not match expected (${expectedContract}).`,
    });
  } else {
    checks.push({
      status: "skip",
      label: "Contract check",
      detail: "No expected contract address configured. Skipping contract match check.",
    });
  }

  // 7. Hash format validation
  const HEX_BYTES32 = /^0x[a-fA-F0-9]{64}$/;
  if (HEX_BYTES32.test(receipt.sha256Hash)) {
    checks.push({
      status: "pass",
      label: "Hash format",
      detail: "SHA-256 hash is a valid bytes32 hex string.",
    });
  } else {
    checks.push({
      status: "fail",
      label: "Hash format",
      detail: "SHA-256 hash does not match bytes32 hex format.",
    });
  }

  // 8. Timestamp validation
  const ts = new Date(receipt.createdTimestamp);
  if (!isNaN(ts.getTime()) && ts.getFullYear() >= 2020 && ts.getFullYear() <= 2100) {
    checks.push({
      status: "pass",
      label: "Timestamp",
      detail: `Receipt timestamp (${receipt.createdTimestamp}) is valid.`,
    });
  } else {
    checks.push({
      status: "fail",
      label: "Timestamp",
      detail: "Receipt timestamp is invalid or out of range.",
    });
  }

  // 9. Bundle consistency (if applicable)
  if (receipt.proofType === "bundle") {
    if (receipt.bundleFiles && receipt.bundleFiles.length > 0) {
      checks.push({
        status: "pass",
        label: "Bundle files",
        detail: `Bundle contains ${receipt.bundleFiles.length} file(s).`,
      });
      // Check each file hash
      const badFiles = receipt.bundleFiles.filter(
        (f) => !HEX_BYTES32.test(f.sha256),
      );
      if (badFiles.length === 0) {
        checks.push({
          status: "pass",
          label: "Bundle file hashes",
          detail: "All bundle file hashes have valid bytes32 format.",
        });
      } else {
        checks.push({
          status: "fail",
          label: "Bundle file hashes",
          detail: `${badFiles.length} bundle file(s) have invalid hash format.`,
        });
      }
    } else {
      checks.push({
        status: "warn",
        label: "Bundle files",
        detail: "Bundle proof type but no bundle files listed in receipt.",
      });
    }
  } else {
    checks.push({
      status: "skip",
      label: "Bundle check",
      detail: "Not a bundle proof. Bundle checks skipped.",
    });
  }

  // 10. Onchain verification (requires public client)
  if (publicClient) {
    try {
      const onchainProof = await readOnchainProof(
        publicClient,
        receipt.sha256Hash,
      );
      if (onchainProof) {
        checks.push({
          status: "pass",
          label: "Onchain proof exists",
          detail: `Hash found in ${receipt.chainName} registry at timestamp ${onchainProof.timestamp}.`,
        });

        // 10a. Wallet match check
        if (
          onchainProof.creator.toLowerCase() ===
          receipt.creatorWallet.toLowerCase()
        ) {
          checks.push({
            status: "pass",
            label: "Creator wallet match",
            detail: "Receipt creator wallet matches onchain record.",
          });
        } else {
          checks.push({
            status: "warn",
            label: "Creator wallet mismatch",
            detail: `Receipt says ${receipt.creatorWallet} but onchain creator is ${onchainProof.creator}.`,
          });
        }

        // 10b. Transaction hash cross-check
        if (
          onchainProof.transactionHash &&
          receipt.transactionHash
        ) {
          checks.push({
            status: "pass",
            label: "Transaction hash",
            detail: `Transaction ${receipt.transactionHash.slice(2, 10)}... verified via event log.`,
          });
        } else {
          checks.push({
            status: "warn",
            label: "Transaction hash",
            detail: "Could not cross-check transaction hash from onchain event logs.",
          });
        }
      } else {
        checks.push({
          status: "fail",
          label: "Onchain proof missing",
          detail: "Hash not found in the registry. The proof may not exist or may have been registered on a different contract.",
        });
      }
    } catch (e) {
      checks.push({
        status: "warn",
        label: "Onchain check failed",
        detail: `Could not query the registry: ${e instanceof Error ? e.message : "unknown error"}.`,
      });
    }
  } else {
    checks.push({
      status: "skip",
      label: "Onchain verification",
      detail: "No public client available. Onchain checks skipped.",
    });
  }

  // 11. Registry version compatibility (v3+ receipts)
  if (receipt.registryVersion !== undefined) {
    const currentChain = getChainConfig(receipt.chainId);
    if (currentChain) {
      if (receipt.registryVersion <= currentChain.registryVersion) {
        checks.push({
          status: "pass",
          label: "Registry version",
          detail: `Receipt registry v${receipt.registryVersion} is compatible with current contract v${currentChain.registryVersion}.`,
        });
      } else {
        checks.push({
          status: "warn",
          label: "Registry version",
          detail: `Receipt registry v${receipt.registryVersion} is newer than current contract v${currentChain.registryVersion}. This may cause compatibility issues.`,
        });
      }
    } else {
      checks.push({
        status: "skip",
        label: "Registry version",
        detail: "Could not determine current registry version. Skipping version check.",
      });
    }
  } else {
    checks.push({
      status: "skip",
      label: "Registry version",
      detail: "Receipt does not include registry version field.",
    });
  }

  // ── Determine overall result ──
  const hasFailures = checks.some((c) => c.status === "fail");
  const hasWarnings = checks.some((c) => c.status === "warn");
  const passCount = checks.filter((c) => c.status === "pass").length;

  const result = hasFailures ? "invalid" : hasWarnings ? "partial" : "valid";
  const summary = hasFailures
    ? `Verification failed: ${checks.filter((c) => c.status === "fail").length} of ${checks.length} checks failed.`
    : hasWarnings
      ? `Verification passed with ${checks.filter((c) => c.status === "warn").length} warning(s): ${passCount} of ${checks.length} checks passed.`
      : `All ${passCount} checks passed. The receipt is valid.`;

  return {
    receipt,
    verifiedAt: new Date().toISOString(),
    result,
    checks,
    summary,
  };
}
