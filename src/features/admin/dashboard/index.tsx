// src/features/admin/dashboard/index.tsx
import {
  Store,
  Package,
  ShoppingCart,
  AlertTriangle,
  TrendingUp,
  Truck,
  IndianRupee,
  Users,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";

// Mock dashboard data
const dashboardStats = {
  totalOutlets: 6,
  activeOutlets: 5,
  totalProducts: 4,
  activeProducts: 3,
  totalOrders: 5,
  pendingOrders: 1,
  processingOrders: 2,
  lowStockItems: 3,
  pendingShipments: 2,
  totalRevenue: 99377,
  monthlyRevenue: 73727,
};

const recentOrders = [
  { id: "TXH-2024-0004", customer: "Meera Krishnan", status: "pending", total: 17700 },
  { id: "TXH-2024-0003", customer: "Arjun Sharma", status: "processing", total: 53100 },
  { id: "TXH-2024-0002", customer: "Lakshmi Devi", status: "shipped", total: 2927 },
  { id: "TXH-2024-0001", customer: "Priya Kumar", status: "delivered", total: 17700 },
];

const lowStockItems = [
  { sku: "KUR-BLU-M", name: "Cotton Casual Kurti", color: "Royal Blue", size: "M", qty: 8 },
  { sku: "KUR-BLU-XL", name: "Cotton Casual Kurti", color: "Royal Blue", size: "XL", qty: 3 },
  { sku: "LEH-GLD-L", name: "Banarasi Wedding Lehenga", color: "Gold", size: "L", qty: 2 },
];

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "delivered": return "default";
    case "shipped":
    case "processing": return "secondary";
    case "pending": return "outline";
    default: return "outline";
  }
};

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-medium tracking-tight text-foreground">
          Dashboard
        </h1>
        <p className="text-muted-foreground">
          Welcome to NC Brand Admin. Here's an overview of your business.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Outlets</CardTitle>
            <Store className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.activeOutlets}</div>
            <p className="text-xs text-muted-foreground">
              of {dashboardStats.totalOutlets} total outlets
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.activeProducts}</div>
            <p className="text-xs text-muted-foreground">
              {dashboardStats.totalProducts} in catalog
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.totalOrders}</div>
            <p className="text-xs text-muted-foreground">
              {dashboardStats.pendingOrders} pending, {dashboardStats.processingOrders} processing
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <IndianRupee className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPrice(dashboardStats.monthlyRevenue)}</div>
            <p className="text-xs text-muted-foreground">
              This month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Alerts Row */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Low Stock Alert */}
        {dashboardStats.lowStockItems > 0 && (
          <Card className="border-destructive/50">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-destructive" />
                  <CardTitle className="text-sm font-medium text-destructive">
                    Low Stock Alert
                  </CardTitle>
                </div>
                <Badge variant="destructive">{dashboardStats.lowStockItems}</Badge>
              </div>
              <CardDescription>
                Items below threshold requiring attention
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {lowStockItems.map((item) => (
                <div
                  key={item.sku}
                  className="flex items-center justify-between text-sm py-2 border-b last:border-0"
                >
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.color} / {item.size}
                    </p>
                  </div>
                  <Badge variant="destructive">{item.qty} left</Badge>
                </div>
              ))}
              <Button variant="outline" size="sm" className="w-full mt-2" asChild>
                <Link to="/admin/inventory">View Inventory</Link>
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Pending Shipments */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Truck className="h-4 w-4 text-muted-foreground" />
                <CardTitle className="text-sm font-medium">Pending Shipments</CardTitle>
              </div>
              <Badge variant="secondary">{dashboardStats.pendingShipments}</Badge>
            </div>
            <CardDescription>
              Shipments awaiting dispatch to outlets
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between py-4">
              <p className="text-3xl font-bold">{dashboardStats.pendingShipments}</p>
              <Button variant="outline" size="sm" asChild>
                <Link to="/admin/shipments">View All</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>Latest customer orders</CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link to="/admin/orders">View All</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentOrders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between py-2 border-b last:border-0"
              >
                <div className="flex items-center gap-4">
                  <div>
                    <p className="font-medium font-mono">{order.id}</p>
                    <p className="text-sm text-muted-foreground">{order.customer}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Badge variant={getStatusColor(order.status) as any} className="capitalize">
                    {order.status}
                  </Badge>
                  <span className="font-mono font-medium">{formatPrice(order.total)}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks and shortcuts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex-col gap-2" asChild>
              <Link to="/admin/products">
                <Package className="h-5 w-5" />
                <span>Add Product</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2" asChild>
              <Link to="/admin/shipments">
                <Truck className="h-5 w-5" />
                <span>Create Shipment</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2" asChild>
              <Link to="/admin/outlets">
                <Store className="h-5 w-5" />
                <span>Add Outlet</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2" asChild>
              <Link to="/admin/inventory">
                <AlertTriangle className="h-5 w-5" />
                <span>Check Stock</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
