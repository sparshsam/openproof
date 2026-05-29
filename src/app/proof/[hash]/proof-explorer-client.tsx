"use client";

import Link from "next/link";
import {
  CheckCircle2,
  Copy,
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
  Section,
  StatusPill,
} from "@/components/design-system";
import { HashDisplay } from "@/components/hash-display";
import { ProofQrCode } from "@/components/qr-code";
import {
  openProofChain,
  openProofContractAddress,
} from "@/lib/contracts";
import { addressExplorerUrl, transactionExplorerUrl } from "@/lib/explorer";
import { isBytes32Hash, readOnchainProof, type OnchainProof } from "@/lib/proofs";
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
  const [copied, setCopied] = useState(false);

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
      } catch (error) {
        setState({
          status: "error",
          message: error instanceof Error ? error.message : "Could not load proof.",
        });
      }
    }

    loadProof();
  }, [normalizedHash, publicClient]);

  async function copyUrl() {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  }

  return (
    <main>
      <section className="base-grid bg-base-dark text-white">
        <Section className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <Badge tone="dark">Public proof explorer</Badge>
            <h1 className="mt-5 text-4xl font-black leading-tight tracking-tight sm:text-6xl">
              Shareable proof page on Base Sepolia.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-blue-100">
              Anyone can open this URL to check whether the fingerprint exists
              in the OpenProofRegistry contract.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <ButtonLink href="/verify" variant="secondary">
                Verify a file
              </ButtonLink>
              <button
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-5 py-3 text-sm font-semibold transition hover:bg-white/15"
                type="button"
                onClick={copyUrl}
              >
                <Copy className="size-4" />
                {copied ? "Copied" : "Copy page URL"}
              </button>
            </div>
          </div>
          <Card dark className="space-y-4">
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
            <div className="flex items-center gap-3 text-muted">
              <Loader2 className="size-5 animate-spin" />
              Loading proof from Base Sepolia...
            </div>
          ) : state.status === "found" ? (
            <>
              <Badge tone="green">Verified onchain</Badge>
              <h2 className="flex items-center gap-3 text-3xl font-black tracking-tight text-success">
                <CheckCircle2 className="size-8" />
                Proof found
              </h2>
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
                {state.proof.transactionHash ? (
                  <ExplorerLink
                    href={transactionExplorerUrl(state.proof.transactionHash)}
                  >
                    View transaction on BaseScan
                  </ExplorerLink>
                ) : null}
                {openProofContractAddress ? (
                  <a
                    className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm font-semibold transition hover:border-base-blue hover:text-base-blue"
                    href={addressExplorerUrl(openProofContractAddress)}
                    rel="noreferrer"
                    target="_blank"
                  >
                    Registry contract
                    <ExternalLink className="size-4" />
                  </a>
                ) : null}
              </div>
            </>
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
          <p className="text-sm leading-6 text-muted">
            This page checks a hash against the OpenProofRegistry contract on
            Base Sepolia. It does not contain the original file and cannot prove
            ownership, authorship, or legal validity.
          </p>
          <Link
            className="inline-flex items-center justify-center rounded-full bg-base-blue px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-600"
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
    <div className="rounded-3xl bg-surface-muted p-4">
      <dt className="text-xs uppercase tracking-[0.16em] text-muted">{label}</dt>
      <dd className="mt-2 break-words font-mono text-xs">{value}</dd>
    </div>
  );
}

