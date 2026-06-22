"use client";

import { FileJson } from "lucide-react";
import { useRef, useState } from "react";
import { EmptyState } from "@/components/design-system";
import { validateProofReceipt, type ProofReceipt } from "@/lib/receipt";

export type ReceiptImportResult =
  | { status: "idle"; message: string }
  | { status: "error"; message: string }
  | { status: "valid"; receipt: ProofReceipt };

export function ReceiptImport({ onReceipt }: { onReceipt: (receipt: ProofReceipt) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [result, setResult] = useState<ReceiptImportResult>({
    status: "idle",
    message: "Import a downloaded OpenProof receipt JSON.",
  });
  const [isDragging, setIsDragging] = useState(false);

  async function importFile(file: File) {
    try {
      const parsed = JSON.parse(await file.text());
      const validation = validateProofReceipt(parsed);
      if (!validation.ok) { setResult({ status: "error", message: validation.reason }); return; }
      setResult({ status: "valid", receipt: validation.receipt });
      onReceipt(validation.receipt);
    } catch { setResult({ status: "error", message: "Receipt JSON is corrupted or unreadable." }); }
  }

  return (
    <div className="space-y-3">
      <div
        className={`rounded-2xl p-8 transition-all cursor-pointer ${
          isDragging ? "bg-accent/10 ring-2 ring-accent" : "bg-bg-surface-muted hover:bg-[#222]"
        }`}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => { e.preventDefault(); setIsDragging(false); const f = e.dataTransfer.files.item(0); if (f) importFile(f); }}
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          accept="application/json,.json"
          className="sr-only"
          type="file"
          onChange={(e) => { const f = e.target.files?.item(0); if (f) importFile(f); }}
        />
        <div className="flex flex-col items-center gap-3 text-center">
          <span className="grid size-14 place-items-center rounded-full bg-accent/10 text-accent">
            <FileJson className="size-6" />
          </span>
          <span className="font-bold">Drop receipt JSON or choose one</span>
          <span className="max-w-md text-sm leading-6 text-text-muted">
            OpenProof validates the local JSON schema, then checks the receipt hash against Base Sepolia.
          </span>
        </div>
      </div>
      {result.status === "error" ? (
        <p aria-live="assertive" className="rounded-2xl bg-error/5 border border-error/20 p-5 text-sm text-error">{result.message}</p>
      ) : result.status === "valid" ? (
        <p aria-live="polite" className="rounded-2xl bg-accent/5 p-5 text-sm text-accent font-semibold">Receipt schema valid. Checking onchain...</p>
      ) : (
        <EmptyState title="Receipt import" text={result.message} />
      )}
    </div>
  );
}
