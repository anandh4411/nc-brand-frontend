import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Package, Download, Eye, Truck, CheckCircle, Clock } from "lucide-react";

interface OrderItem {
  name: string;
  color: string;
  size: string;
  qty: number;
  price: number;
  image?: string;
}

interface Order {
  id: string;
  date: string;
  status: string;
  total: number;
  items: OrderItem[];
  deliveredDate?: string;
  trackingNumber?: string;
  paymentMethod: string;
  paymentStatus: string;
  shippingAddress: {
    name: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
}

// Mock orders data
const mockOrders: Order[] = [
  {
    id: "NCB-2024-0001",
    date: "2024-12-28",
    status: "delivered",
    deliveredDate: "2024-12-31",
    total: 4599,
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
      { name: "Banarasi Silk Saree", color: "Royal Blue", size: "Free Size", qty: 1, price: 4599, image: "https://picsum.photos/seed/saree1/80/80" },
    ],
  },
  {
    id: "NCB-2024-0002",
    date: "2024-12-25",
    status: "shipped",
    trackingNumber: "TRACK123456789",
    total: 2199,
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
      { name: "Cotton Casual Kurti", color: "Maroon", size: "M", qty: 2, price: 1099, image: "https://picsum.photos/seed/kurti1/80/80" },
    ],
  },
  {
    id: "NCB-2024-0003",
    date: "2024-12-20",
    status: "processing",
    total: 8999,
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
      { name: "Bridal Lehenga Set", color: "Gold", size: "L", qty: 1, price: 8999, image: "https://picsum.photos/seed/lehenga1/80/80" },
    ],
  },
];

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
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const handleDownloadInvoice = (orderId: string) => {
    // TODO: Implement invoice download
    console.log("Downloading invoice for:", orderId);
  };

  if (mockOrders.length === 0) {
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
        {mockOrders.map((order) => (
          <Card key={order.id}>
            <CardHeader className="pb-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <CardTitle className="text-base font-mono">{order.id}</CardTitle>
                  <Badge variant={getStatusColor(order.status) as any} className="capitalize">
                    {order.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    {formatDate(order.date)}
                  </span>
                  <span className="font-semibold">{formatPrice(order.total)}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-sm">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-muted-foreground">
                        {item.color} / {item.size} × {item.qty}
                      </p>
                    </div>
                    <span>{formatPrice(item.price * item.qty)}</span>
                  </div>
                ))}
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
                {order.status === "delivered" && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownloadInvoice(order.id)}
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Invoice
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
                  <DialogTitle className="font-mono">{selectedOrder.id}</DialogTitle>
                  <Badge variant={getStatusColor(selectedOrder.status) as any} className="capitalize">
                    {selectedOrder.status}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Ordered on {formatDateLong(selectedOrder.date)}
                </p>
              </DialogHeader>

              <div className="space-y-6 mt-4">
                {/* Status */}
                <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                  {getStatusIcon(selectedOrder.status)}
                  <div>
                    <p className="font-medium capitalize">Order {selectedOrder.status}</p>
                    {selectedOrder.status === "delivered" && selectedOrder.deliveredDate && (
                      <p className="text-sm text-muted-foreground">
                        Delivered on {formatDateLong(selectedOrder.deliveredDate)}
                      </p>
                    )}
                    {selectedOrder.status === "shipped" && selectedOrder.trackingNumber && (
                      <p className="text-sm text-muted-foreground">
                        Tracking: <span className="font-mono">{selectedOrder.trackingNumber}</span>
                      </p>
                    )}
                    {selectedOrder.status === "processing" && (
                      <p className="text-sm text-muted-foreground">
                        Your order is being prepared
                      </p>
                    )}
                  </div>
                </div>

                {/* Items */}
                <div>
                  <h3 className="font-semibold mb-3">Items ({selectedOrder.items.length})</h3>
                  <div className="space-y-3">
                    {selectedOrder.items.map((item, idx) => (
                      <div key={idx} className="flex gap-4">
                        <img
                          src={item.image || "https://picsum.photos/seed/product/80/80"}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {item.color} / {item.size} × {item.qty}
                          </p>
                        </div>
                        <p className="font-medium">{formatPrice(item.price * item.qty)}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Order Summary */}
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-3">Shipping Address</h3>
                    <div className="text-sm space-y-1">
                      <p className="font-medium">{selectedOrder.shippingAddress.name}</p>
                      <p className="text-muted-foreground">{selectedOrder.shippingAddress.phone}</p>
                      <p className="text-muted-foreground">{selectedOrder.shippingAddress.address}</p>
                      <p className="text-muted-foreground">
                        {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} - {selectedOrder.shippingAddress.pincode}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3">Payment</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Method</span>
                        <span>{selectedOrder.paymentMethod}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Status</span>
                        <Badge variant={selectedOrder.paymentStatus === "paid" ? "default" : "outline"} className="capitalize">
                          {selectedOrder.paymentStatus}
                        </Badge>
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
                {selectedOrder.status === "delivered" && (
                  <div className="flex justify-end">
                    <Button
                      variant="outline"
                      onClick={() => handleDownloadInvoice(selectedOrder.id)}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download Invoice
                    </Button>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export const Route = createFileRoute("/account/orders")({
  component: OrdersPage,
});
