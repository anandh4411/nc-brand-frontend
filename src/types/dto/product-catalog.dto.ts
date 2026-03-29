/**
 * Product Catalog DTOs
 *
 * Hierarchy:
 * - ProductGroup: Base product with shared attributes
 * - Product: Color variant (shown as swatches)
 * - ProductVariant: Size variant (with SKU and stock)
 */

import { z } from "zod";

// ============================================================================
// CATEGORY
// ============================================================================

export const CategorySchema = z.object({
  id: z.number(),
  uuid: z.string().uuid(),
  name: z.string(),
  slug: z.string(),
  description: z.string().optional(),
  imageUrl: z.string().optional(),
  parentId: z.number().nullable(),
  isActive: z.boolean(),
  sortOrder: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type Category = z.infer<typeof CategorySchema>;

export const CreateCategoryRequestSchema = z.object({
  name: z.string().min(1, "Category name is required"),
  description: z.string().optional(),
  parentId: z.number().nullable().optional(),
  sortOrder: z.number().optional(),
});

export type CreateCategoryRequest = z.infer<typeof CreateCategoryRequestSchema>;

// ============================================================================
// PRODUCT ATTRIBUTES
// ============================================================================

/**
 * Fabric types for textiles
 */
export const FabricTypeSchema = z.enum([
  "cotton",
  "polyester",
  "silk",
  "wool",
  "linen",
  "blend",
  "synthetic",
  "other",
]);

export type FabricType = z.infer<typeof FabricTypeSchema>;

/**
 * Pattern types
 */
export const PatternSchema = z.enum([
  "solid",
  "printed",
  "striped",
  "checkered",
  "floral",
  "geometric",
  "abstract",
  "other",
]);

export type Pattern = z.infer<typeof PatternSchema>;

/**
 * Product Attributes
 */
export const ProductAttributesSchema = z.object({
  fabricType: FabricTypeSchema.optional(),
  careInstructions: z.string().optional(),
  pattern: PatternSchema.optional(),
});

export type ProductAttributes = z.infer<typeof ProductAttributesSchema>;

// ============================================================================
// PRODUCT IMAGE
// ============================================================================

export const ProductImageSchema = z.object({
  id: z.number(),
  uuid: z.string().uuid(),
  imageUrl: z.string(),
  isPrimary: z.boolean(),
  sortOrder: z.number(),
});

export type ProductImage = z.infer<typeof ProductImageSchema>;

// ============================================================================
// PRODUCT VARIANT (Size)
// ============================================================================

export const ProductVariantSchema = z.object({
  id: z.number(),
  uuid: z.string().uuid(),
  productId: z.number(),
  sku: z.string(),
  size: z.string(),
  priceAdjustment: z.number(),
  isActive: z.boolean(),
  // Inventory fields (denormalized for convenience)
  stockQuantity: z.number().optional(),
  lowStockThreshold: z.number().optional(),
});

export type ProductVariant = z.infer<typeof ProductVariantSchema>;

export const CreateProductVariantRequestSchema = z.object({
  size: z.string().min(1, "Size is required"),
  priceAdjustment: z.number().default(0),
});

export type CreateProductVariantRequest = z.infer<typeof CreateProductVariantRequestSchema>;

// ============================================================================
// PRODUCT (Color Variant)
// ============================================================================

export const ProductSchema = z.object({
  id: z.number(),
  uuid: z.string().uuid(),
  productGroupId: z.number(),
  colorCode: z.string(),
  colorName: z.string(),
  images: z.array(ProductImageSchema),
  sizeVariants: z.array(ProductVariantSchema),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type Product = z.infer<typeof ProductSchema>;

export const CreateProductRequestSchema = z.object({
  colorCode: z.string().min(1, "Color code is required"),
  colorName: z.string().min(1, "Color name is required"),
  sizeVariants: z.array(CreateProductVariantRequestSchema).min(1, "At least one size is required"),
});

export type CreateProductRequest = z.infer<typeof CreateProductRequestSchema>;

// ============================================================================
// PRODUCT GROUP (Base Product)
// ============================================================================

export const ProductGroupSchema = z.object({
  id: z.number(),
  uuid: z.string().uuid(),
  name: z.string(),
  slug: z.string(),
  description: z.string(),
  basePrice: z.number(),
  offerPrice: z.number().nullable().optional(),
  categoryId: z.number(),
  category: CategorySchema.optional(),
  attributes: ProductAttributesSchema,
  deliveryNote: z.string().nullable().optional(),
  isActive: z.boolean(),
  isFeatured: z.boolean(),
  colorVariants: z.array(ProductSchema),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type ProductGroup = z.infer<typeof ProductGroupSchema>;

export const CreateProductGroupRequestSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  description: z.string().min(1, "Description is required"),
  basePrice: z.number().min(0, "Price must be positive"),
  categoryId: z.number(),
  attributes: ProductAttributesSchema.optional(),
  isFeatured: z.boolean().optional(),
  colorVariants: z.array(CreateProductRequestSchema).min(1, "At least one color variant is required"),
});

export type CreateProductGroupRequest = z.infer<typeof CreateProductGroupRequestSchema>;

export const UpdateProductGroupRequestSchema = CreateProductGroupRequestSchema.partial().extend({
  isActive: z.boolean().optional(),
});

export type UpdateProductGroupRequest = z.infer<typeof UpdateProductGroupRequestSchema>;

// ============================================================================
// QUERY PARAMS
// ============================================================================

export const GetProductsParamsSchema = z.object({
  page: z.number().optional(),
  pageSize: z.number().optional(),
  search: z.string().optional(),
  categoryId: z.number().optional(),
  categorySlug: z.string().optional(),
  minPrice: z.number().optional(),
  maxPrice: z.number().optional(),
  colors: z.array(z.string()).optional(),
  sizes: z.array(z.string()).optional(),
  fabricTypes: z.array(FabricTypeSchema).optional(),
  patterns: z.array(PatternSchema).optional(),
  isFeatured: z.boolean().optional(),
  isActive: z.boolean().optional(),
  sortBy: z.enum(["name", "price", "createdAt"]).optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
});

export type GetProductsParams = z.infer<typeof GetProductsParamsSchema>;

// ============================================================================
// PRODUCT DISPLAY (For storefront)
// ============================================================================

/**
 * Simplified product for listing pages
 */
export const ProductListItemSchema = z.object({
  id: z.number().optional(),
  uuid: z.string().uuid(),
  slug: z.string(),
  name: z.string(),
  basePrice: z.number(),
  offerPrice: z.number().nullable().optional(),
  categoryName: z.string().nullable().optional(),
  primaryImage: z.string().nullable().optional(),
  colorName: z.string().optional(),
  colorCode: z.string().nullable().optional(),
  colorCount: z.number(),
  isFeatured: z.boolean(),
  hasOffer: z.boolean().optional(),
  offerText: z.string().nullable().optional(),
  fabricType: z.string().nullable().optional(),
  pattern: z.string().nullable().optional(),
  colors: z.array(z.object({
    colorName: z.string(),
    colorCode: z.string().nullable(),
  })).optional(),
  sizes: z.array(z.string()).optional(),
  averageRating: z.number().optional(),
  reviewCount: z.number().optional(),
});

export type ProductListItem = z.infer<typeof ProductListItemSchema>;
