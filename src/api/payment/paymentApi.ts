import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { OrderReq, OrderResponse } from "@/interfaces/order";
import { BASE_URL } from "@/lib/constants";

export const paymentApi = createApi({
  reducerPath: "paymentApi",
  baseQuery: fetchBaseQuery({ 
    baseUrl: BASE_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("accessToken");
      headers.set('Content-Type', 'application/json');
      headers.set("ngrok-skip-browser-warning", "true");
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getPaymentUrl: builder.mutation<OrderResponse, OrderReq>({
      query: (orderData) => ({
        url: "/payment/pay",
        method: "POST",
        body: orderData
      }),
    }),
    checkPaymentStatus: builder.query<any, string>({
      query: (orderId) => `/payment/status/${orderId}`,
    }),
  }),
});

export const { 
  useGetPaymentUrlMutation,
  useCheckPaymentStatusQuery 
} = paymentApi;