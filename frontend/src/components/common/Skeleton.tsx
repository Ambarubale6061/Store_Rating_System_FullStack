export function TableSkeleton({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) {
  return (
    <div className="animate-pulse space-y-2" role="status" aria-label="Loading">
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="flex gap-3">
          {Array.from({ length: columns }).map((__, c) => (
            <div key={c} className="h-8 flex-1 rounded-lg bg-slate-200" />
          ))}
        </div>
      ))}
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl border border-slate-200 bg-white p-6 shadow-sm" role="status">
      <div className="mb-4 h-11 w-11 rounded-xl bg-slate-200" />
      <div className="mb-3 h-3 w-1/3 rounded bg-slate-200" />
      <div className="h-8 w-1/2 rounded bg-slate-200" />
    </div>
  );
}
