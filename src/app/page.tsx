import Link from "next/link";
const registryAddress = "0x60d3DD631E6e4F6D76f761689d6FA229945a874a";

export default function Home() {
  return (
    <main>
      {/* ── Hero ────────────────────────────────────────────
           Minimal. One sentence. Two actions.
           ───────────────────────────────────────────── */}

      <section className="mx-auto max-w-5xl px-6 pt-28 pb-20 sm:pt-36 sm:pb-24">
        <h1 className="text-5xl font-bold leading-none tracking-tight sm:text-7xl">
          Proof without
          <span className="text-accent"> surrender.</span>
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-text-secondary sm:text-xl">
          OpenProof registers a file&apos;s SHA-256 fingerprint on Base Sepolia.
          The file never leaves your browser. No uploads. No accounts.
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <Link
            className="inline-flex items-center justify-center rounded-[12px] bg-accent px-8 py-4 text-base font-semibold text-white transition-all hover:bg-[#0099ee]"
            href="/create"
          >
            Create a proof
          </Link>
          <Link
            className="inline-flex items-center justify-center rounded-[12px] bg-bg-surface-muted px-8 py-4 text-base font-semibold text-text-primary transition-all hover:bg-[#252525]"
            href="/verify"
          >
            Verify a proof
          </Link>
        </div>
      </section>

      {/* ── How it works ───────────────────────────────────
           Three steps, no filler.
           ───────────────────────────────────────────── */}

      <section className="mx-auto max-w-5xl px-6 pb-24 sm:pb-32">
        <div className="grid gap-6 sm:grid-cols-3">
          {[
            {
              step: "01",
              title: "Select a file",
              text: "Choose any file. It stays on your device.",
            },
            {
              step: "02",
              title: "Register onchain",
              text: "Only the SHA-256 hash is sent to Base Sepolia.",
            },
            {
              step: "03",
              title: "Verify anytime",
              text: "Re-hash the file and check the registry.",
            },
          ].map((item) => (
            <div
              className="rounded-xl border border-border-default bg-bg-surface p-8 sm:p-10"
              key={item.step}
            >
              <span className="text-3xl font-bold text-accent">{item.step}</span>
              <h2 className="mt-4 text-xl font-bold leading-tight">
                {item.title}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-text-secondary">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Registry identity ───────────────────────────────
           Infrastructure anchor. Minimal.
           ───────────────────────────────────────────── */}

      <section className="mx-auto max-w-5xl px-6 pb-24 sm:pb-32">
        <div className="rounded-xl bg-bg-surface p-8 sm:p-10">
          <p className="text-xs font-semibold tracking-wider uppercase text-text-muted">
            Registry
          </p>
          <p className="mt-4 font-mono text-sm break-all text-text-secondary">
            {registryAddress}
          </p>
          <div className="mt-6 flex flex-wrap gap-x-8 gap-y-2 text-sm text-text-secondary">
            <span>Base Sepolia</span>
            <span>Chain ID 84532</span>
            <span>Ownerless</span>
            <span>No fees</span>
          </div>
        </div>
      </section>

      {/* ── System note ────────────────────────────────────
           Single sentence about what OpenProof is.
           ───────────────────────────────────────────── */}

      <section className="mx-auto max-w-5xl px-6 pb-24 sm:pb-32">
        <p className="text-base leading-relaxed text-text-secondary sm:text-lg">
          OpenProof is a proof-of-existence infrastructure tool. It registers
          a SHA-256 fingerprint of a file on Base Sepolia. The file itself
          never leaves your browser. No backend, no database, no accounts,
          no tracking, no telemetry.
        </p>
      </section>
    </main>
  );
}
