/**
 * Review Hooks
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { shopApi } from "@/api/endpoints/shop";
import { queryKeys } from "@/api/query-keys";
import { showSuccess } from "@/lib/error-handler";
import type { CreateReviewRequest } from "@/types/dto/review.dto";

export const useProductReviews = (groupUuid: string) => {
  return useQuery({
    queryKey: queryKeys.reviews.byProduct(groupUuid as any),
    queryFn: () => shopApi.getProductReviews(groupUuid),
    enabled: !!groupUuid,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCreateReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateReviewRequest) => shopApi.createReview(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.reviews.byProduct(variables.productGroupId) });
      showSuccess("Review submitted for approval");
    },
  });
};
