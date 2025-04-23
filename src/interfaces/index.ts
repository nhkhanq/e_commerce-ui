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

export interface ProductsResponse {
  code: number;
  result: {
    items: Product[];
    pageNumber: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  };
}
