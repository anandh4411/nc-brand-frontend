// src/features/admin/categories/config/columns.tsx
import { ColumnDef } from "@tanstack/react-table";
import {
  selectColumn,
  customColumn,
  actionsColumn,
} from "@/components/elements/app-data-table/helpers/column-helpers";
import type { Category } from "@/types/dto/product-catalog.dto";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Edit, Eye, Trash2, FolderTree } from "lucide-react";

const formatDate = (dateString?: string) => {
  if (!dateString) return "N/A";
  return format(new Date(dateString), "MMM dd, yyyy");
};

export const createCategoryColumns = (
  onView: (category: Category) => void,
  onEdit: (category: Category) => void,
  onDelete: (category: Category) => void,
  categories: Category[]
): ColumnDef<Category>[] => {
  const getParentName = (parentId: number | null) => {
    if (!parentId) return null;
    const parent = categories.find((c) => c.id === parentId);
    return parent?.name || "Unknown";
  };

  const categoryActions = [
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
    selectColumn<Category>(),

    customColumn<Category>("name", "Category Name", (value, row) => (
      <div className="flex items-center gap-2">
        {row.parentId && <span className="text-muted-foreground">↳</span>}
        <span className="font-medium">{value || "N/A"}</span>
      </div>
    )),

    customColumn<Category>("slug", "Slug", (value) => (
      <div className="font-mono text-sm text-muted-foreground">{value || "N/A"}</div>
    )),

    customColumn<Category>("parentId", "Parent Category", (value) => {
      const parentName = getParentName(value);
      return parentName ? (
        <div className="flex items-center gap-1">
          <FolderTree className="h-3 w-3 text-muted-foreground" />
          <span>{parentName}</span>
        </div>
      ) : (
        <span className="text-muted-foreground">—</span>
      );
    }),

    customColumn<Category>(
      "isActive",
      "Status",
      (value) => (
        <Badge variant={value ? "success" : "secondary"}>
          {value ? "Active" : "Inactive"}
        </Badge>
      ),
      { filterable: true, sortable: true }
    ),

    customColumn<Category>("createdAt", "Created", (value) => (
      <div className="text-muted-foreground text-sm">{formatDate(value)}</div>
    )),

    actionsColumn<Category>(categoryActions),
  ];
};
