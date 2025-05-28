// Revenue API Request interface
export interface RevenueRequest {
  startDate: string; // Format: dd-MM-yyyy HH:mm:ss
  endDate?: string;  // Format: dd-MM-yyyy HH:mm:ss
}

// Main revenue response (just total revenue)
export interface RevenueResponse {
  revenue: number;
}

// Product/Category revenue response - array format [name, revenue]
export type RevenueByProductResponse = Array<[string, number]>;
export type RevenueByCategoryResponse = Array<[string, number]>;

// Year/Month filter params
export interface YearFilterParams {
  year: number;
}

export interface MonthFilterParams {
  year: number;
  month: number;
}

// Transformed data interfaces for frontend use
export interface TransformedRevenueItem {
  name: string;
  revenue: number;
  quantity?: number; // Optional since API doesn't provide this
}

export interface RevenueTableItem {
  id: string;
  name: string;
  revenue: number;
  quantity?: number; // Optional since API doesn't provide this
  type: "product" | "category";
} 