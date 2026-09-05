import { Link, Outlet } from 'react-router-dom';
import { ShieldCheck, Sparkles, Star, TrendingUp } from 'lucide-react';

const HIGHLIGHTS = [
  { icon: ShieldCheck, text: 'Bcrypt-hashed passwords & short-lived JWTs' },
  { icon: Star, text: 'One verified rating per user, per store' },
  { icon: TrendingUp, text: 'Live dashboards for every role' },
];

export function AuthLayout() {
  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      {/* Branding panel — hidden on small screens to keep mobile focused on the form */}
      <div className="relative hidden flex-col justify-between overflow-hidden bg-mesh-hero p-12 lg:flex">
        <div className="absolute -left-24 top-1/3 -z-10 h-72 w-72 rounded-full bg-brand-200/40 blur-3xl" />
        <div className="absolute -right-16 bottom-10 -z-10 h-64 w-64 rounded-full bg-accent-300/30 blur-3xl" />

        <Link to="/" className="flex items-center gap-2">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-600 to-accent-500 text-white shadow-md shadow-brand-600/20">
            <Star className="h-5 w-5" fill="currentColor" />
          </span>
          <span className="font-display text-xl font-bold tracking-tight text-slate-900">
            Store<span className="text-gradient-brand">Rate</span>
          </span>
        </Link>

        <div>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white/70 px-4 py-1.5 text-xs font-semibold text-brand-700">
            <Sparkles className="h-3.5 w-3.5" />
            Trusted rating infrastructure
          </div>
          <h2 className="font-display text-3xl font-bold leading-tight tracking-tight text-slate-900 xl:text-4xl">
            Ratings your admins, customers, and store owners can actually trust.
          </h2>
          <p className="mt-4 max-w-md text-slate-600">
            One account, one clear dashboard — built for whichever role you have.
          </p>

          <div className="mt-10 space-y-4">
            {HIGHLIGHTS.map((item) => (
              <div key={item.text} className="flex items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/80 text-brand-600 shadow-sm">
                  <item.icon className="h-4 w-4" />
                </span>
                <span className="text-sm font-medium text-slate-700">{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs text-slate-500">© {new Date().getFullYear()} StoreRate. All rights reserved.</p>
      </div>

      {/* Form panel */}
      <div className="flex items-center justify-center bg-slate-50 px-4 py-12 sm:px-6 lg:bg-white lg:px-16 xl:px-24">
        <div className="w-full max-w-sm">
          <Link to="/" className="mb-8 flex items-center gap-2 lg:hidden">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-600 to-accent-500 text-white">
              <Star className="h-5 w-5" fill="currentColor" />
            </span>
            <span className="font-display text-lg font-bold tracking-tight text-slate-900">
              Store<span className="text-gradient-brand">Rate</span>
            </span>
          </Link>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
