import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { PageLoader } from '@/components/common/PageLoader';
import { LandingPage } from './LandingPage';

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
