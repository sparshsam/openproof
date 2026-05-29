import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ExternalLink, Info } from "lucide-react";

type Tone = "blue" | "green" | "red" | "dark" | "muted";

const toneClass: Record<Tone, string> = {
  blue: "border-base-blue/30 bg-base-blue/10 text-base-blue dark:text-blue-200",
  green: "border-success/30 bg-success/10 text-success",
  red: "border-danger/30 bg-danger/10 text-danger",
  dark: "border-white/15 bg-white/10 text-white",
  muted: "border-border bg-surface-muted text-muted",
};

export function Badge({
  children,
  tone = "blue",
}: {
  children: React.ReactNode;
  tone?: Tone;
}) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${toneClass[tone]}`}
    >
      {children}
    </span>
  );
}

export function HelperTooltip({
  label,
  text,
}: {
  label: string;
  text: string;
}) {
  return (
    <span className="group relative inline-flex items-center gap-1.5 align-middle">
      <span className="text-xs font-semibold text-muted">{label}</span>
      <span
        aria-label={`${label}: ${text}`}
        className="grid size-5 place-items-center rounded-full border border-border bg-surface text-muted transition group-hover:border-base-blue group-hover:text-base-blue group-focus-within:border-base-blue group-focus-within:text-base-blue"
        tabIndex={0}
      >
        <Info className="size-3.5" />
      </span>
      <span className="pointer-events-none absolute bottom-full left-0 z-20 mb-2 hidden w-64 rounded-2xl border border-border bg-surface p-3 text-xs leading-5 text-foreground shadow-xl group-hover:block group-focus-within:block">
        {text}
      </span>
    </span>
  );
}

export function StatusPill({
  children,
  tone = "blue",
}: {
  children: React.ReactNode;
  tone?: Tone;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${toneClass[tone]}`}
    >
      {children}
    </span>
  );
}

export function ButtonLink({
  href,
  children,
  variant = "primary",
}: {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost";
}) {
  const variants = {
    primary:
      "bg-base-blue text-white shadow-[0_18px_45px_rgba(0,82,255,0.28)] hover:bg-blue-600",
    secondary:
      "border border-base-blue/30 bg-white/90 text-base-dark hover:border-base-blue hover:bg-white dark:bg-white/10 dark:text-white",
    ghost: "text-muted hover:text-foreground",
  };

  return (
    <Link
      className={`inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition ${variants[variant]}`}
      href={href}
    >
      {children}
    </Link>
  );
}

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
    primary: "bg-base-blue text-white hover:bg-blue-600",
    secondary: "border border-border bg-surface text-foreground hover:bg-surface-muted",
    danger: "border border-danger/30 bg-danger/10 text-danger hover:bg-danger/15",
  };

  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]}`}
      disabled={disabled}
      type={type}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export function Card({
  children,
  className = "",
  dark = false,
}: {
  children: React.ReactNode;
  className?: string;
  dark?: boolean;
}) {
  return (
    <section
      className={`min-w-0 overflow-hidden rounded-[2rem] border p-6 shadow-sm transition ${
        dark
          ? "border-white/15 bg-white/[0.055] text-white blue-glow"
          : "border-border bg-surface text-foreground"
      } ${className}`}
    >
      {children}
    </section>
  );
}

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
    <section className={`mx-auto w-full max-w-6xl px-5 py-16 ${className}`} id={id}>
      {children}
    </section>
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
      className={`rounded-3xl border p-5 transition ${
        active
          ? "border-base-blue bg-base-blue/10"
          : "border-border bg-surface"
      }`}
    >
      <div className="flex items-start gap-4">
        <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-base-blue text-sm font-bold text-white">
          {step}
        </span>
        <div>
          <Icon className="mb-3 size-5 text-base-blue" />
          <h3 className="font-semibold">{title}</h3>
          <p className="mt-2 text-sm leading-6 text-muted">{text}</p>
        </div>
      </div>
    </div>
  );
}

export function NetworkNotice({
  title,
  children,
  tone = "blue",
}: {
  title: string;
  children: React.ReactNode;
  tone?: Tone;
}) {
  return (
    <div className={`rounded-3xl border p-5 text-sm ${toneClass[tone]}`}>
      <p className="font-semibold">{title}</p>
      <p className="mt-1 leading-6 opacity-80">{children}</p>
    </div>
  );
}

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
    <div className="rounded-3xl border border-dashed border-base-blue/30 bg-base-blue/10 p-6 text-sm leading-6 text-muted">
      <Icon className="mb-4 size-6 text-base-blue" />
      <p className="font-semibold text-foreground">{title}</p>
      <p className="mt-2">{text}</p>
    </div>
  );
}

export function ExplorerLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      className="inline-flex items-center gap-2 rounded-full bg-base-blue px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-600"
      href={href}
      rel="noreferrer"
      target="_blank"
    >
      {children}
      <ExternalLink className="size-4" />
    </a>
  );
}
