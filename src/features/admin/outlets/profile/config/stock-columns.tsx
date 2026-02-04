// src/features/admin/outlets/profile/config/stock-columns.tsx
import { ColumnDef } from "@tanstack/react-table";
import {
  selectColumn,
  customColumn,
  actionsColumn,
} from "@/components/elements/app-data-table/helpers/column-helpers";
import type { Shipment, ShipmentStatus, ShipmentItem } from "@/types/dto/inventory.dto";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

const formatDate = (dateString?: string | null) => {
  if (!dateString) return "—";
  return format(new Date(dateString), "MMM dd, yyyy");
};

const getStatusVariant = (
  status: ShipmentStatus
): "default" | "secondary" | "destructive" | "outline" => {
  switch (status) {
    case "delivered":
      return "default";
    case "shipped":
      return "secondary";
    case "cancelled":
      return "destructive";
    default:
      return "outline";
  }
};

const getStatusLabel = (status: ShipmentStatus) =>
  status.charAt(0).toUpperCase() + status.slice(1);

export const createStockColumns = (
  onView: (shipment: Shipment) => void
): ColumnDef<Shipment>[] => {
  return [
    selectColumn<Shipment>(),

    customColumn<Shipment>("id", "Shipment #", (value) => (
      <div className="font-mono text-sm font-medium">
        SHP-{String(value).padStart(4, "0")}
      </div>
    )),

    customColumn<Shipment>("items", "Items", (value: ShipmentItem[]) => (
      <div className="text-sm">
        <span className="font-medium">{value.length}</span>
        <span className="text-muted-foreground ml-1">
          ({value.reduce((acc: number, item: ShipmentItem) => acc + item.quantity, 0)} units)
        </span>
      </div>
    )),

    customColumn<Shipment>(
      "status",
      "Status",
      (value) => (
        <Badge variant={getStatusVariant(value)}>{getStatusLabel(value)}</Badge>
      ),
      { filterable: true, sortable: true }
    ),

    customColumn<Shipment>("shippedAt", "Shipped", (value) => (
      <div className="text-muted-foreground text-sm">{formatDate(value)}</div>
    )),

    customColumn<Shipment>("deliveredAt", "Delivered", (value) => (
      <div className="text-muted-foreground text-sm">{formatDate(value)}</div>
    )),

    customColumn<Shipment>("createdByName", "Created By", (value) => (
      <div className="text-sm">{value || "Unknown"}</div>
    )),

    actionsColumn<Shipment>([{ label: "View Details", onClick: onView }]),
  ];
};
