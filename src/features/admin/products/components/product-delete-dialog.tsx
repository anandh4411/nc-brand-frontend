// src/features/admin/products/components/product-delete-dialog.tsx
import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ConfirmDialog } from "@/components/confirm-dialog";
import type { ProductGroup } from "@/types/dto/product-catalog.dto";
import { toast } from "sonner";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: ProductGroup;
  onConfirm?: () => void;
  isDeleting?: boolean;
}

export function ProductDeleteDialog({
  open,
  onOpenChange,
  product,
  onConfirm,
  isDeleting: externalIsDeleting,
}: Props) {
  const [value, setValue] = useState("");
  const [internalIsDeleting, setInternalIsDeleting] = useState(false);
  const isDeleting = externalIsDeleting ?? internalIsDeleting;

  const handleDelete = async () => {
    if (value.trim() !== product.name) return;

    if (onConfirm) {
      onConfirm();
      setValue("");
      return;
    }

    setInternalIsDeleting(true);
    try {
      console.log("Delete product:", product.uuid);
      await new Promise((r) => setTimeout(r, 500));
      toast.success("Product deleted successfully");
      onOpenChange(false);
      setValue("");
    } catch (error) {
      toast.error("Failed to delete product");
      console.error("Failed to delete product:", error);
    } finally {
      setInternalIsDeleting(false);
    }
  };

  const handleClose = (open: boolean) => {
    setValue("");
    onOpenChange(open);
  };

  const totalVariants = (product.colorVariants || []).reduce(
    (acc, color) => acc + (color.sizeVariants?.length || 0),
    0
  );

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={handleClose}
      handleConfirm={handleDelete}
      disabled={value.trim() !== product.name || isDeleting}
      title={
        <span className="text-destructive">
          <AlertTriangle
            className="stroke-destructive mr-1 inline-block"
            size={18}
          />{" "}
          Delete Product
        </span>
      }
      desc={
        <div className="space-y-4">
          <p className="mb-2">
            Are you sure you want to delete{" "}
            <span className="font-bold">{product.name}</span>?
            <br />
            This will remove the product along with{" "}
            <span className="font-bold">{product.colorVariants?.length || 0}</span>{" "}
            color variant(s) and{" "}
            <span className="font-bold">{totalVariants}</span> size variant(s).
          </p>

          <Label className="my-2">
            Product Name:
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Enter product name to confirm deletion"
            />
          </Label>

          <Alert variant="destructive">
            <AlertTitle>Warning!</AlertTitle>
            <AlertDescription>
              This action cannot be undone. All associated inventory, images,
              and order history references will be affected.
            </AlertDescription>
          </Alert>
        </div>
      }
      confirmText={isDeleting ? "Deleting..." : "Delete"}
      destructive
    />
  );
}
