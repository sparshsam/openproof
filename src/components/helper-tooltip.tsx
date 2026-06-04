"use client";

import { Info } from "lucide-react";

export function HelperTooltip({
  label,
  text,
}: {
  label: string;
  text: string;
}) {
  function handleKeyDown(event: React.KeyboardEvent) {
    if (event.key === "Escape") {
      (event.target as HTMLElement).blur();
    }
  }

  return (
    <span className="group relative inline-flex items-center gap-1.5 align-middle">
      <span className="text-xs font-semibold text-text-muted">{label}</span>
      <span
        aria-label={`${label}: ${text}`}
        className="grid size-5 place-items-center rounded-[4px] border border-border-default bg-bg-surface text-text-muted transition group-hover:border-accent group-hover:text-accent group-focus-within:border-accent group-focus-within:text-accent"
        role="button"
        tabIndex={0}
        onKeyDown={handleKeyDown}
      >
        <Info className="size-3.5" />
      </span>
      <span className="pointer-events-none absolute bottom-full left-0 z-20 mb-2 hidden w-64 rounded-lg border border-border-default bg-bg-surface p-3 text-xs leading-5 text-text-primary shadow-xl group-hover:block group-focus-within:block">
        {text}
      </span>
    </span>
  );
}
