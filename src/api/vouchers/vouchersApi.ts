import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "@/lib/constants";

export const vouchersApi = createApi({
  reducerPath: "vouchersApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers) => {
      headers.set("ngrok-skip-browser-warning", "true");
      return headers;
    },
  }),
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