import {
  CheckCircle2,
  FileCheck2,
  Fingerprint,
  SearchCheck,
  ShieldAlert,
  ShieldCheck,
  Upload,
} from "lucide-react";
import { BaseSepoliaNotice } from "@/components/base-notice";
import {
  Badge,
  ButtonLink,
  Card,
  ExplorerLink,
  Section,
  StatusPill,
  StepCard,
} from "@/components/design-system";
import { HashDisplay } from "@/components/hash-display";
import { addressExplorerUrl } from "@/lib/explorer";

const registryAddress = "0x60d3DD631E6e4F6D76f761689d6FA229945a874a";

export default function Home() {
  return (
    <main>
      <section className="base-grid overflow-hidden bg-base-dark text-white">
        <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-6xl min-w-0 items-center gap-10 px-5 py-16 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="min-w-0">
            <Badge tone="dark">Built on Base Sepolia</Badge>
            <h1 className="mt-6 max-w-[21rem] text-3xl font-black leading-[0.95] tracking-tight sm:max-w-4xl sm:text-6xl lg:text-7xl">
              Cryptographic proof for files, built on Base.
            </h1>
            <p className="mt-6 max-w-[21rem] text-base leading-8 text-blue-100 sm:max-w-2xl sm:text-xl">
              OpenProof lets you timestamp a file fingerprint onchain without
              uploading the file anywhere.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <ButtonLink href="/create">Create Proof</ButtonLink>
              <ButtonLink href="/verify" variant="secondary">
                Verify Proof
              </ButtonLink>
            </div>
            <BaseSepoliaNotice className="mt-7 max-w-[21rem] border-white/15 bg-white/10 text-blue-100 sm:max-w-2xl" />
          </div>

          <Card dark className="max-w-[21rem] space-y-6 sm:max-w-full">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold">OpenProofRegistry</p>
                <p className="mt-1 text-sm text-blue-100">Base Sepolia testnet</p>
              </div>
              <StatusPill tone="green">hash only</StatusPill>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-5">
              <div className="flex items-center gap-3">
                <span className="grid size-11 place-items-center rounded-2xl bg-base-blue">
                  <Upload className="size-5" />
                </span>
                <div>
                  <p className="font-semibold">research-notes.pdf</p>
                  <p className="text-sm text-blue-100">Local file - never uploaded</p>
                </div>
              </div>
            </div>
            <HashDisplay value="0x8b6f2b9c3b1e4f6c8897d29d39e45e4ff34b955cf9e693c8127a92f8ac7f54a1" />
            <div className="grid gap-3 text-sm text-blue-100">
              <div className="flex justify-between gap-4">
                <span>Network</span>
                <span className="font-semibold text-white">Base Sepolia</span>
              </div>
              <div className="flex justify-between gap-4">
                <span>Proof output</span>
                <span className="font-semibold text-white">JSON receipt</span>
              </div>
            </div>
          </Card>
        </div>
      </section>

      <Section>
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Badge>How it works</Badge>
            <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-5xl">
              Five steps. No file upload.
            </h2>
          </div>
          <p className="max-w-xl text-sm leading-6 text-muted">
            OpenProof keeps the file local, registers only the fingerprint, and
            leaves verification public.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-5">
          {[
            { icon: Upload, title: "Select file", text: "Choose a local file in the browser." },
            { icon: Fingerprint, title: "Hash locally", text: "Generate a SHA-256 fingerprint." },
            { icon: ShieldCheck, title: "Connect wallet", text: "Use a wallet on Base Sepolia." },
            { icon: FileCheck2, title: "Register proof", text: "Write the fingerprint onchain." },
            { icon: SearchCheck, title: "Verify later", text: "Match the exact file again." },
          ].map((item, index) => (
            <StepCard
              active={index === 0}
              icon={item.icon}
              key={item.title}
              step={index + 1}
              text={item.text}
              title={item.title}
            />
          ))}
        </div>
      </Section>

      <Section className="grid gap-5 lg:grid-cols-2">
        <Card>
          <Badge>Privacy-first by design</Badge>
          <h2 className="mt-5 text-3xl font-black tracking-tight">
            The file stays with the user.
          </h2>
          <p className="mt-4 leading-7 text-muted">
            OpenProof uses the browser File API and Web Crypto API. The app does
            not need a backend, storage bucket, database, or IPFS service for
            the core proof flow.
          </p>
          <div className="mt-6 grid gap-3">
            {["No uploads", "No storage bucket", "No database required"].map((item) => (
              <div className="flex items-center gap-3" key={item}>
                <CheckCircle2 className="size-5 text-success" />
                <span className="font-semibold">{item}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <Badge>What OpenProof proves</Badge>
          <h2 className="mt-5 text-3xl font-black tracking-tight">
            A matching hash was registered on Base Sepolia.
          </h2>
          <p className="mt-4 leading-7 text-muted">
            OpenProof proves that a wallet registered a matching file
            fingerprint at a contract timestamp. Verification only works for an
            exact file match.
          </p>
          <div className="mt-6 grid gap-3">
            {["Creator wallet", "Contract timestamp", "SHA-256 proof ID"].map((item) => (
              <div className="flex items-center gap-3" key={item}>
                <ShieldCheck className="size-5 text-base-blue" />
                <span className="font-semibold">{item}</span>
              </div>
            ))}
          </div>
        </Card>
      </Section>

      <Section className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <Card>
          <Badge tone="red">What it does not claim</Badge>
          <div className="mt-5 flex gap-4">
            <ShieldAlert className="size-7 shrink-0 text-danger" />
            <p className="leading-7 text-muted">
              OpenProof does not prove ownership, authorship, legal validity, or
              the truth of a file&apos;s contents. It proves a matching hash was
              registered by a wallet at a certain time.
            </p>
          </div>
        </Card>

        <Card>
          <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
            <div>
              <Badge>Built on Base Sepolia</Badge>
              <h2 className="mt-5 text-3xl font-black tracking-tight">
                Deployed registry contract.
              </h2>
              <p className="mt-4 text-sm leading-6 text-muted">
                Base Sepolia keeps the MVP testable without real funds. Base
                mainnet deployment is a future roadmap item.
              </p>
            </div>
            <ExplorerLink href={addressExplorerUrl(registryAddress)}>
              View on BaseScan
            </ExplorerLink>
          </div>
          <div className="mt-6 rounded-3xl border border-border bg-surface-muted p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
              Registry address
            </p>
            <p className="mt-3 break-all font-mono text-sm font-semibold">
              {registryAddress}
            </p>
          </div>
        </Card>
      </Section>
    </main>
  );
}
