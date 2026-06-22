"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import {
  Download,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import { startTransition, useEffect, useMemo, useState } from "react";
import {
  useAccount,
  useChainId,
  usePublicClient,
  useSwitchChain,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { BaseSepoliaNotice } from "@/components/base-notice";
import {
  ActionButton,
  Badge,
  Card,
  ExplorerLink,
  HelperTooltip,
  NetworkNotice,
  Section,
  StatusPill,
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
  expectedChainId,
  isContractConfigured,
  openProofAbi,
  openProofChain,
  openProofContractAddress,
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
  const [preflightMessage, setPreflightMessage] = useState<string | null>(null);
  const [isCheckingProof, setIsCheckingProof] = useState(false);
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const publicClient = usePublicClient({ chainId: openProofChain.id });
  const { switchChain, isPending: isSwitching } = useSwitchChain();
  const { writeContract, data: txHash, error, isPending } = useWriteContract();
  const { data: txReceipt, isLoading: isConfirming } = useWaitForTransactionReceipt({
    hash: txHash,
    chainId: openProofChain.id,
  });

  const configured = isContractConfigured();
  const isWrongChain = isConnected && chainId !== expectedChainId;
  const isBundle = bundleFiles.length > 1;
  const totalBundleSize = bundleFiles.reduce((sum, item) => sum + item.size, 0);

  useEffect(() => {
    if (!file && !bundleFiles.length) return;
    startTransition(() => {
      setHash(null);
      setHashError(null);
      setReceipt(null);
      setPreflightMessage(null);
      setBundleManifest(null);
    });

    if (isBundle) {
      hashBundleFiles(bundleFiles)
        .then(({ bundleHash, manifest }) => {
          setHash(bundleHash);
          setBundleManifest(manifest);
        })
        .catch((hashingError) =>
          setHashError(
            hashingError instanceof Error
              ? hashingError.message
              : "The browser could not hash this file bundle.",
          ),
        );
      return;
    }

    if (file) {
      hashFileSha256(file)
        .then(setHash)
        .catch((hashingError) =>
          setHashError(
            hashingError instanceof Error
              ? hashingError.message
              : "The browser could not hash this file.",
          ),
        );
    }
  }, [bundleFiles, file, isBundle]);

  useEffect(() => {
    async function loadReceipt() {
      if (
        !file ||
        !hash ||
        !address ||
        !txHash ||
        !txReceipt ||
        !publicClient ||
        !openProofContractAddress
      ) {
        return;
      }

      let timestamp: string;
      try {
        const block = await publicClient.getBlock({
          blockHash: txReceipt.blockHash,
        });
        timestamp = new Date(Number(block.timestamp) * 1000).toISOString();
      } catch {
        timestamp = new Date().toISOString();
      }

      setReceipt(
        buildProofReceipt({
          schemaVersion: 2,
          receiptVersion: 2,
          hashAlgorithm: "SHA-256",
          fileName: file.name,
          fileSize: isBundle ? totalBundleSize : file.size,
          fileMimeType: isBundle
            ? "application/vnd.openproof.bundle+json"
            : file.type || "unknown",
          proofType: isBundle ? "bundle" : "single-file",
          bundleFiles: bundleManifest?.files,
          bundleRuleVersion: isBundle ? 1 : undefined,
          sha256Hash: hash,
          chainId: openProofChain.id,
          chainName: openProofChain.name,
          contractAddress: openProofContractAddress,
          transactionHash: txHash,
          transactionUrl: transactionExplorerUrl(txHash),
          creatorWallet: address,
          createdTimestamp: timestamp,
          verificationUrl: proofUrl(hash, window.location.origin),
        }),
      );
    }

    loadReceipt().catch(() => {});
  }, [
    address,
    bundleManifest?.files,
    file,
    hash,
    isBundle,
    publicClient,
    totalBundleSize,
    txHash,
    txReceipt,
  ]);

  useEffect(() => {
    if (!receipt) return;
    addProofHistoryItem({
      proofType: "registered",
      fileName: receipt.fileName,
      fileHash: receipt.sha256Hash,
      txHash: receipt.transactionHash,
      chainName: receipt.chainName,
      chainId: receipt.chainId,
      timestamp: receipt.createdTimestamp,
      verificationUrl: receipt.verificationUrl,
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
  }, [
    bundleFiles.length,
    file,
    hash,
    hashError,
    isCheckingProof,
    isConfirming,
    isPending,
    receipt,
  ]);

  async function registerProof() {
    if (!hash || !openProofContractAddress || !publicClient || isWrongChain) return;
    setPreflightMessage(null);
    setIsCheckingProof(true);

    try {
      const exists = await publicClient.readContract({
        abi: openProofAbi,
        address: openProofContractAddress,
        functionName: "proofExists",
        args: [hash],
      });

      if (exists) {
        const proof = await publicClient.readContract({
          abi: openProofAbi,
          address: openProofContractAddress,
          functionName: "getProof",
          args: [hash],
        });
        setPreflightMessage(
          `This exact file fingerprint is already registered by ${proof.creator} at ${new Date(
            Number(proof.timestamp) * 1000,
          ).toLocaleString()}. Use Verify Proof to inspect it.`,
        );
        return;
      }

      writeContract({
        abi: openProofAbi,
        address: openProofContractAddress,
        functionName: "registerProof",
        args: [hash],
        chainId: openProofChain.id,
      });
    } catch (preflightError) {
      setPreflightMessage(
        normalizeClientError(
          preflightError,
          "OpenProof could not check whether this proof already exists. Please try again.",
        ),
      );
    } finally {
      setIsCheckingProof(false);
    }
  }

  const canRegister =
    configured &&
    Boolean(hash) &&
    isConnected &&
    !isWrongChain &&
    isWalletConnectConfigured &&
    !isCheckingProof &&
    !isPending &&
    !isConfirming;

  return (
    <main>
      {/* ── Header section ─────────────────────────────── */}
      <section className="mx-auto max-w-5xl px-6 pt-20 pb-12 sm:pt-28 sm:pb-16">
        <Badge tone="blue">Create Proof</Badge>
        <h1 className="mt-5 text-4xl font-bold leading-tight tracking-tight sm:text-6xl">
          Register a file fingerprint
          <br />
          <span className="text-text-secondary">on Base Sepolia.</span>
        </h1>
        <p className="mt-5 max-w-xl text-lg leading-relaxed text-text-secondary">
          A polished transaction flow for timestamping a SHA-256 fingerprint
          without sending the file anywhere.
        </p>
        <div className="mt-6">
          <BaseSepoliaNotice />
        </div>
      </section>

      {/* ── Two-column content ─────────────────────────── */}
      <Section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] !pt-0">
        {/* Left: Transaction flow */}
        <Card>
          <div className="flex items-start justify-between gap-4">
            <div>
              <Badge>Transaction flow</Badge>
              <h2 className="mt-4 text-2xl font-bold tracking-tight">
                Create a proof
              </h2>
            </div>
            <StatusPill tone={receipt ? "green" : isWrongChain ? "red" : "blue"}>
              {receipt ? "registered" : isWrongChain ? "wrong network" : "Base Sepolia"}
            </StatusPill>
          </div>

          <div className="mt-6 space-y-6">
            <NetworkNotice title="Network: Base Sepolia" tone="muted">
              Proof registration is disabled until your connected wallet is on
              Base Sepolia.
            </NetworkNotice>

            <div className="flex flex-wrap gap-3">
              <HelperTooltip
                label="SHA-256 hash"
                text="A local fingerprint of the selected file bytes. OpenProof sends the hash to the contract, not the file."
              />
              <HelperTooltip
                label="Bundle proofs"
                text="Select multiple files to register one deterministic combined hash."
              />
              <HelperTooltip
                label="Base Sepolia"
                text="The Base testnet used by OpenProof v0.x."
              />
            </div>

            <FileDrop
              file={file}
              files={bundleFiles}
              multiple
              onFile={(nextFile) => {
                setHashError(null);
                setFile(nextFile);
                setBundleFiles([nextFile]);
              }}
              onFiles={(files) => {
                setHashError(null);
                setBundleFiles(files);
                setFile(files[0] || null);
              }}
              onError={setHashError}
            />

            {file ? (
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <p className="text-xs font-semibold tracking-wider uppercase text-text-muted">
                    {isBundle ? "Proof type" : "Name"}
                  </p>
                  <p className="mt-2 font-medium break-words">
                    {isBundle ? "Bundle proof" : file.name}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold tracking-wider uppercase text-text-muted">Size</p>
                  <p className="mt-2 font-medium">
                    {formatBytes(isBundle ? totalBundleSize : file.size)}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold tracking-wider uppercase text-text-muted">
                    Files
                  </p>
                  <p className="mt-2 font-medium break-words">
                    {isBundle ? bundleFiles.length : file.type || "unknown"}
                  </p>
                </div>
              </div>
            ) : null}

            {hash ? <HashDisplay value={hash} /> : null}

            <div className="flex flex-wrap items-center gap-4">
              <ConnectButton />
              {isWrongChain ? (
                <ActionButton
                  disabled={isSwitching}
                  variant="secondary"
                  onClick={() => switchChain({ chainId: openProofChain.id })}
                >
                  {isSwitching ? "Switching..." : "Switch to Base Sepolia"}
                </ActionButton>
              ) : (
                <ActionButton disabled={!canRegister} onClick={registerProof}>
                  {isCheckingProof || isPending || isConfirming ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <ShieldCheck className="size-4" />
                  )}
                  {isCheckingProof
                    ? "Checking proof"
                    : isBundle
                      ? "Register bundle on Base Sepolia"
                      : "Register on Base Sepolia"}
                </ActionButton>
              )}
            </div>

            {!isWalletConnectConfigured ? (
              <div className="rounded-xl bg-error/5 border border-error/20 p-5">
                <p className="text-sm font-semibold text-error">
                  WalletConnect is not configured.
                </p>
                <p className="mt-2 text-sm leading-6 text-text-secondary">
                  Set NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID to enable wallet
                  connections in this deployment.
                </p>
              </div>
            ) : null}

            {!configured ? (
              <p className="text-sm text-text-muted">
                Set NEXT_PUBLIC_OPENPROOF_CONTRACT_ADDRESS after deploying the
                registry contract.
              </p>
            ) : null}

            <p
              aria-live="polite"
              className={`text-sm font-medium ${
                hashError
                  ? "text-error"
                  : receipt
                    ? "text-accent"
                    : isPending || isConfirming || isCheckingProof
                      ? "text-accent"
                      : "text-text-muted"
              }`}
            >
              {statusText}
            </p>

            {txHash && !receipt ? (
              <div className="space-y-3">
                <p className="break-words rounded-xl bg-bg-surface-muted p-5 font-mono text-xs text-text-secondary">
                  Submitted: {txHash}
                </p>
                {txReceipt && (
                  <ActionButton
                    variant="secondary"
                    onClick={() => {
                      if (!file || !hash || !address || !openProofContractAddress) return;
                      setReceipt(
                        buildProofReceipt({
                          schemaVersion: 2,
                          receiptVersion: 2,
                          hashAlgorithm: "SHA-256",
                          fileName: file.name,
                          fileSize: isBundle ? totalBundleSize : file.size,
                          fileMimeType: isBundle
                            ? "application/vnd.openproof.bundle+json"
                            : file.type || "unknown",
                          proofType: isBundle ? "bundle" : "single-file",
                          bundleFiles: bundleManifest?.files,
                          bundleRuleVersion: isBundle ? 1 : undefined,
                          sha256Hash: hash,
                          chainId: openProofChain.id,
                          chainName: openProofChain.name,
                          contractAddress: openProofContractAddress,
                          transactionHash: txHash,
                          transactionUrl: transactionExplorerUrl(txHash),
                          creatorWallet: address,
                          createdTimestamp: new Date().toISOString(),
                          verificationUrl: proofUrl(hash, window.location.origin),
                        }),
                      );
                    }}
                  >
                    Generate receipt
                  </ActionButton>
                )}
              </div>
            ) : null}

            {preflightMessage ? (
              <p
                aria-live="polite"
                className={`rounded-xl border p-5 text-sm ${
                  preflightMessage.startsWith("This exact file fingerprint is already registered")
                    ? "bg-accent/5 border-accent/20 text-accent"
                    : "bg-bg-surface-muted border border-border-default text-text-secondary"
                }`}
              >
                {preflightMessage}
              </p>
            ) : null}

            {error ? (
              <p aria-live="assertive" className="rounded-xl bg-error/5 border border-error/20 p-5 text-sm text-error">
                {normalizeClientError(error, genericWalletErrorMessage)}
              </p>
            ) : null}
          </div>
        </Card>

        {/* Right: Receipt panel */}
        <Card>
          <Badge tone={receipt ? "green" : "blue"}>
            {receipt ? "Proof registered" : "Receipt preview"}
          </Badge>
          <h2 className="mt-4 text-2xl font-bold tracking-tight">
            {receipt ? "Your proof is ready." : "Local JSON, no upload."}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-text-secondary">
            After registration, OpenProof generates a receipt with chain,
            contract, wallet, timestamp, and verification details.
          </p>
          <div className="mt-6">
            {receipt ? (
              <div className="space-y-6">
                <div className="rounded-xl bg-accent/5 border border-accent/20 p-6">
                  <div className="flex items-center gap-4">
                    <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-accent text-white">
                      <ShieldCheck className="size-6" />
                    </span>
                    <div>
                      <p className="font-bold text-accent">Registered on Base Sepolia</p>
                      <p className="mt-1 text-sm leading-relaxed text-text-secondary">
                        Save the receipt, copy the proof URL, or open the public
                        verification page.
                      </p>
                    </div>
                  </div>
                </div>
                <ProofTimeline
                  steps={[
                    {
                      title: "Fingerprint created locally",
                      text: "The file content stayed in this browser.",
                      complete: true,
                    },
                    {
                      title: "Hash registered onchain",
                      text: "Only the SHA-256 fingerprint was written to Base Sepolia.",
                      complete: true,
                    },
                    {
                      title: "Receipt generated locally",
                      text: "The JSON receipt was not uploaded or stored by OpenProof.",
                      complete: true,
                    },
                  ]}
                />
                <div className="grid gap-3 sm:grid-cols-2">
                  <ExplorerLink href={transactionExplorerUrl(receipt.transactionHash)}>
                    View on BaseScan
                  </ExplorerLink>
                  <ActionButton
                    variant="secondary"
                    onClick={() =>
                      downloadJson(`openproof-${receipt.sha256Hash.slice(2, 10)}.json`, receipt)
                    }
                  >
                    <Download className="size-4" />
                    Download receipt JSON
                  </ActionButton>
                  <CopyButton label="Copy hash" value={receipt.sha256Hash} />
                  <CopyButton label="Copy tx hash" value={receipt.transactionHash} />
                  <CopyButton label="Copy proof URL" value={receipt.verificationUrl} />
                </div>
                <ProofQrCode url={receipt.verificationUrl} />
                <dl className="grid gap-2 text-sm">
                  {Object.entries(receipt).map(([key, value]) => (
                    <div className="rounded-xl bg-bg-surface-muted p-4" key={key}>
                      <dt className="text-xs font-semibold tracking-wider uppercase text-text-muted">
                        {key}
                      </dt>
                      <dd className="mt-2 break-words font-mono text-xs text-text-primary">
                        {key === "createdTimestamp"
                          ? formatLocalTimestamp(String(value))
                          : String(value)}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            ) : (
              <div className="rounded-xl bg-bg-surface-muted p-8 text-center">
                <p className="text-sm text-text-secondary">
                  Register a proof to see the downloadable receipt and
                  BaseScan transaction link.
                </p>
              </div>
            )}
          </div>
        </Card>
      </Section>

      <Section>
        <Card>
          <ProofHistory title="Recent Proofs" type="registered" />
        </Card>
      </Section>
    </main>
  );
}
