// src/features/admin/shipments/components/shipment-view-modal.tsx
import { Truck, Calendar, Package, Store, User } from "lucide-react";
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
import type { Shipment, ShipmentStatus } from "@/types/dto/inventory.dto";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  shipment: Shipment;
}

const getStatusVariant = (
  status: ShipmentStatus
): "default" | "secondary" | "destructive" | "outline" => {
  switch (status) {
    case "delivered":
      return "default";
    case "shipped":
      return "secondary";
    case "cancelled":
      return "destructive";
    default:
      return "outline";
  }
};

export function ShipmentViewModal({ open, onOpenChange, shipment }: Props) {
  const formatDate = (dateString?: string | null) => {
    if (!dateString) return "—";
    return format(new Date(dateString), "MMM dd, yyyy 'at' hh:mm a");
  };

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
          <DialogDescription>
            View shipment information and items
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[70vh] pr-4">
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-lg font-mono">
                  SHP-{String(shipment.id).padStart(4, "0")}
                </h3>
                <p className="text-sm text-muted-foreground">{shipment.uuid}</p>
              </div>
              <Badge variant={getStatusVariant(shipment.status)}>
                {shipment.status.charAt(0).toUpperCase() + shipment.status.slice(1)}
              </Badge>
            </div>

            <Separator />

            {/* Outlet & Creator Info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <Store className="h-4 w-4 mt-1 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Destination Outlet</p>
                  <p className="text-sm text-muted-foreground">
                    {shipment.outletName}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <User className="h-4 w-4 mt-1 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Created By</p>
                  <p className="text-sm text-muted-foreground">
                    {shipment.createdByName || "Unknown"}
                  </p>
                </div>
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

            {/* Notes */}
            {shipment.notes && (
              <div>
                <p className="text-sm font-medium mb-1">Notes</p>
                <p className="text-sm text-muted-foreground">{shipment.notes}</p>
              </div>
            )}

            <Separator />

            {/* Items */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  <span className="font-medium">
                    Items ({shipment.items.length})
                  </span>
                </div>
                <div className="text-sm text-muted-foreground">
                  Total: {totalQuantity} units
                  {shipment.status === "delivered" && ` (${totalReceived} received)`}
                </div>
              </div>

              <div className="space-y-2">
                {shipment.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex-1">
                      <p className="font-medium">{item.productName}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span className="font-mono">{item.productVariantSku}</span>
                        <span>•</span>
                        <span>{item.colorName}</span>
                        <span>•</span>
                        <Badge variant="outline" className="text-xs">
                          {item.size}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-mono font-medium">{item.quantity}</p>
                      {item.receivedQuantity !== undefined && (
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
