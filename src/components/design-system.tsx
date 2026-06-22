import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ExternalLink } from "lucide-react";
import { HelperTooltip } from "@/components/helper-tooltip";

export { HelperTooltip };

/* ─── Section ─────────────────────────────────────────────
   Bold vertical rhythm. Max-width + generous padding.
   ─────────────────────────────────────────────────────── */

export function Section({
  children,
  className = "",
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section
      className={`mx-auto w-full max-w-5xl px-6 py-20 sm:py-28 ${className}`}
      id={id}
    >
      {children}
    </section>
  );
}

/* ─── Hero Slab ─────────────────────────────────────────
   Large rounded black/blue hero panel for page headers.
   ─────────────────────────────────────────────────────── */

export function HeroSlab({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-3xl bg-bg-surface p-8 sm:p-12 lg:p-16 ${className}`}>
      {children}
    </div>
  );
}

/* ─── Surface — borderless content block ───────────────
   No border, no card feel. Just spacing and bg.
   ─────────────────────────────────────────────────────── */

export function Surface({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-2xl bg-bg-surface p-6 sm:p-8 ${className}`}>
      {children}
    </div>
  );
}

/* ─── Pill Button (Link) ──────────────────────────────
   Fully rounded. Large. Block-style.
   ─────────────────────────────────────────────────────── */

export function PillButton({
  href,
  children,
  variant = "primary",
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  className?: string;
}) {
  const base = "inline-flex items-center justify-center rounded-full px-7 py-3.5 text-sm font-semibold transition-all";
  const styles = {
    primary: `${base} bg-accent text-white hover:bg-[#0099ee] ${className}`,
    secondary: `${base} bg-bg-surface-muted text-text-primary hover:bg-[#252525] ${className}`,
  };
  return (
    <Link className={styles[variant]} href={href}>
      {children}
    </Link>
  );
}

/* ─── Action Pill (Button) ────────────────────────────
   Fully rounded. Block-style.
   ─────────────────────────────────────────────────────── */

