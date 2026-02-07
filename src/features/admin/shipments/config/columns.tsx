// src/features/admin/shipments/config/columns.tsx
import { ColumnDef } from "@tanstack/react-table";
import {
  selectColumn,
  customColumn,
  actionsColumn,
} from "@/components/elements/app-data-table/helpers/column-helpers";
import type { Shipment, ShipmentItem } from "@/types/dto/inventory.dto";
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

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    PENDING: "Pending",
    SHIPPED: "Shipped",
    DELIVERED: "Delivered",
    PARTIALLY_RECEIVED: "Partially Received",
    CANCELLED: "Cancelled",
  };
  return labels[status] || status;
};

export const createShipmentColumns = (
  onView: (shipment: Shipment) => void
): ColumnDef<Shipment>[] => {
  return [
    selectColumn<Shipment>(),

    customColumn<Shipment>("id", "Shipment #", (value) => (
      <div className="font-mono text-sm font-medium">SHP-{String(value).padStart(4, "0")}</div>
    )),

    {
      id: "outletName",
      accessorFn: (row) => row.outlet?.name || "—",
      header: "Outlet",
      cell: ({ getValue }) => (
        <div className="font-medium max-w-[200px] truncate" title={getValue() as string}>
          {getValue() as string}
        </div>
      ),
    },

    customColumn<Shipment>("items", "Items", (value: ShipmentItem[]) => (
      <div className="text-sm">
        <span className="font-medium">{value?.length || 0}</span>
        <span className="text-muted-foreground ml-1">
          ({value?.reduce((acc: number, item: ShipmentItem) => acc + item.quantity, 0) || 0} units)
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

    customColumn<Shipment>("createdAt", "Created", (value) => (
      <div className="text-muted-foreground text-sm">{formatDate(value)}</div>
    )),

    // Use static actions - status-specific actions handled in component
    actionsColumn<Shipment>([
      {
        label: "View Details",
        onClick: onView,
      },
    ]),
  ];
};
