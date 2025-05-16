/**
 * Định nghĩa các interface cho dữ liệu địa điểm (location) và tích hợp với API
 */

// Lưu ý: các interface Province, District, Ward sẽ được xác định bởi locationApi.ts 

/**
 * Thông tin về tỉnh/thành phố
 * @example
 * {
 *   id: 1,
 *   name: "Hà Nội",
 *   slug: "ha-noi"
 * }
 */
export interface Province {
  id: number;
  name: string;
  slug?: string;
}

/**
 * Thông tin về quận/huyện
 * @example
 * {
 *   id: 1,
 *   name: "Ba Đình",
 *   province: { id: 1, name: "Hà Nội" }
 * }
 */
export interface District {
  id: number;
  name: string;
  province?: Province;
}

/**
 * Thông tin về phường/xã
 * @example
 * {
 *   id: 1,
 *   name: "Phúc Xá",
 *   district: { id: 1, name: "Ba Đình" }
 * }
 */
export interface Ward {
  id: number;
  name: string;
  district?: District;
}

/**
 * Thông tin đầy đủ về địa chỉ, bao gồm cả thành phần chi tiết
 * @example
 * {
 *   provinceId: 1,
 *   districtId: 1,
 *   wardId: 1,
 *   streetAddress: "123 Đường ABC",
 *   fullAddress: "123 Đường ABC, Phúc Xá, Ba Đình, Hà Nội"
 * }
 */
export interface Address {
  provinceId: number;
  districtId: number;
  wardId: number;
  streetAddress: string;
  fullAddress: string;
}

/**
 * Event được emit khi người dùng thay đổi địa chỉ
 * Sử dụng trong component AddressSelector
 * @example
 * {
 *   provinceId: 1,
 *   districtId: 1,
 *   wardId: 1,
 *   fullAddress: "Phúc Xá, Ba Đình, Hà Nội"
 * }
 */
export interface AddressChangeEvent {
  provinceId: number;
  districtId: number;
  wardId: number;
  fullAddress: string;
}

/**
 * Cấu trúc response API cho các API liên quan đến location
 */
export interface LocationApiResponse<T> {
  code: number;
  message: string;
  result: T;
} 