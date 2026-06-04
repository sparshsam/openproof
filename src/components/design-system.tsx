import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ExternalLink } from "lucide-react";
import { HelperTooltip } from "@/components/helper-tooltip";

/* ── Re-exports (backward compat for existing pages) ── */
export { HelperTooltip };

/* ─── Card ────────────────────────────────────────────────
   Large calm surface. 8px radius, hairline border, single
   shadow level. Per VISUAL_RESTRAINTS §1.2, §4.
   ─────────────────────────────────────────────────────── */

export function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`overflow-hidden rounded-lg border border-border-default bg-bg-surface p-5 sm:p-6 ${className}`}
    >
      {children}
    </section>
  );
}

/* ─── Section ─────────────────────────────────────────────
   Consistent page section container.
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
      className={`mx-auto w-full max-w-5xl px-5 py-12 sm:py-16 ${className}`}
      id={id}
    >
      {children}
    </section>
  );
}

/* ─── Button Link ─────────────────────────────────────────
   See VISUAL_RESTRAINTS §5.1. Rounded rectangle (6px),
   no glow, no pill shape, no scale-on-hover.
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
      "bg-accent text-[#0a0a0a] hover:brightness-110",
    secondary:
      "border border-border-default text-text-primary hover:bg-bg-surface-muted",
  };

  return (
    <Link
      className={`inline-flex items-center justify-center rounded-[6px] px-5 py-3 text-sm font-medium transition-colors ${variants[variant]}`}
      href={href}
    >
      {children}
    </Link>
  );
}

/* ─── Action Button ───────────────────────────────────────

   Variants:
   primary   → accent background (functional call-to-action)
   secondary → bordered (alternative action)
   danger    → error-tinted (destructive action)

   Per VISUAL_RESTRAINTS §5.1: no pill shapes, no glow,
   no scale/translate on hover. Subtle color shift only.
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
    primary: "bg-accent text-[#0a0a0a] hover:brightness-110",
    secondary:
      "border border-border-default text-text-primary hover:bg-bg-surface-muted",
    danger:
      "border border-error/30 bg-error/10 text-error hover:bg-error/15",
  };

  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-[6px] px-5 py-3 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]}`}
      disabled={disabled}
      type={type}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

/* ─── Badge ────────────────────────────────────────────────
   Small label for categories or states.
   Single border + text. No decorative styling.
   ─────────────────────────────────────────────────────── */

type BadgeTone = "blue" | "green" | "red" | "dark" | "muted";

const badgeToneMap: Record<BadgeTone, string> = {
  blue: "border-accent/30 bg-accent/10 text-accent",
  green: "border-success/30 bg-success/10 text-success",
  red: "border-error/30 bg-error/10 text-error",
  dark: "border-border-default/40 bg-bg-surface-muted text-text-primary",
  muted: "border-border-default bg-bg-surface-muted text-text-muted",
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
      className={`inline-flex items-center rounded-[4px] border px-2.5 py-0.5 text-xs font-medium ${badgeToneMap[tone] || badgeToneMap.muted}`}
    >
      {children}
    </span>
  );
}

/* ─── Hash Display ────────────────────────────────────────
   Full hex display. Copy button inline. No truncation
   without expand. Per UI_DOCTRINE §3.1, §4.2.
   ─────────────────────────────────────────────────────── */

export function HashDisplay({
  value,
}: {
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <code className="break-all font-mono text-sm leading-relaxed text-text-primary">
        {value}
      </code>
      <button
        className="mt-0.5 shrink-0 rounded-[4px] border border-border-default px-2 py-1 text-xs font-medium text-text-secondary transition-colors hover:bg-bg-surface-muted"
        onClick={() => navigator.clipboard.writeText(value)}
        type="button"
        aria-label="Copy hash"
      >
        Copy
      </button>
    </div>
  );
}

/* ─── Registry Info ───────────────────────────────────────
   Compact infrastructure identity block.
   Per HOMEPAGE_STRUCTURE §8.3.
   ─────────────────────────────────────────────────────── */

export function RegistryInfo({
  address,
  network,
  chainId,
  properties,
}: {
  address: string;
  network: string;
  chainId: string;
  properties: string[];
}) {
  return (
    <div className="rounded-lg border border-border-default bg-bg-surface-muted px-4 py-3 text-sm leading-relaxed text-text-secondary">
      <p>
        <span className="text-text-primary">Registry:</span>{" "}
        <code className="font-mono text-xs">{address}</code>
      </p>
      <p>
        {network} &middot; Chain ID {chainId}
      </p>
      <p>{properties.join(" · ")}</p>
    </div>
  );
}

/* ─── Explorer Link ─────────────────────────────────────
   External link to block explorer.
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
      className="inline-flex items-center gap-1.5 rounded-[6px] bg-accent px-3.5 py-2 text-xs font-medium text-[#0a0a0a] transition-colors hover:brightness-110"
      href={href}
      rel="noreferrer"
      target="_blank"
    >
      {children}
      <ExternalLink className="size-3.5" />
    </a>
  );
}

/* ─── Doc Link ──────────────────────────────────────────
   Text link for documentation navigation.
   Per UI_DOCTRINE §9.2, flat non-hierarchical.
   ─────────────────────────────────────────────────────── */

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

