// src/features/admin/categories/components/category-delete-dialog.tsx
import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ConfirmDialog } from "@/components/confirm-dialog";
import type { Category } from "@/types/dto/product-catalog.dto";
import { toast } from "sonner";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: Category;
  hasChildren: boolean;
}

export function CategoryDeleteDialog({
  open,
  onOpenChange,
  category,
  hasChildren,
}: Props) {
  const [value, setValue] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (value.trim() !== category.name) return;

    setIsDeleting(true);
    try {
      // TODO: Replace with actual API call
      console.log("Delete category:", category.uuid);
      await new Promise((r) => setTimeout(r, 500)); // Simulate API
      toast.success("Category deleted successfully");
      onOpenChange(false);
      setValue("");
    } catch (error) {
      toast.error("Failed to delete category");
      console.error("Failed to delete category:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleClose = (open: boolean) => {
    setValue("");
    onOpenChange(open);
  };

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={handleClose}
      handleConfirm={handleDelete}
      disabled={value.trim() !== category.name || isDeleting || hasChildren}
      title={
        <span className="text-destructive">
          <AlertTriangle
            className="stroke-destructive mr-1 inline-block"
            size={18}
          />{" "}
          Delete Category
        </span>
      }
      desc={
        <div className="space-y-4">
          <p className="mb-2">
            Are you sure you want to delete{" "}
            <span className="font-bold">{category.name}</span>?
            <br />
            This action cannot be undone.
          </p>

          {hasChildren && (
            <Alert variant="destructive">
              <AlertTitle>Cannot Delete</AlertTitle>
              <AlertDescription>
                This category has subcategories. Please delete or move the
                subcategories first before deleting this category.
              </AlertDescription>
            </Alert>
          )}

          {!hasChildren && (
            <>
              <Label className="my-2">
                Category Name:
                <Input
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder="Enter category name to confirm deletion"
                />
              </Label>

              <Alert variant="destructive">
                <AlertTitle>Warning!</AlertTitle>
                <AlertDescription>
                  Products in this category will need to be reassigned to
                  another category.
                </AlertDescription>
              </Alert>
            </>
          )}
        </div>
      }
      confirmText={isDeleting ? "Deleting..." : "Delete"}
      destructive
    />
  );
}
