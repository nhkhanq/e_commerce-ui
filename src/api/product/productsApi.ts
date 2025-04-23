import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ProductsResponse, PaginationParams } from "@/interfaces";
import { BASE_URL } from "@/lib/constants";

export const productsApi = createApi({
  reducerPath: "productsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers) => {
      headers.set("ngrok-skip-browser-warning", "true");
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getProducts: builder.query<ProductsResponse["result"], PaginationParams>({
      query: ({ pageNumber, pageSize }) => ({
        url: `/products?pageNumber=${pageNumber}&pageSize=${pageSize}`,
      }),
      transformResponse: (response: ProductsResponse) => response.result,
    }),
  }),
});

export const { useGetProductsQuery } = productsApi;
