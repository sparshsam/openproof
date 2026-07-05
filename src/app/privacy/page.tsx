import Link from "next/link";

export const metadata = {
  title: "Privacy Policy",
  description:
    "OpenProof privacy policy — local-first design, no data collection, and how your information is handled on Base Sepolia.",
};

const sections = [
  {
    id: "commitment",
    title: "1. Our Commitment to Privacy",
    content: (
      <p>
        OpenProof is built around a core principle: your files never leave your
        device. The app is designed so that file hashing, receipt generation, and
        proof history all happen locally in your browser. No file content is ever
        uploaded, transmitted, or stored on any server. You are in control.
      </p>
    ),
  },
  {
    id: "local-first",
    title: "2. Local-First Data Model",
    content: (
      <div className="space-y-4">
        <p>
          OpenProof processes everything on your device through the browser File
          API and Web Crypto API. Here is what happens with each action:
        </p>
        <ul className="space-y-3">
          {[
            {
              label: "File hashing",
              desc: "When you select a file, OpenProof reads it into browser memory, computes a SHA-256 hash, and discards the file contents. The hash computation is done entirely client-side.",
            },
            {
              label: "Proof receipts",
              desc: "After registering a proof, OpenProof generates a JSON receipt locally and offers it as a download. Receipts are never stored on any server.",
            },
            {
              label: "Proof history",
              desc: "Recent proof activity is saved only in your browser's localStorage. You can clear this at any time through your browser settings or by using the &ldquo;Clear history&rdquo; button in the app.",
            },
          ].map(({ label, desc }) => (
            <li className="flex gap-3" key={label}>
              <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-accent" />
              <span>
                <strong className="text-text-primary">{label}:</strong> {desc}
              </span>
            </li>
          ))}
        </ul>
      </div>
    ),
  },
  {
    id: "no-cloud",
    title: "3. No Cloud, Sync, or Backup",
    content: (
      <p>
        OpenProof has no accounts, no backend, and no cloud infrastructure of its
        own. There is no sync across devices, no server-side storage, and no
        backup service. Blockchain registration is user-initiated through a
        connected wallet — it is a deliberate action, not an automatic sync.
      </p>
    ),
  },
  {
    id: "what-we-collect",
    title: "4. What We Collect",
    content: (
      <div className="space-y-4">
        <p>
          OpenProof collects nothing. The app has no analytics, no telemetry, no
          tracking scripts, no cookies, and no server-side logging. There is
          nothing to opt out of because there is nothing to opt into.
        </p>
        <p>
          The only data that leaves your device is a 32-byte SHA-256 hash that
          you deliberately submit to the OpenProofRegistry smart contract on Base
          Sepolia. The hash is a cryptographic fingerprint — it cannot be reversed
          to recover the original file. The transaction is public on the
          blockchain, which means the hash, the submitting wallet address, and the
          timestamp are visible to anyone.
        </p>
        <p>
          When you connect a wallet through RainbowKit, the app can read your
          wallet address and chain ID. Your wallet provider (RainbowKit,
          WalletConnect, or your browser extension) manages your private keys.
          OpenProof never has access to your private keys, seed phrase, or any
          other wallet credentials.
        </p>
      </div>
    ),
  },
  {
    id: "third-party",
    title: "5. Third-Party Services",
    content: (
      <div className="space-y-4">
        <p>OpenProof relies on the following third-party services:</p>
        <ul className="space-y-3">
          {[
            {
              service: "Vercel",
              desc: "The app is hosted on Vercel as a fully static site. Vercel may collect standard server logs (IP address, request metadata) for operational purposes. See Vercel's privacy policy for details.",
            },
            {
              service: "Base Sepolia blockchain",
              desc: "Proof registration transactions are submitted to the Base Sepolia testnet, a public blockchain. Transaction data is permanently public. Base is operated by the Base team (Coinbase).",
            },
            {
              service: "RainbowKit & WalletConnect",
              desc: "Wallet connection is handled by RainbowKit and WalletConnect. These providers manage wallet discovery and connection flows. They may collect connection metadata as described in their respective privacy policies.",
            },
          ].map(({ service, desc }) => (
            <li className="flex gap-3" key={service}>
              <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-accent" />
              <span>
                <strong className="text-text-primary">{service}:</strong> {desc}
              </span>
            </li>
          ))}
        </ul>
      </div>
    ),
  },
  {
    id: "deletion",
    title: "6. Data Deletion",
    content: (
      <div className="space-y-4">
        <p>
          <strong className="text-text-primary">Local data:</strong> Proof
          history stored in your browser&rsquo;s localStorage can be cleared at any time
          through the app&rsquo;s &ldquo;Clear history&rdquo; option or your browser&rsquo;s
          storage settings.
        </p>
        <p>
          <strong className="text-text-primary">Onchain data:</strong> Blockchain
          data is permanent by design. Once a transaction is accepted into a
          block, it cannot be deleted, modified, or undone. This is an intentional
          property of the proof-of-existence system — it ensures that a proof
          registered today remains verifiable indefinitely. If you do not want
          data onchain, do not register a proof.
        </p>
      </div>
    ),
  },
  {
    id: "export",
    title: "7. Data Export",
    content: (
      <p>
        The only data OpenProof generates is your proof receipts. These are
        automatically offered as downloads when you register a proof and can also
        be exported from your proof history page at any time. Receipts are
        standard JSON files that you can save, back up, or transfer freely.
        OpenProof does not hold any of your data for export — it all stays with
        you.
      </p>
    ),
  },
  {
    id: "changes",
    title: "8. Changes to This Policy",
    content: (
      <p>
        If this policy changes, the &ldquo;Last updated&rdquo; date at the top of
        this page will be revised. Material changes will also be noted in the
        repository changelog. Continued use of OpenProof after changes constitutes
        acceptance of the updated policy.
      </p>
    ),
  },
  {
    id: "contact",
    title: "9. Contact",
    content: (
      <p>
        For privacy questions, open an issue on{" "}
        <Link
          className="text-accent underline underline-offset-2 hover:brightness-110"
          href="https://github.com/sparshsam/openproof/issues"
          rel="noreferrer"
          target="_blank"
        >
          GitHub
        </Link>
        . For security concerns, see the project&apos;s security policy.
      </p>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <main>
      <section className="mx-auto max-w-3xl px-6 pt-28 pb-16 sm:pt-40 sm:pb-20">
        <h1 className="text-5xl font-black leading-none tracking-tight sm:text-7xl">
          Privacy Policy
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-text-secondary sm:text-xl">
          OpenProof is designed so your files never leave your device. This policy
          explains how your information is handled. Last updated: July 4, 2026.
        </p>
      </section>

      {sections.map((section, i) => {
        const isLast = i === sections.length - 1;
        return (
          <section
            key={section.id}
            className={
              isLast
                ? "border-t border-border-default"
                : "border-t border-border-default"
            }
          >
            <div
              className={
                isLast
                  ? "mx-auto max-w-3xl px-6 py-16 sm:py-20"
                  : "mx-auto max-w-3xl px-6 py-16 sm:py-20"
              }
            >
              <h2 className="text-xl font-bold text-text-primary sm:text-2xl">
                {section.title}
              </h2>
              <div className="mt-6 text-sm leading-relaxed text-text-secondary sm:text-base">
                {section.content}
              </div>
            </div>
          </section>
        );
      })}
    </main>
  );
}
