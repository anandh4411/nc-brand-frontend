import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { TokenManager } from "@/api";
import type { UserData, UserRole } from "@/types/dto/auth.dto";

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: UserData | null;
  userRole: UserRole | null;
  isAdmin: boolean;
  isOutlet: boolean;
  isCustomer: boolean;
  isInstitution: boolean;
  login: (tokens: { accessToken: string; refreshToken: string }, userData?: UserData) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<UserData | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);

  // Role helper flags
  const isAdmin = userRole === 'admin';
  const isOutlet = userRole === 'outlet';
  const isCustomer = userRole === 'customer';
  const isInstitution = userRole === 'institution';

  // Check auth status on mount
  useEffect(() => {
    const checkAuthStatus = () => {
      const hasTokens = TokenManager.hasTokens();
      setIsAuthenticated(hasTokens);

      // Try to restore user data from localStorage
      if (hasTokens) {
        const storedUser = localStorage.getItem('user_data');
        if (storedUser) {
          try {
            const userData = JSON.parse(storedUser) as UserData;
            setUser(userData);
            setUserRole(userData.role || null);
          } catch (e) {
            console.error('Failed to parse user data:', e);
          }
        }
      }

      setIsLoading(false);
    };

    checkAuthStatus();
  }, []);

  // Listen for auth logout events from API client
  useEffect(() => {
    const handleAuthLogout = () => {
      logout();
    };

    window.addEventListener("auth:logout", handleAuthLogout);
    return () => window.removeEventListener("auth:logout", handleAuthLogout);
  }, []);

  /**
   * Get redirect path based on user role
   */
  const getRedirectPath = (role: UserRole | undefined): string => {
    switch (role) {
      case 'admin':
        return '/admin';
      case 'outlet':
        return '/outlet';
      case 'customer':
        return '/account';
      case 'institution':
        return '/institutions';
      default:
        return '/shop';
    }
  };

  /**
   * Get login path based on user role
   */
  const getLoginPath = (role: UserRole | null): string => {
    switch (role) {
      case 'outlet':
        return '/outlet/login';
      case 'customer':
        return '/sign-in?type=customer';
      default:
        return '/sign-in';
    }
  };

  const login = (tokens: { accessToken: string; refreshToken: string }, userData?: UserData) => {
    TokenManager.setTokens(tokens);
    setIsAuthenticated(true);

    // Store user data if provided
    if (userData) {
      setUser(userData);
      setUserRole(userData.role || null);
      localStorage.setItem('user_data', JSON.stringify(userData));

      // Redirect based on role
      const redirectPath = getRedirectPath(userData.role);
      window.location.href = redirectPath;
    }
  };

  const logout = () => {
    const currentRole = userRole;

    TokenManager.clearTokens();
    localStorage.removeItem('user_data');
    setIsAuthenticated(false);
    setUser(null);
    setUserRole(null);

    // Redirect to appropriate login page
    const loginPath = getLoginPath(currentRole);
    if (window.location.pathname !== loginPath) {
      window.location.href = loginPath;
    }
  };

  const value = {
    isAuthenticated,
    isLoading,
    user,
    userRole,
    isAdmin,
    isOutlet,
    isCustomer,
    isInstitution,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
