import { PaginatedResponse } from '../common';

export interface Category {
  id: string;
  name: string;
  imageUrl: string;
  description?: string;
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

export interface SearchByCriteriaParams {
  pageNumber: number;
  pageSize: number;
  keyword?: string[];
  category?: string;
  sortBy?: string;
}

export interface ProductsResponse {
  code: number;
  result: PaginatedResponse<Product>;
}

export interface CategoriesResponse {
  code: number;
  result: PaginatedResponse<Category>;
} 
