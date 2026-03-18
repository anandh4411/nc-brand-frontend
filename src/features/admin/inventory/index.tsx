// src/features/admin/inventory/index.tsx
import { useState, useMemo } from "react";
import { useNavigate } from "@tanstack/react-router";
import { AlertTriangle, Package, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { DataTable, useTableState } from "@/components/elements/app-data-table";
import { createInventoryColumns } from "./config/columns";
import { StockAdjustmentModal } from "./components/stock-adjustment-modal";
import { InventoryViewModal } from "./components/inventory-view-modal";
import { useAdminInventory, useLowStockItems } from "@/api/hooks/admin";
import type { InventoryItem } from "@/types/dto/inventory.dto";

export default function Inventory() {
  // Dialog states
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [adjustDialogOpen, setAdjustDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [showLowStockOnly, setShowLowStockOnly] = useState(false);
  const navigate = useNavigate();

  // Table state
  const tableState = useTableState<InventoryItem>({ debounceMs: 300 });

  // Build query params from table state
  const queryParams = useMemo(() => ({
    page: tableState.state.pagination.pageIndex + 1,
    pageSize: tableState.state.pagination.pageSize,
    lowStock: showLowStockOnly || undefined,
  }), [tableState.state.pagination, showLowStockOnly]);

  // API Hooks
  const { data: inventoryResponse, isLoading } = useAdminInventory(queryParams);
  const { data: lowStockResponse } = useLowStockItems(100);

  // Get data from API
  const inventoryList = ((inventoryResponse?.data as any)?.inventories || inventoryResponse?.data || []) as InventoryItem[];
  const pagination = (inventoryResponse?.data as any)?.meta || (inventoryResponse?.data as any)?.pagination;
  const lowStockAlerts = (lowStockResponse?.data || []) as any[];

  // Action handlers
  const handleView = (item: InventoryItem) => {
    setSelectedItem(item);
    setViewDialogOpen(true);
  };

  const handleAdjust = (item: InventoryItem) => {
    setSelectedItem(item);
    setAdjustDialogOpen(true);
  };

  // Columns
  const columns = useMemo(
    () => createInventoryColumns(handleView, handleAdjust),
    []
  );

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-8 w-32 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-9 w-32" />
        </div>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-2xl font-medium tracking-tight text-foreground">
            Inventory
          </h1>
          <p className="text-muted-foreground">
            Manage manufacturing unit stock levels.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {lowStockAlerts.length > 0 && (
            <Button
              variant={showLowStockOnly ? "default" : "outline"}
              size="sm"
              onClick={() => setShowLowStockOnly(!showLowStockOnly)}
              className="h-9"
            >
              <AlertTriangle className="mr-2 h-4 w-4" />
              Low Stock ({lowStockAlerts.length})
            </Button>
          )}
          <Button
            size="sm"
            className="h-9"
            onClick={() => navigate({ to: "/admin/products", search: { openAdd: true } } as any)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        </div>
      </div>

      {/* Table */}
      <DataTable
        data={inventoryList}
        columns={columns}
        config={{
          search: {
            enabled: true,
            placeholder: "Search by SKU, product name...",
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
          emptyStateMessage: showLowStockOnly
            ? "No low stock items found."
            : "No inventory items found.",
          state: {
            sorting: tableState.state.sorting,
            columnFilters: tableState.state.filters,
            pagination: tableState.state.pagination,
          },
          pageCount: pagination?.totalPages ?? -1,
        }}
        callbacks={{
          onSearch: tableState.updateSearch,
          onFiltersChange: tableState.updateFilters,
          onSortingChange: tableState.updateSorting,
          onRowSelectionChange: tableState.updateSelection,
          onPaginationChange: tableState.updatePagination,
        }}
      />

      {/* Dialogs */}
      {selectedItem && (
        <>
          <InventoryViewModal
            open={viewDialogOpen}
            onOpenChange={setViewDialogOpen}
            item={selectedItem}
          />

          <StockAdjustmentModal
            open={adjustDialogOpen}
            onOpenChange={setAdjustDialogOpen}
            item={selectedItem}
          />
        </>
      )}
    </div>
  );
}
