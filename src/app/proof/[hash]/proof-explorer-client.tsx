"use client";

import Link from "next/link";
import {
  CheckCircle2,
  ExternalLink,
  Loader2,
  ShieldQuestion,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { usePublicClient } from "wagmi";
import {
  Badge,
  ButtonLink,
  Card,
  EmptyState,
  ExplorerLink,
  HelperTooltip,
  Section,
  StatusPill,
} from "@/components/design-system";
import { CopyButton } from "@/components/copy-button";
import { HashDisplay } from "@/components/hash-display";
import { ProofTimeline } from "@/components/proof-timeline";
import { ProofQrCode } from "@/components/qr-code";
import {
  openProofChain,
  openProofContractAddress,
} from "@/lib/contracts";
import { normalizeClientError } from "@/lib/errors";
import { addressExplorerUrl, transactionExplorerUrl } from "@/lib/explorer";
import {
  findProofTransactionHash,
  isBytes32Hash,
  readOnchainProof,
  type OnchainProof,
} from "@/lib/proofs";
import { formatLocalTimestamp } from "@/lib/time";

type LoadState =
  | { status: "loading" }
  | { status: "invalid"; message: string }
  | { status: "not-found"; message: string }
  | { status: "error"; message: string }
  | { status: "found"; proof: OnchainProof };

export function ProofExplorerClient({ hash }: { hash: string }) {
  const normalizedHash = hash.toLowerCase();
  const publicClient = usePublicClient({ chainId: openProofChain.id });
  const [state, setState] = useState<LoadState>({ status: "loading" });

  const verificationUrl = useMemo(() => {
    if (typeof window === "undefined") return "";
    return window.location.href;
  }, []);

  useEffect(() => {
    async function loadProof() {
      if (!isBytes32Hash(normalizedHash)) {
        setState({
          status: "invalid",
          message: "This proof URL does not contain a valid bytes32 hash.",
        });
        return;
      }

      if (!publicClient) return;

      try {
        const proof = await readOnchainProof(publicClient, normalizedHash);
        if (!proof) {
          setState({
            status: "not-found",
            message:
              "No proof was found for this hash on the configured Base Sepolia registry.",
          });
          return;
        }

        setState({ status: "found", proof });
        findProofTransactionHash(publicClient, normalizedHash)
          .then((transactionHash) => {
            if (!transactionHash) return;
            setState((current) =>
              current.status === "found" && current.proof.fileHash === normalizedHash
                ? {
                    status: "found",
                    proof: { ...current.proof, transactionHash },
                  }
                : current,
            );
          })
          .catch(() => undefined);
      } catch (error) {
        setState({
          status: "error",
          message: normalizeClientError(error, "Could not load proof. Please try again."),
        });
      }
    }

    loadProof();
  }, [normalizedHash, publicClient]);

  return (
    <main>
      <section className="bg-bg-base text-white">
        <Section className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <Badge tone="dark">Public proof explorer</Badge>
            <h1 className="mt-5 text-4xl font-black leading-tight tracking-tight sm:text-6xl">
              Shareable proof page on Base Sepolia.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-text-secondary">
              Anyone can open this URL to check whether the fingerprint exists
              in the OpenProofRegistry contract.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <ButtonLink href="/verify" variant="secondary">
                Verify a file
              </ButtonLink>
              <CopyButton dark label="Copy page URL" value={verificationUrl} />
            </div>
          </div>
          <Card className="space-y-4">
            <StatusPill tone={state.status === "found" ? "green" : "blue"}>
              {state.status === "found" ? "proof found" : "Base Sepolia"}
            </StatusPill>
            <HashDisplay value={normalizedHash} />
            {verificationUrl ? <ProofQrCode url={verificationUrl} /> : null}
          </Card>
        </Section>
      </section>

      <Section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="space-y-5">
          {state.status === "loading" ? (
            <div
              aria-live="polite"
              className="flex items-center gap-3 rounded-lg border border-border-default bg-bg-surface-muted p-5 text-sm text-text-muted"
            >
              <Loader2 className="size-5 animate-spin shrink-0" />
              Checking the Base Sepolia registry for this fingerprint...
            </div>
          ) : state.status === "found" ? (
            <div
              aria-live="polite"
              className="space-y-5 rounded-lg border border-success/30 bg-success/10 p-5"
            >
              <Badge tone="green">Verified onchain</Badge>
              <h2 className="flex items-center gap-3 text-3xl font-black tracking-tight text-success">
                <CheckCircle2 className="size-8" />
                Proof found
              </h2>
              <ProofTimeline
                steps={[
                  {
                    title: "Proof URL opened",
                    text: "The page contains a SHA-256 hash to check.",
                    complete: true,
                  },
                  {
                    title: "Registry read completed",
                    text: "OpenProof read the Base Sepolia contract.",
                    complete: true,
                  },
                  {
                    title: "Timestamp confirmed",
                    text: formatLocalTimestamp(state.proof.timestamp),
                    complete: true,
                  },
                ]}
              />
              <dl className="grid gap-3 text-sm">
                <ResultRow label="Creator wallet" value={state.proof.creator} />
                <ResultRow
                  label="Timestamp"
                  value={formatLocalTimestamp(state.proof.timestamp)}
                />
                <ResultRow label="Chain" value={openProofChain.name} />
                <ResultRow
                  label="Contract"
                  value={openProofContractAddress || "not configured"}
                />
              </dl>
              <div className="flex flex-wrap gap-3">
                <CopyButton label="Copy hash" value={state.proof.fileHash} />
                <CopyButton label="Copy creator" value={state.proof.creator} />
                {state.proof.transactionHash ? (
                  <>
                    <ExplorerLink
                      href={transactionExplorerUrl(state.proof.transactionHash)}
                    >
                      View transaction on BaseScan
                    </ExplorerLink>
                    <CopyButton label="Copy tx hash" value={state.proof.transactionHash} />
                  </>
                ) : null}
                {openProofContractAddress ? (
                  <a
                    className="inline-flex items-center gap-2 rounded-[6px] border border-border-default bg-bg-surface px-4 py-2 text-sm font-semibold transition hover:border-accent hover:text-accent"
                    href={addressExplorerUrl(openProofContractAddress)}
                    rel="noreferrer"
                    target="_blank"
                  >
                    Registry contract
                    <ExternalLink className="size-4" />
                  </a>
                ) : null}
              </div>
            </div>
          ) : (
            <EmptyState
              icon={ShieldQuestion}
              title={
                state.status === "not-found"
                  ? "Proof not found"
                  : "Could not load proof"
              }
              text={state.message}
            />
          )}
        </Card>

        <Card className="space-y-4">
          <Badge>What this page means</Badge>
          <p className="text-sm leading-6 text-text-muted">
            This page checks a hash against the OpenProofRegistry contract on
            Base Sepolia. It does not contain the original file and cannot prove
            ownership, authorship, or legal validity.
          </p>
          <div className="flex flex-wrap gap-3">
            <HelperTooltip
              label="BaseScan"
              text="BaseScan is used for public transaction and contract inspection on Base Sepolia."
            />
            <HelperTooltip
              label="Public hashes"
              text="A proof page shares the hash and onchain metadata. It never contains the original file."
            />
          </div>
          <Link
            className="inline-flex items-center justify-center rounded-[6px] bg-accent px-5 py-3 text-sm font-semibold text-[#0a0a0a] transition hover:brightness-110"
            href="/create"
          >
            Create another proof
          </Link>
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
