import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { PageLoader } from '@/components/common/PageLoader';

/** Sends an authenticated user to the default landing page for their role. */
export function RoleRedirect() {
  const { user, isLoading } = useAuth();

  if (isLoading) return <PageLoader />;
  if (!user) return <Navigate to="/login" replace />;

  switch (user.role) {
    case 'ADMIN':
      return <Navigate to="/admin/dashboard" replace />;
    case 'STORE_OWNER':
      return <Navigate to="/store-owner/dashboard" replace />;
    default:
      return <Navigate to="/user/stores" replace />;
  }
}
