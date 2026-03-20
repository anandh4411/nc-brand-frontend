import { createFileRoute, Link } from "@tanstack/react-router";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ShoppingCart, MapPin, Star, Heart, User, Package } from "lucide-react";
import { useCustomerOrders, useAddresses } from "@/api/hooks/shop";

function AccountDashboard() {
  const { user } = useAuth();
  const { data: ordersData, isLoading: ordersLoading } = useCustomerOrders();
  // const { data: wishlistData, isLoading: wishlistLoading } = useWishlist(); // Wishlist disabled - has bugs
  const { data: addressesData, isLoading: addressesLoading } = useAddresses();

  const orders = (ordersData?.data || []) as any[];
  const addresses = (addressesData?.data || []) as any[];

  const recentOrders = orders.slice(0, 3);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">My Account</h1>
        <p className="text-muted-foreground">
          Welcome back, {user?.name || "Customer"}!
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-primary/10 p-3">
              <ShoppingCart className="h-5 w-5 text-primary" />
            </div>
            <div>
              {ordersLoading ? (
                <Skeleton className="h-8 w-12" />
              ) : (
                <div className="text-2xl font-bold">{orders.length}</div>
              )}
              <div className="text-sm text-muted-foreground">Total Orders</div>
            </div>
          </div>
        </div>
        {/* Wishlist stat card disabled - has bugs */}
        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-primary/10 p-3">
              <Star className="h-5 w-5 text-primary" />
            </div>
            <div>
              <div className="text-2xl font-bold">-</div>
              <div className="text-sm text-muted-foreground">Reviews</div>
            </div>
          </div>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-primary/10 p-3">
              <MapPin className="h-5 w-5 text-primary" />
            </div>
            <div>
              {addressesLoading ? (
                <Skeleton className="h-8 w-12" />
              ) : (
                <div className="text-2xl font-bold">{addresses.length}</div>
              )}
              <div className="text-sm text-muted-foreground">Addresses</div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border bg-card p-6">
          <h3 className="font-semibold mb-4">Recent Orders</h3>
          {ordersLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : recentOrders.length > 0 ? (
            <div className="space-y-3">
              {recentOrders.map((order: any) => (
                <div key={order.uuid} className="flex items-center justify-between p-2 rounded-md bg-muted/50">
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">{order.orderNumber}</p>
                      <p className="text-xs text-muted-foreground">{order.status}</p>
                    </div>
                  </div>
                  <span className="text-sm font-medium">{formatPrice(order.total)}</span>
                </div>
              ))}
              <Button variant="outline" size="sm" className="w-full mt-2" asChild>
                <Link to="/account/orders">View All Orders</Link>
              </Button>
            </div>
          ) : (
            <>
              <p className="text-muted-foreground text-sm mb-4">
                You haven't placed any orders yet.
              </p>
              <Button variant="outline" size="sm" asChild>
                <Link to="/shop">Start Shopping</Link>
              </Button>
            </>
          )}
        </div>
        <div className="rounded-lg border bg-card p-6">
          <h3 className="font-semibold mb-4">Account Settings</h3>
          <p className="text-muted-foreground text-sm mb-4">
            Manage your profile and preferences.
          </p>
          <Button variant="outline" size="sm" asChild>
            <Link to="/account/settings">
              <User className="mr-2 h-4 w-4" />
              Edit Profile
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/account/")({
  component: AccountDashboard,
});
