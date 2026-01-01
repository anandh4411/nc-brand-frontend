// src/features/admin/orders/config/columns.tsx
import { ColumnDef } from "@tanstack/react-table";
import {
  selectColumn,
  customColumn,
  actionsColumn,
} from "@/components/elements/app-data-table/helpers/column-helpers";
import type { Order, OrderStatus, PaymentStatus } from "@/types/dto/order.dto";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import type { OrderItem } from "@/types/dto/order.dto";

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
  status: OrderStatus
): "default" | "secondary" | "destructive" | "outline" => {
  switch (status) {
    case "delivered":
      return "default";
    case "shipped":
    case "processing":
      return "secondary";
    case "cancelled":
    case "returned":
      return "destructive";
    default:
      return "outline";
  }
};

const getPaymentStatusVariant = (
  status: PaymentStatus
): "default" | "secondary" | "destructive" | "outline" => {
  switch (status) {
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

    customColumn<Order>("customerName", "Customer", (value, row) => (
      <div>
        <p className="font-medium">{value}</p>
        <p className="text-xs text-muted-foreground">{row.customerEmail}</p>
      </div>
    )),

    customColumn<Order>("items", "Items", (value: OrderItem[]) => (
      <div className="text-sm">
        <span className="font-medium">{value.length}</span>
        <span className="text-muted-foreground ml-1">
          ({value.reduce((acc: number, item: OrderItem) => acc + item.quantity, 0)} units)
        </span>
      </div>
    )),

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

    customColumn<Order>("paymentMethod", "Method", (value) => (
      <span className="text-sm capitalize">{value === "cod" ? "COD" : "Razorpay"}</span>
    )),

    customColumn<Order>("createdAt", "Date", (value) => (
      <div className="text-muted-foreground text-sm">{formatDate(value)}</div>
    )),

    actionsColumn<Order>(orderActions),
  ];
};
