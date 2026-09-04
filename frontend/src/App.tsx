import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/context/AuthContext';
import { ProtectedRoute } from '@/routes/ProtectedRoute';
import { RoleProtectedRoute } from '@/routes/RoleProtectedRoute';
import { AuthLayout } from '@/layouts/AuthLayout';
import { DashboardLayout } from '@/layouts/DashboardLayout';

import { LoginPage } from '@/pages/auth/LoginPage';
import { SignupPage } from '@/pages/auth/SignupPage';
import { RoleRedirect } from '@/pages/RoleRedirect';
import { ChangePasswordPage } from '@/pages/ChangePasswordPage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { UnauthorizedPage } from '@/pages/UnauthorizedPage';

import { AdminDashboardPage } from '@/pages/admin/AdminDashboardPage';
import { AdminUsersPage } from '@/pages/admin/AdminUsersPage';
import { AdminUserDetailPage } from '@/pages/admin/AdminUserDetailPage';
import { AdminStoresPage } from '@/pages/admin/AdminStoresPage';

import { UserStoresPage } from '@/pages/user/UserStoresPage';
import { StoreOwnerDashboardPage } from '@/pages/storeOwner/StoreOwnerDashboardPage';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public auth routes */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
          </Route>

          <Route path="/unauthorized" element={<UnauthorizedPage />} />

          {/* Any authenticated role */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<RoleRedirect />} />

            <Route element={<DashboardLayout />}>
              <Route path="/change-password" element={<ChangePasswordPage />} />

              {/* Admin-only */}
              <Route element={<RoleProtectedRoute allowedRoles={['ADMIN']} />}>
                <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
                <Route path="/admin/users" element={<AdminUsersPage />} />
                <Route path="/admin/users/:id" element={<AdminUserDetailPage />} />
                <Route path="/admin/stores" element={<AdminStoresPage />} />
              </Route>

              {/* User-only */}
              <Route element={<RoleProtectedRoute allowedRoles={['USER']} />}>
                <Route path="/user/stores" element={<UserStoresPage />} />
              </Route>

              {/* Store Owner-only */}
              <Route element={<RoleProtectedRoute allowedRoles={['STORE_OWNER']} />}>
                <Route path="/store-owner/dashboard" element={<StoreOwnerDashboardPage />} />
              </Route>
            </Route>
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>

        <Toaster position="top-right" />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
