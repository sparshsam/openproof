"use client";

import Link from "next/link";
import type { Dispatch, SetStateAction } from "react";
import { CheckCircle2, CircleX, Loader2, SearchCheck } from "lucide-react";
import { startTransition, useEffect, useState } from "react";
import type { PublicClient } from "viem";
import { usePublicClient } from "wagmi";
import {
  ActionPill, ExplorerLink,
} from "@/components/design-system";
import { CopyButton } from "@/components/copy-button";
import { FileDrop } from "@/components/file-drop";
import { HashDisplay } from "@/components/hash-display";
import { ProofTimeline } from "@/components/proof-timeline";
import { transactionExplorerUrl } from "@/lib/explorer";
import { normalizeClientError } from "@/lib/errors";
import { formatBytes, hashFileSha256 } from "@/lib/hash";
import { isContractConfigured, openProofChain, openProofContractAddress } from "@/lib/contracts";
import { addProofHistoryItem } from "@/lib/history";
import { proofPath } from "@/lib/proof-url";
import { findProofTransactionHash, readOnchainProof } from "@/lib/proofs";
import { formatLocalTimestamp } from "@/lib/time";

type VResult =
  | { status: "idle" | "loading" | "not-found"; message: string }
  | { status: "verified"; creator: string; timestamp: string; proofId: string; transactionHash?: string }
  | { status: "error"; message: string };

/**
 * Core verify-proof form — file drop → hash → check onchain → result.
 * No hero header, no receipt import, no history. Meant to be embedded in any layout.
 */
export function VerifyProofForm() {
  const [file, setFile] = useState<File | null>(null);
  const [hash, setHash] = useState<`0x${string}` | null>(null);
  const [result, setResult] = useState<VResult>({ status: "idle", message: "Select a file to verify." });
  const pc = usePublicClient({ chainId: openProofChain.id });
  const configured = isContractConfigured();

  useEffect(() => {
    if (!file) return;
    startTransition(() => { setHash(null); setResult({ status: "loading", message: "Hashing locally..." }); });
    hashFileSha256(file).then((v) => { setHash(v); setResult({ status: "idle", message: "Hash ready. Query the registry." }); }).catch(() => setResult({ status: "error", message: "Could not hash file." }));
  }, [file]);

  async function verify() {
    if (!hash || !openProofContractAddress || !pc) return;
    setResult({ status: "loading", message: "Checking Base Sepolia..." });
    try {
      const p = await readOnchainProof(pc, hash);
      if (!p) { setResult({ status: "not-found", message: "No matching proof found." }); return; }
      const r: VResult = { status: "verified", creator: p.creator, timestamp: p.timestamp, proofId: hash, transactionHash: p.transactionHash };
      setResult(r);
      hydrateTx(pc, hash, setResult);
      addProofHistoryItem({ proofType: "verified", fileName: file?.name || "Verified file", fileHash: hash, txHash: p.transactionHash, chainName: openProofChain.name, chainId: openProofChain.id, timestamp: p.timestamp, verificationUrl: `${window.location.origin}${proofPath(hash)}`, baseScanUrl: p.transactionHash ? transactionExplorerUrl(p.transactionHash) : undefined });
    } catch (e) { setResult({ status: "error", message: normalizeClientError(e, "Verification failed.") }); }
  }

  return (
    <div className="space-y-6">
      <FileDrop file={file} onFile={setFile} onError={(m) => setResult({ status: "error", message: m })} />

      {file ? (
        <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm">
          <span><span className="text-text-muted">Name</span> <strong>{file.name}</strong></span>
          <span><span className="text-text-muted">Size</span> <strong>{formatBytes(file.size)}</strong></span>
          <span><span className="text-text-muted">Type</span> <strong>{file.type || "unknown"}</strong></span>
        </div>
      ) : null}

      {hash ? (
        <div className="space-y-6">
          <HashDisplay value={hash} />
          <ActionPill disabled={!configured || result.status === "loading"} onClick={verify}>
            {result.status === "loading" ? <Loader2 className="size-4 animate-spin" /> : <SearchCheck className="size-4" />}
            Verify on Base Sepolia
          </ActionPill>
        </div>
      ) : null}

      {/* ── Result (hero of the page) ──────────────── */}
      {result.status === "verified" ? (
        <div aria-live="polite" className="border-t border-border-default pt-10">
          <div className="flex items-center gap-6">
            <CheckCircle2 className="size-14 text-accent shrink-0" />
            <div>
              <p className="text-3xl font-black text-accent sm:text-4xl">Proof found</p>
              <p className="mt-2 text-base text-text-secondary">Matching fingerprint registered on Base Sepolia.</p>
            </div>
          </div>
          <ProofTimeline className="mt-8" steps={[
            { title: "Local fingerprint matched", text: "The selected file produced the displayed hash.", complete: true },
            { title: "Registry entry found", text: "Hash exists in OpenProofRegistry.", complete: true },
            { title: "Timestamp confirmed", text: formatLocalTimestamp(result.timestamp), complete: true },
          ]} />
          <dl className="mt-8 grid gap-3 text-sm">
            <DataRow label="Creator wallet" value={result.creator} />
            <DataRow label="Timestamp" value={formatLocalTimestamp(result.timestamp)} />
            <DataRow label="Proof ID" value={result.proofId} />
          </dl>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link className="rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-[#0099ee]" href={proofPath(result.proofId)}>Open proof page</Link>
            <CopyButton label="Copy hash" value={result.proofId} />
            <CopyButton label="Copy creator" value={result.creator} />
            {result.transactionHash ? <><ExplorerLink href={transactionExplorerUrl(result.transactionHash)}>View on BaseScan</ExplorerLink><CopyButton label="Copy tx hash" value={result.transactionHash} /></> : null}
          </div>
          {!result.transactionHash ? <p className="mt-6 text-sm text-text-muted">Transaction link unavailable from public RPC.</p> : null}
        </div>
      ) : result.status === "not-found" || result.status === "error" ? (
        <div aria-live="polite">
          <div className="flex items-center gap-6">
            <CircleX className="size-14 text-error shrink-0" />
            <div>
              <p className="text-3xl font-black text-error sm:text-4xl">{result.status === "not-found" ? "Not found" : "Error"}</p>
              <p className="mt-2 text-base text-text-secondary">{result.message}</p>
            </div>
          </div>
        </div>
      ) : result.status === "loading" ? (
        <p aria-live="polite" className="text-sm text-accent font-medium">Checking the registry...</p>
      ) : null}
    </div>
  );
}

function DataRow({ label, value }: { label: string; value: string }) {
  return <div className="flex justify-between gap-4 py-3 border-b border-border-default"><span className="text-text-muted text-xs font-bold tracking-wider uppercase shrink-0">{label}</span><span className="text-right break-all font-mono text-sm">{value}</span></div>;
}

function hydrateTx(pc: PublicClient, h: `0x${string}`, sr: Dispatch<SetStateAction<VResult>>, f?: string) {
  findProofTransactionHash(pc, h).then((res) => { const n = res?.transactionHash || f; if (!n) return; sr((c) => c.status === "verified" && c.proofId === h ? { ...c, transactionHash: n } : c); }).catch(() => {});
}
