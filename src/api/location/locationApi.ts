import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "@/lib/constants";

// Define interfaces inline for location data
export interface Province {
  id: number;
  name: string;
  slug?: string;
}

export interface District {
  id: number;
  name: string;
  province?: Province;
}

export interface Ward {
  id: number;
  name: string;
  district?: District;
}

export const locationApi = createApi({
  reducerPath: "locationApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers) => {
      headers.set("ngrok-skip-browser-warning", "true");
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getProvinces: builder.query<Province[], void>({
      query: () => "/address/province",
      transformResponse: (response: Province[]) => response,
    }),
    getDistrictsByProvinceId: builder.query<District[], number>({
      query: (provinceId) => `/address/district?provinceId=${provinceId}`,
      transformResponse: (response: District[]) => response,
    }),
    getWardsByDistrictId: builder.query<Ward[], number>({
      query: (districtId) => `/address/ward?districtId=${districtId}`,
      transformResponse: (response: Ward[]) => response,
    }),
  }),
});

export const {
  useGetProvincesQuery,
  useGetDistrictsByProvinceIdQuery,
  useGetWardsByDistrictIdQuery,
} = locationApi; 