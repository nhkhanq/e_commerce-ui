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
