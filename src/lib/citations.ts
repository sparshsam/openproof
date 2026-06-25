// ── Citation format generation for proof receipts ──

import type { ProofReceipt } from "@/lib/receipt";
import { formatTimestampCitation } from "@/lib/time";

export type CitationStyle = "apa" | "mla" | "plain" | "legal";

type CitationResult = {
  citation: string;
  label: string;
};

/**
 * Generate a citation for a proof receipt in the requested format.
 */
export function generateCitation(
  receipt: ProofReceipt,
  style: CitationStyle,
): CitationResult {
  const hash = receipt.sha256Hash.slice(2, 14).toUpperCase();
  const url = receipt.verificationUrl;
  const date = formatTimestampCitation(receipt.createdTimestamp);
  const chain = receipt.chainName;

  switch (style) {
    case "apa":
      return {
        label: "APA 7th Edition",
        citation: [
          `OpenProof. (${new Date(receipt.createdTimestamp).getFullYear()}).`,
          ` *Proof of existence for file: ${receipt.fileName}*`,
          ` [Proof receipt; SHA-256: ${hash}].`,
          ` Registered on ${chain}.`,
          ` ${url}`,
        ].join(""),
      };

    case "mla":
      return {
        label: "MLA 9th Edition",
        citation: [
          `"${receipt.fileName} — Proof of Existence."`,
          ` *OpenProof*, ${chain},`,
          ` ${date},`,
          ` ${url}.`,
        ].join(" "),
      };

    case "legal":
      return {
        label: "Legal / Evidence",
        citation: [
          `PROOF OF EXISTENCE RECORD`,
          `File: ${receipt.fileName}`,
          `SHA-256: ${receipt.sha256Hash}`,
          `Registered: ${date}`,
          `Blockchain: ${chain} (Chain ID: ${receipt.chainId})`,
          `Contract: ${receipt.contractAddress}`,
          `Transaction: ${receipt.transactionHash}`,
          `Registered by: ${receipt.creatorWallet}`,
          `Verification: ${url}`,
        ].join("\n"),
      };

    case "plain":
    default:
      return {
        label: "Plain text",
        citation: [
          `Proof of existence — ${receipt.fileName}`,
          `SHA-256: ${receipt.sha256Hash}`,
          `Registered on ${chain} at ${date}`,
          `Verified at: ${url}`,
        ].join("\n"),
      };
  }
}

/**
 * Get all citation formats as an array.
 */
export function getAllCitations(
  receipt: ProofReceipt,
): CitationResult[] {
  const styles: CitationStyle[] = ["apa", "mla", "plain", "legal"];
  return styles.map((style) => generateCitation(receipt, style));
}
