/**
 * Cart Hooks
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/context/auth-context";
import { shopApi } from "@/api/endpoints/shop";
import { queryKeys } from "@/api/query-keys";
import { showSuccess } from "@/lib/error-handler";
import type { AddToCartRequest, UpdateCartItemRequest } from "@/types/dto/cart.dto";

export const useCart = () => {
  const { isAuthenticated, isCustomer } = useAuth();

  return useQuery({
    queryKey: queryKeys.cart.current(),
    queryFn: () => shopApi.getCart(),
    enabled: isAuthenticated && isCustomer,
    staleTime: 30 * 1000, // 30 seconds
  });
};

export const useAddToCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AddToCartRequest) => shopApi.addToCart(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cart.all });
      showSuccess("Added to cart");
    },
  });
};

export const useUpdateCartItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ variantUuid, data }: { variantUuid: string; data: UpdateCartItemRequest }) =>
      shopApi.updateCartItem(variantUuid, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cart.all });
    },
  });
};

export const useRemoveFromCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variantUuid: string) => shopApi.removeFromCart(variantUuid),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cart.all });
      showSuccess("Removed from cart");
    },
  });
};

export const useApplyCoupon = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (code: string) => shopApi.applyCoupon(code),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cart.all });
      showSuccess("Coupon applied!");
    },
  });
};

export const useRemoveCoupon = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => shopApi.removeCoupon(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cart.all });
      showSuccess("Coupon removed");
    },
  });
};
