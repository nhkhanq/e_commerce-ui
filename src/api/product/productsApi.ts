import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Product } from "@/interfaces";
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
    getProducts: builder.query<Product[], void>({
      query: () => ({
        url: "/products?pageNumber=1&pageSize=10",
      }),
      transformResponse: (response: {
        code: number;
        result: { items: Product[] };
      }) => response.result.items,
    }),
  }),
});

export const { useGetProductsQuery } = productsApi;
