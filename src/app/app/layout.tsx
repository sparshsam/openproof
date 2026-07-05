"use client";

import { usePwaMode } from "@/lib/use-pwa-mode";
import { PwaShell } from "@/components/pwa-shell";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { isPwa } = usePwaMode();

  // In installed PWA mode, ConditionalShell already wraps everything in PwaShell.
  // Only apply PwaShell here when browsing /app in a regular browser tab.
  if (isPwa) {
    return <>{children}</>;
  }

  return <PwaShell>{children}</PwaShell>;
}
