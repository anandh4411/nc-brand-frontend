/**
 * Cart DTOs
 * Shopping cart management
 */

import { z } from "zod";

// ============================================================================
// CART ITEM
// ============================================================================

export const CartItemSchema = z.object({
  id: z.number(),
  cartId: z.number(),
  productVariantId: z.number(),
  // Product details (denormalized for display)
  productName: z.string(),
  colorName: z.string(),
  size: z.string(),
  sku: z.string(),
  imageUrl: z.string().optional(),
  unitPrice: z.number(),
  // Cart specific
  quantity: z.number(),
  totalPrice: z.number(),
  // Stock availability
  inStock: z.boolean(),
  availableQuantity: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type CartItem = z.infer<typeof CartItemSchema>;

// ============================================================================
// CART
// ============================================================================

export const CartSchema = z.object({
  id: z.number(),
  uuid: z.string().uuid(),
  customerId: z.number().nullable(), // Null for guest cart
  sessionId: z.string().optional(),
  items: z.array(CartItemSchema),
  itemCount: z.number(),
  subtotal: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
  expiresAt: z.string().optional(),
});

export type Cart = z.infer<typeof CartSchema>;

// ============================================================================
// CART OPERATIONS
// ============================================================================

export const AddToCartRequestSchema = z.object({
  productVariantId: z.number(),
  quantity: z.number().min(1, "Quantity must be at least 1"),
});

export type AddToCartRequest = z.infer<typeof AddToCartRequestSchema>;

export const UpdateCartItemRequestSchema = z.object({
  quantity: z.number().min(1, "Quantity must be at least 1"),
});

export type UpdateCartItemRequest = z.infer<typeof UpdateCartItemRequestSchema>;

// ============================================================================
// CART SUMMARY (For checkout)
// ============================================================================

export const CartSummarySchema = z.object({
  itemCount: z.number(),
  subtotal: z.number(),
  tax: z.number(),
  shippingFee: z.number(),
  total: z.number(),
  // Breakdown
  taxRate: z.number(), // e.g., 0.18 for 18% GST
  freeShippingThreshold: z.number().optional(),
  isEligibleForFreeShipping: z.boolean(),
});

export type CartSummary = z.infer<typeof CartSummarySchema>;
