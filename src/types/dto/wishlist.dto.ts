/**
 * Wishlist DTOs
 */

import { z } from "zod";

// ============================================================================
// WISHLIST ITEM
// ============================================================================

export const WishlistItemSchema = z.object({
  id: z.number(),
  uuid: z.string().uuid(),
  productName: z.string(),
  colorName: z.string(),
  size: z.string(),
  sku: z.string(),
  price: z.number(),
  imageUrl: z.string().nullable(),
  inStock: z.boolean(),
  addedAt: z.string(),
});

export type WishlistItem = z.infer<typeof WishlistItemSchema>;
