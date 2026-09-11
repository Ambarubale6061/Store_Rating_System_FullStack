import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { Input } from '@/components/common/Input';
import { Textarea } from '@/components/common/Textarea';
import { Button } from '@/components/common/Button';
import { createStoreSchema, type CreateStoreFormValues } from '@/utils/validationSchemas';
import type { AdminUser } from '@/types/user.types';

interface StoreFormProps {
  storeOwners: AdminUser[];
  onSubmit: (values: CreateStoreFormValues) => Promise<void>;
  onCancel: () => void;
}

export function StoreForm({ storeOwners, onSubmit, onCancel }: StoreFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateStoreFormValues>({ resolver: zodResolver(createStoreSchema) });

  const submit = async (values: CreateStoreFormValues) => {
    setIsSubmitting(true);
    try {
      await onSubmit(values);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="flex max-h-[70vh] flex-col gap-4 overflow-y-auto pr-1">
      <Input label="Store name" placeholder="20-60 characters" {...register('name')} error={errors.name?.message} />
      <Input label="Store email" type="email" {...register('email')} error={errors.email?.message} />
      <Input label="Store address" placeholder="Up to 400 characters" {...register('address')} error={errors.address?.message} />
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-slate-700" htmlFor="ownerId">
          Store owner
        </label>
        <select
          id="ownerId"
          {...register('ownerId')}
          defaultValue=""
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
        >
          <option value="" disabled>
            Select a store owner...
          </option>
          {storeOwners.map((owner) => (
            <option key={owner.id} value={owner.id}>
              {owner.name} ({owner.email})
            </option>
          ))}
        </select>
        {errors.ownerId && <p className="text-xs text-red-600">{errors.ownerId.message}</p>}
        {storeOwners.length === 0 && (
          <p className="text-xs text-slate-500">
            No STORE_OWNER accounts exist yet — create one from the Users page first.
          </p>
        )}
      </div>

      <div className="border-t border-slate-100 pt-4">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
          Store profile (optional)
        </p>
        <div className="flex flex-col gap-4">
          <Input label="Phone" placeholder="+1-555-0100" {...register('phone')} error={errors.phone?.message} />
          <Textarea
            label="Description"
            placeholder="What makes this store worth visiting?"
            {...register('description')}
            error={errors.description?.message}
          />
          <Input
            label="Business hours"
            placeholder="Mon-Sat: 9:00 AM - 6:00 PM"
            {...register('businessHours')}
            error={errors.businessHours?.message}
          />
          <Input
            label="Logo URL"
            placeholder="https://example.com/logo.png"
            {...register('logoUrl')}
            error={errors.logoUrl?.message}
          />
          <Input
            label="Categories"
            placeholder="Bakery, Cafe"
            helperText="Comma-separated"
            {...register('categories')}
            error={errors.categories?.message}
          />
          <Input
            label="Services / Products"
            placeholder="Custom Cakes, Coffee, Catering"
            helperText="Comma-separated"
            {...register('services')}
            error={errors.services?.message}
          />
        </div>
      </div>

      <div className="mt-2 flex justify-end gap-2 border-t border-slate-100 pt-4">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isSubmitting} disabled={storeOwners.length === 0}>
          Create store
        </Button>
      </div>
    </form>
  );
}