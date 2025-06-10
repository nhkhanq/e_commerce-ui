import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "@/lib/constants";
import { getAuthToken } from "@/lib/auth-utils";

export const createBaseQuery = (options: { 
  requireAuth?: boolean;
  publicEndpoints?: string[];
} = {}) => {
  const { requireAuth = true, publicEndpoints = [] } = options;
  
  return fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers, { endpoint }) => {
      headers.set("ngrok-skip-browser-warning", "true");
      
      const shouldSkipAuth = publicEndpoints.includes(endpoint as string);
      
      if (requireAuth && !shouldSkipAuth) {
        const token = getAuthToken();
        if (token) {
          headers.set("Authorization", `Bearer ${token}`);
        }
      }
      
      return headers;
    },
  });
};

export const baseQueryWithAuth = createBaseQuery({ requireAuth: true });
export const baseQueryPublic = createBaseQuery({ requireAuth: false });
export const baseQueryConditional = (publicEndpoints: string[]) => 
  createBaseQuery({ requireAuth: true, publicEndpoints });

export const createBaseQueryWithCustomHeaders = (customHeaders: Record<string, string> = {}) => {
  return fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers) => {
      headers.set("ngrok-skip-browser-warning", "true");
      
      const token = getAuthToken();
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      
      Object.entries(customHeaders).forEach(([key, value]) => {
        headers.set(key, value);
      });
      
      return headers;
    },
  });
}; 