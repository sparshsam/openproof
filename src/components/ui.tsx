import Link from "next/link";

export function PageFrame({ children }: { children: React.ReactNode }) {
  return <main className="mx-auto w-full max-w-6xl px-5 py-10">{children}</main>;
}

export function Panel({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <section className={`rounded-lg border border-border bg-surface p-5 shadow-sm ${className}`}>
      {children}
    </section>
  );
}

export function PrimaryLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      className="inline-flex items-center justify-center rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90"
      href={href}
    >
      {children}
    </Link>
  );
}

export function SecondaryLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      className="inline-flex items-center justify-center rounded-md border border-border bg-surface px-4 py-2 text-sm font-medium hover:bg-surface-muted"
      href={href}
    >
      {children}
    </Link>
  );
}

export function HashBlock({ value }: { value: string }) {
  return (
    <pre className="overflow-x-auto rounded-md border border-border bg-surface-muted p-3 font-mono text-xs leading-relaxed text-foreground">
      {value}
    </pre>
  );
}
