/**
 * Admin API Hooks
 *
 * React Query hooks for all admin operations
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../../endpoints/admin';
import type {
  CreateCategoryRequest,
  UpdateCategoryRequest,
  CreateProductGroupRequest,
  CreateProductRequest,
  CreateVariantRequest,
  AdjustStockRequest,
  CreateOutletRequest,
  UpdateOutletRequest,
  CreateShipmentRequest,
  CreateBannerRequest,
  CreateCouponRequest,
} from '../../endpoints/admin';

// Query keys
export const adminKeys = {
  // Dashboard
  dashboard: ['admin', 'dashboard'] as const,
  analytics: ['admin', 'analytics'] as const,
  lowStock: (limit?: number) => ['admin', 'low-stock', limit] as const,
  recentOrders: (limit?: number) => ['admin', 'recent-orders', limit] as const,
  pendingShipments: (limit?: number) => ['admin', 'pending-shipments', limit] as const,

  // Categories
  categories: ['admin', 'categories'] as const,
  category: (uuid: string) => ['admin', 'categories', uuid] as const,

  // Products
  productGroups: (params?: any) => ['admin', 'product-groups', params] as const,
  productGroup: (uuid: string) => ['admin', 'product-groups', uuid] as const,

  // Inventory
  inventory: (params?: any) => ['admin', 'inventory', params] as const,

  // Outlets
  outlets: (params?: any) => ['admin', 'outlets', params] as const,
  outlet: (uuid: string) => ['admin', 'outlets', uuid] as const,

  // Shipments
  shipments: (params?: any) => ['admin', 'shipments', params] as const,
  shipment: (uuid: string) => ['admin', 'shipments', uuid] as const,

  // Orders
  orders: (params?: any) => ['admin', 'orders', params] as const,
  order: (uuid: string) => ['admin', 'orders', uuid] as const,

  // Banners
  banners: ['admin', 'banners'] as const,

  // Coupons
  coupons: (params?: any) => ['admin', 'coupons', params] as const,

  // Customers
  customers: (params?: any) => ['admin', 'customers', params] as const,

  // Reviews
  reviews: (params?: any) => ['admin', 'reviews', params] as const,
};

// ============================================================================
// DASHBOARD HOOKS
// ============================================================================

export function useDashboardStats() {
  return useQuery({
    queryKey: adminKeys.dashboard,
    queryFn: () => adminApi.getDashboardStats(),
  });
}

export function useLowStockItems(limit = 10) {
  return useQuery({
    queryKey: adminKeys.lowStock(limit),
    queryFn: () => adminApi.getLowStockItems(limit),
  });
}

export function useRecentOrders(limit = 10) {
  return useQuery({
    queryKey: adminKeys.recentOrders(limit),
    queryFn: () => adminApi.getRecentOrders(limit),
  });
}

export function usePendingShipments(limit = 10) {
  return useQuery({
    queryKey: adminKeys.pendingShipments(limit),
    queryFn: () => adminApi.getPendingShipments(limit),
  });
}

export function useAdminAnalytics() {
  return useQuery({
    queryKey: adminKeys.analytics,
    queryFn: () => adminApi.getAnalytics(),
  });
}

// ============================================================================
// CATEGORY HOOKS
// ============================================================================

export function useAdminCategories() {
  return useQuery({
    queryKey: adminKeys.categories,
    queryFn: () => adminApi.getCategories(),
  });
}

export function useAdminCategory(uuid: string) {
  return useQuery({
    queryKey: adminKeys.category(uuid),
    queryFn: () => adminApi.getCategory(uuid),
    enabled: !!uuid,
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ data, image }: { data: CreateCategoryRequest; image?: File }) =>
      adminApi.createCategory(data, image),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.categories });
    },
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ uuid, data, image }: { uuid: string; data: UpdateCategoryRequest; image?: File }) =>
      adminApi.updateCategory(uuid, data, image),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.categories });
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (uuid: string) => adminApi.deleteCategory(uuid),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.categories });
    },
  });
}

// ============================================================================
// PRODUCT GROUP HOOKS
// ============================================================================

export function useAdminProductGroups(params?: { page?: number; pageSize?: number; search?: string; category?: string }) {
  return useQuery({
    queryKey: adminKeys.productGroups(params),
    queryFn: () => adminApi.getProductGroups(params),
  });
}

export function useAdminProductGroup(uuid: string) {
  return useQuery({
    queryKey: adminKeys.productGroup(uuid),
    queryFn: () => adminApi.getProductGroup(uuid),
    enabled: !!uuid,
  });
}

export function useCreateProductGroup() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateProductGroupRequest) => adminApi.createProductGroup(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'product-groups'] });
    },
  });
}

export function useUpdateProductGroup() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ uuid, data }: { uuid: string; data: Partial<CreateProductGroupRequest> }) =>
      adminApi.updateProductGroup(uuid, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'product-groups'] });
    },
  });
}

export function useDeleteProductGroup() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (uuid: string) => adminApi.deleteProductGroup(uuid),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'product-groups'] });
    },
  });
}

// ============================================================================
// PRODUCT (COLOR) HOOKS
// ============================================================================

export function useCreateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ groupUuid, data }: { groupUuid: string; data: CreateProductRequest }) =>
      adminApi.createProduct(groupUuid, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'product-groups'] });
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ uuid, data }: { uuid: string; data: Partial<CreateProductRequest> }) =>
      adminApi.updateProduct(uuid, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'product-groups'] });
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (uuid: string) => adminApi.deleteProduct(uuid),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'product-groups'] });
    },
  });
}

// ============================================================================
// VARIANT (SIZE) HOOKS
// ============================================================================

export function useCreateVariant() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ productUuid, data }: { productUuid: string; data: CreateVariantRequest }) =>
      adminApi.createVariant(productUuid, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'product-groups'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'inventory'] });
    },
  });
}

export function useUpdateVariant() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ uuid, data }: { uuid: string; data: Partial<CreateVariantRequest> }) =>
      adminApi.updateVariant(uuid, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'product-groups'] });
    },
  });
}

export function useDeleteVariant() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (uuid: string) => adminApi.deleteVariant(uuid),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'product-groups'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'inventory'] });
    },
  });
}

// ============================================================================
// IMAGE HOOKS
// ============================================================================

export function useUploadProductImage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ productUuid, file, isPrimary }: { productUuid: string; file: File; isPrimary?: boolean }) =>
      adminApi.uploadImage(productUuid, file, isPrimary),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'product-groups'] });
    },
  });
}

export function useDeleteProductImage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (uuid: string) => adminApi.deleteImage(uuid),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'product-groups'] });
    },
  });
}

// ============================================================================
// INVENTORY HOOKS
// ============================================================================

export function useAdminInventory(params?: { page?: number; pageSize?: number; lowStock?: boolean }) {
  return useQuery({
    queryKey: adminKeys.inventory(params),
    queryFn: () => adminApi.getInventory(params),
  });
}

export function useAdjustStock() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ variantUuid, data }: { variantUuid: string; data: AdjustStockRequest }) =>
      adminApi.adjustStock(variantUuid, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'inventory'] });
      queryClient.invalidateQueries({ queryKey: adminKeys.dashboard });
      queryClient.invalidateQueries({ queryKey: ['admin', 'low-stock'] });
    },
  });
}

export function useUpdateThreshold() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ variantUuid, threshold }: { variantUuid: string; threshold: number }) =>
      adminApi.updateThreshold(variantUuid, threshold),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'inventory'] });
    },
  });
}

// ============================================================================
// OUTLET HOOKS
// ============================================================================

export function useAdminOutlets(params?: { page?: number; pageSize?: number; search?: string }) {
  return useQuery({
    queryKey: adminKeys.outlets(params),
    queryFn: () => adminApi.getOutlets(params),
  });
}

export function useAdminOutlet(uuid: string) {
  return useQuery({
    queryKey: adminKeys.outlet(uuid),
    queryFn: () => adminApi.getOutlet(uuid),
    enabled: !!uuid,
  });
}

export function useCreateOutlet() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateOutletRequest) => adminApi.createOutlet(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'outlets'] });
      queryClient.invalidateQueries({ queryKey: adminKeys.dashboard });
    },
  });
}

export function useUpdateOutlet() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ uuid, data }: { uuid: string; data: UpdateOutletRequest }) =>
      adminApi.updateOutlet(uuid, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'outlets'] });
    },
  });
}

export function useDeleteOutlet() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (uuid: string) => adminApi.deleteOutlet(uuid),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'outlets'] });
      queryClient.invalidateQueries({ queryKey: adminKeys.dashboard });
    },
  });
}

export function useOutletInventory(uuid: string) {
  return useQuery({
    queryKey: ['admin', 'outlets', uuid, 'inventory'],
    queryFn: () => adminApi.getOutletInventory(uuid),
    enabled: !!uuid,
  });
}

export function useOutletSales(uuid: string) {
  return useQuery({
    queryKey: ['admin', 'outlets', uuid, 'sales'],
    queryFn: () => adminApi.getOutletSales(uuid),
    enabled: !!uuid,
  });
}

export function useOutletStats(uuid: string) {
  return useQuery({
    queryKey: ['admin', 'outlets', uuid, 'stats'],
    queryFn: () => adminApi.getOutletStats(uuid),
    enabled: !!uuid,
  });
}

// ============================================================================
// SHIPMENT HOOKS
// ============================================================================

export function useAdminShipments(params?: { page?: number; pageSize?: number; outlet?: string; status?: string }) {
  return useQuery({
    queryKey: adminKeys.shipments(params),
    queryFn: () => adminApi.getShipments(params),
  });
}

export function useAdminShipment(uuid: string) {
  return useQuery({
    queryKey: adminKeys.shipment(uuid),
    queryFn: () => adminApi.getShipment(uuid),
    enabled: !!uuid,
  });
}

export function useCreateShipment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateShipmentRequest) => adminApi.createShipment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'shipments'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'inventory'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'pending-shipments'] });
    },
  });
}

export function useUpdateShipmentStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ uuid, status }: { uuid: string; status: string }) =>
      adminApi.updateShipmentStatus(uuid, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'shipments'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'pending-shipments'] });
    },
  });
}

// ============================================================================
// ORDER HOOKS
// ============================================================================

export function useAdminOrders(params?: { page?: number; pageSize?: number; status?: string; search?: string }) {
  return useQuery({
    queryKey: adminKeys.orders(params),
    queryFn: () => adminApi.getOrders(params),
  });
}

export function useAdminOrder(uuid: string) {
  return useQuery({
    queryKey: adminKeys.order(uuid),
    queryFn: () => adminApi.getOrder(uuid),
    enabled: !!uuid,
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ uuid, status, notes }: { uuid: string; status: string; notes?: string }) =>
      adminApi.updateOrderStatus(uuid, status, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'orders'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'recent-orders'] });
      queryClient.invalidateQueries({ queryKey: adminKeys.dashboard });
    },
  });
}

// ============================================================================
// BANNER HOOKS
// ============================================================================

export function useAdminBanners() {
  return useQuery({
    queryKey: adminKeys.banners,
    queryFn: () => adminApi.getBanners(),
  });
}

export function useCreateBanner() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ data, image }: { data: CreateBannerRequest; image: File }) =>
      adminApi.createBanner(data, image),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.banners });
    },
  });
}

export function useUpdateBanner() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ uuid, data, image }: { uuid: string; data: Partial<CreateBannerRequest>; image?: File }) =>
      adminApi.updateBanner(uuid, data, image),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.banners });
    },
  });
}

export function useDeleteBanner() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (uuid: string) => adminApi.deleteBanner(uuid),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.banners });
    },
  });
}

// ============================================================================
// COUPON HOOKS
// ============================================================================

export function useAdminCoupons(params?: { page?: number; pageSize?: number }) {
  return useQuery({
    queryKey: adminKeys.coupons(params),
    queryFn: () => adminApi.getCoupons(params),
  });
}

export function useCreateCoupon() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateCouponRequest) => adminApi.createCoupon(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'coupons'] });
    },
  });
}

export function useUpdateCoupon() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ uuid, data }: { uuid: string; data: Partial<CreateCouponRequest> }) =>
      adminApi.updateCoupon(uuid, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'coupons'] });
    },
  });
}

export function useDeleteCoupon() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (uuid: string) => adminApi.deleteCoupon(uuid),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'coupons'] });
    },
  });
}

// ============================================================================
// CUSTOMER HOOKS
// ============================================================================

export function useAdminCustomers(params?: { page?: number; pageSize?: number; search?: string }) {
  return useQuery({
    queryKey: adminKeys.customers(params),
    queryFn: () => adminApi.getCustomers(params),
  });
}

// ============================================================================
// REVIEW HOOKS
// ============================================================================

export function useAdminReviews(params?: { page?: number; pageSize?: number; approved?: boolean }) {
  return useQuery({
    queryKey: adminKeys.reviews(params),
    queryFn: () => adminApi.getReviews(params),
  });
}

export function useApproveReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (uuid: string) => adminApi.approveReview(uuid),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'reviews'] });
    },
  });
}

export function useDeleteReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (uuid: string) => adminApi.deleteReview(uuid),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'reviews'] });
    },
  });
}
