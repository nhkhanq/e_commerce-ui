import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

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
  const navigate = useNavigate();

  // On mount, check if user data exists in localStorage
  useEffect(() => {
    setMounted(true);

    // Only access localStorage after component mounts (client-side)
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      const accessToken = localStorage.getItem("accessToken");

      if (storedUser && accessToken) {
        try {
          const userData = JSON.parse(storedUser) as User;

          // Check if token is expired
          if (userData.tokenExpiry && userData.tokenExpiry > Date.now()) {
            setUser(userData);
          } else {
            // Token expired, log out
            handleLogout();
            toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
          }
        } catch (error) {
          console.error("Error parsing user data:", error);
          handleLogout();
        }
      }
    }
  }, [navigate]);

  const handleLogout = () => {
    // Only access localStorage in browser environment
    if (typeof window !== "undefined") {
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    }
    setUser(null);
    navigate("/login");
  };

  const login = (accessToken: string, refreshToken: string, userData: User) => {
    // Only access localStorage in browser environment
    if (typeof window !== "undefined") {
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("user", JSON.stringify(userData));
    }
    setUser(userData);
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
        isAuthenticated: !!user,
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
