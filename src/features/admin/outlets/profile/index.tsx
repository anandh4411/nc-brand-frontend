// src/features/admin/outlets/profile/index.tsx
import { useNavigate, useParams } from "@tanstack/react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Package,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Truck,
  IndianRupee,
  ArrowUpRight,
  ArrowDownRight,
  ArrowLeft,
  MapPin,
  Copy,
  Check,
  Loader2,
} from "lucide-react";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Area, AreaChart, Bar, BarChart, XAxis, YAxis, CartesianGrid } from "recharts";
import { createSalesColumns } from "./config/sales-columns";
import { createStockColumns } from "./config/stock-columns";
import { SaleViewModal } from "./components/sale-view-modal";
import { StockViewModal } from "./components/stock-view-modal";
import { DataTable, useTableState } from "@/components/elements/app-data-table";
import { useMemo, useState } from "react";
import { useAdminOutlet, useOutletStats, useOutletSales, useOutletShipments } from "@/api/hooks/admin";
import type { OutletSaleItem, OutletShipmentItem } from "@/api/endpoints/admin";

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

const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);

export default function OutletProfile() {
  const { outletId } = useParams({ strict: false });
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  // Sales table state
  const [selectedSale, setSelectedSale] = useState<OutletSaleItem | null>(null);
  const [saleViewOpen, setSaleViewOpen] = useState(false);
  const salesTableState = useTableState<OutletSaleItem>({ debounceMs: 300 });

  // Stock table state
  const [selectedShipment, setSelectedShipment] = useState<OutletShipmentItem | null>(null);
  const [stockViewOpen, setStockViewOpen] = useState(false);
  const stockTableState = useTableState<OutletShipmentItem>({ debounceMs: 300 });

  // API hooks
  const { data: outletData, isLoading: outletLoading } = useAdminOutlet(outletId ?? "");
  const { data: statsData, isLoading: statsLoading } = useOutletStats(outletId ?? "");
  const { data: salesResponse } = useOutletSales(outletId ?? "");
  const { data: shipmentsResponse } = useOutletShipments(outletId ?? "");

  const outlet = outletData?.data;
  const stats = statsData?.data;

  const handleViewSale = (sale: OutletSaleItem) => {
    setSelectedSale(sale);
    setSaleViewOpen(true);
  };

  const handleViewShipment = (shipment: OutletShipmentItem) => {
    setSelectedShipment(shipment);
    setStockViewOpen(true);
  };

  const salesColumns = useMemo(() => createSalesColumns(handleViewSale), []);
  const stockColumns = useMemo(() => createStockColumns(handleViewShipment), []);

  const handleCopyLoginCode = () => {
    if (!outlet?.loginCode) return;
    navigator.clipboard.writeText(outlet.loginCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (outletLoading || statsLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!outlet) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <p className="text-muted-foreground">Outlet not found.</p>
        <Button variant="outline" onClick={() => navigate({ to: "/admin/outlets" })}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Outlets
        </Button>
      </div>
    );
  }

  const salesData = salesResponse?.data?.sales ?? [];
  const shipmentsData = shipmentsResponse?.data?.shipments ?? [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <Button
          variant="ghost"
          size="sm"
          className="w-fit -ml-2"
          onClick={() => navigate({ to: "/admin/outlets" })}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Outlets
        </Button>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight">{outlet.name}</h1>
              <Badge variant="outline" className="font-mono text-xs">
                {outlet.code}
              </Badge>
              <Badge variant={outlet.isActive ? "success" : "secondary"}>
                {outlet.isActive ? "Active" : "Inactive"}
              </Badge>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              {(outlet.city || outlet.state) && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  {[outlet.city, outlet.state].filter(Boolean).join(", ")}
                </span>
              )}
              <span className="flex items-center gap-1.5">
                Login Code:
                <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs font-medium">
                  {outlet.loginCode}
                </code>
                <button
                  onClick={handleCopyLoginCode}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {copied ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
                </button>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Stock</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(stats?.stats.totalStock ?? 0).toLocaleString()}
            </div>
            <div className="flex items-center text-xs text-muted-foreground mt-1">
              {(stats?.stats.stockChange ?? 0) >= 0 ? (
                <>
                  <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
                  <span className="text-green-500">+{stats?.stats.stockChange ?? 0}%</span>
                </>
              ) : (
                <>
                  <ArrowDownRight className="h-3 w-3 text-red-500 mr-1" />
                  <span className="text-red-500">{stats?.stats.stockChange ?? 0}%</span>
                </>
              )}
              <span className="ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Low Stock Items</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500">
              {stats?.stats.lowStockItems ?? 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Requires immediate attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Shipments</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.stats.pendingShipments ?? 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Expected this week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Today's Sales</CardTitle>
            <IndianRupee className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatPrice(stats?.stats.todaySales ?? 0)}
            </div>
            <div className="flex items-center text-xs text-muted-foreground mt-1">
              {(stats?.stats.salesChange ?? 0) >= 0 ? (
                <>
                  <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                  <span className="text-green-500">+{stats?.stats.salesChange ?? 0}%</span>
                </>
              ) : (
                <>
                  <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
                  <span className="text-red-500">{stats?.stats.salesChange ?? 0}%</span>
                </>
              )}
              <span className="ml-1">vs yesterday</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      {stats && (
        <div className="grid gap-4 md:grid-cols-7">
          <Card className="md:col-span-4">
            <CardHeader>
              <CardTitle>Sales Trend</CardTitle>
              <CardDescription>Monthly sales performance</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={salesChartConfig} className="h-[250px] w-full">
                <AreaChart data={stats.salesData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} className="text-xs" />
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

          <Card className="md:col-span-3">
            <CardHeader>
              <CardTitle>Stock by Category</CardTitle>
              <CardDescription>Current inventory distribution</CardDescription>
            </CardHeader>
            <CardContent>
              {stats.categoryData.length > 0 ? (
                <ChartContainer config={categoryChartConfig} className="h-[250px] w-full">
                  <BarChart data={stats.categoryData} layout="vertical" margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
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
                    <Bar dataKey="value" fill="hsl(var(--chart-2))" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ChartContainer>
              ) : (
                <div className="flex items-center justify-center h-[250px] text-muted-foreground text-sm">
                  No inventory data available
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Transaction History Tables */}
      <Tabs defaultValue="sales">
        <TabsList>
          <TabsTrigger value="sales">Sales History</TabsTrigger>
          <TabsTrigger value="stock">Stock Movements</TabsTrigger>
        </TabsList>

        <TabsContent value="sales" className="mt-4">
          <DataTable
            data={salesData}
            columns={salesColumns}
            config={{
              search: {
                enabled: true,
                placeholder: "Search by invoice number...",
                columnKey: "invoiceNumber",
              },
              pagination: {
                enabled: true,
                defaultPageSize: 10,
              },
              selection: { enabled: true },
              sorting: {
                enabled: true,
                defaultSort: { columnKey: "createdAt", desc: true },
              },
              viewOptions: { enabled: true },
              emptyStateMessage: "No sales history for this outlet.",
            }}
            callbacks={{
              onSearch: salesTableState.updateSearch,
              onFiltersChange: salesTableState.updateFilters,
              onSortingChange: salesTableState.updateSorting,
              onRowSelectionChange: salesTableState.updateSelection,
              onPaginationChange: salesTableState.updatePagination,
            }}
          />

          {selectedSale && (
            <SaleViewModal
              open={saleViewOpen}
              onOpenChange={setSaleViewOpen}
              sale={selectedSale}
            />
          )}
        </TabsContent>

        <TabsContent value="stock" className="mt-4">
          <DataTable
            data={shipmentsData}
            columns={stockColumns}
            config={{
              search: {
                enabled: true,
                placeholder: "Search by shipment ID...",
                columnKey: "uuid",
              },
              pagination: {
                enabled: true,
                defaultPageSize: 10,
              },
              selection: { enabled: true },
              sorting: {
                enabled: true,
                defaultSort: { columnKey: "createdAt", desc: true },
              },
              viewOptions: { enabled: true },
              emptyStateMessage: "No stock movements for this outlet.",
            }}
            callbacks={{
              onSearch: stockTableState.updateSearch,
              onFiltersChange: stockTableState.updateFilters,
              onSortingChange: stockTableState.updateSorting,
              onRowSelectionChange: stockTableState.updateSelection,
              onPaginationChange: stockTableState.updatePagination,
            }}
          />

          {selectedShipment && (
            <StockViewModal
              open={stockViewOpen}
              onOpenChange={setStockViewOpen}
              shipment={selectedShipment}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
