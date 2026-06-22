export type ProofType = "single-file" | "bundle";

export type BundleReceiptFile = {
  name: string;
  size: number;
  type: string;
  sha256: `0x${string}`;
};

export type ProofReceipt = {
  // --- Schema versioning ---
  schemaVersion: number;
  receiptVersion: number;
  appName: "OpenProof";
  appVersion: string;

  // --- Proof metadata ---
  proofType: ProofType;
  hashAlgorithm: "SHA-256";

  // --- File info ---
  fileName: string;
  fileSize: number;
  fileMimeType: string;
  sha256Hash: `0x${string}`;

  // --- Bundle info (bundle proofs only) ---
  bundleFiles?: BundleReceiptFile[];
  bundleRuleVersion?: number;

  // --- Onchain metadata ---
  chainId: number;
  chainName: string;
  contractAddress: `0x${string}`;
  transactionHash: `0x${string}`;
  transactionUrl: string;
  creatorWallet: `0x${string}`;

  // --- Timestamp ---
  createdTimestamp: string;

  // --- Verification links ---
  verificationUrl: string;
  verificationInstructions: string;
};

export function buildProofReceipt(
  input: Omit<
    ProofReceipt,
    "appName" | "appVersion" | "verificationInstructions"
  >,
): ProofReceipt {
  return {
    appName: "OpenProof",
    appVersion: "0.1.1",
    verificationInstructions:
      "Open OpenProof, choose Verify Proof, select the original file, and compare the locally generated SHA-256 hash against the onchain registry entry. The file must match exactly.",
    ...input,
  };
}

export type ReceiptValidation =
  | { ok: true; receipt: ProofReceipt }
  | { ok: false; reason: string };

const HEX_BYTES32 = /^0x[a-fA-F0-9]{64}$/;
const HEX_ADDRESS = /^0x[a-fA-F0-9]{40}$/;

function isPositiveInteger(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value > 0;
}

function isNonNegativeNumber(value: unknown): value is number {
  return typeof value === "number" && value >= 0 && !Number.isNaN(value);
}

function isValidISODate(value: string): boolean {
  if (typeof value !== "string" || !value) return false;
  const d = new Date(value);
  if (isNaN(d.getTime())) return false;
  const year = d.getUTCFullYear();
  // Reject dates before 2020 (pre-Ethereum) and after 2100.
  return year >= 2020 && year <= 2100;
}

type BundleFileRecord = {
  name: unknown;
  size: unknown;
  type: unknown;
  sha256: unknown;
};

