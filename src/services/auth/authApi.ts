import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryConditional } from "../shared/baseQuery";
import * as storage from "@/lib/storage";
import { LoginRequest, AuthResponse, RefreshTokenResponse } from "@/types";
import {RegisterRequest, RegisterResponse, UserRes} from '@/types'

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
        
        // If no refreshToken, still make the call but with empty body
        return {
          url: "/auth/logout",
          method: "POST",
          body: refreshToken ? { token: refreshToken } : {},
        };
      },
    }),
    refreshToken: builder.mutation<RefreshTokenResponse, { token: string }>({
      query: (refreshData) => ({
        url: "/auth/refresh",
        method: "POST",
        body: refreshData,
      }),
    }),
    reactivateUser: builder.mutation<{ code: number; message: string; result: object }, string>({
      query: (userId) => ({
        url: `/auth/reactivate/${userId}`,
        method: "POST",
      }),
    }),
    getCurrentUser: builder.query<UserRes['result'], void>({
      query: () => ({
        url: "/users/me",
        method: "GET",
      }),
      transformResponse: (response: UserRes) => response.result,
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useRefreshTokenMutation,
  useReactivateUserMutation,
  useGetCurrentUserQuery
} = authApi;
