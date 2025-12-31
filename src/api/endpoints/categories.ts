import { apiClient } from '../client/axios';
import type {
  CreateMainCategoryRequest,
  UpdateMainCategoryRequest,
  GetMainCategoriesParams
} from '@/types/dto/main-category.dto';
import type {
  CreateSubCategoryRequest,
  UpdateSubCategoryRequest,
  GetSubCategoriesParams
} from '@/types/dto/sub-category.dto';
import { env } from '@/config/env';

// Main Categories API
export const mainCategoriesApi = {
  getMainCategories: (params?: GetMainCategoriesParams) =>
    apiClient.get<any>(`${env.apiVersion}/main-categories`, { params }),

  getMainCategoryById: (uuid: string) =>
    apiClient.get<any>(`${env.apiVersion}/main-categories/${uuid}`),

  createMainCategory: (data: CreateMainCategoryRequest) =>
    apiClient.post<any>(`${env.apiVersion}/main-categories`, data),

  updateMainCategory: (uuid: string, data: UpdateMainCategoryRequest) =>
    apiClient.put<any>(`${env.apiVersion}/main-categories/${uuid}`, data),

  deleteMainCategory: (uuid: string) =>
    apiClient.delete<any>(`${env.apiVersion}/main-categories/${uuid}`),
};

// Sub Categories API
export const subCategoriesApi = {
  getSubCategories: (params?: GetSubCategoriesParams) =>
    apiClient.get<any>(`${env.apiVersion}/sub-categories`, { params }),

  getSubCategoryById: (uuid: string) =>
    apiClient.get<any>(`${env.apiVersion}/sub-categories/${uuid}`),

  createSubCategory: (data: CreateSubCategoryRequest) =>
    apiClient.post<any>(`${env.apiVersion}/sub-categories`, data),

  updateSubCategory: (uuid: string, data: UpdateSubCategoryRequest) =>
    apiClient.put<any>(`${env.apiVersion}/sub-categories/${uuid}`, data),

  deleteSubCategory: (uuid: string) =>
    apiClient.delete<any>(`${env.apiVersion}/sub-categories/${uuid}`),
};
