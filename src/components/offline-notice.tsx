"use client";

import { useOnlineStatus } from "@/lib/offline";

export function OfflineNotice() {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div
      aria-live="assertive"
      className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-lg rounded-full bg-error/90 px-6 py-3 text-sm font-semibold text-white text-center shadow-lg backdrop-blur-sm"
      role="alert"
    >
      You are offline. Onchain verification requires an internet connection.
    </div>
  );
}
