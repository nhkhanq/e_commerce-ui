export interface Banner {
  id: string;
  name: string;
  imageUrl: string;
}

export interface BannerRequest {
  name: string;
  fileImage?: File;
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

export interface BannersResponse {
  result: {
    items: Banner[];
    page: number;
    size: number;
    totalPages: number;
    totalItems: number;
  };
  isSuccess: boolean;
  message: string;
} 