import { apiClient } from '../client/axios';
import { env } from '@/config/env';
import type {
  InstitutionLoginRequest,
  InstitutionLoginData,
} from '@/types/dto/institution-auth.dto';
import type {
  InstitutionDashboardData,
  InstitutionDashboardResponse,
  SelectTemplateRequest,
  SelectTemplateResponse,
  GetInstitutionSubmissionsParams,
} from '@/types/dto/institution-dashboard.dto';
import type { SubmissionData } from '@/types/dto/submission.dto';

export const institutionApi = {
  // === Auth ===
  login: (data: InstitutionLoginRequest) =>
    apiClient.post<InstitutionLoginData>(
      `${env.apiVersion}/auth/institution-login`,
      data
    ),

  // === Dashboard ===
  getDashboard: () =>
    apiClient.get<InstitutionDashboardData>(
      `${env.apiVersion}/institutions/dashboard`
    ),

  selectTemplate: (data: SelectTemplateRequest) =>
    apiClient.post<SelectTemplateResponse>(
      `${env.apiVersion}/institutions/select-template`,
      data
    ),

  // === Submissions ===
  getSubmissions: (params?: GetInstitutionSubmissionsParams) =>
    apiClient.get<{
      submissions: SubmissionData[];
      pagination: {
        total: number;
        page: number;
        pageSize: number;
        totalPages: number;
      };
    }>(`${env.apiVersion}/institutions/submissions`, { params }),

  // === Export ===
  exportPdf: (params?: { phaseId?: number }) =>
    apiClient.downloadFile(`${env.apiVersion}/institutions/submissions/export/pdf`, { params }),
};
