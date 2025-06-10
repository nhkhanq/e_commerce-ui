import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "../shared/baseQuery";
import { UserRes } from "@/types";
import type { User, UpdateUserInfoRequest, ChangePasswordRequest, APIResponse } from "@/types/user";

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: baseQueryWithAuth,
  tagTypes: ["User"],
  endpoints: (builder) => ({
    getMyProfile: builder.query<UserRes, void>({
      query: () => ({
        url: `/users/me`,
        method: "GET",
      }),
      providesTags: ["User"],
    }),

    // Update user information
    updateUserInfo: builder.mutation<APIResponse<User>, UpdateUserInfoRequest>({
      query: (body) => ({
        url: `/users/update-info`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["User"],
    }),

    // Change password
    changePassword: builder.mutation<APIResponse<void>, ChangePasswordRequest>({
      query: (body) => ({
        url: `/users/change-password`,
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { 
  useGetMyProfileQuery,
  useUpdateUserInfoMutation,
  useChangePasswordMutation,
} = userApi; 
