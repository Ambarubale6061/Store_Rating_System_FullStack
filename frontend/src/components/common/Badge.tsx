const roleColors: Record<string, string> = {
  ADMIN: 'bg-purple-100 text-purple-700',
  USER: 'bg-blue-100 text-blue-700',
  STORE_OWNER: 'bg-emerald-100 text-emerald-700',
};

export function RoleBadge({ role }: { role: string }) {
  return (
    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${roleColors[role] ?? 'bg-slate-100 text-slate-700'}`}>
      {role.replace('_', ' ')}
    </span>
  );
}
