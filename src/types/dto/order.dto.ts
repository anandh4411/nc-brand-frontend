/**
 * Order DTOs
 * Customer order management
 */

import { z } from "zod";

// ============================================================================
// ORDER STATUS
// ============================================================================

export const OrderStatusSchema = z.enum([
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
  "returned",
]);

export type OrderStatus = z.infer<typeof OrderStatusSchema>;

export const PaymentStatusSchema = z.enum([
  "pending",
  "paid",
  "failed",
  "refunded",
]);

export type PaymentStatus = z.infer<typeof PaymentStatusSchema>;

export const PaymentMethodSchema = z.enum([
  "razorpay",
  "cod",
]);

export type PaymentMethod = z.infer<typeof PaymentMethodSchema>;

// ============================================================================
// ADDRESS
// ============================================================================

export const AddressSchema = z.object({
  id: z.number(),
  uuid: z.string().uuid(),
  customerId: z.number(),
  name: z.string(),
  phone: z.string(),
  addressLine1: z.string(),
  addressLine2: z.string().optional(),
  city: z.string(),
  state: z.string(),
  pincode: z.string(),
  isDefault: z.boolean(),
  createdAt: z.string(),
});

export type Address = z.infer<typeof AddressSchema>;

export const CreateAddressRequestSchema = z.object({
  name: z.string().min(1, "Name is required"),
  phone: z.string().min(10, "Phone must be at least 10 digits"),
  addressLine1: z.string().min(1, "Address is required"),
  addressLine2: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  pincode: z.string().min(6, "Pincode must be 6 digits").max(6),
  isDefault: z.boolean().optional(),
});

export type CreateAddressRequest = z.infer<typeof CreateAddressRequestSchema>;

// ============================================================================
// ORDER ITEM
// ============================================================================

/**
 * Product snapshot - stored at time of order to preserve pricing/details
 */
export const ProductSnapshotSchema = z.object({
  productGroupName: z.string(),
  colorName: z.string(),
  size: z.string(),
  sku: z.string(),
  imageUrl: z.string().optional(),
});

export type ProductSnapshot = z.infer<typeof ProductSnapshotSchema>;

export const OrderItemSchema = z.object({
  id: z.number(),
  orderId: z.number(),
  productVariantId: z.number(),
  productSnapshot: ProductSnapshotSchema,
  quantity: z.number(),
  unitPrice: z.number(),
  totalPrice: z.number(),
});

export type OrderItem = z.infer<typeof OrderItemSchema>;

// ============================================================================
// ORDER
// ============================================================================

export const OrderSchema = z.object({
  id: z.number(),
  uuid: z.string().uuid(),
  orderNumber: z.string(),
  customerId: z.number(),
  customerName: z.string().optional(),
  customerEmail: z.string().optional(),
  billingAddress: AddressSchema,
  shippingAddress: AddressSchema,
  status: OrderStatusSchema,
  items: z.array(OrderItemSchema),
  subtotal: z.number(),
  tax: z.number(),
  shippingFee: z.number(),
  total: z.number(),
  paymentStatus: PaymentStatusSchema,
  paymentMethod: PaymentMethodSchema,
  razorpayOrderId: z.string().optional(),
  razorpayPaymentId: z.string().optional(),
  notes: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type Order = z.infer<typeof OrderSchema>;

// ============================================================================
// ORDER STATUS HISTORY
// ============================================================================

export const OrderStatusHistorySchema = z.object({
  id: z.number(),
  orderId: z.number(),
  status: OrderStatusSchema,
  notes: z.string().optional(),
  createdBy: z.number().optional(),
  createdByName: z.string().optional(),
  createdAt: z.string(),
});

export type OrderStatusHistory = z.infer<typeof OrderStatusHistorySchema>;

// ============================================================================
// CREATE ORDER (from cart)
// ============================================================================

export const CreateOrderRequestSchema = z.object({
  billingAddressId: z.number(),
  shippingAddressId: z.number(),
  paymentMethod: PaymentMethodSchema,
  notes: z.string().optional(),
});

export type CreateOrderRequest = z.infer<typeof CreateOrderRequestSchema>;

// ============================================================================
// UPDATE ORDER STATUS (Admin)
// ============================================================================

export const UpdateOrderStatusRequestSchema = z.object({
  status: OrderStatusSchema,
  notes: z.string().optional(),
});

export type UpdateOrderStatusRequest = z.infer<typeof UpdateOrderStatusRequestSchema>;

// ============================================================================
// QUERY PARAMS
// ============================================================================

export const GetOrdersParamsSchema = z.object({
  page: z.number().optional(),
  pageSize: z.number().optional(),
  search: z.string().optional(),
  status: OrderStatusSchema.optional(),
  paymentStatus: PaymentStatusSchema.optional(),
  customerId: z.number().optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  sortBy: z.enum(["createdAt", "total", "orderNumber"]).optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
});

export type GetOrdersParams = z.infer<typeof GetOrdersParamsSchema>;

// ============================================================================
// ORDER LIST ITEM (Simplified for listing)
// ============================================================================

export const OrderListItemSchema = z.object({
  uuid: z.string().uuid(),
  orderNumber: z.string(),
  status: OrderStatusSchema,
  paymentStatus: PaymentStatusSchema,
  total: z.number(),
  itemCount: z.number(),
  createdAt: z.string(),
});

export type OrderListItem = z.infer<typeof OrderListItemSchema>;
