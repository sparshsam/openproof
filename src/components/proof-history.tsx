"use client";

import Link from "next/link";
import { Clock, ExternalLink, Trash2, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  clearProofHistory, getProofHistory, removeProofHistoryItem,
  type ProofHistoryItem, type ProofHistoryType,
} from "@/lib/history";
import { formatLocalTimestamp } from "@/lib/time";
import { proofPath } from "@/lib/proof-url";
import { ActionPill, EmptyState, StatusPill } from "@/components/design-system";

export function ProofHistory({ title, type }: { title: string; type: ProofHistoryType }) {
  const [items, setItems] = useState<ProofHistoryItem[]>([]);

  useEffect(() => {
    function refresh() { setItems(getProofHistory()); }
    refresh();
    window.addEventListener("storage", refresh);
    window.addEventListener("openproof:history-updated", refresh);
    return () => {
      window.removeEventListener("storage", refresh);
      window.removeEventListener("openproof:history-updated", refresh);
    };
  }, []);

  const filtered = useMemo(() => items.filter((i) => i.proofType === type), [items, type]);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-xl font-bold">{title}</h3>
          <p className="mt-1 text-sm text-text-muted">Stored only in this browser.</p>
        </div>
        <ActionPill disabled={filtered.length === 0} variant="secondary" onClick={() => clearProofHistory(type)}>
          <Trash2 className="size-4" />
          Clear
        </ActionPill>
      </div>

      {filtered.length ? (
        <div className="space-y-3">
          {filtered.map((item) => (
            <HistoryRow key={item.id} item={item} onRemove={() => removeProofHistoryItem(item.id)} />
          ))}
        </div>
      ) : (
        <EmptyState icon={Clock} title="No local history yet" text="Proofs and verifications you complete in this browser will appear here." />
      )}
    </div>
  );
}

function HistoryRow({ item, onRemove }: { item: ProofHistoryItem; onRemove: () => void }) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-2xl bg-bg-surface-muted p-5 transition hover:bg-[#222]">
      <div className="min-w-0 space-y-2">
        <div className="flex items-center gap-2">
          <p className="font-bold break-words">{item.fileName}</p>
          <StatusPill tone={item.proofType === "registered" ? "green" : "blue"}>{item.proofType}</StatusPill>
        </div>
        <p className="break-all font-mono text-xs text-text-muted">{item.fileHash}</p>
        <p className="text-xs text-text-muted">{item.chainName} &middot; {formatLocalTimestamp(item.timestamp)}</p>
        <div className="flex flex-wrap gap-2 pt-1">
          <Link className="rounded-full bg-bg-surface px-4 py-2 text-xs font-semibold transition hover:bg-accent hover:text-white" href={proofPath(item.fileHash)}>Proof page</Link>
          {item.baseScanUrl ? (
            <a className="inline-flex items-center gap-1.5 rounded-full bg-bg-surface px-4 py-2 text-xs font-semibold transition hover:bg-accent hover:text-white" href={item.baseScanUrl} rel="noreferrer" target="_blank">
              BaseScan <ExternalLink className="size-3" />
            </a>
          ) : null}
        </div>
      </div>
      <button
        aria-label="Remove"
        className="shrink-0 rounded-full border border-border-default p-2 text-text-muted transition hover:border-error hover:text-error"
        type="button"
        onClick={onRemove}
      >
        <X className="size-4" />
      </button>
    </div>
  );
}