/* ─── Step State Indicator ──────────────────────────────
   Phase-labeled text for state machine progress.
   Per UI_DOCTRINE §2.3.
   ─────────────────────────────────────────────────────── */

export function StepIndicator({
  label,
  state,
}: {
  label: string;
  state: "pending" | "active" | "done" | "error";
}) {
  const stateStyles = {
    pending: "text-text-muted",
    active: "text-accent",
    done: "text-success",
    error: "text-error",
  };

  return (
    <p className={`text-sm font-medium ${stateStyles[state]}`}>{label}</p>
  );
}

/* ─── Phase Timeline ──────────────────────────────────────
   Vertical timeline for multi-step flows (create/verify).
   Per UI_DOCTRINE §2.3, deterministic feedback.
   ─────────────────────────────────────────────────────── */

export function PhaseTimeline({
  phases,
}: {
  phases: { label: string; state: "pending" | "active" | "done" | "error" }[];
}) {
  return (
    <div className="space-y-2">
      {phases.map((phase, i) => (
        <div className="flex items-center gap-3" key={i}>
          <span
            className={`size-2 shrink-0 rounded-full ${
              phase.state === "done"
                ? "bg-success"
                : phase.state === "active"
                  ? "bg-accent"
                  : phase.state === "error"
                    ? "bg-error"
                    : "bg-border-default"
            }`}
          />
          <StepIndicator label={phase.label} state={phase.state} />
        </div>
      ))}
    </div>
  );
}

/* ─── Empty State ─────────────────────────────────────────
   Informative empty state, not whimsical. No illustration.
   Per VISUAL_RESTRAINTS §8.1.
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
      className="rounded-lg border border-dashed border-border-default bg-bg-surface-muted p-6 text-sm leading-6 text-text-secondary"
    >
      <Icon className="mb-3 size-5 text-text-muted" />
      <p className="font-medium text-text-primary">{title}</p>
      <p className="mt-1">{text}</p>
    </div>
  );
}

/* ─── Section Title ───────────────────────────────────────
   Minimal heading for sections. No decorative elements,
   single size. Per UI_DOCTRINE §4.2.
   ─────────────────────────────────────────────────────── */

/* ── Backward-compatible components ──────────────────
   Preserved for existing create/verify/proof pages.
   ─────────────────────────────────────────────────────── */

export function StatusPill({
  children,
  tone = "muted",
}: {
  children: React.ReactNode;
  tone?: "blue" | "green" | "red" | "dark" | "muted";
}) {
  const toneMap: Record<string, string> = {
    blue: "border-accent/30 bg-accent/10 text-accent",
    green: "border-success/30 bg-success/10 text-success",
    red: "border-error/30 bg-error/10 text-error",
    dark: "border-border-default/40 bg-bg-surface-muted text-text-primary",
    muted: "border-border-default bg-bg-surface-muted text-text-muted",
  };
  return (
    <span
      className={`inline-flex items-center rounded-[4px] border px-2.5 py-1 text-xs font-medium ${toneMap[tone] || toneMap.muted}`}
    >
      {children}
    </span>
  );
}

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
      className={`rounded-lg border p-4 transition sm:p-5 ${
        active
          ? "border-accent/30 bg-accent/5"
          : "border-border-default bg-bg-surface"
      }`}
    >
      <div className="flex items-start gap-3 sm:gap-4">
        <span className="grid size-10 shrink-0 place-items-center rounded-md bg-accent text-sm font-bold text-[#0a0a0a]">
          {step}
        </span>
        <div>
          <Icon className="mb-2 size-4 text-accent sm:mb-3 sm:size-5" />
          <h3 className="text-sm font-semibold sm:text-base">{title}</h3>
          <p className="mt-1 text-xs leading-5 text-text-muted sm:mt-2 sm:text-sm sm:leading-6">
            {text}
          </p>
        </div>
      </div>
    </div>
  );
}

export function NetworkNotice({
  title,
  children,
  tone = "muted",
}: {
  title: string;
  children: React.ReactNode;
  tone?: "blue" | "green" | "red" | "dark" | "muted";
}) {
  const toneMap: Record<string, string> = {
    blue: "border-accent/30 bg-accent/10 text-accent",
    green: "border-success/30 bg-success/10 text-success",
    red: "border-error/30 bg-error/10 text-error",
    dark: "border-border-default/40 bg-bg-surface-muted text-text-primary",
    muted: "border-border-default bg-bg-surface-muted text-text-muted",
  };
  return (
    <div className={`rounded-lg border p-5 text-sm ${toneMap[tone] || toneMap.muted}`}>
      <p className="font-medium">{title}</p>
      <p className="mt-1 leading-6 opacity-80">{children}</p>
    </div>
  );
}

export function SectionTitle({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h2
      className={`text-2xl font-semibold leading-tight tracking-tight text-text-primary ${className}`}
    >
      {children}
    </h2>
  );
}
