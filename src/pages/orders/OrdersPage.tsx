import { FC } from "react";
import OrderList from "@/components/orders/OrderList";

const OrdersPage: FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Đơn hàng của tôi
      </h1>
      <OrderList />
    </div>
  );
};

export default OrdersPage;
