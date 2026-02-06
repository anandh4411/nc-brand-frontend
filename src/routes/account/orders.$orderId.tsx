import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Download, Package, Truck, CheckCircle, Clock } from "lucide-react";
import { useCustomerOrder } from "@/api/hooks/shop";

const getStatusColor = (status: string) => {
  switch (status?.toLowerCase()) {
    case "delivered":
      return "default";
    case "shipped":
      return "secondary";
    case "processing":
    case "pending":
      return "outline";
    case "cancelled":
      return "destructive";
    default:
      return "outline";
  }
};

const getStatusIcon = (status: string) => {
  switch (status?.toLowerCase()) {
    case "delivered":
      return <CheckCircle className="h-5 w-5 text-green-600" />;
    case "shipped":
      return <Truck className="h-5 w-5 text-blue-600" />;
    case "processing":
    case "pending":
      return <Clock className="h-5 w-5 text-orange-600" />;
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
    month: "long",
    year: "numeric",
  });
};

function OrderDetailPage() {
  const { orderId } = useParams({ from: "/account/orders/$orderId" });
  const { data: orderResponse, isLoading } = useCustomerOrder(orderId);

  const order = orderResponse?.data as any;

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-4 mb-6">
          <Skeleton className="h-10 w-10" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-40 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <Package className="h-16 w-16 mx-auto mb-6 text-muted-foreground" />
        <h1 className="text-2xl font-bold mb-4">Order Not Found</h1>
        <p className="text-muted-foreground mb-8">
          The order you're looking for doesn't exist.
        </p>
        <Button asChild>
          <Link to="/account/orders">Back to Orders</Link>
        </Button>
      </div>
    );
  }

  const handleDownloadInvoice = () => {
    console.log("Downloading invoice for:", orderId);
  };

  const items = order.items || [];
  const shippingAddress = order.shippingAddress || {};

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/account/orders">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold font-mono">{order.orderNumber}</h1>
            <Badge variant={getStatusColor(order.status) as any} className="capitalize">
              {order.status}
            </Badge>
          </div>
          <p className="text-muted-foreground">
            Ordered on {formatDate(order.createdAt)}
          </p>
        </div>
        {order.status?.toLowerCase() === "delivered" && (
          <Button variant="outline" onClick={handleDownloadInvoice}>
            <Download className="h-4 w-4 mr-2" />
            Download Invoice
          </Button>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Order Items */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {getStatusIcon(order.status)}
                Order Status: <span className="capitalize">{order.status}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {order.status?.toLowerCase() === "delivered" && order.deliveredAt && (
                <p className="text-sm text-muted-foreground">
                  Delivered on {formatDate(order.deliveredAt)}
                </p>
              )}
              {order.status?.toLowerCase() === "shipped" && order.trackingNumber && (
                <p className="text-sm text-muted-foreground">
                  Tracking Number: <span className="font-mono">{order.trackingNumber}</span>
                </p>
              )}
              {(order.status?.toLowerCase() === "processing" || order.status?.toLowerCase() === "pending") && (
                <p className="text-sm text-muted-foreground">
                  Your order is being prepared for shipment
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Items ({items.length})</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {items.map((item: any, index: number) => {
                const snapshot = item.productSnapshot || {};
                return (
                  <div key={item.uuid || index} className="flex gap-4">
                    <img
                      src={snapshot.imageUrl || `https://picsum.photos/seed/item${index}/100/100`}
                      alt={snapshot.name || "Product"}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium">{snapshot.name || "Product"}</h3>
                      <p className="text-sm text-muted-foreground">
                        {snapshot.colorName || "N/A"} / {snapshot.size || "N/A"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{formatPrice(item.lineTotal || item.unitPrice * item.quantity)}</p>
                      {item.quantity > 1 && (
                        <p className="text-sm text-muted-foreground">
                          {formatPrice(item.unitPrice)} each
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>

        {/* Order Summary & Address */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatPrice(order.subtotal || 0)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span>{(order.shipping || 0) === 0 ? "Free" : formatPrice(order.shipping)}</span>
              </div>
              {(order.discount || 0) > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Discount</span>
                  <span>-{formatPrice(order.discount)}</span>
                </div>
              )}
              {(order.tax || 0) > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax</span>
                  <span>{formatPrice(order.tax)}</span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between font-medium">
                <span>Total</span>
                <span>{formatPrice(order.total || 0)}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Payment Method</span>
                <span>{order.paymentMethod || "N/A"}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Payment Status</span>
                <Badge variant={order.paymentStatus?.toLowerCase() === "paid" ? "default" : "outline"} className="capitalize">
                  {order.paymentStatus || "pending"}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Shipping Address</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm space-y-1">
                <p className="font-medium">{shippingAddress.name || "N/A"}</p>
                <p className="text-muted-foreground">{shippingAddress.phone || ""}</p>
                <p className="text-muted-foreground">{shippingAddress.addressLine1 || shippingAddress.address || ""}</p>
                {shippingAddress.addressLine2 && (
                  <p className="text-muted-foreground">{shippingAddress.addressLine2}</p>
                )}
                <p className="text-muted-foreground">
                  {shippingAddress.city || ""}, {shippingAddress.state || ""} - {shippingAddress.pincode || ""}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/account/orders/$orderId")({
  component: OrderDetailPage,
});
