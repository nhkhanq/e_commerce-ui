import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "../shared/baseQuery";

export interface PublicVoucher {
  id: string;
  code: string;
  discountType: 'FIXED' | 'PERCENT';
  discountValue: number;
  expirationDate: string;
  status: 'ACTIVE' | 'EXPIRED' | 'USED';
  usedCount: number;
}

export interface ApiResponse<T> {
  code: number;
  message: string;
  result: T;
}

export const vouchersApi = createApi({
  reducerPath: "vouchersApi",
  baseQuery: baseQueryWithAuth,
  endpoints: (builder) => ({
    getVoucherByCode: builder.query({
      query: (code: string) => `/vouchers/${code}`,
    }),
    getAllVouchers: builder.query<PublicVoucher[], void>({
      query: () => `/vouchers?pageNumber=1&pageSize=100`,
      transformResponse: (response: any) => {
        console.log("getAllVouchers response:", response);
        if (response?.result?.items) {
          return response.result.items;
        }
        if (response?.result && Array.isArray(response.result)) {
          return response.result;
        }
        return [];
      },
    }),
    previewOrder: builder.mutation({
      query: (body: any) => ({
        url: "/preview/order",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { 
  useGetVoucherByCodeQuery, 
  useGetAllVouchersQuery,
  usePreviewOrderMutation 
} = vouchersApi;
