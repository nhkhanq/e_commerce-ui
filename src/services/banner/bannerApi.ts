import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryPublic } from "../shared/baseQuery";
import { Banner, BannersResponse, PaginationParams } from "@/types";

export const bannerApi = createApi({
  reducerPath: "bannerApi",
  baseQuery: baseQueryPublic,
  tagTypes: ["Banner"],
  endpoints: (builder) => ({
    getBanners: builder.query<BannersResponse["result"], PaginationParams>({
      query: ({ pageNumber, pageSize }) => ({
        url: `/banners?pageNumber=${pageNumber}&pageSize=${pageSize}`,
      }),
      transformResponse: (response: BannersResponse) => response.result,
      providesTags: ["Banner"],
    }),
    getBannerById: builder.query<Banner, string>({
      query: (id) => ({
        url: `/banners/${id}`,
      }),
      transformResponse: (response: { result: Banner }) => response.result,
      providesTags: (_result, _error, id) => [{ type: "Banner", id }],
    }),
    createBanner: builder.mutation<Banner, FormData>({
      query: (formData) => ({
        url: `/banners`,
        method: "POST",
        body: formData,
      }),
      transformResponse: (response: { result: Banner }) => response.result,
      invalidatesTags: ["Banner"],
    }),
    updateBanner: builder.mutation<Banner, { id: string; formData: FormData }>({
      query: ({ id, formData }) => ({
        url: `/banners/${id}`,
        method: "PUT",
        body: formData,
      }),
      transformResponse: (response: { result: Banner }) => response.result,
      invalidatesTags: ["Banner"],
    }),
    deleteBanner: builder.mutation<void, string>({
      query: (id) => ({
        url: `/banners/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Banner"],
    }),
  }),
});

export const {
  useGetBannersQuery,
  useGetBannerByIdQuery,
  useCreateBannerMutation,
  useUpdateBannerMutation,
  useDeleteBannerMutation,
} = bannerApi; 