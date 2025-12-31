import { createFileRoute, Outlet, useLocation, useRouter } from "@tanstack/react-router";
import { useAuth } from "@/context/auth-context";
import { OutletLayout } from "@/layouts/outlet";
import { Loader2 } from "lucide-react";
import ForbiddenError from "@/features/errors/forbidden";
import { useEffect } from "react";

function OutletLayoutRoute() {
  const location = useLocation();
  const router = useRouter();
  const { isAuthenticated, isLoading, userRole } = useAuth();
  const isLoginPage = location.pathname === "/outlet/login";

  useEffect(() => {
    // Redirect to outlet login if not authenticated (skip for login page)
    if (!isLoginPage && !isLoading && !isAuthenticated) {
      router.navigate({ to: "/outlet/login" });
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

  // Only outlet users can access
  if (userRole !== "outlet") {
    return <ForbiddenError />;
  }

  return (
    <OutletLayout>
      <Outlet />
    </OutletLayout>
  );
}

export const Route = createFileRoute("/outlet")({
  component: OutletLayoutRoute,
});
