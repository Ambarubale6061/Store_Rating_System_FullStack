import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { createUserSchema, type CreateUserFormValues } from '@/utils/validationSchemas';

interface UserFormProps {
  onSubmit: (values: CreateUserFormValues) => Promise<void>;
  onCancel: () => void;
}

export function UserForm({ onSubmit, onCancel }: UserFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateUserFormValues>({
    resolver: zodResolver(createUserSchema),
    defaultValues: { role: 'USER' },
  });

  const submit = async (values: CreateUserFormValues) => {
    setIsSubmitting(true);
    try {
      await onSubmit(values);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="flex flex-col gap-4">
      <Input label="Full name" placeholder="20-60 characters" {...register('name')} error={errors.name?.message} />
      <Input label="Email" type="email" {...register('email')} error={errors.email?.message} />
      <Input label="Address" placeholder="Up to 400 characters" {...register('address')} error={errors.address?.message} />
      <Input
        label="Password"
        type="password"
        placeholder="8-16 chars, 1 uppercase, 1 special"
        {...register('password')}
        error={errors.password?.message}
      />
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-slate-700" htmlFor="role">
          Role
        </label>
        <select
          id="role"
          {...register('role')}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
        >
          <option value="USER">User</option>
          <option value="ADMIN">Admin</option>
          <option value="STORE_OWNER">Store Owner</option>
        </select>
        {errors.role && <p className="text-xs text-red-600">{errors.role.message}</p>}
      </div>
      <div className="mt-2 flex justify-end gap-2">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isSubmitting}>
          Create user
        </Button>
      </div>
    </form>
  );
}
