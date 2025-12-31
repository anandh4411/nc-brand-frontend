// src/features/submissions/data/schema.ts
import { z } from "zod";

export const submissionSchema = z.object({
  id: z.number(),
  uuid: z.string().uuid(),
  institutionId: z.number(),
  institutionName: z.string(),
  personName: z.string(),
  category: z.string().nullable().optional(), // class/department
  idNumber: z.string().nullable().optional(), // roll no/employee no
  class: z.string().nullable().optional(), // Student's class/grade (e.g., "10th Grade")
  loginCode: z.string(),
  status: z.enum(["pending", "submitted", "expired"]),
  submittedAt: z.string().nullable().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
  // Phase information
  phaseId: z.number().nullable().optional(),
  phaseName: z.string().nullable().optional(),
  addedToPhaseAt: z.string().nullable().optional(),
  // Image URL
  imageUrl: z.string().nullable().optional(),
});

export const submissionListSchema = z.array(submissionSchema);

export type Submission = z.infer<typeof submissionSchema>;
export type SubmissionList = z.infer<typeof submissionListSchema>;
