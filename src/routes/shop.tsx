import { createFileRoute, Outlet } from "@tanstack/react-router";
import { StorefrontLayout } from "@/layouts/storefront";

/**
 * Shop layout route - Public, no authentication required
 */
function ShopLayoutRoute() {
  return (
    <StorefrontLayout>
      <Outlet />
    </StorefrontLayout>
  );
}

export const Route = createFileRoute("/shop")({
  component: ShopLayoutRoute,
});
