import { createFileRoute, Outlet } from "@tanstack/react-router";
import { useAuthGuard } from "@/guards/useAuthGuard";
import { useRoleGuard } from "@/guards/useRoleGuard";
import { DashboardLayout } from "@/layouts/dashboard";
import { Loader2 } from "lucide-react";

function DashboardLayoutRoute() {
  const { isAuthenticated, isLoading: authLoading } = useAuthGuard();
  const { isLoading: roleLoading } = useRoleGuard(["admin"]);

  // Show loading spinner while checking auth and role
  if (authLoading || roleLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // If not authenticated, guard will redirect to /sign-in
  // If not admin role, useRoleGuard will redirect to /institutions/dashboard
  if (!isAuthenticated) {
    return null;
  }

  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  );
}

export const Route = createFileRoute("/dashboard")({
  component: DashboardLayoutRoute,
});
