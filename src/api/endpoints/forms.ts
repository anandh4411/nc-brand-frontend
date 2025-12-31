import { apiClient } from '../client/axios';
import type { CreateFormRequest, UpdateFormRequest, GetFormsParams } from '@/types/dto/form.dto';
import type { CreateFormFieldRequest, UpdateFormFieldRequest, GetFormFieldsParams } from '@/types/dto/form-field.dto';
import { env } from '@/config/env';

export const formsApi = {
  getForms: (params?: GetFormsParams) =>
    apiClient.get<any>(`${env.apiVersion}/forms`, { params }),

  getFormById: (uuid: string) =>
    apiClient.get<any>(`${env.apiVersion}/forms/${uuid}`),

  createForm: (data: CreateFormRequest) =>
    apiClient.post<any>(`${env.apiVersion}/forms`, data),

  updateForm: (uuid: string, data: UpdateFormRequest) =>
    apiClient.put<any>(`${env.apiVersion}/forms/${uuid}`, data),

  deleteForm: (uuid: string) =>
    apiClient.delete<any>(`${env.apiVersion}/forms/${uuid}`),
};

export const formFieldsApi = {
  getFormFields: (params?: GetFormFieldsParams) =>
    apiClient.get<any>(`${env.apiVersion}/form-fields`, { params }),

  getFormFieldById: (uuid: string) =>
    apiClient.get<any>(`${env.apiVersion}/form-fields/${uuid}`),

  createFormField: (data: CreateFormFieldRequest) =>
    apiClient.post<any>(`${env.apiVersion}/form-fields`, data),

  updateFormField: (uuid: string, data: UpdateFormFieldRequest) =>
    apiClient.put<any>(`${env.apiVersion}/form-fields/${uuid}`, data),

  deleteFormField: (uuid: string) =>
    apiClient.delete<any>(`${env.apiVersion}/form-fields/${uuid}`),

  // Bulk operations
  bulkGetFormFields: (formId: number) =>
    apiClient.post<any>(`${env.apiVersion}/form-fields/bulk/get`, { formId }),

  bulkCreateFormFields: (formId: number, fields: any[]) =>
    apiClient.post<any>(`${env.apiVersion}/form-fields/bulk`, { formId, fields }),

  bulkUpdateFormFields: (formId: number, fields: any[]) =>
    apiClient.put<any>(`${env.apiVersion}/form-fields/bulk`, { formId, fields }),
};
