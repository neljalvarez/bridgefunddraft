/** Placeholder shown while the browser loads the student's saved data. */
export function PortalSkeleton() {
  return (
    <div role="status" aria-label="Loading your portal" className="animate-pulse space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }, (_, i) => (
          <div key={i} className="h-28 rounded-xl border border-border bg-card" />
        ))}
      </div>
      <div className="h-64 rounded-xl border border-border bg-card" />
      <span className="sr-only">Loading…</span>
    </div>
  );
}
