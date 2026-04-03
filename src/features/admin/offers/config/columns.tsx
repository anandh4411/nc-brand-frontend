import { ColumnDef } from "@tanstack/react-table";
import {
  customColumn,
  actionsColumn,
} from "@/components/elements/app-data-table/helpers/column-helpers";
import type { Offer } from "@/api/endpoints/admin";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Edit, Eye, Trash2 } from "lucide-react";

const formatDate = (dateString?: string) => {
  if (!dateString) return "N/A";
  return format(new Date(dateString), "MMM dd, yyyy");
};

function ProductBadge({ name, color, size, variant }: {
  name?: string;
  color?: { colorName: string; colorCode: string } | null;
  size?: { size: string } | null;
  variant?: "outline" | "secondary";
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <Badge variant={variant || "outline"}>{name || "N/A"}</Badge>
      {(color || size) && (
        <span className="text-[10px] text-muted-foreground flex items-center gap-1">
          {color && (
            <>
              <span
                className="inline-block h-2 w-2 rounded-full border"
                style={{ backgroundColor: color.colorCode }}
              />
              {color.colorName}
            </>
          )}
          {color && size && " / "}
          {size && size.size}
        </span>
      )}
    </div>
  );
}

export const createOfferColumns = (
  onView: (offer: Offer) => void,
  onEdit: (offer: Offer) => void,
  onDelete: (offer: Offer) => void
): ColumnDef<Offer>[] => {
  const offerActions = [
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
    customColumn<Offer>("name", "Name", (value) => (
      <span className="font-medium">{value}</span>
    )),

    customColumn<Offer>("buyQuantity", "Deal", (value, row) => (
      <span className="text-sm">
        Buy {value} Get {row.freeQuantity} Free
      </span>
    )),

    customColumn<Offer>("targetProductGroup", "Target Product", (value, row) => (
      <ProductBadge
        name={value?.name}
        color={row.targetProduct}
        size={row.targetVariant}
        variant="outline"
      />
    )),

    customColumn<Offer>("freeProductGroup", "Free Product", (value, row) => (
      <ProductBadge
        name={value?.name}
        color={row.freeProduct}
        size={row.freeVariant}
        variant="secondary"
      />
    )),

    customColumn<Offer>("startDate", "Date Range", (value, row) => (
      <div className="text-sm text-muted-foreground">
        {formatDate(value)} — {formatDate(row.endDate)}
      </div>
    )),

    customColumn<Offer>(
      "isActive",
      "Status",
      (value) => (
        <Badge variant={value ? "success" : "secondary"}>
          {value ? "Active" : "Inactive"}
        </Badge>
      ),
      { filterable: true, sortable: true }
    ),

    actionsColumn<Offer>(offerActions),
  ];
};
