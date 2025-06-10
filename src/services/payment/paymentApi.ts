import { createApi } from "@reduxjs/toolkit/query/react";
import { createBaseQueryWithCustomHeaders } from "../shared/baseQuery";
import { OrderReq, OrderApiResponse as OrderResponse } from "@/types/order";

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
  baseQuery: createBaseQueryWithCustomHeaders({ 'Content-Type': 'application/json' }),
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