export function ActionPill({
  children,
  disabled,
  onClick,
  variant = "primary",
  type = "button",
  className = "",
}: {
  children: React.ReactNode;
  disabled?: boolean;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "danger";
  type?: "button" | "submit";
  className?: string;
}) {
  const base = `inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold transition-all disabled:cursor-not-allowed ${className}`;
  const variants = {
    primary: `${base} bg-accent text-white hover:bg-[#0099ee] disabled:opacity-40`,
    secondary: `${base} bg-bg-surface-muted text-text-primary hover:bg-[#252525] disabled:opacity-40`,
    danger: `${base} bg-error/10 text-error border border-error/20 hover:bg-error/20 disabled:opacity-40`,
  };

  return (
    <button
      className={variants[variant]}
      disabled={disabled}
      type={type}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

/* ─── Badge — minimal label. Just text + subtle bg. ─── */

type BadgeTone = "blue" | "green" | "red" | "dark" | "muted";

const badgeToneMap: Record<BadgeTone, string> = {
  blue: "text-accent bg-accent/10",
  green: "text-success bg-success/10",
  red: "text-error bg-error/10",
  dark: "text-text-primary bg-bg-surface-muted",
  muted: "text-text-muted bg-bg-surface-muted",
};

export function Badge({
  children,
  tone = "muted",
}: {
  children: React.ReactNode;
  tone?: BadgeTone;
}) {
  return (
    <span className={`inline-flex items-center rounded-full px-3.5 py-1 text-xs font-semibold tracking-wide uppercase ${badgeToneMap[tone] || badgeToneMap.muted}`}>
      {children}
    </span>
  );
}

/* ─── StatusPill ──────────────────────────────────────── */

export function StatusPill({
  children,
  tone = "muted",
}: {
  children: React.ReactNode;
  tone?: BadgeTone;
}) {
  const m: Record<string, string> = {
    blue: "bg-accent/10 text-accent",
    green: "bg-success/10 text-success",
    red: "bg-error/10 text-error",
    dark: "bg-bg-surface-muted text-text-primary",
    muted: "bg-bg-surface-muted text-text-muted",
  };
  return (
    <span className={`inline-flex items-center rounded-full px-3.5 py-1.5 text-xs font-semibold tracking-wide uppercase ${m[tone] || m.muted}`}>
      {children}
    </span>
  );
}

/* ─── StepCard — clean step indicator ───────────────── */

export function StepCard({
  step,
  title,
  text,
  icon: Icon,
  active,
}: {
  step: number;
  title: string;
  text: string;
  icon: LucideIcon;
  active?: boolean;
}) {
  return (
    <div className={`rounded-2xl border transition ${active ? "border-accent/30 bg-accent/5" : "border-border-default bg-bg-surface"} p-6 sm:p-7`}>
      <div className="flex items-start gap-4">
        <span className={`grid size-11 shrink-0 place-items-center rounded-full text-base font-bold ${active ? "bg-accent text-white" : "bg-bg-surface-muted text-text-muted"}`}>
          {step}
        </span>
        <div className="min-w-0">
          <Icon className={`mb-2 size-4 ${active ? "text-accent" : "text-text-muted"}`} />
          <h3 className="text-base font-semibold leading-tight">{title}</h3>
          <p className="mt-1.5 text-sm leading-6 text-text-secondary">{text}</p>
        </div>
      </div>
    </div>
  );
}

/* ─── Empty State — confident, centered ────────────── */

export function EmptyState({
  icon: Icon,
  title,
  text,
}: {
  icon: LucideIcon;
  title: string;
  text: string;
}) {
  return (
    <div aria-live="polite" className="rounded-2xl bg-bg-surface-muted p-12 text-center">
      <Icon className="mx-auto mb-5 size-8 text-text-muted" />
      <p className="text-xl font-bold text-text-primary">{title}</p>
      <p className="mt-3 text-sm leading-6 text-text-secondary max-w-md mx-auto">{text}</p>
    </div>
  );
}

/* ─── Explorer Link ────────────────────────────────── */

export function ExplorerLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-[#0099ee]"
      href={href}
      rel="noreferrer"
      target="_blank"
    >
      {children}
      <ExternalLink className="size-3.5" />
    </a>
  );
}

/* ─── NetworkNotice ────────────────────────────────── */

export function NetworkNotice({
  title,
  children,
  tone = "muted",
}: {
  title: string;
  children: React.ReactNode;
  tone?: BadgeTone;
}) {
  const m: Record<string, string> = {
    blue: "bg-accent/5 text-accent",
    green: "bg-success/5 text-success",
    red: "bg-error/5 text-error",
    dark: "bg-bg-surface-muted text-text-primary",
    muted: "bg-bg-surface-muted text-text-secondary",
  };
  return (
    <div className={`rounded-2xl p-6 text-sm ${m[tone] || m.muted}`}>
      <p className="font-semibold">{title}</p>
      <p className="mt-1.5 leading-6 opacity-80">{children}</p>
    </div>
  );
}

/* ─── Ticket / Receipt Panel ─────────────────────────
   Premium receipt display. Single column, strongly
   structured. Use for proof registration result.
   ─────────────────────────────────────────────────────── */

export function TicketPanel({
  children,
  variant = "default",
}: {
  children: React.ReactNode;
  variant?: "default" | "success";
}) {
  const bg = variant === "success" ? "bg-accent/5 border border-accent/20" : "bg-bg-surface-muted";
  return (
    <div className={`rounded-2xl p-6 sm:p-8 ${bg}`}>
      {children}
    </div>
  );
}

/* ─── Activity Row — clean history item ──────────── */

export function ActivityRow({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex items-start justify-between gap-4 rounded-2xl bg-bg-surface-muted p-5 transition hover:bg-[#222] ${className}`}>
      {children}
    </div>
  );
}

/* ─── Legacy compatibility aliases ───────────────── */

import { HashDisplay as HD } from "@/components/hash-display";
import { ProofTimeline as PT } from "@/components/proof-timeline";

export { HD as HashDisplay, PT as ProofTimeline };

/* ─── Backward compat exports ──────────────────────
   So existing imports don't break.
   ─────────────────────────────────────────────────────── */

export function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <section className={`rounded-2xl bg-bg-surface p-6 sm:p-8 ${className}`}>{children}</section>;
}

export function ActionButton({ children, disabled, onClick, variant = "primary", type = "button" }: {
  children: React.ReactNode; disabled?: boolean; onClick?: () => void; variant?: "primary" | "secondary" | "danger"; type?: "button" | "submit";
}) {
  return <ActionPill {...{ children, disabled, onClick, variant, type }} />;
}

export function ButtonLink({ href, children, variant = "primary" }: {
  href: string; children: React.ReactNode; variant?: "primary" | "secondary";
}) {
  return <PillButton {...{ href, children, variant }} />;
}

export function DocLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link className="text-sm font-medium text-text-secondary transition-colors hover:text-text-primary" href={href}>
      {children}
    </Link>
  );
}
