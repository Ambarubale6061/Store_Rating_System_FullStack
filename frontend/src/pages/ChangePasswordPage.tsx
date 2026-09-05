import { ChangePasswordForm } from '@/components/forms/ChangePasswordForm';

export function ChangePasswordPage() {
  return (
    <div>
      <div className="mb-8">
        <h2 className="font-display text-2xl font-bold tracking-tight text-slate-900">Change Password</h2>
        <p className="mt-1 text-sm text-slate-500">Update the password used to log in to your account.</p>
      </div>
      <ChangePasswordForm />
    </div>
  );
}
