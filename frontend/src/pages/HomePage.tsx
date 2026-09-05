import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { PageLoader } from '@/components/common/PageLoader';
import { LandingPage } from './LandingPage';

/**
 * Root route ("/"). Signed-in visitors are sent straight to their role's
 * dashboard; everyone else sees the public marketing landing page. This
 * only decides what renders at "/" — it doesn't change how login/signup/
 * protected routes work anywhere else in the app.
 */
export function HomePage() {
  const { user, isLoading } = useAuth();

  if (isLoading) return <PageLoader />;

  if (user) {
    switch (user.role) {
      case 'ADMIN':
        return <Navigate to="/admin/dashboard" replace />;
      case 'STORE_OWNER':
        return <Navigate to="/store-owner/dashboard" replace />;
      default:
        return <Navigate to="/user/stores" replace />;
    }
  }

  return <LandingPage />;
}
