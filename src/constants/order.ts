// Order Status Constants
export const ORDER_STATUS = {
  PENDING: 'PENDING',
  PAID: 'PAID', 
  CANCELED: 'CANCELED',
  DELIVERING: 'DELIVERING',
  SHIPPED: 'SHIPPED',
} as const;

export type OrderStatus = typeof ORDER_STATUS[keyof typeof ORDER_STATUS];

// Order Status Options for UI
export const ORDER_STATUS_OPTIONS = [
  { value: ORDER_STATUS.PENDING, label: "Pending" },
  { value: ORDER_STATUS.PAID, label: "Paid" },
  { value: ORDER_STATUS.CANCELED, label: "Canceled" },
  { value: ORDER_STATUS.DELIVERING, label: "Delivering" },
  { value: ORDER_STATUS.SHIPPED, label: "Shipped" },
];

// Payment Method Constants
export const PAYMENT_METHOD = {
  CASH: 'CASH',
  VN_PAY: 'VN_PAY',
  PAYPAL: 'PAYPAL',
} as const;

export type PaymentMethod = typeof PAYMENT_METHOD[keyof typeof PAYMENT_METHOD];

// Payment Method Display Names
export const PAYMENT_METHODS = {
  [PAYMENT_METHOD.CASH]: "Cash",
  [PAYMENT_METHOD.VN_PAY]: "VN Pay", 
  [PAYMENT_METHOD.PAYPAL]: "PayPal",
};

// Badge Variants for Order Status
export const ORDER_STATUS_BADGE_VARIANTS = {
  [ORDER_STATUS.PENDING]: "secondary",
  [ORDER_STATUS.PAID]: "default",
  [ORDER_STATUS.CANCELED]: "destructive", 
  [ORDER_STATUS.DELIVERING]: "outline",
  [ORDER_STATUS.SHIPPED]: "default",
} as const; 