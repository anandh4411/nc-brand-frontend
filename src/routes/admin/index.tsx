import { createFileRoute } from "@tanstack/react-router";

function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Manufacturing Unit Overview
        </p>
      </div>

      {/* Stats Cards Placeholder */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border bg-card p-6">
          <div className="text-sm font-medium text-muted-foreground">
            Total Outlets
          </div>
          <div className="text-2xl font-bold">0</div>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <div className="text-sm font-medium text-muted-foreground">
            Total Products
          </div>
          <div className="text-2xl font-bold">0</div>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <div className="text-sm font-medium text-muted-foreground">
            Pending Orders
          </div>
          <div className="text-2xl font-bold">0</div>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <div className="text-sm font-medium text-muted-foreground">
            Low Stock Items
          </div>
          <div className="text-2xl font-bold">0</div>
        </div>
      </div>

      {/* Placeholder for charts and recent activity */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border bg-card p-6">
          <h3 className="font-semibold mb-4">Recent Orders</h3>
          <p className="text-muted-foreground text-sm">No orders yet</p>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <h3 className="font-semibold mb-4">Outlet Performance</h3>
          <p className="text-muted-foreground text-sm">No data available</p>
        </div>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
});
