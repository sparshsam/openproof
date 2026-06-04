import Link from "next/link";
const registryAddress = "0x60d3DD631E6e4F6D76f761689d6FA229945a874a";

/* ─── Homepage ─────────────────────────────────────────────
   Per HOMEPAGE_STRUCTURE.md §2:
   1) Action Cards (primary zone)
   2) Registry Identity (information zone)
   3) System Overview (context zone)
   4) Documentation Links (reference zone)

   No hero section, no step-by-step, no feature grids,
   no ecosystem badges, no wallet connection, no animations.
   ─────────────────────────────────────────────────────── */

export default function Home() {
  return (
    <main>
      {/* ── Section 1: Action Cards ──────────────────────
           Binary interaction model. Equal visual weight.
           Per HOMEPAGE_STRUCTURE §2.1, §3.
           ───────────────────────────────────────────── */}

      <section className="mx-auto max-w-5xl px-5 pt-24 pb-10 sm:pt-32 sm:pb-12">
        <div className="grid gap-6 sm:grid-cols-2">
          {/* Create Proof Card */}
          <Link
            className="group flex flex-col rounded-lg border border-border-default bg-bg-surface p-8 transition-colors hover:border-accent/40 sm:p-10"
            href="/create"
          >
            <h2 className="text-2xl font-semibold tracking-tight">
              Create Proof
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-text-secondary">
              Register a file&apos;s cryptographic fingerprint on Base Sepolia.
            </p>
            <div className="mt-6 inline-flex items-center gap-1.5 self-start rounded-[6px] bg-accent px-4 py-2.5 text-sm font-medium text-[#0a0a0a] transition-colors group-hover:brightness-110">
              Select File
            </div>
            <p className="mt-3 text-xs text-text-muted">
              No wallet connection required until registration.
            </p>
          </Link>

          {/* Verify Proof Card */}
          <Link
            className="group flex flex-col rounded-lg border border-border-default bg-bg-surface p-8 transition-colors hover:border-accent/40 sm:p-10"
            href="/verify"
          >
            <h2 className="text-2xl font-semibold tracking-tight">
              Verify Proof
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-text-secondary">
              Check a file or receipt against the onchain registry.
            </p>
            <div className="mt-6 inline-flex items-center gap-1.5 self-start rounded-[6px] border border-border-default px-4 py-2.5 text-sm font-medium text-text-primary transition-colors hover:bg-bg-surface-muted">
              Select File
            </div>
            <p className="mt-3 text-xs text-text-muted">
              <Link
                className="underline underline-offset-2 transition-colors hover:text-text-secondary"
                href="/verify"
              >
                Import Receipt
              </Link>
            </p>
          </Link>
        </div>
      </section>

      {/* ── Section 2: Registry Identity ─────────────────
           Infrastructure anchor. Full contract address,
           network, chain ID, key properties.
           Per HOMEPAGE_STRUCTURE §8.3.
           ───────────────────────────────────────────── */}

      <section className="mx-auto max-w-5xl px-5 pb-8">
        <div className="rounded-lg border border-border-default bg-bg-surface-muted px-5 py-4 text-sm leading-relaxed text-text-secondary">
          <p>
            <span className="text-text-primary">Registry:</span>{" "}
            <code className="font-mono text-xs break-all">{registryAddress}</code>
          </p>
          <p>
            Base Sepolia &middot; Chain ID 84532
          </p>
          <p>
            Immutable &middot; Ownerless &middot; No fees &middot; No upgrades
          </p>
        </div>
      </section>

      {/* ── Section 3: System Overview ──────────────────
           Canonical text per HOMEPAGE_STRUCTURE §8.4.
           Single compact card, no feature grid, no steps.
           ───────────────────────────────────────────── */}

      <section className="mx-auto max-w-5xl px-5 pb-8">
        <div className="rounded-lg border border-border-default bg-bg-surface p-6 text-sm leading-relaxed text-text-secondary">
          <p className="text-text-primary">
            OpenProof is a proof-of-existence infrastructure tool. It registers
            a SHA-256 fingerprint of a file on Base Sepolia. The file itself
            never leaves your browser.
          </p>
          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-1 text-xs">
            <span>No backend</span>
            <span>No database</span>
            <span>No accounts</span>
            <span>Files never uploaded</span>
            <span>No tracking</span>
            <span>No telemetry</span>
          </div>
          <p className="mt-4 text-xs leading-relaxed text-text-muted">
            Verification is independent of this frontend. Anyone with the
            contract address can verify through any block explorer or RPC
            client.
          </p>
        </div>
      </section>

      {/* ── Section 4: Documentation Links ──────────────
           Reference navigation. Per HOMEPAGE_STRUCTURE §8.5.
           Spec · Architecture · Security · Governance
           ───────────────────────────────────────────── */}

      <section className="mx-auto max-w-5xl px-5 pb-24 sm:pb-32">
        <nav
          className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium"
          aria-label="Documentation"
        >
          <Link
            className="text-text-secondary transition-colors hover:text-text-primary"
            href="/docs/spec"
          >
            Spec
          </Link>
          <Link
            className="text-text-secondary transition-colors hover:text-text-primary"
            href="/docs/architecture"
          >
            Architecture
          </Link>
          <Link
            className="text-text-secondary transition-colors hover:text-text-primary"
            href="/docs/security"
          >
            Security
          </Link>
          <Link
            className="text-text-secondary transition-colors hover:text-text-primary"
            href="/docs/governance"
          >
            Governance
          </Link>
        </nav>
      </section>
    </main>
  );
}
