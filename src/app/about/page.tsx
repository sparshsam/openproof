import Link from "next/link";

export const metadata = {
  title: "About",
  description: "What OpenProof is and why it exists — a privacy-first, open-source proof-of-existence infrastructure tool.",
};

export default function AboutPage() {
  return (
    <main>
      <section className="mx-auto max-w-3xl px-6 pt-28 pb-20 sm:pt-40 sm:pb-28">
        <h1 className="text-5xl font-black leading-none tracking-tight sm:text-7xl">
          OpenProof
        </h1>
        <p className="mt-6 text-xl leading-relaxed text-text-secondary sm:text-2xl">
          Proof without surrender.
        </p>
        <p className="mt-10 text-base leading-relaxed text-text-secondary sm:text-lg">
          OpenProof is an open-source, privacy-first cryptographic proof-of-existence
          infrastructure tool. It registers a SHA-256 fingerprint of a file on the
          Base Sepolia blockchain. The file itself never leaves your browser. There
          are no uploads, no accounts, and no backend.
        </p>
      </section>

      <section className="mx-auto max-w-3xl px-6 pb-20 sm:pb-28">
        <h2 className="text-2xl font-bold sm:text-3xl">Our philosophy</h2>
        <div className="mt-10 space-y-10">
          {[
            { t: "Privacy-first by design", d: "Files are hashed locally in your browser using the Web Crypto API. The original content never touches a network request. Only the resulting 32-byte hash may be submitted to the blockchain if you choose to register a proof." },
            { t: "No accounts. No tracking. No analytics.", d: "OpenProof has no user accounts, no profiles, no registration, no analytics scripts, no tracking pixels, and no cookies for advertising. There is no backend to store or process user data. Proof history lives only in your browser's local storage." },
            { t: "Open source and auditable", d: "Every line of code is public under the AGPL-3.0 license. The smart contract, the receipt specification, the frontend, and all documentation are open for anyone to inspect, fork, or self-host. There are no secrets, no proprietary algorithms, and no hidden telemetry." },
            { t: "Minimal and permanent", d: "The smart contract does one thing: register a bytes32 hash with a wallet address and a timestamp. It cannot be upgraded, paused, or deleted. There are no fees, no owners, and no administrative keys. What is written onchain stays onchain." },
          ].map((item) => (
            <div key={item.t}>
              <h3 className="text-lg font-bold sm:text-xl">{item.t}</h3>
              <p className="mt-3 text-sm leading-relaxed text-text-secondary sm:text-base">{item.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 pb-20 sm:pb-28">
        <h2 className="text-2xl font-bold sm:text-3xl">What OpenProof is not</h2>
        <div className="mt-6 space-y-4 text-sm leading-relaxed text-text-secondary sm:text-base">
          <p>OpenProof does not prove authorship, ownership, copyright, legal validity, or the truth of a file&apos;s contents. It proves only that a specific SHA-256 hash was submitted to the registry by a wallet at a recorded timestamp.</p>
          <p>OpenProof is not a file storage service, an NFT marketplace, a token platform, a notarization service, or a legal compliance tool. It does not provide legal, financial, or regulatory advice.</p>
          <p>If the original file is lost, OpenProof cannot recover it. The blockchain stores only the hash. Maintain your own backups.</p>
        </div>
      </section>

      <section className="border-t border-border-default">
        <div className="mx-auto max-w-3xl px-6 py-12 sm:py-16">
          <div className="flex flex-wrap items-baseline gap-x-8 gap-y-3 text-sm text-text-muted">
            <span className="text-xs font-bold tracking-widest uppercase text-text-secondary">Details</span>
            <span>AGPL-3.0</span>
            <span>v0.1.2</span>
            <Link className="transition hover:text-text-primary" href="https://github.com/sparshsam/openproof" rel="noreferrer" target="_blank">GitHub</Link>
            <span>Built by Sparsh Sam</span>
          </div>
        </div>
      </section>
    </main>
  );
}
