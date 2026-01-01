import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { toast } from "sonner";

export interface CartItem {
  productId: number;
  productGroupId: number;
  variantId: number;
  name: string;
  colorName: string;
  size: string;
  sku: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  maxQuantity: number;
}

export interface Coupon {
  code: string;
  type: "percentage" | "fixed";
  value: number;
  minOrderValue?: number;
  maxDiscount?: number;
  description: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
  removeItem: (productId: number, variantId: number) => void;
  updateQuantity: (productId: number, variantId: number, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
  // Coupon
  appliedCoupon: Coupon | null;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
  discount: number;
  // Totals
  shippingFee: number;
  tax: number;
  total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "textilehub_cart";
const COUPON_STORAGE_KEY = "textilehub_coupon";

// Available coupons (in real app, this would come from API)
export const AVAILABLE_COUPONS: Coupon[] = [
  { code: "WELCOME10", type: "percentage", value: 10, minOrderValue: 500, description: "10% off on orders above ₹500" },
  { code: "FLAT200", type: "fixed", value: 200, minOrderValue: 1500, description: "₹200 off on orders above ₹1500" },
  { code: "SAVE15", type: "percentage", value: 15, minOrderValue: 2000, maxDiscount: 500, description: "15% off up to ₹500" },
  { code: "NEWYEAR25", type: "percentage", value: 25, minOrderValue: 3000, maxDiscount: 1000, description: "25% off up to ₹1000" },
];

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    const savedCoupon = localStorage.getItem(COUPON_STORAGE_KEY);

    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (e) {
        console.error("Failed to parse cart:", e);
      }
    }

    if (savedCoupon) {
      try {
        setAppliedCoupon(JSON.parse(savedCoupon));
      } catch (e) {
        console.error("Failed to parse coupon:", e);
      }
    }
  }, []);

  // Save cart to localStorage on change
  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  // Save coupon to localStorage on change
  useEffect(() => {
    if (appliedCoupon) {
      localStorage.setItem(COUPON_STORAGE_KEY, JSON.stringify(appliedCoupon));
    } else {
      localStorage.removeItem(COUPON_STORAGE_KEY);
    }
  }, [appliedCoupon]);

  const addItem = useCallback((item: Omit<CartItem, "quantity"> & { quantity?: number }) => {
    setItems((prev) => {
      const existingIndex = prev.findIndex((i) => i.variantId === item.variantId);

      if (existingIndex >= 0) {
        const updated = [...prev];
        const newQty = Math.min(
          updated[existingIndex].quantity + (item.quantity || 1),
          updated[existingIndex].maxQuantity
        );
        updated[existingIndex] = { ...updated[existingIndex], quantity: newQty };
        toast.success("Cart updated");
        return updated;
      }

      toast.success("Added to cart");
      return [...prev, { ...item, quantity: item.quantity || 1 }];
    });
  }, []);

  const removeItem = useCallback((productId: number, variantId: number) => {
    setItems((prev) => prev.filter((item) => !(item.productId === productId && item.variantId === variantId)));
    toast.success("Removed from cart");
  }, []);

  const updateQuantity = useCallback((productId: number, variantId: number, quantity: number) => {
    if (quantity < 1) return;

    setItems((prev) =>
      prev.map((item) =>
        item.productId === productId && item.variantId === variantId
          ? { ...item, quantity: Math.min(quantity, item.maxQuantity) }
          : item
      )
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    setAppliedCoupon(null);
    toast.success("Cart cleared");
  }, []);

  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const applyCoupon = useCallback((code: string): boolean => {
    const coupon = AVAILABLE_COUPONS.find(
      (c) => c.code.toLowerCase() === code.toLowerCase()
    );

    if (!coupon) {
      toast.error("Invalid coupon code");
      return false;
    }

    if (coupon.minOrderValue && subtotal < coupon.minOrderValue) {
      toast.error(`Minimum order value of ₹${coupon.minOrderValue} required`);
      return false;
    }

    setAppliedCoupon(coupon);
    toast.success(`Coupon "${coupon.code}" applied!`);
    return true;
  }, [subtotal]);

  const removeCoupon = useCallback(() => {
    setAppliedCoupon(null);
    toast.success("Coupon removed");
  }, []);

  // Calculate discount
  const discount = appliedCoupon
    ? appliedCoupon.type === "percentage"
      ? Math.min(
          (subtotal * appliedCoupon.value) / 100,
          appliedCoupon.maxDiscount || Infinity
        )
      : appliedCoupon.value
    : 0;

  // Shipping: Free above ₹999
  const shippingFee = subtotal > 999 ? 0 : 99;

  // Tax: 5% GST
  const tax = Math.round((subtotal - discount) * 0.05);

  // Total
  const total = subtotal - discount + shippingFee + tax;

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        itemCount,
        subtotal,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        discount,
        shippingFee,
        tax,
        total,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
