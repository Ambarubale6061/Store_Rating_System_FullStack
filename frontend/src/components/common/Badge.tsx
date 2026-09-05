const roleColors: Record<string, string> = {
  ADMIN: 'bg-purple-100 text-purple-700 ring-1 ring-purple-200',
  USER: 'bg-blue-100 text-blue-700 ring-1 ring-blue-200',
  STORE_OWNER: 'bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200',
};

export function RoleBadge({ role }: { role: string }) {
  return (
    <span className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${roleColors[role] ?? 'bg-slate-100 text-slate-700 ring-1 ring-slate-200'}`}>
      {role.replace('_', ' ')}
    </span>
  );
}
