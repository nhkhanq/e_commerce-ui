import { useState, useEffect } from "react";
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

//product
import ProductList from "./pages/product/product-list";

// Admin
import AdminDashboardPage from "./pages/admin/dashboard/AdminDashboardPage";
import AdminLayout from "./pages/admin/AdminLayout";

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const url = window.location.href;

    if (
      url.includes("vnp_ResponseCode") &&
      url.includes("vnp_TxnRef") &&
      !url.includes("/payment/vn-pay-callback")
    ) {
      console.log("Detected VNPay callback on incorrect path:", url);

      const searchParams = new URLSearchParams(window.location.search);

      const newUrl = `/payment/vn-pay-callback?${searchParams.toString()}`;
      console.log("Redirecting to correct path:", newUrl);

      navigate(newUrl, { replace: true });
    }
  }, [location, navigate]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 400);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingPage />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/product-list" element={<ProductList />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />

          {/* Payment routes */}
          <Route path="/payment" element={<PaymentPage />} />
          <Route
            path="/payment/vn-pay-callback"
            element={<PaymentCallback />}
          />

          {/* User routes */}
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/orders/:id" element={<OrderDetailPage />} />

          {/* Admin routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<AdminDashboardPage />} />
          </Route>

          {/* Catch all route */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
