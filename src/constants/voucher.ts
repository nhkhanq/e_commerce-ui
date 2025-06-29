export const DISCOUNT_TYPE = {
  FIXED: 'FIXED',
  PERCENT: 'PERCENT',
} as const;

export type DiscountType = typeof DISCOUNT_TYPE[keyof typeof DISCOUNT_TYPE];

export const DISCOUNT_TYPE_OPTIONS = [
  { value: DISCOUNT_TYPE.FIXED, label: "Fixed Amount" },
  { value: DISCOUNT_TYPE.PERCENT, label: "Percentage" },
];

export const VOUCHER_VALIDATION = {
  MAX_PERCENT_DISCOUNT: 100,
  MIN_DISCOUNT_VALUE: 0,
  DEFAULT_EXPIRY_DAYS: 30,
} as const;

export const DATE_FORMAT = {
  BACKEND: "dd-MM-yyyy HH:mm:ss",
  FORM_INPUT: "yyyy-MM-dd'T'HH:mm",
  DISPLAY: "MMM dd, yyyy",
} as const; 