"use client";

import Link from "next/link";
import type { Dispatch, SetStateAction } from "react";
import { CheckCircle2, CircleX, Loader2, SearchCheck, ShieldQuestion } from "lucide-react";
import { startTransition, useEffect, useState } from "react";
import type { PublicClient } from "viem";
import { usePublicClient } from "wagmi";
import { BaseSepoliaNotice } from "@/components/base-notice";
import {
  Badge, ExplorerLink, HelperTooltip, NetworkNotice,
  Section, StatusPill, Surface, ActionPill,
} from "@/components/design-system";
import { CopyButton } from "@/components/copy-button";
import { FileDrop } from "@/components/file-drop";
import { HashDisplay } from "@/components/hash-display";
import { ProofHistory } from "@/components/proof-history";
import { ProofTimeline } from "@/components/proof-timeline";
import { ReceiptImport } from "@/components/receipt-import";
import { transactionExplorerUrl } from "@/lib/explorer";
import { normalizeClientError } from "@/lib/errors";
import { formatBytes, hashFileSha256 } from "@/lib/hash";
import { isContractConfigured, openProofChain, openProofContractAddress } from "@/lib/contracts";
import { addProofHistoryItem } from "@/lib/history";
import { proofPath } from "@/lib/proof-url";
import { findProofTransactionHash, isBytes32Hash, readOnchainProof } from "@/lib/proofs";
import type { ProofReceipt } from "@/lib/receipt";
import { formatLocalTimestamp } from "@/lib/time";

type VerificationResult =
  | { status: "idle" | "loading" | "not-found"; message: string }
  | { status: "verified"; creator: string; timestamp: string; proofId: string; transactionHash?: string }
  | { status: "error"; message: string };

