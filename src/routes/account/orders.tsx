import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Package,
  Eye,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  Loader2,
  Copy,
  ExternalLink,
  MapPin,
  CreditCard,
} from "lucide-react";
import { toast } from "sonner";
import { useCustomerOrders, useCustomerOrder, useCancelOrder } from "@/api/hooks/shop";
import { useAuth } from "@/context/auth-context";

const getStatusColor = (status: string) => {
  switch (status) {
    case "delivered":
      return "default";
    case "shipped":
      return "secondary";
    case "processing":
    case "confirmed":
      return "outline";
    case "cancelled":
      return "destructive";
    default:
      return "outline";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "delivered":
      return <CheckCircle className="h-5 w-5 text-green-600" />;
    case "shipped":
      return <Truck className="h-5 w-5 text-blue-600" />;
    case "processing":
    case "confirmed":
      return <Clock className="h-5 w-5 text-orange-600" />;
    case "cancelled":
      return <XCircle className="h-5 w-5 text-red-600" />;
    default:
      return <Package className="h-5 w-5" />;
  }
};

const getStatusMessage = (status: string) => {
  switch (status) {
    case "delivered":
      return "Your order has been delivered";
    case "shipped":
      return "Your order is on the way";
    case "processing":
    case "confirmed":
      return "Your order is being prepared";
    case "cancelled":
      return "This order was cancelled";
    case "returned":
      return "This order was returned";
    default:
      return "Order placed, awaiting confirmation";
  }
};

const formatPrice = (price: number | undefined | null) => {
  if (price == null || isNaN(price)) return "—";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
};

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const formatDateLong = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

