"use client";

import { parseAbiItem } from "viem";
import type { PublicClient } from "viem";
import {
  CheckCircle2,
  FileSearch,
  Fingerprint,
  Loader2,
  SearchCheck,
  ShieldQuestion,
  Upload,
} from "lucide-react";
import { useEffect, useState } from "react";
import { usePublicClient } from "wagmi";
import { BaseSepoliaNotice } from "@/components/base-notice";
import {
  ActionButton,
  Badge,
  Card,
  EmptyState,
  ExplorerLink,
  NetworkNotice,
  Section,
  StatusPill,
  StepCard,
} from "@/components/design-system";
import { FileDrop } from "@/components/file-drop";
import { HashDisplay } from "@/components/hash-display";
import { transactionExplorerUrl } from "@/lib/explorer";
import { formatBytes, hashFileSha256 } from "@/lib/hash";
import {
  isContractConfigured,
  openProofAbi,
  openProofChain,
  openProofContractAddress,
} from "@/lib/contracts";
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
        setResult({ status: "error", message: "The browser could not hash this file." }),
      );
  }, [file]);

  async function verifyProof() {
    if (!hash || !openProofContractAddress || !publicClient) return;
    setResult({ status: "loading", message: "Checking the Base Sepolia registry..." });

    try {
      const exists = await publicClient.readContract({
        abi: openProofAbi,
        address: openProofContractAddress,
        functionName: "proofExists",
        args: [hash],
      });

      if (!exists) {
        setResult({
          status: "not-found",
          message:
            "No proof was found for this exact SHA-256 fingerprint on the configured Base Sepolia registry.",
        });
        return;
      }

      const proof = await publicClient.readContract({
        abi: openProofAbi,
        address: openProofContractAddress,
        functionName: "getProof",
        args: [hash],
      });
      const transactionHash = await findProofTransactionHash(publicClient, hash).catch(
        () => undefined,
      );

      setResult({
        status: "verified",
        creator: proof.creator,
        timestamp: new Date(Number(proof.timestamp) * 1000).toISOString(),
        proofId: hash,
        transactionHash,
      });
    } catch (error) {
      setResult({
        status: "error",
        message: error instanceof Error ? error.message : "Verification failed.",
      });
    }
  }

  return (
    <main>
      <section className="base-grid bg-base-dark text-white">
        <Section className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <Badge tone="dark">Verify Proof</Badge>
            <h1 className="mt-5 text-4xl font-black leading-tight tracking-tight sm:text-6xl">
              Verify a file fingerprint on Base Sepolia.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-blue-100">
              Verification is a public read. No wallet is required to check
              whether an exact file hash was registered.
            </p>
            <BaseSepoliaNotice className="mt-7 border-white/15 bg-white/10 text-blue-100" />
          </div>
          <Card dark className="grid content-start gap-4 sm:grid-cols-3">
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

          <FileDrop file={file} onFile={setFile} />

          {file ? (
            <div className="grid gap-3 rounded-3xl border border-border bg-surface-muted p-5 text-sm sm:grid-cols-3">
              <div>
                <p className="text-xs uppercase tracking-[0.16em] text-muted">Name</p>
                <p className="mt-2 break-words font-semibold">{file.name}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.16em] text-muted">Size</p>
                <p className="mt-2 font-semibold">{formatBytes(file.size)}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.16em] text-muted">Type</p>
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
            <p className="rounded-3xl border border-border bg-surface-muted p-4 text-sm text-muted">
              Set NEXT_PUBLIC_OPENPROOF_CONTRACT_ADDRESS after deploying the
              registry contract.
            </p>
          ) : null}
        </Card>

        <Card className="space-y-5">
          {result.status === "verified" ? (
            <>
              <div>
                <Badge tone="green">Verified</Badge>
                <h2 className="mt-4 flex items-center gap-3 text-3xl font-black tracking-tight text-success">
                  <CheckCircle2 className="size-8" />
                  Proof found
                </h2>
                <p className="mt-3 text-sm leading-6 text-muted">
                  A matching file fingerprint was registered on Base Sepolia by
                  this wallet at the shown timestamp.
                </p>
              </div>
              <dl className="grid gap-3 text-sm">
                <ResultRow label="Creator wallet" value={result.creator} />
                <ResultRow
                  label="Timestamp"
                  value={formatLocalTimestamp(result.timestamp)}
                />
                <ResultRow label="Proof ID" value={result.proofId} />
              </dl>
              {result.transactionHash ? (
                <ExplorerLink href={transactionExplorerUrl(result.transactionHash)}>
                  View transaction on BaseScan
                </ExplorerLink>
              ) : (
                <p className="rounded-3xl border border-border bg-surface-muted p-4 text-sm leading-6 text-muted">
                  Transaction link unavailable from the public RPC. The proof ID
                  and contract timestamp were read directly from Base Sepolia.
                </p>
              )}
            </>
          ) : (
            <>
              <div>
                <Badge tone={result.status === "not-found" ? "red" : "blue"}>
                  Verification status
                </Badge>
                <h2
                  className={`mt-4 flex items-center gap-3 text-3xl font-black tracking-tight ${
                    result.status === "not-found" ? "text-danger" : ""
                  }`}
                >
                  <ShieldQuestion className="size-8" />
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
    </main>
  );
}

function ResultRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl bg-surface-muted p-4">
      <dt className="text-xs uppercase tracking-[0.16em] text-muted">{label}</dt>
      <dd className="mt-2 break-words font-mono text-xs">{value}</dd>
    </div>
  );
}

async function findProofTransactionHash(
  publicClient: PublicClient,
  fileHash: `0x${string}`,
) {
  if (!openProofContractAddress) return undefined;

  const latestBlock = await publicClient.getBlockNumber();
  const chunkSize = 1_900n;
  const maxLookback = 50_000n;
  const floorBlock =
    latestBlock > maxLookback ? latestBlock - maxLookback : 0n;
  let toBlock = latestBlock;

  while (toBlock >= floorBlock) {
    const fromBlock =
      toBlock > chunkSize && toBlock - chunkSize > floorBlock
        ? toBlock - chunkSize
        : floorBlock;

    const logs = await publicClient.getLogs({
      address: openProofContractAddress,
      event: parseAbiItem(
        "event ProofRegistered(bytes32 indexed fileHash, address indexed creator, uint64 timestamp)",
      ),
      args: { fileHash },
      fromBlock,
      toBlock,
    });

    const log = logs.at(-1);
    if (log?.transactionHash) return log.transactionHash;
    if (fromBlock === 0n || fromBlock === floorBlock) break;
    toBlock = fromBlock - 1n;
  }

  return undefined;
}
