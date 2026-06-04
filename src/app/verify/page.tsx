"use client";

import Link from "next/link";
import type { Dispatch, SetStateAction } from "react";
import {
  CheckCircle2,
  CircleX,
  FileSearch,
  Fingerprint,
  Loader2,
  SearchCheck,
  ShieldQuestion,
  Upload,
} from "lucide-react";
import { useEffect, useState } from "react";
import type { PublicClient } from "viem";
import { usePublicClient } from "wagmi";
import { BaseSepoliaNotice } from "@/components/base-notice";
import {
  ActionButton,
  Badge,
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
import { ReceiptImport } from "@/components/receipt-import";
import { transactionExplorerUrl } from "@/lib/explorer";
import { normalizeClientError } from "@/lib/errors";
import { formatBytes, hashFileSha256 } from "@/lib/hash";
import {
  isContractConfigured,
  openProofChain,
  openProofContractAddress,
} from "@/lib/contracts";
import { addProofHistoryItem } from "@/lib/history";
import { proofPath } from "@/lib/proof-url";
import { findProofTransactionHash, isBytes32Hash, readOnchainProof } from "@/lib/proofs";
import type { ProofReceipt } from "@/lib/receipt";
import { formatLocalTimestamp } from "@/lib/time";

type VerificationResult =
  | { status: "idle" | "loading" | "not-found"; message: string }
  | {
      status: "verified";
      creator: string;
      timestamp: string;
      proofId: string;
      transactionHash?: string;
    }
  | { status: "error"; message: string };

export default function VerifyProofPage() {
  const [file, setFile] = useState<File | null>(null);
  const [hash, setHash] = useState<`0x${string}` | null>(null);
  const [result, setResult] = useState<VerificationResult>({
    status: "idle",
    message: "Select a file to verify an exact hash match.",
  });
  const [receiptResult, setReceiptResult] = useState<VerificationResult>({
    status: "idle",
    message: "Import a receipt JSON to validate it against Base Sepolia.",
  });
  const publicClient = usePublicClient({ chainId: openProofChain.id });
  const configured = isContractConfigured();

  useEffect(() => {
    if (!file) return;
    setHash(null);
    setResult({ status: "loading", message: "Hashing file locally..." });
    hashFileSha256(file)
      .then((value) => {
        setHash(value);
        setResult({
          status: "idle",
          message: "Hash ready. Query the registry to verify it.",
        });
      })
      .catch(() =>
        setResult({
          status: "error",
          message: "The browser could not hash this file. Check the file size and try again.",
        }),
      );
  }, [file]);

  async function verifyProof() {
    if (!hash || !openProofContractAddress || !publicClient) return;
    setResult({ status: "loading", message: "Checking the Base Sepolia registry..." });

    try {
      const proof = await readOnchainProof(publicClient, hash);

      if (!proof) {
        setResult({
          status: "not-found",
          message:
            "No proof was found for this exact SHA-256 fingerprint on the configured Base Sepolia registry.",
        });
        return;
      }

      const verifiedResult: VerificationResult = {
        status: "verified",
        creator: proof.creator,
        timestamp: proof.timestamp,
        proofId: hash,
        transactionHash: proof.transactionHash,
      };
      setResult(verifiedResult);
      hydrateTransactionHash(publicClient, hash, setResult);
      addProofHistoryItem({
        proofType: "verified",
        fileName: file?.name || "Verified file",
        fileHash: hash,
        txHash: proof.transactionHash,
        chainName: openProofChain.name,
        chainId: openProofChain.id,
        timestamp: proof.timestamp,
        verificationUrl: `${window.location.origin}${proofPath(hash)}`,
        baseScanUrl: proof.transactionHash
          ? transactionExplorerUrl(proof.transactionHash)
          : undefined,
      });
    } catch (error) {
      setResult({
        status: "error",
        message: normalizeClientError(error, "Verification failed. Please try again."),
      });
    }
  }

  async function verifyReceipt(receipt: ProofReceipt) {
    if (!publicClient) return;
    setReceiptResult({
      status: "loading",
      message: "Checking receipt hash against Base Sepolia...",
    });

    if (!isBytes32Hash(receipt.sha256Hash)) {
      setReceiptResult({
        status: "error",
        message: "Receipt hash is malformed.",
      });
      return;
    }

    if (receipt.chainId !== openProofChain.id) {
      setReceiptResult({
        status: "error",
        message: `Receipt is for chain ${receipt.chainId}, not ${openProofChain.name}.`,
      });
      return;
    }

    if (
      openProofContractAddress &&
      receipt.contractAddress.toLowerCase() !== openProofContractAddress.toLowerCase()
    ) {
      setReceiptResult({
        status: "error",
        message: `Receipt contract address does not match the configured OpenProof registry. Expected ${openProofContractAddress}, got ${receipt.contractAddress}.`,
      });
      return;
    }

    try {
      const proof = await readOnchainProof(publicClient, receipt.sha256Hash);
      if (!proof) {
        setReceiptResult({
          status: "not-found",
          message: "Receipt schema is valid, but no matching onchain proof was found.",
        });
        return;
      }

      const nextResult: VerificationResult = {
        status: "verified",
        creator: proof.creator,
        timestamp: proof.timestamp,
        proofId: receipt.sha256Hash,
        transactionHash: proof.transactionHash || receipt.transactionHash,
      };
      setReceiptResult(nextResult);
      hydrateTransactionHash(
        publicClient,
        receipt.sha256Hash,
        setReceiptResult,
        receipt.transactionHash,
      );
      addProofHistoryItem({
        proofType: "verified",
        fileName: receipt.fileName,
        fileHash: receipt.sha256Hash,
        txHash: nextResult.transactionHash,
        chainName: receipt.chainName,
        chainId: receipt.chainId,
        timestamp: proof.timestamp,
        verificationUrl: receipt.verificationUrl,
        baseScanUrl: nextResult.transactionHash
          ? transactionExplorerUrl(nextResult.transactionHash)
          : receipt.transactionUrl,
      });
    } catch (error) {
      setReceiptResult({
        status: "error",
        message: normalizeClientError(
          error,
          "Receipt verification failed. Please try again.",
        ),
      });
    }
  }

  return (
    <main>
      <section className="bg-bg-base text-white">
        <Section className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <Badge tone="dark">Verify Proof</Badge>
            <h1 className="mt-5 text-4xl font-black leading-tight tracking-tight sm:text-6xl">
              Verify a file fingerprint on Base Sepolia.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-text-secondary">
              Verification is a public read. No wallet is required to check
              whether an exact file hash was registered.
            </p>
            <BaseSepoliaNotice className="mt-7 border-border-default bg-bg-surface-muted text-text-secondary" />
          </div>
          <Card className="grid content-start gap-4 sm:grid-cols-3">
            {[
              { icon: Upload, title: "Select file", text: "Choose the file to check." },
              { icon: Fingerprint, title: "Hash locally", text: "Generate the same SHA-256 fingerprint." },
              { icon: FileSearch, title: "Read registry", text: "Query the registry on Base Sepolia." },
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

      <Section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <Card className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <Badge>No wallet required</Badge>
              <h2 className="mt-3 text-3xl font-black tracking-tight">
                Check an exact file match
              </h2>
            </div>
            <StatusPill
              tone={
                result.status === "verified"
                  ? "green"
                  : result.status === "not-found"
                    ? "red"
                    : "blue"
              }
            >
              {result.status === "verified"
                ? "verified"
                : result.status === "not-found"
                  ? "not found"
                  : "Base Sepolia"}
            </StatusPill>
          </div>

          <NetworkNotice title="Network: Base Sepolia" tone="muted">
            Verification checks the deployed OpenProofRegistry contract on Base
            Sepolia. The selected file never leaves your browser.
          </NetworkNotice>
          <div className="flex flex-wrap gap-3">
            <HelperTooltip
              label="Direct file verification"
              text="OpenProof hashes the selected file locally and checks whether that exact SHA-256 fingerprint exists onchain."
            />
            <HelperTooltip
              label="Bundle verification"
              text="Bundle proofs require selecting the same exact set of files that produced the registered bundle hash."
            />
          </div>

          <FileDrop
            file={file}
            onFile={setFile}
            onError={(message) => setResult({ status: "error", message })}
          />

          {file ? (
            <div className="grid gap-3 rounded-lg border border-border-default bg-bg-surface-muted p-5 text-sm sm:grid-cols-3">
              <div>
                <p className="text-xs uppercase text-text-muted">Name</p>
                <p className="mt-2 break-words font-semibold">{file.name}</p>
              </div>
              <div>
                <p className="text-xs uppercase text-text-muted">Size</p>
                <p className="mt-2 font-semibold">{formatBytes(file.size)}</p>
              </div>
              <div>
                <p className="text-xs uppercase text-text-muted">Type</p>
                <p className="mt-2 break-words font-semibold">{file.type || "unknown"}</p>
              </div>
            </div>
          ) : null}

          {hash ? <HashDisplay value={hash} /> : null}

          <ActionButton
            disabled={!configured || !hash || result.status === "loading"}
            onClick={verifyProof}
          >
            {result.status === "loading" ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <SearchCheck className="size-4" />
            )}
            Verify on Base Sepolia
          </ActionButton>

          {!configured ? (
            <p className="rounded-lg border border-border-default bg-bg-surface-muted p-4 text-sm text-text-muted">
              Set NEXT_PUBLIC_OPENPROOF_CONTRACT_ADDRESS after deploying the
              registry contract.
            </p>
          ) : null}
        </Card>

        <Card className="space-y-5">
          {result.status === "verified" ? (
            <div
              aria-live="polite"
              className="space-y-5 rounded-lg border border-success/30 bg-success/10 p-5"
            >
              <div>
                <Badge tone="green">Verified</Badge>
                <h2 className="mt-4 flex items-center gap-3 text-3xl font-black tracking-tight text-success">
                  <CheckCircle2 className="size-8" />
                  Proof found
                </h2>
                <p className="mt-3 text-sm leading-6 text-text-muted">
                  A matching file fingerprint was registered on Base Sepolia by
                  this wallet at the shown timestamp.
                </p>
              </div>
              <ProofTimeline
                steps={[
                  {
                    title: "Local fingerprint matched",
                    text: "The selected file produced the displayed SHA-256 hash.",
                    complete: true,
                  },
                  {
                    title: "Registry entry found",
                    text: "The hash exists in OpenProofRegistry on Base Sepolia.",
                    complete: true,
                  },
                  {
                    title: "Timestamp read",
                    text: formatLocalTimestamp(result.timestamp),
                    complete: true,
                  },
                ]}
              />
              <dl className="grid gap-3 text-sm">
                <ResultRow label="Creator wallet" value={result.creator} />
                <ResultRow
                  label="Timestamp"
                  value={formatLocalTimestamp(result.timestamp)}
                />
                <ResultRow label="Proof ID" value={result.proofId} />
              </dl>
              <div className="flex flex-wrap gap-2">
                <Link
                  className="inline-flex min-h-10 items-center justify-center rounded-[6px] bg-accent px-4 py-2 text-sm font-semibold text-[#0a0a0a] transition hover:brightness-110"
                  href={proofPath(result.proofId)}
                >
                  Open proof page
                </Link>
                <CopyButton label="Copy proof hash" value={result.proofId} />
                <CopyButton label="Copy creator" value={result.creator} />
                {result.transactionHash ? (
                  <>
                    <ExplorerLink href={transactionExplorerUrl(result.transactionHash)}>
                      View transaction on BaseScan
                    </ExplorerLink>
                    <CopyButton label="Copy tx hash" value={result.transactionHash} />
                  </>
                ) : null}
              </div>
              {!result.transactionHash ? (
                <p className="rounded-lg border border-border-default bg-bg-surface-muted p-4 text-sm leading-6 text-text-muted">
                  Transaction link unavailable from the public RPC. The proof ID
                  and contract timestamp were read directly from Base Sepolia.
                </p>
              ) : null}
            </div>
          ) : (
            <>
              <div>
                <Badge tone={result.status === "not-found" ? "red" : "blue"}>
                  Verification status
                </Badge>
                <h2
                  className={`mt-4 flex items-center gap-3 text-3xl font-black tracking-tight ${
                    result.status === "not-found" ? "text-error" : ""
                  }`}
                >
                  {result.status === "not-found" ? (
                    <CircleX className="size-8" />
                  ) : (
                    <ShieldQuestion className="size-8" />
                  )}
                  {result.status === "not-found" ? "Not found" : "Ready to check"}
                </h2>
              </div>
              <EmptyState
                icon={ShieldQuestion}
                title={
                  result.status === "not-found"
                    ? "No matching proof found"
                    : "Ready for local verification"
                }
                text={result.message}
              />
            </>
          )}
        </Card>
      </Section>

      <Section className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <Card className="space-y-5">
          <Badge>Receipt import</Badge>
          <h2 className="text-3xl font-black tracking-tight">
            Validate a downloaded receipt
          </h2>
          <p className="text-sm leading-6 text-text-muted">
            Import an OpenProof receipt JSON from your device. The schema is
            checked locally, then the receipt hash is checked against Base
            Sepolia.
          </p>
          <ReceiptImport onReceipt={verifyReceipt} />
          <div className="flex flex-wrap gap-3">
            <HelperTooltip
              label="Imported receipt verification"
              text="The receipt schema is checked locally, then its hash is checked against the onchain registry."
            />
            <HelperTooltip
              label="Proof receipts"
              text="Receipts help carry proof metadata, but they are not authoritative unless the hash exists onchain."
            />
          </div>
        </Card>

        <Card className="space-y-5">
          <ReceiptResult result={receiptResult} />
        </Card>
      </Section>

      <Section>
        <Card>
          <ProofHistory title="Recent Verifications" type="verified" />
        </Card>
      </Section>
    </main>
  );
}

function ResultRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-bg-surface-muted p-3 sm:p-4">
      <dt className="text-xs uppercase text-text-muted">{label}</dt>
      <dd className="mt-2 break-words font-mono text-xs sm:text-sm">{value}</dd>
    </div>
  );
}

