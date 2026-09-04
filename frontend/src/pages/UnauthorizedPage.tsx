import { Link } from 'react-router-dom';

export function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-slate-50 text-center">
      <p className="text-5xl">🚫</p>
      <h1 className="text-xl font-semibold text-slate-800">You don&apos;t have access to this page</h1>
      <Link to="/" className="text-indigo-600 hover:underline">
        Go back home
      </Link>
    </div>
  );
}
