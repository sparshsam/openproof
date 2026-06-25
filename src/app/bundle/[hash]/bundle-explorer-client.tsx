"use client";

import Link from "next/link";
import { FileBox, Loader2, ShieldQuestion } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { usePublicClient } from "wagmi";
import { CopyButton } from "@/components/copy-button";
import { ExplorerLink, Label } from "@/components/design-system";
import { HashDisplay } from "@/components/hash-display";
import { ProofQrCode } from "@/components/qr-code";
import { openProofChain, openProofContractAddress } from "@/lib/contracts";
import { normalizeClientError } from "@/lib/errors";
import { addressExplorerUrl, transactionExplorerUrl } from "@/lib/explorer";
import { isBytes32Hash, readOnchainProof, type OnchainProof } from "@/lib/proofs";
import { formatLocalTimestamp } from "@/lib/time";
import { hasBundleManifest } from "@/lib/bundle-storage";

// ── Bundle file type ──
type BundleFileEntry = {
  name: string;
  size: number;
  type: string;
  sha256: `0x${string}`;
};

type BundleManifestData = {
  files: BundleFileEntry[];
  merkleRoot?: `0x${string}`;
  [key: string]: unknown;
};

type LS =
  | { status: "loading" }
  | { status: "invalid" | "not-found" | "error"; message: string }
  | { status: "found"; proof: OnchainProof };

