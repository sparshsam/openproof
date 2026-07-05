"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { usePwaMode } from "@/lib/use-pwa-mode";
import { AppShell } from "@/components/app-shell";
import { PwaShell } from "@/components/pwa-shell";

export function ConditionalShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isPwa } = usePwaMode();
  const [hydrated, setHydrated] = useState(false);

  // Mark hydrated after first client render so PWA detection doesn't
  // cause a server/client tree mismatch during hydration.
  useEffect(() => {
    const raf = requestAnimationFrame(() => setHydrated(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  // In installed PWA mode, redirect the website landing page to the app
  useEffect(() => {
    if (isPwa && pathname === "/") {
      router.replace("/app");
    }
  }, [isPwa, pathname, router]);

  // After hydration: use PWA-aware routing
  if (hydrated && isPwa) {
    // While redirecting from / → /app, show a minimal placeholder
    if (pathname === "/") {
      return (
        <PwaShell>
          <div className="min-h-[50vh]" />
        </PwaShell>
      );
    }
    // /app routes: AppLayout provides PwaShell — pass through
    if (pathname.startsWith("/app")) {
      return <>{children}</>;
    }
    // Non-/app routes: wrap in PwaShell here
    return <PwaShell>{children}</PwaShell>;
  }

  // Before hydration OR browser mode: pathname-based routing (matches SSR)
  // /app routes: AppLayout always provides PwaShell
  // Non-/app routes: AppShell provides the website layout
  const isAppRoute = pathname.startsWith("/app");
  if (isAppRoute) {
    return <>{children}</>;
  }

  // Default: website shell
  return <AppShell>{children}</AppShell>;
}
