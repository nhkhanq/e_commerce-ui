import { FC } from "react";
import { useGetMyOrdersQuery } from "@/api/orders/ordersApi";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

const OrderList: FC = () => {
  const { data: ordersData, isLoading } = useGetMyOrdersQuery({
    pageNumber: 1,
    pageSize: 10,
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array(3)
          .fill(0)
          .map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-4 w-1/4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-1/2" />
              </CardContent>
            </Card>
          ))}
      </div>
    );
  }

  if (!ordersData?.items.length) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <p className="text-muted-foreground">Bạn chưa có đơn hàng nào</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {ordersData.items.map((order) => (
        <Link key={order.id} to={`/orders/${order.id}`}>
          <Card className="hover:bg-accent/50 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Đơn hàng #{order.id}
              </CardTitle>
              <Badge
                variant={
                  order.status === "PENDING"
                    ? "default"
                    : order.status === "PAID"
                    ? "default"
                    : order.status === "CANCELED"
                    ? "destructive"
                    : order.status === "DELIVERING"
                    ? "default"
                    : "secondary"
                }
              >
                {order.status === "PENDING"
                  ? "Chờ thanh toán"
                  : order.status === "PAID"
                  ? "Đã thanh toán"
                  : order.status === "CANCELED"
                  ? "Đã hủy"
                  : order.status === "DELIVERING"
                  ? "Đang giao hàng"
                  : "Đã giao hàng"}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <p className="text-sm text-muted-foreground">
                  {format(new Date(order.createdAt), "dd/MM/yyyy HH:mm")}
                </p>
                <p className="text-sm font-medium">
                  {order.totalMoney.toLocaleString("vi-VN")}đ
                </p>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
};

export default OrderList;
