import { useEffect, useState, useCallback } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
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

  // Once we know which store(s) this owner has, load raters for the first one.
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
      <h2 className="mb-6 text-xl font-semibold text-slate-800">Store Owner Dashboard</h2>

      {isLoadingStats && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <CardSkeleton />
          <CardSkeleton />
        </div>
      )}
      {!isLoadingStats && statsError && <ErrorState message={statsError} onRetry={loadStats} />}

      {!isLoadingStats && !statsError && stats && (
        <>
          <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="mb-2 text-sm text-slate-500">Average Rating</p>
              <div className="flex items-center gap-3">
                <StarRating value={stats.averageRating} readOnly />
                <span className="text-2xl font-semibold text-slate-800">{stats.averageRating.toFixed(1)}</span>
              </div>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="mb-2 text-sm text-slate-500">Total Ratings</p>
              <p className="text-3xl font-semibold text-slate-800">{stats.totalRatings}</p>
            </div>
          </div>

          <h3 className="mb-4 text-sm font-semibold text-slate-700">Users Who Rated Your Store</h3>
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
