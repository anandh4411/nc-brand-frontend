/**
 * Shop Customer Auth Hooks
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/context/auth-context";
import { shopApi } from "@/api/endpoints/shop";
import { queryKeys } from "@/api/query-keys";
import { showSuccess } from "@/lib/error-handler";
import type { CustomerLoginRequest, CustomerRegisterRequest } from "@/types/dto/shop-auth.dto";

export const useCustomerLogin = () => {
  const { login } = useAuth();

  return useMutation({
    mutationFn: (data: CustomerLoginRequest) => shopApi.login(data),
    onSuccess: (response) => {
      if (response.success && response.data) {
        const { accessToken, refreshToken, customer } = response.data;
        login(
          { accessToken, refreshToken },
          { ...customer, role: 'customer' } as any
        );
        showSuccess("Welcome back!", "Login successful");
      }
    },
  });
};

export const useCustomerRegister = () => {
  const { login } = useAuth();

  return useMutation({
    mutationFn: (data: CustomerRegisterRequest) => shopApi.register(data),
    onSuccess: (response) => {
      if (response.success && response.data) {
        const { accessToken, refreshToken, customer } = response.data;
        login(
          { accessToken, refreshToken },
          { ...customer, role: 'customer' } as any
        );
        showSuccess("Welcome!", "Account created successfully");
      }
    },
  });
};

export const useCustomerLogout = () => {
  const { logout } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => shopApi.logout(),
    onSuccess: () => {
      queryClient.clear();
      logout();
    },
    onError: () => {
      // Still logout on error
      queryClient.clear();
      logout();
    },
  });
};

export const useCustomerProfile = () => {
  const { isAuthenticated, isCustomer } = useAuth();

  return useQuery({
    queryKey: queryKeys.auth.me(),
    queryFn: () => shopApi.getMe(),
    enabled: isAuthenticated && isCustomer,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { name?: string; phone?: string }) => shopApi.updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.me() });
      showSuccess("Profile updated", "Your profile has been updated successfully");
    },
  });
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: (data: { currentPassword: string; newPassword: string }) =>
      shopApi.changePassword(data),
    onSuccess: () => {
      showSuccess("Password changed", "Your password has been updated successfully");
    },
  });
};
