"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Download, ExternalLink, Loader2, ShieldCheck } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  useAccount,
  useChainId,
  usePublicClient,
  useSwitchChain,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { FileDrop } from "@/components/file-drop";
import { HashBlock, PageFrame, Panel } from "@/components/ui";
import { transactionExplorerUrl } from "@/lib/explorer";
import { formatBytes, hashFileSha256 } from "@/lib/hash";
import {
  expectedChainId,
  isContractConfigured,
  openProofAbi,
  openProofChain,
  openProofContractAddress,
} from "@/lib/contracts";
import { buildProofReceipt, downloadJson, type ProofReceipt } from "@/lib/receipt";
import { formatLocalTimestamp } from "@/lib/time";

export default function CreateProofPage() {
  const [file, setFile] = useState<File | null>(null);
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

  useEffect(() => {
    if (!file) return;
    setHash(null);
    setHashError(null);
    setReceipt(null);
    setPreflightMessage(null);
    hashFileSha256(file)
      .then(setHash)
      .catch(() => setHashError("The browser could not hash this file."));
  }, [file]);

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
          fileSize: file.size,
          fileMimeType: file.type || "unknown",
          sha256Hash: hash,
          chainId: openProofChain.id,
          chainName: openProofChain.name,
          contractAddress: openProofContractAddress || "",
          transactionHash: txHash,
          creatorWallet: address,
          createdTimestamp: new Date(Number(block.timestamp) * 1000).toISOString(),
        }),
      );
    }

    loadReceipt().catch(() => undefined);
  }, [address, file, hash, publicClient, txHash, txReceipt]);

  const status = useMemo(() => {
    if (hashError) return hashError;
    if (file && !hash) return "Hashing file locally...";
    if (isPending) return "Confirm the wallet transaction.";
    if (isConfirming) return "Transaction submitted. Waiting for confirmation.";
    if (receipt) return "Proof registered on Base Sepolia.";
    return "Select a file to begin.";
  }, [file, hash, hashError, isConfirming, isPending, receipt]);

  async function registerProof() {
    if (!hash || !openProofContractAddress || !publicClient) return;
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
          `This exact file hash is already registered by ${proof.creator} at ${new Date(
            Number(proof.timestamp) * 1000,
          ).toISOString()}. Use Verify Proof to inspect it.`,
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

  return (
    <PageFrame>
      <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <section>
          <p className="text-sm font-medium text-muted">Create Proof</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight">
            Hash a file locally and register the hash on Base Sepolia.
          </h1>
          <p className="mt-4 max-w-2xl leading-7 text-muted">
            OpenProof never uploads your file. The onchain record contains a
            SHA-256 hash, the registering wallet, and the contract timestamp.
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
            <ConnectButton />
            {isWrongChain ? (
              <button
                className="rounded-md border border-border px-4 py-2 text-sm font-medium hover:bg-surface-muted disabled:opacity-60"
                disabled={isSwitching}
                type="button"
                onClick={() => switchChain({ chainId: openProofChain.id })}
              >
                Switch to Base Sepolia
              </button>
            ) : (
              <button
                className="inline-flex items-center gap-2 rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90 disabled:opacity-50"
                disabled={
                  !configured ||
                  !hash ||
                  !isConnected ||
                  isCheckingProof ||
                  isPending ||
                  isConfirming
                }
                type="button"
                onClick={registerProof}
              >
                {isCheckingProof || isPending || isConfirming ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <ShieldCheck className="size-4" />
                )}
                {isCheckingProof ? "Checking proof" : "Register proof"}
              </button>
            )}
          </div>

          {!configured ? (
            <p className="rounded-md border border-border bg-surface-muted p-3 text-sm text-muted">
              Set NEXT_PUBLIC_OPENPROOF_CONTRACT_ADDRESS after deploying the
              registry contract.
            </p>
          ) : null}

          <p className="text-sm text-muted">{status}</p>
          {txHash && !receipt ? (
            <p className="break-words font-mono text-xs text-muted">
              Submitted transaction: {txHash}
            </p>
          ) : null}
          {preflightMessage ? (
            <p className="rounded-md border border-border bg-surface-muted p-3 text-sm text-muted">
              {preflightMessage}
            </p>
          ) : null}
          {error ? <p className="text-sm text-danger">{error.message}</p> : null}
        </Panel>
      </div>

      {receipt ? (
        <Panel className="mt-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold">Proof receipt</h2>
              <p className="text-sm text-muted">
                This JSON is generated locally and is not uploaded anywhere.
              </p>
            </div>
            <button
              className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm font-medium hover:bg-surface-muted"
              type="button"
              onClick={() =>
                downloadJson(`openproof-${receipt.sha256Hash.slice(2, 10)}.json`, receipt)
              }
            >
              <Download className="size-4" />
              Download proof receipt JSON
            </button>
          </div>
          <dl className="grid gap-3 text-sm md:grid-cols-2">
            {Object.entries(receipt).map(([key, value]) => (
              <div className="rounded-md bg-surface-muted p-3" key={key}>
                <dt className="text-xs uppercase text-muted">{key}</dt>
                <dd className="mt-1 break-words font-mono text-xs">
                  {key === "createdTimestamp"
                    ? formatLocalTimestamp(String(value))
                    : String(value)}
                </dd>
              </div>
            ))}
          </dl>
          <a
            className="inline-flex items-center gap-2 text-sm font-medium text-accent"
            href={transactionExplorerUrl(receipt.transactionHash)}
            rel="noreferrer"
            target="_blank"
          >
            View transaction <ExternalLink className="size-4" />
          </a>
        </Panel>
      ) : null}
    </PageFrame>
  );
}
