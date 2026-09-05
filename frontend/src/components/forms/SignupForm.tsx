import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Home, Lock, Mail, User, UserPlus } from 'lucide-react';
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
    <div>
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900">Create your account</h1>
        <p className="mt-2 text-sm text-slate-500">Join StoreRate and start rating stores in minutes.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <Input
          label="Full name"
          placeholder="20-60 characters"
          icon={<User className="h-4 w-4" />}
          {...register('name')}
          error={errors.name?.message}
        />
        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          icon={<Mail className="h-4 w-4" />}
          {...register('email')}
          error={errors.email?.message}
        />
        <Input
          label="Address"
          placeholder="Up to 400 characters"
          icon={<Home className="h-4 w-4" />}
          {...register('address')}
          error={errors.address?.message}
        />
        <Input
          label="Password"
          type="password"
          placeholder="8-16 chars, 1 uppercase, 1 special"
          icon={<Lock className="h-4 w-4" />}
          {...register('password')}
          error={errors.password?.message}
        />
        <Button type="submit" isLoading={isSubmitting} className="mt-2 h-11 w-full text-base">
          <UserPlus className="h-4 w-4" />
          Create account
        </Button>
        <p className="text-center text-sm text-slate-500">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-brand-600 hover:text-brand-700 hover:underline">
            Log in
          </Link>
        </p>
      </form>
    </div>
  );
}
