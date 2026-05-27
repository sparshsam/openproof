"use client";

import { Loader2, SearchCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { usePublicClient } from "wagmi";
import { FileDrop } from "@/components/file-drop";
import { HashBlock, PageFrame, Panel } from "@/components/ui";
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
    setResult({ status: "loading", message: "Checking the onchain registry..." });

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
            "No proof was found for this exact SHA-256 hash on the configured registry.",
        });
        return;
      }

      const proof = await publicClient.readContract({
        abi: openProofAbi,
        address: openProofContractAddress,
        functionName: "getProof",
        args: [hash],
      });

      setResult({
        status: "verified",
        creator: proof.creator,
        timestamp: new Date(Number(proof.timestamp) * 1000).toISOString(),
        proofId: hash,
      });
    } catch (error) {
      setResult({
        status: "error",
        message: error instanceof Error ? error.message : "Verification failed.",
      });
    }
  }

  return (
    <PageFrame>
      <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <section>
          <p className="text-sm font-medium text-muted">Verify Proof</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight">
            Verify whether an exact file hash was registered.
          </h1>
          <p className="mt-4 max-w-2xl leading-7 text-muted">
            Select a file and OpenProof will hash it locally, then query the
            Base Sepolia registry. Verification works only for exact file
            matches.
          </p>
        </section>

        <Panel className="space-y-5">
          <FileDrop file={file} onFile={setFile} />
          {file ? (
            <div className="grid gap-2 rounded-lg border border-border bg-surface-muted p-4 text-sm">
              <div className="flex justify-between gap-4">
                <span className="text-muted">Name</span>
                <span className="text-right font-medium">{file.name}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-muted">Size</span>
                <span>{formatBytes(file.size)}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-muted">Type</span>
                <span>{file.type || "unknown"}</span>
              </div>
            </div>
          ) : null}
          {hash ? <HashBlock value={hash} /> : null}
          <div className="flex flex-wrap items-center gap-3">
            <button
              className="inline-flex items-center gap-2 rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90 disabled:opacity-50"
              disabled={!configured || !hash || result.status === "loading"}
              type="button"
              onClick={verifyProof}
            >
              {result.status === "loading" ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <SearchCheck className="size-4" />
              )}
              Verify proof
            </button>
          </div>
          {!configured ? (
            <p className="rounded-md border border-border bg-surface-muted p-3 text-sm text-muted">
              Set NEXT_PUBLIC_OPENPROOF_CONTRACT_ADDRESS after deploying the
              registry contract.
            </p>
          ) : null}
        </Panel>
      </div>

      <Panel className="mt-6">
        {result.status === "verified" ? (
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold text-success">Verified</h2>
              <p className="text-sm text-muted">
                A matching file hash was registered by this wallet at the shown
                timestamp.
              </p>
            </div>
            <dl className="grid gap-3 text-sm md:grid-cols-3">
              <div className="rounded-md bg-surface-muted p-3">
                <dt className="text-xs uppercase text-muted">Creator address</dt>
                <dd className="mt-1 break-words font-mono text-xs">{result.creator}</dd>
              </div>
              <div className="rounded-md bg-surface-muted p-3">
                <dt className="text-xs uppercase text-muted">Timestamp</dt>
                <dd className="mt-1 font-mono text-xs">
                  {formatLocalTimestamp(result.timestamp)}
                </dd>
              </div>
              <div className="rounded-md bg-surface-muted p-3">
                <dt className="text-xs uppercase text-muted">Proof ID</dt>
                <dd className="mt-1 break-words font-mono text-xs">
                  {result.proofId}
                </dd>
              </div>
            </dl>
          </div>
        ) : (
          <div>
            <h2
              className={`text-lg font-semibold ${
                result.status === "not-found" ? "text-danger" : ""
              }`}
            >
              {result.status === "not-found" ? "Not found" : "Verification status"}
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted">{result.message}</p>
          </div>
        )}
      </Panel>
    </PageFrame>
  );
}
