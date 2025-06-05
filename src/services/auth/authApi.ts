import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "@/lib/constants";
import { LoginRequest, AuthResponse } from "@/types";
import {RegisterRequest, RegisterResponse} from '@/types'

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers, { endpoint }) => {
      if (endpoint !== 'login' && endpoint !== 'register') {
        // Only access localStorage in browser environment
        if (typeof window !== 'undefined') {
          const token = localStorage.getItem("accessToken");
          if (token) {
            headers.set("Authorization", `Bearer ${token}`);
          }
        }
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
        headers: { Authorization: '' },
      }),
    }),
    register: builder.mutation<RegisterResponse, RegisterRequest>({
      query: (userData) => ({
        url: "/auth/register",
        method: "POST",
        body: userData,
        headers: { Authorization: '' },
      }),
    }),
    logout: builder.mutation<void, void>({
      query: () => {
        // Only access localStorage in browser environment
        const refreshToken = typeof window !== 'undefined' 
          ? localStorage.getItem("refreshToken") 
          : null;
        return {
          url: "/auth/logout",
          method: "POST",
          body: { token: refreshToken },
        };
      },
    }),
    refreshToken: builder.mutation<AuthResponse, { refreshToken: string }>({
      query: (refreshData) => ({
        url: "/auth/refresh",
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
