import { useEffect, useState } from 'react';
import { BarChart3, Store, Users } from 'lucide-react';
import { CardSkeleton } from '@/components/common/Skeleton';
import { ErrorState } from '@/components/common/ErrorState';
import { dashboardService, type AdminStats } from '@/services/dashboardService';
import { extractErrorMessage } from '@/services/apiClient';

const CARDS: { key: keyof AdminStats; label: string; icon: typeof Users; accent: string }[] = [
  { key: 'totalUsers', label: 'Total Users', icon: Users, accent: 'from-brand-500 to-brand-600' },
  { key: 'totalStores', label: 'Total Stores', icon: Store, accent: 'from-accent-500 to-accent-600' },
  { key: 'totalRatings', label: 'Total Ratings', icon: BarChart3, accent: 'from-amber-400 to-amber-500' },
];

export function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await dashboardService.getAdminStats();
      setStats(data);
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div>
      <div className="mb-8">
        <h2 className="font-display text-2xl font-bold tracking-tight text-slate-900">Admin Dashboard</h2>
        <p className="mt-1 text-sm text-slate-500">A live overview of everything happening on the platform.</p>
      </div>

      {isLoading && (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      )}

      {!isLoading && error && <ErrorState message={error} onRetry={load} />}

      {!isLoading && !error && stats && (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          {CARDS.map((card) => (
            <div
              key={card.key}
              className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-lg"
            >
              <div
                className={`absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br ${card.accent} opacity-10 transition-transform group-hover:scale-125`}
              />
              <div
                className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${card.accent} text-white shadow-sm`}
              >
                <card.icon className="h-5 w-5" />
              </div>
              <p className="text-sm font-medium text-slate-500">{card.label}</p>
              <p className="mt-1 font-display text-3xl font-bold text-slate-900">{stats[card.key]}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
