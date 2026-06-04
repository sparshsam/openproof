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
    <div className="min-w-0 max-w-full overflow-hidden rounded-lg border border-border-default bg-bg-surface-muted p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs font-semibold uppercase text-text-muted">
          SHA-256 fingerprint
        </p>
        <button
          aria-label="Copy SHA-256 fingerprint"
          className="inline-flex items-center gap-1 rounded-[6px] border border-border-default bg-bg-surface px-3 py-1.5 text-xs font-semibold transition hover:border-accent hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          type="button"
          onClick={copyHash}
        >
          {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre
        className="max-w-full whitespace-pre-wrap break-all font-mono text-xs leading-6 text-text-primary [overflow-wrap:anywhere]"
        aria-label="SHA-256 hash value"
      >
        {value}
      </pre>
    </div>
  );
}
