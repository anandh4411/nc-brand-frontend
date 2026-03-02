// src/features/admin/orders/components/order-view-modal.tsx
import { ShoppingCart, Package, MapPin, CreditCard, User, Loader2, Clock, Truck, Copy, ExternalLink } from "lucide-react";
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
import { useAdminOrder } from "@/api/hooks/admin";
import { toast } from "sonner";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: { uuid: string; orderNumber: string };
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
};

const getOrderStatusVariant = (status: string) => {
  const s = status?.toLowerCase();
  switch (s) {
    case "delivered": return "default";
    case "shipped":
    case "processing":
    case "confirmed": return "secondary";
    case "cancelled":
    case "returned": return "destructive";
    default: return "outline";
  }
};

const getPaymentStatusVariant = (status: string) => {
  const s = status?.toLowerCase();
  switch (s) {
    case "paid": return "default";
    case "refunded": return "secondary";
    case "failed": return "destructive";
    default: return "outline";
  }
};

export function OrderViewModal({ open, onOpenChange, order: orderRef }: Props) {
  const { data: orderResponse, isLoading } = useAdminOrder(open ? orderRef.uuid : "");
  const order = (orderResponse as any)?.data as any;

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

        {isLoading || !order ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
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
                  {order.paymentStatus !== order.status && (
                    <Badge variant={getPaymentStatusVariant(order.paymentStatus) as any} className="capitalize">
                      Payment: {order.paymentStatus}
                    </Badge>
                  )}
                </div>
              </div>

              <Separator />

              {/* Customer Info */}
              {order.customer && (
                <div className="flex items-start gap-3">
                  <User className="h-4 w-4 mt-1 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Customer</p>
                    <p className="text-sm text-muted-foreground">{order.customer.name}</p>
                    <p className="text-sm text-muted-foreground">{order.customer.email}</p>
                    {order.customer.phone && (
                      <p className="text-sm text-muted-foreground">{order.customer.phone}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Addresses & Payment */}
              <div className="grid grid-cols-2 gap-4">
                {order.shippingAddress && (
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
                )}
                <div className="flex items-start gap-3">
                  <CreditCard className="h-4 w-4 mt-1 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Payment Info</p>
                    <p className="text-sm text-muted-foreground capitalize">
                      {order.paymentMethod === "cod" ? "Cash on Delivery" : "Online Payment"}
                    </p>
                    <p className="text-sm text-muted-foreground capitalize">
                      Status: {order.paymentStatus}
                    </p>
                    {order.razorpayPaymentId && (
                      <p className="text-xs text-muted-foreground font-mono mt-1">
                        Razorpay ID: {order.razorpayPaymentId}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Tracking Info */}
              {order.trackingId && (
                <>
                  <Separator />
                  <div className="flex items-start gap-3">
                    <Truck className="h-4 w-4 mt-1 text-muted-foreground" />
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium">Shipping & Tracking</p>
                      {order.deliveryProvider && (
                        <p className="text-sm text-muted-foreground">
                          Provider: <span className="font-medium text-foreground">{order.deliveryProvider}</span>
                        </p>
                      )}
                      <div className="flex items-center gap-2">
                        <p className="text-sm text-muted-foreground">
                          Tracking ID: <span className="font-mono font-medium text-foreground">{order.trackingId}</span>
                        </p>
                        <button
                          type="button"
                          className="text-muted-foreground hover:text-foreground cursor-pointer"
                          onClick={() => {
                            navigator.clipboard.writeText(order.trackingId);
                            toast.success("Tracking ID copied");
                          }}
                        >
                          <Copy className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      {order.trackingUrl && (
                        <a
                          href={order.trackingUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                        >
                          Track Shipment <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                </>
              )}

              {/* Coupon */}
              {order.coupon && (
                <>
                  <Separator />
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-muted-foreground">Coupon Applied:</span>
                    <Badge variant="secondary" className="font-mono">{order.coupon.code}</Badge>
                  </div>
                </>
              )}

              <Separator />

              {/* Items */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Package className="h-4 w-4" />
                  <span className="font-medium">Items ({order.items?.length || 0})</span>
                </div>

                <div className="space-y-2">
                  {order.items?.map((item: any, idx: number) => {
                    const snap = item.productSnapshot || {};
                    const name = item.productName || snap.productGroupName || snap.productName || "Product";
                    const color = item.colorName || snap.colorName || "";
                    const size = item.size || snap.size || "";
                    const sku = item.sku || snap.sku || "";
                    const imageUrl = item.imageUrl || snap.imageUrl;
                    const total = item.total ?? item.totalPrice ?? item.unitPrice * item.quantity;

                    return (
                      <div
                        key={item.id || idx}
                        className="flex items-center gap-3 p-3 border rounded-lg"
                      >
                        {imageUrl && (
                          <img
                            src={imageUrl}
                            alt={name}
                            className="w-12 h-12 object-cover rounded-md shrink-0"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{name}</p>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
                            {sku && <span className="font-mono">{sku}</span>}
                            {sku && color && <span>•</span>}
                            {color && <span>{color}</span>}
                            {size && <span>•</span>}
                            {size && (
                              <Badge variant="outline" className="text-xs">
                                {size}
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="font-mono font-medium">{formatPrice(total)}</p>
                          <p className="text-xs text-muted-foreground">
                            {item.quantity} × {formatPrice(item.unitPrice)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <Separator />

              {/* Order Summary */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-mono">{formatPrice(order.subtotal || 0)}</span>
                </div>
                {(order.discount || 0) > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Discount</span>
                    <span className="font-mono">-{formatPrice(order.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax (GST)</span>
                  <span className="font-mono">{formatPrice(order.tax || 0)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="font-mono">
                    {(order.shipping || 0) === 0 ? "Free" : formatPrice(order.shipping)}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between font-medium">
                  <span>Total</span>
                  <span className="font-mono text-lg">{formatPrice(order.total)}</span>
                </div>
              </div>

              {/* Status History */}
              {order.statusHistory?.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Clock className="h-4 w-4" />
                      <span className="font-medium">Status History</span>
                    </div>
                    <div className="space-y-2">
                      {order.statusHistory.map((entry: any, idx: number) => (
                        <div key={entry.id || idx} className="flex items-center justify-between text-sm py-1.5 border-b last:border-b-0">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="capitalize text-xs">{entry.status}</Badge>
                            {entry.notes && (
                              <span className="text-muted-foreground">{entry.notes}</span>
                            )}
                          </div>
                          <span className="text-muted-foreground text-xs">
                            {formatDate(entry.createdAt)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

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
        )}
      </DialogContent>
    </Dialog>
  );
}
