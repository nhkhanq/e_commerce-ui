import { Routes, Route } from "react-router-dom";
import { lazy } from "react";

import { CustomerRoute } from "@/components/auth/ProtectedRoute";
import NotFoundPage from "@/components/not-found";

// Lazy load user components
const Cart = lazy(() => import("@/pages/product/cart"));
const VouchersPage = lazy(() => import("@/pages/vouchers/VouchersPage"));
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
          <CustomerRoute>
            <Cart />
          </CustomerRoute>
        }
      />

      <Route
        path="/vouchers"
        element={
          <CustomerRoute>
            <VouchersPage />
          </CustomerRoute>
        }
      />

      <Route
        path="/payment"
        element={
          <CustomerRoute>
            <PaymentPage />
          </CustomerRoute>
        }
      />
      <Route
        path="/payment/vn-pay-callback"
        element={
          <CustomerRoute>
            <PaymentCallback />
          </CustomerRoute>
        }
      />
      <Route
        path="/payment/result"
        element={
          <CustomerRoute>
            <PaymentResult />
          </CustomerRoute>
        }
      />

      <Route
        path="/orders"
        element={
          <CustomerRoute>
            <OrdersPage />
          </CustomerRoute>
        }
      />
      <Route
        path="/orders/:id"
        element={
          <CustomerRoute>
            <OrderDetailPage />
          </CustomerRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <CustomerRoute>
            <ProfilePage />
          </CustomerRoute>
        }
      />

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default UserRoutes;
