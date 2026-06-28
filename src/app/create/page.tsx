"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Download, Loader2, ShieldCheck } from "lucide-react";
import { startTransition, useEffect, useMemo, useRef, useState } from "react";
import {
  useAccount, useChainId, usePublicClient, useSwitchChain,
  useWaitForTransactionReceipt, useWriteContract,
} from "wagmi";
import {
  ActionPill, ExplorerLink, Label,
} from "@/components/design-system";
import { CopyButton } from "@/components/copy-button";
import { FileDrop } from "@/components/file-drop";
import { HashDisplay } from "@/components/hash-display";
import { ProofHistory } from "@/components/proof-history";
import { ProofTimeline } from "@/components/proof-timeline";
import { ProofQrCode } from "@/components/qr-code";
import { transactionExplorerUrl } from "@/lib/explorer";
import { genericWalletErrorMessage, normalizeClientError } from "@/lib/errors";
import { formatBytes, hashFileSha256 } from "@/lib/hash";
import { hashBundleFiles, type BundleManifest, type BundleResult } from "@/lib/bundle";
import { addProofHistoryItem } from "@/lib/history";
import {
  expectedChainId, isContractConfigured, openProofAbi,
  openProofChain, openProofContractAddress,
} from "@/lib/contracts";
import { isWalletConnectConfigured } from "@/components/providers/wallet-provider";
import { buildProofReceipt, downloadJson, type ProofReceipt } from "@/lib/receipt";
import { formatLocalTimestamp } from "@/lib/time";
import { proofUrl } from "@/lib/proof-url";
import { storeBundleManifest } from "@/lib/bundle-storage";

