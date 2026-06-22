"use client";

import { Info } from "lucide-react";

export function HelperTooltip({ label, text }: { label: string; text: string }) {
  return (
    <span className="group relative inline-flex items-center gap-1.5 align-middle">
      <span className="text-xs font-semibold text-text-muted">{label}</span>
      <span
        aria-label={`${label}: ${text}`}
        className="grid size-5 place-items-center rounded-full border border-border-default bg-bg-surface text-text-muted transition group-hover:border-accent group-hover:text-accent"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === "Escape") (e.target as HTMLElement).blur(); }}
      >
        <Info className="size-3.5" />
      </span>
      <span className="pointer-events-none absolute bottom-full left-0 z-20 mb-2 hidden w-64 rounded-xl bg-bg-surface-muted p-3 text-xs leading-5 text-text-primary shadow-elevated group-hover:block group-focus-within:block">
        {text}
      </span>
    </span>
  );
}
