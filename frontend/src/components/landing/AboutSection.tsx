import { CheckCircle2 } from 'lucide-react';

const POINTS = [
  'Every rating is tied to a verified, authenticated account — no anonymous drive-by reviews.',
  'Store owners get a transparent view of exactly who rated them and when.',
  'Admins keep full control over accounts and listings without touching a database.',
  'Built on a modern, auditable stack: PostgreSQL, Prisma, and role-based JWT authentication.',
];

export function AboutSection() {
  return (
    <section id="about" className="bg-slate-50 py-20 sm:py-28">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-14 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-brand-600">About the platform</p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Built for trustworthy ratings, from the ground up
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-slate-600">
            Most rating systems optimize for volume. We optimized for trust. Every account is
            verified, every rating is traceable to exactly one person per store, and every
            dashboard shows only what that role actually needs — so the numbers you see mean
            something.
          </p>

          <ul className="mt-8 space-y-4">
            {POINTS.map((point) => (
              <li key={point} className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
                <span className="text-slate-700">{point}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2 rounded-2xl bg-gradient-to-br from-brand-600 to-accent-500 p-8 text-white shadow-xl shadow-brand-600/20">
            <p className="font-display text-4xl font-bold">99.9%</p>
            <p className="mt-2 text-sm text-brand-100">Uptime target for production deployments</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <p className="font-display text-3xl font-bold text-slate-900">1–5</p>
            <p className="mt-1 text-sm text-slate-500">Simple star scale, no confusing metrics</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <p className="font-display text-3xl font-bold text-slate-900">3</p>
            <p className="mt-1 text-sm text-slate-500">Purpose-built role dashboards</p>
          </div>
        </div>
      </div>
    </section>
  );
}
