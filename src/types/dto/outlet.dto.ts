/**
 * Outlet DTOs
 * Outlets are physical store locations managed by the manufacturing unit
 */

import { z } from "zod";

// ============================================================================
// SCHEMAS
// ============================================================================

/**
 * Outlet Data
 */
export const OutletSchema = z.object({
  id: z.number(),
  uuid: z.string().uuid(),
  code: z.string(),
  loginCode: z.string(), // 6-digit alphanumeric for outlet login
  name: z.string(),
  address: z.string(),
  city: z.string(),
  state: z.string(),
  pincode: z.string(),
  phone: z.string(),
  email: z.string().email(),
  isActive: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type Outlet = z.infer<typeof OutletSchema>;

/**
 * Create Outlet Request
 */
export const CreateOutletRequestSchema = z.object({
  code: z.string().min(1, "Outlet code is required"),
  name: z.string().min(1, "Outlet name is required"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  pincode: z.string().min(6, "Pincode must be 6 digits").max(6),
  phone: z.string().min(10, "Phone must be at least 10 digits"),
  email: z.string().email("Invalid email format"),
});

export type CreateOutletRequest = z.infer<typeof CreateOutletRequestSchema>;

/**
 * Update Outlet Request
 */
export const UpdateOutletRequestSchema = CreateOutletRequestSchema.partial().extend({
  isActive: z.boolean().optional(),
});

export type UpdateOutletRequest = z.infer<typeof UpdateOutletRequestSchema>;

/**
 * Get Outlets Query Params
 */
export const GetOutletsParamsSchema = z.object({
  page: z.number().optional(),
  pageSize: z.number().optional(),
  search: z.string().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
  isActive: z.boolean().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
});

export type GetOutletsParams = z.infer<typeof GetOutletsParamsSchema>;

/**
 * Outlet Stats (for dashboard)
 */
export const OutletStatsSchema = z.object({
  totalStock: z.number(),
  lowStockItems: z.number(),
  pendingShipments: z.number(),
  todaySales: z.number(),
  monthlySales: z.number(),
});

export type OutletStats = z.infer<typeof OutletStatsSchema>;
