import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { BASE_URL } from "@/lib/constants";
import { getAuthToken, getRefreshToken, setAuthTokens, clearAuthTokens, isCurrentTokenExpired } from "@/lib/auth-utils";
import { authApi } from "@/services/auth/authApi";
import { logger } from "@/lib/logger";

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

// Simple refresh mechanism - only for critical APIs that need fresh tokens
export const baseQueryWithTokenRefresh: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const baseQuery = fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers) => {
      headers.set("ngrok-skip-browser-warning", "true");
      
      const token = getAuthToken();
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      
      return headers;
    },
  });

  // Check if token is expired before making request
  if (isCurrentTokenExpired()) {
    const refreshToken = getRefreshToken();
    
    if (refreshToken) {
      try {
        logger.info("Token expired, attempting refresh...");
        
        const refreshResult = await api.dispatch(
          authApi.endpoints.refreshToken.initiate({ token: refreshToken })
        );
        
        if (refreshResult.data?.result?.accessToken) {
          const newAccessToken = refreshResult.data.result.accessToken;
          setAuthTokens(newAccessToken, refreshToken);
          logger.info("Token refreshed successfully");
        } else {
          throw new Error("Refresh failed");
        }
      } catch (error) {
        logger.error("Token refresh failed:", error);
        clearAuthTokens();
        
        // Only redirect if not already on login page
        if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
        
        return {
          error: {
            status: 401,
            statusText: 'Unauthorized',
            data: 'Token refresh failed'
          }
        };
      }
    } else {
      logger.warn("No refresh token available");
      clearAuthTokens();
      
      if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
      
      return {
        error: {
          status: 401,
          statusText: 'Unauthorized', 
          data: 'No refresh token'
        }
      };
    }
  }

  // Make the request with (potentially refreshed) token
  return baseQuery(args, api, extraOptions);
}; 