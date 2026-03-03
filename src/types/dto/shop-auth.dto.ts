/**
 * Shop Customer Auth DTOs
 */

import { z } from "zod";

// ============================================================================
// CUSTOMER DATA
// ============================================================================

export const CustomerDataSchema = z.object({
  id: z.number(),
  uuid: z.string().uuid(),
  name: z.string(),
  email: z.string().email(),
  phone: z.string().nullable(),
  isActive: z.boolean(),
  createdAt: z.string(),
});

export type CustomerData = z.infer<typeof CustomerDataSchema>;

// ============================================================================
// AUTH REQUESTS
// ============================================================================

export const CustomerLoginRequestSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type CustomerLoginRequest = z.infer<typeof CustomerLoginRequestSchema>;

export const CustomerRegisterRequestSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone must be at least 10 digits").optional(),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type CustomerRegisterRequest = z.infer<typeof CustomerRegisterRequestSchema>;

// ============================================================================
// OTP REQUESTS
// ============================================================================

export interface VerifyEmailRequest {
  email: string;
  otp: string;
}

export interface ResendOtpRequest {
  email: string;
}

// ============================================================================
// AUTH RESPONSES
// ============================================================================

export const CustomerAuthResponseSchema = z.object({
  customer: CustomerDataSchema,
  accessToken: z.string(),
  refreshToken: z.string(),
});

export type CustomerAuthResponse = z.infer<typeof CustomerAuthResponseSchema>;

export interface CustomerRegisterResult {
  email: string;
  uuid: string;
}
