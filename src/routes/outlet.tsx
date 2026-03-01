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
  const isSignInPage = location.pathname.startsWith("/outlet/sign-in");

  useEffect(() => {
    if (!isSignInPage && !isLoading && !isAuthenticated) {
      router.navigate({ to: "/outlet/sign-in" as any });
    }
  }, [isSignInPage, isAuthenticated, isLoading, router]);

  // Sign-in page is public
  if (isSignInPage) {
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
