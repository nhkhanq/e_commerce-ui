import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryConditional } from "../shared/baseQuery";
import * as storage from "@/lib/storage";
import { LoginRequest, AuthResponse } from "@/types";
import {RegisterRequest, RegisterResponse} from '@/types'

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: baseQueryConditional(['login', 'register']),
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
          ? storage.getItem("refreshToken") 
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
