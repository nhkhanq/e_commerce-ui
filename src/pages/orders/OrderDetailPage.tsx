import { FC } from "react";
import { useParams } from "react-router-dom";
import OrderDetail from "@/components/orders/OrderDetail";

const OrderDetailPage: FC = () => {
  const { id } = useParams<{ id: string }>();

  if (!id) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 dark:text-gray-400">Order not found</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <OrderDetail orderId={id} />
    </div>
  );
};

export default OrderDetailPage;
