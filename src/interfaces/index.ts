export interface Category {
  id: string;
  name: string;
  imageUrl: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  description: string;
  quantity: number;
  soldQuantity: number;
  category: Category;
}

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export interface PaginationParams {
  pageNumber: number;
  pageSize: number;
}

export interface SearchByCriteriaParams extends PaginationParams {
  keyword?: string[];
  category?: string;
  sortBy?: string;
}

export interface ProductsResponse {
  code: number;
  result: {
    items: Product[];
    page?: number;
    pageNumber?: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  };
}

export interface CategoriesResponse {
  code: number;
  result: {
    items: Category[];
    page?: number;
    pageNumber?: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  };
}

export interface FilterOptions {
  type: string[];
  price: string;
  categories?: string[];
  keyword?: string;
  sortBy?: string;
}

export interface ProductFilterProps {
  onApplyFilters: (filters: FilterOptions) => void;
  onResetFilters: () => void;
  initialFilters?: FilterOptions;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface DecodedToken {
  sub: string;
  exp: number;
  iat: number;
  jti: string;
  scope: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  code: number;
  message: string;
  result: {
    accessToken: string;
    refreshToken: string;
  };
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  roles: string[];
}

export interface RegisterResponse {
  code: number;
  message: string;
  result: {
    firstName: string;
    lastName: string;
    email: string;
    roles: Array<{
      name: string;
      permissions: Array<{
        name: string;
      }>;
    }>;
  };
}

export interface RegisterCredentials {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword?: string;
  roles?: string[];
}