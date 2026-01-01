import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";
import {
  DataTable,
  useTableState,
  selectColumn,
  customColumn,
  textColumn,
} from "@/components/elements/app-data-table";
import {
  Package,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";

// Types
interface InventoryItem {
  id: number;
  sku: string;
  name: string;
  color: string;
  size: string;
  category: string;
  stock: number;
  threshold: number;
  price: number;
  status: "ok" | "low" | "critical" | "out";
}

// Mock inventory data
const inventoryData: InventoryItem[] = [
  { id: 1, sku: "BSS-001-RB", name: "Banarasi Silk Saree", color: "Royal Blue", size: "Free Size", category: "Sarees", stock: 2, threshold: 5, price: 4599, status: "low" },
  { id: 2, sku: "BSS-001-MR", name: "Banarasi Silk Saree", color: "Maroon", size: "Free Size", category: "Sarees", stock: 15, threshold: 5, price: 4599, status: "ok" },
  { id: 3, sku: "CCK-023-MR", name: "Cotton Casual Kurti", color: "Maroon", size: "M", category: "Kurtis", stock: 3, threshold: 10, price: 1099, status: "low" },
  { id: 4, sku: "CCK-023-BL", name: "Cotton Casual Kurti", color: "Blue", size: "L", category: "Kurtis", stock: 22, threshold: 10, price: 1099, status: "ok" },
  { id: 5, sku: "CPS-045-PK", name: "Chiffon Printed Saree", color: "Pink", size: "Free Size", category: "Sarees", stock: 1, threshold: 5, price: 2499, status: "critical" },
  { id: 6, sku: "BLS-012-GD", name: "Bridal Lehenga Set", color: "Gold", size: "L", category: "Lehengas", stock: 8, threshold: 3, price: 8999, status: "ok" },
  { id: 7, sku: "TSS-034-GR", name: "Tussar Silk Saree", color: "Green", size: "Free Size", category: "Sarees", stock: 12, threshold: 5, price: 3299, status: "ok" },
  { id: 8, sku: "CDM-056-WH", name: "Cotton Dress Material", color: "White", size: "Unstitched", category: "Dress Materials", stock: 4, threshold: 8, price: 899, status: "low" },
  { id: 9, sku: "PKS-078-RD", name: "Pattu Kanchipuram Saree", color: "Red", size: "Free Size", category: "Sarees", stock: 6, threshold: 5, price: 12999, status: "ok" },
  { id: 10, sku: "EKR-089-NV", name: "Embroidered Kurti", color: "Navy", size: "XL", category: "Kurtis", stock: 0, threshold: 5, price: 1499, status: "out" },
  { id: 11, sku: "SSS-101-YL", name: "Soft Silk Saree", color: "Yellow", size: "Free Size", category: "Sarees", stock: 9, threshold: 5, price: 5499, status: "ok" },
  { id: 12, sku: "PKR-112-PR", name: "Party Kurti", color: "Purple", size: "S", category: "Kurtis", stock: 5, threshold: 8, price: 1299, status: "low" },
  { id: 13, sku: "WLS-123-CR", name: "Wedding Lehenga Set", color: "Cream", size: "M", category: "Lehengas", stock: 3, threshold: 3, price: 15999, status: "ok" },
  { id: 14, sku: "CDM-134-BK", name: "Cotton Dress Material", color: "Black", size: "Unstitched", category: "Dress Materials", stock: 18, threshold: 8, price: 799, status: "ok" },
  { id: 15, sku: "BSS-145-GN", name: "Banarasi Silk Saree", color: "Green", size: "Free Size", category: "Sarees", stock: 0, threshold: 5, price: 4799, status: "out" },
];

// Column definitions
const createInventoryColumns = (): ColumnDef<InventoryItem>[] => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getStatusBadge = (status: string, stock: number) => {
    switch (status) {
      case "critical":
      case "out":
        return (
          <Badge variant="destructive" className="text-xs">
            {stock === 0 ? "Out of Stock" : "Critical"}
          </Badge>
        );
      case "low":
        return (
          <Badge variant="outline" className="text-xs text-orange-500 border-orange-500">
            Low Stock
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="text-xs text-green-500 border-green-500">
            In Stock
          </Badge>
        );
    }
  };

  return [
    selectColumn<InventoryItem>(),

    customColumn<InventoryItem>(
      "sku",
      "SKU",
      (value) => <span className="font-mono text-sm">{value}</span>,
      { sortable: true }
    ),

    customColumn<InventoryItem>(
      "name",
      "Product",
      (value, row) => (
        <div>
          <p className="font-medium">{value}</p>
          <p className="text-sm text-muted-foreground">
            {row.color} / {row.size}
          </p>
        </div>
      ),
      { sortable: true }
    ),

    textColumn<InventoryItem>("category", "Category", { sortable: true, filterable: true }),

    customColumn<InventoryItem>(
      "stock",
      "Stock",
      (value, row) => (
        <span className={value <= row.threshold ? "text-orange-500 font-medium" : ""}>
          {value}
        </span>
      ),
      { sortable: true }
    ),

    customColumn<InventoryItem>(
      "price",
      "Price",
      (value) => <span className="font-medium">{formatPrice(value)}</span>,
      { sortable: true }
    ),

    customColumn<InventoryItem>(
      "status",
      "Status",
      (value, row) => getStatusBadge(value, row.stock),
      { filterable: true }
    ),
  ];
};

function OutletInventory() {
  const tableState = useTableState<InventoryItem>({ debounceMs: 300 });

  const columns = useMemo(() => createInventoryColumns(), []);

  // Stats calculations
  const totalItems = inventoryData.reduce((sum, item) => sum + item.stock, 0);
  const lowStockCount = inventoryData.filter(
    (item) => item.status === "low" || item.status === "critical"
  ).length;
  const outOfStockCount = inventoryData.filter((item) => item.status === "out").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Inventory</h1>
        <p className="text-muted-foreground">
          Manage and track your outlet stock levels
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Items
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalItems}</div>
            <p className="text-xs text-muted-foreground">
              Across {inventoryData.length} SKUs
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Low Stock
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500">{lowStockCount}</div>
            <p className="text-xs text-muted-foreground">Items need restock</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Out of Stock
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">{outOfStockCount}</div>
            <p className="text-xs text-muted-foreground">Urgent attention needed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Healthy Stock
            </CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">
              {inventoryData.length - lowStockCount - outOfStockCount}
            </div>
            <p className="text-xs text-muted-foreground">Items well stocked</p>
          </CardContent>
        </Card>
      </div>

      {/* DataTable */}
      <DataTable
        data={inventoryData}
        columns={columns}
        config={{
          search: {
            enabled: true,
            placeholder: "Search by name, SKU, color...",
            columnKey: "name",
          },
          pagination: {
            enabled: true,
            defaultPageSize: 10,
          },
          selection: { enabled: true },
          sorting: {
            enabled: true,
            defaultSort: { columnKey: "stock", desc: false },
          },
          viewOptions: { enabled: true },
          emptyStateMessage: "No inventory items found.",
          state: {
            sorting: tableState.state.sorting,
            columnFilters: tableState.state.filters,
            pagination: tableState.state.pagination,
          },
        }}
        callbacks={{
          onSearch: tableState.updateSearch,
          onFiltersChange: tableState.updateFilters,
          onSortingChange: tableState.updateSorting,
          onRowSelectionChange: tableState.updateSelection,
          onPaginationChange: tableState.updatePagination,
        }}
      />
    </div>
  );
}

export const Route = createFileRoute("/outlet/inventory/")({
  component: OutletInventory,
});
