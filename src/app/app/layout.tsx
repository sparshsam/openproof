"use client";

import { PwaShell } from "@/components/pwa-shell";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <PwaShell>{children}</PwaShell>;
}
