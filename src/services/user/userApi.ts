import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "@/lib/constants";
import { UserRes } from "@/types";

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers) => {
      // Only access localStorage in browser environment
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem("accessToken");
        if (token) {
          headers.set("Authorization", `Bearer ${token}`);
        }
      }
      headers.set("ngrok-skip-browser-warning", "true");
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getMyProfile: builder.query<UserRes, void>({
      query: () => ({
        url: `/users/me`,
        method: "GET",
      }),
    }),
  }),
});

export const { useGetMyProfileQuery } = userApi; 
