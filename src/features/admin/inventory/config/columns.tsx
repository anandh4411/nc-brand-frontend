// src/features/admin/inventory/config/columns.tsx
import { ColumnDef } from "@tanstack/react-table";
import {
  selectColumn,
  customColumn,
  actionsColumn,
} from "@/components/elements/app-data-table/helpers/column-helpers";
import type { InventoryItem } from "@/types/dto/inventory.dto";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Edit, Eye, AlertTriangle } from "lucide-react";

const formatDate = (dateString?: string) => {
  if (!dateString) return "N/A";
  return format(new Date(dateString), "MMM dd, yyyy");
};

export const createInventoryColumns = (
  onView: (item: InventoryItem) => void,
  onAdjust: (item: InventoryItem) => void
): ColumnDef<InventoryItem>[] => {
  const inventoryActions = [
    {
      label: "View Details",
      icon: Eye,
      onClick: onView,
    },
    {
      label: "Adjust Stock",
      icon: Edit,
      onClick: onAdjust,
    },
  ];

  return [
    selectColumn<InventoryItem>(),

    customColumn<InventoryItem>("productVariantSku", "SKU", (value) => (
      <div className="font-mono text-sm font-medium">{value}</div>
    )),

    customColumn<InventoryItem>("productName", "Product", (value) => (
      <div className="font-medium max-w-[200px] truncate" title={value}>
        {value}
      </div>
    )),

    customColumn<InventoryItem>("colorName", "Color", (value) => (
      <div>{value}</div>
    )),

    customColumn<InventoryItem>("size", "Size", (value) => (
      <Badge variant="outline">{value}</Badge>
    )),

    customColumn<InventoryItem>("quantity", "Quantity", (value, row) => {
      const isLow = value <= row.lowStockThreshold;
      return (
        <div className="flex items-center gap-2">
          <span
            className={`font-mono font-medium ${
              isLow ? "text-destructive" : ""
            }`}
          >
            {value}
          </span>
          {isLow && (
            <AlertTriangle className="h-4 w-4 text-destructive" />
          )}
        </div>
      );
    }),

    customColumn<InventoryItem>("lowStockThreshold", "Low Stock At", (value) => (
      <div className="text-muted-foreground font-mono text-sm">{value}</div>
    )),

    customColumn<InventoryItem>("batchNumber", "Batch", (value) => (
      <div className="text-muted-foreground text-sm font-mono">
        {value || "—"}
      </div>
    )),

    customColumn<InventoryItem>("updatedAt", "Last Updated", (value) => (
      <div className="text-muted-foreground text-sm">{formatDate(value)}</div>
    )),

    actionsColumn<InventoryItem>(inventoryActions),
  ];
};
