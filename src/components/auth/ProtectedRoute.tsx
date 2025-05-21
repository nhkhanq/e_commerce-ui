import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/auth-context";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredPermissions?: string[];
  requiredRoles?: string[];
  redirectPath?: string;
}

const ProtectedRoute = ({
  children,
  requiredPermissions = [],
  requiredRoles = [],
  redirectPath = "/login",
}: ProtectedRouteProps) => {
  const { isAuthenticated, hasPermission, hasRole } = useAuth();

  // Not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to={redirectPath} replace />;
  }

  // Check permissions if specified
  if (requiredPermissions.length > 0) {
    const hasAllRequiredPermissions = requiredPermissions.every((permission) =>
      hasPermission(permission)
    );

    if (!hasAllRequiredPermissions) {
      return <Navigate to="/" replace />;
    }
  }

  // Check roles if specified
  if (requiredRoles.length > 0) {
    const hasAnyRequiredRole = requiredRoles.some((role) => hasRole(role));

    if (!hasAnyRequiredRole) {
      return <Navigate to="/" replace />;
    }
  }

  // User has required permissions/roles, render the route
  return <>{children}</>;
};

export default ProtectedRoute;
