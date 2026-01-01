import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Area, AreaChart, Bar, BarChart, XAxis, YAxis, CartesianGrid, Line, LineChart, PieChart, Pie, Cell } from "recharts";
import {
  IndianRupee,
  TrendingUp,
  ShoppingBag,
  Users,
  Package,
  Store,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

// Mock data
const revenueData = [
  { month: "Jan", revenue: 245000, orders: 156 },
  { month: "Feb", revenue: 312000, orders: 189 },
  { month: "Mar", revenue: 289000, orders: 167 },
  { month: "Apr", revenue: 378000, orders: 234 },
  { month: "May", revenue: 356000, orders: 212 },
  { month: "Jun", revenue: 423000, orders: 267 },
  { month: "Jul", revenue: 489000, orders: 298 },
];

const categoryData = [
  { name: "Sarees", value: 42, fill: "hsl(var(--chart-1))" },
  { name: "Kurtis", value: 28, fill: "hsl(var(--chart-2))" },
  { name: "Lehengas", value: 18, fill: "hsl(var(--chart-3))" },
  { name: "Dress Materials", value: 12, fill: "hsl(var(--chart-4))" },
];

const outletPerformance = [
  { outlet: "Chennai", sales: 189000 },
  { outlet: "Bangalore", sales: 156000 },
  { outlet: "Mumbai", sales: 142000 },
  { outlet: "Delhi", sales: 128000 },
  { outlet: "Hyderabad", sales: 98000 },
];

const dailySales = [
  { day: "Mon", online: 12000, offline: 8500 },
  { day: "Tue", online: 15000, offline: 9200 },
  { day: "Wed", online: 11000, offline: 7800 },
  { day: "Thu", online: 18000, offline: 12000 },
  { day: "Fri", online: 22000, offline: 15000 },
  { day: "Sat", online: 28000, offline: 21000 },
  { day: "Sun", online: 19000, offline: 14000 },
];

const revenueChartConfig = {
  revenue: { label: "Revenue", color: "hsl(var(--chart-1))" },
  orders: { label: "Orders", color: "hsl(var(--chart-2))" },
} satisfies ChartConfig;

const salesChartConfig = {
  online: { label: "Online", color: "hsl(var(--chart-1))" },
  offline: { label: "Offline", color: "hsl(var(--chart-2))" },
} satisfies ChartConfig;

const outletChartConfig = {
  sales: { label: "Sales", color: "hsl(var(--chart-3))" },
} satisfies ChartConfig;

// Stats
const stats = {
  totalRevenue: 2492000,
  revenueGrowth: 18.5,
  totalOrders: 1523,
  ordersGrowth: 12.3,
  totalCustomers: 856,
  customersGrowth: 24.1,
  avgOrderValue: 1636,
  avgOrderGrowth: -2.4,
};

function AdminAnalytics() {
  const formatPrice = (price: number) => {
    if (price >= 100000) {
      return `₹${(price / 100000).toFixed(1)}L`;
    }
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
        <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">
          Business performance and insights
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Revenue
            </CardTitle>
            <IndianRupee className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPrice(stats.totalRevenue)}</div>
            <div className="flex items-center text-xs text-muted-foreground mt-1">
              {stats.revenueGrowth >= 0 ? (
                <>
                  <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
                  <span className="text-green-500">+{stats.revenueGrowth}%</span>
                </>
              ) : (
                <>
                  <ArrowDownRight className="h-3 w-3 text-red-500 mr-1" />
                  <span className="text-red-500">{stats.revenueGrowth}%</span>
                </>
              )}
              <span className="ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Orders
            </CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrders.toLocaleString()}</div>
            <div className="flex items-center text-xs text-muted-foreground mt-1">
              {stats.ordersGrowth >= 0 ? (
                <>
                  <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
                  <span className="text-green-500">+{stats.ordersGrowth}%</span>
                </>
              ) : (
                <>
                  <ArrowDownRight className="h-3 w-3 text-red-500 mr-1" />
                  <span className="text-red-500">{stats.ordersGrowth}%</span>
                </>
              )}
              <span className="ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Customers
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCustomers.toLocaleString()}</div>
            <div className="flex items-center text-xs text-muted-foreground mt-1">
              {stats.customersGrowth >= 0 ? (
                <>
                  <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
                  <span className="text-green-500">+{stats.customersGrowth}%</span>
                </>
              ) : (
                <>
                  <ArrowDownRight className="h-3 w-3 text-red-500 mr-1" />
                  <span className="text-red-500">{stats.customersGrowth}%</span>
                </>
              )}
              <span className="ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Avg. Order Value
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPrice(stats.avgOrderValue)}</div>
            <div className="flex items-center text-xs text-muted-foreground mt-1">
              {stats.avgOrderGrowth >= 0 ? (
                <>
                  <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
                  <span className="text-green-500">+{stats.avgOrderGrowth}%</span>
                </>
              ) : (
                <>
                  <ArrowDownRight className="h-3 w-3 text-red-500 mr-1" />
                  <span className="text-red-500">{stats.avgOrderGrowth}%</span>
                </>
              )}
              <span className="ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid gap-4 md:grid-cols-7">
        {/* Revenue Trend */}
        <Card className="md:col-span-4">
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
            <CardDescription>Monthly revenue performance</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={revenueChartConfig} className="h-[300px] w-full">
              <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} className="text-xs" />
                <YAxis tickLine={false} axisLine={false} tickFormatter={(v) => `₹${v / 1000}k`} className="text-xs" />
                <ChartTooltip content={<ChartTooltipContent />} formatter={(value) => [`₹${Number(value).toLocaleString()}`, "Revenue"]} />
                <Area type="monotone" dataKey="revenue" stroke="hsl(var(--chart-1))" fill="hsl(var(--chart-1))" fillOpacity={0.2} strokeWidth={2} />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Category Distribution */}
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Sales by Category</CardTitle>
            <CardDescription>Product category distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{}} className="h-[300px] w-full">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                  labelLine={false}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Daily Sales Comparison */}
        <Card>
          <CardHeader>
            <CardTitle>Online vs Offline Sales</CardTitle>
            <CardDescription>This week's channel comparison</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={salesChartConfig} className="h-[280px] w-full">
              <BarChart data={dailySales} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="day" tickLine={false} axisLine={false} className="text-xs" />
                <YAxis tickLine={false} axisLine={false} tickFormatter={(v) => `₹${v / 1000}k`} className="text-xs" />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="online" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
                <Bar dataKey="offline" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Outlet Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Outlet Performance</CardTitle>
            <CardDescription>Sales by outlet location</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={outletChartConfig} className="h-[280px] w-full">
              <BarChart data={outletPerformance} layout="vertical" margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" horizontal={false} />
                <XAxis type="number" tickLine={false} axisLine={false} tickFormatter={(v) => `₹${v / 1000}k`} className="text-xs" />
                <YAxis dataKey="outlet" type="category" tickLine={false} axisLine={false} width={80} className="text-xs" />
                <ChartTooltip content={<ChartTooltipContent />} formatter={(value) => [`₹${Number(value).toLocaleString()}`, "Sales"]} />
                <Bar dataKey="sales" fill="hsl(var(--chart-3))" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/admin/analytics/")({
  component: AdminAnalytics,
});
