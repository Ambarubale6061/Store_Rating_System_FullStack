import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  Clock,
  Mail,
  MapPin,
  Package,
  Pencil,
  Phone,
  Store as StoreIcon,
  Tag,
  User,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { Button } from '@/components/common/Button';
import { Modal } from '@/components/common/Modal';
import { StarRating } from '@/components/common/StarRating';
import { CardSkeleton } from '@/components/common/Skeleton';
import { ErrorState } from '@/components/common/ErrorState';
import { StoreEditForm } from '@/components/forms/StoreEditForm';
import { useAuth } from '@/hooks/useAuth';
import { storeService } from '@/services/storeService';
import { ratingService } from '@/services/ratingService';
import { extractErrorMessage } from '@/services/apiClient';
import { toStoreProfilePayload } from '@/utils/storeProfile';
import type { UpdateStoreFormValues } from '@/utils/validationSchemas';
import type { Store } from '@/types/store.types';

function getInitials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');
}

/** Label + value row. Shows a muted "Not provided" placeholder when the
 * store hasn't filled in that field, instead of hiding the row entirely —
 * keeps the layout consistent whether or not the data exists yet. */
function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Mail;
  label: string;
  value?: string | null;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
        <Icon className="h-4 w-4" />
      </span>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</p>
        {value ? (
          <p className="mt-0.5 text-sm text-slate-800">{value}</p>
        ) : (
          <p className="mt-0.5 text-sm italic text-slate-400">Not provided</p>
        )}
      </div>
    </div>
  );
}

