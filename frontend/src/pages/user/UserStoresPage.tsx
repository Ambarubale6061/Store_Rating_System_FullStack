import { useEffect, useState, useCallback } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import toast from 'react-hot-toast';
import { DataTable } from '@/components/tables/DataTable';
import { SearchBar } from '@/components/common/SearchBar';
import { Pagination } from '@/components/common/Pagination';
import { StarRating } from '@/components/common/StarRating';
import { useDebounce } from '@/hooks/useDebounce';
import { storeService } from '@/services/storeService';
import { ratingService } from '@/services/ratingService';
import { extractErrorMessage } from '@/services/apiClient';
import type { Store } from '@/types/store.types';

export function UserStoresPage() {
  const [stores, setStores] = useState<Store[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [submittingStoreId, setSubmittingStoreId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { stores: data, meta } = await storeService.list({
        page,
        limit: 10,
        sortBy,
        sortOrder,
        search: debouncedSearch || undefined,
      });
      setStores(data);
      setTotalPages(meta.totalPages);
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, [page, sortBy, sortOrder, debouncedSearch]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const handleSortChange = (columnId: string) => {
    if (columnId === 'myRating') return; // not sortable server-side
    if (sortBy === columnId) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(columnId);
      setSortOrder('asc');
    }
  };

  const handleRate = async (storeId: string, rating: number) => {
    setSubmittingStoreId(storeId);
    try {
      await ratingService.submit({ storeId, rating });
      toast.success('Rating submitted.');
      setStores((prev) => prev.map((s) => (s.id === storeId ? { ...s, myRating: rating } : s)));
      // Refresh in the background to pick up the new overall average.
      load();
    } catch (err) {
      toast.error(extractErrorMessage(err));
    } finally {
      setSubmittingStoreId(null);
    }
  };

  const columns: ColumnDef<Store, unknown>[] = [
    { accessorKey: 'name', header: 'Store Name' },
    { accessorKey: 'address', header: 'Store Address' },
    {
      accessorKey: 'averageRating',
      header: 'Overall Rating',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <StarRating value={row.original.averageRating} readOnly size="sm" />
          <span className="text-xs text-slate-500">
            {row.original.averageRating.toFixed(1)} ({row.original.totalRatings})
          </span>
        </div>
      ),
    },
    {
      id: 'myRating',
      header: 'My Rating',
      cell: ({ row }) => (
        <StarRating
          value={row.original.myRating ?? 0}
          onChange={(rating) => handleRate(row.original.id, rating)}
          readOnly={submittingStoreId === row.original.id}
        />
      ),
    },
  ];

  return (
    <div>
      <h2 className="mb-6 text-xl font-semibold text-slate-800">Browse Stores</h2>

      <div className="mb-4">
        <SearchBar value={search} onChange={setSearch} placeholder="Search by store name or address..." />
      </div>

      <DataTable
        columns={columns}
        data={stores}
        isLoading={isLoading}
        errorMessage={error ?? undefined}
        onRetry={load}
        emptyTitle="No stores found"
        emptyDescription="Try a different search term."
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSortChange={handleSortChange}
      />

      <div className="mt-4">
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </div>
    </div>
  );
}
