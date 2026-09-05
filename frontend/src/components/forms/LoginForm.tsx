import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Lock, LogIn, Mail } from 'lucide-react';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { useAuth } from '@/hooks/useAuth';
import { loginSchema, type LoginFormValues } from '@/utils/validationSchemas';

export function LoginForm() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (values: LoginFormValues) => {
    setIsSubmitting(true);
    try {
      await login(values);
      // If the user was redirected here from a protected route (e.g. typed
      // a dashboard URL directly while signed out), send them back there
      // instead of always dropping them on "/". Only ever a same-app path
      // supplied by our own ProtectedRoute — never an external URL.
      const from = (location.state as { from?: { pathname: string; search?: string } })?.from;
      navigate(from ? `${from.pathname}${from.search ?? ''}` : '/', { replace: true });
    } catch {
      // Error toast already shown by AuthContext.
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900">Welcome back</h1>
        <p className="mt-2 text-sm text-slate-500">Log in to access your dashboard.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          icon={<Mail className="h-4 w-4" />}
          {...register('email')}
          error={errors.email?.message}
        />
        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          icon={<Lock className="h-4 w-4" />}
          {...register('password')}
          error={errors.password?.message}
        />
        <Button type="submit" isLoading={isSubmitting} className="mt-2 h-11 w-full text-base">
          <LogIn className="h-4 w-4" />
          Log in
        </Button>
        <p className="text-center text-sm text-slate-500">
          Don&apos;t have an account?{' '}
          <Link to="/signup" className="font-semibold text-brand-600 hover:text-brand-700 hover:underline">
            Sign up for free
          </Link>
        </p>
      </form>
    </div>
  );
}
