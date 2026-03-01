import { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useAuth } from '@/context/auth-context';
import { env } from '@/config/env';
import type { UserRole } from '@/types/dto/auth.dto';

/**
 * Role-based route guard for TextileHub
 * Redirects users to appropriate pages based on their role
 */
export const useRoleGuard = (allowedRoles: UserRole[], options?: { skip?: boolean }) => {
  const { isLoading, isAuthenticated, userRole } = useAuth();
  const navigate = useNavigate();
  const skip = options?.skip;

  useEffect(() => {
    if (skip || env.isAuthGuardDisabled) {
      return;
    }

    if (!isLoading && !isAuthenticated) {
      const currentPath = window.location.pathname;
      if (currentPath.startsWith('/outlet')) {
        navigate({ to: '/outlet/sign-in' as any });
      } else if (currentPath.startsWith('/account') || currentPath.startsWith('/checkout')) {
        navigate({ to: '/sign-in' as any, search: { type: 'customer' } });
      } else {
        navigate({ to: '/admin/sign-in' as any });
      }
      return;
    }

    if (!isLoading && isAuthenticated && userRole) {
      if (!allowedRoles.includes(userRole)) {
        switch (userRole) {
          case 'admin':
            navigate({ to: '/admin' });
            break;
          case 'outlet':
            navigate({ to: '/outlet' });
            break;
          case 'customer':
            navigate({ to: '/account' as any });
            break;
          default:
            navigate({ to: '/shop' as any });
        }
      }
    }
  }, [isLoading, isAuthenticated, userRole, allowedRoles, navigate, skip]);

  if (skip || env.isAuthGuardDisabled) {
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
