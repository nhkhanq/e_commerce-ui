import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "../shared/baseQuery";
import { OrderReq, OrderApiResponse as OrderApiResponse, OrderItemRes } from "@/types";

export interface Order {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  note?: string;
  totalMoney: number;
  status: 'PENDING' | 'PAID' | 'CANCELED' | 'DELIVERING' | 'SHIPPED';
  paymentMethod: 'CASH' | 'VN_PAY' | 'PAYPAL';
  orderItems: OrderItemRes[];
  createdAt?: string;
}

export interface OrderItem {
  id?: string;
  productId: string;
  price: number;
  quantity: number;
  totalMoney: number;
  product?: {
    id: string;
    name: string;
    imageUrl: string;
  };
}

export interface ChangeOrderStatusRequest {
  status: 'PENDING' | 'PAID' | 'CANCELED' | 'DELIVERING' | 'SHIPPED';
}

export interface ChangeOrderInfoRequest {
  fullName: string;
  phone: string;
  address: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  page: number;
  size: number;
  totalPages: number;
  totalItems: number;
}

// Generic API Response structure from OpenAPI
interface ApiResponse<TData> {
  code: number;
  message: string;
  result: TData; 
}

export const ordersApi = createApi({
  reducerPath: "ordersApi",
  baseQuery: baseQueryWithAuth,
  tagTypes: ["Order", "OrderItem"],
  endpoints: (builder) => ({
    // Create order (for customer checkout)
    createOrder: builder.mutation<OrderApiResponse, OrderReq>({
      query: (orderData) => ({
        url: '/orders',
        method: 'POST',
        body: orderData,
      }),
      invalidatesTags: [{ type: 'Order', id: 'LIST' }],
    }),
    
    // Get all orders with pagination
    getAllOrders: builder.query<PaginatedResponse<Order>, { pageNumber?: number; pageSize?: number }>({
      query: ({ pageNumber = 1, pageSize = 10 }) => 
        `orders?pageNumber=${pageNumber}&pageSize=${pageSize}`,
      transformResponse: (response: ApiResponse<PaginatedResponse<Order>>) => {
        if (response.result) {
          return response.result;
        }
        return { items: [], page: 1, size: 0, totalPages: 0, totalItems: 0 };
      },
      providesTags: (result) =>
        result?.items
          ? [
              ...result.items.map(({ id }) => ({ type: "Order" as const, id })),
              { type: "Order", id: "LIST" },
            ]
          : [{ type: "Order", id: "LIST" }],
    }),
    
    // Get my orders for the customer view
    getMyOrders: builder.query<PaginatedResponse<Order>, { pageNumber?: number; pageSize?: number }>({
      query: ({ pageNumber = 1, pageSize = 10 }) => 
        `orders/my-orders?pageNumber=${pageNumber}&pageSize=${pageSize}`,
      transformResponse: (response: ApiResponse<PaginatedResponse<Order>>) => {
        if (response.result) {
          return response.result;
        }
        return { items: [], page: 1, size: 0, totalPages: 0, totalItems: 0 };
      },
      // Refetch on focus and network reconnect
      keepUnusedDataFor: 0, // Don't keep unused data in cache
      providesTags: (result) =>
        result?.items
          ? [
              ...result.items.map(({ id }) => ({ type: "Order" as const, id })),
              { type: "Order", id: "LIST" },
            ]
          : [{ type: "Order", id: "LIST" }],
    }),
    
    // Search orders with filters
    searchOrders: builder.query<
      PaginatedResponse<Order>, 
      { status?: string; userId?: string; pageNumber?: number; pageSize?: number }
    >({
      query: ({ status, userId, pageNumber = 1, pageSize = 10 }) => {
        let queryParams = `pageNumber=${pageNumber}&pageSize=${pageSize}`;
        if (status) queryParams += `&status=${status}`;
        if (userId) queryParams += `&userId=${userId}`;
        return `orders/search?${queryParams}`;
      },
      transformResponse: (response: ApiResponse<PaginatedResponse<Order>>) => {
        if (response.result) {
          return response.result;
        }
        return { items: [], page: 1, size: 0, totalPages: 0, totalItems: 0 };
      },
      providesTags: (result) =>
        result?.items
          ? [
              ...result.items.map(({ id }) => ({ type: "Order" as const, id })),
              { type: "Order", id: "LIST" },
            ]
          : [{ type: "Order", id: "LIST" }],
    }),
    
    // Get single order by ID
    getOrderById: builder.query<Order, string>({
      query: (id) => `orders/${id}`,
      transformResponse: (response: ApiResponse<Order>) => response.result,
      providesTags: (_, __, id) => [{ type: "Order", id }],
    }),
    
    // Get order items for an order
    getOrderItems: builder.query<PaginatedResponse<OrderItem>, { orderId: string; pageNumber?: number; pageSize?: number }>({
      query: ({ orderId, pageNumber = 1, pageSize = 50 }) => 
        `order-items/order/${orderId}?pageNumber=${pageNumber}&pageSize=${pageSize}`,
      transformResponse: (response: ApiResponse<PaginatedResponse<OrderItem>>) => {
        if (response.result) {
          return response.result;
        }
        return { items: [], page: 1, size: 0, totalPages: 0, totalItems: 0 };
      },
      providesTags: (_, __, { orderId }) => [{ type: "OrderItem", id: orderId }],
    }),
    
    // Update order status
    updateOrderStatus: builder.mutation<Order, { id: string; request: ChangeOrderStatusRequest }>({
      query: ({ id, request }) => ({
        url: `orders/status/${id}`,
        method: 'PUT',
        body: request,
      }),
      transformResponse: (response: ApiResponse<Order>) => response.result,
      invalidatesTags: (_, __, { id }) => [
        { type: 'Order', id },
        { type: 'Order', id: 'LIST' }
      ],
    }),
    
    // Update order info
    updateOrderInfo: builder.mutation<Order, { id: string; request: ChangeOrderInfoRequest }>({
      query: ({ id, request }) => ({
        url: `orders/info/${id}`,
        method: 'PUT',
        body: request,
      }),
      transformResponse: (response: ApiResponse<Order>) => response.result,
      invalidatesTags: (_, __, { id }) => [
        { type: 'Order', id },
        { type: 'Order', id: 'LIST' }
      ],
    }),
    
    // Delete an order
    deleteOrder: builder.mutation<void, string>({
      query: (id) => ({
        url: `orders/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Order', id: 'LIST' }],
    }),
    
    // Cancel an order (for customer)
    cancelOrder: builder.mutation<void, string>({
      query: (id) => ({
        url: `orders/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_, __, id) => [
        { type: 'Order', id },
        { type: 'Order', id: 'LIST' }
      ],
    }),
  }),
});

export const { 
  useCreateOrderMutation,
  useGetAllOrdersQuery,
  useSearchOrdersQuery,
  useGetOrderByIdQuery,
  useGetOrderItemsQuery,
  useUpdateOrderStatusMutation,
  useUpdateOrderInfoMutation,
  useDeleteOrderMutation,
  useGetMyOrdersQuery,
  useCancelOrderMutation,
} = ordersApi; 
