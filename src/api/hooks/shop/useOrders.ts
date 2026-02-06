/**
 * Order & Checkout Hooks
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/context/auth-context";
import { shopApi } from "@/api/endpoints/shop";
import { queryKeys } from "@/api/query-keys";
import { showSuccess } from "@/lib/error-handler";
import type { CheckoutRequest, VerifyPaymentRequest } from "@/types/dto/order.dto";

export const useCustomerOrders = () => {
  const { isAuthenticated, isCustomer } = useAuth();

  return useQuery({
    queryKey: queryKeys.orders.myOrders(),
    queryFn: () => shopApi.getOrders(),
    enabled: isAuthenticated && isCustomer,
  });
};

export const useCustomerOrder = (uuid: string) => {
  const { isAuthenticated, isCustomer } = useAuth();

  return useQuery({
    queryKey: queryKeys.orders.detail(uuid),
    queryFn: () => shopApi.getOrder(uuid),
    enabled: isAuthenticated && isCustomer && !!uuid,
  });
};

export const useCheckout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CheckoutRequest) => shopApi.checkout(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cart.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.all });
      showSuccess("Order placed successfully!");
    },
  });
};

export const useCreateRazorpayOrder = () => {
  return useMutation({
    mutationFn: (orderUuid: string) => shopApi.createRazorpayOrder(orderUuid),
  });
};

export const useVerifyPayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: VerifyPaymentRequest) => shopApi.verifyPayment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.all });
      showSuccess("Payment verified successfully!");
    },
  });
};

export const useCancelOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (uuid: string) => shopApi.cancelOrder(uuid),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.all });
      showSuccess("Order cancelled");
    },
  });
};
