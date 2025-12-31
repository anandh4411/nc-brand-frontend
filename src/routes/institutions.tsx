import { createFileRoute, Outlet, useLocation, useRouter } from "@tanstack/react-router";
import { useAuth } from "@/context/auth-context";
import { DashboardLayout } from "@/layouts/dashboard";
import { Loader2 } from "lucide-react";
import ForbiddenError from "@/features/errors/forbidden";
import { useEffect } from "react";

function InstitutionsLayoutRoute() {
  const location = useLocation();
  const router = useRouter();
  const { isAuthenticated, isLoading, userRole } = useAuth();
  const isLoginPage = location.pathname === "/institutions/login";

  useEffect(() => {
    // Redirect to institution login if not authenticated (skip for login page)
    if (!isLoginPage && !isLoading && !isAuthenticated) {
      router.navigate({ to: "/institutions/login" });
    }
  }, [isLoginPage, isAuthenticated, isLoading, router]);

  // Login page is public
  if (isLoginPage) {
    return <Outlet />;
  }

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  // Only institution users can access
  if (userRole !== "institution") {
    return <ForbiddenError />;
  }

  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  );
}

export const Route = createFileRoute("/institutions")({
  component: InstitutionsLayoutRoute,
});
