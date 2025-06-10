import * as storage from './storage';
import { decodeJWT } from './utils';

export const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return storage.getItem('accessToken');
};

export const getRefreshToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return storage.getItem('refreshToken');
};

export const setAuthTokens = (accessToken: string, refreshToken: string): void => {
  storage.setItem('accessToken', accessToken);
  storage.setItem('refreshToken', refreshToken);
};

export const clearAuthTokens = (): void => {
  storage.removeItem('accessToken');
  storage.removeItem('refreshToken');
};

export const isAuthenticated = (): boolean => {
  const token = getAuthToken();
  if (!token) return false;
  
  try {
    const decoded = decodeJWT(token);
    const now = Date.now() / 1000;
    return decoded.exp > now;
  } catch {
    return false;
  }
};

export const getUserPermissions = (): string[] => {
  const token = getAuthToken();
  if (!token) return [];
  
  try {
    const decoded = decodeJWT(token);
    return decoded.scope.split(' ');
  } catch {
    return [];
  }
};

export const hasPermission = (permission: string): boolean => {
  const permissions = getUserPermissions();
  return permissions.includes(permission);
}; 