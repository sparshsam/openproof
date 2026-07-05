import Link from "next/link";

export const metadata = {
  title: "Terms of Service",
  description:
    "OpenProof terms of service — AGPL-3.0 license, no warranty, user responsibilities, and blockchain permanence.",
};

const sections = [
  {
    id: "acceptance",
    title: "1. Acceptance of Terms",
    content: (
      <p>
        By accessing or using OpenProof (the &ldquo;App&rdquo;), you agree to be
        bound by these Terms of Service. If you do not agree, do not use the App.
        The App is available at{" "}
        <Link
          className="text-accent underline underline-offset-2 hover:brightness-110"
          href="https://proof.kovina.org"
          rel="noreferrer"
          target="_blank"
        >
          proof.kovina.org
        </Link>{" "}
        and its source code is at{" "}
        <Link
          className="text-accent underline underline-offset-2 hover:brightness-110"
          href="https://github.com/sparshsam/openproof"
          rel="noreferrer"
          target="_blank"
        >
          github.com/sparshsam/openproof
        </Link>
        .
      </p>
    ),
  },
  {
    id: "license",
    title: "2. License",
    content: (
      <div className="space-y-4">
        <p>
          The OpenProof source code is licensed under the{" "}
          <Link
            className="text-accent underline underline-offset-2 hover:brightness-110"
            href="https://github.com/sparshsam/openproof/blob/main/LICENSE"
            rel="noreferrer"
            target="_blank"
          >
            GNU Affero General Public License v3.0 only (AGPL-3.0-only)
          </Link>
          . You are free to use, modify, and distribute the software under the
          terms of that license. The receipt schema is additionally available
          under the MIT license.
        </p>
        <p>
          This license applies to the software only. Proof receipts you generate,
          files you hash, and blockchain transactions you submit are your own data
          and are not subject to the software license.
        </p>
      </div>
    ),
  },
  {
    id: "no-legal-advice",
    title: "3. No Legal Advice",
    content: (
      <p>
        OpenProof is a tool for timestamping file fingerprints (SHA-256 hashes)
        on a blockchain. It does not provide legal advice, legal certification, or
        any legally binding timestamp or notarization service. Proofs registered
        on the Base Sepolia testnet have no guarantee of permanence — testnets may
        be reset, paused, or deprecated. Consult a qualified legal professional
        for any evidentiary, regulatory, or compliance matters.
      </p>
    ),
  },
  {
    id: "no-warranty",
    title: "4. No Warranty",
    content: (
      <p>
        OpenProof is provided &ldquo;as is&rdquo; and &ldquo;as available,&rdquo;
        without any warranty of any kind, express or implied. This includes, but
        is not limited to, warranties of merchantability, fitness for a particular
        purpose, non-infringement, title, or availability. The entire risk arising
        out of use or performance of the App remains with you. No oral or written
        information or advice given by the maintainers creates a warranty.
      </p>
    ),
  },
  {
    id: "data-responsibility",
    title: "5. Data Responsibility",
    content: (
      <div className="space-y-4">
        <p>
          <strong className="text-text-primary">Local receipts:</strong> Proof
          receipts are generated locally and offered as downloads. You are solely
          responsible for backing up and securing your receipts. OpenProof does
          not store receipts on any server.
        </p>
        <p>
          <strong className="text-text-primary">Blockchain permanence:</strong>{" "}
          Once a transaction is submitted to the Base Sepolia blockchain, it is
          public and permanent by design. The transaction cannot be reversed,
          deleted, or modified by OpenProof or any party. You should not register
          hashes of content you may later need to keep private, as the onchain
          presence of a hash may reveal that a particular file existed at a
          particular time.
        </p>
        <p>
          <strong className="text-text-primary">Wallet and keys:</strong> You are
          solely responsible for securing your wallet, private keys, and any
          associated seed phrases. OpenProof never has access to your private
          keys. Lost keys or compromised wallets may result in permanent loss of
          access to your proofs.
        </p>
      </div>
    ),
  },
  {
    id: "availability",
    title: "6. Service Availability",
    content: (
      <p>
        OpenProof is a fully static web application hosted on Vercel. There is no
        backend, database, or API server. The App does not guarantee uninterrupted
        availability. The Base Sepolia testnet is a third-party network that may
        experience downtime, resets, or deprecation. OpenProof has no control over
        testnet operations and is not responsible for any resulting loss of access
        to onchain data.
      </p>
    ),
  },
  {
    id: "conduct",
    title: "7. User Conduct",
    content: (
      <div className="space-y-4">
        <p>
          You agree not to use OpenProof for any unlawful purpose or in violation
          of any applicable laws or regulations. You also agree not to:
        </p>
        <ul className="space-y-3">
          {[
            "Submit files you do not have the right to hash.",
            "Use the App to register hashes of illegal content.",
            "Attempt to reverse-engineer, decompile, or bypass any aspect of the App (beyond what the open-source license explicitly permits).",
            "Interfere with or disrupt the App's operation or the Base Sepolia network.",
          ].map((item) => (
            <li className="flex gap-3" key={item}>
              <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-accent" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    ),
  },
  {
    id: "changes",
    title: "8. Changes to Terms",
    content: (
      <p>
        These terms may be updated from time to time. The &ldquo;Last
        updated&rdquo; date at the top of this page will reflect the most recent
        revision. Material changes will be noted in the repository changelog.
        Continued use of OpenProof after changes take effect constitutes
        acceptance of the updated terms.
      </p>
    ),
  },
  {
    id: "contact",
    title: "9. Contact",
    content: (
      <p>
        For questions about these terms, open an issue on{" "}
        <Link
          className="text-accent underline underline-offset-2 hover:brightness-110"
          href="https://github.com/sparshsam/openproof/issues"
          rel="noreferrer"
          target="_blank"
        >
          GitHub
        </Link>{" "}
        or contact{" "}
        <Link
          className="text-accent underline underline-offset-2 hover:brightness-110"
          href="mailto:sparshsam@gmail.com"
        >
          sparshsam@gmail.com
        </Link>
        .
      </p>
    ),
  },
];

export default function TermsPage() {
  return (
    <main>
      <section className="mx-auto max-w-3xl px-6 pt-28 pb-16 sm:pt-40 sm:pb-20">
        <h1 className="text-5xl font-black leading-none tracking-tight sm:text-7xl">
          Terms of Service
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-text-secondary sm:text-xl">
          By using OpenProof, you agree to these terms. Last updated: July 4,
          2026.
        </p>
      </section>

      {sections.map((section, i) => {
        const isLast = i === sections.length - 1;
        return (
          <section
            key={section.id}
            className="border-t border-border-default"
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
