/**
 * Loading boundary for the PWA app route group.
 *
 * Shows lightweight skeleton cards during route transitions so the user
 * never sees a blank flash between /app pages.
 */
export default function AppLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Skeleton for quick-action grid */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="h-[72px] rounded-2xl bg-bg-surface-muted" />
        <div className="h-[72px] rounded-2xl bg-bg-surface-muted" />
      </div>

      {/* Skeleton for section header */}
      <div className="h-5 w-32 rounded bg-bg-surface-muted" />

      {/* Skeleton for list items */}
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="h-16 rounded-2xl bg-bg-surface-muted" />
      ))}
    </div>
  );
}
