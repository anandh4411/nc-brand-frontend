/**
 * Admin API Endpoints
 *
 * All admin-related API calls (SUPER_ADMIN role)
 * Backend base: /v1
 */

import { apiClient } from '../client/axios';
import { env } from '@/config/env';

const BASE = env.apiVersion;

// ============================================================================
// DASHBOARD
// ============================================================================

export interface DashboardStats {
  totalOutlets: number;
  activeOutlets: number;
  totalProducts: number;
  totalProductGroups: number;
  lowStockItems: number;
  totalOrders: number;
  pendingOrders: number;
  monthlyRevenue: number;
  totalCustomers: number;
}

export interface LowStockItem {
  uuid: string;
  sku: string;
  productName: string;
  colorName: string;
  size: string;
  quantity: number;
  lowStockThreshold: number;
}

export interface RecentOrder {
  uuid: string;
  orderNumber: string;
  customerName: string;
  total: number;
  status: string;
  paymentStatus: string;
  createdAt: string;
}

export interface PendingShipment {
  uuid: string;
  outletName: string;
  outletCode: string;
  itemCount: number;
  status: string;
  createdAt: string;
}

export interface AnalyticsData {
  stats: {
    totalRevenue: number;
    revenueGrowth: number;
    totalOrders: number;
    ordersGrowth: number;
    totalCustomers: number;
    customersGrowth: number;
    avgOrderValue: number;
    avgOrderGrowth: number;
  };
  revenueData: { month: string; revenue: number; orders: number }[];
  categoryData: { name: string; value: number; fill: string }[];
  outletPerformance: { outlet: string; sales: number }[];
  dailySales: { day: string; online: number; offline: number }[];
}

// ============================================================================
// CATEGORIES
// ============================================================================

export interface Category {
  uuid: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  parentId?: number;
  parent?: Category;
  children?: Category[];
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
}

export interface CreateCategoryRequest {
  name: string;
  slug?: string;
  description?: string;
  parentUuid?: string;
  isActive?: boolean;
  sortOrder?: number;
}

export interface UpdateCategoryRequest {
  name?: string;
  slug?: string;
  description?: string;
  parentUuid?: string;
  isActive?: boolean;
  sortOrder?: number;
}

// ============================================================================
// PRODUCT GROUPS
// ============================================================================

export interface ProductGroup {
  uuid: string;
  name: string;
  slug: string;
  description?: string;
  basePrice: number;
  categoryId: number;
  categoryUuid: string;
  categoryName: string;
  fabricType?: string;
  pattern?: string;
  careInstructions?: string;
  isFeatured: boolean;
  isActive: boolean;
  products: Product[];
  createdAt: string;
}

export interface Product {
  uuid: string;
  colorName: string;
  colorCode: string;
  isActive: boolean;
  variants: ProductVariant[];
  images: ProductImage[];
}

export interface ProductVariant {
  uuid: string;
  sku: string;
  size: string;
  priceAdjustment: number;
  isActive: boolean;
  inventory?: {
    quantity: number;
    lowStockThreshold: number;
  };
}

export interface ProductImage {
  uuid: string;
  imageUrl: string;
  isPrimary: boolean;
  sortOrder: number;
}

export interface CreateProductGroupRequest {
  name: string;
  slug?: string;
  description?: string;
  basePrice: number;
  categoryUuid: string;
  fabricType?: string;
  pattern?: string;
  careInstructions?: string;
  isFeatured?: boolean;
}

export interface CreateProductRequest {
  colorName: string;
  colorCode: string;
}

export interface CreateVariantRequest {
  sku: string;
  size: string;
  priceAdjustment?: number;
}

// ============================================================================
// INVENTORY
// ============================================================================

export interface InventoryItem {
  uuid: string;
  productVariantId: number;
  quantity: number;
  lowStockThreshold: number;
  batchNumber?: string;
  productVariant: {
    uuid: string;
    sku: string;
    size: string;
    product: {
      colorName: string;
      productGroup: {
        name: string;
      };
    };
  };
}

export interface StockAdjustment {
  uuid: string;
  adjustmentQty: number;
  reason: string;
  adjustedBy: string;
  createdAt: string;
}

export interface AdjustStockRequest {
  adjustmentQty: number;
  reason: string;
}

