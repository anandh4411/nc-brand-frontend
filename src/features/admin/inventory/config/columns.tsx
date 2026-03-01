// src/features/admin/inventory/config/columns.tsx
import { ColumnDef } from "@tanstack/react-table";
import {
  selectColumn,
  actionsColumn,
} from "@/components/elements/app-data-table/helpers/column-helpers";
import type { InventoryItem } from "@/types/dto/inventory.dto";
import { Badge } from "@/components/ui/badge";
import { Edit, Eye, AlertTriangle } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

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

    {
      id: "sku",
      header: "SKU",
      accessorFn: (row) => row.variant.sku,
      cell: ({ getValue }) => (
        <div className="font-mono text-sm font-medium">{getValue() as string}</div>
      ),
    },

    {
      id: "productName",
      header: "Product",
      accessorFn: (row) => row.variant.productName,
      cell: ({ getValue }) => (
        <div className="font-medium max-w-[200px] truncate" title={getValue() as string}>
          {getValue() as string}
        </div>
      ),
    },

    {
      id: "colorName",
      header: "Color",
      accessorFn: (row) => row.variant.colorName,
      cell: ({ getValue }) => <div>{getValue() as string}</div>,
    },

    {
      id: "size",
      header: "Size",
      accessorFn: (row) => row.variant.size,
      cell: ({ getValue }) => <Badge variant="outline">{getValue() as string}</Badge>,
    },

    {
      id: "quantity",
      header: "Quantity",
      accessorKey: "quantity",
      cell: ({ row }) => {
        const quantity = row.original.quantity;
        const isLow = row.original.isLowStock;
        return (
          <div className="flex items-center gap-2">
            <span
              className={`font-mono font-medium ${
                isLow ? "text-destructive" : ""
              }`}
            >
              {quantity}
            </span>
            {isLow && (
              <AlertTriangle className="h-4 w-4 text-destructive" />
            )}
          </div>
        );
      },
    },

    {
      id: "lowStockThreshold",
      header: "Low Stock At",
      accessorKey: "lowStockThreshold",
      cell: ({ getValue }) => (
        <div className="text-muted-foreground font-mono text-sm">{getValue() as number}</div>
      ),
    },

    {
      id: "batchNumber",
      header: "Batch",
      accessorKey: "batchNumber",
      cell: ({ getValue }) => (
        <div className="text-muted-foreground text-sm font-mono">
          {(getValue() as string | null) || "—"}
        </div>
      ),
    },

    actionsColumn<InventoryItem>(inventoryActions),
  ];
};
