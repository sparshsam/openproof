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
    <div className="min-w-0 max-w-full overflow-hidden rounded-3xl border border-border bg-surface-muted p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
          SHA-256 fingerprint
        </p>
        <button
          aria-label="Copy SHA-256 fingerprint"
          className="inline-flex items-center gap-1 rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-semibold transition hover:border-base-blue hover:text-base-blue focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-base-blue"
          type="button"
          onClick={copyHash}
        >
          {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre
        className="max-w-full whitespace-pre-wrap break-all font-mono text-xs leading-6 text-foreground [overflow-wrap:anywhere]"
        aria-label="SHA-256 hash value"
      >
        {value}
      </pre>
    </div>
  );
}
