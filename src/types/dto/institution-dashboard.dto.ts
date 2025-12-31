import { z } from 'zod';

// === Dashboard Data Response ===
export const InstitutionDashboardDataSchema = z.object({
  institution: z.object({
    id: z.number(),
    uuid: z.string().uuid(),
    name: z.string(),
    code: z.string(),
    selectedTemplateId: z.number().nullable(),
  }),
  stats: z.object({
    totalPhases: z.number(),
    completedPhases: z.number(),
    inProgressPhases: z.number(),
    pendingPhases: z.number(),
    totalSubmissions: z.number(),
    completedSubmissions: z.number(),
    pendingSubmissions: z.number(),
    completionPercentage: z.number().min(0).max(100),
    lastActivity: z.string().nullable(),
  }),
  phases: z.array(
    z.object({
      id: z.number(),
      uuid: z.string().uuid(),
      name: z.string(),
      description: z.string().nullable(),
      status: z.enum([
        'file-processing',
        'design-completed',
        'printing-ongoing',
        'lanyard-attachment',
        'packaging-process',
        'on-transit',
        'delivered',
      ]).nullable(),
      submissionCount: z.number(),
      targetCount: z.number(),
      startedAt: z.string().nullable(),
      completedAt: z.string().nullable(),
      createdAt: z.string(),
    })
  ),
});

export const InstitutionDashboardResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: InstitutionDashboardDataSchema,
});

export type InstitutionDashboardData = z.infer<typeof InstitutionDashboardDataSchema>;
export type InstitutionDashboardResponse = z.infer<typeof InstitutionDashboardResponseSchema>;

// === Template Selection Request ===
export const SelectTemplateRequestSchema = z.object({
  templateId: z.number().positive(),
});

export type SelectTemplateRequest = z.infer<typeof SelectTemplateRequestSchema>;

// === Template Selection Response ===
export const SelectTemplateResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.object({
    institutionId: z.number(),
    selectedTemplateId: z.number(),
    templateName: z.string(),
  }),
});

export type SelectTemplateResponse = z.infer<typeof SelectTemplateResponseSchema>;

// === Institution Submissions Query Params ===
export interface GetInstitutionSubmissionsParams {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: 'pending' | 'submitted' | 'expired';
  phaseId?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
