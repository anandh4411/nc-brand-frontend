// src/features/admin/outlets/profile/config/stock-columns.tsx
import { ColumnDef } from "@tanstack/react-table";
import {
  selectColumn,
  customColumn,
  actionsColumn,
} from "@/components/elements/app-data-table/helpers/column-helpers";
import type { OutletShipmentItem } from "@/api/endpoints/admin";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

const formatDate = (dateString?: string | null) => {
  if (!dateString) return "—";
  return format(new Date(dateString), "MMM dd, yyyy");
};

const getStatusVariant = (
  status: string
): "default" | "secondary" | "destructive" | "outline" => {
  switch (status) {
    case "DELIVERED":
      return "default";
    case "SHIPPED":
      return "secondary";
    case "CANCELLED":
      return "destructive";
    default:
      return "outline";
  }
};

export const createStockColumns = (
  onView: (shipment: OutletShipmentItem) => void
): ColumnDef<OutletShipmentItem>[] => {
  return [
    selectColumn<OutletShipmentItem>(),

    customColumn<OutletShipmentItem>("uuid", "Shipment #", (value) => (
      <div className="font-mono text-sm font-medium">
        {value.substring(0, 8).toUpperCase()}
      </div>
    )),

    customColumn<OutletShipmentItem>("itemCount", "Items", (value, row) => (
      <div className="text-sm">
        <span className="font-medium">{value}</span>
        <span className="text-muted-foreground ml-1">
          ({row.totalQuantity} units)
        </span>
      </div>
    )),

    customColumn<OutletShipmentItem>(
      "status",
      "Status",
      (value) => (
        <Badge variant={getStatusVariant(value)} className="capitalize">
          {value.toLowerCase()}
        </Badge>
      ),
      { filterable: true, sortable: true }
    ),

    customColumn<OutletShipmentItem>("shippedAt", "Shipped", (value) => (
      <div className="text-muted-foreground text-sm">{formatDate(value)}</div>
    )),

    customColumn<OutletShipmentItem>("deliveredAt", "Delivered", (value) => (
      <div className="text-muted-foreground text-sm">{formatDate(value)}</div>
    )),

    customColumn<OutletShipmentItem>("createdBy", "Created By", (value) => (
      <div className="text-sm">{value?.name || "—"}</div>
    )),

    actionsColumn<OutletShipmentItem>([{ label: "View Details", onClick: onView }]),
  ];
};
