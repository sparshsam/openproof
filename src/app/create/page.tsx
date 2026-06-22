"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Download, Loader2, ShieldCheck } from "lucide-react";
import { startTransition, useEffect, useMemo, useRef, useState } from "react";
import {
  useAccount, useChainId, usePublicClient, useSwitchChain,
  useWaitForTransactionReceipt, useWriteContract,
} from "wagmi";
import { BaseSepoliaNotice } from "@/components/base-notice";
import {
  Badge, ExplorerLink, HelperTooltip, NetworkNotice,
  Section, StatusPill, Surface, TicketPanel, ActionPill,
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
import { hashBundleFiles, type BundleManifest } from "@/lib/bundle";
import { addProofHistoryItem } from "@/lib/history";
import {
  expectedChainId, isContractConfigured, openProofAbi,
  openProofChain, openProofContractAddress,
} from "@/lib/contracts";
import { isWalletConnectConfigured } from "@/components/providers/wallet-provider";
import { buildProofReceipt, downloadJson, type ProofReceipt } from "@/lib/receipt";
import { formatLocalTimestamp } from "@/lib/time";
import { proofUrl } from "@/lib/proof-url";

export default function CreateProofPage() {
  const [file, setFile] = useState<File | null>(null);
  const [bundleFiles, setBundleFiles] = useState<File[]>([]);
  const [bundleManifest, setBundleManifest] = useState<BundleManifest | null>(null);
  const [hash, setHash] = useState<`0x${string}` | null>(null);
  const [hashError, setHashError] = useState<string | null>(null);
  const [receipt, setReceipt] = useState<ProofReceipt | null>(null);
  const autoDownloadedRef = useRef(false);
  const [preflightMessage, setPreflightMessage] = useState<string | null>(null);
  const [isCheckingProof, setIsCheckingProof] = useState(false);
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const publicClient = usePublicClient({ chainId: openProofChain.id });
  const { switchChain, isPending: isSwitching } = useSwitchChain();
  const { writeContract, data: txHash, error, isPending } = useWriteContract();
  const { data: txReceipt, isLoading: isConfirming } = useWaitForTransactionReceipt({
    hash: txHash, chainId: openProofChain.id,
  });

  const configured = isContractConfigured();
  const isWrongChain = isConnected && chainId !== expectedChainId;
  const isBundle = bundleFiles.length > 1;
  const totalBundleSize = bundleFiles.reduce((sum, item) => sum + item.size, 0);

  // ── Hash file(s) on selection ─────────────────────
  useEffect(() => {
    if (!file && !bundleFiles.length) return;
    startTransition(() => { setHash(null); setHashError(null); setReceipt(null); setPreflightMessage(null); setBundleManifest(null); }); autoDownloadedRef.current = false;
    if (isBundle) {
      hashBundleFiles(bundleFiles)
        .then(({ bundleHash, manifest }) => { setHash(bundleHash); setBundleManifest(manifest); })
        .catch((e) => setHashError(e instanceof Error ? e.message : "Could not hash bundle."));
      return;
    }
    if (file) {
      hashFileSha256(file)
        .then(setHash)
        .catch((e) => setHashError(e instanceof Error ? e.message : "Could not hash file."));
    }
  }, [bundleFiles, file, isBundle]);

  // ── Build receipt after tx confirms ───────────────
  useEffect(() => {
    async function loadReceipt() {
      if (!file || !hash || !address || !txHash || !txReceipt || !publicClient || !openProofContractAddress) return;
      let timestamp: string;
      try {
        const block = await publicClient.getBlock({ blockHash: txReceipt.blockHash });
        timestamp = new Date(Number(block.timestamp) * 1000).toISOString();
      } catch { timestamp = new Date().toISOString(); }

      const r = buildProofReceipt({
        schemaVersion: 2, receiptVersion: 2, hashAlgorithm: "SHA-256",
        fileName: file.name, fileSize: isBundle ? totalBundleSize : file.size,
        fileMimeType: isBundle ? "application/vnd.openproof.bundle+json" : file.type || "unknown",
        proofType: isBundle ? "bundle" : "single-file",
        bundleFiles: bundleManifest?.files, bundleRuleVersion: isBundle ? 1 : undefined,
        sha256Hash: hash, chainId: openProofChain.id, chainName: openProofChain.name,
        contractAddress: openProofContractAddress, transactionHash: txHash,
        transactionUrl: transactionExplorerUrl(txHash), creatorWallet: address,
        createdTimestamp: timestamp, verificationUrl: proofUrl(hash, window.location.origin),
      });
      setReceipt(r);
    }
    loadReceipt().catch(() => {});
  }, [address, bundleManifest?.files, file, hash, isBundle, publicClient, totalBundleSize, txHash, txReceipt]);

  // ── Auto-download receipt + save to history ──────
  useEffect(() => {
    if (!receipt || autoDownloadedRef.current) return;
    autoDownloadedRef.current = true;
    downloadJson(`openproof-${receipt.sha256Hash.slice(2, 10)}.json`, receipt);
    addProofHistoryItem({
      proofType: "registered", fileName: receipt.fileName, fileHash: receipt.sha256Hash,
      txHash: receipt.transactionHash, chainName: receipt.chainName, chainId: receipt.chainId,
      timestamp: receipt.createdTimestamp, verificationUrl: receipt.verificationUrl,
      baseScanUrl: receipt.transactionUrl,
    });
  }, [receipt]);

  const statusText = useMemo(() => {
    if (hashError) return hashError;
    if ((file || bundleFiles.length) && !hash) return "Hashing locally...";
    if (isCheckingProof) return "Checking whether this fingerprint already exists...";
    if (isPending) return "Confirm the wallet transaction.";
    if (isConfirming) return "Transaction submitted. Waiting for confirmation.";
    if (receipt) return "Proof registered on Base Sepolia.";
    return "Select a file to begin.";
  }, [bundleFiles.length, file, hash, hashError, isCheckingProof, isConfirming, isPending, receipt]);

  async function registerProof() {
    if (!hash || !openProofContractAddress || !publicClient || isWrongChain) return;
    setPreflightMessage(null); setIsCheckingProof(true);
    try {
      const exists = await publicClient.readContract({ abi: openProofAbi, address: openProofContractAddress, functionName: "proofExists", args: [hash] });
      if (exists) {
        const proof = await publicClient.readContract({ abi: openProofAbi, address: openProofContractAddress, functionName: "getProof", args: [hash] });
        setPreflightMessage(`This fingerprint is already registered by ${proof.creator} at ${new Date(Number(proof.timestamp) * 1000).toLocaleString()}.`);
        return;
      }
      writeContract({ abi: openProofAbi, address: openProofContractAddress, functionName: "registerProof", args: [hash], chainId: openProofChain.id });
    } catch (e) {
      setPreflightMessage(normalizeClientError(e, "Could not check proof. Please try again."));
    } finally { setIsCheckingProof(false); }
  }

  const canRegister = configured && Boolean(hash) && isConnected && !isWrongChain && isWalletConnectConfigured && !isCheckingProof && !isPending && !isConfirming;

  return (
    <main>
      {/* ── Header ───────────────────────────────────── */}
      <section className="mx-auto max-w-5xl px-6 pt-24 pb-16 sm:pt-32 sm:pb-20">
        <Badge tone="blue">Create Proof</Badge>
        <h1 className="mt-5 text-4xl font-bold leading-tight tracking-tight sm:text-6xl">
          Register a file fingerprint
          <br /><span className="text-text-secondary">on Base Sepolia.</span>
        </h1>
        <p className="mt-5 max-w-xl text-lg leading-relaxed text-text-secondary">
          Timestamp a SHA-256 fingerprint onchain. The file never leaves your browser.
        </p>
        <div className="mt-6"><BaseSepoliaNotice /></div>
      </section>

      {/* ── Two-column content ──────────────────────── */}
      <Section className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] !pt-0">

        {/* ── Transaction flow ──────────────────────── */}
        <Surface>
          <div className="flex items-start justify-between gap-4">
            <div>
              <Badge>Transaction flow</Badge>
              <h2 className="mt-4 text-2xl font-bold tracking-tight">Create a proof</h2>
            </div>
            <StatusPill tone={receipt ? "green" : isWrongChain ? "red" : "blue"}>
              {receipt ? "registered" : isWrongChain ? "wrong network" : "Base Sepolia"}
            </StatusPill>
          </div>

          <div className="mt-7 space-y-6">
            <NetworkNotice title="Network: Base Sepolia" tone="muted">
              Wallet must be on Base Sepolia to register.
            </NetworkNotice>

            <div className="flex flex-wrap gap-3">
              <HelperTooltip label="SHA-256 hash" text="A local fingerprint of the file bytes. Only the hash goes onchain." />
              <HelperTooltip label="Bundle proofs" text="Select multiple files for one deterministic combined hash." />
              <HelperTooltip label="Base Sepolia" text="Base testnet. No real funds required." />
            </div>

            <FileDrop
              file={file} files={bundleFiles} multiple
              onFile={(f) => { setHashError(null); setFile(f); setBundleFiles([f]); }}
              onFiles={(files) => { setHashError(null); setBundleFiles(files); setFile(files[0] || null); }}
              onError={setHashError}
            />

            {file ? (
              <div className="grid gap-4 sm:grid-cols-3">
                <div><p className="text-xs font-bold tracking-wider uppercase text-text-muted">{isBundle ? "Type" : "Name"}</p><p className="mt-2 font-medium break-words">{isBundle ? "Bundle proof" : file.name}</p></div>
                <div><p className="text-xs font-bold tracking-wider uppercase text-text-muted">Size</p><p className="mt-2 font-medium">{formatBytes(isBundle ? totalBundleSize : file.size)}</p></div>
                <div><p className="text-xs font-bold tracking-wider uppercase text-text-muted">Files</p><p className="mt-2 font-medium break-words">{isBundle ? bundleFiles.length : file.type || "unknown"}</p></div>
              </div>
            ) : null}

            {hash ? <HashDisplay value={hash} /> : null}

            <div className="flex flex-wrap items-center gap-4">
              <ConnectButton />
              {isWrongChain ? (
                <ActionPill disabled={isSwitching} variant="secondary" onClick={() => switchChain({ chainId: openProofChain.id })}>
                  {isSwitching ? "Switching..." : "Switch to Base Sepolia"}
                </ActionPill>
              ) : (
                <ActionPill disabled={!canRegister} onClick={registerProof}>
                  {isCheckingProof || isPending || isConfirming ? <Loader2 className="size-4 animate-spin" /> : <ShieldCheck className="size-4" />}
                  {isCheckingProof ? "Checking" : isBundle ? "Register bundle" : "Register"}
                </ActionPill>
              )}
            </div>

            {!isWalletConnectConfigured ? (
              <div className="rounded-2xl bg-error/5 border border-error/20 p-5">
                <p className="text-sm font-bold text-error">WalletConnect not configured.</p>
                <p className="mt-2 text-sm leading-6 text-text-secondary">Set NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID in production.</p>
              </div>
            ) : null}

            {!configured ? (
              <p className="text-sm text-text-muted">Set NEXT_PUBLIC_OPENPROOF_CONTRACT_ADDRESS.</p>
            ) : null}

            <p aria-live="polite" className={`text-sm font-medium ${hashError ? "text-error" : receipt ? "text-accent" : isPending || isConfirming || isCheckingProof ? "text-accent" : "text-text-muted"}`}>
              {statusText}
            </p>

            {/* ── Manual fallback ───────────────────── */}
            {txHash && !receipt ? (
              <div className="space-y-3">
                <p className="break-words rounded-2xl bg-bg-surface-muted p-5 font-mono text-xs text-text-secondary">Submitted: {txHash}</p>
                {txReceipt ? (
                  <ActionPill variant="secondary" onClick={() => {
                    if (!file || !hash || !address || !openProofContractAddress) return;
                    setReceipt(buildProofReceipt({
                      schemaVersion: 2, receiptVersion: 2, hashAlgorithm: "SHA-256",
                      fileName: file.name, fileSize: isBundle ? totalBundleSize : file.size,
                      fileMimeType: isBundle ? "application/vnd.openproof.bundle+json" : file.type || "unknown",
                      proofType: isBundle ? "bundle" : "single-file", bundleFiles: bundleManifest?.files,
                      bundleRuleVersion: isBundle ? 1 : undefined, sha256Hash: hash,
                      chainId: openProofChain.id, chainName: openProofChain.name,
                      contractAddress: openProofContractAddress, transactionHash: txHash,
                      transactionUrl: transactionExplorerUrl(txHash), creatorWallet: address,
                      createdTimestamp: new Date().toISOString(), verificationUrl: proofUrl(hash, window.location.origin),
                    }));
                  }}>
                    Generate receipt
                  </ActionPill>
                ) : null}
              </div>
            ) : null}

            {preflightMessage ? (
              <p aria-live="polite" className={`rounded-2xl border p-5 text-sm ${preflightMessage.startsWith("This fingerprint is already registered") ? "bg-accent/5 border-accent/20 text-accent" : "bg-bg-surface-muted text-text-secondary"}`}>
                {preflightMessage}
              </p>
            ) : null}

            {error ? (
              <p aria-live="assertive" className="rounded-2xl bg-error/5 border border-error/20 p-5 text-sm text-error">
                {normalizeClientError(error, genericWalletErrorMessage)}
              </p>
            ) : null}
          </div>
        </Surface>

        {/* ── Receipt / Ticket panel ────────────────── */}
        <Surface>
          <Badge tone={receipt ? "green" : "blue"}>{receipt ? "Proof registered" : "Receipt"}</Badge>
          <h2 className="mt-4 text-2xl font-bold tracking-tight">{receipt ? "Receipt auto-downloaded." : "Your proof receipt."}</h2>
          <p className="mt-3 text-sm leading-relaxed text-text-secondary">
            {receipt
              ? "The JSON receipt has been saved to your downloads. Keep it to verify later."
              : "After registration, a JSON receipt will be generated and downloaded automatically."}
          </p>

          <div className="mt-6">
            {receipt ? (
              <div className="space-y-6">
                <TicketPanel variant="success">
                  <div className="flex items-center gap-4">
                    <span className="grid size-12 shrink-0 place-items-center rounded-full bg-accent text-white"><ShieldCheck className="size-6" /></span>
                    <div>
                      <p className="font-bold text-accent">Registered on Base Sepolia</p>
                      <p className="mt-1 text-sm leading-relaxed text-text-secondary">Receipt auto-downloaded. Save it to verify later.</p>
                    </div>
                  </div>
                </TicketPanel>

                <ProofTimeline steps={[
                  { title: "Fingerprint created locally", text: "File content stayed in browser.", complete: true },
                  { title: "Hash registered onchain", text: "Only the SHA-256 fingerprint was written to Base Sepolia.", complete: true },
                  { title: "Receipt generated locally", text: "Receipt was not uploaded or stored by OpenProof.", complete: true },
                ]} />

                <div className="flex flex-wrap gap-3">
                  <ExplorerLink href={transactionExplorerUrl(receipt.transactionHash)}>View on BaseScan</ExplorerLink>
                  <ActionPill variant="secondary" onClick={() => downloadJson(`openproof-${receipt.sha256Hash.slice(2, 10)}.json`, receipt)}>
                    <Download className="size-4" /> Download receipt JSON
                  </ActionPill>
                  <CopyButton label="Copy hash" value={receipt.sha256Hash} />
                  <CopyButton label="Copy tx hash" value={receipt.transactionHash} />
                  <CopyButton label="Copy proof URL" value={receipt.verificationUrl} />
                </div>

                <ProofQrCode url={receipt.verificationUrl} />

                <dl className="grid gap-2 text-sm">
                  {Object.entries(receipt).map(([key, value]) => (
                    <div className="rounded-2xl bg-bg-surface-muted p-4" key={key}>
                      <dt className="text-xs font-bold tracking-wider uppercase text-text-muted">{key}</dt>
                      <dd className="mt-2 break-words font-mono text-xs text-text-primary">
                        {key === "createdTimestamp" ? formatLocalTimestamp(String(value)) : String(value)}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            ) : (
              <div className="rounded-2xl bg-bg-surface-muted p-12 text-center">
                <p className="text-sm text-text-secondary">Register a proof to see results here.</p>
              </div>
            )}
          </div>
        </Surface>
      </Section>

      <Section>
        <Surface>
          <ProofHistory title="Recent Proofs" type="registered" />
        </Surface>
      </Section>
    </main>
  );
}
