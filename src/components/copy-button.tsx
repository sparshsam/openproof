"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";

export function CopyButton({
  value, label, copiedLabel = "Copied", className = "", dark = false,
}: {
  value: string; label: string; copiedLabel?: string; className?: string; dark?: boolean;
}) {
  const [copied, setCopied] = useState(false);

  async function copyValue() {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  }

  return (
    <button
      aria-label={label}
      className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-all ${
        dark
          ? "bg-white/10 text-white hover:bg-white/20"
          : "bg-bg-surface-muted text-text-primary hover:bg-[#252525]"
      } ${className}`}
      type="button"
      onClick={copyValue}
    >
      <span aria-live="polite" className="inline-flex items-center gap-2">
        {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
        {copied ? copiedLabel : label}
      </span>
    </button>
  );
}
