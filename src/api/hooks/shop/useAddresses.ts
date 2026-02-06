/**
 * Address Hooks
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/context/auth-context";
import { shopApi } from "@/api/endpoints/shop";
import { queryKeys } from "@/api/query-keys";
import { showSuccess } from "@/lib/error-handler";
import type { CreateAddressRequest, UpdateAddressRequest } from "@/types/dto/address.dto";

export const useAddresses = () => {
  const { isAuthenticated, isCustomer } = useAuth();

  return useQuery({
    queryKey: queryKeys.addresses.list(),
    queryFn: () => shopApi.getAddresses(),
    enabled: isAuthenticated && isCustomer,
  });
};

export const useCreateAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateAddressRequest) => shopApi.createAddress(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.addresses.all });
      showSuccess("Address added");
    },
  });
};

export const useUpdateAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ uuid, data }: { uuid: string; data: UpdateAddressRequest }) =>
      shopApi.updateAddress(uuid, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.addresses.all });
      showSuccess("Address updated");
    },
  });
};

export const useDeleteAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (uuid: string) => shopApi.deleteAddress(uuid),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.addresses.all });
      showSuccess("Address deleted");
    },
  });
};

export const useSetDefaultAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (uuid: string) => shopApi.setDefaultAddress(uuid),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.addresses.all });
      showSuccess("Default address updated");
    },
  });
};
