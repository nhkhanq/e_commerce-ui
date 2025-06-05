// Product Services
export { 
  productsApi, 
  useGetProductsQuery, 
  useGetCategoriesQuery, 
  useSearchByCriteriaQuery, 
  useGetProductByIdQuery 
} from './product/productsApi';

// Auth Services
export { 
  authApi, 
  useLoginMutation, 
  useLogoutMutation 
} from './auth/authApi';

// Admin Services
export { 
  adminApi,
  useGetAdminProductsQuery,
  useGetAdminCategoriesQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useGetUsersQuery,
  useGetVouchersQuery,
  useCreateVoucherMutation,
  useUpdateVoucherMutation,
  useDeleteVoucherMutation,
  useGetPermissionsQuery,
  useGetRolesQuery
} from './admin/adminApi';

// Orders Services
export { 
  ordersApi, 
  useGetMyOrdersQuery, 
  useGetOrderByIdQuery, 
  useCreateOrderMutation, 
  useSearchOrdersQuery 
} from './orders/ordersApi';

// Payment Services
export { 
  paymentApi, 
  useGetPaymentUrlMutation 
} from './payment/paymentApi';

// Location Services
export { 
  locationApi, 
  useGetProvincesQuery, 
  useGetDistrictsByProvinceIdQuery, 
  useGetWardsByDistrictIdQuery 
} from './location/locationApi';

// User Services
export { 
  userApi, 
  useGetMyProfileQuery 
} from './user/userApi';

// Vouchers Services
export { 
  vouchersApi, 
  usePreviewOrderMutation 
} from './vouchers/vouchersApi';

// Revenue Services
export { 
  revenueApi, 
  useGetRevenueByDateRangeMutation, 
  useGetRevenueByProductMutation, 
  useGetRevenueByCategoryMutation, 
  useGetRevenueByYearQuery, 
  useGetRevenueByMonthQuery 
} from './revenue/revenueApi'; 
