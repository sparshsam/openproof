import Link from "next/link";
import { ExternalLink } from "lucide-react";

/* ─── Section — vertical rhythm container ──────────── */

export function Section({
  children, className = "", id,
}: {
  children: React.ReactNode; className?: string; id?: string;
}) {
  return (
    <section className={`mx-auto w-full max-w-5xl px-6 py-20 sm:py-28 ${className}`} id={id}>
      {children}
    </section>
  );
}

/* ─── Pill Link ──────────────────────────────────── */

export function PillLink({
  href, children, variant = "primary", className = "",
}: {
  href: string; children: React.ReactNode; variant?: "primary" | "secondary"; className?: string;
}) {
  const s = variant === "primary"
    ? "bg-accent text-white hover:bg-[#0099ee]"
    : "bg-bg-surface-muted text-text-primary hover:bg-[#252525]";
  return (
    <Link className={`inline-flex items-center justify-center rounded-full px-7 py-3.5 text-sm font-semibold transition-all ${s} ${className}`} href={href}>
      {children}
    </Link>
  );
}

/* ─── Action Pill ────────────────────────────────── */

export function ActionPill({
  children, disabled, onClick, variant = "primary", type = "button", className = "",
}: {
  children: React.ReactNode; disabled?: boolean; onClick?: () => void; variant?: "primary" | "secondary" | "danger"; type?: "button" | "submit"; className?: string;
}) {
  const base = `inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold transition-all disabled:cursor-not-allowed ${className}`;
  const v = {
    primary: `${base} bg-accent text-white hover:bg-[#0099ee] disabled:opacity-40`,
    secondary: `${base} bg-bg-surface-muted text-text-primary hover:bg-[#252525] disabled:opacity-40`,
    danger: `${base} bg-error/10 text-error border border-error/20 hover:bg-error/20 disabled:opacity-40`,
  };
  return <button className={v[variant]} disabled={disabled} type={type} onClick={onClick}>{children}</button>;
}

/* ─── Explorer Link ──────────────────────────────── */

export function ExplorerLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-[#0099ee]" href={href} rel="noreferrer" target="_blank">
      {children} <ExternalLink className="size-3.5" />
    </a>
  );
}

/* ─── Label — inline minimal tag ───────────────── */

export function Label({ children, color = "muted" }: { children: React.ReactNode; color?: "accent" | "muted" | "error" }) {
  const c = { accent: "text-accent", muted: "text-text-muted", error: "text-error" };
  return <span className={`text-xs font-bold tracking-wider uppercase ${c[color]}`}>{children}</span>;
}

/* ─── Backward compat aliases (for existing imports) ─ */

export { PillLink as ButtonLink, PillLink as PillButton };
export function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={className}>{children}</div>;
}
export function Badge({ children, tone }: { children: React.ReactNode; tone?: string }) {
  return <Label color={tone === "blue" || tone === "green" ? "accent" : tone === "red" ? "error" : "muted"}>{children}</Label>;
}
export function StatusPill({ children }: { children: React.ReactNode }) {
  return <span className="text-xs font-bold tracking-wider uppercase text-text-muted">{children}</span>;
}
export function Surface({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={className}>{children}</div>;
}
export function EmptyState({ title, text }: { title: string; text: string }) {
  return <div className="py-12 text-center"><p className="text-xl font-bold">{title}</p><p className="mt-2 text-sm text-text-secondary">{text}</p></div>;
}
export function NetworkNotice({ children }: { children: React.ReactNode }) {
  return <div className="text-sm text-text-secondary">{children}</div>;
}
export function StepCard() { return null; }
export function TicketPanel({ children }: { children?: React.ReactNode }) {
  return <div>{children}</div>;
}
export { ProofTimeline } from "@/components/proof-timeline";
export { HashDisplay } from "@/components/hash-display";
