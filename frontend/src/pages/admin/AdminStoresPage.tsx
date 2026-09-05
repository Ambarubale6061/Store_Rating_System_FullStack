import { useEffect, useState, useCallback } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import toast from 'react-hot-toast';
import { Plus } from 'lucide-react';
import { DataTable } from '@/components/tables/DataTable';
import { SearchBar } from '@/components/common/SearchBar';
import { Pagination } from '@/components/common/Pagination';
import { Button } from '@/components/common/Button';
import { Modal } from '@/components/common/Modal';
import { StoreForm } from '@/components/forms/StoreForm';
import { StarRating } from '@/components/common/StarRating';
import { useDebounce } from '@/hooks/useDebounce';
import { storeService } from '@/services/storeService';
import { userService } from '@/services/userService';
import { extractErrorMessage } from '@/services/apiClient';
import type { Store } from '@/types/store.types';
import type { AdminUser } from '@/types/user.types';
import type { CreateStoreFormValues } from '@/utils/validationSchemas';

export function AdminStoresPage() {
  const [stores, setStores] = useState<Store[]>([]);
  const [storeOwners, setStoreOwners] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const loadStoreOwners = useCallback(async () => {
    try {
      const { users } = await userService.list({ role: 'STORE_OWNER', limit: 100 });
      setStoreOwners(users);
    } catch {
      // Non-fatal — the store form will just show "no owners" until this succeeds.
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const handleSortChange = (columnId: string) => {
    if (sortBy === columnId) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(columnId);
      setSortOrder('asc');
    }
  };

  const openModal = () => {
    loadStoreOwners();
    setIsModalOpen(true);
  };

  const handleCreate = async (values: CreateStoreFormValues) => {
    try {
      await storeService.create(values);
      toast.success('Store created successfully.');
      setIsModalOpen(false);
      load();
    } catch (err) {
      toast.error(extractErrorMessage(err));
    }
  };

  const columns: ColumnDef<Store, unknown>[] = [
    { accessorKey: 'name', header: 'Store Name' },
    { accessorKey: 'email', header: 'Email' },
    { accessorKey: 'address', header: 'Address' },
    {
      accessorKey: 'averageRating',
      header: 'Rating',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <StarRating value={row.original.averageRating} readOnly size="sm" />
          <span className="text-xs text-slate-500">
            {row.original.averageRating.toFixed(1)} ({row.original.totalRatings})
          </span>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold tracking-tight text-slate-900">Stores</h2>
          <p className="mt-1 text-sm text-slate-500">Browse every listed store and its live rating.</p>
        </div>
        <Button onClick={openModal}>
          <Plus className="h-4 w-4" />
          Add Store
        </Button>
      </div>

      <div className="mb-5">
        <SearchBar value={search} onChange={setSearch} placeholder="Search by name, email, or address..." />
      </div>

      <DataTable
        columns={columns}
        data={stores}
        isLoading={isLoading}
        errorMessage={error ?? undefined}
        onRetry={load}
        emptyTitle="No stores found"
        emptyDescription="Try adjusting your search, or add a new store."
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSortChange={handleSortChange}
      />

      <div className="mt-4">
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </div>

      <Modal title="Add Store" isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <StoreForm storeOwners={storeOwners} onSubmit={handleCreate} onCancel={() => setIsModalOpen(false)} />
      </Modal>
    </div>
  );
}
