import { ColumnDef } from "@tanstack/react-table";
import {
  customColumn,
  actionsColumn,
} from "@/components/elements/app-data-table/helpers/column-helpers";
import type { Coupon } from "@/api/endpoints/admin";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Edit, Eye, Trash2 } from "lucide-react";

const formatDate = (dateString?: string) => {
  if (!dateString) return "N/A";
  return format(new Date(dateString), "MMM dd, yyyy");
};

export const createCouponColumns = (
  onView: (coupon: Coupon) => void,
  onEdit: (coupon: Coupon) => void,
  onDelete: (coupon: Coupon) => void
): ColumnDef<Coupon>[] => {
  const couponActions = [
    { label: "View Details", icon: Eye, onClick: onView },
    { label: "Edit", icon: Edit, onClick: onEdit },
    {
      label: "Delete",
      icon: Trash2,
      onClick: onDelete,
      className: "text-destructive",
      separator: true,
    },
  ];

  return [
    customColumn<Coupon>("code", "Code", (value) => (
      <span className="font-mono font-bold text-sm">{value}</span>
    )),

    customColumn<Coupon>("type", "Type", (value) => (
      <Badge variant={value === "PERCENTAGE" ? "default" : "secondary"}>
        {value === "PERCENTAGE" ? "Percentage" : "Fixed"}
      </Badge>
    )),

    customColumn<Coupon>("value", "Value", (value, row) => (
      <span className="font-medium">
        {row.type === "PERCENTAGE" ? `${value}%` : `₹${value}`}
      </span>
    )),

    customColumn<Coupon>("minOrderValue", "Min Order", (value) => (
      <span className="text-sm text-muted-foreground">
        {value ? `₹${value}` : "—"}
      </span>
    )),

    customColumn<Coupon>("usedCount", "Usage", (value, row) => (
      <span className="text-sm">
        {value}/{row.usageLimit ?? "∞"}
      </span>
    )),

    customColumn<Coupon>("validFrom", "Valid Period", (value, row) => (
      <div className="text-sm text-muted-foreground">
        {formatDate(value)} — {formatDate(row.validUntil)}
      </div>
    )),

    customColumn<Coupon>(
      "isActive",
      "Status",
      (value) => (
        <Badge variant={value ? "success" : "secondary"}>
          {value ? "Active" : "Inactive"}
        </Badge>
      ),
      { filterable: true, sortable: true }
    ),

    actionsColumn<Coupon>(couponActions),
  ];
};
