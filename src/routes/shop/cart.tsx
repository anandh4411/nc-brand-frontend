import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Trash2,
  Minus,
  Plus,
  ShoppingBag,
  Tag,
  Truck,
  ArrowRight,
  X,
  Loader2,
} from "lucide-react";
import {
  useCart,
  useUpdateCartItem,
  useRemoveFromCart,
  useApplyCoupon,
  useRemoveCoupon,
} from "@/api/hooks/shop";
import { useAuth } from "@/context/auth-context";

function CartPage() {
  const { isAuthenticated, isCustomer } = useAuth();
  const { data: cartData, isLoading: cartLoading } = useCart();
  const updateCartItem = useUpdateCartItem();
  const removeFromCart = useRemoveFromCart();
  const applyCouponMutation = useApplyCoupon();
  const removeCouponMutation = useRemoveCoupon();

  const [couponCode, setCouponCode] = useState("");
  const [couponError, setCouponError] = useState("");

  const cart = cartData?.data as any;
  const items = cart?.items || [];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleUpdateQuantity = (variantUuid: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    updateCartItem.mutate({ variantUuid, data: { quantity: newQuantity } });
  };

  const handleRemoveItem = (variantUuid: string) => {
    removeFromCart.mutate(variantUuid);
  };

  const handleApplyCoupon = () => {
    setCouponError("");
    applyCouponMutation.mutate(couponCode.toUpperCase().trim(), {
      onSuccess: () => setCouponCode(""),
      onError: (err: any) => {
        const message =
          err?.response?.data?.error?.message ||
          err?.message ||
          "Invalid or expired coupon code";
        setCouponError(message);
      },
    });
  };

  const handleRemoveCoupon = () => {
    removeCouponMutation.mutate();
  };

  // Not logged in as customer
  if (!isAuthenticated || !isCustomer) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-md mx-auto text-center">
          <ShoppingBag className="h-16 w-16 mx-auto mb-6 text-muted-foreground" />
          <h1 className="text-2xl font-bold mb-4">Please sign in</h1>
          <p className="text-muted-foreground mb-8">
            Sign in to view your shopping cart.
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
  if (cartLoading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Skeleton className="h-10 w-48 mb-8" />
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {[1, 2].map((i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <Skeleton className="w-24 h-32" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-5 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-8 w-24 mt-4" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="lg:col-span-1">
            <Skeleton className="h-96" />
          </div>
        </div>
      </div>
    );
  }

  // Empty cart
  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-md mx-auto text-center">
          <ShoppingBag className="h-16 w-16 mx-auto mb-6 text-muted-foreground" />
          <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
          <p className="text-muted-foreground mb-8">
            Looks like you haven't added anything to your cart yet.
          </p>
          <Button asChild>
            <Link to="/shop/products">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    );
  }

  const subtotal = cart?.subtotal || 0;
  const discount = cart?.discount || 0;
  const shipping = cart?.shipping || 0;
  const tax = cart?.tax || 0;
  const total = cart?.total || 0;
  const appliedCoupon = cart?.couponCode;

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Shopping Cart</h1>
        <span className="text-muted-foreground">{items.length} items</span>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item: any) => (
            <Card key={item.uuid || item.sku}>
              <CardContent className="p-4">
                <div className="flex gap-4">
                  {/* Image */}
                  <div className="w-24 h-32 bg-muted rounded-md overflow-hidden shrink-0">
                    <img
                      src={item.imageUrl || "/placeholder.svg"}
                      alt={item.productName}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between gap-2">
                      <div>
                        <h3 className="font-medium line-clamp-2">
                          {item.productName}
                          {item.freeQuantity > 0 && (
                            <Badge variant="secondary" className="ml-2 bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                              FREE
                            </Badge>
                          )}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {item.colorName} | {item.size}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          SKU: {item.sku}
                        </p>
                      </div>
                      {!item.isFreeItem && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="shrink-0"
                          onClick={() => handleRemoveItem(item.variantUuid)}
                          disabled={removeFromCart.isPending}
                        >
                          {removeFromCart.isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      {/* Quantity */}
                      {item.isFreeItem ? (
                        <span className="text-sm text-muted-foreground">Qty: {item.quantity}</span>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleUpdateQuantity(item.variantUuid, item.quantity - 1)}
                            disabled={item.quantity <= 1 || updateCartItem.isPending}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleUpdateQuantity(item.variantUuid, item.quantity + 1)}
                            disabled={updateCartItem.isPending}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      )}

                      {/* Price */}
                      <div className="text-right">
                        {item.freeQuantity > 0 && item.paidQuantity === 0 ? (
                          <>
                            <p className="font-semibold text-green-600">{formatPrice(0)}</p>
                            <p className="text-xs text-muted-foreground line-through">
                              {formatPrice(item.unitPrice * item.quantity)}
                            </p>
                          </>
                        ) : item.freeQuantity > 0 ? (
                          <>
                            <p className="font-semibold">{formatPrice(item.lineTotal)}</p>
                            <p className="text-xs text-green-600">
                              {item.freeQuantity} free, {item.paidQuantity} paid
                            </p>
                          </>
                        ) : (
                          <>
                            <p className="font-semibold">{formatPrice(item.lineTotal)}</p>
                            <p className="text-xs text-muted-foreground">
                              {formatPrice(item.unitPrice)} each
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Coupon */}
              <div className="space-y-2">
                <p className="text-sm font-medium flex items-center gap-2">
                  <Tag className="h-4 w-4" />
                  Apply Coupon
                </p>
                {appliedCoupon ? (
                  <div className="flex items-center justify-between bg-green-50 dark:bg-green-950 p-3 rounded-md">
                    <div>
                      <Badge variant="secondary" className="font-mono">
                        {appliedCoupon}
                      </Badge>
                      <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                        Coupon applied!
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={handleRemoveCoupon}
                      disabled={removeCouponMutation.isPending}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="font-mono uppercase"
                    />
                    <Button
                      variant="outline"
                      onClick={handleApplyCoupon}
                      disabled={!couponCode.trim() || applyCouponMutation.isPending}
                    >
                      {applyCouponMutation.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        "Apply"
                      )}
                    </Button>
                  </div>
                )}
                {couponError && (
                  <p className="text-xs text-destructive">{couponError}</p>
                )}
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
                  <span>
                    {shipping === 0 ? (
                      <span className="text-green-600">Free</span>
                    ) : (
                      formatPrice(shipping)
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
            <CardFooter className="flex flex-col gap-3">
              <Button asChild className="w-full" size="lg">
                <Link to="/checkout">
                  Proceed to Checkout
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link to="/shop/products">Continue Shopping</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/shop/cart")({
  component: CartPage,
});
