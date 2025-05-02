import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "@/lib/constants";
import { LoginRequest, AuthResponse } from "@/interfaces";

interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  roles: string[];
}

interface RegisterResponse {
  code: number;
  message: string;
  result: {
    firstName: string;
    lastName: string;
    email: string;
    roles: Array<{
      name: string;
      permissions: Array<{
        name: string;
      }>;
    }>;
  };
}

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({ 
    baseUrl: BASE_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("accessToken");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
    }),
    register: builder.mutation<RegisterResponse, RegisterRequest>({
      query: (userData) => ({
        url: "/auth/register",
        method: "POST",
        body: userData,
      }),
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
    }),
    refreshToken: builder.mutation<AuthResponse, { refreshToken: string }>({
      query: (refreshData) => ({
        url: "/auth/refresh-token",
        method: "POST",
        body: refreshData,
      }),
    }),
  }),
});

export const { 
  useLoginMutation, 
  useRegisterMutation, 
  useLogoutMutation, 
  useRefreshTokenMutation 
} = authApi;