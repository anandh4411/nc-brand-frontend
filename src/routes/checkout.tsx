import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowLeft,
  CreditCard,
  Truck,
  MapPin,
  CheckCircle2,
  Wallet,
  Banknote,
  Loader2,
  QrCode,
  MessageCircle,
} from "lucide-react";
import { toast } from "sonner";
import { StorefrontLayout } from "@/layouts/storefront";
import {
  useCart,
  useAddresses,
  useCreateAddress,
  useCheckout,
  useCreateRazorpayOrder,
  useVerifyPayment,
} from "@/api/hooks/shop";
import { useAuth } from "@/context/auth-context";

type CheckoutStep = "address" | "payment" | "confirmation";

interface AddressForm {
  name: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  pincode: string;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

function CheckoutPage() {
  const navigate = useNavigate();
  const { isAuthenticated, isCustomer, user } = useAuth();

  // API hooks
  const { data: cartData, isLoading: cartLoading } = useCart();
  const { data: addressesData, isLoading: addressesLoading } = useAddresses();
  const createAddress = useCreateAddress();
  const checkout = useCheckout();
  const createRazorpayOrder = useCreateRazorpayOrder();
  const verifyPayment = useVerifyPayment();

  const cart = cartData?.data as any;
  const items = cart?.items || [];
  const addresses = (addressesData?.data || []) as any[];

  const [step, setStep] = useState<CheckoutStep>("address");
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "razorpay">("cod");
  const [selectedAddressUuid, setSelectedAddressUuid] = useState<string>("");
  const [useNewAddress, setUseNewAddress] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");

  // True when the user is filling in a new address (either explicitly or because no saved addresses exist)
  const isUsingNewAddress = useNewAddress || addresses.length === 0;
  const [addressForm, setAddressForm] = useState<AddressForm>({
    name: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pincode: "",
  });

  // Set default address
  useEffect(() => {
    if (addresses.length > 0 && !selectedAddressUuid) {
      const defaultAddress = addresses.find((a: any) => a.isDefault) || addresses[0];
      setSelectedAddressUuid(defaultAddress.uuid);
    }
  }, [addresses, selectedAddressUuid]);

  // Razorpay script loading — disabled while online payments are not available
  // useEffect(() => {
  //   const script = document.createElement("script");
  //   script.src = "https://checkout.razorpay.com/v1/checkout.js";
  //   script.async = true;
  //   document.body.appendChild(script);
  //   return () => { document.body.removeChild(script); };
  // }, []);

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

  const validateNewAddress = () => {
    const required: (keyof AddressForm)[] = ["name", "phone", "addressLine1", "city", "state", "pincode"];
    return required.every((field) => addressForm[field].trim());
  };

  const getSelectedAddress = () => {
    if (isUsingNewAddress) {
      return addressForm;
    }
    return addresses.find((a: any) => a.uuid === selectedAddressUuid);
  };

  const handleContinueToPayment = () => {
    if (isUsingNewAddress && !validateNewAddress()) {
      toast.error("Please fill in all required address fields");
      return;
    }
    if (!isUsingNewAddress && !selectedAddressUuid) {
      toast.error("Please select an address");
      return;
    }
    setStep("payment");
  };

  const placeOrderWithUuid = (addressUuid: string) => {
    const address = getSelectedAddress();

    if (paymentMethod === "cod") {
      checkout.mutate(
        {
          shippingAddressUuid: addressUuid,
          paymentMethod: "cod",
        } as any,
        {
          onSuccess: (data: any) => {
            setOrderNumber(data.data.orderNumber);
            setStep("confirmation");
          },
        }
      );
    } else {
      createRazorpayOrder.mutate(
        String(cart?.total || 0),
        {
          onSuccess: (data: any) => {
            const razorpayOrderId = data.data.razorpayOrderId;
            const options = {
              key: import.meta.env.VITE_RAZORPAY_KEY_ID,
              amount: (cart?.total || 0) * 100,
              currency: "INR",
              name: "NC Brand Textiles",
              description: "Order Payment",
              order_id: razorpayOrderId,
              handler: async (response: any) => {
                verifyPayment.mutate(
                  {
                    razorpayOrderId: response.razorpay_order_id,
                    razorpayPaymentId: response.razorpay_payment_id,
                    razorpaySignature: response.razorpay_signature,
                  } as any,
                  {
                    onSuccess: (verifyData: any) => {
                      setOrderNumber(verifyData.data.orderNumber);
                      setStep("confirmation");
                    },
                  }
                );
              },
              prefill: {
                name: user?.name || address?.name,
                email: user?.email || "",
                contact: address?.phone,
              },
              theme: { color: "#0f172a" },
            };
            const razorpay = new window.Razorpay(options);
            razorpay.open();
          },
        }
      );
    }
  };

  const handlePlaceOrder = async () => {
    if (isUsingNewAddress) {
      if (!validateNewAddress()) {
        toast.error("Please fill in all required address fields");
        return;
      }
      // Save the new address first, then checkout with the returned UUID
      createAddress.mutate(addressForm, {
        onSuccess: (data: any) => {
          const newUuid = data.data.uuid;
          placeOrderWithUuid(newUuid);
        },
      });
    } else {
      if (!selectedAddressUuid) {
        toast.error("Please select an address");
        return;
      }
      placeOrderWithUuid(selectedAddressUuid);
    }
  };

  // Not authenticated
  if (!isAuthenticated || !isCustomer) {
    return (
      <StorefrontLayout>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Please sign in</h1>
          <p className="text-muted-foreground mb-8">Sign in to checkout.</p>
          <Button asChild>
            <Link to="/sign-in" search={{ type: "customer" }}>
              Sign In
            </Link>
          </Button>
        </div>
      </StorefrontLayout>
    );
  }

  // Loading
  if (cartLoading || addressesLoading) {
    return (
      <StorefrontLayout>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Skeleton className="h-10 w-48 mb-8" />
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Skeleton className="h-96" />
            </div>
            <div className="lg:col-span-1">
              <Skeleton className="h-64" />
            </div>
          </div>
        </div>
      </StorefrontLayout>
    );
  }

  // Empty cart
  if (items.length === 0 && step !== "confirmation") {
    return (
      <StorefrontLayout>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
          <p className="text-muted-foreground mb-8">Add items to your cart to checkout.</p>
          <Button asChild>
            <Link to="/shop/products">Browse Products</Link>
          </Button>
        </div>
      </StorefrontLayout>
    );
  }

  // Confirmation Step
  if (step === "confirmation") {
    return (
      <StorefrontLayout>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-md mx-auto text-center">
            <CheckCircle2 className="h-16 w-16 mx-auto mb-6 text-green-500" />
            <h1 className="text-2xl font-bold mb-4">Order Placed Successfully!</h1>
            <p className="text-muted-foreground mb-2">
              Thank you for your order. We've sent a confirmation email.
            </p>
            <p className="text-sm text-muted-foreground mb-8">
              Order ID: <span className="font-mono font-medium">{orderNumber}</span>
            </p>
            <div className="space-y-3">
              <Button asChild className="w-full">
                <Link to="/account/orders">View Orders</Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link to="/shop">Continue Shopping</Link>
              </Button>
            </div>
          </div>
        </div>
      </StorefrontLayout>
    );
  }

  const selectedAddress = getSelectedAddress();
  const subtotal = cart?.subtotal || 0;
  const discount = cart?.discount || 0;
  const shipping = cart?.shipping || 0;
  const tax = cart?.tax || 0;
  const total = cart?.total || 0;

  return (
    <StorefrontLayout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-16">
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
                <CardContent className="space-y-6">
                  {/* Saved Addresses */}
                  {addresses.length > 0 && !useNewAddress && (
                    <div className="space-y-3">
                      <Label>Select Address</Label>
                      <RadioGroup value={selectedAddressUuid} onValueChange={setSelectedAddressUuid}>
                        {addresses.map((address: any) => (
                          <div
                            key={address.uuid}
                            className={`flex items-start space-x-3 p-4 border rounded-lg cursor-pointer ${
                              selectedAddressUuid === address.uuid ? "border-primary bg-primary/5" : ""
                            }`}
                            onClick={() => setSelectedAddressUuid(address.uuid)}
                          >
                            <RadioGroupItem value={address.uuid} id={address.uuid} />
                            <Label htmlFor={address.uuid} className="cursor-pointer flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-medium">{address.name}</span>
                                {address.isDefault && <Badge variant="secondary">Default</Badge>}
                              </div>
                              <p className="text-sm text-muted-foreground">{address.phone}</p>
                              <p className="text-sm text-muted-foreground">
                                {address.addressLine1}
                                {address.addressLine2 && `, ${address.addressLine2}`}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {address.city}, {address.state} - {address.pincode}
                              </p>
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                      <Button variant="link" className="p-0" onClick={() => setUseNewAddress(true)}>
                        + Add New Address
                      </Button>
                    </div>
                  )}

                  {/* New Address Form */}
                  {(useNewAddress || addresses.length === 0) && (
                    <div className="space-y-4">
                      {addresses.length > 0 && (
                        <Button variant="link" className="p-0" onClick={() => setUseNewAddress(false)}>
                          ← Use Saved Address
                        </Button>
                      )}
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name *</Label>
                          <Input
                            id="name"
                            placeholder="John Doe"
                            value={addressForm.name}
                            onChange={(e) => handleAddressChange("name", e.target.value)}
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
                        <Label htmlFor="addressLine1">Address Line 1 *</Label>
                        <Input
                          id="addressLine1"
                          placeholder="123 Main Street, Apartment 4B"
                          value={addressForm.addressLine1}
                          onChange={(e) => handleAddressChange("addressLine1", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="addressLine2">Address Line 2</Label>
                        <Input
                          id="addressLine2"
                          placeholder="Area, Landmark (optional)"
                          value={addressForm.addressLine2}
                          onChange={(e) => handleAddressChange("addressLine2", e.target.value)}
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
                    </div>
                  )}

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
                  {selectedAddress && (
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <p className="text-sm font-medium mb-1">Shipping to:</p>
                      <p className="text-sm text-muted-foreground">
                        {selectedAddress.name}, {selectedAddress.addressLine1}
                        {selectedAddress.addressLine2 && `, ${selectedAddress.addressLine2}`}, {selectedAddress.city}, {selectedAddress.state} - {selectedAddress.pincode}
                      </p>
                      <p className="text-sm text-muted-foreground">Phone: {selectedAddress.phone}</p>
                    </div>
                  )}

                  <div className="space-y-3">
                    {/* COD — enabled & selected */}
                    <div className="flex items-center space-x-3 p-4 border rounded-lg border-primary bg-primary/5">
                      <div className="h-4 w-4 rounded-full border-4 border-primary shrink-0" />
                      <div className="flex items-center gap-2 flex-1">
                        <Banknote className="h-5 w-5" />
                        <div>
                          <p className="font-medium">Cash on Delivery</p>
                          <p className="text-xs text-muted-foreground">Pay when you receive</p>
                        </div>
                      </div>
                    </div>

                    {/* Online Payment — disabled / coming soon */}
                    <div className="flex items-center space-x-3 p-4 border rounded-lg opacity-60 cursor-not-allowed">
                      <div className="h-4 w-4 rounded-full border-2 border-muted-foreground shrink-0" />
                      <div className="flex items-center gap-2 flex-1">
                        <Wallet className="h-5 w-5" />
                        <div>
                          <p className="font-medium text-muted-foreground">Pay Online</p>
                          <p className="text-xs text-muted-foreground">UPI, Card, Net Banking, Wallets</p>
                        </div>
                      </div>
                      <Badge variant="secondary">Coming Soon</Badge>
                    </div>
                  </div>

                  {/* QR Code Payment */}
                  <div className="border rounded-lg p-4 space-y-4">
                    <div className="flex items-center gap-2">
                      <QrCode className="h-5 w-5" />
                      <p className="font-medium">Pay via QR Code</p>
                    </div>
                    <div className="flex justify-center">
                      <img
                        src="/qrcode.JPG"
                        alt="Payment QR Code"
                        className="w-52 h-52 object-contain rounded-lg border"
                      />
                    </div>
                    <div className="bg-muted/50 rounded-lg p-3 space-y-2 text-sm text-muted-foreground">
                      <p className="font-medium text-foreground">How to pay:</p>
                      <ol className="list-decimal list-inside space-y-1">
                        <li>Scan the QR code using any UPI app</li>
                        <li>Complete the payment of <span className="font-semibold text-foreground">{formatPrice(total)}</span></li>
                        <li>Take a screenshot of the payment confirmation</li>
                        <li>Send the screenshot to our WhatsApp number below</li>
                      </ol>
                      <a
                        href="https://wa.me/917034531113"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 mt-2 text-green-600 hover:text-green-700 font-medium"
                      >
                        <MessageCircle className="h-4 w-4" />
                        +91 70345 31113
                      </a>
                    </div>
                  </div>

                  <Button
                    className="w-full"
                    size="lg"
                    onClick={handlePlaceOrder}
                    disabled={createAddress.isPending || checkout.isPending || createRazorpayOrder.isPending || verifyPayment.isPending}
                  >
                    {(createAddress.isPending || checkout.isPending || createRazorpayOrder.isPending || verifyPayment.isPending) ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      `Place Order - ${formatPrice(total)}`
                    )}
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
                  {items.map((item: any, index: number) => (
                    <div key={item.variantUuid || item.sku || index} className="flex gap-3">
                      <div className="w-12 h-16 bg-muted rounded overflow-hidden shrink-0">
                        <img
                          src={item.imageUrl || "/placeholder.svg"}
                          alt={item.productName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium line-clamp-1">
                          {item.productName}
                          {item.freeQuantity > 0 && (
                            <span className="ml-1 text-xs text-green-600 font-semibold">FREE</span>
                          )}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {item.colorName} | {item.size} × {item.quantity}
                        </p>
                        <p className="text-sm font-medium">
                          {item.freeQuantity > 0 && item.paidQuantity === 0 ? (
                            <span className="text-green-600">{formatPrice(0)}</span>
                          ) : (
                            formatPrice(item.lineTotal)
                          )}
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
                      <span>Discount</span>
                      <span>-{formatPrice(discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <Truck className="h-3 w-3" />
                      Shipping
                    </span>
                    <span className="text-muted-foreground text-xs">Charges may apply</span>
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
    </StorefrontLayout>
  );
}

export const Route = createFileRoute("/checkout")({
  component: CheckoutPage,
});
