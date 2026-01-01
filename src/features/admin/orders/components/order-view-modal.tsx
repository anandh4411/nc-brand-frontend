// src/features/admin/orders/components/order-view-modal.tsx
import { ShoppingCart, Calendar, Package, MapPin, CreditCard, User } from "lucide-react";
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
import type { Order, OrderStatus, PaymentStatus } from "@/types/dto/order.dto";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: Order;
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
};

const getOrderStatusVariant = (status: OrderStatus) => {
  switch (status) {
    case "delivered": return "default";
    case "shipped":
    case "processing": return "secondary";
    case "cancelled":
    case "returned": return "destructive";
    default: return "outline";
  }
};

const getPaymentStatusVariant = (status: PaymentStatus) => {
  switch (status) {
    case "paid": return "default";
    case "refunded": return "secondary";
    case "failed": return "destructive";
    default: return "outline";
  }
};

export function OrderViewModal({ open, onOpenChange, order }: Props) {
  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return format(new Date(dateString), "MMM dd, yyyy 'at' hh:mm a");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Order Details
          </DialogTitle>
          <DialogDescription>
            View complete order information
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[70vh] pr-4">
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-lg font-mono">
                  {order.orderNumber}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {formatDate(order.createdAt)}
                </p>
              </div>
              <div className="flex gap-2">
                <Badge variant={getOrderStatusVariant(order.status) as any} className="capitalize">
                  {order.status}
                </Badge>
                <Badge variant={getPaymentStatusVariant(order.paymentStatus) as any} className="capitalize">
                  {order.paymentStatus}
                </Badge>
              </div>
            </div>

            <Separator />

            {/* Customer Info */}
            <div className="flex items-start gap-3">
              <User className="h-4 w-4 mt-1 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Customer</p>
                <p className="text-sm text-muted-foreground">{order.customerName}</p>
                <p className="text-sm text-muted-foreground">{order.customerEmail}</p>
              </div>
            </div>

            {/* Addresses */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 mt-1 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Shipping Address</p>
                  <p className="text-sm text-muted-foreground">
                    {order.shippingAddress.name}<br />
                    {order.shippingAddress.addressLine1}<br />
                    {order.shippingAddress.addressLine2 && (
                      <>{order.shippingAddress.addressLine2}<br /></>
                    )}
                    {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}<br />
                    {order.shippingAddress.phone}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CreditCard className="h-4 w-4 mt-1 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Payment Info</p>
                  <p className="text-sm text-muted-foreground capitalize">
                    {order.paymentMethod === "cod" ? "Cash on Delivery" : "Razorpay"}
                  </p>
                  {order.razorpayPaymentId && (
                    <p className="text-xs text-muted-foreground font-mono">
                      ID: {order.razorpayPaymentId}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <Separator />

            {/* Items */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Package className="h-4 w-4" />
                <span className="font-medium">Items ({order.items.length})</span>
              </div>

              <div className="space-y-2">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex-1">
                      <p className="font-medium">{item.productSnapshot.productGroupName}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span className="font-mono">{item.productSnapshot.sku}</span>
                        <span>•</span>
                        <span>{item.productSnapshot.colorName}</span>
                        <span>•</span>
                        <Badge variant="outline" className="text-xs">
                          {item.productSnapshot.size}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-mono font-medium">{formatPrice(item.totalPrice)}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.quantity} × {formatPrice(item.unitPrice)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Order Summary */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-mono">{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tax (18% GST)</span>
                <span className="font-mono">{formatPrice(order.tax)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span className="font-mono">
                  {order.shippingFee === 0 ? "Free" : formatPrice(order.shippingFee)}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between font-medium">
                <span>Total</span>
                <span className="font-mono text-lg">{formatPrice(order.total)}</span>
              </div>
            </div>

            {/* Notes */}
            {order.notes && (
              <>
                <Separator />
                <div>
                  <p className="text-sm font-medium mb-1">Notes</p>
                  <p className="text-sm text-muted-foreground">{order.notes}</p>
                </div>
              </>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
