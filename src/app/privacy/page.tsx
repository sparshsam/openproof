import Link from "next/link";

export const metadata = {
  title: "Privacy Policy",
  description: "OpenProof privacy policy — how your data is handled, what is collected, and what is not.",
};

export default function PrivacyPage() {
  return (
    <main>
      <section className="mx-auto max-w-3xl px-6 pt-28 pb-16 sm:pt-40 sm:pb-20">
        <h1 className="text-5xl font-black leading-none tracking-tight sm:text-7xl">
          Privacy
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-text-secondary sm:text-xl">
          OpenProof is designed so that your files never leave your device. This
          policy describes what happens with your information. Last updated:
          June 22, 2026.
        </p>
      </section>

      <section className="mx-auto max-w-3xl px-6 pb-16 sm:pb-20">
        <h2 className="text-xl font-bold sm:text-2xl">What OpenProof does not do</h2>
        <ul className="mt-6 space-y-4 text-sm leading-relaxed text-text-secondary sm:text-base">
          {[
            "No file uploads. Files selected in the app are read through the browser File API, hashed locally with SHA-256 using the Web Crypto API, and are never sent to any server.",
            "No backend. The app is a fully static web application. There is no server-side database, storage bucket, or API endpoint that receives user data.",
            "No accounts. OpenProof has no user registration, profiles, or login system. Wallet connection is optional and user-initiated.",
            "No analytics or tracking. The app contains no analytics scripts, tracking pixels, fingerprinting, advertising cookies, or any other data collection mechanisms.",
            "No email collection. The app does not ask for or store email addresses.",
            "No persistent storage of files. Proof receipts are generated locally and offered as a download. Recent proof history is saved only in your browser's local storage and can be cleared at any time.",
          ].map((item) => (
            <li className="flex gap-3" key={item}>
              <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-accent" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="border-t border-border-default">
        <div className="mx-auto max-w-3xl px-6 py-16 sm:py-20">
          <h2 className="text-xl font-bold sm:text-2xl">What OpenProof does</h2>
          <div className="mt-8 space-y-8 text-sm leading-relaxed text-text-secondary sm:text-base">
            <div>
              <h3 className="font-bold text-text-primary">File hashing</h3>
              <p className="mt-2">When you select a file to create or verify a proof, OpenProof reads the file contents into browser memory and computes a SHA-256 hash. The hash computation happens entirely on your device. The file contents exist in memory only for the duration of the hashing operation and are not stored, transmitted, or logged.</p>
            </div>
            <div>
              <h3 className="font-bold text-text-primary">Onchain registration</h3>
              <p className="mt-2">If you choose to register a proof, a 32-byte SHA-256 hash of your file is submitted to the OpenProofRegistry smart contract on Base Sepolia through your connected wallet. This transaction is public on the blockchain. Anyone can see the hash, the wallet address, and the timestamp.</p>
            </div>
            <div>
              <h3 className="font-bold text-text-primary">Proof receipts</h3>
              <p className="mt-2">When a proof is registered, OpenProof generates a local JSON receipt that may include the file name, MIME type, hash, wallet address, transaction hash, explorer URL, timestamp, and chain information. Receipts are generated locally and offered as a download. OpenProof never stores or transmits your receipts.</p>
            </div>
            <div>
              <h3 className="font-bold text-text-primary">Wallet connection</h3>
              <p className="mt-2">Wallet connections are handled by RainbowKit and WalletConnect. OpenProof reads your wallet address and chain ID. The wallet provider manages your private keys and signing. OpenProof never has access to your private keys or seed phrase.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-border-default">
        <div className="mx-auto max-w-3xl px-6 py-16 sm:py-20">
          <h2 className="text-xl font-bold sm:text-2xl">Data sharing</h2>
          <p className="mt-6 text-sm leading-relaxed text-text-secondary sm:text-base">OpenProof does not sell, rent, share, or transfer your personal information to third parties. Onchain registration data is public by nature of the blockchain — this is an intentional property of the proof-of-existence system, not a data-sharing practice.</p>

          <h2 className="mt-12 text-xl font-bold sm:text-2xl">Contact</h2>
          <p className="mt-6 text-sm leading-relaxed text-text-secondary sm:text-base">
            For privacy questions, open an issue on{" "}
            <Link className="text-accent underline underline-offset-2 hover:brightness-110" href="https://github.com/sparshsam/openproof/issues" rel="noreferrer" target="_blank">GitHub</Link>.
            For security concerns, see the project&apos;s security policy.
          </p>
        </div>
      </section>
    </main>
  );
}
