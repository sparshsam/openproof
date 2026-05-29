"use client";

import Link from "next/link";
import { Clock, ExternalLink, Trash2, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  clearProofHistory,
  getProofHistory,
  removeProofHistoryItem,
  type ProofHistoryItem,
  type ProofHistoryType,
} from "@/lib/history";
import { formatLocalTimestamp } from "@/lib/time";
import { proofPath } from "@/lib/proof-url";
import { ActionButton, EmptyState, StatusPill } from "@/components/design-system";

export function ProofHistory({
  title,
  type,
}: {
  title: string;
  type: ProofHistoryType;
}) {
  const [items, setItems] = useState<ProofHistoryItem[]>([]);

  useEffect(() => {
    function refresh() {
      setItems(getProofHistory());
    }

    refresh();
    window.addEventListener("storage", refresh);
    window.addEventListener("openproof:history-updated", refresh);
    return () => {
      window.removeEventListener("storage", refresh);
      window.removeEventListener("openproof:history-updated", refresh);
    };
  }, []);

  const filtered = useMemo(
    () => items.filter((item) => item.proofType === type),
    [items, type],
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-xl font-black tracking-tight">{title}</h3>
          <p className="mt-1 text-sm text-muted">
            Stored only in this browser. Nothing is uploaded.
          </p>
        </div>
        <ActionButton
          disabled={filtered.length === 0}
          variant="secondary"
          onClick={() => clearProofHistory(type)}
        >
          <Trash2 className="size-4" />
          Clear
        </ActionButton>
      </div>

      {filtered.length ? (
        <div className="grid gap-3">
          {filtered.map((item) => (
            <HistoryRow
              item={item}
              key={item.id}
              onRemove={() => removeProofHistoryItem(item.id)}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Clock}
          title="No local history yet"
          text="Proofs and verifications you complete in this browser will appear here."
        />
      )}
    </div>
  );
}

function HistoryRow({
  item,
  onRemove,
}: {
  item: ProofHistoryItem;
  onRemove: () => void;
}) {
  return (
    <article className="rounded-3xl border border-border bg-surface-muted p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="break-words font-semibold">{item.fileName}</p>
            <StatusPill tone={item.proofType === "registered" ? "green" : "blue"}>
              {item.proofType}
            </StatusPill>
          </div>
          <p className="mt-2 break-all font-mono text-xs text-muted">
            {item.fileHash}
          </p>
          <p className="mt-2 text-xs text-muted">
            {item.chainName} - {formatLocalTimestamp(item.timestamp)}
          </p>
        </div>
        <button
          aria-label="Remove local history item"
          className="rounded-full border border-border p-2 text-muted transition hover:border-danger hover:text-danger"
          type="button"
          onClick={onRemove}
        >
          <X className="size-4" />
        </button>
      </div>
      <div className="mt-4 flex flex-wrap gap-2 text-sm font-semibold">
        <Link
          className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-2 transition hover:border-base-blue hover:text-base-blue"
          href={proofPath(item.fileHash)}
        >
          Proof page
        </Link>
        {item.baseScanUrl ? (
          <a
            className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-2 transition hover:border-base-blue hover:text-base-blue"
            href={item.baseScanUrl}
            rel="noreferrer"
            target="_blank"
          >
            BaseScan
            <ExternalLink className="size-4" />
          </a>
        ) : null}
      </div>
    </article>
  );
}

