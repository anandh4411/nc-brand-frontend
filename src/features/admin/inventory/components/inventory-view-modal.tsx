// src/features/admin/inventory/components/inventory-view-modal.tsx
import { Package, AlertTriangle, Hash } from "lucide-react";
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
              <h3 className="font-semibold text-lg">{item.variant.productName}</h3>
              <p className="text-sm text-muted-foreground font-mono">
                {item.variant.sku}
              </p>
            </div>
            {item.isLowStock && (
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
              <p className="text-sm text-muted-foreground">{item.variant.colorName}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Size</p>
              <Badge variant="outline">{item.variant.size}</Badge>
            </div>
          </div>

          {/* Stock Info */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Current Stock</p>
              <p
                className={`text-2xl font-bold font-mono ${
                  item.isLowStock ? "text-destructive" : ""
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
        </div>
      </DialogContent>
    </Dialog>
  );
}
