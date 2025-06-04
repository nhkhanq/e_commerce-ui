import { Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";

import LoadingPage from "@/components/loading";
import NotFoundPage from "@/components/not-found";
import UserRoutes from "./UserRoutes";
import AdminRoutes from "./AdminRoutes";

// Lazy load main pages
const Home = lazy(() => import("@/pages/home"));
const Login = lazy(() => import("@/pages/auth/login"));
const Register = lazy(() => import("@/pages/auth/register"));
const ProductDetail = lazy(() => import("@/pages/product/product-detail"));
const ProductList = lazy(() => import("@/pages/product/product-list"));

const AppRouter = () => {
  return (
    <Suspense fallback={<LoadingPage />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/product-list" element={<ProductList />} />
        <Route path="/products/:id" element={<ProductDetail />} />

        <Route path="/*" element={<UserRoutes />} />
        <Route path="/admin/*" element={<AdminRoutes />} />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
};

export default AppRouter;