// ---------- Order Detail Modal (fetches full order) ----------
function OrderDetailModal({
  open,
  onOpenChange,
  orderUuid,
  onCancel,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderUuid: string;
  onCancel: (uuid: string) => void;
}) {
  const { data: orderResponse, isLoading } = useCustomerOrder(open ? orderUuid : "");
  const order = (orderResponse as any)?.data as any;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        {isLoading || !order ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            <DialogHeader>
              <div className="flex items-center gap-3">
                <DialogTitle className="font-mono">
                  {order.orderNumber}
                </DialogTitle>
                <Badge
                  variant={getStatusColor(order.status) as any}
                  className="capitalize"
                >
                  {order.status}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Ordered on {formatDateLong(order.createdAt)}
              </p>
            </DialogHeader>

            <div className="space-y-5 mt-4">
              {/* Status Banner */}
              <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                {getStatusIcon(order.status)}
                <div>
                  <p className="font-medium capitalize">
                    Order {order.status}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {getStatusMessage(order.status)}
                  </p>
                </div>
              </div>

              {/* Tracking Info */}
              {order.trackingId && (
                <div className="p-4 border rounded-lg space-y-2">
                  <div className="flex items-center gap-2">
                    <Truck className="h-4 w-4 text-blue-600" />
                    <h3 className="font-semibold text-sm">
                      Shipping & Tracking
                    </h3>
                  </div>
                  {order.deliveryProvider && (
                    <p className="text-sm text-muted-foreground">
                      Delivery by{" "}
                      <span className="font-medium text-foreground">
                        {order.deliveryProvider}
                      </span>
                    </p>
                  )}
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      Tracking ID:
                    </span>
                    <span className="font-mono font-medium text-sm">
                      {order.trackingId}
                    </span>
                    <button
                      type="button"
                      className="text-muted-foreground hover:text-foreground cursor-pointer"
                      onClick={() => {
                        navigator.clipboard.writeText(order.trackingId);
                        toast.success("Tracking ID copied!");
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
                      Track your shipment{" "}
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  )}
                </div>
              )}

              {/* Items */}
              <div>
                <h3 className="font-semibold mb-3">
                  Items ({order.items?.length || 0})
                </h3>
                <div className="space-y-3">
                  {order.items?.map((item: any, idx: number) => (
                    <div
                      key={item.id || idx}
                      className="flex items-center gap-3 p-3 border rounded-lg"
                    >
                      {item.imageUrl && (
                        <img
                          src={item.imageUrl}
                          alt={item.productName}
                          className="w-14 h-14 object-cover rounded-md shrink-0"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">
                          {item.productName || "Product"}
                        </p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          {item.colorName && <span>{item.colorName}</span>}
                          {item.colorName && item.size && <span>/</span>}
                          {item.size && (
                            <Badge variant="outline" className="text-xs">
                              {item.size}
                            </Badge>
                          )}
                          <span>× {item.quantity}</span>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="font-medium font-mono">
                          {formatPrice(item.total ?? item.unitPrice * item.quantity)}
                        </p>
                        {item.quantity > 1 && (
                          <p className="text-xs text-muted-foreground">
                            {formatPrice(item.unitPrice)} each
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Address & Payment */}
              <div className="grid sm:grid-cols-2 gap-6">
                {/* Shipping Address */}
                {order.shippingAddress && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <h3 className="font-semibold text-sm">
                        Shipping Address
                      </h3>
                    </div>
                    <div className="text-sm space-y-1">
                      <p className="font-medium">
                        {order.shippingAddress.name}
                      </p>
                      <p className="text-muted-foreground">
                        {order.shippingAddress.phone}
                      </p>
                      <p className="text-muted-foreground">
                        {order.shippingAddress.addressLine1}
                      </p>
                      {order.shippingAddress.addressLine2 && (
                        <p className="text-muted-foreground">
                          {order.shippingAddress.addressLine2}
                        </p>
                      )}
                      <p className="text-muted-foreground">
                        {order.shippingAddress.city},{" "}
                        {order.shippingAddress.state} -{" "}
                        {order.shippingAddress.pincode}
                      </p>
                    </div>
                  </div>
                )}

                {/* Payment & Totals */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                    <h3 className="font-semibold text-sm">Payment</h3>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Method</span>
                      <span className="capitalize">
                        {order.paymentMethod === "cod"
                          ? "Cash on Delivery"
                          : order.paymentMethod || "—"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status</span>
                      <Badge
                        variant={
                          order.paymentStatus === "paid"
                            ? "default"
                            : "outline"
                        }
                        className="capitalize"
                      >
                        {order.paymentStatus}
                      </Badge>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>{formatPrice(order.subtotal)}</span>
                    </div>
                    {order.discount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Discount</span>
                        <span>-{formatPrice(order.discount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Shipping</span>
                      <span>
                        {order.shipping === 0
                          ? "Free"
                          : formatPrice(order.shipping)}
                      </span>
                    </div>
                    {order.tax > 0 && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Tax</span>
                        <span>{formatPrice(order.tax)}</span>
                      </div>
                    )}
                    <Separator />
                    <div className="flex justify-between font-medium">
                      <span>Total</span>
                      <span className="font-mono">
                        {formatPrice(order.total)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Cancel Action */}
              {(order.status === "pending" || order.status === "confirmed") && (
                <>
                  <Separator />
                  <div className="flex justify-end">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => onCancel(order.uuid)}
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Cancel Order
                    </Button>
                  </div>
                </>
              )}
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

// ---------- Main Orders Page ----------
function OrdersPage() {
  const { isAuthenticated, isCustomer } = useAuth();
  const { data: ordersData, isLoading } = useCustomerOrders();
  const cancelOrder = useCancelOrder();

  const [selectedOrderUuid, setSelectedOrderUuid] = useState<string | null>(null);
  const [cancellingOrderUuid, setCancellingOrderUuid] = useState<string | null>(null);

  const orders = ordersData?.data || [];

  const handleCancelOrder = () => {
    if (!cancellingOrderUuid) return;
    cancelOrder.mutate(cancellingOrderUuid, {
      onSuccess: () => {
        setCancellingOrderUuid(null);
        setSelectedOrderUuid(null);
      },
    });
  };

  // Not logged in as customer
  if (!isAuthenticated || !isCustomer) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-md mx-auto text-center">
          <Package className="h-16 w-16 mx-auto mb-6 text-muted-foreground" />
          <h1 className="text-2xl font-bold mb-4">Please sign in</h1>
          <p className="text-muted-foreground mb-8">
            Sign in to view your orders.
          </p>
          <Button asChild>
            <Link to="/sign-in" search={{ type: "customer" }}>
              Sign In
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  // Loading
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Skeleton className="h-8 w-40 mb-2" />
          <Skeleton className="h-4 w-48" />
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader className="pb-3">
                <Skeleton className="h-6 w-full" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Empty
  if (orders.length === 0) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-md mx-auto text-center">
          <Package className="h-16 w-16 mx-auto mb-6 text-muted-foreground" />
          <h1 className="text-2xl font-bold mb-4">No orders yet</h1>
          <p className="text-muted-foreground mb-8">
            Start shopping to see your orders here.
          </p>
          <Button asChild>
            <Link to="/shop/products">Browse Products</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Order History</h1>
        <p className="text-muted-foreground">View and manage your orders</p>
      </div>

      <div className="space-y-4">
        {orders.map((order: any) => (
          <Card key={order.uuid}>
            <CardHeader className="pb-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <CardTitle className="text-base font-mono">
                    {order.orderNumber}
                  </CardTitle>
                  <Badge
                    variant={getStatusColor(order.status) as any}
                    className="capitalize"
                  >
                    {order.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    {formatDate(order.createdAt)}
                  </span>
                  <span className="font-semibold">
                    {formatPrice(order.total)}
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {order.items?.slice(0, 2).map((item: any, idx: number) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between text-sm"
                  >
                    <div>
                      <p className="font-medium">
                        {item.productName || "Product"}
                      </p>
                      <p className="text-muted-foreground">
                        {item.colorName} / {item.size} × {item.quantity}
                      </p>
                    </div>
                    <span>
                      {formatPrice(item.total ?? item.unitPrice * item.quantity)}
                    </span>
                  </div>
                ))}
                {order.items?.length > 2 && (
                  <p className="text-sm text-muted-foreground">
                    +{order.items.length - 2} more item(s)
                  </p>
                )}
              </div>
              <div className="flex gap-2 mt-4 pt-4 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedOrderUuid(order.uuid)}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  View Details
                </Button>
                {(order.status === "pending" ||
                  order.status === "confirmed") && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-destructive hover:text-destructive"
                    onClick={() => setCancellingOrderUuid(order.uuid)}
                  >
                    <XCircle className="h-4 w-4 mr-1" />
                    Cancel
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Order Details Modal — fetches full order data */}
      {selectedOrderUuid && (
        <OrderDetailModal
          open={!!selectedOrderUuid}
          onOpenChange={() => setSelectedOrderUuid(null)}
          orderUuid={selectedOrderUuid}
          onCancel={(uuid) => setCancellingOrderUuid(uuid)}
        />
      )}

      {/* Cancel Confirmation Dialog */}
      <AlertDialog
        open={!!cancellingOrderUuid}
        onOpenChange={() => setCancellingOrderUuid(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Order?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel this order? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={cancelOrder.isPending}>
              Keep Order
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancelOrder}
              disabled={cancelOrder.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {cancelOrder.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Cancelling...
                </>
              ) : (
                "Cancel Order"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export const Route = createFileRoute("/account/orders")({
  component: OrdersPage,
});
