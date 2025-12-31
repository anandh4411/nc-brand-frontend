import { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useAuth } from '@/context/auth-context';

export const useRoleGuard = (allowedRoles: Array<'admin' | 'institution'>) => {
  const { isLoading, isAuthenticated, userRole } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // Not authenticated, redirect to appropriate login
      const currentPath = window.location.pathname;
      if (currentPath.startsWith('/institutions')) {
        navigate({ to: '/institutions/login' });
      } else {
        navigate({ to: '/sign-in' });
      }
      return;
    }

    if (!isLoading && isAuthenticated && userRole) {
      // Authenticated but wrong role
      if (!allowedRoles.includes(userRole)) {
        // Redirect to appropriate dashboard
        if (userRole === 'institution') {
          navigate({ to: '/institutions/dashboard' });
        } else {
          navigate({ to: '/dashboard' });
        }
      }
    }
  }, [isLoading, isAuthenticated, userRole, allowedRoles, navigate]);

  return { isLoading, isAllowed: isAuthenticated && userRole && allowedRoles.includes(userRole) };
};
