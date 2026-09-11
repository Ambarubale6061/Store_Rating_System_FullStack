import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { Input } from '@/components/common/Input';
import { Textarea } from '@/components/common/Textarea';
import { Button } from '@/components/common/Button';
import { updateStoreSchema, type UpdateStoreFormValues } from '@/utils/validationSchemas';
import { listToCommaString } from '@/utils/storeProfile';
import type { Store } from '@/types/store.types';

interface StoreEditFormProps {
  store: Store;
  onSubmit: (values: UpdateStoreFormValues) => Promise<void>;
  onCancel: () => void;
}

export function StoreEditForm({ store, onSubmit, onCancel }: StoreEditFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateStoreFormValues>({
    resolver: zodResolver(updateStoreSchema),
    defaultValues: {
      name: store.name,
      email: store.email,
      address: store.address,
      phone: store.phone ?? '',
      description: store.description ?? '',
      businessHours: store.businessHours ?? '',
      logoUrl: store.logoUrl ?? '',
      categories: listToCommaString(store.categories),
      services: listToCommaString(store.services),
    },
  });

  const submit = async (values: UpdateStoreFormValues) => {
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

      <div className="border-t border-slate-100 pt-4">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">Store profile</p>
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
        <Button type="submit" isLoading={isSubmitting}>
          Save changes
        </Button>
      </div>
    </form>
  );
}