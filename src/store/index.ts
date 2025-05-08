import { configureStore } from "@reduxjs/toolkit";
import { productsApi } from "@/api/product/productsApi";
import { authApi } from "@/api/auth/authApi";
import { vouchersApi } from "@/api/vouchers/vouchersApi";
import { ordersApi } from "@/api/orders/ordersApi";

export const store = configureStore({
  reducer: {
    [productsApi.reducerPath]: productsApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [vouchersApi.reducerPath]: vouchersApi.reducer,
    [ordersApi.reducerPath]: ordersApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      productsApi.middleware,
      authApi.middleware,
      vouchersApi.middleware,
      ordersApi.middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 