import { NavLink } from 'react-router-dom';
import { KeyRound, LayoutDashboard, Store, Users } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface NavItem {
  to: string;
  label: string;
  icon: typeof LayoutDashboard;
}

const navByRole: Record<string, NavItem[]> = {
  ADMIN: [
    { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/admin/users', label: 'Users', icon: Users },
    { to: '/admin/stores', label: 'Stores', icon: Store },
  ],
  USER: [{ to: '/user/stores', label: 'Stores', icon: Store }],
  STORE_OWNER: [{ to: '/store-owner/dashboard', label: 'Dashboard', icon: LayoutDashboard }],
};

export function Sidebar() {
  const { user } = useAuth();
  const items = user ? navByRole[user.role] ?? [] : [];

  const linkClasses = (isActive: boolean) =>
    `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
      isActive
        ? 'bg-gradient-to-r from-brand-50 to-accent-50 text-brand-700 shadow-sm ring-1 ring-brand-100'
        : 'text-slate-600 hover:bg-slate-100'
    }`;

  return (
    <aside className="flex w-60 shrink-0 flex-col border-r border-slate-200 bg-white">
      <nav className="flex flex-1 flex-col gap-1 p-4">
        <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">Menu</p>
        {items.map((item) => (
          <NavLink key={item.to} to={item.to} className={({ isActive }) => linkClasses(isActive)}>
            <item.icon className="h-4 w-4" />
            {item.label}
          </NavLink>
        ))}

        <p className="mb-2 mt-6 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">Account</p>
        <NavLink to="/change-password" className={({ isActive }) => linkClasses(isActive)}>
          <KeyRound className="h-4 w-4" />
          Change Password
        </NavLink>
      </nav>
    </aside>
  );
}
