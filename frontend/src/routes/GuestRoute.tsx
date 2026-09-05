import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { PageLoader } from '@/components/common/PageLoader';

/**
 * Guards routes that only make sense for signed-out visitors (login, signup).
 * An already-authenticated user hitting these URLs directly is sent to "/"
 * (which routes them to their role's dashboard) instead of seeing the auth
 * forms again — closing off another way protected/authenticated state could
 * be bypassed or re-triggered via a direct URL.
 */
export function GuestRoute() {
  const { user, isLoading } = useAuth();

  if (isLoading) return <PageLoader />;
  if (user) return <Navigate to="/" replace />;

  return <Outlet />;
}