// ============================================================================
// OUTLETS
// ============================================================================

export interface Outlet {
  uuid: string;
  code: string;
  loginCode: string;
  name: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  email?: string;
  isActive: boolean;
  createdAt: string;
}

export interface CreateOutletRequest {
  code: string;
  loginCode: string;
  name: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  email?: string;
}

export interface UpdateOutletRequest {
  code?: string;
  loginCode?: string;
  name?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  phone?: string;
  email?: string;
  isActive?: boolean;
}

// ============================================================================
// SHIPMENTS
// ============================================================================

export interface Shipment {
  uuid: string;
  outlet: {
    uuid: string;
    code: string;
    name: string;
  };
  status: 'PENDING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  items: ShipmentItem[];
  createdBy?: string;
  shippedAt?: string;
  deliveredAt?: string;
  createdAt: string;
}

export interface ShipmentItem {
  uuid: string;
  productVariant: {
    uuid: string;
    sku: string;
    size: string;
    product: {
      colorName: string;
      productGroup: {
        name: string;
      };
    };
  };
  quantity: number;
  receivedQuantity: number;
}

export interface CreateShipmentRequest {
  outletUuid: string;
  items: {
    variantUuid: string;
    quantity: number;
  }[];
}

// ============================================================================
// ORDERS
// ============================================================================

export interface AdminOrder {
  uuid: string;
  orderNumber: string;
  customer: {
    uuid: string;
    name: string;
    email: string;
  };
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  items: OrderItem[];
  shippingAddress: any;
  billingAddress: any;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  createdAt: string;
}

