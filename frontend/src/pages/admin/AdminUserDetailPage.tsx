import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
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
      <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6 px-0">
        <ArrowLeft className="h-4 w-4" />
        Back
      </Button>

      {isLoading && <CardSkeleton />}
      {!isLoading && error && <ErrorState message={error} onRetry={load} />}

      {!isLoading && !error && user && (
        <div className="flex flex-col gap-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
            <div className="mb-6 flex items-center gap-4">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-brand-100 to-accent-100 font-display text-lg font-bold text-brand-700">
                {user.name
                  .split(' ')
                  .filter(Boolean)
                  .slice(0, 2)
                  .map((p) => p[0]?.toUpperCase())
                  .join('')}
              </span>
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h2 className="font-display text-xl font-bold text-slate-900">{user.name}</h2>
                  <RoleBadge role={user.role} />
                </div>
              </div>
            </div>
            <dl className="grid grid-cols-1 gap-5 text-sm sm:grid-cols-3">
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">Email</dt>
                <dd className="mt-1 text-slate-800">{user.email}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">Address</dt>
                <dd className="mt-1 text-slate-800">{user.address}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">Joined</dt>
                <dd className="mt-1 text-slate-800">{new Date(user.createdAt).toLocaleDateString()}</dd>
              </div>
            </dl>
          </div>

          {user.role === 'STORE_OWNER' && (
            <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
              <h3 className="mb-5 font-display text-base font-semibold text-slate-800">Owned Stores &amp; Ratings</h3>
              {!user.stores || user.stores.length === 0 ? (
                <p className="text-sm text-slate-500">This store owner has no stores yet.</p>
              ) : (
                <div className="space-y-3">
                  {user.stores.map((store) => (
                    <div
                      key={store.id}
                      className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/60 p-4"
                    >
                      <div>
                        <p className="text-sm font-semibold text-slate-800">{store.name}</p>
                        <p className="text-xs text-slate-500">{store.email}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <StarRating value={store.averageRating} readOnly size="sm" />
                        <span className="text-xs font-medium text-slate-500">
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
