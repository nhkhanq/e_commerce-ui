import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryPublic } from "../shared/baseQuery";

export const vouchersApi = createApi({
  reducerPath: "vouchersApi",
  baseQuery: baseQueryPublic,
  endpoints: (builder) => ({
    getVoucherByCode: builder.query({
      query: (code) => `/vouchers/${code}`,
    }),
    previewOrder: builder.mutation({
      query: (body) => ({
        url: "/preview/order",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useGetVoucherByCodeQuery, usePreviewOrderMutation } = vouchersApi;
