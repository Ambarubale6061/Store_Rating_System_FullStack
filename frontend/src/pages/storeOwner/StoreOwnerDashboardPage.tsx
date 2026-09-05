import { useEffect, useState, useCallback } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { Star, Users } from 'lucide-react';
import { DataTable } from '@/components/tables/DataTable';
import { Pagination } from '@/components/common/Pagination';
import { StarRating } from '@/components/common/StarRating';
import { CardSkeleton } from '@/components/common/Skeleton';
import { ErrorState } from '@/components/common/ErrorState';
import { dashboardService, type StoreOwnerStats } from '@/services/dashboardService';
import { ratingService } from '@/services/ratingService';
import { extractErrorMessage } from '@/services/apiClient';
import type { StoreRater } from '@/types/rating.types';

export function StoreOwnerDashboardPage() {
  const [stats, setStats] = useState<StoreOwnerStats | null>(null);
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [statsError, setStatsError] = useState<string | null>(null);

  const [raters, setRaters] = useState<StoreRater[]>([]);
  const [isLoadingRaters, setIsLoadingRaters] = useState(true);
  const [ratersError, setRatersError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const loadStats = useCallback(async () => {
    setIsLoadingStats(true);
    setStatsError(null);
    try {
      const data = await dashboardService.getStoreOwnerStats();
      setStats(data);
    } catch (err) {
      setStatsError(extractErrorMessage(err));
    } finally {
      setIsLoadingStats(false);
    }
  }, []);

  const loadRaters = useCallback(
    async (storeId: string) => {
      setIsLoadingRaters(true);
      setRatersError(null);
      try {
        const { raters: data, meta } = await ratingService.listRaters(storeId, { page, limit: 10 });
        setRaters(data);
        setTotalPages(meta.totalPages);
      } catch (err) {
        setRatersError(extractErrorMessage(err));
      } finally {
        setIsLoadingRaters(false);
      }
    },
    [page]
  );

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  const primaryStoreId = stats?.stores[0]?.id;
  useEffect(() => {
    if (primaryStoreId) loadRaters(primaryStoreId);
  }, [primaryStoreId, loadRaters]);

  const columns: ColumnDef<StoreRater, unknown>[] = [
    { accessorFn: (r) => r.user.name, id: 'name', header: 'User Name' },
    { accessorFn: (r) => r.user.email, id: 'email', header: 'Email' },
    {
      accessorKey: 'rating',
      header: 'Rating',
      cell: ({ row }) => <StarRating value={row.original.rating} readOnly size="sm" />,
    },
    {
      accessorKey: 'ratedAt',
      header: 'Rated On',
      cell: ({ row }) => new Date(row.original.ratedAt).toLocaleDateString(),
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h2 className="font-display text-2xl font-bold tracking-tight text-slate-900">Store Owner Dashboard</h2>
        <p className="mt-1 text-sm text-slate-500">Track how your store is performing and who's rating it.</p>
      </div>

      {isLoadingStats && (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <CardSkeleton />
          <CardSkeleton />
        </div>
      )}
      {!isLoadingStats && statsError && <ErrorState message={statsError} onRetry={loadStats} />}

      {!isLoadingStats && !statsError && stats && (
        <>
          <div className="mb-10 grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br from-amber-400 to-amber-500 opacity-10" />
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-amber-500 text-white shadow-sm">
                <Star className="h-5 w-5" fill="currentColor" />
              </div>
              <p className="text-sm font-medium text-slate-500">Average Rating</p>
              <div className="mt-2 flex items-center gap-3">
                <StarRating value={stats.averageRating} readOnly />
                <span className="font-display text-2xl font-bold text-slate-900">{stats.averageRating.toFixed(1)}</span>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br from-brand-500 to-brand-600 opacity-10" />
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 text-white shadow-sm">
                <Users className="h-5 w-5" />
              </div>
              <p className="text-sm font-medium text-slate-500">Total Ratings</p>
              <p className="mt-1 font-display text-3xl font-bold text-slate-900">{stats.totalRatings}</p>
            </div>
          </div>

          <h3 className="mb-4 font-display text-base font-semibold text-slate-800">Users Who Rated Your Store</h3>
          <DataTable
            columns={columns}
            data={raters}
            isLoading={isLoadingRaters}
            errorMessage={ratersError ?? undefined}
            onRetry={() => primaryStoreId && loadRaters(primaryStoreId)}
            emptyTitle="No ratings yet"
            emptyDescription="Once users rate your store, they'll show up here."
          />
          <div className="mt-4">
            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
          </div>
        </>
      )}
    </div>
  );
}
