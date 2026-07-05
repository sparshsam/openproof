"use client";

import { CheckCircle2 } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import type { Dispatch, SetStateAction } from "react";
import type { PublicClient } from "viem";
import { usePublicClient } from "wagmi";
import {
  ExplorerLink,
  Label,
} from "@/components/design-system";
import { CopyButton } from "@/components/copy-button";
import { ProofTimeline } from "@/components/proof-timeline";
import { ReceiptImport } from "@/components/receipt-import";
import { VerifyProofForm } from "@/components/verify-proof-form";
import { transactionExplorerUrl } from "@/lib/explorer";
import { normalizeClientError } from "@/lib/errors";
import { openProofChain, openProofContractAddress } from "@/lib/contracts";
import { addProofHistoryItem } from "@/lib/history";
import { proofPath } from "@/lib/proof-url";
import { findProofTransactionHash, isBytes32Hash, readOnchainProof } from "@/lib/proofs";
import type { ProofReceipt } from "@/lib/receipt";
import { formatLocalTimestamp } from "@/lib/time";

type VResult =
  | { status: "idle" | "loading" | "not-found"; message: string }
  | { status: "verified"; creator: string; timestamp: string; proofId: string; transactionHash?: string }
  | { status: "error"; message: string };

export default function VerifyProofPage() {
  const [receiptResult, setReceiptResult] = useState<VResult>({ status: "idle", message: "Import a receipt to validate it onchain." });
  const pc = usePublicClient({ chainId: openProofChain.id });

  async function verifyReceipt(receipt: ProofReceipt) {
    if (!pc) return;
    setReceiptResult({ status: "loading", message: "Checking receipt hash..." });
    if (!isBytes32Hash(receipt.sha256Hash)) { setReceiptResult({ status: "error", message: "Receipt hash malformed." }); return; }
    if (receipt.chainId !== openProofChain.id) { setReceiptResult({ status: "error", message: `Receipt is for chain ${receipt.chainId}, not ${openProofChain.name}.` }); return; }
    if (openProofContractAddress && receipt.contractAddress.toLowerCase() !== openProofContractAddress.toLowerCase()) { setReceiptResult({ status: "error", message: "Receipt contract mismatch." }); return; }
    try {
      const p = await readOnchainProof(pc, receipt.sha256Hash);
      if (!p) { setReceiptResult({ status: "not-found", message: "No matching onchain proof." }); return; }
      const nr: VResult = { status: "verified", creator: p.creator, timestamp: p.timestamp, proofId: receipt.sha256Hash, transactionHash: p.transactionHash || receipt.transactionHash };
      setReceiptResult(nr);
      hydrateTx(pc, receipt.sha256Hash, setReceiptResult, receipt.transactionHash);
      addProofHistoryItem({ proofType: "verified", fileName: receipt.fileName, fileHash: receipt.sha256Hash, txHash: nr.transactionHash, chainName: receipt.chainName, chainId: receipt.chainId, timestamp: p.timestamp, verificationUrl: receipt.verificationUrl, baseScanUrl: nr.transactionHash ? transactionExplorerUrl(nr.transactionHash) : receipt.transactionUrl });
    } catch (e) { setReceiptResult({ status: "error", message: normalizeClientError(e, "Verification failed.") }); }
  }

  return (
    <main>
      {/* ── Header ────────────────────────────────────── */}
      <section className="mx-auto max-w-3xl px-6 pt-24 pb-10 sm:pt-32 sm:pb-14">
        <Label color="accent">Verify Proof</Label>
        <h1 className="mt-4 text-4xl font-black leading-tight tracking-tight sm:text-6xl">
          Check a fingerprint<br /><span className="text-text-secondary">on Base Sepolia.</span>
        </h1>
        <p className="mt-5 max-w-xl text-base leading-relaxed text-text-secondary sm:text-lg">
          Public read. No wallet required. Hash a file locally and check whether
          its fingerprint exists in the onchain registry. Prove a file is unchanged
          since it was registered.
        </p>
      </section>

      {/* ── Scanner ─────────────────────────────────────── */}
      <section className="mx-auto max-w-3xl px-6 pb-24 sm:pb-32">
        <VerifyProofForm />
      </section>

      {/* ── Receipt import — secondary flow ─────────── */}
      <section className="border-t border-border-default">
        <div className="mx-auto max-w-3xl px-6 py-16 sm:py-20">
          <Label color="accent">Receipt import</Label>
          <h2 className="mt-4 text-2xl font-bold sm:text-3xl">Validate a downloaded receipt</h2>
          <p className="mt-3 max-w-lg text-sm leading-relaxed text-text-secondary">
            Import an OpenProof receipt JSON. Schema checked locally, hash checked onchain.
          </p>
          <div className="mt-8"><ReceiptImport onReceipt={verifyReceipt} /></div>

          {receiptResult.status === "verified" ? (
            <div className="mt-8">
              <div className="flex items-center gap-6">
                <CheckCircle2 className="size-12 text-accent shrink-0" />
                <div>
                  <p className="text-2xl font-black text-accent">Receipt valid</p>
                  <p className="mt-1 text-sm text-text-secondary">Schema valid and hash found onchain.</p>
                </div>
              </div>
              <ProofTimeline className="mt-6" steps={[
                { title: "Receipt schema valid", text: "JSON matches OpenProof receipt shape.", complete: true },
                { title: "Onchain proof found", text: "Hash exists in OpenProofRegistry.", complete: true },
                { title: "Timestamp confirmed", text: formatLocalTimestamp(receiptResult.timestamp), complete: true },
              ]} />
              <dl className="mt-6 grid gap-3 text-sm">
                <DataRow label="Creator wallet" value={receiptResult.creator} />
                <DataRow label="Timestamp" value={formatLocalTimestamp(receiptResult.timestamp)} />
                <DataRow label="Proof hash" value={receiptResult.proofId} />
                <DataRow label="Chain" value={openProofChain.name} />
              </dl>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link className="rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-[#0099ee]" href={proofPath(receiptResult.proofId)}>Open proof page</Link>
                <CopyButton label="Copy hash" value={receiptResult.proofId} />
                <CopyButton label="Copy creator" value={receiptResult.creator} />
                {receiptResult.transactionHash ? <><ExplorerLink href={transactionExplorerUrl(receiptResult.transactionHash)}>View on BaseScan</ExplorerLink><CopyButton label="Copy tx hash" value={receiptResult.transactionHash} /></> : null}
              </div>
            </div>
          ) : receiptResult.status === "not-found" ? (
            <p className="mt-6 text-sm text-error font-medium">{receiptResult.message}</p>
          ) : receiptResult.status === "error" ? (
            <p className="mt-6 text-sm text-error">{receiptResult.message}</p>
          ) : receiptResult.status === "loading" ? (
            <p className="mt-6 text-sm text-accent">Checking...</p>
          ) : null}
        </div>
      </section>
    </main>
  );
}

function DataRow({ label, value }: { label: string; value: string }) {
  return <div className="flex justify-between gap-4 py-3 border-b border-border-default"><span className="text-text-muted text-xs font-bold tracking-wider uppercase shrink-0">{label}</span><span className="text-right break-all font-mono text-sm">{value}</span></div>;
}

function hydrateTx(pc: PublicClient, h: `0x${string}`, sr: Dispatch<SetStateAction<VResult>>, f?: string) {
  findProofTransactionHash(pc, h).then((res) => { const n = res?.transactionHash || f; if (!n) return; sr((c) => c.status === "verified" && c.proofId === h ? { ...c, transactionHash: n } : c); }).catch(() => {});
}