function ChipRow({
  icon: Icon,
  label,
  items,
  colorClass,
}: {
  icon: typeof Tag;
  label: string;
  items?: string[];
  colorClass: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
        <Icon className="h-4 w-4" />
      </span>
      <div className="flex-1">
        <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</p>
        {items && items.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {items.map((item) => (
              <span key={item} className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${colorClass}`}>
                {item}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-sm italic text-slate-400">Not provided</p>
        )}
      </div>
    </div>
  );
}

export function StoreDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [store, setStore] = useState<Store | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmittingRating, setIsSubmittingRating] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [logoFailed, setLogoFailed] = useState(false);

  // Only a USER account can submit a rating (matches the backend's
  // POST /ratings authorization, which is USER-only) — Admins and Store
  // Owners viewing this same profile see the rating summary read-only.
  const canRate = user?.role === 'USER';
  // Only ADMIN can edit a store's profile (matches the backend's
  // PATCH /stores/:id authorization, which is ADMIN-only).
  const canEdit = user?.role === 'ADMIN';

  const load = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await storeService.getById(id);
      setStore(data);
      setLogoFailed(false);
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  const handleRate = async (rating: number) => {
    if (!store) return;
    setIsSubmittingRating(true);
    try {
      await ratingService.submit({ storeId: store.id, rating });
      toast.success('Rating submitted.');
      await load();
    } catch (err) {
      toast.error(extractErrorMessage(err));
    } finally {
      setIsSubmittingRating(false);
    }
  };

  const handleUpdate = async (values: UpdateStoreFormValues) => {
    if (!store) return;
    try {
      await storeService.update(store.id, {
        name: values.name,
        email: values.email,
        address: values.address,
        ...toStoreProfilePayload(values),
      });
      toast.success('Store updated successfully.');
      setIsEditOpen(false);
      await load();
    } catch (err) {
      toast.error(extractErrorMessage(err));
    }
  };

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6 flex items-center justify-between">
        <Button variant="ghost" onClick={() => navigate(-1)} className="px-0">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        {canEdit && store && (
          <Button variant="secondary" onClick={() => setIsEditOpen(true)}>
            <Pencil className="h-4 w-4" />
            Edit Store
          </Button>
        )}
      </div>

      {isLoading && (
        <div className="space-y-5">
          <CardSkeleton />
          <CardSkeleton />
        </div>
      )}

      {!isLoading && error && <ErrorState message={error} onRetry={load} />}

      {!isLoading && !error && store && (
        <div className="flex flex-col gap-6">
          {/* Hero / identity card */}
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="h-24 bg-gradient-to-r from-brand-600 to-accent-500" />
            <div className="px-7 pb-7">
              <div className="-mt-10 flex flex-col items-start gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div className="flex items-end gap-4">
                  {store.logoUrl && !logoFailed ? (
                    <img
                      src={store.logoUrl}
                      alt={`${store.name} logo`}
                      onError={() => setLogoFailed(true)}
                      className="h-20 w-20 shrink-0 rounded-2xl border-4 border-white object-cover shadow-sm"
                    />
                  ) : (
                    <span className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border-4 border-white bg-gradient-to-br from-brand-100 to-accent-100 font-display text-2xl font-bold text-brand-700 shadow-sm">
                      {getInitials(store.name) || <StoreIcon className="h-8 w-8" />}
                    </span>
                  )}
                  <div className="pb-1">
                    <h1 className="font-display text-2xl font-bold text-slate-900">{store.name}</h1>
                    <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-500">
                      <MapPin className="h-3.5 w-3.5" />
                      {store.address}
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick stats row */}
              <div className="mt-6 grid grid-cols-2 gap-4 border-t border-slate-100 pt-6 sm:grid-cols-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Average Rating</p>
                  <div className="mt-1.5 flex items-center gap-2">
                    <StarRating value={store.averageRating} readOnly size="sm" />
                    <span className="font-display text-lg font-bold text-slate-900">
                      {store.averageRating.toFixed(1)}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Total Ratings</p>
                  <p className="mt-1.5 font-display text-lg font-bold text-slate-900">{store.totalRatings}</p>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Listed Since</p>
                  <p className="mt-1.5 flex items-center gap-1.5 font-display text-lg font-bold text-slate-900">
                    <Calendar className="h-4 w-4 text-slate-400" />
                    {new Date(store.createdAt).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'short',
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Description, if the store has one */}
          {store.description && (
            <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
              <h2 className="mb-3 font-display text-base font-semibold text-slate-800">About This Store</h2>
              <p className="whitespace-pre-line text-sm leading-relaxed text-slate-600">{store.description}</p>
            </div>
          )}

          {/* Your rating (interactive for USER, read-only summary otherwise) */}
          <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
            <h2 className="mb-1 font-display text-base font-semibold text-slate-800">
              {canRate ? 'Your Rating' : 'Rating Summary'}
            </h2>
            <p className="mb-4 text-sm text-slate-500">
              {canRate
                ? 'Click a star to submit or update your rating for this store.'
                : 'Individual customer ratings roll up into the average shown above.'}
            </p>
            {canRate ? (
              <StarRating value={store.myRating ?? 0} onChange={handleRate} readOnly={isSubmittingRating} />
            ) : (
              <div className="flex items-center gap-2">
                <StarRating value={store.averageRating} readOnly />
                <span className="text-sm text-slate-500">
                  based on {store.totalRatings} {store.totalRatings === 1 ? 'rating' : 'ratings'}
                </span>
              </div>
            )}
          </div>

          {/* Contact & ownership */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
              <h2 className="mb-5 font-display text-base font-semibold text-slate-800">Contact Information</h2>
              <div className="flex flex-col gap-5">
                <InfoRow icon={Mail} label="Email" value={store.email} />
                <InfoRow icon={MapPin} label="Address" value={store.address} />
                <InfoRow icon={Phone} label="Phone" value={store.phone} />
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
              <h2 className="mb-5 font-display text-base font-semibold text-slate-800">Ownership</h2>
              <div className="flex flex-col gap-5">
                <InfoRow icon={User} label="Owner Name" value={store.owner?.name} />
                <InfoRow icon={Mail} label="Owner Email" value={store.owner?.email} />
              </div>
            </div>
          </div>

          {/* Business details */}
          <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
            <h2 className="mb-5 font-display text-base font-semibold text-slate-800">Business Details</h2>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <InfoRow icon={Clock} label="Business Hours" value={store.businessHours} />
              <ChipRow
                icon={Tag}
                label="Categories"
                items={store.categories}
                colorClass="bg-brand-50 text-brand-700"
              />
              <ChipRow
                icon={Package}
                label="Services / Products"
                items={store.services}
                colorClass="bg-accent-50 text-accent-600"
              />
            </div>
          </div>
        </div>
      )}

      {store && (
        <Modal title="Edit Store" isOpen={isEditOpen} onClose={() => setIsEditOpen(false)}>
          <StoreEditForm store={store} onSubmit={handleUpdate} onCancel={() => setIsEditOpen(false)} />
        </Modal>
      )}
    </div>
  );
}