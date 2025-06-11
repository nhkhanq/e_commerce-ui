import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";

import * as storage from "@/lib/storage";
import { getAuthToken, setAuthTokens, clearAuthTokens } from "@/lib/auth-utils";
import { logger } from "@/lib/logger";

type User = {
  id?: string;
  email: string;
  firstName?: string;
  lastName?: string;
  permissions: string[];
  roles?: string[];
  tokenExpiry: number;
};

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  hasPermission: (permission: string) => boolean;
  hasRole: (role: string) => boolean;
  login: (accessToken: string, refreshToken: string, user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [mounted, setMounted] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (typeof window === "undefined") return;

    setMounted(true);
    const storedUser = storage.getItem("user");
    const accessToken = getAuthToken();

    if (storedUser && accessToken) {
      try {
        const parsedUser = JSON.parse(storedUser);

        if (!parsedUser.roles) {
          parsedUser.roles = [];
        }
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        logger.warn("Failed to parse stored user data", error);
        handleLogout();
      }
    }
  }, [navigate]);

  const handleLogout = () => {
    setUser(null);
    setIsAuthenticated(false);

    if (typeof window !== "undefined") {
      storage.removeItem("user");
      clearAuthTokens();
    }
    navigate("/login");
  };

  const login = (accessToken: string, refreshToken: string, userData: User) => {
    setUser(userData);
    setIsAuthenticated(true);

    if (typeof window !== "undefined") {
      setAuthTokens(accessToken, refreshToken);
      storage.setJSON("user", userData);
    }
  };

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    return user.permissions.includes(permission);
  };

  const hasRole = (role: string): boolean => {
    if (!user) return false;

    const userRoles = user.roles || [];
    const userPermissions = user.permissions || [];

    return userRoles.includes(role) || userPermissions.includes(role);
  };

  if (!mounted) {
    return <div>{children}</div>;
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        hasPermission,
        hasRole,
        login,
        logout: handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
