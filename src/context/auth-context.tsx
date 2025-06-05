import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";

import * as storage from "@/lib/storage";

type User = {
  email: string;
  permissions: string[];
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

  // On mount, check if user data exists in localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Only access localStorage after component mounts (client-side)
    setMounted(true);
    const storedUser = storage.getItem("user");
    const accessToken = storage.getItem("accessToken");

    if (storedUser && accessToken) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.warn("Failed to parse stored user data", error);
        handleLogout();
      }
    }
  }, [navigate]);

  const handleLogout = () => {
    setUser(null);
    setIsAuthenticated(false);

    // Only access localStorage in browser environment
    if (typeof window !== "undefined") {
      storage.removeItem("user");
      storage.removeItem("accessToken");
      storage.removeItem("refreshToken");
    }
    navigate("/login");
  };

  const login = (accessToken: string, refreshToken: string, userData: User) => {
    setUser(userData);
    setIsAuthenticated(true);

    // Only access localStorage in browser environment
    if (typeof window !== "undefined") {
      storage.setItem("accessToken", accessToken);
      storage.setItem("refreshToken", refreshToken);
      storage.setJSON("user", userData);
    }
  };

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    return user.permissions.includes(permission);
  };

  const hasRole = (role: string): boolean => {
    if (!user) return false;
    return user.permissions.includes(role);
  };

  // Prevent hydration mismatch by not rendering until mounted
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