function hydrateTransactionHash(
  publicClient: PublicClient,
  proofHash: `0x${string}`,
  setResult: Dispatch<SetStateAction<VerificationResult>>,
  fallbackTransactionHash?: string,
) {
  findProofTransactionHash(publicClient, proofHash)
    .then((transactionHash) => {
      const nextTransactionHash = transactionHash || fallbackTransactionHash;
      if (!nextTransactionHash) return;
      setResult((current) =>
        current.status === "verified" && current.proofId === proofHash
          ? { ...current, transactionHash: nextTransactionHash }
          : current,
      );
    })
    .catch(() => undefined);
}

function ReceiptResult({ result }: { result: VerificationResult }) {
  if (result.status === "verified") {
    return (
      <div className="space-y-5 rounded-lg border border-success/30 bg-success/10 p-5">
        <Badge tone="green">Valid receipt</Badge>
        <h2 className="flex items-center gap-3 text-3xl font-black tracking-tight text-success">
          <CheckCircle2 className="size-8" />
          Proof exists
        </h2>
        <ProofTimeline
          steps={[
            {
              title: "Receipt schema valid",
              text: "The imported JSON matches the OpenProof receipt shape.",
              complete: true,
            },
            {
              title: "Onchain proof found",
              text: "The receipt hash exists in OpenProofRegistry.",
              complete: true,
            },
            {
              title: "Timestamp confirmed",
              text: formatLocalTimestamp(result.timestamp),
              complete: true,
            },
          ]}
        />
        <dl className="grid gap-3 text-sm">
          <ResultRow label="Creator wallet" value={result.creator} />
          <ResultRow label="Timestamp" value={formatLocalTimestamp(result.timestamp)} />
          <ResultRow label="Proof hash" value={result.proofId} />
          <ResultRow label="Chain" value={openProofChain.name} />
        </dl>
        <div className="flex flex-wrap gap-3">
          <Link
            className="inline-flex min-h-10 items-center justify-center rounded-[6px] bg-accent px-4 py-2 text-sm font-semibold text-[#0a0a0a] transition hover:brightness-110"
            href={proofPath(result.proofId)}
          >
            Open proof page
          </Link>
          <CopyButton label="Copy proof hash" value={result.proofId} />
          <CopyButton label="Copy creator" value={result.creator} />
          {result.transactionHash ? (
            <>
              <ExplorerLink href={transactionExplorerUrl(result.transactionHash)}>
                View transaction on BaseScan
              </ExplorerLink>
              <CopyButton label="Copy tx hash" value={result.transactionHash} />
            </>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <EmptyState
      icon={ShieldQuestion}
      title={
        result.status === "not-found"
          ? "Receipt not found onchain"
          : result.status === "error"
            ? "Receipt invalid"
            : result.status === "loading"
              ? "Checking receipt"
              : "Receipt status"
      }
      text={result.message}
    />
  );
}
