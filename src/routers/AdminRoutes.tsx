import { Routes, Route } from "react-router-dom";
import { lazy } from "react";

import { AdminRoute } from "@/components/auth/ProtectedRoute";
import AdminLayout from "@/pages/admin/AdminLayout";

// Lazy load admin components để cải thiện performance
const AdminDashboardPage = lazy(
  () => import("@/pages/admin/dashboard/AdminDashboardPage")
);
const AdminProductList = lazy(
  () => import("@/pages/admin/products/ProductList")
);
const AdminProductForm = lazy(
  () => import("@/pages/admin/products/ProductForm")
);
const AdminCategoryList = lazy(
  () => import("@/pages/admin/products/CategoryList")
);
const AdminCategoryForm = lazy(
  () => import("@/pages/admin/products/CategoryForm")
);
const AdminOrderList = lazy(() => import("@/pages/admin/orders/OrderList"));
const AdminOrderDetail = lazy(() => import("@/pages/admin/orders/OrderDetail"));
const CustomersPage = lazy(
  () => import("@/pages/admin/customers/CustomersPage")
);
const VouchersPage = lazy(() => import("@/pages/admin/vouchers/VouchersPage"));
const AddVoucherPage = lazy(
  () => import("@/pages/admin/vouchers/AddVoucherPage")
);
const EditVoucherPage = lazy(
  () => import("@/pages/admin/vouchers/EditVoucherPage")
);
const PermissionsPage = lazy(
  () => import("@/pages/admin/permissions/PermissionsPage")
);
const RolesPage = lazy(() => import("@/pages/admin/permissions/RolesPage"));
const RevenuePage = lazy(() => import("@/pages/admin/revenue/RevenuePage"));
const BannerManagement = lazy(
  () => import("@/pages/admin/banners/BannerManagement")
);

const AdminRoutes = () => {
  return (
    <Routes>
      <Route
        path="/*"
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route path="dashboard" element={<AdminDashboardPage />} />
        <Route path="products" element={<AdminProductList />} />
        <Route path="products/new" element={<AdminProductForm />} />
        <Route path="products/edit/:id" element={<AdminProductForm />} />
        <Route path="categories" element={<AdminCategoryList />} />
        <Route path="categories/new" element={<AdminCategoryForm />} />
        <Route path="categories/edit/:id" element={<AdminCategoryForm />} />
        <Route path="orders" element={<AdminOrderList />} />
        <Route path="orders/:id" element={<AdminOrderDetail />} />
        <Route path="users" element={<CustomersPage />} />
        <Route path="vouchers" element={<VouchersPage />} />
        <Route path="vouchers/new" element={<AddVoucherPage />} />
        <Route path="vouchers/edit/:code" element={<EditVoucherPage />} />
        <Route path="permissions" element={<PermissionsPage />} />
        <Route path="roles" element={<RolesPage />} />
        <Route path="revenue" element={<RevenuePage />} />
        <Route path="banners" element={<BannerManagement />} />
      </Route>
    </Routes>
  );
};

export default AdminRoutes;
