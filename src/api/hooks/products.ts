import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { productsApi } from '@/api/endpoints/products';
import { queryKeys } from '@/api/query-keys';
import { toast } from '@/lib/toast';
import type { CreateProductRequest, UpdateProductRequest, GetProductsParams } from '@/types/dto/product.dto';

export const useProducts = (params?: GetProductsParams) => {
  return useQuery({
    queryKey: queryKeys.products.list(params),
    queryFn: () => productsApi.getProducts(params),
    placeholderData: keepPreviousData,
  });
};

export const useProduct = (uuid: string) => {
  return useQuery({
    queryKey: queryKeys.products.detail(uuid),
    queryFn: () => productsApi.getProductById(uuid),
    enabled: !!uuid,
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateProductRequest) => productsApi.createProduct(data),
    onSuccess: (response) => {
      // Invalidate and refetch immediately
      queryClient.invalidateQueries({ queryKey: queryKeys.products.lists() });
      queryClient.refetchQueries({ queryKey: queryKeys.products.lists() });

      toast.success('Success', response.message || 'Product created');
    },
    onError: (error: any) => {
      toast.error('Error', error.message || 'Failed to create product');
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ uuid, data }: { uuid: string; data: UpdateProductRequest }) =>
      productsApi.updateProduct(uuid, data),
    onSuccess: (response, variables) => {
      // Invalidate and refetch immediately
      queryClient.invalidateQueries({ queryKey: queryKeys.products.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.products.detail(variables.uuid) });

      // Force refetch to show updated image
      queryClient.refetchQueries({ queryKey: queryKeys.products.lists() });

      toast.success('Success', response.message || 'Product updated');
    },
    onError: (error: any) => {
      toast.error('Error', error.message || 'Failed to update product');
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (uuid: string) => productsApi.deleteProduct(uuid),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products.lists() });
      toast.success('Success', response.message || 'Product deleted');
    },
    onError: (error: any) => {
      toast.error('Error', error.message || 'Failed to delete product');
    },
  });
};

// Public hook for landing page (no auth required)
export const useLandingProducts = () => {
  return useQuery({
    queryKey: queryKeys.products.landing(),
    queryFn: () => productsApi.getLandingProducts(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
