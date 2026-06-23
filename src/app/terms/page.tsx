import Link from "next/link";

export const metadata = {
  title: "Terms of Service",
  description: "OpenProof terms of service — software provided as-is, user responsibilities, and blockchain permanence.",
};

export default function TermsPage() {
  return (
    <main>
      <section className="mx-auto max-w-3xl px-6 pt-28 pb-16 sm:pt-40 sm:pb-20">
        <h1 className="text-5xl font-black leading-none tracking-tight sm:text-7xl">
          Terms of Service
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-text-secondary sm:text-xl">
          By using OpenProof, you agree to these terms. Last updated: June 22, 2026.
        </p>
      </section>

      <section className="mx-auto max-w-3xl px-6 pb-16 sm:pb-20">
        <div className="space-y-10 text-sm leading-relaxed text-text-secondary sm:text-base">
          <div>
            <h2 className="text-xl font-bold text-text-primary sm:text-2xl">What OpenProof is</h2>
            <p className="mt-4">OpenProof is an open-source (AGPL-3.0), privacy-first proof-of-existence utility. It lets users hash files locally in the browser, register the resulting fingerprint on Base Sepolia, generate local proof receipts, and verify file hashes against the onchain registry.</p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-text-primary sm:text-2xl">Provided as-is</h2>
            <p className="mt-4">OpenProof is provided &quot;as is&quot; and &quot;as available&quot; without any warranty of any kind, express or implied, including but not limited to warranties of merchantability, fitness for a particular purpose, non-infringement, or availability. The Base Sepolia testnet may be reset, paused, or unexpectedly changed. Proofs registered on testnet have no guarantee of permanence.</p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-text-primary sm:text-2xl">Blockchain permanence</h2>
            <p className="mt-4">Once a transaction is submitted to the blockchain, it cannot be undone. Onchain data is public and permanent by design. You should not register hashes of content you may later need to keep private, as the existence of the hash onchain may reveal that a particular file existed at a particular time. OpenProof cannot delete or modify onchain data.</p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-text-primary sm:text-2xl">User responsibility</h2>
            <p className="mt-4">You are solely responsible for the files you hash and register, for securing your wallet and private keys, and for ensuring your use of OpenProof complies with applicable laws. Onchain transactions require gas fees on Base Sepolia. These are paid to the network, not to OpenProof, and are not controlled by the application.</p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-text-primary sm:text-2xl">Limitation of liability</h2>
            <p className="mt-4">To the maximum extent permitted by law, the OpenProof contributors and maintainers shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the app, including but not limited to loss of data, loss of access to proofs, blockchain-related losses, or legal claims based on proof content.</p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-text-primary sm:text-2xl">Open-source license</h2>
            <p className="mt-4">The OpenProof source code is licensed under AGPL-3.0-only. The receipt specification is licensed under MIT. See the LICENSE file in the repository for details.</p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-text-primary sm:text-2xl">Contact</h2>
            <p className="mt-4">
              For questions, open an issue on{" "}
              <Link className="text-accent underline underline-offset-2 hover:brightness-110" href="https://github.com/sparshsam/openproof/issues" rel="noreferrer" target="_blank">GitHub</Link>.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
