// src/features/admin/outlets/profile/components/sale-view-modal.tsx
import { ShoppingCart, Package, CreditCard, User } from "lucide-react";
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
import type { OutletSaleItem } from "@/api/endpoints/admin";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sale: OutletSaleItem;
}

const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);

const getStatusVariant = (status: string) => {
  switch (status) {
    case "COMPLETED": return "default";
    case "PENDING": return "secondary";
    case "CANCELLED":
    case "REFUNDED": return "destructive";
    default: return "outline";
  }
};

export function SaleViewModal({ open, onOpenChange, sale }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Sale Details
          </DialogTitle>
          <DialogDescription>View POS sale transaction details</DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[70vh] pr-4">
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-lg font-mono">{sale.invoiceNumber}</h3>
                <p className="text-sm text-muted-foreground">
                  {sale.date} at {sale.time}
                </p>
              </div>
              <Badge variant={getStatusVariant(sale.status) as any} className="capitalize">
                {sale.status.toLowerCase()}
              </Badge>
            </div>

            <Separator />

            {/* Customer & Payment */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <User className="h-4 w-4 mt-1 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Customer</p>
                  <p className="text-sm text-muted-foreground">{sale.customerName}</p>
                  {sale.customerPhone && (
                    <p className="text-sm text-muted-foreground">{sale.customerPhone}</p>
                  )}
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CreditCard className="h-4 w-4 mt-1 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Payment Method</p>
                  <p className="text-sm text-muted-foreground capitalize">{sale.paymentMethod}</p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Items */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Package className="h-4 w-4" />
                <span className="font-medium">Items ({sale.items.length})</span>
              </div>
              <div className="space-y-2">
                {sale.items.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 border rounded-lg">
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
                      <p className="font-mono font-medium">{formatPrice(item.total)}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.quantity} × {formatPrice(item.unitPrice)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Sale Summary */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-mono">{formatPrice(sale.subtotal)}</span>
              </div>
              {sale.discount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Discount</span>
                  <span className="font-mono text-green-600">-{formatPrice(sale.discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tax (GST)</span>
                <span className="font-mono">{formatPrice(sale.tax)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-medium">
                <span>Total</span>
                <span className="font-mono text-lg">{formatPrice(sale.total)}</span>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
