import { createFileRoute, Outlet, useLocation, useRouter } from "@tanstack/react-router";
import { useAuth } from "@/context/auth-context";
import { AdminLayout } from "@/layouts/admin";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";

function AdminLayoutRoute() {
  const location = useLocation();
  const router = useRouter();
  const { isAuthenticated, isLoading, userRole } = useAuth();

  const isSignInPage = location.pathname.startsWith("/admin/sign-in");

  useEffect(() => {
    if (isLoading) return;
    if (!isSignInPage && !isAuthenticated) {
      router.navigate({ to: "/admin/sign-in" as any });
    }
  }, [isLoading, isAuthenticated, isSignInPage, router]);

  if (isSignInPage) return <Outlet />;

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <AdminLayout>
      <Outlet />
    </AdminLayout>
  );
}

export const Route = createFileRoute("/admin")({
  component: AdminLayoutRoute,
});
