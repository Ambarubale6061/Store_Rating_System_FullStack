import { Mail, MapPin, Phone } from 'lucide-react';

const CONTACT_METHODS = [
  { icon: Mail, label: 'Email', value: 'support@storerate.app', href: 'mailto:support@storerate.app' },
  { icon: Phone, label: 'Phone', value: '+91 9579377966', href: 'tel:+919579377966' },
  { icon: MapPin, label: 'Office', value: 'Remote, worldwide', href: undefined },
];

export function ContactSection() {
  return (
    <section id="contact" className="bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-slate-900 shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="p-10 sm:p-14">
              <p className="text-sm font-semibold uppercase tracking-wider text-accent-400">Get in touch</p>
              <h2 className="mt-3 font-display text-3xl font-bold text-white">
                Questions before you sign up?
              </h2>
              <p className="mt-4 text-slate-300">
                Whether you're an admin evaluating the platform or a store owner curious about
                your dashboard, we're happy to walk you through it.
              </p>

              <div className="mt-8 space-y-5">
                {CONTACT_METHODS.map((method) => {
                  const Content = (
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 text-accent-400">
                        <method.icon className="h-5 w-5" />
                      </span>
                      <div>
                        <p className="text-xs text-slate-400">{method.label}</p>
                        <p className="text-sm font-medium text-white">{method.value}</p>
                      </div>
                    </div>
                  );
                  return method.href ? (
                    <a key={method.label} href={method.href} className="block transition-opacity hover:opacity-80">
                      {Content}
                    </a>
                  ) : (
                    <div key={method.label}>{Content}</div>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-col justify-center gap-4 bg-slate-800/60 p-10 sm:p-14">
              <p className="font-display text-xl font-semibold text-white">
                Ready to see it in action?
              </p>
              <p className="text-sm text-slate-300">
                Create a free account as a customer, or ask an admin to set you up as a store
                owner — either way, you're in your dashboard in under a minute.
              </p>
              <div className="mt-2 flex flex-col gap-3 sm:flex-row">
                <a
                  href="/signup"
                  className="inline-flex flex-1 items-center justify-center rounded-lg bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition-colors hover:bg-slate-100"
                >
                  Create free account
                </a>
                <a
                  href="/login"
                  className="inline-flex flex-1 items-center justify-center rounded-lg border border-white/20 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
                >
                  Log in
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
