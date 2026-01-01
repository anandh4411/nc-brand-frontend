import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  CreditCard,
  Truck,
  MapPin,
  CheckCircle2,
  Wallet,
  Banknote,
} from "lucide-react";
import { useCart } from "@/context/cart-context";
import { toast } from "sonner";

type CheckoutStep = "address" | "payment" | "confirmation";

interface AddressForm {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

function CheckoutPage() {
  const navigate = useNavigate();
  const { items, subtotal, discount, shippingFee, tax, total, appliedCoupon, clearCart } = useCart();

  const [step, setStep] = useState<CheckoutStep>("address");
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [isProcessing, setIsProcessing] = useState(false);
  const [addressForm, setAddressForm] = useState<AddressForm>({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleAddressChange = (field: keyof AddressForm, value: string) => {
    setAddressForm((prev) => ({ ...prev, [field]: value }));
  };

  const validateAddress = () => {
    const required = ["fullName", "phone", "address", "city", "state", "pincode"];
    return required.every((field) => addressForm[field as keyof AddressForm].trim());
  };

  const handleContinueToPayment = () => {
    if (!validateAddress()) {
      toast.error("Please fill in all required fields");
      return;
    }
    setStep("payment");
  };

  const handlePlaceOrder = async () => {
    setIsProcessing(true);

    // Simulate order placement
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const orderId = `TH${Date.now().toString().slice(-8)}`;

    // Clear cart after successful order
    clearCart();
    setStep("confirmation");
    setIsProcessing(false);
  };

  // Redirect to cart if empty
  if (items.length === 0 && step !== "confirmation") {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
        <p className="text-muted-foreground mb-8">Add items to your cart to checkout.</p>
        <Button asChild>
          <Link to="/shop/products">Browse Products</Link>
        </Button>
      </div>
    );
  }

  // Confirmation Step
  if (step === "confirmation") {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-md mx-auto text-center">
          <CheckCircle2 className="h-16 w-16 mx-auto mb-6 text-green-500" />
          <h1 className="text-2xl font-bold mb-4">Order Placed Successfully!</h1>
          <p className="text-muted-foreground mb-2">
            Thank you for your order. We've sent a confirmation email to {addressForm.email || "your email"}.
          </p>
          <p className="text-sm text-muted-foreground mb-8">
            Order ID: <span className="font-mono font-medium">TH{Date.now().toString().slice(-8)}</span>
          </p>
          <div className="space-y-3">
            <Button asChild className="w-full">
              <Link to="/shop">Continue Shopping</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <Button
          variant="ghost"
          onClick={() => step === "payment" ? setStep("address") : navigate({ to: "/shop/cart" })}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          {step === "payment" ? "Back to Address" : "Back to Cart"}
        </Button>
        <h1 className="text-3xl font-bold">Checkout</h1>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center gap-4 mb-8">
        <div className="flex items-center gap-2">
          <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
            step === "address" ? "bg-primary text-primary-foreground" : "bg-green-500 text-white"
          }`}>
            {step === "address" ? "1" : <CheckCircle2 className="h-4 w-4" />}
          </div>
          <span className="font-medium">Address</span>
        </div>
        <div className="h-px flex-1 bg-border" />
        <div className="flex items-center gap-2">
          <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
            step === "payment" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
          }`}>
            2
          </div>
          <span className={step === "payment" ? "font-medium" : "text-muted-foreground"}>Payment</span>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Form */}
        <div className="lg:col-span-2">
          {step === "address" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Shipping Address
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input
                      id="fullName"
                      placeholder="John Doe"
                      value={addressForm.fullName}
                      onChange={(e) => handleAddressChange("fullName", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      placeholder="9876543210"
                      value={addressForm.phone}
                      onChange={(e) => handleAddressChange("phone", e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    value={addressForm.email}
                    onChange={(e) => handleAddressChange("email", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address *</Label>
                  <Input
                    id="address"
                    placeholder="123 Main Street, Apartment 4B"
                    value={addressForm.address}
                    onChange={(e) => handleAddressChange("address", e.target.value)}
                  />
                </div>

                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      placeholder="Chennai"
                      value={addressForm.city}
                      onChange={(e) => handleAddressChange("city", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State *</Label>
                    <Input
                      id="state"
                      placeholder="Tamil Nadu"
                      value={addressForm.state}
                      onChange={(e) => handleAddressChange("state", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pincode">PIN Code *</Label>
                    <Input
                      id="pincode"
                      placeholder="600001"
                      value={addressForm.pincode}
                      onChange={(e) => handleAddressChange("pincode", e.target.value)}
                    />
                  </div>
                </div>

                <Button className="w-full mt-4" onClick={handleContinueToPayment}>
                  Continue to Payment
                </Button>
              </CardContent>
            </Card>
          )}

          {step === "payment" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment Method
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Shipping Address Summary */}
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="text-sm font-medium mb-1">Shipping to:</p>
                  <p className="text-sm text-muted-foreground">
                    {addressForm.fullName}, {addressForm.address}, {addressForm.city}, {addressForm.state} - {addressForm.pincode}
                  </p>
                  <p className="text-sm text-muted-foreground">Phone: {addressForm.phone}</p>
                </div>

                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                  <div className="space-y-3">
                    <div className={`flex items-center space-x-3 p-4 border rounded-lg cursor-pointer ${
                      paymentMethod === "cod" ? "border-primary bg-primary/5" : ""
                    }`}>
                      <RadioGroupItem value="cod" id="cod" />
                      <Label htmlFor="cod" className="flex items-center gap-2 cursor-pointer flex-1">
                        <Banknote className="h-5 w-5" />
                        <div>
                          <p className="font-medium">Cash on Delivery</p>
                          <p className="text-xs text-muted-foreground">Pay when you receive</p>
                        </div>
                      </Label>
                    </div>

                    <div className={`flex items-center space-x-3 p-4 border rounded-lg cursor-pointer ${
                      paymentMethod === "upi" ? "border-primary bg-primary/5" : ""
                    }`}>
                      <RadioGroupItem value="upi" id="upi" />
                      <Label htmlFor="upi" className="flex items-center gap-2 cursor-pointer flex-1">
                        <Wallet className="h-5 w-5" />
                        <div>
                          <p className="font-medium">UPI / Wallet</p>
                          <p className="text-xs text-muted-foreground">Google Pay, PhonePe, Paytm</p>
                        </div>
                      </Label>
                      <Badge variant="outline">Coming Soon</Badge>
                    </div>

                    <div className={`flex items-center space-x-3 p-4 border rounded-lg cursor-pointer ${
                      paymentMethod === "card" ? "border-primary bg-primary/5" : ""
                    }`}>
                      <RadioGroupItem value="card" id="card" />
                      <Label htmlFor="card" className="flex items-center gap-2 cursor-pointer flex-1">
                        <CreditCard className="h-5 w-5" />
                        <div>
                          <p className="font-medium">Credit/Debit Card</p>
                          <p className="text-xs text-muted-foreground">Visa, Mastercard, RuPay</p>
                        </div>
                      </Label>
                      <Badge variant="outline">Coming Soon</Badge>
                    </div>
                  </div>
                </RadioGroup>

                <Button
                  className="w-full"
                  size="lg"
                  onClick={handlePlaceOrder}
                  disabled={isProcessing || paymentMethod !== "cod"}
                >
                  {isProcessing ? "Processing..." : `Place Order - ${formatPrice(total)}`}
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Items */}
              <div className="space-y-3 max-h-48 overflow-y-auto">
                {items.map((item) => (
                  <div key={`${item.productId}-${item.variantId}`} className="flex gap-3">
                    <div className="w-12 h-16 bg-muted rounded overflow-hidden shrink-0">
                      <img
                        src={item.imageUrl || "/placeholder-product.jpg"}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium line-clamp-1">{item.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.colorName} | {item.size} × {item.quantity}
                      </p>
                      <p className="text-sm font-medium">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <Separator />

              {/* Price Breakdown */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span className="flex items-center gap-1">
                      Discount
                      {appliedCoupon && (
                        <Badge variant="outline" className="text-xs font-mono">
                          {appliedCoupon.code}
                        </Badge>
                      )}
                    </span>
                    <span>-{formatPrice(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <Truck className="h-3 w-3" />
                    Shipping
                  </span>
                  <span>
                    {shippingFee === 0 ? (
                      <span className="text-green-600">Free</span>
                    ) : (
                      formatPrice(shippingFee)
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax (5% GST)</span>
                  <span>{formatPrice(tax)}</span>
                </div>
              </div>

              <Separator />

              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/checkout")({
  component: CheckoutPage,
});
