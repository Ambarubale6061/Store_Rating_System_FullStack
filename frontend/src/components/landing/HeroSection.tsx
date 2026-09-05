import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Sparkles, Star, TrendingUp, Users } from 'lucide-react';
import { Button } from '@/components/common/Button';

const STATS = [
  { label: 'Stores Tracked', value: '2,400+' },
  { label: 'Ratings Submitted', value: '58K+' },
  { label: 'Avg. Setup Time', value: '< 5 min' },
];

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-mesh-hero">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-4 py-20 sm:px-6 sm:py-28 lg:grid-cols-2 lg:px-8">
        <div>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-4 py-1.5 text-xs font-semibold text-brand-700">
            <Sparkles className="h-3.5 w-3.5" />
            Trusted rating infrastructure for modern retail
          </div>

          <h1 className="font-display text-4xl font-bold leading-[1.1] tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
            Store ratings that <span className="text-gradient-brand">build trust</span>, not just numbers.
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-600">
            One platform for admins, customers, and store owners to manage listings, submit
            honest reviews, and track performance — with role-based dashboards built for
            clarity, not clutter.
          </p>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Link to="/signup">
              <Button className="h-12 w-full px-7 text-base sm:w-auto">
                Create free account
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="secondary" className="h-12 w-full px-7 text-base sm:w-auto">
                Log in to your account
              </Button>
            </Link>
          </div>

          <div className="mt-12 grid grid-cols-3 gap-6 border-t border-slate-200 pt-8">
            {STATS.map((stat) => (
              <div key={stat.label}>
                <p className="font-display text-2xl font-bold text-slate-900 sm:text-3xl">{stat.value}</p>
                <p className="mt-1 text-xs font-medium text-slate-500 sm:text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative hidden lg:block">
          <div className="relative mx-auto w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl shadow-slate-900/10">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-400">Dashboard Overview</p>
                <p className="font-display text-lg font-bold text-slate-800">The Corner Bakery</p>
              </div>
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">
                Live
              </span>
            </div>

            <div className="mb-5 flex items-center gap-4 rounded-xl bg-slate-50 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-500">
                <Star className="h-6 w-6" fill="currentColor" />
              </div>
              <div>
                <p className="font-display text-2xl font-bold text-slate-800">4.8</p>
                <p className="text-xs text-slate-500">Average rating · 312 reviews</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-slate-100 p-4">
                <Users className="mb-2 h-5 w-5 text-brand-500" />
                <p className="font-display text-xl font-bold text-slate-800">1,204</p>
                <p className="text-xs text-slate-500">Active raters</p>
              </div>
              <div className="rounded-xl border border-slate-100 p-4">
                <TrendingUp className="mb-2 h-5 w-5 text-accent-500" />
                <p className="font-display text-xl font-bold text-slate-800">+18%</p>
                <p className="text-xs text-slate-500">Growth, 30 days</p>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2 rounded-xl border border-slate-100 p-3 text-xs text-slate-500">
              <ShieldCheck className="h-4 w-4 shrink-0 text-brand-500" />
              Verified ratings — one account, one review per store.
            </div>
          </div>

          <div className="absolute -bottom-6 -left-6 -z-10 h-40 w-40 rounded-full bg-brand-200/40 blur-3xl" />
          <div className="absolute -right-8 -top-8 -z-10 h-40 w-40 rounded-full bg-accent-300/30 blur-3xl" />
        </div>
      </div>
    </section>
  );
}
