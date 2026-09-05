import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';

export function LandingFooter() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <Link to="/" className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-600 to-accent-500 text-white">
              <Star className="h-4 w-4" fill="currentColor" />
            </span>
            <span className="font-display text-base font-bold text-slate-900">
              Store<span className="text-gradient-brand">Rate</span>
            </span>
          </Link>

          <div className="flex items-center gap-6 text-sm text-slate-500">
            <a href="#features" className="hover:text-slate-800">Features</a>
            <a href="#about" className="hover:text-slate-800">About</a>
            <a href="#contact" className="hover:text-slate-800">Contact</a>
            <Link to="/login" className="hover:text-slate-800">Log in</Link>
            <Link to="/signup" className="font-medium text-brand-600 hover:text-brand-700">
              Sign up
            </Link>
          </div>
        </div>

        <div className="mt-8 border-t border-slate-200 pt-8 text-center text-xs text-slate-600">
          © {new Date().getFullYear()} StoreRate. Built by Ambar Ubale for transparent, verified store ratings.
        </div>
      </div>
    </footer>
  );
}