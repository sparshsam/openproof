import Link from "next/link";

/* ── Documentation Hub (stub) ────────────────────────────
   Per INFORMATION_ARCHITECTURE §3.5
   ─────────────────────────────────────────────────────── */

export default function DocsPage() {
  return (
    <main className="mx-auto max-w-5xl px-5 pt-16 pb-24">
      <h1 className="text-2xl font-semibold tracking-tight">Documentation</h1>

      <p className="mt-2 text-sm leading-relaxed text-text-secondary max-w-prose">
        Governance, specification, architecture, and security documentation for
        OpenProof.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-border-default bg-bg-surface p-5">
          <h2 className="text-base font-semibold">Specification</h2>
          <p className="mt-1 text-xs leading-relaxed text-text-muted">
            Canonical proof receipt format, JSON Schema, and deterministic test
            vectors.
          </p>
          <Link
            className="mt-3 inline-block text-sm font-medium text-accent transition-colors hover:underline"
            href="/docs/spec"
          >
            Read the spec &rarr;
          </Link>
        </div>

        <div className="rounded-lg border border-border-default bg-bg-surface p-5">
          <h2 className="text-base font-semibold">Architecture</h2>
          <p className="mt-1 text-xs leading-relaxed text-text-muted">
            System overview, components, data flow, and verification lifecycle.
          </p>
          <Link
            className="mt-3 inline-block text-sm font-medium text-accent transition-colors hover:underline"
            href="/docs/architecture"
          >
            View architecture &rarr;
          </Link>
        </div>

        <div className="rounded-lg border border-border-default bg-bg-surface p-5">
          <h2 className="text-base font-semibold">Security</h2>
          <p className="mt-1 text-xs leading-relaxed text-text-muted">
            Trust model, threat analysis, failure modes, and security
            principles.
          </p>
          <Link
            className="mt-3 inline-block text-sm font-medium text-accent transition-colors hover:underline"
            href="/docs/security"
          >
            View security docs &rarr;
          </Link>
        </div>

        <div className="rounded-lg border border-border-default bg-bg-surface p-5">
          <h2 className="text-base font-semibold">Governance</h2>
          <p className="mt-1 text-xs leading-relaxed text-text-muted">
            Systems doctrine, non-goals, design restraints, architectural
            invariants, and UI doctrine.
          </p>
          <Link
            className="mt-3 inline-block text-sm font-medium text-accent transition-colors hover:underline"
            href="/docs/governance"
          >
            View governance &rarr;
          </Link>
        </div>
      </div>
    </main>
  );
}
