// src/features/dashboard/data/schema.ts
import { z } from "zod";

export const templateSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  imageUrl: z.string(),
  category: z.enum(["school", "office", "medical", "generic"]),
  features: z.array(z.string()),
  isPopular: z.boolean().default(false),
});

export const institutionProgressSchema = z.object({
  institutionId: z.number(),
  institutionName: z.string(),
  selectedTemplateId: z.number().nullable(),
  selectedTemplate: templateSchema.nullable(),
  totalPhases: z.number(),
  completedPhases: z.number(),
  inProgressPhases: z.number(),
  pendingPhases: z.number(),
  totalSubmissions: z.number(),
  completedSubmissions: z.number(),
  pendingSubmissions: z.number(),
  completionPercentage: z.number(),
  lastActivity: z.string(),
});

export const phaseCardSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().nullable().optional(),
  // Phase production statuses (nullable - can be null when not set)
  status: z.enum([
    "file-processing",
    "design-completed",
    "printing-ongoing",
    "lanyard-attachment",
    "packaging-process",
    "on-transit",
    "delivered",
  ]).nullable(),
  submissionCount: z.number(),
  targetCount: z.number().optional(),
  startedAt: z.string().nullable().optional(),
  completedAt: z.string().nullable().optional(),
  createdAt: z.string(),
});

export const templateListSchema = z.array(templateSchema);
export const phaseListSchema = z.array(phaseCardSchema);

export type Template = z.infer<typeof templateSchema>;
export type InstitutionProgress = z.infer<typeof institutionProgressSchema>;
export type PhaseCard = z.infer<typeof phaseCardSchema>;
export type TemplateList = z.infer<typeof templateListSchema>;
export type PhaseList = z.infer<typeof phaseListSchema>;
