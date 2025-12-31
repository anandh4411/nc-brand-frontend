import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { mainCategoriesApi, subCategoriesApi } from '@/api/endpoints/categories';
import { queryKeys } from '@/api/query-keys';
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
import { toast } from '@/lib/toast';

// ==================== MAIN CATEGORIES ====================

export const useMainCategories = (params?: GetMainCategoriesParams) => {
  return useQuery({
    queryKey: queryKeys.mainCategories.list(params),
    queryFn: () => mainCategoriesApi.getMainCategories(params),
  });
};

export const useMainCategory = (uuid: string) => {
  return useQuery({
    queryKey: queryKeys.mainCategories.detail(uuid),
    queryFn: () => mainCategoriesApi.getMainCategoryById(uuid),
    enabled: !!uuid,
  });
};

export const useCreateMainCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateMainCategoryRequest) =>
      mainCategoriesApi.createMainCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.mainCategories.lists() });
      toast.success('Success', 'Main category created successfully');
    },
    onError: (error: any) => {
      toast.error('Error', error?.message || 'Failed to create main category');
    },
  });
};

export const useUpdateMainCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ uuid, data }: { uuid: string; data: UpdateMainCategoryRequest }) =>
      mainCategoriesApi.updateMainCategory(uuid, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.mainCategories.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.mainCategories.detail(variables.uuid) });
      toast.success('Success', 'Main category updated successfully');
    },
    onError: (error: any) => {
      toast.error('Error', error?.message || 'Failed to update main category');
    },
  });
};

export const useDeleteMainCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (uuid: string) => mainCategoriesApi.deleteMainCategory(uuid),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.mainCategories.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.subCategories.lists() });
      toast.success('Success', 'Main category deleted successfully');
    },
    onError: (error: any) => {
      toast.error('Error', error?.message || 'Failed to delete main category');
    },
  });
};

// ==================== SUB CATEGORIES ====================

export const useSubCategories = (params?: GetSubCategoriesParams) => {
  return useQuery({
    queryKey: queryKeys.subCategories.list(params),
    queryFn: () => subCategoriesApi.getSubCategories(params),
  });
};

export const useSubCategory = (uuid: string) => {
  return useQuery({
    queryKey: queryKeys.subCategories.detail(uuid),
    queryFn: () => subCategoriesApi.getSubCategoryById(uuid),
    enabled: !!uuid,
  });
};

export const useCreateSubCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateSubCategoryRequest) =>
      subCategoriesApi.createSubCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.subCategories.lists() });
      toast.success('Success', 'Sub category created successfully');
    },
    onError: (error: any) => {
      toast.error('Error', error?.message || 'Failed to create sub category');
    },
  });
};

export const useUpdateSubCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ uuid, data }: { uuid: string; data: UpdateSubCategoryRequest }) =>
      subCategoriesApi.updateSubCategory(uuid, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.subCategories.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.subCategories.detail(variables.uuid) });
      toast.success('Success', 'Sub category updated successfully');
    },
    onError: (error: any) => {
      toast.error('Error', error?.message || 'Failed to update sub category');
    },
  });
};

export const useDeleteSubCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (uuid: string) => subCategoriesApi.deleteSubCategory(uuid),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.subCategories.lists() });
      toast.success('Success', 'Sub category deleted successfully');
    },
    onError: (error: any) => {
      toast.error('Error', error?.message || 'Failed to delete sub category');
    },
  });
};
