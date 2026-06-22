import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ExternalLink } from "lucide-react";
import { HelperTooltip } from "@/components/helper-tooltip";

/* ── Re-exports ──────────────────────────────────────── */
export { HelperTooltip };

/* ─── Card ────────────────────────────────────────────────
   Clean minimal surface, no border by default. Just spacing.
   Cash App / Block inspired: spacious, borderless.
   ─────────────────────────────────────────────────────── */

export function Card({
  children,
  className = "",
  borderless = false,
}: {
  children: React.ReactNode;
  className?: string;
  borderless?: boolean;
}) {
  return (
    <section
      className={`${borderless ? "" : "rounded-xl border border-border-default bg-bg-surface"} p-6 sm:p-8 ${className}`}
    >
      {children}
    </section>
  );
}

/* ─── Section ─────────────────────────────────────────────
   Consistent page section with max-width & generous padding.
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
      className={`mx-auto w-full max-w-5xl px-6 py-16 sm:py-24 ${className}`}
      id={id}
    >
      {children}
    </section>
  );
}

/* ─── Button Link ─────────────────────────────────────────
   Bold, minimal buttons. No pills, no glow.
   ─────────────────────────────────────────────────────── */

export function ButtonLink({
  href,
  children,
  variant = "primary",
}: {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
}) {
  const variants = {
    primary:
      "bg-accent text-white hover:bg-[#0099ee]",
    secondary:
      "bg-bg-surface-muted text-text-primary hover:bg-[#252525]",
  };

  return (
    <Link
      className={`inline-flex items-center justify-center rounded-[10px] px-6 py-3.5 text-sm font-semibold transition-all ${variants[variant]}`}
      href={href}
    >
      {children}
    </Link>
  );
}

/* ─── Action Button ───────────────────────────────────────
   Bold CTA. No pill shapes, no glow, no scale.
   ─────────────────────────────────────────────────────── */

export function ActionButton({
  children,
  disabled,
  onClick,
  variant = "primary",
  type = "button",
}: {
  children: React.ReactNode;
  disabled?: boolean;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "danger";
  type?: "button" | "submit";
}) {
  const variants = {
    primary: "bg-accent text-white hover:bg-[#0099ee]",
    secondary:
      "bg-bg-surface-muted text-text-primary hover:bg-[#252525]",
    danger:
      "bg-error/10 text-error border border-error/20 hover:bg-error/20",
  };

  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-[10px] px-6 py-3.5 text-sm font-semibold transition-all disabled:cursor-not-allowed disabled:opacity-40 ${variants[variant]}`}
      disabled={disabled}
      type={type}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

/* ─── Badge ────────────────────────────────────────────────
   Minimal label. Border-only, no fill for clean look.
   ─────────────────────────────────────────────────────── */

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
    <span
      className={`inline-flex items-center rounded-[6px] px-3 py-1 text-xs font-semibold tracking-wide uppercase ${badgeToneMap[tone] || badgeToneMap.muted}`}
    >
      {children}
    </span>
  );
}

/* ─── Empty State ─────────────────────────────────────────
   Bold empty state. No dashed borders.
   ─────────────────────────────────────────────────────── */

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
    <div
      aria-live="polite"
      className="rounded-xl bg-bg-surface-muted p-8 text-center"
    >
      <Icon className="mx-auto mb-4 size-6 text-text-muted" />
      <p className="text-lg font-semibold text-text-primary">{title}</p>
      <p className="mt-2 text-sm leading-6 text-text-secondary max-w-md mx-auto">
        {text}
      </p>
    </div>
  );
}

/* ─── Explorer Link ─────────────────────────────────────
   External link styled as a button.
   ─────────────────────────────────────────────────────── */

export function ExplorerLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      className="inline-flex items-center gap-1.5 rounded-[10px] bg-accent px-4 py-3 text-sm font-semibold text-white transition-all hover:bg-[#0099ee]"
      href={href}
      rel="noreferrer"
      target="_blank"
    >
      {children}
      <ExternalLink className="size-3.5" />
    </a>
  );
}

/* ─── StatusPill ─────────────────────────────────────── */

export function StatusPill({
  children,
  tone = "muted",
}: {
  children: React.ReactNode;
  tone?: BadgeTone;
}) {
  const toneMap: Record<string, string> = {
    blue: "bg-accent/10 text-accent border border-accent/20",
    green: "bg-success/10 text-success border border-success/20",
    red: "bg-error/10 text-error border border-error/20",
    dark: "bg-bg-surface-muted text-text-primary border border-border-default",
    muted: "bg-bg-surface-muted text-text-muted border border-border-default",
  };
  return (
    <span
      className={`inline-flex items-center rounded-[8px] px-3 py-1.5 text-xs font-semibold tracking-wide uppercase ${toneMap[tone] || toneMap.muted}`}
    >
      {children}
    </span>
  );
}

/* ─── StepCard ────────────────────────────────────────── */

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
    <div
      className={`rounded-xl border p-5 sm:p-6 transition ${
        active
          ? "border-accent/30 bg-accent/5"
          : "border-border-default bg-bg-surface"
      }`}
    >
      <div className="flex items-start gap-4">
        <span
          className={`grid size-11 shrink-0 place-items-center rounded-[10px] text-base font-bold ${
            active
              ? "bg-accent text-white"
              : "bg-bg-surface-muted text-text-muted"
          }`}
        >
          {step}
        </span>
        <div className="min-w-0">
          <Icon className={`mb-2 size-4 ${active ? "text-accent" : "text-text-muted"}`} />
          <h3 className="text-base font-semibold leading-tight">{title}</h3>
          <p className="mt-1.5 text-sm leading-6 text-text-secondary">
            {text}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ─── NetworkNotice ───────────────────────────────────── */

export function NetworkNotice({
  title,
  children,
  tone = "muted",
}: {
  title: string;
  children: React.ReactNode;
  tone?: BadgeTone;
}) {
  const toneMap: Record<string, string> = {
    blue: "bg-accent/5 border border-accent/20 text-accent",
    green: "bg-success/5 border border-success/20 text-success",
    red: "bg-error/5 border border-error/20 text-error",
    dark: "bg-bg-surface-muted border border-border-default text-text-primary",
    muted: "bg-bg-surface-muted border border-border-default text-text-secondary",
  };
  return (
    <div className={`rounded-xl p-6 text-sm ${toneMap[tone] || toneMap.muted}`}>
      <p className="font-semibold">{title}</p>
      <p className="mt-1.5 leading-6 opacity-80">{children}</p>
    </div>
  );
}

/* ─── DocLink ────────────────────────────────────────── */

export function DocLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      className="text-sm font-medium text-text-secondary transition-colors hover:text-text-primary"
      href={href}
    >
      {children}
    </Link>
  );
}
