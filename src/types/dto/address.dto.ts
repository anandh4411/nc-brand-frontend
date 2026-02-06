/**
 * Address DTOs
 */

import { z } from "zod";

// ============================================================================
// ADDRESS
// ============================================================================

export const AddressSchema = z.object({
  id: z.number(),
  uuid: z.string().uuid(),
  name: z.string(),
  phone: z.string(),
  addressLine1: z.string(),
  addressLine2: z.string().nullable(),
  city: z.string(),
  state: z.string(),
  pincode: z.string(),
  isDefault: z.boolean(),
  createdAt: z.string(),
});

export type Address = z.infer<typeof AddressSchema>;

// ============================================================================
// CREATE/UPDATE REQUESTS
// ============================================================================

export const CreateAddressRequestSchema = z.object({
  name: z.string().min(2, "Name is required"),
  phone: z.string().min(10, "Valid phone number required"),
  addressLine1: z.string().min(5, "Address is required"),
  addressLine2: z.string().optional(),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  pincode: z.string().length(6, "Pincode must be 6 digits"),
  isDefault: z.boolean().optional(),
});

export type CreateAddressRequest = z.infer<typeof CreateAddressRequestSchema>;

export const UpdateAddressRequestSchema = CreateAddressRequestSchema.partial();

export type UpdateAddressRequest = z.infer<typeof UpdateAddressRequestSchema>;
