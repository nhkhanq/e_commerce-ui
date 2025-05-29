import { FC, useState } from "react";
import {
  useGetOrderByIdQuery,
  useCancelOrderMutation,
} from "@/api/orders/ordersApi";
import { format, isValid } from "date-fns";
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
  const [isCancelling, setIsCancelling] = useState(false);
  const { data: order, isLoading } = useGetOrderByIdQuery(orderId, {
    skip: isCancelling, // Skip refetching if we're in the process of cancelling
  });
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
          <p className="text-muted-foreground">Order not found</p>
        </CardContent>
      </Card>
    );
  }

  // Helper function to create a user-friendly order ID
  const formatOrderId = (id: string) => {
    // Extract last 6 characters for a shorter identifier
    const shortId = id.slice(-6).toUpperCase();
    return `#${shortId}`;
  };

  const handleCancelOrder = async () => {
    try {
      setIsCancelling(true); // Set cancelling state to true to prevent refetching
      await cancelOrder(orderId).unwrap();
      toast.success("Order cancelled successfully");
      // Add a small delay before navigation to ensure the cancellation is complete
      setTimeout(() => {
        navigate("/orders");
      }, 100);
    } catch (error) {
      setIsCancelling(false); // Reset if there's an error
      toast.error("Unable to cancel order");
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Order {formatOrderId(order.id)}</CardTitle>
            {order.createdAt && isValid(new Date(order.createdAt)) && (
              <p className="text-sm text-muted-foreground mt-1">
                {format(new Date(order.createdAt), "MM/dd/yyyy HH:mm")}
              </p>
            )}
            <p className="text-xs text-muted-foreground mt-1 opacity-70">
              Reference ID: {order.id}
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
              ? "Pending"
              : order.status === "PAID"
              ? "Paid"
              : order.status === "CANCELED"
              ? "Canceled"
              : order.status === "DELIVERING"
              ? "Delivering"
              : "Shipped"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium mb-2">Shipping Information</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>Name: {order.fullName}</p>
              <p>Email: {order.email}</p>
              <p>Phone: {order.phone}</p>
              <p>Address: {order.address}</p>
              {order.note && <p>Note: {order.note}</p>}
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-2">Payment Information</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>
                Method:{" "}
                {order.paymentMethod === "CASH"
                  ? "Cash"
                  : order.paymentMethod === "VN_PAY"
                  ? "VNPay"
                  : "PayPal"}
              </p>
              <p className="font-medium text-foreground">
                Total: ${order.totalMoney.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {order.status === "PENDING" && !isCancelling && (
          <>
            <Separator className="my-6" />
            <div className="flex justify-end">
              <Button
                variant="destructive"
                onClick={handleCancelOrder}
                disabled={isCancelling}
              >
                Cancel Order
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default OrderDetail;
