import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import * as storage from "./storage";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(price);
};

// Alias for formatPrice to maintain backward compatibility
export const formatCurrency = formatPrice;

export const calculateOriginalPrice = (price: number): number => {
  return price + 20000;
};

interface DecodedToken {
  sub: string;
  exp: number;
  iat: number;
  jti: string;
  scope: string;
}

export const isAuthenticated = (): boolean => {
  // Check if we're in browser environment
  if (!storage.isClient()) return false;
  
  const token = storage.getItem('accessToken');
  
  if (!token) {
    return false;
  }
  
  try {
    const decoded = decodeJWT(token);
    const currentTime = Date.now() / 1000;
    
    return decoded.exp > currentTime;
  } catch (error) {
    return false;
  }
};

export const getUserPermissions = (): string[] => {
  // Check if we're in browser environment
  if (!storage.isClient()) return [];
  
  const token = storage.getItem('accessToken');
  
  if (!token) {
    return [];
  }
  
  try {
    const decoded = decodeJWT(token);
    return decoded.scope.split(' ');
  } catch (error) {
    return [];
  }
};

export const logout = (): void => {
  // Check if we're in browser environment
  if (!storage.isClient()) return;
  
  storage.removeItem('accessToken');
  storage.removeItem('refreshToken');
  storage.removeItem('user');
};

export const getUser = () => {
  // Check if we're in browser environment
  if (!storage.isClient()) return null;
  
  const userJson = storage.getItem('user');
  if (userJson) {
    return JSON.parse(userJson);
  }
  return null;
};

export const decodeJWT = (token: string): DecodedToken => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error decoding token:', error);
      return {
        sub: '',
        exp: 0,
        iat: 0,
        jti: '',
        scope: '',
      };
    }
  };
