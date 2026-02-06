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
import { Package, Eye, Truck, CheckCircle, Clock, XCircle, Loader2 } from "lucide-react";
import { useCustomerOrders, useCancelOrder } from "@/api/hooks/shop";
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

const formatPrice = (price: number) => {
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

function OrdersPage() {
  const { isAuthenticated, isCustomer } = useAuth();
  const { data: ordersData, isLoading } = useCustomerOrders();
  const cancelOrder = useCancelOrder();

  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [cancellingOrderUuid, setCancellingOrderUuid] = useState<string | null>(null);

  const orders = ordersData?.data || [];

  const handleCancelOrder = () => {
    if (!cancellingOrderUuid) return;
    cancelOrder.mutate(cancellingOrderUuid, {
      onSuccess: () => {
        setCancellingOrderUuid(null);
        setSelectedOrder(null);
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

  // Loading state
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

  // Empty orders
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
        <p className="text-muted-foreground">
          View and manage your orders
        </p>
      </div>

      <div className="space-y-4">
        {orders.map((order: any) => (
          <Card key={order.uuid}>
            <CardHeader className="pb-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <CardTitle className="text-base font-mono">{order.orderNumber}</CardTitle>
                  <Badge variant={getStatusColor(order.status) as any} className="capitalize">
                    {order.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    {formatDate(order.createdAt)}
                  </span>
                  <span className="font-semibold">{formatPrice(order.total)}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {order.items?.slice(0, 2).map((item: any, idx: number) => (
                  <div key={idx} className="flex items-center justify-between text-sm">
                    <div>
                      <p className="font-medium">{item.productName || "Product"}</p>
                      <p className="text-muted-foreground">
                        {item.colorName} / {item.size} × {item.quantity}
                      </p>
                    </div>
                    <span>{formatPrice(item.unitPrice * item.quantity)}</span>
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
                  onClick={() => setSelectedOrder(order)}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  View Details
                </Button>
                {(order.status === "pending" || order.status === "confirmed") && (
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

      {/* Order Details Modal */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedOrder && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3">
                  <DialogTitle className="font-mono">{selectedOrder.orderNumber}</DialogTitle>
                  <Badge variant={getStatusColor(selectedOrder.status) as any} className="capitalize">
                    {selectedOrder.status}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Ordered on {formatDateLong(selectedOrder.createdAt)}
                </p>
              </DialogHeader>

              <div className="space-y-6 mt-4">
                {/* Status */}
                <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                  {getStatusIcon(selectedOrder.status)}
                  <div>
                    <p className="font-medium capitalize">Order {selectedOrder.status}</p>
                    {selectedOrder.status === "delivered" && selectedOrder.deliveredAt && (
                      <p className="text-sm text-muted-foreground">
                        Delivered on {formatDateLong(selectedOrder.deliveredAt)}
                      </p>
                    )}
                    {selectedOrder.status === "shipped" && (
                      <p className="text-sm text-muted-foreground">
                        Your order is on the way
                      </p>
                    )}
                    {(selectedOrder.status === "processing" || selectedOrder.status === "confirmed") && (
                      <p className="text-sm text-muted-foreground">
                        Your order is being prepared
                      </p>
                    )}
                  </div>
                </div>

                {/* Items */}
                <div>
                  <h3 className="font-semibold mb-3">Items ({selectedOrder.items?.length || 0})</h3>
                  <div className="space-y-3">
                    {selectedOrder.items?.map((item: any, idx: number) => (
                      <div key={idx} className="flex gap-4">
                        <img
                          src={item.imageUrl || `https://picsum.photos/seed/${item.sku}/80/80`}
                          alt={item.productName}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <p className="font-medium">{item.productName || "Product"}</p>
                          <p className="text-sm text-muted-foreground">
                            {item.colorName} / {item.size} × {item.quantity}
                          </p>
                        </div>
                        <p className="font-medium">{formatPrice(item.unitPrice * item.quantity)}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Order Summary */}
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-3">Shipping Address</h3>
                    {selectedOrder.shippingAddress && (
                      <div className="text-sm space-y-1">
                        <p className="font-medium">{selectedOrder.shippingAddress.name}</p>
                        <p className="text-muted-foreground">{selectedOrder.shippingAddress.phone}</p>
                        <p className="text-muted-foreground">{selectedOrder.shippingAddress.addressLine1}</p>
                        {selectedOrder.shippingAddress.addressLine2 && (
                          <p className="text-muted-foreground">{selectedOrder.shippingAddress.addressLine2}</p>
                        )}
                        <p className="text-muted-foreground">
                          {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} - {selectedOrder.shippingAddress.pincode}
                        </p>
                      </div>
                    )}
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3">Payment</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Method</span>
                        <span className="uppercase">{selectedOrder.paymentMethod}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Status</span>
                        <Badge variant={selectedOrder.paymentStatus === "paid" ? "default" : "outline"} className="capitalize">
                          {selectedOrder.paymentStatus}
                        </Badge>
                      </div>
                      <Separator />
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span>{formatPrice(selectedOrder.subtotal)}</span>
                      </div>
                      {selectedOrder.discount > 0 && (
                        <div className="flex justify-between text-green-600">
                          <span>Discount</span>
                          <span>-{formatPrice(selectedOrder.discount)}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Shipping</span>
                        <span>{selectedOrder.shipping === 0 ? "Free" : formatPrice(selectedOrder.shipping)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Tax</span>
                        <span>{formatPrice(selectedOrder.tax)}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between font-medium">
                        <span>Total</span>
                        <span>{formatPrice(selectedOrder.total)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                {(selectedOrder.status === "pending" || selectedOrder.status === "confirmed") && (
                  <div className="flex justify-end">
                    <Button
                      variant="destructive"
                      onClick={() => setCancellingOrderUuid(selectedOrder.uuid)}
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Cancel Order
                    </Button>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Cancel Confirmation Dialog */}
      <AlertDialog open={!!cancellingOrderUuid} onOpenChange={() => setCancellingOrderUuid(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Order?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel this order? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={cancelOrder.isPending}>Keep Order</AlertDialogCancel>
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
