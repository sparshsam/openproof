"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";

export function HashDisplay({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  async function copyHash() {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  }

  return (
    <div className="rounded-2xl bg-bg-surface-muted p-5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-semibold tracking-wide text-text-muted">SHA-256 fingerprint</p>
        <button
          aria-label="Copy SHA-256 fingerprint"
          className="inline-flex items-center gap-1.5 rounded-full bg-bg-surface px-4 py-2 text-xs font-semibold transition hover:bg-accent hover:text-white"
          type="button"
          onClick={copyHash}
        >
          {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="mt-4 max-w-full whitespace-pre-wrap break-all font-mono text-sm leading-7 text-text-secondary [overflow-wrap:anywhere]">
        {value}
      </pre>
    </div>
  );
}
