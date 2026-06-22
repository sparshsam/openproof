import Link from "next/link";

export default function Home() {
  return (
    <main>
      {/* ── Hero ────────────────────────────────────────────
           Bold. Minimal. One statement, two actions.
           ───────────────────────────────────────────── */}
      <section className="mx-auto max-w-5xl px-6 pt-28 pb-24 sm:pt-40 sm:pb-32">
        <div className="rounded-3xl bg-bg-surface p-10 sm:p-16 lg:p-20">
          <h1 className="text-5xl font-bold leading-none tracking-tight sm:text-7xl lg:text-8xl">
            Proof
            <br />
            <span className="text-accent">without</span>
            <br />
            surrender.
          </h1>
          <p className="mt-8 max-w-lg text-lg leading-relaxed text-text-secondary sm:text-xl">
            OpenProof registers a file&apos;s SHA-256 fingerprint on Base Sepolia.
            The file never leaves your browser. No uploads. No accounts.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              className="inline-flex items-center justify-center rounded-full bg-accent px-8 py-4 text-base font-semibold text-white transition-all hover:bg-[#0099ee]"
              href="/create"
            >
              Create a proof
            </Link>
            <Link
              className="inline-flex items-center justify-center rounded-full bg-white text-black px-8 py-4 text-base font-semibold transition-all hover:bg-gray-200"
              href="/verify"
            >
              Verify a proof
            </Link>
          </div>
        </div>
      </section>

      {/* ── How it works ───────────────────────────────────
           Three steps, editorial layout, asymmetrical.
           ───────────────────────────────────────────── */}
      <section className="mx-auto max-w-5xl px-6 pb-28 sm:pb-40">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          How it works
        </h2>
        <div className="mt-12 grid gap-8 sm:grid-cols-3">
          {[
            { step: "01", title: "Choose a file", text: "Select any file from your device. It stays local." },
            { step: "02", title: "Register onchain", text: "The SHA-256 hash is sent to Base Sepolia. The file never leaves." },
            { step: "03", title: "Verify anytime", text: "Re-hash the file and check it against the registry." },
          ].map((item, i) => (
            <div key={item.step} className={i === 1 ? "sm:mt-12" : ""}>
              <span className="text-5xl font-black text-accent">{item.step}</span>
              <h3 className="mt-5 text-xl font-bold leading-tight">{item.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-text-secondary">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Registry ──────────────────────────────────────
           Infrastructure anchor. Minimal.
           ───────────────────────────────────────────── */}
      <section className="mx-auto max-w-5xl px-6 pb-28 sm:pb-40">
        <div className="rounded-3xl bg-bg-surface p-8 sm:p-10">
          <p className="text-xs font-semibold tracking-widest uppercase text-text-muted">Registry</p>
          <code className="mt-4 block font-mono text-sm break-all text-text-secondary">0x60d3DD631E6e4F6D76f761689d6FA229945a874a</code>
          <div className="mt-6 flex flex-wrap gap-x-10 gap-y-2 text-sm text-text-secondary">
            <span>Base Sepolia</span>
            <span>Chain ID 84532</span>
            <span>Ownerless</span>
            <span>No fees</span>
          </div>
        </div>
      </section>

      {/* ── Principles ────────────────────────────────────
           Single concise statement about what OpenProof is.
           ───────────────────────────────────────────── */}
      <section className="mx-auto max-w-5xl px-6 pb-32 sm:pb-48">
        <p className="text-lg leading-relaxed text-text-secondary sm:text-xl">
          OpenProof is proof-of-existence infrastructure. It registers a SHA-256
          fingerprint of a file on Base Sepolia. The file itself never leaves your
          browser. No backend, no database, no accounts, no tracking, no telemetry.
          Just a hash onchain.
        </p>
      </section>
    </main>
  );
}