export function BundleExplorerClient({ hash }: { hash: string }) {
  const h = hash.toLowerCase();
  const pc = usePublicClient({ chainId: openProofChain.id });
  const [state, setState] = useState<LS>({ status: "loading" });
  const [bundleManifest, setBundleManifest] = useState<BundleManifestData | null>(null);
  const [bundleError, setBundleError] = useState<string | null>(null);
  const url = useMemo(() => (typeof window === "undefined" ? "" : window.location.href), []);

  // Load onchain proof
  useEffect(() => {
    async function load() {
      if (!isBytes32Hash(h)) { setState({ status: "invalid", message: "Invalid bytes32 hash." }); return; }
      if (!pc) return;
      try {
        const p = await readOnchainProof(pc, h);
        if (!p) { setState({ status: "not-found", message: "No proof found for this hash on Base Sepolia." }); return; }
        setState({ status: "found", proof: p });
      } catch (e) { setState({ status: "error", message: normalizeClientError(e, "Could not load proof.") }); }
    }
    load();
  }, [h, pc]);

  // Try to load bundle manifest from local storage
  useEffect(() => {
    const raw = localStorage.getItem(`openproof:bundle:${h}`);
    if (raw) {
      const parsed = JSON.parse(raw);
      // Use queueMicrotask to defer state update outside the effect body
      queueMicrotask(() => { setBundleManifest(parsed); });
    }
  }, [h]);

  async function handleVerifyInclusion(fileSha256: string) {
    if (!bundleManifest || !bundleManifest.files) return;
    try {
      const leaves = bundleManifest.files.map((f) => f.sha256);
      const index = leaves.indexOf(fileSha256 as `0x${string}`);
      if (index === -1) { setBundleError("File not found in this bundle."); return; }

      // Build tree from leaves
      const { root, tree } = await (async () => {
        const count = nextPowerOf2(leaves.length);
        const tree: `0x${string}`[][] = [];
        let level: `0x${string}`[] = [...leaves];
        const zeroHash = `0x${"00".repeat(32)}` as `0x${string}`;
        while (level.length < count) level.push(zeroHash);
        tree.push(level);
        while (level.length > 1) {
          const next: `0x${string}`[] = [];
          for (let i = 0; i < level.length; i += 2) {
            const combined = new Uint8Array(64);
            combined.set(hexToBytes(level[i] as `0x${string}`), 0);
            combined.set(hexToBytes(level[i + 1] as `0x${string}`), 32);
            const digest = await crypto.subtle.digest("SHA-256", combined.buffer as ArrayBuffer);
            const h = bytesToHex(new Uint8Array(digest));
            next.push(h);
          }
          tree.push(next);
          level = next;
        }
        return { root: tree[tree.length - 1][0], tree };
      })();

      // Generate siblings
      const siblings: `0x${string}`[] = [];
      let idx = index;
      for (let level = 0; level < tree.length - 1; level++) {
        const siblingIndex = idx % 2 === 0 ? idx + 1 : idx - 1;
        const sibling = tree[level][siblingIndex];
        if (sibling) siblings.push(sibling);
        idx = Math.floor(idx / 2);
      }

      // Verify
      let computed: `0x${string}` = fileSha256 as `0x${string}`;
      let cIdx = index;
      for (const sibling of siblings) {
        const left = cIdx % 2 === 0 ? computed : sibling;
        const right = cIdx % 2 === 0 ? sibling : computed;
        const combined = new Uint8Array(64);
        combined.set(hexToBytes(left), 0);
        combined.set(hexToBytes(right), 32);
        const digest = await crypto.subtle.digest("SHA-256", combined.buffer as ArrayBuffer);
        computed = bytesToHex(new Uint8Array(digest));
        cIdx = Math.floor(cIdx / 2);
      }

      if (computed === root) {
        setBundleError(null);
        setBundleManifest({ ...bundleManifest, _verifiedFile: fileSha256 });
      } else {
        setBundleError("Inclusion proof verification failed. The file hash does not match this bundle.");
      }
    } catch (e) {
      setBundleError("Could not verify inclusion: " + (e instanceof Error ? e.message : "unknown error"));
    }
  }

  const fileCount = bundleManifest?.files?.length ?? 0;
  const bundleFiles = bundleManifest?.files ?? null;

  return (
    <main>
      <section className="mx-auto max-w-3xl px-6 pt-24 pb-10 sm:pt-32 sm:pb-14">
        <Label color="accent">Bundle explorer</Label>
        <h1 className="mt-4 text-4xl font-black leading-tight tracking-tight sm:text-6xl">
          Bundle proof page<br /><span className="text-text-secondary">on Base Sepolia.</span>
        </h1>
        <p className="mt-5 max-w-xl text-base leading-relaxed text-text-secondary sm:text-lg">
          This is a multi-file bundle proof. The Merkle root is registered onchain.
          {fileCount > 0 ? ` ${fileCount} files in this bundle.` : ""}
        </p>
      </section>

      <section className="mx-auto max-w-3xl px-6 pb-24 sm:pb-32">
        {state.status === "loading" ? (
          <div className="flex items-center gap-3 py-8 text-sm text-text-secondary">
            <Loader2 className="size-5 animate-spin shrink-0" /> Checking the Base Sepolia registry...
          </div>
        ) : state.status === "found" ? (
          <div className="space-y-10">
            {/* Onchain proof data */}
            <div className="flex items-center gap-6">
              <FileBox className="size-14 text-accent shrink-0" />
              <div>
                <p className="text-3xl font-black text-accent sm:text-4xl">
                  {fileCount > 0 ? "Bundle proof found" : "Proof found"}
                </p>
                <p className="mt-2 text-base text-text-secondary">
                  Merkle root {fileCount > 0 ? `of ${fileCount} files` : ""} registered in OpenProofRegistry on Base Sepolia.
                </p>
              </div>
            </div>

            {/* Onchain records */}
            <div>
              <Label color="muted">Onchain records</Label>
              <dl className="mt-4 divide-y divide-border-default text-sm">
                <DataRow label="Merkle root" value={h} mono />
                <DataRow label="Timestamp" value={formatLocalTimestamp(state.proof.timestamp)} />
                <DataRow label="Wallet" value={state.proof.creator} mono />
                <DataRow label="Network" value={openProofChain.name} />
                <DataRow label="Block" value={state.proof.blockNumber ? `#${state.proof.blockNumber}` : "Fetching..."} />
                <DataRow
                  label="Transaction"
                  value={state.proof.transactionHash ?? "Fetching..."}
                  mono
                  link={state.proof.transactionHash ? transactionExplorerUrl(state.proof.transactionHash) : undefined}
                />
              </dl>
            </div>

            {/* Bundle file listing */}
            {bundleFiles && bundleFiles.length > 0 ? (
              <div>
                <Label color="muted">Bundle files</Label>
                <p className="mt-2 text-xs text-text-muted">
                  Files sorted deterministically. Each file SHA-256 is a leaf in the Merkle tree.
                </p>
                <div className="mt-4 divide-y divide-border-default text-sm">
                  {bundleFiles.map((f: BundleFileEntry, i: number) => (
                    <div key={f.name} className="flex justify-between gap-4 py-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="shrink-0 text-xs text-text-muted w-5">{i + 1}.</span>
                        <span className="truncate font-medium">{f.name}</span>
                        <span className="shrink-0 text-xs text-text-muted">
                          {(f.size / 1024).toFixed(0)} KB
                        </span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {bundleManifest?._verifiedFile === f.sha256 ? (
                          <span className="text-accent text-xs font-semibold">Verified ✓</span>
                        ) : (
                          <button
                            className="text-xs text-accent underline hover:no-underline cursor-pointer"
                            onClick={() => handleVerifyInclusion(f.sha256)}
                          >
                            Verify inclusion
                          </button>
                        )}
                        <CopyButton label="" value={f.sha256} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {bundleError ? (
              <p aria-live="assertive" className="text-sm text-error">{bundleError}</p>
            ) : null}

            {/* Actions */}
            <div className="flex flex-wrap gap-3">
              <CopyButton label="Copy Merkle root" value={h} />
              <CopyButton label="Copy wallet" value={state.proof.creator} />
              {state.proof.transactionHash ? (
                <CopyButton label="Copy transaction" value={state.proof.transactionHash} />
              ) : null}
              {state.proof.transactionHash ? (
                <ExplorerLink href={transactionExplorerUrl(state.proof.transactionHash)}>
                  View on BaseScan
                </ExplorerLink>
              ) : null}
              {openProofContractAddress ? (
                <a
                  className="inline-flex items-center gap-2 rounded-full bg-bg-surface-muted px-5 py-3 text-sm font-semibold text-text-primary transition-all hover:bg-[#252525]"
                  href={addressExplorerUrl(openProofContractAddress)}
                  rel="noreferrer"
                  target="_blank"
                >
                  Registry contract ↗
                </a>
              ) : null}
            </div>

            <HashDisplay value={h} />
            {url ? <ProofQrCode url={url} /> : null}

            <Link
              className="inline-flex items-center rounded-full bg-accent px-8 py-4 text-sm font-semibold text-white transition-all hover:bg-[#0099ee]"
              href="/create"
            >
              Create another proof
            </Link>
          </div>
        ) : (
          <div className="py-12">
            <div className="flex items-center gap-6">
              <ShieldQuestion className="size-14 text-text-muted shrink-0" />
              <div>
                <p className="text-3xl font-black sm:text-4xl">
                  {state.status === "not-found" ? "Bundle not found" : "Could not load bundle"}
                </p>
                <p className="mt-2 text-base text-text-secondary">{state.message}</p>
              </div>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}

function DataRow({
  label, value, mono, link,
}: {
  label: string; value: string; mono?: boolean; link?: string;
}) {
  const inner = (
    <span className={`text-right ${mono ? "font-mono text-xs sm:text-sm break-all" : "text-sm"}`}>
      {value}
    </span>
  );
  return (
    <div className="flex justify-between gap-4 py-3">
      <span className="text-text-muted text-xs font-bold tracking-wider uppercase shrink-0">{label}</span>
      {link ? <a className="text-right text-accent transition hover:underline font-mono text-xs sm:text-sm break-all" href={link} rel="noreferrer" target="_blank">{value} ↗</a> : inner}
    </div>
  );
}

// ── Helpers ──

function nextPowerOf2(n: number): number {
  if (n <= 1) return 1;
  let p = 1;
  while (p < n) p <<= 1;
  return p;
}

function hexToBytes(hex: string): Uint8Array {
  const raw = hex.startsWith("0x") ? hex.slice(2) : hex;
  const bytes = new Uint8Array(raw.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = Number.parseInt(raw.slice(i * 2, i * 2 + 2), 16);
  }
  return bytes;
}

function bytesToHex(bytes: Uint8Array): `0x${string}` {
  return `0x${Array.from(bytes).map((b) => b.toString(16).padStart(2, "0")).join("")}`;
}
