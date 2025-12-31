import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { TokenManager } from "@/api";
import type { UserData } from "@/types/dto/auth.dto";

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: UserData | null;
  userRole: 'admin' | 'institution' | null;
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
  const [userRole, setUserRole] = useState<'admin' | 'institution' | null>(null);

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

  const login = (tokens: { accessToken: string; refreshToken: string }, userData?: UserData) => {
    TokenManager.setTokens(tokens);
    setIsAuthenticated(true);

    // Store user data if provided
    if (userData) {
      setUser(userData);
      setUserRole(userData.role || null);
      localStorage.setItem('user_data', JSON.stringify(userData));

      // Redirect based on role
      if (userData.role === 'institution') {
        window.location.href = '/institutions/dashboard';
      } else {
        window.location.href = '/dashboard';
      }
    }
  };

  const logout = () => {
    TokenManager.clearTokens();
    localStorage.removeItem('user_data');
    setIsAuthenticated(false);
    setUser(null);
    setUserRole(null);

    // Redirect based on current role
    if (userRole === 'institution') {
      window.location.href = "/institutions/login";
    } else if (window.location.pathname !== "/sign-in") {
      window.location.href = "/sign-in";
    }
  };

  const value = {
    isAuthenticated,
    isLoading,
    user,
    userRole,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
