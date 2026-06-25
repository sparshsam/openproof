import Link from "next/link";
import { openProofChain, openProofContractAddress } from "@/lib/contracts";
import { getExplorerUrl } from "@/lib/explorer";

const baseSepoliaExplorerUrl = getExplorerUrl(84532);
import { ExternalLink } from "lucide-react";

export const metadata = {
  title: "About",
  description:
    "What OpenProof is and why it exists — a privacy-first, open-source proof-of-existence infrastructure tool.",
};

export default function AboutPage() {
  return (
    <main>
      {/* ──────────── Hero ──────────── */}
      <section className="mx-auto max-w-3xl px-6 pt-28 pb-20 sm:pt-40 sm:pb-28">
        <div className="flex flex-col items-center text-center">
          <img
            alt=""
            className="size-24 sm:size-32"
            src="/icon.svg"
          />
          <h1 className="mt-8 text-5xl font-black leading-none tracking-tight sm:text-7xl">
            OpenProof
          </h1>
          <p className="mt-6 text-xl leading-relaxed text-text-secondary sm:text-2xl">
            Proof without surrender.
          </p>
        </div>
        <p className="mt-10 text-base leading-relaxed text-text-secondary sm:text-lg">
          OpenProof is an open-source, privacy-first cryptographic proof-of-existence
          infrastructure tool. It registers a SHA-256 fingerprint of a file on the
          Base Sepolia blockchain. The file itself never leaves your browser. There
          are no uploads, no accounts, and no backend.
        </p>
      </section>

      {/* ──────────── Architecture diagram ──────────── */}
      <ArchitectureDiagram />

      {/* ──────────── How proof works ──────────── */}
      <section className="mx-auto max-w-3xl px-6 pb-20 sm:pb-28">
        <h2 className="text-2xl font-bold sm:text-3xl">How proof works</h2>
        <ol className="mt-8 space-y-6">
          {[
            [
              "Select a file",
              "You pick any file from your device. OpenProof reads the bytes using the browser File API. Nothing is uploaded.",
            ],
            [
              "Hash locally",
              "Your browser computes a SHA-256 fingerprint using the native Web Crypto API. The original file never touches the network.",
            ],
            [
              "Review and connect",
              "You review the hash. If it looks correct, you connect your wallet (RainbowKit, MetaMask, WalletConnect, or any wagmi-compatible wallet).",
            ],
            [
              "Register onchain",
              "Your wallet signs and submits a transaction to the OpenProofRegistry contract on Base Sepolia. Only the 32-byte hash is recorded — never the file.",
            ],
            [
              "Download receipt",
              "A JSON receipt is generated locally with the hash, timestamp, wallet address, and transaction metadata. It auto-downloads to your device.",
            ],
            [
              "Verify anytime",
              "Anyone can re-hash the file and check the proof page, import the receipt, or query the contract directly through a block explorer.",
            ],
          ].map(([title, desc], i) => (
            <li key={title} className="flex gap-4">
              <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-accent/10 text-sm font-bold text-accent">
                {i + 1}
              </span>
              <div>
                <h3 className="text-base font-bold sm:text-lg">{title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-text-secondary sm:text-base">
                  {desc}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* ──────────── What OpenProof can prove ──────────── */}
      <section className="mx-auto max-w-3xl px-6 pb-20 sm:pb-28">
        <h2 className="text-2xl font-bold sm:text-3xl">What OpenProof can prove</h2>
        <p className="mt-4 text-sm leading-relaxed text-text-secondary sm:text-base">
          OpenProof makes narrow, verifiable claims. Every claim below can be
          independently checked by anyone using only the onchain record and
          standard tools.
        </p>
        <ul className="mt-8 space-y-4">
          {[
            "A specific SHA-256 fingerprint existed in the registry at a recorded block time.",
            "A specific wallet address submitted that fingerprint for registration.",
            "A later file produces the same hash as a registered fingerprint (file is unchanged).",
            "A bundle of files produces the same combined hash (all files match the original set).",
          ].map((item) => (
            <li key={item} className="flex gap-3">
              <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-accent/10">
                <span className="text-sm text-accent font-bold">✓</span>
              </span>
              <span className="text-sm leading-relaxed sm:text-base">
                {item}
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* ──────────── What OpenProof cannot prove ──────────── */}
      <section className="mx-auto max-w-3xl px-6 pb-20 sm:pb-28">
        <h2 className="text-2xl font-bold sm:text-3xl">What OpenProof cannot prove</h2>
        <p className="mt-4 text-sm leading-relaxed text-text-secondary sm:text-base">
          These limitations are by design. OpenProof is a proof-of-existence tool,
          not a legal, ownership, or compliance system. It does not overclaim.
        </p>
        <ul className="mt-8 space-y-4">
          {[
            "Who created the file.",
            "Who owns the file.",
            "That the file contents are true, accurate, or correct.",
            "Legal validity, notarization, or compliance with any regulation.",
            "Authorship, copyright, or intellectual property rights.",
            "Lawful possession or right to possess the file.",
            "That the file hasn't been tampered with before hashing.",
            "Recovery of the original file if it is lost.",
          ].map((item) => (
            <li key={item} className="flex gap-3">
              <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full border border-error/40">
                <span className="text-sm text-error font-bold">✗</span>
              </span>
              <span className="text-sm leading-relaxed text-text-secondary sm:text-base">
                {item}
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* ──────────── Threat model ──────────── */}
      <section className="mx-auto max-w-3xl px-6 pb-20 sm:pb-28">
        <h2 className="text-2xl font-bold sm:text-3xl">Threat model</h2>
        <p className="mt-4 text-sm leading-relaxed text-text-secondary sm:text-base">
          OpenProof minimizes trust by design. Here is exactly what you should
          and should not trust.
        </p>

        <div className="mt-8 grid gap-3 text-sm">
          <h3 className="text-base font-bold">Must trust</h3>
          <div className="rounded-xl border border-border-default bg-bg-surface p-5 text-sm leading-relaxed text-text-secondary">
            <p>
              <strong className="text-text-primary">Smart contract.</strong> The
              deployed bytecode matches the open-source source code at a known
              commit. Verify on{" "}
              <a
                className="text-accent underline transition hover:no-underline"
                href={baseSepoliaExplorerUrl}
                rel="noreferrer"
                target="_blank"
              >
                BaseScan
              </a>
              .
            </p>
            <p className="mt-2">
              <strong className="text-text-primary">Your wallet.</strong> Your
              private keys are securely managed. OpenProof never touches your keys.
            </p>
            <p className="mt-2">
              <strong className="text-text-primary">Blockchain consensus.</strong>{" "}
              Base Sepolia correctly executes the contract and finalizes state.
            </p>
          </div>

          <h3 className="mt-2 text-base font-bold">No trust required</h3>
          <div className="rounded-xl border border-border-default bg-bg-surface p-5 text-sm leading-relaxed text-text-secondary">
            <p>
              <strong className="text-text-primary">Frontend.</strong> Every
              operation — hashing, verification, receipt construction — can be
              replaced by standard tools. Use <code className="text-xs">sha256sum</code> and a
              block explorer independently.
            </p>
            <p className="mt-2">
              <strong className="text-text-primary">Hosting provider.</strong> The
              app is a static export. Self-host or verify the build digest.
            </p>
            <p className="mt-2">
              <strong className="text-text-primary">RPC provider.</strong>{" "}
              Cross-verify with multiple RPC endpoints or run your own node.
            </p>
            <p className="mt-2">
              <strong className="text-text-primary">Receipt JSON.</strong> A
              receipt alone is never sufficient. Always verify against the onchain
              record.
            </p>
          </div>

          <h3 className="mt-2 text-base font-bold">Known risks</h3>
          <div className="rounded-xl border border-border-default bg-bg-surface p-5 text-sm leading-relaxed text-text-secondary">
            <ul className="list-disc pl-5 space-y-1.5">
              <li>
                Public hashes can leak information for known, small, or guessable
                files.
              </li>
              <li>
                A malicious frontend deployment could lie about what it hashes or
                submits.
              </li>
              <li>
                Browser local storage can be cleared, corrupted, or inspected by
                anyone with device access.
              </li>
              <li>
                RPC providers can rate-limit or return inaccurate data on the
                read path.
              </li>
              <li>
                Testnet proofs are not production legal or compliance instruments.
              </li>
            </ul>
          </div>
        </div>

        <p className="mt-6 text-sm text-text-muted">
          See the{" "}
          <a
            className="text-accent underline transition hover:no-underline"
            href="https://github.com/sparshsam/openproof/blob/main/docs/TRUST_MODEL.md"
            rel="noreferrer"
            target="_blank"
          >
            full trust model
          </a>{" "}
          for detailed analysis of trust boundaries, deterministic guarantees,
          and governance rules.
        </p>
      </section>

      {/* ──────────── Philosophy ──────────── */}
      <section className="mx-auto max-w-3xl px-6 pb-20 sm:pb-28">
        <h2 className="text-2xl font-bold sm:text-3xl">Our philosophy</h2>
        <div className="mt-10 space-y-10">
          {[
            {
              t: "Privacy-first by design",
              d: "Files are hashed locally in your browser using the Web Crypto API. The original content never touches a network request. Only the resulting 32-byte hash may be submitted to the blockchain if you choose to register a proof.",
            },
            {
              t: "No accounts. No tracking. No analytics.",
              d: "OpenProof has no user accounts, no profiles, no registration, no analytics scripts, no tracking pixels, and no cookies for advertising. There is no backend to store or process user data. Proof history lives only in your browser's local storage.",
            },
            {
              t: "Open source and auditable",
              d: "Every line of code is public under the AGPL-3.0 license. The smart contract, the receipt specification, the frontend, and all documentation are open for anyone to inspect, fork, or self-host. There are no secrets, no proprietary algorithms, and no hidden telemetry.",
            },
            {
              t: "Minimal and permanent",
              d: "The smart contract does one thing: register a bytes32 hash with a wallet address and a timestamp. It cannot be upgraded, paused, or deleted. There are no fees, no owners, and no administrative keys. What is written onchain stays onchain.",
            },
          ].map((item) => (
            <div key={item.t}>
              <h3 className="text-lg font-bold sm:text-xl">{item.t}</h3>
              <p className="mt-3 text-sm leading-relaxed text-text-secondary sm:text-base">
                {item.d}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ──────────── Registry transparency ──────────── */}
      <section className="mx-auto max-w-3xl px-6 pb-20 sm:pb-28">
        <h2 className="text-2xl font-bold sm:text-3xl">Registry transparency</h2>
        <p className="mt-4 text-sm leading-relaxed text-text-secondary sm:text-base">
          The OpenProofRegistry contract is the root of trust for every proof. All
          values below are public and independently verifiable.
        </p>
        <dl className="mt-8 divide-y divide-border-default text-sm">
          <RegistryRow
            label="Contract"
            value={openProofContractAddress ?? "Not configured"}
            mono
            explorerLink={
              openProofContractAddress
                ? `${baseSepoliaExplorerUrl}/address/${openProofContractAddress}`
                : undefined
            }
          />
          <RegistryRow label="Network" value={openProofChain.name} />
          <RegistryRow label="Chain ID" value={String(openProofChain.id)} />
          <RegistryRow
            label="Explorer"
            value={baseSepoliaExplorerUrl}
            explorerLink={baseSepoliaExplorerUrl}
          />
          <RegistryRow
            label="Source code"
            value="OpenProofRegistry.sol"
            explorerLink="https://github.com/sparshsam/openproof/blob/main/contracts/OpenProofRegistry.sol"
          />
          <RegistryRow label="License" value="AGPL-3.0-only" />
        </dl>
      </section>

      {/* ──────────── Details strip ──────────── */}
      <section className="border-t border-border-default">
        <div className="mx-auto max-w-3xl px-6 py-12 sm:py-16">
          <div className="flex flex-wrap items-baseline gap-x-8 gap-y-3 text-sm text-text-muted">
            <span className="text-xs font-bold tracking-widest uppercase text-text-secondary">
              Details
            </span>
            <span>AGPL-3.0</span>
            <span>v0.1.4</span>
            <Link
              className="transition hover:text-text-primary"
              href="https://github.com/sparshsam/openproof"
              rel="noreferrer"
              target="_blank"
            >
              GitHub
            </Link>
            <span>Built by Sparsh Sam</span>
          </div>
        </div>
      </section>
    </main>
  );
}

/* ──────────── Architecture diagram ──────────── */

function ArchitectureDiagram() {
  return (
    <section className="mx-auto max-w-5xl px-6 pb-20 sm:pb-28">
      <h2 className="mx-auto max-w-3xl text-2xl font-bold sm:text-3xl">
        Architecture
      </h2>
      <p className="mx-auto mt-4 max-w-3xl text-sm leading-relaxed text-text-secondary sm:text-base">
        OpenProof has two layers. The browser handles all file operations. The
        blockchain is the only persistent state. No layer in between stores,
        relays, or processes file bytes.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-0 overflow-hidden rounded-2xl border border-border-default sm:grid-cols-2">
        {/* Browser zone */}
        <div className="bg-bg-surface p-6 sm:p-8">
          <span className="text-xs font-bold tracking-wider uppercase text-accent">
            Your browser
          </span>
          <div className="mt-5 space-y-3">
            <ArchBox label="File API" sub="Read file bytes" />
            <ArchArrow />
            <ArchBox label="Web Crypto API" sub="SHA-256 hash" />
            <ArchArrow />
            <ArchBox label="Your Wallet" sub="Sign & submit tx" />
          </div>
        </div>

        {/* Blockchain zone */}
        <div className="border-t border-border-default bg-bg-surface p-6 sm:border-t-0 sm:border-l sm:p-8">
          <span className="text-xs font-bold tracking-wider uppercase text-accent">
            Base Sepolia
          </span>
          <div className="mt-5 space-y-3">
            <ArchBox
              label="OpenProofRegistry"
              sub="registerProof(bytes32)"
            />
            <ArchArrow />
            <ArchBox
              label="Proof stored"
              sub="creator + timestamp (immutable)"
            />
          </div>
          <ArchDownLabel label="Only bytes32 hashes cross the network boundary" />
        </div>
      </div>

      <p className="mt-6 text-xs leading-relaxed text-text-muted sm:text-sm">
        The frontend is a static export. It can be self-hosted, served from any
        HTTP server, or run offline. The contract is immutable — no upgrade, no
        admin keys, no fees.
      </p>
    </section>
  );
}

function ArchBox({ label, sub }: { label: string; sub: string }) {
  return (
    <div className="rounded-xl border border-border-default bg-bg-base px-5 py-3.5">
      <p className="text-sm font-bold text-text-primary">{label}</p>
      <p className="mt-0.5 text-xs text-text-secondary">{sub}</p>
    </div>
  );
}

function ArchArrow() {
  return (
    <div className="flex justify-center">
      <span className="text-text-muted text-xs">↓</span>
    </div>
  );
}

function ArchDownLabel({ label }: { label: string }) {
  return (
    <div className="mt-6 text-center">
      <span className="inline-block rounded-full border border-border-default px-4 py-1.5 text-[11px] font-semibold text-text-muted">
        {label}
      </span>
    </div>
  );
}

/* ──────────── Registry row ──────────── */

function RegistryRow({
  label,
  value,
  explorerLink,
  mono,
}: {
  label: string;
  value: string;
  explorerLink?: string;
  mono?: boolean;
}) {
  const inner = (
    <span className={`text-right break-all ${mono ? "font-mono text-xs sm:text-sm" : "text-sm"}`}>
      {value}
    </span>
  );
  return (
    <div className="flex justify-between gap-4 py-3">
      <span className="text-text-muted text-xs font-bold tracking-wider uppercase shrink-0">
        {label}
      </span>
      {explorerLink ? (
        <a
          className="inline-flex items-center gap-1.5 text-right text-accent transition hover:underline font-mono text-xs sm:text-sm break-all"
          href={explorerLink}
          rel="noreferrer"
          target="_blank"
        >
          {value} <ExternalLink className="size-3 shrink-0" />
        </a>
      ) : (
        inner
      )}
    </div>
  );
}
