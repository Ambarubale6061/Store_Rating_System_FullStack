import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { RoleBadge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';

export function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6">
      <h1 className="text-lg font-semibold text-slate-800">Store Rating System</h1>
      <div className="flex items-center gap-4">
        {user && (
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <span className="font-medium">{user.name}</span>
            <RoleBadge role={user.role} />
          </div>
        )}
        <Button variant="secondary" onClick={handleLogout}>
          Logout
        </Button>
      </div>
    </header>
  );
}
