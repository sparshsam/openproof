"use client";

import { useOnlineStatus } from "@/lib/offline";

export function OnlineStatusBadge() {
  const isOnline = useOnlineStatus();

  return (
    <span
      className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
        isOnline
          ? "bg-[#22c55e]/10 text-[#22c55e]"
          : "bg-error/10 text-error"
      }`}
    >
      <span
        className={`size-1.5 rounded-full ${
          isOnline ? "bg-[#22c55e]" : "bg-error"
        }`}
      />
      {isOnline ? "Online" : "Offline"}
    </span>
  );
}
