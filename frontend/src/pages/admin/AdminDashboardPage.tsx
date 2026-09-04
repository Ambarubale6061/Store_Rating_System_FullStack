import { useEffect, useState } from 'react';
import { CardSkeleton } from '@/components/common/Skeleton';
import { ErrorState } from '@/components/common/ErrorState';
import { dashboardService, type AdminStats } from '@/services/dashboardService';
import { extractErrorMessage } from '@/services/apiClient';

const CARDS: { key: keyof AdminStats; label: string; icon: string }[] = [
  { key: 'totalUsers', label: 'Total Users', icon: '👤' },
  { key: 'totalStores', label: 'Total Stores', icon: '🏬' },
  { key: 'totalRatings', label: 'Total Ratings', icon: '⭐' },
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
      <h2 className="mb-6 text-xl font-semibold text-slate-800">Admin Dashboard</h2>

      {isLoading && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      )}

      {!isLoading && error && <ErrorState message={error} onRetry={load} />}

      {!isLoading && !error && stats && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {CARDS.map((card) => (
            <div key={card.key} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-2 flex items-center gap-2 text-sm text-slate-500">
                <span>{card.icon}</span>
                {card.label}
              </div>
              <p className="text-3xl font-semibold text-slate-800">{stats[card.key]}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