export default function CreateProofPage() {
  const [file, setFile] = useState<File | null>(null);
  const [bundleFiles, setBundleFiles] = useState<File[]>([]);
  const [bundleManifest, setBundleManifest] = useState<BundleManifest | null>(null);
  const [hash, setHash] = useState<`0x${string}` | null>(null);
  const [hashError, setHashError] = useState<string | null>(null);
  const [receipt, setReceipt] = useState<ProofReceipt | null>(null);
  const autoDl = useRef(false);
  const [preflightMsg, setPreflightMsg] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const pc = usePublicClient({ chainId: openProofChain.id });
  const { switchChain, isPending: isSwitching } = useSwitchChain();
  const { writeContract, data: txHash, error, isPending } = useWriteContract();
  const { data: txReceipt, isLoading: isConfirming } = useWaitForTransactionReceipt({ hash: txHash, chainId: openProofChain.id });

  const configured = isContractConfigured();
  const isWrong = isConnected && chainId !== expectedChainId;
  const isBundle = bundleFiles.length > 1;
  const totalSz = bundleFiles.reduce((s, f) => s + f.size, 0);

  // ── Hash file(s) on selection ─────────────────────────
  useEffect(() => {
    if (!file && !bundleFiles.length) return;
    startTransition(() => { setHash(null); setHashError(null); setReceipt(null); setPreflightMsg(null); setBundleManifest(null); });
    autoDl.current = false;
    if (isBundle) {
      hashBundleFiles(bundleFiles).then((result: BundleResult) => { setHash(result.bundleHash); setBundleManifest(result.manifest); }).catch((e) => setHashError(e instanceof Error ? e.message : "Could not hash bundle."));
    } else if (file) {
      hashFileSha256(file).then(setHash).catch((e) => setHashError(e instanceof Error ? e.message : "Could not hash file."));
    }
  }, [bundleFiles, file, isBundle]);

  // ── Build receipt after tx confirms ─────────────────
  useEffect(() => {
    async function load() {
      if (!file || !hash || !address || !txHash || !txReceipt || !pc || !openProofContractAddress) return;
      let ts: string;
      try { const b = await pc.getBlock({ blockHash: txReceipt.blockHash }); ts = new Date(Number(b.timestamp) * 1000).toISOString(); }
      catch { ts = new Date().toISOString(); }
      setReceipt(buildProofReceipt({
        schemaVersion: 2, receiptVersion: 2, hashAlgorithm: "SHA-256", fileName: file.name, fileSize: isBundle ? totalSz : file.size,
        fileMimeType: isBundle ? "application/vnd.openproof.bundle+json" : file.type || "unknown", proofType: isBundle ? "bundle" : "single-file",
        bundleFiles: bundleManifest?.files, bundleRuleVersion: isBundle ? 1 : undefined, sha256Hash: hash, chainId: openProofChain.id,
        chainName: openProofChain.name, contractAddress: openProofContractAddress, transactionHash: txHash,
        transactionUrl: transactionExplorerUrl(txHash), creatorWallet: address, createdTimestamp: ts,
        verificationUrl: proofUrl(hash, window.location.origin),
      }));
    }
    load().catch(() => {});
  }, [address, bundleManifest?.files, file, hash, isBundle, pc, totalSz, txHash, txReceipt]);

  // ── Auto-download + history + bundle storage ──────
  useEffect(() => {
    if (!receipt || autoDl.current) return;
    autoDl.current = true;
    downloadJson(`openproof-${receipt.sha256Hash.slice(2, 10)}.json`, receipt);
    addProofHistoryItem({ proofType: "registered", fileName: receipt.fileName, fileHash: receipt.sha256Hash, txHash: receipt.transactionHash, chainName: receipt.chainName, chainId: receipt.chainId, timestamp: receipt.createdTimestamp, verificationUrl: receipt.verificationUrl, baseScanUrl: receipt.transactionUrl });
    // Store bundle manifest for bundle proof explorer
    if (isBundle && bundleManifest) {
      storeBundleManifest(receipt.sha256Hash, bundleManifest);
    }
  }, [receipt, isBundle, bundleManifest]);

  const statusText = useMemo(() => {
    if (hashError) return hashError;
    if ((file || bundleFiles.length) && !hash) return "Hashing locally...";
    if (isChecking) return "Checking registry...";
    if (isPending) return "Confirm in wallet.";
    if (isConfirming) return "Waiting for confirmation...";
    if (receipt) return "Registered on Base Sepolia.";
    return "Select a file to begin.";
  }, [bundleFiles.length, file, hash, hashError, isChecking, isConfirming, isPending, receipt]);

  async function register() {
    if (!hash || !openProofContractAddress || !pc || isWrong) return;
    setPreflightMsg(null); setIsChecking(true);
    try {
      const exists = await pc.readContract({ abi: openProofAbi, address: openProofContractAddress, functionName: "proofExists", args: [hash] });
      if (exists) {
        const p = await pc.readContract({ abi: openProofAbi, address: openProofContractAddress, functionName: "getProof", args: [hash] });
        setPreflightMsg(`Already registered by ${p.creator} at ${new Date(Number(p.timestamp) * 1000).toLocaleString()}.`);
        return;
      }
      writeContract({ abi: openProofAbi, address: openProofContractAddress, functionName: "registerProof", args: [hash], chainId: openProofChain.id });
    } catch (e) { setPreflightMsg(normalizeClientError(e, "Could not check. Try again.")); }
    finally { setIsChecking(false); }
  }

  const canReg = configured && Boolean(hash) && isConnected && !isWrong && isWalletConnectConfigured && !isChecking && !isPending && !isConfirming;

  return (
    <main>
      {/* ── Header ────────────────────────────────────── */}
      <section className="mx-auto max-w-3xl px-6 pt-24 pb-12 sm:pt-32 sm:pb-16">
        <Label color="accent">Create Proof</Label>
        <h1 className="mt-4 text-4xl font-black leading-tight tracking-tight sm:text-6xl">
          Register a file fingerprint
          <br /><span className="text-text-secondary">on Base Sepolia.</span>
        </h1>
        <p className="mt-5 max-w-xl text-base leading-relaxed text-text-secondary sm:text-lg">
          Timestamp a SHA-256 fingerprint onchain. The file never leaves your browser.
        </p>
      </section>

      {/* ── Transaction flow — vertical, no cards ────── */}
      <section className="mx-auto max-w-3xl px-6 pb-24 sm:pb-32">
        {/* Step 1 + 2: File + Hash */}
        <div className="space-y-6">
          <FileDrop
            file={file} files={bundleFiles} multiple
            onFile={(f) => { setHashError(null); setFile(f); setBundleFiles([f]); }}
            onFiles={(fs) => { setHashError(null); setBundleFiles(fs); setFile(fs[0] || null); }}
            onError={setHashError}
          />

          {file ? (
            <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm">
              <span><span className="text-text-muted">Name</span> <strong>{file.name}</strong></span>
              <span><span className="text-text-muted">Size</span> <strong>{formatBytes(isBundle ? totalSz : file.size)}</strong></span>
              <span><span className="text-text-muted">Type</span> <strong>{isBundle ? `${bundleFiles.length} files` : file.type || "unknown"}</strong></span>
            </div>
          ) : null}

          {hash ? <HashDisplay value={hash} /> : null}
        </div>

        {/* Step 3: Connect + Register */}
        <div className="mt-10 border-t border-border-default pt-10">
          <div className="flex flex-wrap items-center gap-4">
            <ConnectButton />
            {isWrong ? (
              <ActionPill disabled={isSwitching} variant="secondary" onClick={() => switchChain({ chainId: openProofChain.id })}>
                {isSwitching ? "Switching..." : "Switch to Base Sepolia"}
              </ActionPill>
            ) : (
              <ActionPill disabled={!canReg} onClick={register}>
                {isChecking || isPending || isConfirming ? <Loader2 className="size-4 animate-spin" /> : <ShieldCheck className="size-4" />}
                {isChecking ? "Checking" : isBundle ? "Register bundle" : "Register proof"}
              </ActionPill>
            )}
          </div>
          <p className="mt-4 text-xs text-text-muted">Base Sepolia testnet &middot; No real funds required</p>
        </div>

        {/* Status line */}
        {statusText && !receipt ? (
          <p aria-live="polite" className={`mt-6 text-sm font-medium ${hashError ? "text-error" : isPending || isConfirming || isChecking ? "text-accent" : "text-text-muted"}`}>
            {statusText}
          </p>
        ) : null}

        {/* WalletConnect warning */}
        {!isWalletConnectConfigured ? (
          <div className="mt-6 text-sm text-error">
            <p className="font-bold">WalletConnect not configured.</p>
            <p className="mt-1 text-text-secondary">Set NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID.</p>
          </div>
        ) : null}

        {/* Preflight */}
        {preflightMsg ? (
          <p aria-live="polite" className="mt-6 text-sm text-accent">{preflightMsg}</p>
        ) : null}

        {/* Tx error */}
        {error ? (
          <p aria-live="assertive" className="mt-6 text-sm text-error">{normalizeClientError(error, genericWalletErrorMessage)}</p>
        ) : null}

        {/* Manual fallback */}
        {txHash && !receipt ? (
          <div className="mt-6 space-y-3">
            <p className="font-mono text-xs text-text-muted break-all">Tx: {txHash}</p>
            {txReceipt ? <ActionPill variant="secondary" onClick={() => {
              if (!file || !hash || !address || !openProofContractAddress) return;
              setReceipt(buildProofReceipt({
                schemaVersion: 2, receiptVersion: 2, hashAlgorithm: "SHA-256", fileName: file.name, fileSize: isBundle ? totalSz : file.size,
                fileMimeType: isBundle ? "application/vnd.openproof.bundle+json" : file.type || "unknown", proofType: isBundle ? "bundle" : "single-file",
                bundleFiles: bundleManifest?.files, bundleRuleVersion: isBundle ? 1 : undefined, sha256Hash: hash, chainId: openProofChain.id,
                chainName: openProofChain.name, contractAddress: openProofContractAddress, transactionHash: txHash,
                transactionUrl: transactionExplorerUrl(txHash), creatorWallet: address, createdTimestamp: new Date().toISOString(),
                verificationUrl: proofUrl(hash, window.location.origin),
              }));
            }}>Generate receipt</ActionPill> : null}
          </div>
        ) : null}

        {/* ── Ticket / Receipt ───────────────────────── */}
        {receipt ? (
          <div className="mt-16 border-t-2 border-border-default pt-10">
            <div className="flex items-center gap-6">
              <span className="grid size-14 shrink-0 place-items-center rounded-full bg-accent text-white"><ShieldCheck className="size-7" /></span>
              <div>
                <p className="text-2xl font-black text-accent">Registered</p>
                <p className="mt-1 text-sm text-text-secondary">Receipt auto-downloaded.</p>
              </div>
            </div>

            <ProofTimeline className="mt-8" steps={[
              { title: "Fingerprint created locally", text: "File content stayed in browser.", complete: true },
              { title: "Hash registered onchain", text: "Only the SHA-256 fingerprint was written to Base Sepolia.", complete: true },
              { title: "Receipt generated locally", text: "Not uploaded or stored by OpenProof.", complete: true },
            ]} />

            {/* Receipt actions */}
            <div className="mt-8 flex flex-wrap gap-3">
              <ExplorerLink href={transactionExplorerUrl(receipt.transactionHash)}>View on BaseScan</ExplorerLink>
              <ActionPill variant="secondary" onClick={() => downloadJson(`openproof-${receipt.sha256Hash.slice(2, 10)}.json`, receipt)}><Download className="size-4" /> Download receipt JSON</ActionPill>
              <CopyButton label="Copy hash" value={receipt.sha256Hash} />
              <CopyButton label="Copy tx hash" value={receipt.transactionHash} />
              <CopyButton label="Copy proof URL" value={receipt.verificationUrl} />
            </div>

            {/* QR */}
            <div className="mt-8"><ProofQrCode url={receipt.verificationUrl} /></div>

            {/* Receipt data — ticket style */}
            <div className="mt-10 border-t-2 border-dashed border-border-default pt-8">
              <p className="text-xs font-bold tracking-widest uppercase text-accent mb-6">Receipt</p>
              <dl className="grid gap-3 font-mono text-sm">
                {Object.entries(receipt).map(([k, v]) => (
                  <div className="flex justify-between gap-4 py-2 border-b border-border-default" key={k}>
                    <dt className="shrink-0 text-text-muted">{k}</dt>
                    <dd className="text-right break-all text-text-primary">{k === "createdTimestamp" ? formatLocalTimestamp(String(v)) : String(v)}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-6 text-center text-xs text-text-muted">&mdash; OpenProof v0.9.0 &mdash;</p>
            </div>
          </div>
        ) : null}
      </section>

      {/* ── History ──────────────────────────────────── */}
      <section className="mx-auto max-w-3xl px-6 pb-24 sm:pb-32">
        <ProofHistory title="Recent Proofs" type="registered" />
      </section>
    </main>
  );
}
