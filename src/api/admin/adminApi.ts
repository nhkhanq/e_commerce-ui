import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "@/lib/constants";

export interface User {
  id: string; 
  firstName: string;
  lastName: string;
  email: string;
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
  }),
  tagTypes: ["User"],
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
  }),
});

export const { 
  useGetUsersQuery,
} = adminApi; 