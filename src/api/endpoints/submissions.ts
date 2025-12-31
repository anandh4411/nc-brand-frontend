import { apiClient } from '../client/axios';
import type { CreateSubmissionRequest, UpdateSubmissionRequest, GetSubmissionsParams, BulkImportResult, ExportSubmissionsParams, DuplicateAction } from '@/types/dto/submission.dto';
import { env } from '@/config/env';

export const submissionsApi = {
  getSubmissions: (params?: GetSubmissionsParams) =>
    apiClient.get<any>(`${env.apiVersion}/submissions`, { params }),

  getSubmissionById: (uuid: string) =>
    apiClient.get<any>(`${env.apiVersion}/submissions/${uuid}`),

  createSubmission: (data: CreateSubmissionRequest) => {
    // Handle file upload
    if (data.imageUrl instanceof File) {
      const formData = new FormData();
      formData.append('institutionId', String(data.institutionId));
      formData.append('personName', data.personName);
      if (data.category) formData.append('category', data.category);
      if (data.idNumber) formData.append('idNumber', data.idNumber);
      if (data.loginCode) formData.append('loginCode', data.loginCode);
      if (data.status) formData.append('status', data.status);
      if (data.phaseId) formData.append('phaseId', String(data.phaseId));
      if (data.importedData) formData.append('importedData', JSON.stringify(data.importedData));
      if (data.formData) formData.append('formData', JSON.stringify(data.formData));
      formData.append('imageUrl', data.imageUrl);
      return apiClient.uploadFile<any>(`${env.apiVersion}/submissions`, formData);
    }
    return apiClient.post<any>(`${env.apiVersion}/submissions`, data);
  },

  updateSubmission: (uuid: string, data: UpdateSubmissionRequest) => {
    // Handle file upload
    if (data.imageUrl instanceof File) {
      const formData = new FormData();
      if (data.institutionId) formData.append('institutionId', String(data.institutionId));
      if (data.personName) formData.append('personName', data.personName);
      if (data.category) formData.append('category', data.category);
      if (data.idNumber) formData.append('idNumber', data.idNumber);
      if (data.loginCode) formData.append('loginCode', data.loginCode);
      if (data.status) formData.append('status', data.status);
      if (data.phaseId) formData.append('phaseId', String(data.phaseId));
      if (data.importedData) formData.append('importedData', JSON.stringify(data.importedData));
      if (data.formData) formData.append('formData', JSON.stringify(data.formData));
      formData.append('imageUrl', data.imageUrl);
      return apiClient.uploadFile<any>(`${env.apiVersion}/submissions/${uuid}`, formData);
    }
    return apiClient.put<any>(`${env.apiVersion}/submissions/${uuid}`, data);
  },

  deleteSubmission: (uuid: string) =>
    apiClient.delete<any>(`${env.apiVersion}/submissions/${uuid}`),

  addSubmissionsToPhase: (data: { submissionUuids: string[]; phaseUuid: string }) =>
    apiClient.post<any>(`${env.apiVersion}/submissions/add-to-phase`, data),

  bulkImportCSV: (institutionId: number, file: File, force?: boolean, duplicateAction?: DuplicateAction) => {
    const formData = new FormData();
    // Order matters for Fastify multipart - all fields must come before file
    formData.append('institutionId', String(institutionId));
    if (force) {
      formData.append('force', 'true');
    }
    if (duplicateAction) {
      formData.append('duplicateAction', duplicateAction);
    }
    formData.append('file', file); // File must be last
    // Use 5 minute timeout for bulk imports (large files take longer)
    return apiClient.uploadFile<BulkImportResult>(
      `${env.apiVersion}/submissions/bulk-import`,
      formData,
      { timeout: 300000 }
    );
  },

  exportSubmissions: (params: ExportSubmissionsParams) =>
    apiClient.downloadFile(`${env.apiVersion}/submissions/export`, { params }),

  exportBasicXlsx: (params: ExportSubmissionsParams) =>
    apiClient.downloadFile(`${env.apiVersion}/submissions/export/basic`, { params }),

  exportPdf: (params: ExportSubmissionsParams) =>
    apiClient.downloadFile(`${env.apiVersion}/submissions/export/pdf`, { params }),
};
