import { FC } from "react";
import { OrderItemRes } from "@/types/order";
import { formatPrice } from "@/lib/utils";
import { Package, ShoppingCart } from "lucide-react";

interface OrderItemListProps {
  orderItems: OrderItemRes[];
}

const OrderItemList: FC<OrderItemListProps> = ({ orderItems }) => {
  if (!orderItems || orderItems.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500 dark:text-gray-400">
        No items in this order
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
        <ShoppingCart className="h-4 w-4" />
        Order Items ({orderItems.length}{" "}
        {orderItems.length === 1 ? "item" : "items"})
      </div>

      {orderItems.map((item, index) => (
        <div
          key={`${item.productId}-${index}`}
          className="flex items-center justify-between p-3 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
              <Package className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                Product ID: {item.productId}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Quantity: {item.quantity} × {formatPrice(item.price)}
              </p>
            </div>
          </div>

          <div className="text-right">
            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              {formatPrice(item.totalMoney)}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Item Total
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrderItemList;
