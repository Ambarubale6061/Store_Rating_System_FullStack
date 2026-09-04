import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { useAuth } from '@/hooks/useAuth';
import { signupSchema, type SignupFormValues } from '@/utils/validationSchemas';

export function SignupForm() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormValues>({ resolver: zodResolver(signupSchema) });

  const onSubmit = async (values: SignupFormValues) => {
    setIsSubmitting(true);
    try {
      await signup(values);
      navigate('/', { replace: true });
    } catch {
      // Error toast already shown by AuthContext.
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <Input label="Full name" placeholder="20-60 characters" {...register('name')} error={errors.name?.message} />
      <Input label="Email" type="email" placeholder="you@example.com" {...register('email')} error={errors.email?.message} />
      <Input label="Address" placeholder="Up to 400 characters" {...register('address')} error={errors.address?.message} />
      <Input
        label="Password"
        type="password"
        placeholder="8-16 chars, 1 uppercase, 1 special"
        {...register('password')}
        error={errors.password?.message}
      />
      <Button type="submit" isLoading={isSubmitting} className="mt-2 w-full">
        Create account
      </Button>
      <p className="text-center text-sm text-slate-500">
        Already have an account?{' '}
        <Link to="/login" className="font-medium text-indigo-600 hover:underline">
          Log in
        </Link>
      </p>
    </form>
  );
}
