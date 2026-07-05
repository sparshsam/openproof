"use client";

import Link from "next/link";
import { ExternalLink, ShieldCheck, BookOpen, FileText, Lock, Scale } from "lucide-react";

export default function AppMorePage() {
  const links = [
    {
      href: "/about",
      icon: BookOpen,
      label: "About OpenProof",
      desc: "Mission, philosophy, and how it works",
    },
    {
      href: "/docs",
      icon: FileText,
      label: "Documentation",
      desc: "Guides, architecture, and API references",
    },
    {
      href: "/privacy",
      icon: Lock,
      label: "Privacy Policy",
      desc: "How your data is handled",
    },
    {
      href: "/terms",
      icon: Scale,
      label: "Terms of Service",
      desc: "Rules and legal stuff",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Section header */}
      <div>
        <h1 className="text-2xl font-black tracking-tight text-text-primary">
          More
        </h1>
        <p className="mt-1.5 text-sm text-text-secondary">
          Information and resources about OpenProof.
        </p>
      </div>

      {/* Links */}
      <div className="space-y-3">
        {links.map(({ href, icon: Icon, label, desc }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-4 p-2 -mx-2 rounded-xl transition hover:bg-accent/5"
          >
            <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-accent/10">
              <Icon className="size-6 text-accent" />
            </div>
            <div>
              <p className="font-semibold text-text-primary">{label}</p>
              {desc ? (
                <p className="mt-0.5 text-sm text-text-secondary">{desc}</p>
              ) : null}
            </div>
          </Link>
        ))}
      </div>

      {/* GitHub */}
      <a
        href="https://github.com/sparshsam/openproof"
        target="_blank"
        rel="noreferrer"
        className="flex items-center gap-4 p-2 -mx-2 rounded-xl transition hover:bg-accent/5"
      >
        <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-accent/10">
          <ExternalLink className="size-6 text-accent" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-text-primary">GitHub</p>
          <p className="mt-0.5 text-sm text-text-secondary">
            Source code, issues, and contribution guide
          </p>
        </div>
        <ExternalLink className="size-4 text-text-muted shrink-0" />
      </a>

      {/* Testnet notice */}
      <div className="rounded-2xl border border-border-default bg-bg-surface p-4">
        <div className="flex items-start gap-3">
          <ShieldCheck className="mt-0.5 size-5 shrink-0 text-text-muted" />
          <div>
            <p className="text-sm font-semibold text-text-primary">
              Base Sepolia testnet
            </p>
            <p className="mt-1 text-xs leading-relaxed text-text-secondary">
              OpenProof runs on Base Sepolia — a test network.
              All proofs are for experimental and verification purposes only.
            </p>
          </div>
        </div>
      </div>

      <p className="text-center text-xs text-text-muted">
        OpenProof v0.9.6 &middot; AGPL-3.0
      </p>

      {/* Kovina wordmark — visible on all devices */}
      <div className="pt-4 text-center">
        <a className="inline-block" href="https://kovina.org" rel="noreferrer" target="_blank" aria-label="Kovina">
          <style>{`
            [data-theme="dark"] .more-kovina-light { opacity: 0 !important; }
            [data-theme="dark"] .more-kovina-dark { opacity: 1 !important; }
          `}</style>
          <span className="relative inline-block h-[18px] w-[140px] sm:w-[180px] align-middle">
            <img alt="" className="more-kovina-light absolute inset-0 h-[18px] w-[140px] sm:w-[180px] transition-opacity duration-300" src="/kovina-wordmark.svg" />
            <img alt="" className="more-kovina-dark absolute inset-0 h-[18px] w-[140px] sm:w-[180px] transition-opacity duration-300 opacity-0" src="/kovina-wordmark-white.svg" />
          </span>
        </a>
      </div>

      {/* Footer spacer for bottom nav on mobile */}
      <div className="h-20 md:hidden" />
    </div>
  );
}
