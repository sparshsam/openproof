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
  ExplorerLink,
  HelperTooltip,
  Section,
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
      <section className="mx-auto max-w-5xl px-6 pt-20 pb-12 sm:pt-28 sm:pb-16">
        <Badge tone="blue">Public proof explorer</Badge>
        <h1 className="mt-5 text-4xl font-bold leading-tight tracking-tight sm:text-6xl">
          Shareable proof page
          <br />
          <span className="text-text-secondary">on Base Sepolia.</span>
        </h1>
        <p className="mt-5 max-w-xl text-lg leading-relaxed text-text-secondary">
          Anyone can open this URL to check whether the fingerprint exists
          in the OpenProofRegistry contract.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <ButtonLink href="/verify" variant="secondary">
            Verify a file
          </ButtonLink>
          <CopyButton label="Copy page URL" value={verificationUrl} />
        </div>
      </section>

      <Section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] !pt-0">
        <Card>
          {state.status === "loading" ? (
            <div
              aria-live="polite"
              className="flex items-center gap-3 rounded-xl bg-bg-surface-muted p-6 text-sm text-text-secondary"
            >
              <Loader2 className="size-5 animate-spin shrink-0" />
              Checking the Base Sepolia registry for this fingerprint...
            </div>
          ) : state.status === "found" ? (
            <div aria-live="polite" className="space-y-6">
              <Badge tone="green">Verified onchain</Badge>
              <div className="flex items-center gap-4">
                <CheckCircle2 className="size-10 text-accent shrink-0" />
                <div>
                  <h2 className="text-2xl font-bold tracking-tight text-accent">Proof found</h2>
                </div>
              </div>
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
                      View on BaseScan
                    </ExplorerLink>
                    <CopyButton label="Copy tx hash" value={state.proof.transactionHash} />
                  </>
                ) : null}
                {openProofContractAddress ? (
                  <a
                    className="inline-flex items-center gap-2 rounded-[10px] bg-bg-surface-muted px-4 py-3 text-sm font-semibold text-text-primary transition-all hover:bg-[#252525]"
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
            <div className="rounded-xl bg-bg-surface-muted p-8 text-center">
              <ShieldQuestion className="mx-auto mb-4 size-6 text-text-muted" />
              <p className="text-lg font-semibold text-text-primary">
                {state.status === "not-found" ? "Proof not found" : "Could not load proof"}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-text-secondary max-w-md mx-auto">
                {state.message}
              </p>
            </div>
          )}
        </Card>

        <Card>
          <div className="space-y-6">
            <Badge>What this page means</Badge>
            <p className="text-sm leading-relaxed text-text-secondary">
              This page checks a hash against the OpenProofRegistry contract on
              Base Sepolia. It does not contain the original file and cannot prove
              ownership, authorship, or legal validity.
            </p>
            <HashDisplay value={normalizedHash} />
            {verificationUrl ? <ProofQrCode url={verificationUrl} /> : null}
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
              className="inline-flex items-center justify-center rounded-[10px] bg-accent px-6 py-4 text-sm font-semibold text-white transition-all hover:bg-[#0099ee] w-full sm:w-auto"
              href="/create"
            >
              Create another proof
            </Link>
          </div>
        </Card>
      </Section>
    </main>
  );
}

function ResultRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-bg-surface-muted p-4">
      <dt className="text-xs font-semibold tracking-wider uppercase text-text-muted">{label}</dt>
      <dd className="mt-2 break-words font-mono text-sm">{value}</dd>
    </div>
  );
}
