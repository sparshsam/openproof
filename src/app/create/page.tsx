"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import {
  Download,
  FileCheck2,
  Fingerprint,
  Loader2,
  Package,
  ReceiptText,
  ShieldCheck,
  Sparkles,
  Upload,
  Wallet,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
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
  ButtonLink,
  Card,
  EmptyState,
  ExplorerLink,
  HelperTooltip,
  NetworkNotice,
  Section,
  StatusPill,
  StepCard,
} from "@/components/design-system";
import { CopyButton } from "@/components/copy-button";
import { FileDrop } from "@/components/file-drop";
import { HashDisplay } from "@/components/hash-display";
import { ProofHistory } from "@/components/proof-history";
import { ProofTimeline } from "@/components/proof-timeline";
import { ProofQrCode } from "@/components/qr-code";
import { transactionExplorerUrl } from "@/lib/explorer";
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
    setHash(null);
    setHashError(null);
    setReceipt(null);
    setPreflightMessage(null);
    setBundleManifest(null);

    if (isBundle) {
      hashBundleFiles(bundleFiles)
        .then(({ bundleHash, manifest }) => {
          setHash(bundleHash);
          setBundleManifest(manifest);
        })
        .catch(() => setHashError("The browser could not hash this file bundle."));
      return;
    }

    if (file) {
      hashFileSha256(file)
        .then(setHash)
        .catch(() => setHashError("The browser could not hash this file."));
    }
  }, [bundleFiles, file, isBundle]);

  useEffect(() => {
    async function loadReceipt() {
      if (!file || !hash || !address || !txHash || !txReceipt || !publicClient) {
        return;
      }

      const block = await publicClient.getBlock({
        blockHash: txReceipt.blockHash,
      });

      setReceipt(
        buildProofReceipt({
          fileName: file.name,
          fileSize: isBundle ? totalBundleSize : file.size,
          fileMimeType: isBundle
            ? "application/vnd.openproof.bundle+json"
            : file.type || "unknown",
          proofType: isBundle ? "bundle" : "single-file",
          bundleFiles: bundleManifest?.files,
          sha256Hash: hash,
          chainId: openProofChain.id,
          chainName: openProofChain.name,
          contractAddress: openProofContractAddress || "",
          transactionHash: txHash,
          transactionUrl: transactionExplorerUrl(txHash),
          creatorWallet: address,
          createdTimestamp: new Date(Number(block.timestamp) * 1000).toISOString(),
          verificationUrl: proofUrl(hash, window.location.origin),
        }),
      );
    }

    loadReceipt().catch(() => undefined);
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

  const status = useMemo(() => {
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
        preflightError instanceof Error
          ? preflightError.message
          : "Could not check whether this proof already exists.",
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
    !isCheckingProof &&
    !isPending &&
    !isConfirming;

  return (
    <main>
      <section className="base-grid bg-base-dark text-white">
        <Section className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <Badge tone="dark">Create Proof</Badge>
            <h1 className="mt-5 text-4xl font-black leading-tight tracking-tight sm:text-6xl">
              Register a local file fingerprint on Base Sepolia.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-blue-100">
              A polished transaction flow for timestamping a SHA-256 fingerprint
              without sending the file anywhere.
            </p>
            <BaseSepoliaNotice className="mt-7 border-white/15 bg-white/10 text-blue-100" />
          </div>
          <Card dark className="grid content-start gap-4 sm:grid-cols-2">
            {[
                { icon: Upload, title: "Select file", text: "Choose one or many files locally." },
                { icon: Fingerprint, title: "Generate fingerprint", text: "Hash with Web Crypto." },
                { icon: Wallet, title: "Connect wallet", text: "Use Base Sepolia." },
                { icon: FileCheck2, title: "Register proof", text: "Write hash onchain." },
              { icon: ReceiptText, title: "Download receipt", text: "Save JSON locally." },
            ].map((item, index) => (
              <StepCard
                active={index === 0 || (index === 1 && Boolean(hash))}
                icon={item.icon}
                key={item.title}
                step={index + 1}
                text={item.text}
                title={item.title}
              />
            ))}
          </Card>
        </Section>
      </section>

      <Section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <Badge>Transaction flow</Badge>
              <h2 className="mt-3 text-3xl font-black tracking-tight">
                Create a proof
              </h2>
            </div>
            <StatusPill tone={receipt ? "green" : isWrongChain ? "red" : "blue"}>
              {receipt ? "registered" : isWrongChain ? "wrong network" : "Base Sepolia"}
            </StatusPill>
          </div>

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
              text="Select multiple files to register one deterministic combined hash. Verification requires the same exact file set."
            />
            <HelperTooltip
              label="Base Sepolia"
              text="The Base testnet used by OpenProof v0.x. Testnet registration does not require real funds."
            />
          </div>

          <FileDrop
            file={file}
            files={bundleFiles}
            multiple
            onFile={(nextFile) => {
              setFile(nextFile);
              setBundleFiles([nextFile]);
            }}
            onFiles={(files) => {
              setBundleFiles(files);
              setFile(files[0] || null);
            }}
          />

          {file ? (
            <div className="grid gap-3 rounded-3xl border border-border bg-surface-muted p-5 text-sm sm:grid-cols-3">
              <div>
                <p className="text-xs uppercase tracking-[0.16em] text-muted">
                  {isBundle ? "Proof type" : "Name"}
                </p>
                <p className="mt-2 break-words font-semibold">
                  {isBundle ? "Bundle proof" : file.name}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.16em] text-muted">Size</p>
                <p className="mt-2 font-semibold">
                  {formatBytes(isBundle ? totalBundleSize : file.size)}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.16em] text-muted">
                  Files
                </p>
                <p className="mt-2 break-words font-semibold">
                  {isBundle ? bundleFiles.length : file.type || "unknown"}
                </p>
              </div>
            </div>
          ) : null}

          {isBundle && bundleManifest ? (
            <div className="rounded-3xl border border-base-blue/25 bg-base-blue/10 p-5">
              <div className="flex items-start gap-3">
                <Package className="mt-1 size-5 text-base-blue" />
                <div>
                  <p className="font-semibold">Deterministic bundle manifest</p>
                  <p className="mt-1 text-sm leading-6 text-muted">
                    Verification requires the same exact file set. OpenProof
                    sorts by name, size, type, and hash before hashing the
                    local manifest.
                  </p>
                </div>
              </div>
              <div className="mt-4 grid gap-2">
                {bundleManifest.files.map((item) => (
                  <div
                    className="rounded-2xl bg-surface p-3 text-sm"
                    key={`${item.name}:${item.sha256}`}
                  >
                    <p className="break-words font-semibold">{item.name}</p>
                    <p className="mt-1 text-xs text-muted">
                      {formatBytes(item.size)} - {item.type}
                    </p>
                    <p className="mt-1 break-all font-mono text-xs text-muted">
                      {item.sha256}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {hash ? <HashDisplay value={hash} /> : null}

          <div className="flex flex-wrap items-center gap-3">
            <ConnectButton />
            {isWrongChain ? (
              <div className="w-full rounded-3xl border border-danger/30 bg-danger/10 p-5">
                <p className="text-sm font-semibold text-danger">
                  Wrong network selected.
                </p>
                <p className="mt-2 text-sm leading-6 text-muted">
                  OpenProof v0 registers proofs on Base Sepolia only.
                </p>
                <ActionButton
                  disabled={isSwitching}
                  variant="secondary"
                  onClick={() => switchChain({ chainId: openProofChain.id })}
                >
                  {isSwitching ? "Switching..." : "Switch to Base Sepolia"}
                </ActionButton>
              </div>
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

          {!configured ? (
            <p className="rounded-3xl border border-border bg-surface-muted p-4 text-sm text-muted">
              Set NEXT_PUBLIC_OPENPROOF_CONTRACT_ADDRESS after deploying the
              registry contract.
            </p>
          ) : null}

          <p className="text-sm text-muted">{status}</p>
          {txHash && !receipt ? (
            <p className="break-words rounded-3xl border border-border bg-surface-muted p-4 font-mono text-xs text-muted">
              Submitted transaction: {txHash}
            </p>
          ) : null}
          {preflightMessage ? (
            <p className="rounded-3xl border border-border bg-surface-muted p-4 text-sm text-muted">
              {preflightMessage}
            </p>
          ) : null}
          {error ? <p className="text-sm text-danger">{error.message}</p> : null}
        </Card>

        <Card className="space-y-5">
          <Badge tone={receipt ? "green" : "blue"}>
            {receipt ? "Proof registered" : "Receipt preview"}
          </Badge>
          <h2 className="text-2xl font-black tracking-tight">
            {receipt ? "Your proof is ready." : "Local JSON, no upload."}
          </h2>
          <p className="text-sm leading-6 text-muted">
            After registration, OpenProof generates a receipt with chain,
            contract, wallet, timestamp, BaseScan, and verification details.
          </p>
          {receipt ? (
            <div className="success-pop space-y-5">
              <div className="rounded-3xl border border-success/30 bg-success/10 p-5">
                <div className="flex items-center gap-3">
                  <span className="grid size-12 place-items-center rounded-3xl bg-success text-base-dark">
                    <Sparkles className="size-5" />
                  </span>
                  <div>
                    <p className="font-semibold text-success">Registered on Base Sepolia</p>
                    <p className="mt-1 text-sm leading-6 text-muted">
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
              <div className="grid gap-2 sm:grid-cols-2">
                <ExplorerLink href={transactionExplorerUrl(receipt.transactionHash)}>
                  View transaction on BaseScan
                </ExplorerLink>
                <ButtonLink href={`/proof/${receipt.sha256Hash}`} variant="secondary">
                  Verify this proof
                </ButtonLink>
                <CopyButton label="Copy hash" value={receipt.sha256Hash} />
                <CopyButton label="Copy tx hash" value={receipt.transactionHash} />
                <CopyButton label="Copy proof URL" value={receipt.verificationUrl} />
                <ActionButton
                  variant="secondary"
                  onClick={() =>
                    downloadJson(`openproof-${receipt.sha256Hash.slice(2, 10)}.json`, receipt)
                  }
                >
                  <Download className="size-4" />
                  Download receipt JSON
                </ActionButton>
              </div>
              <ProofQrCode url={receipt.verificationUrl} />
              <div className="flex flex-wrap gap-3">
                <HelperTooltip
                  label="Proof receipts"
                  text="Receipts are local records for portability. Re-check the hash onchain when you need to rely on a proof."
                />
                <HelperTooltip
                  label="BaseScan"
                  text="BaseScan is the public block explorer used to inspect the registration transaction."
                />
              </div>
              <dl className="grid gap-3 text-sm">
                {Object.entries(receipt).map(([key, value]) => (
                  <div className="rounded-3xl bg-surface-muted p-4" key={key}>
                    <dt className="text-xs uppercase tracking-[0.16em] text-muted">
                      {key}
                    </dt>
                    <dd className="mt-2 break-words font-mono text-xs">
                      {key === "createdTimestamp"
                        ? formatLocalTimestamp(String(value))
                        : String(value)}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          ) : (
            <EmptyState
              icon={ReceiptText}
              title="Receipt appears after registration"
              text="Register a proof to see the downloadable receipt and BaseScan transaction link."
            />
          )}
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
