/**
 * Inventory DTOs
 * Manufacturing inventory and outlet inventory management
 */

import { z } from "zod";

// ============================================================================
// MANUFACTURING INVENTORY
// ============================================================================

export const InventoryItemSchema = z.object({
  id: z.number(),
  productVariantId: z.number(),
  productVariantSku: z.string(),
  productName: z.string(),
  colorName: z.string(),
  size: z.string(),
  quantity: z.number(),
  lowStockThreshold: z.number(),
  batchNumber: z.string().optional(),
  updatedAt: z.string(),
});

export type InventoryItem = z.infer<typeof InventoryItemSchema>;

export const UpdateInventoryRequestSchema = z.object({
  quantity: z.number().min(0, "Quantity cannot be negative"),
  lowStockThreshold: z.number().min(0).optional(),
  batchNumber: z.string().optional(),
});

export type UpdateInventoryRequest = z.infer<typeof UpdateInventoryRequestSchema>;

export const StockAdjustmentRequestSchema = z.object({
  productVariantId: z.number(),
  adjustment: z.number(), // Can be positive (add) or negative (remove)
  reason: z.string().min(1, "Reason is required"),
  batchNumber: z.string().optional(),
});

export type StockAdjustmentRequest = z.infer<typeof StockAdjustmentRequestSchema>;

// ============================================================================
// OUTLET INVENTORY
// ============================================================================

export const OutletInventoryItemSchema = z.object({
  id: z.number(),
  outletId: z.number(),
  outletName: z.string(),
  productVariantId: z.number(),
  productVariantSku: z.string(),
  productName: z.string(),
  colorName: z.string(),
  size: z.string(),
  quantity: z.number(),
  lowStockThreshold: z.number(),
  updatedAt: z.string(),
});

export type OutletInventoryItem = z.infer<typeof OutletInventoryItemSchema>;

// ============================================================================
// SHIPMENTS (Manufacturing -> Outlet)
// ============================================================================

export const ShipmentStatusSchema = z.enum([
  "pending",
  "shipped",
  "delivered",
  "cancelled",
]);

export type ShipmentStatus = z.infer<typeof ShipmentStatusSchema>;

export const ShipmentItemSchema = z.object({
  id: z.number(),
  shipmentId: z.number(),
  productVariantId: z.number(),
  productVariantSku: z.string(),
  productName: z.string(),
  colorName: z.string(),
  size: z.string(),
  quantity: z.number(),
  receivedQuantity: z.number().optional(),
});

export type ShipmentItem = z.infer<typeof ShipmentItemSchema>;

export const ShipmentSchema = z.object({
  id: z.number(),
  uuid: z.string().uuid(),
  outletId: z.number(),
  outletName: z.string(),
  status: ShipmentStatusSchema,
  items: z.array(ShipmentItemSchema),
  shippedAt: z.string().nullable(),
  deliveredAt: z.string().nullable(),
  notes: z.string().optional(),
  createdBy: z.number(),
  createdByName: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type Shipment = z.infer<typeof ShipmentSchema>;

export const CreateShipmentItemRequestSchema = z.object({
  productVariantId: z.number(),
  quantity: z.number().min(1, "Quantity must be at least 1"),
});

export type CreateShipmentItemRequest = z.infer<typeof CreateShipmentItemRequestSchema>;

export const CreateShipmentRequestSchema = z.object({
  outletId: z.number(),
  items: z.array(CreateShipmentItemRequestSchema).min(1, "At least one item is required"),
  notes: z.string().optional(),
});

export type CreateShipmentRequest = z.infer<typeof CreateShipmentRequestSchema>;

export const ReceiveShipmentRequestSchema = z.object({
  items: z.array(
    z.object({
      shipmentItemId: z.number(),
      receivedQuantity: z.number().min(0),
    })
  ),
  notes: z.string().optional(),
});

export type ReceiveShipmentRequest = z.infer<typeof ReceiveShipmentRequestSchema>;

// ============================================================================
// QUERY PARAMS
// ============================================================================

export const GetInventoryParamsSchema = z.object({
  page: z.number().optional(),
  pageSize: z.number().optional(),
  search: z.string().optional(),
  lowStockOnly: z.boolean().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
});

export type GetInventoryParams = z.infer<typeof GetInventoryParamsSchema>;

export const GetShipmentsParamsSchema = z.object({
  page: z.number().optional(),
  pageSize: z.number().optional(),
  outletId: z.number().optional(),
  status: ShipmentStatusSchema.optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
});

export type GetShipmentsParams = z.infer<typeof GetShipmentsParamsSchema>;

// ============================================================================
// LOW STOCK ALERT
// ============================================================================

export const LowStockAlertSchema = z.object({
  productVariantId: z.number(),
  productVariantSku: z.string(),
  productName: z.string(),
  colorName: z.string(),
  size: z.string(),
  currentQuantity: z.number(),
  threshold: z.number(),
  location: z.enum(["manufacturing", "outlet"]),
  outletId: z.number().optional(),
  outletName: z.string().optional(),
});

export type LowStockAlert = z.infer<typeof LowStockAlertSchema>;
