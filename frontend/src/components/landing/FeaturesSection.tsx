import { BarChart3, Lock, Search, ShieldCheck, Star, Users2 } from 'lucide-react';

const FEATURES = [
  {
    icon: Users2,
    title: 'Three roles, one login',
    description:
      'Admins, customers, and store owners share a single secure sign-in, each landing on a dashboard built specifically for their job.',
  },
  {
    icon: Star,
    title: 'One honest rating per store',
    description:
      'Every customer can rate a store once — and update it any time — so averages reflect real, current sentiment instead of noise.',
  },
  {
    icon: BarChart3,
    title: 'Live performance dashboards',
    description:
      'Store owners see their average rating, total review count, and exactly who rated them — updated the moment a new review lands.',
  },
  {
    icon: Search,
    title: 'Fast search & sorting',
    description:
      'Find any store or user instantly with debounced search, sortable columns, and clean pagination — even across thousands of records.',
  },
  {
    icon: Lock,
    title: 'Bank-grade authentication',
    description:
      'Passwords are hashed with bcrypt, sessions run on short-lived JWTs with silent refresh, and every route is protected by role.',
  },
  {
    icon: ShieldCheck,
    title: 'Admin oversight, built in',
    description:
      'Full visibility into every user, store, and rating in the system, with the tools to add accounts and stores in seconds.',
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-brand-600">Features</p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Everything a rating platform needs — nothing it doesn't
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            Purpose-built workflows for the three people who actually use a rating system every day.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="group rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-900/5"
            >
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-brand-50 to-accent-50 text-brand-600 transition-colors group-hover:from-brand-600 group-hover:to-accent-500 group-hover:text-white">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="font-display text-lg font-semibold text-slate-900">{feature.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
