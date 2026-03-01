import { createFileRoute } from "@tanstack/react-router";
import { useAuth } from "@/context/auth-context";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Package, AlertTriangle, Truck } from "lucide-react";
import { useOutletDashboard, useOutletInventory, useOutletShipments } from "@/api/hooks/outlet";
import type { OutletInventoryItem, OutletShipment } from "@/api/endpoints/outlet";
import { format } from "date-fns";

const getShipmentStatusVariant = (status: string) => {
  switch (status) {
    case "SHIPPED":
      return "default";
    case "PARTIALLY_RECEIVED":
      return "secondary";
    default:
      return "outline";
  }
};

const getShipmentStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    PENDING: "Pending",
    SHIPPED: "Shipped",
    PARTIALLY_RECEIVED: "Partial",
  };
  return labels[status] || status;
};

function OutletDashboard() {
  const { user } = useAuth();
  const outletName = user?.name || "NC Brand Outlet";

  const { data: dashboardResponse, isLoading: dashLoading } = useOutletDashboard();
  const { data: inventoryResponse } = useOutletInventory({ lowStockOnly: true, pageSize: 5 });
  const { data: shipmentsResponse } = useOutletShipments();

  const dashboard = (dashboardResponse?.data as any) || dashboardResponse?.data;
  const lowStockItems = (
    (inventoryResponse?.data as any)?.items || []
  ) as OutletInventoryItem[];
  const shipments = (
    (shipmentsResponse?.data as any) || shipmentsResponse?.data || []
  ) as OutletShipment[];

  const pendingShipments = shipments.filter(
    (s) => s.status === "PENDING" || s.status === "SHIPPED" || s.status === "PARTIALLY_RECEIVED"
  );

  if (dashLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {outletName}</p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-28" />
          ))}
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, {outletName}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Stock
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(dashboard?.inventory?.totalQuantity ?? 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {dashboard?.inventory?.totalItems ?? 0} unique items
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Low Stock Items
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500">
              {dashboard?.inventory?.lowStock ?? 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Requires immediate attention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Incoming Shipments
            </CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(dashboard?.shipments?.pending ?? 0) +
                (dashboard?.shipments?.shipped ?? 0)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {dashboard?.shipments?.shipped ?? 0} shipped,{" "}
              {dashboard?.shipments?.pending ?? 0} pending
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row - Alerts and Shipments */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Low Stock Alerts */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Low Stock Alerts</CardTitle>
              <Badge variant="destructive" className="text-xs">
                {lowStockItems.length} items
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {lowStockItems.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No low stock items
              </p>
            ) : (
              lowStockItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between text-sm"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-medium truncate">
                      {item.productName} - {item.colorName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {item.sku} · {item.size}
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className="ml-2 text-orange-500 border-orange-500"
                  >
                    {item.quantity} left
                  </Badge>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Incoming Shipments */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Incoming Shipments</CardTitle>
              <Badge variant="secondary" className="text-xs">
                {pendingShipments.length} active
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {pendingShipments.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No incoming shipments
              </p>
            ) : (
              pendingShipments.slice(0, 5).map((shipment) => (
                <div
                  key={shipment.id}
                  className="flex items-center justify-between text-sm"
                >
                  <div>
                    <p className="font-medium font-mono">
                      SHP-{String(shipment.id).padStart(4, "0")}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {shipment.items.reduce((sum, i) => sum + i.quantity, 0)}{" "}
                      items
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge
                      variant={getShipmentStatusVariant(shipment.status)}
                      className="text-xs"
                    >
                      {getShipmentStatusLabel(shipment.status)}
                    </Badge>
                    {shipment.shippedAt && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Shipped{" "}
                        {format(new Date(shipment.shippedAt), "MMM dd")}
                      </p>
                    )}
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/outlet/")({
  component: OutletDashboard,
});
