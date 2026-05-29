export type ProofReceipt = {
  appName: "OpenProof";
  appVersion: string;
  proofType?: "single-file" | "bundle";
  fileName: string;
  fileSize: number;
  fileMimeType: string;
  sha256Hash: string;
  bundleFiles?: Array<{
    name: string;
    size: number;
    type: string;
    sha256: string;
  }>;
  chainId: number;
  chainName: string;
  contractAddress: string;
  transactionHash: string;
  transactionUrl: string;
  creatorWallet: string;
  createdTimestamp: string;
  verificationUrl: string;
  verificationInstructions: string;
};

export function buildProofReceipt(input: Omit<ProofReceipt, "appName" | "appVersion" | "verificationInstructions">): ProofReceipt {
  return {
    appName: "OpenProof",
    appVersion: "0.1.0",
    verificationInstructions:
      "Open OpenProof, choose Verify Proof, select the original file, and compare the locally generated SHA-256 hash against the onchain registry entry. The file must match exactly.",
    ...input,
  };
}

export type ReceiptValidation =
  | { ok: true; receipt: ProofReceipt }
  | { ok: false; reason: string };

export function validateProofReceipt(value: unknown): ReceiptValidation {
  if (!value || typeof value !== "object") {
    return { ok: false, reason: "Receipt is not a JSON object." };
  }

  const receipt = value as Record<string, unknown>;
  const requiredStringFields = [
    "appName",
    "appVersion",
    "fileName",
    "fileMimeType",
    "sha256Hash",
    "chainName",
    "contractAddress",
    "transactionHash",
    "transactionUrl",
    "creatorWallet",
    "createdTimestamp",
    "verificationUrl",
    "verificationInstructions",
  ];

  for (const field of requiredStringFields) {
    if (typeof receipt[field] !== "string") {
      return { ok: false, reason: `Missing or invalid field: ${field}.` };
    }
  }

  if (receipt.appName !== "OpenProof") {
    return { ok: false, reason: "Receipt was not created by OpenProof." };
  }

  if (typeof receipt.fileSize !== "number") {
    return { ok: false, reason: "Missing or invalid field: fileSize." };
  }

  if (typeof receipt.chainId !== "number") {
    return { ok: false, reason: "Missing or invalid field: chainId." };
  }

  if (!/^0x[a-fA-F0-9]{64}$/.test(String(receipt.sha256Hash))) {
    return { ok: false, reason: "Receipt hash is not a bytes32 SHA-256 value." };
  }

  if (!/^0x[a-fA-F0-9]{40}$/.test(String(receipt.contractAddress))) {
    return { ok: false, reason: "Contract address is malformed." };
  }

  if (!/^0x[a-fA-F0-9]{64}$/.test(String(receipt.transactionHash))) {
    return { ok: false, reason: "Transaction hash is malformed." };
  }

  return { ok: true, receipt: receipt as ProofReceipt };
}

export function downloadJson(filename: string, data: unknown) {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
