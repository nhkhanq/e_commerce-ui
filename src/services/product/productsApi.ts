import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  ProductsResponse,
  CategoriesResponse,
  PaginationParams,
  SearchByCriteriaParams,
  Product,
} from "@/types";
import { BASE_URL } from "@/lib/constants";

// Re-export Product for other modules if they import from this file
export type { Product } from "@/types";

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
    getCategories: builder.query<
      CategoriesResponse["result"],
      PaginationParams
    >({
      query: ({ pageNumber, pageSize }) => ({
        url: `/categories?pageNumber=${pageNumber}&pageSize=${pageSize}`,
      }),
      transformResponse: (response: CategoriesResponse) => response.result,
    }),
    searchByCriteria: builder.query<
      ProductsResponse["result"],
      SearchByCriteriaParams
    >({
      query: ({ keyword, category, sortBy, pageNumber, pageSize }) => {
        const queryParams = new URLSearchParams();

        if (keyword && keyword.length > 0) {
          keyword.forEach((kw) => queryParams.append("keyword", kw));
        }

        if (category) queryParams.append("category", category);
        if (sortBy) queryParams.append("sortBy", sortBy);
        queryParams.append("pageNumber", String(pageNumber || 1));
        queryParams.append("pageSize", String(pageSize || 10));

        return {
          url: `/products/search-by-criteria?${queryParams.toString()}`,
        };
      },
      transformResponse: (response: ProductsResponse) => response.result,
    }),
    getProductById: builder.query<Product, string>({
      query: (id) => ({
        url: `/products/${id}`,
      }),
      transformResponse: (response: { result: Product }) => response.result,
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetCategoriesQuery,
  useSearchByCriteriaQuery,
  useGetProductByIdQuery,
} = productsApi;
