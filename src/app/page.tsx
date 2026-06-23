import Link from "next/link";

export default function Home() {
  return (
    <main>
      {/* ── Hero — on the black canvas ───────────────────
           No container. No slab. Just type and action.
           ───────────────────────────────────────────── */}
      <section className="mx-auto max-w-5xl px-6 pt-28 sm:pt-40">
        <h1 className="text-5xl font-black leading-none tracking-tight sm:text-7xl lg:text-8xl">
          Proof
          <br />
          <span className="text-accent">without</span>
          <br />
          surrender.
        </h1>
        <p className="mt-8 max-w-xl text-lg leading-relaxed text-text-secondary sm:text-xl">
          A file fingerprint. A blockchain timestamp. No uploads, no accounts,
          no backend. OpenProof registers a SHA-256 hash on Base Sepolia. The
          file never leaves your browser.
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <Link
            className="inline-flex items-center justify-center rounded-full bg-accent px-8 py-4 text-base font-semibold text-white transition-all hover:bg-[#0099ee]"
            href="/create"
          >
            Create a proof
          </Link>
          <Link
            className="inline-flex items-center justify-center rounded-full bg-white px-8 py-4 text-base font-semibold text-black transition-all hover:bg-gray-200"
            href="/verify"
          >
            Verify a proof
          </Link>
        </div>
      </section>

      {/* ── Editorial: How it works ──────────────────────
           Large numbers. Horizontal rhythm. No cards.
           ───────────────────────────────────────────── */}
      <section className="mx-auto max-w-5xl px-6 pt-36 pb-24 sm:pt-48 sm:pb-32">
        <h2 className="text-3xl font-black sm:text-4xl">How it works</h2>
        <div className="mt-16 space-y-20">
          {[
            { n: "01", t: "Choose a file", d: "Select any file from your device. It is read locally and never uploaded." },
            { n: "02", t: "Register the hash", d: "OpenProof hashes the file with SHA-256 in your browser. Connect a wallet and write only that 32-byte hash to the Base Sepolia registry." },
            { n: "03", t: "Verify forever", d: "Anyone can re-hash the file and check whether the fingerprint exists onchain. No wallet needed. No login. No fee." },
          ].map((s) => (
            <div className="grid gap-6 sm:grid-cols-[auto_1fr] sm:gap-12" key={s.n}>
              <span className="text-6xl font-black leading-none text-accent sm:text-7xl lg:text-8xl">{s.n}</span>
              <div className="pt-2">
                <h3 className="text-2xl font-bold sm:text-3xl">{s.t}</h3>
                <p className="mt-4 max-w-lg text-base leading-relaxed text-text-secondary sm:text-lg">{s.d}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Registry — sleek horizontal strip ──────────
           Like a stock ticker. No box.
           ───────────────────────────────────────────── */}
      <section className="border-t border-b border-border-default">
        <div className="mx-auto max-w-5xl px-6">
          <div className="flex flex-wrap items-baseline gap-x-8 gap-y-2 py-6 text-sm sm:text-base">
            <span className="text-xs font-bold tracking-widest uppercase text-text-muted">Registry</span>
            <code className="font-mono text-text-secondary break-all">0x60d3DD631E6e4F6D76f761689d6FA229945a874a</code>
            <span className="text-text-muted">Base Sepolia</span>
            <span className="text-text-muted">84532</span>
            <span className="text-text-muted">Ownerless</span>
          </div>
        </div>
      </section>

      {/* ── Brand statement ─────────────────────────────
           Bold. Simple. No card, no border.
           ───────────────────────────────────────────── */}
      <section className="mx-auto max-w-5xl px-6 py-28 sm:py-40">
        <p className="text-2xl font-bold leading-relaxed sm:text-3xl lg:text-4xl">
          OpenProof is proof-of-existence infrastructure. A SHA-256 fingerprint
          on Base Sepolia. No backend, no database, no tracking. Just a hash
          onchain.
        </p>
      </section>
    </main>
  );
}
