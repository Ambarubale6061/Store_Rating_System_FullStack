import { Star } from 'lucide-react';

export function PageLoader() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-50">
      <span className="flex h-12 w-12 animate-pulse items-center justify-center rounded-2xl bg-gradient-to-br from-brand-600 to-accent-500 text-white shadow-lg shadow-brand-600/20">
        <Star className="h-6 w-6" fill="currentColor" />
      </span>
      <div className="h-1.5 w-40 overflow-hidden rounded-full bg-slate-200">
        <div className="h-full w-1/2 animate-pulse rounded-full bg-gradient-to-r from-brand-600 to-accent-500" />
      </div>
    </div>
  );
}
