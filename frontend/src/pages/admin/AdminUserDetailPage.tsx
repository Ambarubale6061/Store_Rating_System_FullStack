import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { RoleBadge } from '@/components/common/Badge';
import { StarRating } from '@/components/common/StarRating';
import { CardSkeleton } from '@/components/common/Skeleton';
import { ErrorState } from '@/components/common/ErrorState';
import { Button } from '@/components/common/Button';
import { userService } from '@/services/userService';
import { extractErrorMessage } from '@/services/apiClient';
import type { AdminUser } from '@/types/user.types';

export function AdminUserDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    if (!id) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await userService.getById(id);
      setUser(data);
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return (
    <div>
      <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4 px-0">
        ← Back
      </Button>

      {isLoading && <CardSkeleton />}
      {!isLoading && error && <ErrorState message={error} onRetry={load} />}

      {!isLoading && !error && user && (
        <div className="flex flex-col gap-6">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-slate-800">{user.name}</h2>
              <RoleBadge role={user.role} />
            </div>
            <dl className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-slate-500">Email</dt>
                <dd className="text-slate-800">{user.email}</dd>
              </div>
              <div>
                <dt className="text-slate-500">Address</dt>
                <dd className="text-slate-800">{user.address}</dd>
              </div>
              <div>
                <dt className="text-slate-500">Joined</dt>
                <dd className="text-slate-800">{new Date(user.createdAt).toLocaleDateString()}</dd>
              </div>
            </dl>
          </div>

          {user.role === 'STORE_OWNER' && (
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-sm font-semibold text-slate-700">Owned Stores &amp; Ratings</h3>
              {!user.stores || user.stores.length === 0 ? (
                <p className="text-sm text-slate-500">This store owner has no stores yet.</p>
              ) : (
                <div className="space-y-3">
                  {user.stores.map((store) => (
                    <div key={store.id} className="flex items-center justify-between rounded-lg border border-slate-100 p-3">
                      <div>
                        <p className="text-sm font-medium text-slate-800">{store.name}</p>
                        <p className="text-xs text-slate-500">{store.email}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <StarRating value={store.averageRating} readOnly size="sm" />
                        <span className="text-xs text-slate-500">
                          {store.averageRating.toFixed(1)} ({store.totalRatings})
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
