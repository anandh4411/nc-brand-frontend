import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ColumnDef } from "@tanstack/react-table";
import {
  DataTable,
  useTableState,
  selectColumn,
  customColumn,
} from "@/components/elements/app-data-table";
import { Package, AlertTriangle, CheckCircle2 } from "lucide-react";
import { useOutletInventory } from "@/api/hooks/outlet";
import type { OutletInventoryItem } from "@/api/endpoints/outlet";

const getStatusBadge = (item: OutletInventoryItem) => {
  if (item.quantity === 0) {
    return (
      <Badge variant="destructive" className="text-xs">
        Out of Stock
      </Badge>
    );
  }
  if (item.isLowStock) {
    return (
      <Badge
        variant="outline"
        className="text-xs text-orange-500 border-orange-500"
      >
        Low Stock
      </Badge>
    );
  }
  return (
    <Badge
      variant="outline"
      className="text-xs text-green-500 border-green-500"
    >
      In Stock
    </Badge>
  );
};

const createInventoryColumns = (): ColumnDef<OutletInventoryItem>[] => [
  selectColumn<OutletInventoryItem>(),

  customColumn<OutletInventoryItem>(
    "sku",
    "SKU",
    (value) => <span className="font-mono text-sm">{value}</span>,
    { sortable: true }
  ),

  customColumn<OutletInventoryItem>(
    "productName",
    "Product",
    (value, row) => (
      <div>
        <p className="font-medium">{value}</p>
        <p className="text-sm text-muted-foreground">
          {row.colorName} / {row.size}
        </p>
      </div>
    ),
    { sortable: true }
  ),

  customColumn<OutletInventoryItem>(
    "quantity",
    "Stock",
    (value, row) => (
      <span className={row.isLowStock ? "text-orange-500 font-medium" : ""}>
        {value}
      </span>
    ),
    { sortable: true }
  ),

  {
    id: "threshold",
    accessorFn: (row) => row.lowStockThreshold,
    header: "Threshold",
    cell: ({ getValue }) => (
      <span className="text-muted-foreground">{getValue() as number}</span>
    ),
  },

  {
    id: "status",
    accessorFn: (row) =>
      row.quantity === 0 ? "out" : row.isLowStock ? "low" : "ok",
    header: "Status",
    cell: ({ row: { original } }) => getStatusBadge(original),
    filterFn: "equals",
  },
];

function OutletInventory() {
  const tableState = useTableState<OutletInventoryItem>({ debounceMs: 300 });

  const { data: inventoryResponse, isLoading } = useOutletInventory({
    pageSize: 50,
  });

  const items = (
    (inventoryResponse?.data as any)?.items || []
  ) as OutletInventoryItem[];
  const pagination = (inventoryResponse?.data as any)?.pagination;

  const columns = useMemo(() => createInventoryColumns(), []);

  // Stats
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
  const lowStockCount = items.filter(
    (item) => item.isLowStock && item.quantity > 0
  ).length;
  const outOfStockCount = items.filter((item) => item.quantity === 0).length;
  const healthyCount = items.length - lowStockCount - outOfStockCount;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Inventory</h1>
          <p className="text-muted-foreground">
            Manage and track your outlet stock levels
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-28" />
          ))}
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }

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
            <div className="text-2xl font-bold">{totalQuantity}</div>
            <p className="text-xs text-muted-foreground">
              Across {pagination?.total ?? items.length} SKUs
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
            <div className="text-2xl font-bold text-orange-500">
              {lowStockCount}
            </div>
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
            <div className="text-2xl font-bold text-red-500">
              {outOfStockCount}
            </div>
            <p className="text-xs text-muted-foreground">
              Urgent attention needed
            </p>
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
              {healthyCount}
            </div>
            <p className="text-xs text-muted-foreground">
              Items well stocked
            </p>
          </CardContent>
        </Card>
      </div>

      {/* DataTable */}
      <DataTable
        data={items}
        columns={columns}
        config={{
          search: {
            enabled: true,
            placeholder: "Search by product name, SKU...",
            columnKey: "productName",
          },
          pagination: {
            enabled: true,
            defaultPageSize: 10,
          },
          selection: { enabled: true },
          sorting: {
            enabled: true,
            defaultSort: { columnKey: "quantity", desc: false },
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
