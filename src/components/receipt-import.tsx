"use client";

import { FileJson } from "lucide-react";
import { useRef, useState } from "react";
import { EmptyState } from "@/components/design-system";
import { validateProofReceipt, type ProofReceipt } from "@/lib/receipt";

export type ReceiptImportResult =
  | { status: "idle"; message: string }
  | { status: "error"; message: string }
  | { status: "valid"; receipt: ProofReceipt };

export function ReceiptImport({
  onReceipt,
}: {
  onReceipt: (receipt: ProofReceipt) => void;
}) {
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
      if (!validation.ok) {
        setResult({ status: "error", message: validation.reason });
        return;
      }
      setResult({ status: "valid", receipt: validation.receipt });
      onReceipt(validation.receipt);
    } catch {
      setResult({ status: "error", message: "Receipt JSON is corrupted or unreadable." });
    }
  }

  return (
    <div className="space-y-3">
      <div
        className={`rounded-lg border border-dashed p-6 transition ${
          isDragging
            ? "border-accent bg-accent/10"
            : "border-accent/25 bg-bg-surface hover:border-accent/60"
        }`}
        onDragLeave={() => setIsDragging(false)}
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDrop={(event) => {
          event.preventDefault();
          setIsDragging(false);
          const file = event.dataTransfer.files.item(0);
          if (file) importFile(file);
        }}
      >
        <input
          ref={inputRef}
          accept="application/json,.json"
          className="sr-only"
          type="file"
          onChange={(event) => {
            const file = event.target.files?.item(0);
            if (file) importFile(file);
          }}
        />
        <button
          className="flex w-full flex-col items-center gap-3 text-center"
          type="button"
          onClick={() => inputRef.current?.click()}
        >
          <span className="grid size-14 place-items-center rounded-lg bg-accent text-[#0a0a0a]">
            <FileJson className="size-6" />
          </span>
          <span className="font-semibold">Drop receipt JSON or choose one</span>
          <span className="max-w-md text-sm leading-6 text-text-muted">
            OpenProof validates the local JSON schema first, then checks the
            receipt hash against Base Sepolia.
          </span>
        </button>
      </div>
      {result.status === "error" ? (
        <p aria-live="assertive" className="rounded-lg border border-error/30 bg-error/10 p-4 text-sm text-error">
          {result.message}
        </p>
      ) : result.status === "valid" ? (
        <p aria-live="polite" className="rounded-lg border border-success/30 bg-success/10 p-4 text-sm text-success">
          Receipt schema is valid. Checking onchain state...
        </p>
      ) : (
        <EmptyState icon={FileJson} title="Receipt import" text={result.message} />
      )}
    </div>
  );
}
