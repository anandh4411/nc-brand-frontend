/**
 * Review DTOs
 * Product ratings and reviews
 */

import { z } from "zod";

// ============================================================================
// REVIEW
// ============================================================================

export const ReviewSchema = z.object({
  id: z.number(),
  uuid: z.string().uuid(),
  productGroupId: z.number(),
  productGroupName: z.string().optional(),
  customerId: z.number(),
  customerName: z.string(),
  orderId: z.number().optional(),
  rating: z.number().min(1).max(5),
  title: z.string().optional(),
  comment: z.string().optional(),
  isVerifiedPurchase: z.boolean(),
  isApproved: z.boolean(),
  createdAt: z.string(),
});

export type Review = z.infer<typeof ReviewSchema>;

// ============================================================================
// CREATE/UPDATE REVIEW
// ============================================================================

export const CreateReviewRequestSchema = z.object({
  productGroupId: z.number(),
  orderId: z.number().optional(),
  rating: z.number().min(1, "Rating is required").max(5),
  title: z.string().optional(),
  comment: z.string().optional(),
});

export type CreateReviewRequest = z.infer<typeof CreateReviewRequestSchema>;

export const UpdateReviewRequestSchema = z.object({
  rating: z.number().min(1).max(5).optional(),
  title: z.string().optional(),
  comment: z.string().optional(),
});

export type UpdateReviewRequest = z.infer<typeof UpdateReviewRequestSchema>;

// ============================================================================
// QUERY PARAMS
// ============================================================================

export const GetReviewsParamsSchema = z.object({
  page: z.number().optional(),
  pageSize: z.number().optional(),
  productGroupId: z.number().optional(),
  customerId: z.number().optional(),
  rating: z.number().optional(),
  isVerifiedPurchase: z.boolean().optional(),
  isApproved: z.boolean().optional(),
  sortBy: z.enum(["createdAt", "rating"]).optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
});

export type GetReviewsParams = z.infer<typeof GetReviewsParamsSchema>;

// ============================================================================
// REVIEW SUMMARY (For product page)
// ============================================================================

export const ReviewSummarySchema = z.object({
  productGroupId: z.number(),
  totalReviews: z.number(),
  averageRating: z.number(),
  ratingDistribution: z.object({
    1: z.number(),
    2: z.number(),
    3: z.number(),
    4: z.number(),
    5: z.number(),
  }),
});

export type ReviewSummary = z.infer<typeof ReviewSummarySchema>;
