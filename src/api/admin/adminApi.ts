import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "@/lib/constants";
import { Product, Category } from "@/interfaces";

export interface User {
  id: string; 
  firstName: string;
  lastName: string;
  email: string;
}

export interface ProductRequest {
  name: string;
  price: number;
  fileImage: File | null;
  description: string;
  quantity: number;
  categoryId: string;
}

export interface CategoryRequest {
  name: string;
  fileImage: File | null;
}

export interface PaginatedResponse<T> {
  items: T[];
  page: number;
  size: number;
  totalPages: number;
  totalItems: number;
}

// Generic API Response structure from OpenAPI (e.g., APIResponsePageDtoUserRes)
interface ApiResponse<TData> {
  code: number;
  message: string;
  result: TData; 
}

export const adminApi = createApi({
  reducerPath: "adminApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      // Add headers like authorization token if needed
      headers.set("ngrok-skip-browser-warning", "true");
      
      const token = localStorage.getItem("accessToken");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      
      return headers;
    },
  }),
  tagTypes: ["User", "Product", "Category"],
  endpoints: (builder) => ({
    getUsers: builder.query<PaginatedResponse<User>, { pageNumber?: number; pageSize?: number }>({
      query: ({ pageNumber = 1, pageSize = 10 }) => 
        `users?pageNumber=${pageNumber}&pageSize=${pageSize}`,
      transformResponse: (response: ApiResponse<PaginatedResponse<User>>) => {
        if (response.result && typeof response.result.totalItems === 'number') {
          return response.result;
        }
        console.warn("Unexpected response structure for getUsers:", response);
        return { items: [], page: 1, size: 0, totalPages: 0, totalItems: 0 };
      },
      providesTags: (result) =>
        result && result.items
          ? [
              ...result.items.map(({ id }) => ({ type: "User" as const, id })),
              { type: "User", id: "LIST" },
            ]
          : [{ type: "User", id: "LIST" }],
    }),
    
    // Product Management Endpoints
    getAdminProducts: builder.query<PaginatedResponse<Product>, { pageNumber?: number; pageSize?: number }>({
      query: ({ pageNumber = 1, pageSize = 10 }) => 
        `products?pageNumber=${pageNumber}&pageSize=${pageSize}`,
      transformResponse: (response: ApiResponse<PaginatedResponse<Product>>) => {
        if (response.result) {
          return response.result;
        }
        return { items: [], page: 1, size: 0, totalPages: 0, totalItems: 0 };
      },
      providesTags: (result) =>
        result && result.items
          ? [
              ...result.items.map(({ id }) => ({ type: "Product" as const, id })),
              { type: "Product", id: "LIST" },
            ]
          : [{ type: "Product", id: "LIST" }],
    }),
    
    getAdminProductById: builder.query<Product, string>({
      query: (id) => `products/${id}`,
      transformResponse: (response: ApiResponse<Product>) => response.result,
      providesTags: (result, error, id) => [{ type: "Product", id }],
    }),
    
    createProduct: builder.mutation<Product, FormData>({
      query: (data) => ({
        url: 'products',
        method: 'POST',
        body: data,
      }),
      transformResponse: (response: ApiResponse<Product>) => response.result,
      invalidatesTags: [{ type: 'Product', id: 'LIST' }],
    }),
    
    updateProduct: builder.mutation<Product, { id: string; data: FormData }>({
      query: ({ id, data }) => ({
        url: `products/${id}`,
        method: 'PUT',
        body: data,
      }),
      transformResponse: (response: ApiResponse<Product>) => response.result,
      invalidatesTags: (result, error, { id }) => [
        { type: 'Product', id },
        { type: 'Product', id: 'LIST' }
      ],
    }),
    
    deleteProduct: builder.mutation<void, string>({
      query: (id) => ({
        url: `products/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Product', id: 'LIST' }],
    }),
    
    // Category Management Endpoints
    getAdminCategories: builder.query<PaginatedResponse<Category>, { pageNumber?: number; pageSize?: number }>({
      query: ({ pageNumber = 1, pageSize = 10 }) => 
        `categories?pageNumber=${pageNumber}&pageSize=${pageSize}`,
      transformResponse: (response: ApiResponse<PaginatedResponse<Category>>) => {
        if (response.result) {
          return response.result;
        }
        return { items: [], page: 1, size: 0, totalPages: 0, totalItems: 0 };
      },
      providesTags: (result) =>
        result && result.items
          ? [
              ...result.items.map(({ id }) => ({ type: "Category" as const, id })),
              { type: "Category", id: "LIST" },
            ]
          : [{ type: "Category", id: "LIST" }],
    }),
    
    getCategoryById: builder.query<Category, string>({
      query: (id) => `categories/${id}`,
      transformResponse: (response: ApiResponse<Category>) => response.result,
      providesTags: (result, error, id) => [{ type: "Category", id }],
    }),
    
    createCategory: builder.mutation<Category, FormData>({
      query: (data) => ({
        url: 'categories',
        method: 'POST',
        body: data,
      }),
      transformResponse: (response: ApiResponse<Category>) => response.result,
      invalidatesTags: [{ type: 'Category', id: 'LIST' }],
    }),
    
    updateCategory: builder.mutation<Category, { id: string; data: FormData }>({
      query: ({ id, data }) => ({
        url: `categories/${id}`,
        method: 'PUT',
        body: data,
      }),
      transformResponse: (response: ApiResponse<Category>) => response.result,
      invalidatesTags: (result, error, { id }) => [
        { type: 'Category', id },
        { type: 'Category', id: 'LIST' }
      ],
    }),
  }),
});

export const { 
  useGetUsersQuery,
  // Product exports
  useGetAdminProductsQuery,
  useGetAdminProductByIdQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  // Category exports
  useGetAdminCategoriesQuery,
  useGetCategoryByIdQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
} = adminApi; 