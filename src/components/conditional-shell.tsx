"use client";

import { usePathname } from "next/navigation";
import { AppShell } from "@/components/app-shell";

export function ConditionalShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isPwaRoute = pathname.startsWith("/app");

  // PWA routes have their own shell in src/app/app/layout.tsx
  if (isPwaRoute) {
    return <>{children}</>;
  }

  return <AppShell>{children}</AppShell>;
}
