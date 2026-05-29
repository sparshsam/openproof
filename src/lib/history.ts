"use client";

export type ProofHistoryType = "registered" | "verified";

export type ProofHistoryItem = {
  id: string;
  proofType: ProofHistoryType;
  fileName: string;
  fileHash: string;
  txHash?: string;
  chainName: string;
  chainId: number;
  timestamp: string;
  verificationUrl: string;
  baseScanUrl?: string;
};

const historyKey = "openproof:proof-history:v1";
const maxHistoryItems = 30;

function readHistory(): ProofHistoryItem[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(historyKey);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isHistoryItem);
  } catch {
    return [];
  }
}

function writeHistory(items: ProofHistoryItem[]) {
  window.localStorage.setItem(
    historyKey,
    JSON.stringify(items.slice(0, maxHistoryItems)),
  );
  window.dispatchEvent(new Event("openproof:history-updated"));
}

export function getProofHistory() {
  return readHistory();
}

export function addProofHistoryItem(item: Omit<ProofHistoryItem, "id">) {
  const id = `${item.proofType}:${item.fileHash}:${item.txHash || item.timestamp}`;
  const next = [
    { ...item, id },
    ...readHistory().filter((entry) => entry.id !== id),
  ];
  writeHistory(next);
}

export function clearProofHistory(type?: ProofHistoryType) {
  if (!type) {
    writeHistory([]);
    return;
  }

  writeHistory(readHistory().filter((entry) => entry.proofType !== type));
}

export function removeProofHistoryItem(id: string) {
  writeHistory(readHistory().filter((entry) => entry.id !== id));
}

function isHistoryItem(value: unknown): value is ProofHistoryItem {
  if (!value || typeof value !== "object") return false;
  const item = value as Record<string, unknown>;
  return (
    typeof item.id === "string" &&
    (item.proofType === "registered" || item.proofType === "verified") &&
    typeof item.fileName === "string" &&
    typeof item.fileHash === "string" &&
    typeof item.chainName === "string" &&
    typeof item.chainId === "number" &&
    typeof item.timestamp === "string" &&
    typeof item.verificationUrl === "string"
  );
}

