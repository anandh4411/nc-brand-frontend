// src/features/admin/categories/components/category-view-modal.tsx
import { FolderTree, Calendar, Hash } from "lucide-react";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { Category } from "@/types/dto/product-catalog.dto";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: Category;
  parentCategory?: Category | null;
}

export function CategoryViewModal({
  open,
  onOpenChange,
  category,
  parentCategory,
}: Props) {
  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return format(new Date(dateString), "MMM dd, yyyy 'at' hh:mm a");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FolderTree className="h-5 w-5" />
            Category Details
          </DialogTitle>
          <DialogDescription>
            View complete category information
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Header with status */}
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-lg">{category.name}</h3>
              <p className="text-sm text-muted-foreground font-mono">
                /{category.slug}
              </p>
            </div>
            <Badge variant={category.isActive ? "default" : "secondary"}>
              {category.isActive ? "Active" : "Inactive"}
            </Badge>
          </div>

          <Separator />

          {/* Details */}
          <div className="space-y-3">
            {category.description && (
              <div>
                <p className="text-sm font-medium">Description</p>
                <p className="text-sm text-muted-foreground">
                  {category.description}
                </p>
              </div>
            )}

            <div className="flex items-start gap-3">
              <FolderTree className="h-4 w-4 mt-1 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Parent Category</p>
                <p className="text-sm text-muted-foreground">
                  {parentCategory ? parentCategory.name : "None (Top Level)"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Hash className="h-4 w-4 mt-1 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Sort Order</p>
                <p className="text-sm text-muted-foreground">
                  {category.sortOrder}
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Timestamps */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-start gap-2">
              <Calendar className="h-4 w-4 mt-0.5 text-muted-foreground" />
              <div>
                <p className="font-medium">Created</p>
                <p className="text-muted-foreground text-xs">
                  {formatDate(category.createdAt)}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Calendar className="h-4 w-4 mt-0.5 text-muted-foreground" />
              <div>
                <p className="font-medium">Updated</p>
                <p className="text-muted-foreground text-xs">
                  {formatDate(category.updatedAt)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
