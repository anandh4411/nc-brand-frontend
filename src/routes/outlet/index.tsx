import { createFileRoute } from "@tanstack/react-router";
import { useAuth } from "@/context/auth-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Package,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Truck,
  IndianRupee,
  ShoppingBag,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Area, AreaChart, Bar, BarChart, XAxis, YAxis, CartesianGrid } from "recharts";

// Mock data for charts
const salesData = [
  { month: "Jan", sales: 45000 },
  { month: "Feb", sales: 52000 },
  { month: "Mar", sales: 48000 },
  { month: "Apr", sales: 61000 },
  { month: "May", sales: 55000 },
  { month: "Jun", sales: 67000 },
  { month: "Jul", sales: 72000 },
];

const categoryData = [
  { category: "Sarees", value: 35 },
  { category: "Kurtis", value: 25 },
  { category: "Lehengas", value: 20 },
  { category: "Dress Mat.", value: 12 },
  { category: "Others", value: 8 },
];

const salesChartConfig = {
  sales: {
    label: "Sales",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

const categoryChartConfig = {
  value: {
    label: "Stock %",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

// Mock stats
const stats = {
  totalStock: 1247,
  stockChange: 12,
  lowStockItems: 8,
  pendingShipments: 3,
  todaySales: 24500,
  salesChange: 18,
  totalOrders: 156,
  ordersChange: -5,
};

// Mock low stock items
const lowStockItems = [
  { name: "Banarasi Silk Saree - Royal Blue", sku: "BSS-001-RB", stock: 2, threshold: 5 },
  { name: "Cotton Casual Kurti - Maroon", sku: "CCK-023-MR", stock: 3, threshold: 10 },
  { name: "Chiffon Printed Saree - Pink", sku: "CPS-045-PK", stock: 1, threshold: 5 },
];

// Mock pending shipments
const pendingShipments = [
  { id: "SHP-001", items: 45, status: "in_transit", eta: "Today" },
  { id: "SHP-002", items: 32, status: "dispatched", eta: "Tomorrow" },
  { id: "SHP-003", items: 28, status: "processing", eta: "2 days" },
];

// Mock recent sales
const recentSales = [
  { id: "ORD-156", customer: "Priya Sharma", amount: 4599, items: 2, time: "10 mins ago" },
  { id: "ORD-155", customer: "Meera Patel", amount: 8999, items: 1, time: "25 mins ago" },
  { id: "ORD-154", customer: "Anjali Reddy", amount: 2199, items: 3, time: "1 hour ago" },
  { id: "ORD-153", customer: "Kavitha Nair", amount: 5499, items: 2, time: "2 hours ago" },
];

function OutletDashboard() {
  const { user } = useAuth();
  const outletName = user?.name || "NC Brand Outlet";

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {outletName}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Stock
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalStock.toLocaleString()}</div>
            <div className="flex items-center text-xs text-muted-foreground mt-1">
              {stats.stockChange >= 0 ? (
                <>
                  <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
                  <span className="text-green-500">+{stats.stockChange}%</span>
                </>
              ) : (
                <>
                  <ArrowDownRight className="h-3 w-3 text-red-500 mr-1" />
                  <span className="text-red-500">{stats.stockChange}%</span>
                </>
              )}
              <span className="ml-1">from last month</span>
            </div>
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
            <div className="text-2xl font-bold text-orange-500">{stats.lowStockItems}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Requires immediate attention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending Shipments
            </CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingShipments}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Expected this week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Today's Sales
            </CardTitle>
            <IndianRupee className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPrice(stats.todaySales)}</div>
            <div className="flex items-center text-xs text-muted-foreground mt-1">
              {stats.salesChange >= 0 ? (
                <>
                  <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                  <span className="text-green-500">+{stats.salesChange}%</span>
                </>
              ) : (
                <>
                  <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
                  <span className="text-red-500">{stats.salesChange}%</span>
                </>
              )}
              <span className="ml-1">vs yesterday</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid gap-4 md:grid-cols-7">
        {/* Sales Trend Chart */}
        <Card className="md:col-span-4">
          <CardHeader>
            <CardTitle>Sales Trend</CardTitle>
            <CardDescription>Monthly sales performance</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={salesChartConfig} className="h-[250px] w-full">
              <AreaChart data={salesData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  className="text-xs"
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `₹${value / 1000}k`}
                  className="text-xs"
                />
                <ChartTooltip
                  content={<ChartTooltipContent />}
                  formatter={(value) => [`₹${Number(value).toLocaleString()}`, "Sales"]}
                />
                <Area
                  type="monotone"
                  dataKey="sales"
                  stroke="hsl(var(--chart-1))"
                  fill="hsl(var(--chart-1))"
                  fillOpacity={0.2}
                  strokeWidth={2}
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Category Distribution */}
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Stock by Category</CardTitle>
            <CardDescription>Current inventory distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={categoryChartConfig} className="h-[250px] w-full">
              <BarChart data={categoryData} layout="vertical" margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" horizontal={false} />
                <XAxis type="number" tickLine={false} axisLine={false} className="text-xs" />
                <YAxis
                  dataKey="category"
                  type="category"
                  tickLine={false}
                  axisLine={false}
                  width={80}
                  className="text-xs"
                />
                <ChartTooltip
                  content={<ChartTooltipContent />}
                  formatter={(value) => [`${value}%`, "Stock"]}
                />
                <Bar
                  dataKey="value"
                  fill="hsl(var(--chart-2))"
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row - Alerts and Activity */}
      <div className="grid gap-4 md:grid-cols-3">
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
            {lowStockItems.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-sm">
                <div className="min-w-0 flex-1">
                  <p className="font-medium truncate">{item.name}</p>
                  <p className="text-xs text-muted-foreground">{item.sku}</p>
                </div>
                <Badge variant="outline" className="ml-2 text-orange-500 border-orange-500">
                  {item.stock} left
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Incoming Shipments */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Incoming Shipments</CardTitle>
              <Badge variant="secondary" className="text-xs">
                {pendingShipments.length} pending
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {pendingShipments.map((shipment, idx) => (
              <div key={idx} className="flex items-center justify-between text-sm">
                <div>
                  <p className="font-medium font-mono">{shipment.id}</p>
                  <p className="text-xs text-muted-foreground">{shipment.items} items</p>
                </div>
                <div className="text-right">
                  <Badge
                    variant={shipment.status === "in_transit" ? "default" : "secondary"}
                    className="text-xs"
                  >
                    {shipment.status.replace("_", " ")}
                  </Badge>
                  <p className="text-xs text-muted-foreground mt-1">ETA: {shipment.eta}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Sales */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Recent Sales</CardTitle>
              <ShoppingBag className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentSales.map((sale, idx) => (
              <div key={idx} className="flex items-center justify-between text-sm">
                <div className="min-w-0 flex-1">
                  <p className="font-medium truncate">{sale.customer}</p>
                  <p className="text-xs text-muted-foreground">{sale.time}</p>
                </div>
                <div className="text-right ml-2">
                  <p className="font-medium">{formatPrice(sale.amount)}</p>
                  <p className="text-xs text-muted-foreground">{sale.items} items</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/outlet/")({
  component: OutletDashboard,
});
