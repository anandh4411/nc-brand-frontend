import { createFileRoute } from '@tanstack/react-router';
import { InstitutionLogin } from '@/features/auth/components/institution-login';

export const Route = createFileRoute('/institutions/login/')({
  component: InstitutionLoginPage,
});

function InstitutionLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <InstitutionLogin />
    </div>
  );
}
