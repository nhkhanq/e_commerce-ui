export interface Permission {
  name: string;
}

export interface Role {
  name: string;
  permissions: Permission[];
}

export interface User {
  firstName: string;
  lastName: string;
  email: string;
  roles: Role[];
}

export interface UpdateUserInfoRequest {
  firstName: string;
  lastName: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface APIResponse<T> {
  code: number;
  message: string;
  result: T;
}

export interface PageDto<T> {
  items: T[];
  page: number;
  size: number;
  totalPages: number;
  totalItems: number;
} 