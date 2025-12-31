import { apiClient } from '../client/axios';
import type { CreateProductRequest, UpdateProductRequest, GetProductsParams, LandingProductsData } from '@/types/dto/product.dto';
import { env } from '@/config/env';

export const productsApi = {
  getProducts: (params?: GetProductsParams) =>
    apiClient.get<any>(`${env.apiVersion}/products`, { params }),

  getProductById: (uuid: string) =>
    apiClient.get<any>(`${env.apiVersion}/products/${uuid}`),

  createProduct: (data: CreateProductRequest) => {
    // Always use FormData to match backend expectation
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('description', data.description || '');
    formData.append('price', data.price);
    formData.append('mainCategoryId', String(data.mainCategoryId));
    formData.append('subCategoryId', String(data.subCategoryId));
    formData.append('isPopular', String(data.isPopular || false));

    // Only append image if File is provided
    if (data.image instanceof File) {
      formData.append('image', data.image);
    }

    return apiClient.uploadFile<any>(`${env.apiVersion}/products`, formData);
  },

  updateProduct: (uuid: string, data: UpdateProductRequest) => {
    // Always use FormData to match backend expectation
    const formData = new FormData();
    if (data.name) formData.append('name', data.name);
    if (data.description) formData.append('description', data.description);
    if (data.price) formData.append('price', data.price);
    if (data.mainCategoryId) formData.append('mainCategoryId', String(data.mainCategoryId));
    if (data.subCategoryId) formData.append('subCategoryId', String(data.subCategoryId));
    if (data.isPopular !== undefined) formData.append('isPopular', String(data.isPopular));

    // Only append image if File is provided (new upload)
    if (data.image instanceof File) {
      formData.append('image', data.image);
    }

    return apiClient.uploadFile<any>(`${env.apiVersion}/products/${uuid}`, formData, { method: 'PUT' });
  },

  deleteProduct: (uuid: string) =>
    apiClient.delete<any>(`${env.apiVersion}/products/${uuid}`),

  // Public endpoint for landing page (no auth required)
  getLandingProducts: () =>
    apiClient.get<LandingProductsData>(`${env.apiVersion}/products/landing`),
};
