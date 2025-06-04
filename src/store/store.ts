import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";

import { productsApi } from "@/services/product/productsApi";
import { authApi } from "@/services/auth/authApi";
import { vouchersApi } from "@/services/vouchers/vouchersApi";
import { ordersApi } from "@/services/orders/ordersApi";
import { paymentApi } from "@/services/payment/paymentApi";
import { locationApi } from "@/services/location/locationApi";
import { adminApi } from "@/services/admin/adminApi";
import { userApi } from "@/services/user/userApi";
import { revenueApi } from "@/services/revenue/revenueApi";

const store = configureStore({
  reducer: {
    [productsApi.reducerPath]: productsApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [vouchersApi.reducerPath]: vouchersApi.reducer,
    [ordersApi.reducerPath]: ordersApi.reducer,
    [paymentApi.reducerPath]: paymentApi.reducer,
    [locationApi.reducerPath]: locationApi.reducer,
    [adminApi.reducerPath]: adminApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [revenueApi.reducerPath]: revenueApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      productsApi.middleware,
      authApi.middleware,
      vouchersApi.middleware,
      ordersApi.middleware,
      paymentApi.middleware,
      locationApi.middleware,
      adminApi.middleware,
      userApi.middleware,
      revenueApi.middleware
    ),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
