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

      {/* ── Who it's for — lean, readable ──────────────── */}
      <section className="mx-auto max-w-5xl px-6 pt-36 pb-24 sm:pt-48 sm:pb-32">
        <h2 className="text-3xl font-black sm:text-4xl">Who uses OpenProof</h2>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-text-secondary">
          Anyone who needs to prove a file existed at a specific time — without
          revealing or uploading the file itself.
        </p>
        <div className="mt-12 grid gap-x-16 gap-y-8 sm:grid-cols-2 sm:gap-y-10">
          {[
            ["Developers", "Timestamp release artifacts, build outputs, and dependency manifests to verify integrity later."],
            ["Creators & artists", "Prove your original work existed before publishing, sharing, or sending it to a collaborator."],
            ["Researchers & academics", "Establish priority of findings, datasets, and preprints before peer review or publication."],
            ["Legal professionals", "Create independently verifiable timestamps for contracts, disclosures, and records of counsel."],
            ["Journalists", "Anchoring source material, internal communications, and unpublished drafts to a permanent timestamp."],
            ["Businesses & compliance", "Document integrity checks for regulatory records, audit trails, and internal policy adherence."],
            ["Archivists & preservationists", "Long-term integrity verification for digital collections, cultural records, and historical documents."],
            ["Individuals", "Personal records — wills, letters, receipts, photos, certificates — anyone can timestamp anything."],
          ].map(([title, desc]) => (
            <div key={title as string}>
              <h3 className="text-base font-bold sm:text-lg">{title as string}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-text-secondary">{desc as string}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Editorial: How it works ──────────────────────
           Large numbers. Horizontal rhythm. No cards.
           ───────────────────────────────────────────── */}
      <section className="mx-auto max-w-5xl px-6 pb-24 sm:pb-32">
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

      {/* ── Real-world scenarios ───────────────────────── */}
      <section className="border-t border-border-default">
        <div className="mx-auto max-w-5xl px-6 py-24 sm:py-32">
          <h2 className="text-3xl font-black sm:text-4xl">When to timestamp a file</h2>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-text-secondary">
            A blockchain timestamp is useful any time you want to prove a file
            existed before an event — publication, collaboration, disclosure, or
            loss. The hash captures the file&apos;s identity at that moment.
          </p>
          <div className="mt-12 grid gap-x-16 gap-y-10 sm:grid-cols-2">
            {[
              {
                t: "Before publishing",
                d: "Timestamp a draft or dataset before you publish. If someone later claims you copied them, the onchain fingerprint shows your file existed first.",
              },
              {
                t: "Before sharing with others",
                d: "Send a file to a collaborator? Timestamp it first. If the relationship sours, you can prove you held the original at a known time.",
              },
              {
                t: "Before archiving",
                d: "Timestamp a file before moving it to cold storage or a new format. Years later, verify the content hasn't drifted from the original.",
              },
              {
                t: "Before regulatory submission",
                d: "Records, logs, and compliance documents can be timestamped before submission. The onchain record serves as an independent integrity checkpoint.",
              },
            ].map(({ t, d }) => (
              <div key={t}>
                <h3 className="text-base font-bold sm:text-lg">{t}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-text-secondary">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── What it proves vs doesn't ──────────────────── */}
      <section className="mx-auto max-w-5xl px-6 py-24 sm:py-32">
        <h2 className="text-3xl font-black sm:text-4xl">What a proof means</h2>
        <div className="mt-12 grid gap-x-16 gap-y-10 sm:grid-cols-2">
          <div>
            <h3 className="text-base font-bold text-accent sm:text-lg">OpenProof proves</h3>
            <ul className="mt-4 space-y-3">
              {[
                "A specific SHA-256 fingerprint existed in the registry at a recorded block time.",
                "A specific wallet address submitted that hash for registration.",
                "A file you hold today produces the same hash (it is unchanged since registration).",
              ].map((item) => (
                <li className="flex gap-3 text-sm leading-relaxed text-text-secondary" key={item}>
                  <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-accent/10">
                    <span className="text-xs text-accent font-bold">✓</span>
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-base font-bold text-text-secondary sm:text-lg">OpenProof does not prove</h3>
            <ul className="mt-4 space-y-3">
              {[
                "Who created, owns, or has rights to the file.",
                "That the file contents are true, accurate, or correct.",
                "That the file is legally valid or compliant with any regulation.",
                "Recovery of the original file if it is lost.",
              ].map((item) => (
                <li className="flex gap-3 text-sm leading-relaxed text-text-secondary" key={item}>
                  <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border border-error/40">
                    <span className="text-xs text-error font-bold">✗</span>
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
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

      {/* ── Privacy-first messaging ───────────────────── */}
      <section className="mx-auto max-w-5xl px-6 py-24 sm:py-32">
        <h2 className="text-3xl font-black sm:text-4xl">Privacy by design</h2>
        <div className="mt-12 grid gap-x-16 gap-y-10 sm:grid-cols-2">
          {[
            {
              t: "No uploads",
              d: "Files are hashed locally in your browser using the native Web Crypto API. The bytes never leave your device. Only the 32-byte SHA-256 hash leaves your browser — and only when you choose to register it.",
            },
            {
              t: "No accounts",
              d: "There is no sign-up, no profile, no database of users. OpenProof has no backend. Your proof history lives in your browser's local storage, not on a server.",
            },
            {
              t: "Permanent verification",
              d: "Once a hash is registered on Base Sepolia, it is immutable. Anyone can verify the proof using the onchain record alone — no website, no account, no special software required.",
            },
            {
              t: "No tracking",
              d: "OpenProof contains no analytics scripts, no tracking pixels, no cookies, and no telemetry. There is nothing to opt out of because nothing is collected.",
            },
          ].map(({ t, d }) => (
            <div key={t}>
              <h3 className="text-base font-bold sm:text-lg">{t}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-text-secondary">{d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Brand statement ─────────────────────────────
           Bold. Simple. No card, no border.
           ───────────────────────────────────────────── */}
      <section className="mx-auto max-w-5xl px-6 pb-28 sm:pb-40">
        <p className="text-2xl font-bold leading-relaxed sm:text-3xl lg:text-4xl">
          OpenProof is proof-of-existence infrastructure. A SHA-256 fingerprint
          on Base Sepolia. No backend, no database, no tracking. Just a hash
          onchain.
        </p>
      </section>
    </main>
  );
}
