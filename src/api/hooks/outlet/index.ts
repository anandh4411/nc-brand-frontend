/**
 * Outlet React Query Hooks
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { outletApi, CreateSalePayload } from "../../endpoints/outlet";

// === QUERY KEYS ===
export const outletKeys = {
  all: ["outlet"] as const,
  dashboard: () => [...outletKeys.all, "dashboard"] as const,
  inventory: (params?: any) => [...outletKeys.all, "inventory", params] as const,
  shipments: (params?: any) => [...outletKeys.all, "shipments", params] as const,
  profile: () => [...outletKeys.all, "profile"] as const,
  posInventory: () => [...outletKeys.all, "pos-inventory"] as const,
  sales: (params?: any) => [...outletKeys.all, "sales", params] as const,
};

// === HOOKS ===

export function useOutletDashboard() {
  return useQuery({
    queryKey: outletKeys.dashboard(),
    queryFn: () => outletApi.getDashboard(),
  });
}

export function useOutletInventory(params?: {
  page?: number;
  pageSize?: number;
  search?: string;
  lowStockOnly?: boolean;
}) {
  return useQuery({
    queryKey: outletKeys.inventory(params),
    queryFn: () => outletApi.getInventory(params),
  });
}

export function useOutletShipments(params?: { status?: string }) {
  return useQuery({
    queryKey: outletKeys.shipments(params),
    queryFn: () => outletApi.getShipments(params),
  });
}

export function useOutletProfile() {
  return useQuery({
    queryKey: outletKeys.profile(),
    queryFn: () => outletApi.getProfile(),
  });
}

export function usePosInventory() {
  return useQuery({
    queryKey: outletKeys.posInventory(),
    queryFn: () => outletApi.getPosInventory(),
  });
}

export function useOutletSales(params?: {
  page?: number;
  pageSize?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}) {
  return useQuery({
    queryKey: outletKeys.sales(params),
    queryFn: () => outletApi.getSales(params),
  });
}

export function useReceiveShipment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ uuid, items }: { uuid: string; items: { itemUuid: string; receivedQuantity: number }[] }) =>
      outletApi.receiveShipment(uuid, items),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: outletKeys.shipments() });
      queryClient.invalidateQueries({ queryKey: outletKeys.inventory() });
      queryClient.invalidateQueries({ queryKey: outletKeys.dashboard() });
      queryClient.invalidateQueries({ queryKey: outletKeys.posInventory() });
    },
  });
}

export function useCreateSale() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateSalePayload) => outletApi.createSale(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: outletKeys.sales() });
      queryClient.invalidateQueries({ queryKey: outletKeys.posInventory() });
      queryClient.invalidateQueries({ queryKey: outletKeys.dashboard() });
    },
  });
}
