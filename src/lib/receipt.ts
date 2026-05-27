export type ProofReceipt = {
  appName: "OpenProof";
  appVersion: string;
  fileName: string;
  fileSize: number;
  fileMimeType: string;
  sha256Hash: string;
  chainId: number;
  chainName: string;
  contractAddress: string;
  transactionHash: string;
  creatorWallet: string;
  createdTimestamp: string;
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
