import { Routes, Route } from "react-router-dom";
import { lazy } from "react";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import NotFoundPage from "@/components/not-found";

// Lazy load user components
const Cart = lazy(() => import("@/pages/product/cart"));
const OrdersPage = lazy(() => import("@/pages/orders/OrdersPage"));
const OrderDetailPage = lazy(() => import("@/pages/orders/OrderDetailPage"));
const PaymentPage = lazy(() => import("@/pages/payment/payment"));
const PaymentCallback = lazy(() => import("@/pages/payment/callback"));
const PaymentResult = lazy(() => import("@/pages/payment/payment-result"));
const ProfilePage = lazy(() => import("@/pages/profile/ProfilePage"));

const UserRoutes = () => {
  return (
    <Routes>
      <Route
        path="/cart"
        element={
          <ProtectedRoute requiredRoles={["ROLE_USER", "ROLE_ADMIN"]}>
            <Cart />
          </ProtectedRoute>
        }
      />

      <Route
        path="/payment"
        element={
          <ProtectedRoute requiredRoles={["ROLE_USER", "ROLE_ADMIN"]}>
            <PaymentPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/payment/vn-pay-callback"
        element={
          <ProtectedRoute requiredRoles={["ROLE_USER", "ROLE_ADMIN"]}>
            <PaymentCallback />
          </ProtectedRoute>
        }
      />
      <Route
        path="/payment/result"
        element={
          <ProtectedRoute requiredRoles={["ROLE_USER", "ROLE_ADMIN"]}>
            <PaymentResult />
          </ProtectedRoute>
        }
      />

      <Route
        path="/orders"
        element={
          <ProtectedRoute
            requiredRoles={["ROLE_USER", "ROLE_ADMIN"]}
            requiredPermissions={["ORDER_PRODUCT"]}
          >
            <OrdersPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/orders/:id"
        element={
          <ProtectedRoute
            requiredRoles={["ROLE_USER", "ROLE_ADMIN"]}
            requiredPermissions={["ORDER_PRODUCT"]}
          >
            <OrderDetailPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute requiredRoles={["ROLE_USER", "ROLE_ADMIN"]}>
            <ProfilePage />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default UserRoutes;
