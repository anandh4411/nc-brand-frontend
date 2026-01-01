import { createFileRoute, Link } from "@tanstack/react-router";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { ShoppingCart, MapPin, Star, Heart, User } from "lucide-react";

function AccountDashboard() {
  const { user } = useAuth();

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
              <div className="text-2xl font-bold">0</div>
              <div className="text-sm text-muted-foreground">Total Orders</div>
            </div>
          </div>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-primary/10 p-3">
              <Heart className="h-5 w-5 text-primary" />
            </div>
            <div>
              <div className="text-2xl font-bold">0</div>
              <div className="text-sm text-muted-foreground">Wishlist Items</div>
            </div>
          </div>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-primary/10 p-3">
              <Star className="h-5 w-5 text-primary" />
            </div>
            <div>
              <div className="text-2xl font-bold">0</div>
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
              <div className="text-2xl font-bold">0</div>
              <div className="text-sm text-muted-foreground">Addresses</div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border bg-card p-6">
          <h3 className="font-semibold mb-4">Recent Orders</h3>
          <p className="text-muted-foreground text-sm mb-4">
            You haven't placed any orders yet.
          </p>
          <Button variant="outline" size="sm" asChild>
            <Link to="/shop/products">Start Shopping</Link>
          </Button>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <h3 className="font-semibold mb-4">Account Settings</h3>
          <p className="text-muted-foreground text-sm mb-4">
            Manage your profile and preferences.
          </p>
          <Button variant="outline" size="sm" asChild>
            <Link to="/dashboard/settings">
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
