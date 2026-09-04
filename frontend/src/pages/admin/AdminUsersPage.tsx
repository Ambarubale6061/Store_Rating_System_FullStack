import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import type { ColumnDef } from '@tanstack/react-table';
import toast from 'react-hot-toast';
import { DataTable } from '@/components/tables/DataTable';
import { SearchBar } from '@/components/common/SearchBar';
import { Pagination } from '@/components/common/Pagination';
import { Button } from '@/components/common/Button';
import { Modal } from '@/components/common/Modal';
import { UserForm } from '@/components/forms/UserForm';
import { RoleBadge } from '@/components/common/Badge';
import { useDebounce } from '@/hooks/useDebounce';
import { userService } from '@/services/userService';
import { extractErrorMessage } from '@/services/apiClient';
import type { AdminUser } from '@/types/user.types';
import type { CreateUserFormValues } from '@/utils/validationSchemas';

export function AdminUsersPage() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<AdminUser[]>([]);
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
      const { users: data, meta } = await userService.list({
        page,
        limit: 10,
        sortBy,
        sortOrder,
        search: debouncedSearch || undefined,
      });
      setUsers(data);
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
    if (sortBy === columnId) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(columnId);
      setSortOrder('asc');
    }
  };

  const handleCreate = async (values: CreateUserFormValues) => {
    try {
      await userService.create(values);
      toast.success('User created successfully.');
      setIsModalOpen(false);
      load();
    } catch (err) {
      toast.error(extractErrorMessage(err));
    }
  };

  const columns: ColumnDef<AdminUser, unknown>[] = [
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'email', header: 'Email' },
    { accessorKey: 'address', header: 'Address' },
    {
      accessorKey: 'role',
      header: 'Role',
      cell: ({ row }) => <RoleBadge role={row.original.role} />,
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => (
        <button
          onClick={() => navigate(`/admin/users/${row.original.id}`)}
          className="text-xs font-medium text-indigo-600 hover:underline"
        >
          View details →
        </button>
      ),
    },
  ];

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-slate-800">Users</h2>
        <Button onClick={() => setIsModalOpen(true)}>+ Add User</Button>
      </div>

      <div className="mb-4">
        <SearchBar value={search} onChange={setSearch} placeholder="Search by name, email, or address..." />
      </div>

      <DataTable
        columns={columns}
        data={users}
        isLoading={isLoading}
        errorMessage={error ?? undefined}
        onRetry={load}
        emptyTitle="No users found"
        emptyDescription="Try adjusting your search."
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSortChange={handleSortChange}
      />

      <div className="mt-4">
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </div>

      <Modal title="Add User" isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <UserForm onSubmit={handleCreate} onCancel={() => setIsModalOpen(false)} />
      </Modal>
    </div>
  );
}
