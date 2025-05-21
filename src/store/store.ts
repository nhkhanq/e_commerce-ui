import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";

import { productsApi } from "@/api/product/productsApi";
import { authApi } from "@/api/auth/authApi";
import { vouchersApi } from "@/api/vouchers/vouchersApi";
import { ordersApi } from "@/api/orders/ordersApi";
import { paymentApi } from "@/api/payment/paymentApi";
import { locationApi } from "@/api/location/locationApi";
import { adminApi } from "@/api/admin/adminApi";
import { userApi } from "@/api/user/userApi";

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
      userApi.middleware
    ),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
