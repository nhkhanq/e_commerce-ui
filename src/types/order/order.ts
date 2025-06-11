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

export interface OrderItemReq {
  productId: string;
  quantity: number;
}

export interface OrderReq {
  id?: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  note: string;
  voucherCode: string;
  paymentMethod: "CASH" | "VN_PAY";
  orderItems: OrderItemReq[];
  returnUrl?: string;
}

export interface OrderItemRes {
  productId: string;
  imageUrl: string;
  price: number;
  quantity: number;
  totalMoney: number;
}

export interface OrderRes {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  note: string;
  totalMoney: number;
  status: "PENDING" | "PAID" | "CANCELED" | "DELIVERING" | "SHIPPED";
  paymentMethod: "CASH" | "VN_PAY" | "PAYPAL";
  orderItems: OrderItemRes[];
  paymentUrl?: string;
}

export interface OrderApiResponse {
  code: number;
  message: string;
  result: OrderRes;
} 
