// src/features/admin/outlets/profile/components/stock-view-modal.tsx
import { Truck, Package, User } from "lucide-react";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import type { OutletShipmentItem } from "@/api/endpoints/admin";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  shipment: OutletShipmentItem;
}

const getStatusVariant = (
  status: string
): "default" | "secondary" | "destructive" | "outline" => {
  switch (status) {
    case "DELIVERED": return "default";
    case "SHIPPED": return "secondary";
    case "CANCELLED": return "destructive";
    default: return "outline";
  }
};

export function StockViewModal({ open, onOpenChange, shipment }: Props) {
  const totalQuantity = shipment.items.reduce((acc, item) => acc + item.quantity, 0);
  const totalReceived = shipment.items.reduce(
    (acc, item) => acc + (item.receivedQuantity || 0),
    0
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5" />
            Shipment Details
          </DialogTitle>
          <DialogDescription>View shipment information and items</DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[70vh] pr-4">
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-lg font-mono">
                  {shipment.uuid.substring(0, 8).toUpperCase()}
                </h3>
                <p className="text-sm text-muted-foreground">{shipment.uuid}</p>
              </div>
              <Badge variant={getStatusVariant(shipment.status)} className="capitalize">
                {shipment.status.toLowerCase()}
              </Badge>
            </div>

            <Separator />

            {/* Creator Info */}
            <div className="flex items-start gap-3">
              <User className="h-4 w-4 mt-1 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Created By</p>
                <p className="text-sm text-muted-foreground">
                  {shipment.createdBy?.name || "Unknown"}
                </p>
              </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-3 gap-4 p-4 bg-muted rounded-lg">
              <div className="text-center">
                <p className="text-xs text-muted-foreground">Created</p>
                <p className="text-sm font-medium">
                  {format(new Date(shipment.createdAt), "MMM dd, yyyy")}
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground">Shipped</p>
                <p className="text-sm font-medium">
                  {shipment.shippedAt
                    ? format(new Date(shipment.shippedAt), "MMM dd, yyyy")
                    : "—"}
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground">Delivered</p>
                <p className="text-sm font-medium">
                  {shipment.deliveredAt
                    ? format(new Date(shipment.deliveredAt), "MMM dd, yyyy")
                    : "—"}
                </p>
              </div>
            </div>

            <Separator />

            {/* Items */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  <span className="font-medium">Items ({shipment.items.length})</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  Total: {totalQuantity} units
                  {shipment.status === "DELIVERED" && ` (${totalReceived} received)`}
                </div>
              </div>
              <div className="space-y-2">
                {shipment.items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium">{item.name}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span className="font-mono">{item.sku}</span>
                        <span>•</span>
                        <span>{item.color}</span>
                        <span>•</span>
                        <Badge variant="outline" className="text-xs">{item.size}</Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-mono font-medium">{item.quantity}</p>
                      {item.receivedQuantity !== undefined && item.receivedQuantity > 0 && (
                        <p className="text-xs text-muted-foreground">
                          Received: {item.receivedQuantity}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
