import { createFileRoute } from "@tanstack/react-router";
import { useAuth } from "@/context/auth-context";

function OutletDashboard() {
  const { user } = useAuth();
  const outletName = user?.outletName || "Outlet";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to {outletName}
        </p>
      </div>

      {/* Stats Cards Placeholder */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border bg-card p-6">
          <div className="text-sm font-medium text-muted-foreground">
            Total Stock
          </div>
          <div className="text-2xl font-bold">0</div>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <div className="text-sm font-medium text-muted-foreground">
            Low Stock Items
          </div>
          <div className="text-2xl font-bold">0</div>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <div className="text-sm font-medium text-muted-foreground">
            Pending Shipments
          </div>
          <div className="text-2xl font-bold">0</div>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <div className="text-sm font-medium text-muted-foreground">
            Today's Sales
          </div>
          <div className="text-2xl font-bold">₹0</div>
        </div>
      </div>

      {/* Placeholder for activity and alerts */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border bg-card p-6">
          <h3 className="font-semibold mb-4">Incoming Shipments</h3>
          <p className="text-muted-foreground text-sm">No pending shipments</p>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <h3 className="font-semibold mb-4">Low Stock Alerts</h3>
          <p className="text-muted-foreground text-sm">All stock levels normal</p>
        </div>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/outlet/")({
  component: OutletDashboard,
});
