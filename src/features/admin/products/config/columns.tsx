// src/features/admin/products/config/columns.tsx
import { ColumnDef } from "@tanstack/react-table";
import {
  customColumn,
  actionsColumn,
} from "@/components/elements/app-data-table/helpers/column-helpers";
import type { ProductGroup, Product, ProductVariant } from "@/types/dto/product-catalog.dto";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Edit, Eye, Trash2, Star } from "lucide-react";

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

export const createProductColumns = (
  onView: (product: ProductGroup) => void,
  onEdit: (product: ProductGroup) => void,
  onDelete: (product: ProductGroup) => void
): ColumnDef<ProductGroup>[] => {
  const productActions = [
    {
      label: "View Details",
      icon: Eye,
      onClick: onView,
    },
    {
      label: "Edit",
      icon: Edit,
      onClick: onEdit,
    },
    {
      label: "Delete",
      icon: Trash2,
      onClick: onDelete,
      className: "text-destructive",
      separator: true,
    },
  ];

  return [
    {
      id: "slNo",
      header: "#",
      cell: ({ row }) => (
        <span className="text-muted-foreground text-sm">{row.index + 1}</span>
      ),
      enableSorting: false,
      enableHiding: false,
      meta: { className: "w-12" },
    } as ColumnDef<ProductGroup>,

    customColumn<ProductGroup>("name", "Product Name", (value, row) => (
      <div className="flex items-center gap-2">
        <span className="font-medium max-w-[200px] truncate" title={value}>
          {value || "N/A"}
        </span>
        {row.isFeatured && (
          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
        )}
      </div>
    )),

    customColumn<ProductGroup>("category", "Category", (value) => (
      <Badge variant="outline">{value?.name || "N/A"}</Badge>
    )),

    customColumn<ProductGroup>("basePrice", "Price", (value, row) => (
      <div className="font-mono font-medium">
        {row.offerPrice ? (
          <div className="flex flex-col">
            <span>{formatPrice(row.offerPrice)}</span>
            <span className="text-xs text-muted-foreground line-through">{formatPrice(value)}</span>
          </div>
        ) : (
          formatPrice(value)
        )}
      </div>
    )),

    {
      id: "colors",
      accessorKey: "colorVariants",
      header: "Colors",
      cell: ({ row }) => {
        const colors = row.original.colorVariants || [];
        return (
          <div className="flex items-center gap-1">
            {colors.slice(0, 4).map((color: Product, idx: number) => (
              <div
                key={idx}
                className="h-5 w-5 rounded-full border border-gray-300"
                style={{ backgroundColor: color.colorCode }}
                title={color.colorName}
              />
            ))}
            {colors.length > 4 && (
              <span className="text-xs text-muted-foreground ml-1">
                +{colors.length - 4}
              </span>
            )}
          </div>
        );
      },
    },

    {
      id: "sizes",
      accessorKey: "colorVariants",
      header: "Sizes",
      cell: ({ row }) => {
        const colors = row.original.colorVariants || [];
        const allSizes = new Set<string>();
        colors.forEach((color: Product) => {
          color.sizeVariants.forEach((sv: ProductVariant) => allSizes.add(sv.size));
        });
        return (
          <div className="text-sm text-muted-foreground">
            {Array.from(allSizes).slice(0, 3).join(", ")}
            {allSizes.size > 3 && ` +${allSizes.size - 3}`}
          </div>
        );
      },
    },

    customColumn<ProductGroup>("attributes", "Fabric", (value) => (
      <div className="capitalize">{value?.fabricType || "N/A"}</div>
    )),

    customColumn<ProductGroup>(
      "isActive",
      "Status",
      (value) => (
        <Badge variant={value ? "success" : "secondary"}>
          {value ? "Active" : "Inactive"}
        </Badge>
      ),
      { filterable: true, sortable: true }
    ),

    customColumn<ProductGroup>("createdAt", "Created", (value) => (
      <div className="text-muted-foreground text-sm">{formatDate(value)}</div>
    )),

    actionsColumn<ProductGroup>(productActions),
  ];
};
