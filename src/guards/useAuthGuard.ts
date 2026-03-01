import { useEffect } from "react";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "@tanstack/react-router";
import { env } from "@/config/env";

export const useAuthGuard = (options?: { skip?: boolean }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const skip = options?.skip;

  useEffect(() => {
    if (skip || env.isAuthGuardDisabled) {
      return;
    }

    // Redirect to login if not authenticated
    if (!isLoading && !isAuthenticated) {
      router.navigate({ to: "/admin/sign-in" as any });
    }
  }, [isAuthenticated, isLoading, router, skip]);

  if (skip || env.isAuthGuardDisabled) {
    return {
      isAuthenticated: true,
      isLoading: false,
    };
  }

  return {
    isAuthenticated,
    isLoading,
  };
};
