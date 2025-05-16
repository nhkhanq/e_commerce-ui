import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "@/lib/constants";
import {
  OrderRequest,
  OrderResponse,
  OrdersResponse,
  PaginationParams,
} from "@/interfaces/order";

export type { OrderResponse as Order } from "@/interfaces/order";

interface AdminSearchOrdersParams extends PaginationParams {
  status?: string;
  userId?: string;
}

export const ordersApi = createApi({
  reducerPath: "ordersApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("accessToken");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
        headers.set("Content-Type", "application/json");
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    createOrder: builder.mutation<OrderResponse, OrderRequest>({
      query: (orderData) => ({
        url: "/orders",
        method: "POST",
        body: orderData,
      }),
    }),
    getMyOrders: builder.query<OrdersResponse, PaginationParams>({
      query: ({ pageNumber, pageSize }) => ({
        url: `/orders/my-orders?pageNumber=${pageNumber}&pageSize=${pageSize}`,
      }),
    }),
    getOrderById: builder.query<OrderResponse, string>({
      query: (id) => `/orders/${id}`,
    }),
    cancelOrder: builder.mutation<void, string>({
      query: (id) => ({
        url: `/orders/${id}`,
        method: "DELETE",
      }),
    }),
    searchOrders: builder.query<OrdersResponse, AdminSearchOrdersParams>({
      query: ({ pageNumber = 1, pageSize = 10, status, userId }) => {
        const params = new URLSearchParams();
        params.append("pageNumber", pageNumber.toString());
        params.append("pageSize", pageSize.toString());
        if (status) {
          params.append("status", status);
        }
        if (userId) {
          params.append("userId", userId);
        }
        return `/orders/search?${params.toString()}`;
      },
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useGetMyOrdersQuery,
  useGetOrderByIdQuery,
  useCancelOrderMutation,
  useSearchOrdersQuery,
} = ordersApi; 