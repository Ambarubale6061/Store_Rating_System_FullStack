import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';
import { Button } from '@/components/common/Button';

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-50 px-4 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-100 to-accent-100 text-brand-600">
        <Compass className="h-8 w-8" />
      </span>
      <div>
        <h1 className="font-display text-2xl font-bold text-slate-900">Page not found</h1>
        <p className="mt-2 text-sm text-slate-500">The page you're looking for doesn't exist or has moved.</p>
      </div>
      <Link to="/">
        <Button className="mt-2">Go back home</Button>
      </Link>
    </div>
  );
}
