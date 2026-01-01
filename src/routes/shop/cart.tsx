import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Trash2,
  Minus,
  Plus,
  ShoppingBag,
  Tag,
  Truck,
  ArrowRight,
  X,
} from "lucide-react";
import { useCart, AVAILABLE_COUPONS } from "@/context/cart-context";

function CartPage() {
  const {
    items,
    removeItem,
    updateQuantity,
    clearCart,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    subtotal,
    discount,
    shippingFee,
    tax,
    total,
  } = useCart();

  const [couponCode, setCouponCode] = useState("");
  const [couponError, setCouponError] = useState("");

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleApplyCoupon = () => {
    setCouponError("");
    const success = applyCoupon(couponCode.toUpperCase().trim());
    if (!success) {
      setCouponError("Invalid or expired coupon code");
    } else {
      setCouponCode("");
    }
  };

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

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Shopping Cart</h1>
        <Button variant="ghost" onClick={clearCart} className="text-destructive">
          <Trash2 className="h-4 w-4 mr-2" />
          Clear Cart
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <Card key={`${item.productId}-${item.variantId}`}>
              <CardContent className="p-4">
                <div className="flex gap-4">
                  {/* Image */}
                  <div className="w-24 h-32 bg-muted rounded-md overflow-hidden shrink-0">
                    <img
                      src={item.imageUrl || "/placeholder-product.jpg"}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between gap-2">
                      <div>
                        <h3 className="font-medium line-clamp-2">{item.name}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {item.colorName} | {item.size}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          SKU: {item.sku}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="shrink-0"
                        onClick={() => removeItem(item.productId, item.variantId)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      {/* Quantity */}
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() =>
                            updateQuantity(
                              item.productId,
                              item.variantId,
                              item.quantity - 1
                            )
                          }
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() =>
                            updateQuantity(
                              item.productId,
                              item.variantId,
                              item.quantity + 1
                            )
                          }
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>

                      {/* Price */}
                      <p className="font-semibold">
                        {formatPrice(item.price * item.quantity)}
                      </p>
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
                        {appliedCoupon.code}
                      </Badge>
                      <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                        {appliedCoupon.description}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={removeCoupon}
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
                      disabled={!couponCode.trim()}
                    >
                      Apply
                    </Button>
                  </div>
                )}
                {couponError && (
                  <p className="text-xs text-destructive">{couponError}</p>
                )}
              </div>

              {/* Available Coupons */}
              {!appliedCoupon && (
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">Available coupons:</p>
                  <div className="flex flex-wrap gap-2">
                    {AVAILABLE_COUPONS.slice(0, 3).map((coupon) => (
                      <button
                        key={coupon.code}
                        className="text-xs bg-muted px-2 py-1 rounded font-mono hover:bg-primary/10 transition-colors"
                        onClick={() => setCouponCode(coupon.code)}
                      >
                        {coupon.code}
                      </button>
                    ))}
                  </div>
                </div>
              )}

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

              {/* Free Shipping Progress */}
              {shippingFee > 0 && (
                <div className="bg-muted/50 p-3 rounded-md">
                  <p className="text-xs text-muted-foreground">
                    Add {formatPrice(999 - subtotal)} more for free shipping!
                  </p>
                  <div className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all"
                      style={{ width: `${Math.min((subtotal / 999) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              )}
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
