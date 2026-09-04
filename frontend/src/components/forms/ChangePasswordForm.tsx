import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { authService } from '@/services/authService';
import { extractErrorMessage } from '@/services/apiClient';
import { changePasswordSchema, type ChangePasswordFormValues } from '@/utils/validationSchemas';

export function ChangePasswordForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordFormValues>({ resolver: zodResolver(changePasswordSchema) });

  const onSubmit = async (values: ChangePasswordFormValues) => {
    setIsSubmitting(true);
    try {
      await authService.changePassword(values);
      toast.success('Password changed successfully.');
      reset();
    } catch (err) {
      toast.error(extractErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex max-w-md flex-col gap-4">
      <Input label="Current password" type="password" {...register('oldPassword')} error={errors.oldPassword?.message} />
      <Input
        label="New password"
        type="password"
        placeholder="8-16 chars, 1 uppercase, 1 special"
        {...register('newPassword')}
        error={errors.newPassword?.message}
      />
      <Button type="submit" isLoading={isSubmitting} className="w-fit">
        Update password
      </Button>
    </form>
  );
}