export default function VerifyProofPage() {
  const [file, setFile] = useState<File | null>(null);
  const [hash, setHash] = useState<`0x${string}` | null>(null);
  const [result, setResult] = useState<VerificationResult>({ status: "idle", message: "Select a file to verify." });
  const [receiptResult, setReceiptResult] = useState<VerificationResult>({ status: "idle", message: "Import a receipt JSON to validate it onchain." });
  const publicClient = usePublicClient({ chainId: openProofChain.id });
  const configured = isContractConfigured();

  // ── Hash file on selection ──────────────────────────
  useEffect(() => {
    if (!file) return;
    startTransition(() => { setHash(null); setResult({ status: "loading", message: "Hashing locally..." }); });
    hashFileSha256(file)
      .then((v) => { setHash(v); setResult({ status: "idle", message: "Hash ready. Query the registry." }); })
      .catch(() => setResult({ status: "error", message: "Could not hash file." }));
  }, [file]);

  async function verifyProof() {
    if (!hash || !openProofContractAddress || !publicClient) return;
    setResult({ status: "loading", message: "Checking Base Sepolia registry..." });
    try {
      const proof = await readOnchainProof(publicClient, hash);
      if (!proof) { setResult({ status: "not-found", message: "No matching proof found on Base Sepolia." }); return; }
      const vr: VerificationResult = { status: "verified", creator: proof.creator, timestamp: proof.timestamp, proofId: hash, transactionHash: proof.transactionHash };
      setResult(vr);
      hydrateTransactionHash(publicClient, hash, setResult);
      addProofHistoryItem({ proofType: "verified", fileName: file?.name || "Verified file", fileHash: hash, txHash: proof.transactionHash, chainName: openProofChain.name, chainId: openProofChain.id, timestamp: proof.timestamp, verificationUrl: `${window.location.origin}${proofPath(hash)}`, baseScanUrl: proof.transactionHash ? transactionExplorerUrl(proof.transactionHash) : undefined });
    } catch (e) { setResult({ status: "error", message: normalizeClientError(e, "Verification failed.") }); }
  }

  async function verifyReceipt(receipt: ProofReceipt) {
    if (!publicClient) return;
    setReceiptResult({ status: "loading", message: "Checking receipt hash..." });
    if (!isBytes32Hash(receipt.sha256Hash)) { setReceiptResult({ status: "error", message: "Receipt hash is malformed." }); return; }
    if (receipt.chainId !== openProofChain.id) { setReceiptResult({ status: "error", message: `Receipt is for chain ${receipt.chainId}, not ${openProofChain.name}.` }); return; }
    if (openProofContractAddress && receipt.contractAddress.toLowerCase() !== openProofContractAddress.toLowerCase()) { setReceiptResult({ status: "error", message: `Receipt contract does not match.` }); return; }
    try {
      const proof = await readOnchainProof(publicClient, receipt.sha256Hash);
      if (!proof) { setReceiptResult({ status: "not-found", message: "Receipt schema valid, but no onchain proof found." }); return; }
      const nr: VerificationResult = { status: "verified", creator: proof.creator, timestamp: proof.timestamp, proofId: receipt.sha256Hash, transactionHash: proof.transactionHash || receipt.transactionHash };
      setReceiptResult(nr);
      hydrateTransactionHash(publicClient, receipt.sha256Hash, setReceiptResult, receipt.transactionHash);
      addProofHistoryItem({ proofType: "verified", fileName: receipt.fileName, fileHash: receipt.sha256Hash, txHash: nr.transactionHash, chainName: receipt.chainName, chainId: receipt.chainId, timestamp: proof.timestamp, verificationUrl: receipt.verificationUrl, baseScanUrl: nr.transactionHash ? transactionExplorerUrl(nr.transactionHash) : receipt.transactionUrl });
    } catch (e) { setReceiptResult({ status: "error", message: normalizeClientError(e, "Receipt verification failed.") }); }
  }

  return (
    <main>
      <section className="mx-auto max-w-5xl px-6 pt-24 pb-16 sm:pt-32 sm:pb-20">
        <Badge tone="blue">Verify Proof</Badge>
        <h1 className="mt-5 text-4xl font-bold leading-tight tracking-tight sm:text-6xl">
          Verify a fingerprint<br /><span className="text-text-secondary">on Base Sepolia.</span>
        </h1>
        <p className="mt-5 max-w-xl text-lg leading-relaxed text-text-secondary">
          Public read. No wallet required. Check if a file hash was registered.
        </p>
        <div className="mt-6"><BaseSepoliaNotice /></div>
      </section>

      {/* ── File verification ─────────────────────────── */}
      <Section className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] !pt-0">
        <Surface>
          <div className="flex items-start justify-between gap-4">
            <div><Badge>No wallet required</Badge><h2 className="mt-4 text-2xl font-bold tracking-tight">Check an exact file match</h2></div>
            <StatusPill tone={result.status === "verified" ? "green" : result.status === "not-found" ? "red" : "blue"}>
              {result.status === "verified" ? "verified" : result.status === "not-found" ? "not found" : "Base Sepolia"}
            </StatusPill>
          </div>
          <div className="mt-7 space-y-6">
            <NetworkNotice title="Network: Base Sepolia" tone="muted">Checks the OpenProofRegistry contract. File never leaves your browser.</NetworkNotice>
            <div className="flex flex-wrap gap-3">
              <HelperTooltip label="File verification" text="Hash the file locally and check if the fingerprint exists onchain." />
              <HelperTooltip label="Bundle verification" text="Bundle proofs need the same exact file set." />
            </div>
            <FileDrop file={file} onFile={setFile} onError={(m) => setResult({ status: "error", message: m })} />
            {file ? (
              <div className="grid gap-4 sm:grid-cols-3">
                <div><p className="text-xs font-bold tracking-wider uppercase text-text-muted">Name</p><p className="mt-2 font-medium break-words">{file.name}</p></div>
                <div><p className="text-xs font-bold tracking-wider uppercase text-text-muted">Size</p><p className="mt-2 font-medium">{formatBytes(file.size)}</p></div>
                <div><p className="text-xs font-bold tracking-wider uppercase text-text-muted">Type</p><p className="mt-2 font-medium break-words">{file.type || "unknown"}</p></div>
              </div>
            ) : null}
            {hash ? <HashDisplay value={hash} /> : null}
            <ActionPill disabled={!configured || !hash || result.status === "loading"} onClick={verifyProof}>
              {result.status === "loading" ? <Loader2 className="size-4 animate-spin" /> : <SearchCheck className="size-4" />}
              Verify on Base Sepolia
            </ActionPill>
            {!configured ? <p className="text-sm text-text-muted">Set NEXT_PUBLIC_OPENPROOF_CONTRACT_ADDRESS.</p> : null}
          </div>
        </Surface>

        <Surface>
          {result.status === "verified" ? (
            <div aria-live="polite" className="space-y-6">
              <Badge tone="green">Verified</Badge>
              <div className="flex items-center gap-4">
                <CheckCircle2 className="size-10 text-accent shrink-0" />
                <div><h2 className="text-2xl font-bold tracking-tight text-accent">Proof found</h2><p className="mt-2 text-sm leading-relaxed text-text-secondary">Matching fingerprint registered on Base Sepolia.</p></div>
              </div>
              <ProofTimeline steps={[
                { title: "Local fingerprint matched", text: "File produced the displayed hash.", complete: true },
                { title: "Registry entry found", text: "Hash exists in OpenProofRegistry.", complete: true },
                { title: "Timestamp read", text: formatLocalTimestamp(result.timestamp), complete: true },
              ]} />
              <dl className="grid gap-3 text-sm">
                <DataRow label="Creator wallet" value={result.creator} />
                <DataRow label="Timestamp" value={formatLocalTimestamp(result.timestamp)} />
                <DataRow label="Proof ID" value={result.proofId} />
              </dl>
              <div className="flex flex-wrap gap-3">
                <Link className="rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-[#0099ee]" href={proofPath(result.proofId)}>Open proof page</Link>
                <CopyButton label="Copy hash" value={result.proofId} />
                <CopyButton label="Copy creator" value={result.creator} />
                {result.transactionHash ? <><ExplorerLink href={transactionExplorerUrl(result.transactionHash)}>View on BaseScan</ExplorerLink><CopyButton label="Copy tx hash" value={result.transactionHash} /></> : null}
              </div>
              {!result.transactionHash ? <p className="rounded-2xl bg-bg-surface-muted p-5 text-sm leading-relaxed text-text-secondary">Transaction link unavailable from public RPC.</p> : null}
            </div>
          ) : (
            <div>
              <Badge tone={result.status === "not-found" ? "red" : "blue"}>Verification status</Badge>
              <div className="mt-6">
                {result.status === "not-found" ? (
                  <div className="flex items-center gap-4">
                    <CircleX className="size-10 text-error shrink-0" />
                    <div><h2 className="text-2xl font-bold tracking-tight text-error">Not found</h2><p className="mt-2 text-sm leading-relaxed text-text-secondary">{result.message}</p></div>
                  </div>
                ) : (
                  <div className="flex items-center gap-4">
                    <ShieldQuestion className="size-10 text-text-muted shrink-0" />
                    <div><h2 className="text-2xl font-bold tracking-tight">Ready to check</h2><p className="mt-2 text-sm leading-relaxed text-text-secondary">{result.message}</p></div>
                  </div>
                )}
              </div>
            </div>
          )}
        </Surface>
      </Section>

      {/* ── Receipt import ─────────────────────────── */}
      <Section className="grid gap-10 lg:grid-cols-[1fr_1fr]">
        <Surface>
          <Badge>Receipt import</Badge>
          <h2 className="mt-4 text-2xl font-bold tracking-tight">Validate a downloaded receipt</h2>
          <p className="mt-3 text-sm leading-relaxed text-text-secondary">Import an OpenProof receipt JSON. Schema checked locally, hash checked onchain.</p>
          <div className="mt-6"><ReceiptImport onReceipt={verifyReceipt} /></div>
        </Surface>

        <Surface>
          {receiptResult.status === "verified" ? (
            <div className="space-y-6">
              <Badge tone="green">Valid receipt</Badge>
              <div className="flex items-center gap-4">
                <CheckCircle2 className="size-10 text-accent shrink-0" />
                <div><h2 className="text-2xl font-bold tracking-tight text-accent">Proof exists</h2><p className="mt-2 text-sm leading-relaxed text-text-secondary">Schema valid and hash found onchain.</p></div>
              </div>
              <ProofTimeline steps={[
                { title: "Receipt schema valid", text: "JSON matches OpenProof receipt shape.", complete: true },
                { title: "Onchain proof found", text: "Hash exists in OpenProofRegistry.", complete: true },
                { title: "Timestamp confirmed", text: formatLocalTimestamp(receiptResult.timestamp), complete: true },
              ]} />
              <dl className="grid gap-3 text-sm">
                <DataRow label="Creator wallet" value={receiptResult.creator} />
                <DataRow label="Timestamp" value={formatLocalTimestamp(receiptResult.timestamp)} />
                <DataRow label="Proof hash" value={receiptResult.proofId} />
                <DataRow label="Chain" value={openProofChain.name} />
              </dl>
              <div className="flex flex-wrap gap-3">
                <Link className="rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-[#0099ee]" href={proofPath(receiptResult.proofId)}>Open proof page</Link>
                <CopyButton label="Copy hash" value={receiptResult.proofId} />
                <CopyButton label="Copy creator" value={receiptResult.creator} />
                {receiptResult.transactionHash ? <><ExplorerLink href={transactionExplorerUrl(receiptResult.transactionHash)}>View on BaseScan</ExplorerLink><CopyButton label="Copy tx hash" value={receiptResult.transactionHash} /></> : null}
              </div>
            </div>
          ) : (
            <div className="rounded-2xl bg-bg-surface-muted p-12 text-center">
              <ShieldQuestion className="mx-auto mb-4 size-8 text-text-muted" />
              <p className="text-lg font-bold text-text-primary">
                {receiptResult.status === "not-found" ? "Not found onchain" : receiptResult.status === "error" ? "Invalid" : receiptResult.status === "loading" ? "Checking" : "Receipt status"}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-text-secondary max-w-md mx-auto">{receiptResult.message}</p>
            </div>
          )}
        </Surface>
      </Section>

      <Section><Surface><ProofHistory title="Recent Verifications" type="verified" /></Surface></Section>
    </main>
  );
}

function DataRow({ label, value }: { label: string; value: string }) {
  return <div className="rounded-2xl bg-bg-surface-muted p-4"><dt className="text-xs font-bold tracking-wider uppercase text-text-muted">{label}</dt><dd className="mt-2 break-words font-mono text-sm">{value}</dd></div>;
}

function hydrateTransactionHash(pc: PublicClient, h: `0x${string}`, sr: Dispatch<SetStateAction<VerificationResult>>, f?: string) {
  findProofTransactionHash(pc, h).then((tx) => { const n = tx || f; if (!n) return; sr((c) => c.status === "verified" && c.proofId === h ? { ...c, transactionHash: n } : c); }).catch(() => {});
}
