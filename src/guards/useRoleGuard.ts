import { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useAuth } from '@/context/auth-context';
import { env } from '@/config/env';
import type { UserRole } from '@/types/dto/auth.dto';

/**
 * Role-based route guard for TextileHub
 * Redirects users to appropriate pages based on their role
 */
export const useRoleGuard = (allowedRoles: UserRole[]) => {
  const { isLoading, isAuthenticated, userRole } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Skip role guard if auth guard is disabled (dev only)
    if (env.isAuthGuardDisabled) {
      return;
    }

    if (!isLoading && !isAuthenticated) {
      // Not authenticated, redirect to appropriate login
      const currentPath = window.location.pathname;
      if (currentPath.startsWith('/outlet')) {
        navigate({ to: '/outlet/login' });
      } else if (currentPath.startsWith('/account') || currentPath.startsWith('/checkout')) {
        // Customer routes - redirect to shop sign-in
        navigate({ to: '/sign-in', search: { type: 'customer' } });
      } else {
        // Admin routes
        navigate({ to: '/sign-in' });
      }
      return;
    }

    if (!isLoading && isAuthenticated && userRole) {
      // Authenticated but wrong role
      if (!allowedRoles.includes(userRole)) {
        // Redirect to appropriate dashboard based on actual role
        switch (userRole) {
          case 'admin':
            navigate({ to: '/admin' });
            break;
          case 'outlet':
            navigate({ to: '/outlet' });
            break;
          case 'customer':
            navigate({ to: '/account' });
            break;
          default:
            navigate({ to: '/shop' });
        }
      }
    }
  }, [isLoading, isAuthenticated, userRole, allowedRoles, navigate]);

  // If guard is disabled, always return allowed
  if (env.isAuthGuardDisabled) {
    return {
      isLoading: false,
      isAllowed: true,
    };
  }

  return {
    isLoading,
    isAllowed: isAuthenticated && userRole && allowedRoles.includes(userRole),
  };
};
