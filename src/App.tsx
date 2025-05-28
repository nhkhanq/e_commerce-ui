import { useState, useEffect, Suspense } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import Footer from "./components/footer";
import Header from "./components/shared/header";
import Login from "./pages/auth/login";
import LoadingPage from "./components/loading";
import NotFoundPage from "./components/not-found";
import Home from "./pages/home";
import ProductDetail from "./pages/product/product-detail";
import Register from "./pages/auth/register";
import Cart from "./pages/product/cart";
import OrdersPage from "./pages/orders/OrdersPage";
import OrderDetailPage from "./pages/orders/OrderDetailPage";
import PaymentPage from "./pages/payment/payment";
import PaymentCallback from "./pages/payment/callback";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import ProfilePage from "./pages/profile";

//product
import ProductList from "./pages/product/product-list";

// Admin
import AdminDashboardPage from "./pages/admin/dashboard/AdminDashboardPage";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminProductList from "./pages/admin/products/ProductList";
import AdminProductForm from "./pages/admin/products/ProductForm";
import AdminCategoryList from "./pages/admin/products/CategoryList";
import AdminCategoryForm from "./pages/admin/products/CategoryForm";
import AdminOrderList from "./pages/admin/orders/OrderList";
import AdminOrderDetail from "./pages/admin/orders/OrderDetail";
// Admin - Customers and Vouchers
import CustomersPage from "./pages/admin/customers/CustomersPage";
import VouchersPage from "./pages/admin/vouchers/VouchersPage";
import AddVoucherPage from "./pages/admin/vouchers/AddVoucherPage";
import EditVoucherPage from "./pages/admin/vouchers/EditVoucherPage";
// Admin - Permissions and Roles
import PermissionsPage from "./pages/admin/permissions/PermissionsPage";
import RolesPage from "./pages/admin/permissions/RolesPage";

// Error boundary component to prevent crashes
const ErrorFallback = ({
  error,
  resetErrorBoundary,
}: {
  error: Error;
  resetErrorBoundary: () => void;
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <h2 className="text-xl font-bold mb-4">Something went wrong</h2>
      <p className="mb-4 text-red-500">{error.message}</p>
      <button
        onClick={resetErrorBoundary}
        className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
      >
        Try again
      </button>
    </div>
  );
};

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const [hasError, setHasError] = useState(false);

  // Handle VNPay redirects
  useEffect(() => {
    // Handle cases where VNPay redirects to the backend API instead of frontend
    const handleVNPayCallback = () => {
      const url = window.location.href;

      // Check if this URL contains VNPay response parameters
      if (url.includes("vnp_ResponseCode") && url.includes("vnp_TxnRef")) {
        console.log("Detected VNPay callback parameters in URL");

        // If we're already on the correct route, don't do anything
        if (location.pathname === "/payment/vn-pay-callback") {
          console.log("Already on correct callback path, no redirect needed");
          return;
        }

        // Get all query parameters
        const searchParams = new URLSearchParams(window.location.search);

        // Kiểm tra nếu đang ở trên URL backend (ngrok) và chuyển về localhost nếu đang ở môi trường dev
        const isNgrokUrl = url.includes("ngrok-free.app");
        const storedCallbackUrl = localStorage.getItem("vnpay_callback_url");

        // Nếu URL chứa ngrok và đang ở môi trường dev, chuyển hướng về localhost
        if (isNgrokUrl && import.meta.env.DEV && storedCallbackUrl) {
          console.log("Converting ngrok URL to localhost URL");
          window.location.href = `${storedCallbackUrl}?${searchParams.toString()}`;
          return;
        }

        // Construct the correct frontend route URL
        const newUrl = `/payment/vn-pay-callback?${searchParams.toString()}`;
        console.log("Redirecting to correct frontend route:", newUrl);

        // Use replace to avoid adding to history
        navigate(newUrl, { replace: true });
      }
    };

    handleVNPayCallback();
  }, [location, navigate]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 400);

    return () => clearTimeout(timer);
  }, []);

  // Reset error state on location change
  useEffect(() => {
    setHasError(false);
  }, [location.pathname]);

  if (isLoading) {
    return <LoadingPage />;
  }

  const resetError = () => {
    setHasError(false);
  };

  if (hasError) {
    return (
      <ErrorFallback
        error={new Error("An unexpected error occurred")}
        resetErrorBoundary={resetError}
      />
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      <main className="flex-grow">
        <Suspense fallback={<LoadingPage />}>
          <Routes>
            <Route path="/" element={<Home />} />

            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route path="/product-list" element={<ProductList />} />
            <Route path="/products/:id" element={<ProductDetail />} />

            {/* Protected User Routes */}
            <Route
              path="/cart"
              element={
                <ProtectedRoute requiredRoles={["ROLE_USER", "ROLE_ADMIN"]}>
                  <Cart />
                </ProtectedRoute>
              }
            />

            {/* Payment routes - require authentication */}
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

            {/* User routes - require authentication */}
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

            {/* Profile route - require authentication */}
            <Route
              path="/profile"
              element={
                <ProtectedRoute requiredRoles={["ROLE_USER", "ROLE_ADMIN"]}>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />

            {/* Admin routes - require ROLE_ADMIN */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute requiredRoles={["ROLE_ADMIN"]}>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route path="dashboard" element={<AdminDashboardPage />} />
              <Route path="products" element={<AdminProductList />} />
              <Route
                path="products/new"
                element={
                  <ProtectedRoute requiredPermissions={["CREATE_PRODUCT"]}>
                    <AdminProductForm />
                  </ProtectedRoute>
                }
              />
              <Route
                path="products/edit/:id"
                element={
                  <ProtectedRoute requiredPermissions={["UPDATE_PRODUCT"]}>
                    <AdminProductForm />
                  </ProtectedRoute>
                }
              />
              <Route path="categories" element={<AdminCategoryList />} />
              <Route path="categories/new" element={<AdminCategoryForm />} />
              <Route
                path="categories/edit/:id"
                element={<AdminCategoryForm />}
              />
              <Route path="orders" element={<AdminOrderList />} />
              <Route path="orders/:id" element={<AdminOrderDetail />} />
              {/* Admin Customer routes */}
              <Route path="users" element={<CustomersPage />} />
              {/* Admin Voucher routes */}
              <Route path="vouchers" element={<VouchersPage />} />
              <Route path="vouchers/new" element={<AddVoucherPage />} />
              <Route path="vouchers/edit/:code" element={<EditVoucherPage />} />

              {/* Admin Permission routes */}
              <Route path="permissions" element={<PermissionsPage />} />
              <Route path="roles" element={<RolesPage />} />
            </Route>

            {/* Catch all route */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}

export default App;
