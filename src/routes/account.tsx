import { createFileRoute, Outlet } from "@tanstack/react-router";
import { useAuthGuard } from "@/guards/useAuthGuard";
import { useRoleGuard } from "@/guards/useRoleGuard";
import { AccountLayout } from "@/layouts/account";
import { Loader2 } from "lucide-react";

function AccountLayoutRoute() {
  const { isAuthenticated, isLoading: authLoading } = useAuthGuard();
  const { isLoading: roleLoading } = useRoleGuard(["customer"]);

  // Show loading spinner while checking auth and role
  if (authLoading || roleLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // If not authenticated, guard will redirect to sign-in
  if (!isAuthenticated) {
    return null;
  }

  return (
    <AccountLayout>
      <Outlet />
    </AccountLayout>
  );
}

export const Route = createFileRoute("/account")({
  component: AccountLayoutRoute,
});
