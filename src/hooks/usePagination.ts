import { useState } from 'react';

export interface UsePaginationProps {
  initialPage?: number;
  initialPageSize?: number;
}

export interface UsePaginationResult {
  currentPage: number;
  pageSize: number;
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
  reset: () => void;
  paginationParams: {
    pageNumber: number;
    pageSize: number;
  };
}

/**
 * A hook to manage pagination state
 * 
 * @param initialPage - The initial page number (default: 1)
 * @param initialPageSize - The initial page size (default: 10)
 * @returns Pagination state and handlers
 */
export function usePagination({
  initialPage = 1,
  initialPageSize = 10,
}: UsePaginationProps = {}): UsePaginationResult {
  const [currentPage, setCurrentPage] = useState<number>(initialPage);
  const [pageSize, setPageSize] = useState<number>(initialPageSize);

  const setPage = (page: number) => {
    if (page < 1) {
      setCurrentPage(1);
      return;
    }
    setCurrentPage(page);
  };

  const reset = () => {
    setCurrentPage(initialPage);
    setPageSize(initialPageSize);
  };

  return {
    currentPage,
    pageSize,
    setPage,
    setPageSize,
    reset,
    paginationParams: {
      pageNumber: currentPage,
      pageSize,
    },
  };
}

export default usePagination; 