export function validateProofReceipt(value: unknown): ReceiptValidation {
  if (!value || typeof value !== "object") {
    return { ok: false, reason: "Receipt is not a JSON object." };
  }

  const raw = value as Record<string, unknown>;
  const errors: string[] = [];

  // --- Required string fields ---
  const stringFields: Array<keyof typeof raw> = [
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

  for (const field of stringFields) {
    if (typeof raw[field] !== "string" || !raw[field]) {
      errors.push(`Missing or invalid field: ${field}.`);
    }
  }

  if (raw.appName !== "OpenProof") {
    errors.push("Receipt was not created by OpenProof.");
  }

  // --- Numeric fields ---
  if (!isNonNegativeNumber(raw.fileSize)) {
    errors.push("Missing or invalid field: fileSize.");
  }

  if (!isPositiveInteger(raw.chainId)) {
    errors.push("Missing or invalid field: chainId.");
  }

  // --- Optional version fields (validate when present) ---
  if (
    raw.schemaVersion !== undefined &&
    !isPositiveInteger(raw.schemaVersion)
  ) {
    errors.push("schemaVersion must be a positive integer.");
  }

  if (
    raw.receiptVersion !== undefined &&
    !isPositiveInteger(raw.receiptVersion)
  ) {
    errors.push("receiptVersion must be a positive integer.");
  }

  if (
    raw.hashAlgorithm !== undefined &&
    raw.hashAlgorithm !== "SHA-256"
  ) {
    errors.push(
      "Unsupported hashAlgorithm. OpenProof receipts use SHA-256.",
    );
  }

  if (
    raw.proofType !== undefined &&
    raw.proofType !== "single-file" &&
    raw.proofType !== "bundle"
  ) {
    errors.push("proofType must be 'single-file' or 'bundle'.");
  }

  // --- Hex format validations ---
  if (typeof raw.sha256Hash === "string" && !HEX_BYTES32.test(raw.sha256Hash)) {
    errors.push("sha256Hash is not a valid 64-character hex string.");
  }

  if (
    typeof raw.contractAddress === "string" &&
    !HEX_ADDRESS.test(raw.contractAddress)
  ) {
    errors.push(
      "contractAddress is not a valid 40-character hex address.",
    );
  }

  if (
    typeof raw.transactionHash === "string" &&
    !HEX_BYTES32.test(raw.transactionHash)
  ) {
    errors.push(
      "transactionHash is not a valid 64-character hex string.",
    );
  }

  if (
    typeof raw.creatorWallet === "string" &&
    !HEX_ADDRESS.test(raw.creatorWallet)
  ) {
    errors.push("creatorWallet is not a valid 40-character hex address.");
  }

  // --- Timestamp validation ---
  if (
    typeof raw.createdTimestamp === "string" &&
    !isValidISODate(raw.createdTimestamp)
  ) {
    errors.push(
      "createdTimestamp is not a valid date between 2020 and 2100.",
    );
  }

  // --- Bundle consistency ---
  const effectiveProofType: ProofType =
    raw.proofType === "bundle" || Array.isArray(raw.bundleFiles)
      ? "bundle"
      : "single-file";

  if (effectiveProofType === "bundle") {
    if (!Array.isArray(raw.bundleFiles)) {
      errors.push(
        "Receipt type is 'bundle' but bundleFiles is missing or not an array.",
      );
    } else if (raw.bundleFiles.length === 0) {
      errors.push("bundleFiles array is empty.");
    } else {
      for (let i = 0; i < raw.bundleFiles.length; i++) {
        const f = raw.bundleFiles[i];
        if (!f || typeof f !== "object") {
          errors.push(`bundleFiles[${i}] is not an object.`);
          continue;
        }
        const bf = f as BundleFileRecord;
        if (typeof bf.name !== "string" || !bf.name) {
          errors.push(`bundleFiles[${i}].name is missing or invalid.`);
        }
        if (!isNonNegativeNumber(bf.size)) {
          errors.push(`bundleFiles[${i}].size is missing or invalid.`);
        }
        if (typeof bf.type !== "string") {
          errors.push(`bundleFiles[${i}].type is missing or not a string.`);
        }
        if (typeof bf.sha256 !== "string" || !HEX_BYTES32.test(bf.sha256)) {
          errors.push(
            `bundleFiles[${i}].sha256 is not a valid 64-character hex string.`,
          );
        }
      }
    }
  }

  // --- Return aggregated errors ---
  if (errors.length > 0) {
    return { ok: false, reason: errors.join("; ") };
  }

  // --- Build canonical receipt with defaults for missing fields ---
  const normalizedProofType: ProofType =
    raw.proofType === "bundle" ? "bundle" : "single-file";

  const receipt: ProofReceipt = {
    schemaVersion:
      typeof raw.schemaVersion === "number" ? raw.schemaVersion : 1,
    receiptVersion:
      typeof raw.receiptVersion === "number" ? raw.receiptVersion : 1,
    appName: "OpenProof",
    appVersion: String(raw.appVersion),
    proofType: normalizedProofType,
    hashAlgorithm: "SHA-256",
    fileName: String(raw.fileName),
    fileSize: Number(raw.fileSize),
    fileMimeType: String(raw.fileMimeType),
    sha256Hash: String(raw.sha256Hash) as `0x${string}`,
    chainId: Number(raw.chainId),
    chainName: String(raw.chainName),
    contractAddress: String(raw.contractAddress) as `0x${string}`,
    transactionHash: String(raw.transactionHash) as `0x${string}`,
    transactionUrl: String(raw.transactionUrl),
    creatorWallet: String(raw.creatorWallet) as `0x${string}`,
    createdTimestamp: String(raw.createdTimestamp),
    verificationUrl: String(raw.verificationUrl),
    verificationInstructions: String(raw.verificationInstructions),
  };

  // --- Bundle fields ---
  if (raw.proofType === "bundle" || Array.isArray(raw.bundleFiles)) {
    if (Array.isArray(raw.bundleFiles) && raw.bundleFiles.length > 0) {
      receipt.bundleFiles = raw.bundleFiles.map(
        (f: unknown): BundleReceiptFile => {
          const bf = f as BundleFileRecord;
          return {
            name: String(bf.name),
            size: Number(bf.size),
            type: String(bf.type),
            sha256: String(bf.sha256) as `0x${string}`,
          };
        },
      );
    }
    receipt.bundleRuleVersion =
      typeof raw.bundleRuleVersion === "number"
        ? raw.bundleRuleVersion
        : 1;
  }

  return { ok: true, receipt };
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
