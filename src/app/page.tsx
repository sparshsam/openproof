import { ArrowRight, FileCheck2, LockKeyhole, SearchCheck } from "lucide-react";
import { HashBlock, Panel, PrimaryLink, SecondaryLink } from "@/components/ui";

export default function Home() {
  return (
    <main>
      <section className="mx-auto grid min-h-[calc(100vh-180px)] max-w-6xl items-center gap-10 px-5 py-10 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            Create verifiable proof that a file existed at a certain time
            without uploading the file.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-muted">
            Files are hashed locally. Only the hash is sent onchain.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <PrimaryLink href="/create">Create Proof</PrimaryLink>
            <SecondaryLink href="/verify">Verify Proof</SecondaryLink>
          </div>
        </div>

        <Panel className="space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Proof preview</p>
              <p className="text-xs text-muted">Base Sepolia testnet</p>
            </div>
            <span className="rounded-md bg-accent-soft px-2 py-1 text-xs font-medium text-accent">
              local hash
            </span>
          </div>
          <div className="rounded-lg border border-dashed border-border bg-surface-muted p-5">
            <p className="text-sm font-medium">design-spec.pdf</p>
            <p className="mt-1 text-xs text-muted">428 KB · application/pdf</p>
          </div>
          <HashBlock value="0x8b6f2b9c3b1e4f6c8897d29d39e45e4ff34b955cf9e693c8127a92f8ac7f54a1" />
          <div className="grid gap-3 text-sm">
            <div className="flex justify-between gap-4">
              <span className="text-muted">Stored onchain</span>
              <span className="font-medium">hash only</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-muted">Receipt</span>
              <span className="font-medium">downloaded locally</span>
            </div>
          </div>
        </Panel>
      </section>

      <section
        id="privacy"
        className="border-t border-border bg-surface px-5 py-14"
      >
        <div className="mx-auto grid max-w-6xl gap-4 md:grid-cols-3">
          {[
            {
              icon: LockKeyhole,
              title: "Privacy-first",
              text: "OpenProof does not upload files, store receipts, or run a database for the MVP.",
            },
            {
              icon: FileCheck2,
              title: "Proof-of-existence",
              text: "A wallet registers a SHA-256 file hash with a timestamp on Base Sepolia.",
            },
            {
              icon: SearchCheck,
              title: "Exact verification",
              text: "Verification only succeeds when the later file produces the exact same hash.",
            },
          ].map((item) => (
            <div className="rounded-lg border border-border p-5" key={item.title}>
              <item.icon className="size-5 text-accent" />
              <h2 className="mt-4 text-base font-semibold">{item.title}</h2>
              <p className="mt-2 text-sm leading-6 text-muted">{item.text}</p>
            </div>
          ))}
        </div>
        <div className="mx-auto mt-8 flex max-w-6xl items-center gap-2 text-sm text-muted">
          <span>Read the docs for architecture and threat model details</span>
          <ArrowRight className="size-4" />
        </div>
      </section>
    </main>
  );
}
