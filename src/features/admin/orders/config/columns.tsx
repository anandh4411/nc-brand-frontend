// src/features/admin/orders/config/columns.tsx
import { ColumnDef } from "@tanstack/react-table";
import {
  selectColumn,
  customColumn,
  actionsColumn,
} from "@/components/elements/app-data-table/helpers/column-helpers";
import type { Order } from "@/types/dto/order.dto";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

const formatDate = (dateString?: string) => {
  if (!dateString) return "N/A";
  return format(new Date(dateString), "MMM dd, yyyy");
};

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
};

const getOrderStatusVariant = (
  status: string
): "default" | "secondary" | "destructive" | "outline" => {
  const s = status?.toLowerCase();
  switch (s) {
    case "delivered":
      return "default";
    case "shipped":
    case "processing":
    case "confirmed":
      return "secondary";
    case "cancelled":
    case "returned":
      return "destructive";
    default:
      return "outline";
  }
};

const getPaymentStatusVariant = (
  status: string
): "default" | "secondary" | "destructive" | "outline" => {
  const s = status?.toLowerCase();
  switch (s) {
    case "paid":
      return "default";
    case "refunded":
      return "secondary";
    case "failed":
      return "destructive";
    default:
      return "outline";
  }
};

export const createOrderColumns = (
  onView: (order: Order) => void,
  onUpdateStatus: (order: Order) => void
): ColumnDef<Order>[] => {
  const orderActions = [
    {
      label: "View Details",
      onClick: onView,
    },
    {
      label: "Update Status",
      onClick: onUpdateStatus,
    },
  ];

  return [
    selectColumn<Order>(),

    customColumn<Order>("orderNumber", "Order #", (value) => (
      <div className="font-mono text-sm font-medium">{value}</div>
    )),

    {
      id: "customerName",
      accessorFn: (row) => row.customer?.name || "—",
      header: "Customer",
      cell: ({ row: { original } }) => (
        <div>
          <p className="font-medium">{original.customer?.name || "—"}</p>
          <p className="text-xs text-muted-foreground">{original.customer?.email || ""}</p>
        </div>
      ),
    },

    {
      id: "items",
      accessorFn: (row: any) => row.itemCount ?? row.items?.length ?? 0,
      header: "Items",
      cell: ({ getValue }) => (
        <div className="text-sm">
          <span className="font-medium">{getValue() as number}</span>
        </div>
      ),
    },

    customColumn<Order>("total", "Total", (value) => (
      <div className="font-mono font-medium">{formatPrice(value)}</div>
    )),

    customColumn<Order>(
      "status",
      "Order Status",
      (value) => (
        <Badge variant={getOrderStatusVariant(value)} className="capitalize">
          {value}
        </Badge>
      ),
      { filterable: true, sortable: true }
    ),

    customColumn<Order>(
      "paymentStatus",
      "Payment",
      (value) => (
        <Badge variant={getPaymentStatusVariant(value)} className="capitalize">
          {value}
        </Badge>
      ),
      { filterable: true }
    ),

    {
      id: "paymentMethod",
      accessorFn: (row: any) => row.paymentMethod || "—",
      header: "Method",
      cell: ({ getValue }) => {
        const val = getValue() as string;
        return (
          <span className="text-sm capitalize">
            {val === "cod" ? "COD" : val === "razorpay" ? "Razorpay" : val || "—"}
          </span>
        );
      },
    },

    customColumn<Order>("createdAt", "Date", (value) => (
      <div className="text-muted-foreground text-sm">{formatDate(value)}</div>
    )),

    actionsColumn<Order>(orderActions),
  ];
};
