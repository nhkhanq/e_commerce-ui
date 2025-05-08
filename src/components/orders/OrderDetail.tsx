import { FC } from "react";
import {
  useGetOrderByIdQuery,
  useCancelOrderMutation,
} from "@/api/orders/ordersApi";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

interface OrderDetailProps {
  orderId: string;
}

const OrderDetail: FC<OrderDetailProps> = ({ orderId }) => {
  const navigate = useNavigate();
  const { data: order, isLoading } = useGetOrderByIdQuery(orderId);
  const [cancelOrder] = useCancelOrderMutation();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-4 w-1/4" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-4 w-1/2 mb-4" />
          <Skeleton className="h-4 w-3/4" />
        </CardContent>
      </Card>
    );
  }

  if (!order) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <p className="text-muted-foreground">Không tìm thấy đơn hàng</p>
        </CardContent>
      </Card>
    );
  }

  const handleCancelOrder = async () => {
    try {
      await cancelOrder(orderId).unwrap();
      toast.success("Hủy đơn hàng thành công");
      navigate("/orders");
    } catch (error) {
      toast.error("Không thể hủy đơn hàng");
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Đơn hàng #{order.id}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {format(new Date(order.createdAt), "dd/MM/yyyy HH:mm")}
            </p>
          </div>
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
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium mb-2">Thông tin giao hàng</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>Họ tên: {order.fullName}</p>
              <p>Email: {order.email}</p>
              <p>Số điện thoại: {order.phone}</p>
              <p>Địa chỉ: {order.address}</p>
              {order.note && <p>Ghi chú: {order.note}</p>}
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-2">Thông tin thanh toán</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>
                Phương thức:{" "}
                {order.paymentMethod === "CASH"
                  ? "Tiền mặt"
                  : order.paymentMethod === "VN_PAY"
                  ? "VNPay"
                  : "PayPal"}
              </p>
              <p className="font-medium text-foreground">
                Tổng tiền: {order.totalMoney.toLocaleString("vi-VN")}đ
              </p>
            </div>
          </div>
        </div>

        {order.status === "PENDING" && (
          <>
            <Separator className="my-6" />
            <div className="flex justify-end">
              <Button variant="destructive" onClick={handleCancelOrder}>
                Hủy đơn hàng
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default OrderDetail;
