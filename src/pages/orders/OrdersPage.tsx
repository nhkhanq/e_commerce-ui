import { FC } from "react";
import OrderList from "@/components/orders/OrderList";

const OrdersPage: FC = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Header Section */}
      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">
                My Orders
              </h1>
            </div>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Track and manage your order history
            </p>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <OrderList />
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;
