import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Download, Package, Truck, CheckCircle, Clock } from "lucide-react";

// Mock order data
const mockOrderDetails: Record<string, any> = {
  "NCB-2024-0001": {
    id: "NCB-2024-0001",
    date: "2024-12-28",
    status: "delivered",
    deliveredDate: "2024-12-31",
    paymentMethod: "UPI",
    paymentStatus: "paid",
    shippingAddress: {
      name: "John Doe",
      phone: "+91 98765 43210",
      address: "123, MG Road, Koramangala",
      city: "Bangalore",
      state: "Karnataka",
      pincode: "560034",
    },
    items: [
      {
        id: 1,
        name: "Banarasi Silk Saree",
        color: "Royal Blue",
        size: "Free Size",
        qty: 1,
        price: 4599,
        image: "https://picsum.photos/seed/saree1/100/100",
      },
    ],
    subtotal: 4599,
    shipping: 0,
    tax: 0,
    total: 4599,
  },
  "NCB-2024-0002": {
    id: "NCB-2024-0002",
    date: "2024-12-25",
    status: "shipped",
    trackingNumber: "TRACK123456789",
    paymentMethod: "Card",
    paymentStatus: "paid",
    shippingAddress: {
      name: "John Doe",
      phone: "+91 98765 43210",
      address: "123, MG Road, Koramangala",
      city: "Bangalore",
      state: "Karnataka",
      pincode: "560034",
    },
    items: [
      {
        id: 2,
        name: "Cotton Casual Kurti",
        color: "Maroon",
        size: "M",
        qty: 2,
        price: 1099,
        image: "https://picsum.photos/seed/kurti1/100/100",
      },
    ],
    subtotal: 2198,
    shipping: 0,
    tax: 1,
    total: 2199,
  },
  "NCB-2024-0003": {
    id: "NCB-2024-0003",
    date: "2024-12-20",
    status: "processing",
    paymentMethod: "COD",
    paymentStatus: "pending",
    shippingAddress: {
      name: "John Doe",
      phone: "+91 98765 43210",
      address: "123, MG Road, Koramangala",
      city: "Bangalore",
      state: "Karnataka",
      pincode: "560034",
    },
    items: [
      {
        id: 3,
        name: "Bridal Lehenga Set",
        color: "Gold",
        size: "L",
        qty: 1,
        price: 8999,
        image: "https://picsum.photos/seed/lehenga1/100/100",
      },
    ],
    subtotal: 8999,
    shipping: 0,
    tax: 0,
    total: 8999,
  },
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "delivered":
      return "default";
    case "shipped":
      return "secondary";
    case "processing":
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
  const order = mockOrderDetails[orderId];

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
    // TODO: Implement invoice download
    console.log("Downloading invoice for:", orderId);
  };

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
            <h1 className="text-2xl font-bold font-mono">{order.id}</h1>
            <Badge variant={getStatusColor(order.status) as any} className="capitalize">
              {order.status}
            </Badge>
          </div>
          <p className="text-muted-foreground">
            Ordered on {formatDate(order.date)}
          </p>
        </div>
        {order.status === "delivered" && (
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
              {order.status === "delivered" && order.deliveredDate && (
                <p className="text-sm text-muted-foreground">
                  Delivered on {formatDate(order.deliveredDate)}
                </p>
              )}
              {order.status === "shipped" && order.trackingNumber && (
                <p className="text-sm text-muted-foreground">
                  Tracking Number: <span className="font-mono">{order.trackingNumber}</span>
                </p>
              )}
              {order.status === "processing" && (
                <p className="text-sm text-muted-foreground">
                  Your order is being prepared for shipment
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Items ({order.items.length})</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {order.items.map((item: any) => (
                <div key={item.id} className="flex gap-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {item.color} / {item.size}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Qty: {item.qty}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{formatPrice(item.price * item.qty)}</p>
                    {item.qty > 1 && (
                      <p className="text-sm text-muted-foreground">
                        {formatPrice(item.price)} each
                      </p>
                    )}
                  </div>
                </div>
              ))}
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
                <span>{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span>{order.shipping === 0 ? "Free" : formatPrice(order.shipping)}</span>
              </div>
              {order.tax > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax</span>
                  <span>{formatPrice(order.tax)}</span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between font-medium">
                <span>Total</span>
                <span>{formatPrice(order.total)}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Payment Method</span>
                <span>{order.paymentMethod}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Payment Status</span>
                <Badge variant={order.paymentStatus === "paid" ? "default" : "outline"} className="capitalize">
                  {order.paymentStatus}
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
                <p className="font-medium">{order.shippingAddress.name}</p>
                <p className="text-muted-foreground">{order.shippingAddress.phone}</p>
                <p className="text-muted-foreground">{order.shippingAddress.address}</p>
                <p className="text-muted-foreground">
                  {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
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
