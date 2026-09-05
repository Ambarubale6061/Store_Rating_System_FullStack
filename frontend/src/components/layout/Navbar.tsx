import { useNavigate } from 'react-router-dom';
import { LogOut, Star } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { RoleBadge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';

function getInitials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');
}

export function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-6">
      <div className="flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-600 to-accent-500 text-white">
          <Star className="h-4 w-4" fill="currentColor" />
        </span>
        <h1 className="font-display text-base font-bold tracking-tight text-slate-900">
          Store<span className="text-gradient-brand">Rate</span>
        </h1>
      </div>

      <div className="flex items-center gap-4">
        {user && (
          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold leading-tight text-slate-800">{user.name}</p>
              <div className="mt-0.5 flex justify-end">
                <RoleBadge role={user.role} />
              </div>
            </div>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-brand-100 to-accent-100 text-sm font-bold text-brand-700">
              {getInitials(user.name)}
            </span>
          </div>
        )}
        <Button variant="secondary" onClick={handleLogout}>
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </header>
  );
}
