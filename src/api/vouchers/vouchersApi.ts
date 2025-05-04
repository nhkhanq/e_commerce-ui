import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "@/lib/constants";

export const vouchersApi = createApi({
  reducerPath: "vouchersApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}/vouchers`,
    prepareHeaders: (headers) => {
      headers.set("ngrok-skip-browser-warning", "true");
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getVoucherByCode: builder.query({
      query: (code) => `/${code}`,
    }),
  }),
});

export const { useGetVoucherByCodeQuery } = vouchersApi;