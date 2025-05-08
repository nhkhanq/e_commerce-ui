export interface OrderItem {
  productId: string;
  quantity: number;
}

export interface OrderRequest {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  note?: string;
  voucherCode?: string;
  paymentMethod: 'CASH' | 'VN_PAY' | 'PAYPAL';
  orderItems: OrderItem[];
}

export interface OrderResponse {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  note?: string;
  totalMoney: number;
  status: 'PENDING' | 'PAID' | 'CANCELED' | 'DELIVERING' | 'SHIPPED';
  paymentMethod: 'CASH' | 'VN_PAY' | 'PAYPAL';
  createdAt: string;
  updatedAt: string;
}

export interface OrdersResponse {
  items: OrderResponse[];
  page: number;
  size: number;
  totalPages: number;
  totalItems: number;
}

export interface PaginationParams {
  pageNumber: number;
  pageSize: number;
} 