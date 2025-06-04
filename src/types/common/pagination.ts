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

export interface BaseResponse<T> {
  code: number;
  message: string;
  result: T;
}

export interface PaginatedResponse<T> {
  items: T[];
  page?: number;
  pageNumber?: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
} 
