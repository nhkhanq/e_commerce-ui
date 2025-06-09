import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { OrderReq, OrderApiResponse as OrderResponse } from "@/types/order";
import { BASE_URL } from "@/lib/constants";
import * as storage from "@/lib/storage";

export interface VNPayVerifyRequest {
  vnp_ResponseCode: string;
  vnp_TransactionStatus: string;
  vnp_TxnRef?: string;
  vnp_OrderInfo?: string;
  vnp_Amount?: string;
  vnp_BankCode?: string;
  vnp_PayDate?: string;
  vnp_SecureHash?: string;
  [key: string]: string | undefined; // For any additional VNPay parameters
}

export interface VNPayVerifyResponse {
  code: number;
  message: string;
  result?: {
    verified: boolean;
    orderId?: string;
  };
}

export interface PaymentStatusUpdateRequest {
  responseCode: string;
  orderId: string;
  amount: string;
}

export interface PaymentStatusUpdateResponse {
  code: number;
  message: string;
  result?: any;
}

export const paymentApi = createApi({
  reducerPath: "paymentApi",
  baseQuery: fetchBaseQuery({ 
    baseUrl: BASE_URL,
    prepareHeaders: (headers) => {
      // Only access localStorage in browser environment
      if (typeof window !== 'undefined') {
        const token = storage.getItem("accessToken");
        if (token) {
          headers.set('Authorization', `Bearer ${token}`);
        }
      }
      headers.set('Content-Type', 'application/json');
      headers.set("ngrok-skip-browser-warning", "true");
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
    verifyVNPayPayment: builder.mutation<VNPayVerifyResponse, VNPayVerifyRequest>({
      query: (vnpayParams) => ({
        url: "/payment/vn-pay-callback",
        method: "POST",
        body: vnpayParams
      }),
    }),
    updatePaymentStatus: builder.mutation<PaymentStatusUpdateResponse, PaymentStatusUpdateRequest>({
      query: (paymentStatusData) => ({
        url: "/payment/update-status",
        method: "POST",
        body: paymentStatusData
      }),
    }),
  }),
});

export const { 
  useGetPaymentUrlMutation,
  useCheckPaymentStatusQuery,
  useVerifyVNPayPaymentMutation,
  useUpdatePaymentStatusMutation
} = paymentApi;
