// ── OpenProof Archive Package Export ──
// Bundle a receipt + supporting metadata into a transferable archive.
// Supports JSON and standalone verification packages.

import type { ProofReceipt } from "@/lib/receipt";
import { migrateReceipt } from "@/lib/receipt";
import { generateCitation, type CitationStyle } from "@/lib/citations";

// ── Archive types ──

export type ArchivePackage = {
  formatVersion: number;
  createdAt: string;
  receipt: Record<string, unknown>;
  citations: Record<string, string>;
  metadata: {
    appVersion: string;
    exportedBy: "OpenProof";
    archiveType: "evidence-package";
    includes: string[];
  };
};

// ── Archive export ──

const APP_VERSION = "0.2.0";

/**
 * Build a complete archive package from a receipt.
 * Includes schema-migrated receipt, citations, and export metadata.
 */
export function buildArchivePackage(
  receipt: ProofReceipt,
  citationStyles?: CitationStyle[],
): ArchivePackage {
  const migrated = migrateReceipt(receipt as unknown as Record<string, unknown>);
  const styles = citationStyles || ["apa", "mla", "plain", "legal"];
  const citations: Record<string, string> = {};

  for (const style of styles) {
    const result = generateCitation(receipt, style);
    citations[style] = result.citation;
  }

  return {
    formatVersion: 1,
    createdAt: new Date().toISOString(),
    receipt: migrated,
    citations,
    metadata: {
      appVersion: APP_VERSION,
      exportedBy: "OpenProof",
      archiveType: "evidence-package",
      includes: [
        "receipt",
        "citations",
        "metadata",
      ],
    },
  };
}

/**
 * Download an archive package as a JSON file.
 */
export function downloadArchivePackage(
  receipt: ProofReceipt,
): void {
  const archive = buildArchivePackage(receipt);
  const blob = new Blob([JSON.stringify(archive, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `openproof-evidence-${receipt.sha256Hash.slice(2, 14)}.json`;
  link.click();
  URL.revokeObjectURL(url);
}

// ── Hash algorithm abstraction ──
// Prepared for future SHA migration (SHA-3, BLAKE3, etc.)

export type HashAlgorithm = "SHA-256";
export type HashAlgorithmConfig = {
  name: HashAlgorithm;
  webCryptoName: string;
  digestLength: number; // bytes
  hexPrefix: `0x${string}`;
  supported: boolean;
};

export const SUPPORTED_HASH_ALGORITHMS: Record<string, HashAlgorithmConfig> = {
  "SHA-256": {
    name: "SHA-256",
    webCryptoName: "SHA-256",
    digestLength: 32,
    hexPrefix: "0x",
    supported: true,
  },
  // Future algorithm slots (pre-configured, not active):
  // "SHA-384": { name: "SHA-384", webCryptoName: "SHA-384", digestLength: 48, hexPrefix: "0x", supported: false },
  // "BLAKE3":  { name: "BLAKE3",  webCryptoName: "",         digestLength: 32, hexPrefix: "0x", supported: false },
} as const;

export function isHashAlgorithmSupported(algorithm: string): boolean {
  return algorithm in SUPPORTED_HASH_ALGORITHMS &&
    SUPPORTED_HASH_ALGORITHMS[algorithm].supported;
}

export function getHashAlgorithmConfig(
  algorithm: string,
): HashAlgorithmConfig | undefined {
  return SUPPORTED_HASH_ALGORITHMS[algorithm];
}

// ── Long-term compatibility checks ──

export type CompatibilityCheck = {
  label: string;
  pass: boolean;
  detail: string;
};

export function checkReceiptCompatibility(
  receipt: ProofReceipt,
): CompatibilityCheck[] {
  const checks: CompatibilityCheck[] = [];

  // Schema version
  checks.push({
    label: "Schema version",
    pass: receipt.schemaVersion >= 1 && receipt.schemaVersion <= 3,
    detail: receipt.schemaVersion >= 3
      ? "Schema v3 includes forward-compatible metadata for long-term use."
      : `Schema v${receipt.schemaVersion} may lack forward-compatible fields.`,
  });

  // Hash algorithm
  checks.push({
    label: "Hash algorithm",
    pass: isHashAlgorithmSupported(receipt.hashAlgorithm),
    detail: `Algorithm "${receipt.hashAlgorithm}" is ${isHashAlgorithmSupported(receipt.hashAlgorithm) ? "supported" : "not supported"} by this verifier.`,
  });

  // Registry version
  if (receipt.registryVersion) {
    checks.push({
      label: "Registry version",
      pass: receipt.registryVersion >= 1,
      detail: `Registry v${receipt.registryVersion}. Versioned contracts enable future compatibility checks.`,
    });
  } else {
    checks.push({
      label: "Registry version",
      pass: false,
      detail: "Receipt lacks registry version field. Cannot verify contract version compatibility.",
    });
  }

  // Bundle rule version
  if (receipt.proofType === "bundle" && receipt.bundleRuleVersion !== undefined) {
    checks.push({
      label: "Bundle rule version",
      pass: receipt.bundleRuleVersion >= 1,
      detail: `Bundle rule v${receipt.bundleRuleVersion}. Deterministic rule ID enables future bundle re-verification.`,
    });
  }

  // Chain ID
  checks.push({
    label: "Chain ID",
    pass: receipt.chainId > 0,
    detail: `Chain ID ${receipt.chainId}. Positive integer enables cross-reference with chain registries.`,
  });

  return checks;
}
