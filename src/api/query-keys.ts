/**
 * Query Key Factory - NC Brand Textiles
 *
 * Centralized query key management for React Query.
 * Provides type-safe, consistent cache keys across the application.
 */

import type { GetOutletsParams } from '@/types/dto/outlet.dto';
import type { GetProductsParams } from '@/types/dto/product-catalog.dto';
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
    list: (params?: GetProductsParams) => [...queryKeys.productCatalog.lists(), params] as const,
    details: () => [...queryKeys.productCatalog.all, 'detail'] as const,
    detail: (uuid: string) => [...queryKeys.productCatalog.details(), uuid] as const,
    bySlug: (slug: string) => [...queryKeys.productCatalog.all, 'slug', slug] as const,
    featured: () => [...queryKeys.productCatalog.all, 'featured'] as const,
  },

  // Categories
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

  // Wishlist
  wishlist: {
    all: ['wishlist'] as const,
    list: () => [...queryKeys.wishlist.all, 'list'] as const,
  },

  // Banners
  banners: {
    all: ['banners'] as const,
    active: () => [...queryKeys.banners.all, 'active'] as const,
  },

  // Shop (public browsing)
  shop: {
    all: ['shop'] as const,
    products: (params?: any) => [...queryKeys.shop.all, 'products', params] as const,
    product: (slug: string) => [...queryKeys.shop.all, 'product', slug] as const,
    featured: () => [...queryKeys.shop.all, 'featured'] as const,
    categories: () => [...queryKeys.shop.all, 'categories'] as const,
    offers: () => [...queryKeys.shop.all, 'offers'] as const,
  },
} as const;
