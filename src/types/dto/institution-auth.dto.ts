import { z } from 'zod';

// === Institution Login Request ===
export const InstitutionLoginRequestSchema = z.object({
  email: z.string().email('Invalid email format'),
  institutionCode: z.string().min(1, 'Institution code is required'),
});

export type InstitutionLoginRequest = z.infer<typeof InstitutionLoginRequestSchema>;

// === Institution Login Response ===
export const InstitutionLoginDataSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
  expiresIn: z.number(),
  user: z.object({
    id: z.number(),
    uuid: z.string().uuid(),
    name: z.string(),
    email: z.string(),
    role: z.literal('institution'),
    institutionId: z.number(),
    institutionName: z.string(),
    institutionCode: z.string(),
  }),
});

export const InstitutionLoginResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: InstitutionLoginDataSchema,
});

export type InstitutionLoginData = z.infer<typeof InstitutionLoginDataSchema>;
export type InstitutionLoginResponse = z.infer<typeof InstitutionLoginResponseSchema>;
