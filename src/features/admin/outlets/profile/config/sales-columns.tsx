// src/features/admin/outlets/profile/config/sales-columns.tsx
import { ColumnDef } from "@tanstack/react-table";
import {
  selectColumn,
  customColumn,
  actionsColumn,
} from "@/components/elements/app-data-table/helpers/column-helpers";
import type { OutletSaleItem } from "@/api/endpoints/admin";
import { Badge } from "@/components/ui/badge";

const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);

const getStatusVariant = (
  status: string
): "default" | "secondary" | "destructive" | "outline" => {
  switch (status) {
    case "COMPLETED":
      return "default";
    case "PENDING":
      return "secondary";
    case "CANCELLED":
    case "REFUNDED":
      return "destructive";
    default:
      return "outline";
  }
};

const getPaymentBadge = (method: string) => {
  switch (method) {
    case "cash":
      return "Cash";
    case "card":
      return "Card";
    case "upi":
      return "UPI";
    default:
      return method;
  }
};

export const createSalesColumns = (
  onView: (sale: OutletSaleItem) => void
): ColumnDef<OutletSaleItem>[] => {
  return [
    selectColumn<OutletSaleItem>(),

    customColumn<OutletSaleItem>("invoiceNumber", "Invoice #", (value) => (
      <div className="font-mono text-sm font-medium">{value}</div>
    )),

    customColumn<OutletSaleItem>("customerName", "Customer", (value, row) => (
      <div>
        <p className="font-medium">{value}</p>
        {row.customerPhone && (
          <p className="text-xs text-muted-foreground">{row.customerPhone}</p>
        )}
      </div>
    )),

    customColumn<OutletSaleItem>("itemCount", "Items", (value, row) => (
      <div className="text-sm">
        <span className="font-medium">{value}</span>
        <span className="text-muted-foreground ml-1">
          ({row.totalQuantity} units)
        </span>
      </div>
    )),

    customColumn<OutletSaleItem>("total", "Total", (value) => (
      <div className="font-mono font-medium">{formatPrice(value)}</div>
    )),

    customColumn<OutletSaleItem>(
      "paymentMethod",
      "Payment",
      (value) => (
        <Badge variant="outline" className="capitalize">
          {getPaymentBadge(value)}
        </Badge>
      ),
      { filterable: true }
    ),

    customColumn<OutletSaleItem>(
      "status",
      "Status",
      (value) => (
        <Badge variant={getStatusVariant(value)} className="capitalize">
          {value.toLowerCase()}
        </Badge>
      ),
      { filterable: true, sortable: true }
    ),

    customColumn<OutletSaleItem>("date", "Date", (value, row) => (
      <div className="text-muted-foreground text-sm">
        <div>{value}</div>
        <div className="text-xs">{row.time}</div>
      </div>
    )),

    actionsColumn<OutletSaleItem>([{ label: "View Details", onClick: onView }]),
  ];
};
