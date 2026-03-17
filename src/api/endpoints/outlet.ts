/**
 * Outlet API Endpoints
 *
 * All outlet operations API calls (authenticated with outlet token)
 * Backend base: /v1/outlet
 */

import { apiClient } from "../client/axios";
import { env } from "@/config/env";

const BASE = env.apiVersion;

// === TYPES ===

export interface OutletDashboard {
  inventory: {
    totalItems: number;
    totalQuantity: number;
    lowStock: number;
  };
  shipments: {
    pending: number;
    shipped: number;
    partiallyReceived: number;
  };
}

export interface OutletInventoryItem {
  id: number;
  uuid: string;
  sku: string;
  size: string;
  colorName: string;
  productName: string;
  quantity: number;
  lowStockThreshold: number;
  isLowStock: boolean;
}

export interface OutletShipment {
  id: number;
  uuid: string;
  status: string;
  items: {
    id: number;
    uuid: string;
    sku: string;
    size: string;
    colorName: string;
    productName: string;
    quantity: number;
    receivedQuantity: number;
  }[];
  createdAt: string;
  shippedAt: string | null;
}

export interface POSInventoryProduct {
  id: number;
  sku: string;
  name: string;
  color: string;
  size: string;
  stock: number;
  price: number;
}

export interface OutletSaleItem {
  sku: string;
  name: string;
  color: string;
  size: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface OutletSale {
  id: number;
  uuid: string;
  invoiceNumber: string;
  customerName: string;
  customerPhone: string | null;
  paymentMethod: string;
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  status: string;
  date: string;
  time: string;
  items: OutletSaleItem[];
}

export interface CreateSalePayload {
  customerName: string;
  customerPhone?: string;
  paymentMethod: "cash" | "card" | "upi";
  discount: number;
  items: {
    productVariantId: number;
    sku: string;
    name: string;
    color: string;
    size: string;
    quantity: number;
    unitPrice: number;
  }[];
}

// === API ===

export const outletApi = {
  // Auth
  login: (loginCode: string) =>
    apiClient.post<{
      outlet: { id: number; uuid: string; code: string; name: string };
      accessToken: string;
      refreshToken: string;
    }>(`${BASE}/auth/outlet-login`, { loginCode }),

  logout: () => apiClient.post(`${BASE}/auth/outlet-logout`),

  getProfile: () =>
    apiClient.get<{
      id: number;
      uuid: string;
      code: string;
      name: string;
      address?: string;
      city?: string;
      state?: string;
      phone?: string;
      email?: string;
    }>(`${BASE}/outlet/me`),

  // Dashboard
  getDashboard: () =>
    apiClient.get<OutletDashboard>(`${BASE}/outlet/dashboard`),

  // Inventory
  getInventory: (params?: {
    page?: number;
    pageSize?: number;
    search?: string;
    lowStockOnly?: boolean;
  }) =>
    apiClient.get<{
      items: OutletInventoryItem[];
      pagination: {
        total: number;
        page: number;
        pageSize: number;
        totalPages: number;
      };
    }>(`${BASE}/outlet/inventory`, { params }),

  // Shipments
  getShipments: (params?: { status?: string }) =>
    apiClient.get<OutletShipment[]>(`${BASE}/outlet/shipments`, { params }),

  receiveShipment: (uuid: string, items: { itemUuid: string; receivedQuantity: number }[]) =>
    apiClient.put(`${BASE}/shipments/${uuid}/receive`, { items }),

  // POS / Sales
  getPosInventory: () =>
    apiClient.get<POSInventoryProduct[]>(`${BASE}/outlet/pos/inventory`),

  getSales: (params?: {
    page?: number;
    pageSize?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  }) =>
    apiClient.get<{
      sales: OutletSale[];
      pagination: {
        total: number;
        page: number;
        pageSize: number;
        totalPages: number;
      };
    }>(`${BASE}/outlet/sales`, { params }),

  createSale: (data: CreateSalePayload) =>
    apiClient.post<OutletSale>(`${BASE}/outlet/sales`, data),
};
