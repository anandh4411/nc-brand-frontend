/**
 * Shop Browsing Hooks (Public)
 */

import { useQuery } from "@tanstack/react-query";
import { shopApi } from "@/api/endpoints/shop";
import { queryKeys } from "@/api/query-keys";
import type { GetProductsParams } from "@/types/dto/product-catalog.dto";

export const useShopProducts = (params?: GetProductsParams) => {
  return useQuery({
    queryKey: queryKeys.shop.products(params),
    queryFn: () => shopApi.getProducts(params),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useShopProduct = (slug: string) => {
  return useQuery({
    queryKey: queryKeys.shop.product(slug),
    queryFn: () => shopApi.getProductBySlug(slug),
    enabled: !!slug,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useShopCategories = () => {
  return useQuery({
    queryKey: queryKeys.shop.categories(),
    queryFn: () => shopApi.getCategories(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useShopFeatured = () => {
  return useQuery({
    queryKey: queryKeys.shop.featured(),
    queryFn: () => shopApi.getFeatured(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useShopBanners = () => {
  return useQuery({
    queryKey: queryKeys.banners.active(),
    queryFn: () => shopApi.getBanners(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useShopOffers = () => {
  return useQuery({
    queryKey: queryKeys.shop.offers(),
    queryFn: () => shopApi.getActiveOffers(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
