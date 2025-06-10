import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryConditional } from "../shared/baseQuery";
import { Product, Category } from "@/types";

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  active: boolean;
  roles: Role[];
}

export interface Permission {
  name: string;
}

export interface Role {
  name: string;
  permissions: Permission[];
}

export interface Voucher {
  id: string;
  code: string;
  discountType: 'FIXED' | 'PERCENT';
  discountValue: number;
  expirationDate: string;
  status: 'ACTIVE' | 'EXPIRED' | 'USED';
  usedCount: number;
}

export interface VoucherRequest {
  code: string;
  discountType: 'FIXED' | 'PERCENT';
  discountValue: number;
  expirationDate: string;
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
  description?: string;
  fileImage: File | null;
}

export interface PermissionRequest {
  name: string;
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
  baseQuery: baseQueryConditional(['getUsers', 'getProducts', 'getCategories']),
  tagTypes: ["User", "Product", "Category", "Voucher", "Permission", "Role"],
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
    
    getUserById: builder.query<User, string>({
      query: (id) => `users/${id}`,
      transformResponse: (response: ApiResponse<User>) => response.result,
      providesTags: (_, __, id) => [{ type: "User", id }],
    }),
    
    // Voucher Management Endpoints
    getVouchers: builder.query<PaginatedResponse<Voucher>, { pageNumber?: number; pageSize?: number }>({
      query: ({ pageNumber = 1, pageSize = 10 }) => 
        `vouchers?pageNumber=${pageNumber}&pageSize=${pageSize}`,
      transformResponse: (response: ApiResponse<PaginatedResponse<Voucher>>) => {
        if (response.result) {
          return response.result;
        }
        return { items: [], page: 1, size: 0, totalPages: 0, totalItems: 0 };
      },
      providesTags: (result) =>
        result && result.items
          ? [
              ...result.items.map(({ id }) => ({ type: "Voucher" as const, id })),
              { type: "Voucher", id: "LIST" },
            ]
          : [{ type: "Voucher", id: "LIST" }],
    }),
    
    getVoucherByCode: builder.query<Voucher, string>({
      query: (code) => `vouchers/${code}`,
      transformResponse: (response: ApiResponse<Voucher>) => response.result,
      providesTags: (_, __, code) => [{ type: "Voucher", id: code }],
    }),
    
    createVoucher: builder.mutation<Voucher, VoucherRequest>({
      query: (data) => ({
        url: 'vouchers',
        method: 'POST',
        body: data,
      }),
      transformResponse: (response: ApiResponse<Voucher>) => response.result,
      invalidatesTags: [{ type: 'Voucher', id: 'LIST' }],
    }),
    
    updateVoucher: builder.mutation<Voucher, { code: string; data: VoucherRequest }>({
      query: ({ code, data }) => ({
        url: `vouchers/${code}`,
        method: 'PUT',
        body: data,
      }),
      transformResponse: (response: ApiResponse<Voucher>) => response.result,
      invalidatesTags: (_, __, { code }) => [
        { type: 'Voucher', id: code },
        { type: 'Voucher', id: 'LIST' }
      ],
    }),
    
    deleteVoucher: builder.mutation<void, string>({
      query: (code) => ({
        url: `vouchers/${code}`,
        method: 'DELETE',
        responseHandler: async (response) => {
          if (!response.ok) {
            // Log the actual error from the server
            const errorData = await response.json();
            console.error('Delete voucher error response:', errorData);
            return Promise.reject(errorData);
          }
          return response.json();
        },
        // Add proper error handling
        validateStatus: (response) => {
          return response.status >= 200 && response.status < 300;
        },
      }),
      // Use both code and id to invalidate cache properly
      invalidatesTags: (_, __, code) => [
        { type: 'Voucher', id: 'LIST' },
        { type: 'Voucher', id: code }
      ],
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
      providesTags: (_, __, id) => [{ type: "Product", id }],
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
      invalidatesTags: (_, __, { id }) => [
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
      providesTags: (_, __, id) => [{ type: "Category", id }],
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
      invalidatesTags: (_, __, { id }) => [
        { type: 'Category', id },
        { type: 'Category', id: 'LIST' }
      ],
    }),

    deleteCategory: builder.mutation<void, string>({
      query: (id) => ({
        url: `categories/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Category', id: 'LIST' }],
    }),

    // Permission Management Endpoints
    getPermissions: builder.query<Permission[], void>({
      query: () => 'permissions',
      transformResponse: (response: ApiResponse<Permission[]>) => {
        if (response.result) {
          return response.result;
        }
        return [];
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map((permission) => ({ 
                type: "Permission" as const, 
                id: permission.name 
              })),
              { type: "Permission", id: "LIST" },
            ]
          : [{ type: "Permission", id: "LIST" }],
    }),

    createPermission: builder.mutation<Permission, PermissionRequest>({
      query: (data) => ({
        url: 'permissions',
        method: 'POST',
        body: data,
      }),
      transformResponse: (response: ApiResponse<Permission>) => response.result,
      invalidatesTags: [{ type: 'Permission', id: 'LIST' }],
    }),

    deletePermission: builder.mutation<void, string>({
      query: (permissionName) => ({
        url: `permissions/${permissionName}`,
        method: 'DELETE',
        responseHandler: async (response) => {
          if (!response.ok) {
            const errorData = await response.json();
            console.error('Delete permission error response:', errorData);
            return Promise.reject(errorData);
          }
          return response.json();
        },
        validateStatus: (response) => {
          return response.status >= 200 && response.status < 300;
        },
      }),
      invalidatesTags: (_, __, permissionName) => [
        { type: 'Permission', id: 'LIST' },
        { type: 'Permission', id: permissionName }
      ],
    }),

    // Role Management Endpoints
    getRoles: builder.query<Role[], void>({
      query: () => 'roles',
      transformResponse: (response: ApiResponse<Role[]>) => {
        if (response.result) {
          return response.result;
        }
        return [];
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map((role) => ({ 
                type: "Role" as const, 
                id: role.name 
              })),
              { type: "Role", id: "LIST" },
            ]
          : [{ type: "Role", id: "LIST" }],
    }),
  }),
});

export const { 
  useGetUsersQuery,
  useGetUserByIdQuery,
  // Voucher exports
  useGetVouchersQuery,
  useGetVoucherByCodeQuery,
  useCreateVoucherMutation,
  useUpdateVoucherMutation,
  useDeleteVoucherMutation,
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
  useDeleteCategoryMutation,
  // Permission exports
  useGetPermissionsQuery,
  useCreatePermissionMutation,
  useDeletePermissionMutation,
  // Role exports
  useGetRolesQuery,
} = adminApi; 
