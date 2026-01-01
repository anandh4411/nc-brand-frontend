// src/features/admin/inventory/index.tsx
import { useState, useMemo } from "react";
import { AlertTriangle, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataTable, useTableState } from "@/components/elements/app-data-table";
import { createInventoryColumns } from "./config/columns";
import { StockAdjustmentModal } from "./components/stock-adjustment-modal";
import { InventoryViewModal } from "./components/inventory-view-modal";
import { mockInventoryItems, mockLowStockAlerts } from "./data/mock-data";
import type { InventoryItem } from "@/types/dto/inventory.dto";

export default function Inventory() {
  // Dialog states
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [adjustDialogOpen, setAdjustDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [showLowStockOnly, setShowLowStockOnly] = useState(false);

  // Table state
  const tableState = useTableState<InventoryItem>({ debounceMs: 300 });

  // Filter for low stock if enabled
  const inventoryList = showLowStockOnly
    ? mockInventoryItems.filter((item) => item.quantity <= item.lowStockThreshold)
    : mockInventoryItems;

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
          {mockLowStockAlerts.length > 0 && (
            <Button
              variant={showLowStockOnly ? "default" : "outline"}
              size="sm"
              onClick={() => setShowLowStockOnly(!showLowStockOnly)}
              className="h-9"
            >
              <AlertTriangle className="mr-2 h-4 w-4" />
              Low Stock ({mockLowStockAlerts.length})
            </Button>
          )}
        </div>
      </div>

      {/* Low Stock Alert Banner */}
      {mockLowStockAlerts.length > 0 && !showLowStockOnly && (
        <div className="flex items-center gap-3 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
          <AlertTriangle className="h-5 w-5 text-destructive" />
          <div className="flex-1">
            <p className="font-medium text-destructive">
              {mockLowStockAlerts.length} item(s) below low stock threshold
            </p>
            <p className="text-sm text-muted-foreground">
              {mockLowStockAlerts.map((a) => a.productVariantSku).join(", ")}
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowLowStockOnly(true)}
          >
            View All
          </Button>
        </div>
      )}

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
