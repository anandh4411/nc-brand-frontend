/**
 * Query Key Factory
 *
 * Centralized query key management for React Query.
 * Provides type-safe, consistent cache keys across the application.
 *
 * Usage:
 * - Use in useQuery: queryKey: queryKeys.users.detail(uuid)
 * - Use for invalidation: queryClient.invalidateQueries({ queryKey: queryKeys.users.lists() })
 */

// Import types from DTOs to avoid duplication
import type { GetProductsParams } from '@/types/dto/product.dto';
import type { GetMainCategoriesParams } from '@/types/dto/main-category.dto';
import type { GetSubCategoriesParams } from '@/types/dto/sub-category.dto';

// TextileHub specific imports
import type { GetOutletsParams } from '@/types/dto/outlet.dto';
import type { GetProductsParams as GetProductCatalogParams } from '@/types/dto/product-catalog.dto';
import type { GetInventoryParams, GetShipmentsParams } from '@/types/dto/inventory.dto';
import type { GetOrdersParams } from '@/types/dto/order.dto';
import type { GetReviewsParams } from '@/types/dto/review.dto';

// Base types for common query params
export interface PaginationParams {
  page?: number;
  pageSize?: number;
}

export interface SearchParams {
  search?: string;
}

export interface SortParams {
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export type GetUsersParams = PaginationParams & SearchParams & SortParams;
export type GetFormsParams = PaginationParams & SearchParams & SortParams;
export type GetFormFieldsParams = PaginationParams & SearchParams & SortParams & { formId?: number };
export type GetSubmissionsParams = PaginationParams & SearchParams & SortParams;
export type GetTemplatesParams = PaginationParams & SearchParams & SortParams;
export type GetPhasesParams = PaginationParams & SearchParams & SortParams;

/**
 * Query Keys Factory
 *
 * Hierarchical structure:
 * - all: Base key for the resource
 * - lists(): Key for all list queries
 * - list(params): Key for specific list query with params
 * - details(): Key for all detail queries
 * - detail(id): Key for specific detail query
 */
export const queryKeys = {
  // Auth queries
  auth: {
    all: ['auth'] as const,
    me: () => [...queryKeys.auth.all, 'me'] as const,
    session: () => [...queryKeys.auth.all, 'session'] as const,
  },

  // Users queries
  users: {
    all: ['users'] as const,
    lists: () => [...queryKeys.users.all, 'list'] as const,
    list: (params?: GetUsersParams) => [...queryKeys.users.lists(), params] as const,
    details: () => [...queryKeys.users.all, 'detail'] as const,
    detail: (uuid: string) => [...queryKeys.users.details(), uuid] as const,
  },

  // Institutions queries
  institutions: {
    all: ['institutions'] as const,
    lists: () => [...queryKeys.institutions.all, 'list'] as const,
    list: (params?: PaginationParams & SearchParams & SortParams) => [...queryKeys.institutions.lists(), params] as const,
    details: () => [...queryKeys.institutions.all, 'detail'] as const,
    detail: (uuid: string) => [...queryKeys.institutions.details(), uuid] as const,
    dashboard: () => [...queryKeys.institutions.all, 'dashboard'] as const,
  },

  // Forms queries
  forms: {
    all: ['forms'] as const,
    lists: () => [...queryKeys.forms.all, 'list'] as const,
    list: (params?: GetFormsParams) => [...queryKeys.forms.lists(), params] as const,
    details: () => [...queryKeys.forms.all, 'detail'] as const,
    detail: (uuid: string) => [...queryKeys.forms.details(), uuid] as const,
  },

  // Form Fields queries
  formFields: {
    all: ['formFields'] as const,
    lists: () => [...queryKeys.formFields.all, 'list'] as const,
    list: (params?: GetFormFieldsParams) => [...queryKeys.formFields.lists(), params] as const,
    details: () => [...queryKeys.formFields.all, 'detail'] as const,
    detail: (uuid: string) => [...queryKeys.formFields.details(), uuid] as const,
  },

  // Submissions queries
  submissions: {
    all: ['submissions'] as const,
    lists: () => [...queryKeys.submissions.all, 'list'] as const,
    list: (params?: GetSubmissionsParams) => [...queryKeys.submissions.lists(), params] as const,
    details: () => [...queryKeys.submissions.all, 'detail'] as const,
    detail: (uuid: string) => [...queryKeys.submissions.details(), uuid] as const,
  },

  // Templates queries
  templates: {
    all: ['templates'] as const,
    lists: () => [...queryKeys.templates.all, 'list'] as const,
    list: (params?: GetTemplatesParams) => [...queryKeys.templates.lists(), params] as const,
    details: () => [...queryKeys.templates.all, 'detail'] as const,
    detail: (uuid: string) => [...queryKeys.templates.details(), uuid] as const,
  },

  // Phases queries
  phases: {
    all: ['phases'] as const,
    lists: () => [...queryKeys.phases.all, 'list'] as const,
    list: (params?: GetPhasesParams) => [...queryKeys.phases.lists(), params] as const,
    details: () => [...queryKeys.phases.all, 'detail'] as const,
    detail: (uuid: string) => [...queryKeys.phases.details(), uuid] as const,
  },

  // Products queries
  products: {
    all: ['products'] as const,
    lists: () => [...queryKeys.products.all, 'list'] as const,
    list: (params?: GetProductsParams) => [...queryKeys.products.lists(), params] as const,
    details: () => [...queryKeys.products.all, 'detail'] as const,
    detail: (uuid: string) => [...queryKeys.products.details(), uuid] as const,
    landing: () => [...queryKeys.products.all, 'landing'] as const,
  },

  // Main Categories queries
  mainCategories: {
    all: ['mainCategories'] as const,
    lists: () => [...queryKeys.mainCategories.all, 'list'] as const,
    list: (params?: GetMainCategoriesParams) => [...queryKeys.mainCategories.lists(), params] as const,
    details: () => [...queryKeys.mainCategories.all, 'detail'] as const,
    detail: (uuid: string) => [...queryKeys.mainCategories.details(), uuid] as const,
  },

  // Sub Categories queries
  subCategories: {
    all: ['subCategories'] as const,
    lists: () => [...queryKeys.subCategories.all, 'list'] as const,
    list: (params?: GetSubCategoriesParams) => [...queryKeys.subCategories.lists(), params] as const,
    details: () => [...queryKeys.subCategories.all, 'detail'] as const,
    detail: (uuid: string) => [...queryKeys.subCategories.details(), uuid] as const,
  },

  // ============================================================================
  // TEXTILEHUB SPECIFIC QUERY KEYS
  // ============================================================================

  // Outlets queries
  outlets: {
    all: ['outlets'] as const,
    lists: () => [...queryKeys.outlets.all, 'list'] as const,
    list: (params?: GetOutletsParams) => [...queryKeys.outlets.lists(), params] as const,
    details: () => [...queryKeys.outlets.all, 'detail'] as const,
    detail: (uuid: string) => [...queryKeys.outlets.details(), uuid] as const,
    stats: (uuid: string) => [...queryKeys.outlets.details(), uuid, 'stats'] as const,
  },

  // Product Catalog (ProductGroup with color/size variants)
  productCatalog: {
    all: ['productCatalog'] as const,
    lists: () => [...queryKeys.productCatalog.all, 'list'] as const,
    list: (params?: GetProductCatalogParams) => [...queryKeys.productCatalog.lists(), params] as const,
    details: () => [...queryKeys.productCatalog.all, 'detail'] as const,
    detail: (uuid: string) => [...queryKeys.productCatalog.details(), uuid] as const,
    bySlug: (slug: string) => [...queryKeys.productCatalog.all, 'slug', slug] as const,
    featured: () => [...queryKeys.productCatalog.all, 'featured'] as const,
  },

  // Categories (for product catalog)
  categories: {
    all: ['categories'] as const,
    lists: () => [...queryKeys.categories.all, 'list'] as const,
    list: (params?: PaginationParams & SearchParams) => [...queryKeys.categories.lists(), params] as const,
    details: () => [...queryKeys.categories.all, 'detail'] as const,
    detail: (uuid: string) => [...queryKeys.categories.details(), uuid] as const,
    bySlug: (slug: string) => [...queryKeys.categories.all, 'slug', slug] as const,
    tree: () => [...queryKeys.categories.all, 'tree'] as const,
  },

  // Inventory (Manufacturing)
  inventory: {
    all: ['inventory'] as const,
    lists: () => [...queryKeys.inventory.all, 'list'] as const,
    list: (params?: GetInventoryParams) => [...queryKeys.inventory.lists(), params] as const,
    lowStock: () => [...queryKeys.inventory.all, 'lowStock'] as const,
    byVariant: (variantId: number) => [...queryKeys.inventory.all, 'variant', variantId] as const,
  },

  // Outlet Inventory
  outletInventory: {
    all: ['outletInventory'] as const,
    lists: () => [...queryKeys.outletInventory.all, 'list'] as const,
    list: (outletId?: number, params?: GetInventoryParams) => [...queryKeys.outletInventory.lists(), outletId, params] as const,
    lowStock: (outletId?: number) => [...queryKeys.outletInventory.all, 'lowStock', outletId] as const,
  },

  // Shipments
  shipments: {
    all: ['shipments'] as const,
    lists: () => [...queryKeys.shipments.all, 'list'] as const,
    list: (params?: GetShipmentsParams) => [...queryKeys.shipments.lists(), params] as const,
    details: () => [...queryKeys.shipments.all, 'detail'] as const,
    detail: (uuid: string) => [...queryKeys.shipments.details(), uuid] as const,
    byOutlet: (outletId: number) => [...queryKeys.shipments.all, 'outlet', outletId] as const,
    pending: () => [...queryKeys.shipments.all, 'pending'] as const,
  },

  // Orders
  orders: {
    all: ['orders'] as const,
    lists: () => [...queryKeys.orders.all, 'list'] as const,
    list: (params?: GetOrdersParams) => [...queryKeys.orders.lists(), params] as const,
    details: () => [...queryKeys.orders.all, 'detail'] as const,
    detail: (uuid: string) => [...queryKeys.orders.details(), uuid] as const,
    byCustomer: (customerId: number) => [...queryKeys.orders.all, 'customer', customerId] as const,
    myOrders: () => [...queryKeys.orders.all, 'myOrders'] as const,
    invoice: (uuid: string) => [...queryKeys.orders.details(), uuid, 'invoice'] as const,
  },

  // Cart
  cart: {
    all: ['cart'] as const,
    current: () => [...queryKeys.cart.all, 'current'] as const,
    summary: () => [...queryKeys.cart.all, 'summary'] as const,
  },

  // Addresses
  addresses: {
    all: ['addresses'] as const,
    lists: () => [...queryKeys.addresses.all, 'list'] as const,
    list: () => [...queryKeys.addresses.lists()] as const,
    details: () => [...queryKeys.addresses.all, 'detail'] as const,
    detail: (uuid: string) => [...queryKeys.addresses.details(), uuid] as const,
    default: () => [...queryKeys.addresses.all, 'default'] as const,
  },

  // Reviews
  reviews: {
    all: ['reviews'] as const,
    lists: () => [...queryKeys.reviews.all, 'list'] as const,
    list: (params?: GetReviewsParams) => [...queryKeys.reviews.lists(), params] as const,
    details: () => [...queryKeys.reviews.all, 'detail'] as const,
    detail: (uuid: string) => [...queryKeys.reviews.details(), uuid] as const,
    byProduct: (productGroupId: number) => [...queryKeys.reviews.all, 'product', productGroupId] as const,
    summary: (productGroupId: number) => [...queryKeys.reviews.all, 'summary', productGroupId] as const,
    myReviews: () => [...queryKeys.reviews.all, 'myReviews'] as const,
  },

  // Dashboard stats
  dashboard: {
    all: ['dashboard'] as const,
    admin: () => [...queryKeys.dashboard.all, 'admin'] as const,
    outlet: (outletId?: number) => [...queryKeys.dashboard.all, 'outlet', outletId] as const,
  },
} as const;
