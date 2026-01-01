// src/features/admin/inventory/components/inventory-view-modal.tsx
import { Package, Calendar, AlertTriangle, Hash } from "lucide-react";
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
import type { InventoryItem } from "@/types/dto/inventory.dto";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: InventoryItem;
}

export function InventoryViewModal({ open, onOpenChange, item }: Props) {
  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return format(new Date(dateString), "MMM dd, yyyy 'at' hh:mm a");
  };

  const isLowStock = item.quantity <= item.lowStockThreshold;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Inventory Details
          </DialogTitle>
          <DialogDescription>
            View stock information for this product variant
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-lg">{item.productName}</h3>
              <p className="text-sm text-muted-foreground font-mono">
                {item.productVariantSku}
              </p>
            </div>
            {isLowStock && (
              <Badge variant="destructive" className="flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" /> Low Stock
              </Badge>
            )}
          </div>

          <Separator />

          {/* Variant Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium">Color</p>
              <p className="text-sm text-muted-foreground">{item.colorName}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Size</p>
              <Badge variant="outline">{item.size}</Badge>
            </div>
          </div>

          {/* Stock Info */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Current Stock</p>
              <p
                className={`text-2xl font-bold font-mono ${
                  isLowStock ? "text-destructive" : ""
                }`}
              >
                {item.quantity}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Low Stock Threshold</p>
              <p className="text-2xl font-bold font-mono text-muted-foreground">
                {item.lowStockThreshold}
              </p>
            </div>
          </div>

          {/* Batch Info */}
          {item.batchNumber && (
            <div className="flex items-start gap-3">
              <Hash className="h-4 w-4 mt-1 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Batch Number</p>
                <p className="text-sm text-muted-foreground font-mono">
                  {item.batchNumber}
                </p>
              </div>
            </div>
          )}

          <Separator />

          {/* Timestamp */}
          <div className="flex items-start gap-2">
            <Calendar className="h-4 w-4 mt-0.5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Last Updated</p>
              <p className="text-muted-foreground text-xs">
                {formatDate(item.updatedAt)}
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
