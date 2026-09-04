import { NavLink } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface NavItem {
  to: string;
  label: string;
  icon: string;
}

const navByRole: Record<string, NavItem[]> = {
  ADMIN: [
    { to: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
    { to: '/admin/users', label: 'Users', icon: '👤' },
    { to: '/admin/stores', label: 'Stores', icon: '🏬' },
  ],
  USER: [{ to: '/user/stores', label: 'Stores', icon: '🏬' }],
  STORE_OWNER: [{ to: '/store-owner/dashboard', label: 'Dashboard', icon: '📊' }],
};

export function Sidebar() {
  const { user } = useAuth();
  const items = user ? navByRole[user.role] ?? [] : [];

  return (
    <aside className="w-56 shrink-0 border-r border-slate-200 bg-white">
      <nav className="flex flex-col gap-1 p-4">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                isActive ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-100'
              }`
            }
          >
            <span>{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
        <NavLink
          to="/change-password"
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              isActive ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-100'
            }`
          }
        >
          <span>🔒</span>
          Change Password
        </NavLink>
      </nav>
    </aside>
  );
}
