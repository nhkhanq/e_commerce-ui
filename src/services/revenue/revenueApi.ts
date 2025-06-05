import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import * as storage from "@/lib/storage";
import {
  RevenueRequest,
  RevenueResponse,
  RevenueByProductResponse,
  RevenueByCategoryResponse,
  MonthFilterParams,
} from "@/types/admin";

export const revenueApi = createApi({
  reducerPath: "revenueApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://oarfish-relaxing-whippet.ngrok-free.app",
    prepareHeaders: (headers) => {
      // Only access localStorage in browser environment
      if (typeof window !== 'undefined') {
        const token = storage.getItem("accessToken");
        if (token) {
          headers.set("Authorization", `Bearer ${token}`);
        }
      }
      headers.set("ngrok-skip-browser-warning", "true");
      return headers;
    },
  }),
  tagTypes: ["Revenue"],
  endpoints: (builder) => ({
    getRevenueByDateRange: builder.mutation<RevenueResponse, RevenueRequest>({
      query: (data) => ({
        url: "/revenue",
        method: "POST",
        body: data,
      }),
      transformResponse: (response: { code: number; result: RevenueResponse }) => 
        response.result,
      invalidatesTags: ["Revenue"],
    }),
    getRevenueByProduct: builder.mutation<RevenueByProductResponse, RevenueRequest>({
      query: (data) => ({
        url: "/revenue/by-product",
        method: "POST",
        body: data,
      }),
      transformResponse: (response: { code: number; result: RevenueByProductResponse }) => 
        response.result,
      invalidatesTags: ["Revenue"],
    }),
    getRevenueByCategory: builder.mutation<RevenueByCategoryResponse, RevenueRequest>({
      query: (data) => ({
        url: "/revenue/by-category",
        method: "POST",
        body: data,
      }),
      transformResponse: (response: { code: number; result: RevenueByCategoryResponse }) => 
        response.result,
      invalidatesTags: ["Revenue"],
    }),
    getRevenueByYear: builder.query<RevenueResponse, number>({
      query: (year) => ({
        url: `/revenue/by-year?year=${year}`,
        method: "GET",
      }),
      transformResponse: (response: { code: number; result: RevenueResponse }) => 
        response.result,
      providesTags: ["Revenue"],
    }),
    getRevenueByMonth: builder.query<RevenueResponse, MonthFilterParams>({
      query: ({ year, month }) => ({
        url: `/revenue/by-month?year=${year}&month=${month}`,
        method: "GET",
      }),
      transformResponse: (response: { code: number; result: RevenueResponse }) => 
        response.result,
      providesTags: ["Revenue"],
    }),
  }),
});

export const {
  useGetRevenueByDateRangeMutation,
  useGetRevenueByProductMutation,
  useGetRevenueByCategoryMutation,
  useGetRevenueByYearQuery,
  useGetRevenueByMonthQuery,
} = revenueApi; 
