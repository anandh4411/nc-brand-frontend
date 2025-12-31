import { apiClient } from '../client/axios';
import type { CreateTemplateRequest, UpdateTemplateRequest, GetTemplatesParams } from '@/types/dto/template.dto';
import { env } from '@/config/env';

export const templatesApi = {
  getTemplates: (params?: GetTemplatesParams) =>
    apiClient.get<any>(`${env.apiVersion}/templates`, { params }),

  getTemplateById: (uuid: string) =>
    apiClient.get<any>(`${env.apiVersion}/templates/${uuid}`),

  createTemplate: (data: CreateTemplateRequest) => {
    // Always use FormData to match backend expectation
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('description', data.description);
    formData.append('category', data.category);
    formData.append('isPopular', String(data.isPopular || false));
    if (data.features) formData.append('features', JSON.stringify(data.features));

    // Only append image if File is provided
    if (data.imageUrl instanceof File) {
      formData.append('imageUrl', data.imageUrl);
    }

    return apiClient.uploadFile<any>(`${env.apiVersion}/templates`, formData);
  },

  updateTemplate: (uuid: string, data: UpdateTemplateRequest) => {
    // Always use FormData to match backend expectation
    const formData = new FormData();
    if (data.name) formData.append('name', data.name);
    if (data.description) formData.append('description', data.description);
    if (data.category) formData.append('category', data.category);
    if (data.isPopular !== undefined) formData.append('isPopular', String(data.isPopular));
    if (data.features) formData.append('features', JSON.stringify(data.features));

    // Only append image if File is provided (new upload)
    if (data.imageUrl instanceof File) {
      formData.append('imageUrl', data.imageUrl);
    }

    return apiClient.uploadFile<any>(`${env.apiVersion}/templates/${uuid}`, formData, { method: 'PUT' });
  },

  deleteTemplate: (uuid: string) =>
    apiClient.delete<any>(`${env.apiVersion}/templates/${uuid}`),
};
