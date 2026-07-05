"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileUp, Search, Clock, Menu } from "lucide-react";

const tabs = [
  { href: "/app", label: "Create", icon: FileUp },
  { href: "/app/verify", label: "Verify", icon: Search },
  { href: "/app/history", label: "History", icon: Clock },
  { href: "/app/more", label: "More", icon: Menu },
] as const;

export function PwaBottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-border-default bg-bg-base/95 backdrop-blur-md md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
      aria-label="App navigation"
    >
      <div className="flex items-center justify-around">
        {tabs.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center gap-0.5 px-4 py-2 text-[10px] font-semibold transition-colors ${
                isActive
                  ? "text-accent"
                  : "text-text-muted hover:text-text-primary"
              }`}
            >
              <Icon className="size-5" aria-hidden="true" />
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