export interface OrderItem {
  uuid: string;
  productSnapshot: any;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

// ============================================================================
// BANNERS
// ============================================================================

export interface Banner {
  uuid: string;
  title: string;
  subtitle?: string;
  imageUrl: string;
  link?: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
}

export interface CreateBannerRequest {
  title: string;
  subtitle?: string;
  link?: string;
  isActive?: boolean;
  sortOrder?: number;
}

// ============================================================================
// COUPONS
// ============================================================================

export interface Coupon {
  uuid: string;
  code: string;
  type: 'PERCENTAGE' | 'FIXED';
  value: number;
  minOrderValue?: number;
  maxDiscount?: number;
  usageLimit?: number;
  usedCount: number;
  validFrom: string;
  validUntil: string;
  isActive: boolean;
  createdAt: string;
}

export interface CreateCouponRequest {
  code: string;
  type: 'PERCENTAGE' | 'FIXED';
  value: number;
  minOrderValue?: number;
  maxDiscount?: number;
  usageLimit?: number;
  validFrom: string;
  validUntil: string;
}

// ============================================================================
// CUSTOMERS
// ============================================================================

export interface Customer {
  uuid: string;
  name: string;
  email: string;
  phone?: string;
  isActive: boolean;
  createdAt: string;
  _count?: {
    orders: number;
    addresses: number;
    reviews: number;
  };
}

// ============================================================================
// REVIEWS
// ============================================================================

export interface AdminReview {
  uuid: string;
  rating: number;
  title?: string;
  comment?: string;
  isVerifiedPurchase: boolean;
  isApproved: boolean;
  customer: {
    name: string;
    email: string;
  };
  productGroup: {
    name: string;
  };
  createdAt: string;
}

// ============================================================================
// API FUNCTIONS
// ============================================================================

export const adminApi = {
  // Dashboard
  getDashboardStats: () =>
    apiClient.get<DashboardStats>(`${BASE}/admin/dashboard`),

  getLowStockItems: (limit = 10) =>
    apiClient.get<LowStockItem[]>(`${BASE}/admin/dashboard/low-stock`, { params: { limit } }),

  getRecentOrders: (limit = 10) =>
    apiClient.get<RecentOrder[]>(`${BASE}/admin/dashboard/recent-orders`, { params: { limit } }),

  getPendingShipments: (limit = 10) =>
    apiClient.get<PendingShipment[]>(`${BASE}/admin/dashboard/pending-shipments`, { params: { limit } }),

  getAnalytics: () =>
    apiClient.get<AnalyticsData>(`${BASE}/admin/analytics`),

  // Categories
  getCategories: () =>
    apiClient.get<Category[]>(`${BASE}/categories`),

  getCategory: (uuid: string) =>
    apiClient.get<Category>(`${BASE}/categories/${uuid}`),

  createCategory: (data: CreateCategoryRequest, image?: File) => {
    if (image) {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined) formData.append(key, String(value));
      });
      formData.append('image', image);
      return apiClient.post<Category>(`${BASE}/categories`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    }
    return apiClient.post<Category>(`${BASE}/categories`, data);
  },

  updateCategory: (uuid: string, data: UpdateCategoryRequest, image?: File) => {
    if (image) {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined) formData.append(key, String(value));
      });
      formData.append('image', image);
      return apiClient.put<Category>(`${BASE}/categories/${uuid}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    }
    return apiClient.put<Category>(`${BASE}/categories/${uuid}`, data);
  },

  deleteCategory: (uuid: string) =>
    apiClient.delete(`${BASE}/categories/${uuid}`),

  // Product Groups
  getProductGroups: (params?: { page?: number; pageSize?: number; search?: string; category?: string }) =>
    apiClient.get<{ productGroups: ProductGroup[]; meta: any }>(`${BASE}/product-groups`, { params }),

  getProductGroup: (uuid: string) =>
    apiClient.get<ProductGroup>(`${BASE}/product-groups/${uuid}`),

  createProductGroup: (data: CreateProductGroupRequest) =>
    apiClient.post<ProductGroup>(`${BASE}/product-groups`, data),

  updateProductGroup: (uuid: string, data: Partial<CreateProductGroupRequest>) =>
    apiClient.put<ProductGroup>(`${BASE}/product-groups/${uuid}`, data),

  deleteProductGroup: (uuid: string) =>
    apiClient.delete(`${BASE}/product-groups/${uuid}`),

  // Products (Color variants)
  createProduct: (groupUuid: string, data: CreateProductRequest) =>
    apiClient.post<Product>(`${BASE}/product-groups/${groupUuid}/products`, data),

  updateProduct: (uuid: string, data: Partial<CreateProductRequest>) =>
    apiClient.put<Product>(`${BASE}/products/${uuid}`, data),

  deleteProduct: (uuid: string) =>
    apiClient.delete(`${BASE}/products/${uuid}`),

  // Product Variants (Size)
  createVariant: (productUuid: string, data: CreateVariantRequest) =>
    apiClient.post<ProductVariant>(`${BASE}/products/${productUuid}/variants`, data),

  updateVariant: (uuid: string, data: Partial<CreateVariantRequest>) =>
    apiClient.put<ProductVariant>(`${BASE}/variants/${uuid}`, data),

  deleteVariant: (uuid: string) =>
    apiClient.delete(`${BASE}/variants/${uuid}`),

  // Product Images
  uploadImage: (productUuid: string, file: File, isPrimary = false) => {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('isPrimary', String(isPrimary));
    return apiClient.post<ProductImage>(`${BASE}/products/${productUuid}/images`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  deleteImage: (uuid: string) =>
    apiClient.delete(`${BASE}/images/${uuid}`),

  // Inventory
  getInventory: (params?: { page?: number; pageSize?: number; lowStock?: boolean }) =>
    apiClient.get<{ items: InventoryItem[]; meta: any }>(`${BASE}/inventory`, { params }),

  adjustStock: (variantUuid: string, data: AdjustStockRequest) =>
    apiClient.post<InventoryItem>(`${BASE}/inventory/${variantUuid}/adjust`, data),

  updateThreshold: (variantUuid: string, threshold: number) =>
    apiClient.put<InventoryItem>(`${BASE}/inventory/${variantUuid}`, { lowStockThreshold: threshold }),

  // Outlets
  getOutlets: (params?: { page?: number; pageSize?: number; search?: string }) =>
    apiClient.get<{ outlets: Outlet[]; meta: any }>(`${BASE}/outlets`, { params }),

  getOutlet: (uuid: string) =>
    apiClient.get<Outlet>(`${BASE}/outlets/${uuid}`),

  createOutlet: (data: CreateOutletRequest) =>
    apiClient.post<Outlet>(`${BASE}/outlets`, data),

  updateOutlet: (uuid: string, data: UpdateOutletRequest) =>
    apiClient.put<Outlet>(`${BASE}/outlets/${uuid}`, data),

  deleteOutlet: (uuid: string) =>
    apiClient.delete(`${BASE}/outlets/${uuid}`),

  getOutletInventory: (uuid: string) =>
    apiClient.get<any>(`${BASE}/outlets/${uuid}/inventory`),

  getOutletSales: (uuid: string) =>
    apiClient.get<any>(`${BASE}/outlets/${uuid}/sales`),

  getOutletStats: (uuid: string) =>
    apiClient.get<{
      stats: {
        totalStock: number;
        stockChange: number;
        lowStockItems: number;
        pendingShipments: number;
        todaySales: number;
        salesChange: number;
        monthlyRevenue: number;
      };
      salesData: { month: string; sales: number }[];
      categoryData: { category: string; value: number }[];
    }>(`${BASE}/outlets/${uuid}/stats`),

  // Shipments
  getShipments: (params?: { page?: number; pageSize?: number; outlet?: string; status?: string }) =>
    apiClient.get<{ shipments: Shipment[]; meta: any }>(`${BASE}/shipments`, { params }),

  getShipment: (uuid: string) =>
    apiClient.get<Shipment>(`${BASE}/shipments/${uuid}`),

  createShipment: (data: CreateShipmentRequest) =>
    apiClient.post<Shipment>(`${BASE}/shipments`, data),

  updateShipmentStatus: (uuid: string, status: string) =>
    apiClient.put<Shipment>(`${BASE}/shipments/${uuid}/status`, { status }),

  // Orders
  getOrders: (params?: { page?: number; pageSize?: number; status?: string; search?: string }) =>
    apiClient.get<{ orders: AdminOrder[]; meta: any }>(`${BASE}/admin/orders`, { params }),

  getOrder: (uuid: string) =>
    apiClient.get<AdminOrder>(`${BASE}/admin/orders/${uuid}`),

  updateOrderStatus: (uuid: string, status: string, notes?: string) =>
    apiClient.put<AdminOrder>(`${BASE}/admin/orders/${uuid}/status`, { status, notes }),

  // Banners
  getBanners: () =>
    apiClient.get<Banner[]>(`${BASE}/banners`),

  createBanner: (data: CreateBannerRequest, image: File) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) formData.append(key, String(value));
    });
    formData.append('image', image);
    return apiClient.post<Banner>(`${BASE}/banners`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  updateBanner: (uuid: string, data: Partial<CreateBannerRequest>, image?: File) => {
    if (image) {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined) formData.append(key, String(value));
      });
      formData.append('image', image);
      return apiClient.put<Banner>(`${BASE}/banners/${uuid}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    }
    return apiClient.put<Banner>(`${BASE}/banners/${uuid}`, data);
  },

  deleteBanner: (uuid: string) =>
    apiClient.delete(`${BASE}/banners/${uuid}`),

  // Coupons
  getCoupons: (params?: { page?: number; pageSize?: number }) =>
    apiClient.get<{ coupons: Coupon[]; meta: any }>(`${BASE}/coupons`, { params }),

  createCoupon: (data: CreateCouponRequest) =>
    apiClient.post<Coupon>(`${BASE}/coupons`, data),

  updateCoupon: (uuid: string, data: Partial<CreateCouponRequest>) =>
    apiClient.put<Coupon>(`${BASE}/coupons/${uuid}`, data),

  deleteCoupon: (uuid: string) =>
    apiClient.delete(`${BASE}/coupons/${uuid}`),

  // Customers
  getCustomers: (params?: { page?: number; pageSize?: number; search?: string }) =>
    apiClient.get<{ customers: Customer[]; meta: any }>(`${BASE}/admin/customers`, { params }),

  // Reviews
  getReviews: (params?: { page?: number; pageSize?: number; approved?: boolean }) =>
    apiClient.get<{ reviews: AdminReview[]; meta: any }>(`${BASE}/admin/reviews`, { params }),

  approveReview: (uuid: string) =>
    apiClient.put<AdminReview>(`${BASE}/admin/reviews/${uuid}/approve`),

  deleteReview: (uuid: string) =>
    apiClient.delete(`${BASE}/admin/reviews/${uuid}`),
};
