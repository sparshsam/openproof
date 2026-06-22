"use client";

import Link from "next/link";
import { CheckCircle2, ExternalLink, Loader2, ShieldQuestion } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { usePublicClient } from "wagmi";
import {
  ExplorerLink, Label,
} from "@/components/design-system";
import { CopyButton } from "@/components/copy-button";
import { HashDisplay } from "@/components/hash-display";
import { ProofTimeline } from "@/components/proof-timeline";
import { ProofQrCode } from "@/components/qr-code";
import { openProofChain, openProofContractAddress } from "@/lib/contracts";
import { normalizeClientError } from "@/lib/errors";
import { addressExplorerUrl, transactionExplorerUrl } from "@/lib/explorer";
import { findProofTransactionHash, isBytes32Hash, readOnchainProof, type OnchainProof } from "@/lib/proofs";
import { formatLocalTimestamp } from "@/lib/time";

type LS =
  | { status: "loading" }
  | { status: "invalid" | "not-found" | "error"; message: string }
  | { status: "found"; proof: OnchainProof };

export function ProofExplorerClient({ hash }: { hash: string }) {
  const h = hash.toLowerCase();
  const pc = usePublicClient({ chainId: openProofChain.id });
  const [state, setState] = useState<LS>({ status: "loading" });
  const url = useMemo(() => (typeof window === "undefined" ? "" : window.location.href), []);

  useEffect(() => {
    async function load() {
      if (!isBytes32Hash(h)) { setState({ status: "invalid", message: "Invalid bytes32 hash." }); return; }
      if (!pc) return;
      try {
        const p = await readOnchainProof(pc, h);
        if (!p) { setState({ status: "not-found", message: "No proof found for this hash on Base Sepolia." }); return; }
        setState({ status: "found", proof: p });
        findProofTransactionHash(pc, h).then((tx) => { if (!tx) return; setState((s) => s.status === "found" && s.proof.fileHash === h ? { status: "found", proof: { ...s.proof, transactionHash: tx } } : s); }).catch(() => {});
      } catch (e) { setState({ status: "error", message: normalizeClientError(e, "Could not load proof.") }); }
    }
    load();
  }, [h, pc]);

  return (
    <main>
      <section className="mx-auto max-w-3xl px-6 pt-24 pb-10 sm:pt-32 sm:pb-14">
        <Label color="accent">Proof explorer</Label>
        <h1 className="mt-4 text-4xl font-black leading-tight tracking-tight sm:text-6xl">
          Shareable proof page<br /><span className="text-text-secondary">on Base Sepolia.</span>
        </h1>
        <p className="mt-5 max-w-xl text-base leading-relaxed text-text-secondary sm:text-lg">
          Anyone can check whether this fingerprint exists in the OpenProofRegistry contract.
        </p>
      </section>

      <section className="mx-auto max-w-3xl px-6 pb-24 sm:pb-32">
        {state.status === "loading" ? (
          <div className="flex items-center gap-3 py-8 text-sm text-text-secondary">
            <Loader2 className="size-5 animate-spin shrink-0" /> Checking the Base Sepolia registry...
          </div>
        ) : state.status === "found" ? (
          <div className="space-y-10">
            <div className="flex items-center gap-6">
              <CheckCircle2 className="size-14 text-accent shrink-0" />
              <div>
                <p className="text-3xl font-black text-accent sm:text-4xl">Proof found</p>
                <p className="mt-2 text-base text-text-secondary">Hash exists in the registry.</p>
              </div>
            </div>

            <ProofTimeline steps={[
              { title: "Proof URL opened", text: "Page contains a SHA-256 hash.", complete: true },
              { title: "Registry read completed", text: "Read the Base Sepolia contract.", complete: true },
              { title: "Timestamp confirmed", text: formatLocalTimestamp(state.proof.timestamp), complete: true },
            ]} />

            <dl className="grid gap-3 text-sm">
              <DataRow label="Creator wallet" value={state.proof.creator} />
              <DataRow label="Timestamp" value={formatLocalTimestamp(state.proof.timestamp)} />
              <DataRow label="Chain" value={openProofChain.name} />
              <DataRow label="Contract" value={openProofContractAddress || "not configured"} />
            </dl>

            <div className="flex flex-wrap gap-3">
              <CopyButton label="Copy hash" value={state.proof.fileHash} />
              <CopyButton label="Copy creator" value={state.proof.creator} />
              {state.proof.transactionHash ? <><ExplorerLink href={transactionExplorerUrl(state.proof.transactionHash)}>View on BaseScan</ExplorerLink><CopyButton label="Copy tx hash" value={state.proof.transactionHash} /></> : null}
              {openProofContractAddress ? (
                <a className="inline-flex items-center gap-2 rounded-full bg-bg-surface-muted px-5 py-3 text-sm font-semibold text-text-primary transition-all hover:bg-[#252525]" href={addressExplorerUrl(openProofContractAddress)} rel="noreferrer" target="_blank">
                  Registry contract <ExternalLink className="size-4" />
                </a>
              ) : null}
            </div>

            <HashDisplay value={h} />
            {url ? <ProofQrCode url={url} /> : null}

            <Link className="inline-flex items-center rounded-full bg-accent px-8 py-4 text-sm font-semibold text-white transition-all hover:bg-[#0099ee]" href="/create">Create another proof</Link>
          </div>
        ) : (
          <div className="py-12">
            <div className="flex items-center gap-6">
              <ShieldQuestion className="size-14 text-text-muted shrink-0" />
              <div>
                <p className="text-3xl font-black sm:text-4xl">
                  {state.status === "not-found" ? "Proof not found" : "Could not load proof"}
                </p>
                <p className="mt-2 text-base text-text-secondary">{state.message}</p>
              </div>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}

function DataRow({ label, value }: { label: string; value: string }) {
  return <div className="flex justify-between gap-4 py-3 border-b border-border-default"><span className="text-text-muted text-xs font-bold tracking-wider uppercase shrink-0">{label}</span><span className="text-right break-all font-mono text-sm">{value}</span></div>;
}
