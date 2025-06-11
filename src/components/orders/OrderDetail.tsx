import { FC, useState } from "react";
import {
  useGetOrderByIdQuery,
  useCancelOrderMutation,
} from "@/services/orders/ordersApi";
import { useGetProductByIdQuery } from "@/services/product/productsApi";
import { format, isValid } from "date-fns";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Package2, ShoppingCart, ImageOff } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { OrderItemRes } from "@/types/order";

// Component to display individual order item with product details
const OrderItemDisplay: FC<{ item: OrderItemRes; index: number }> = ({
  item,
  index,
}) => {
  const { data: product, isLoading: isLoadingProduct } = useGetProductByIdQuery(
    item.productId
  );

  if (isLoadingProduct) {
    return (
      <div className="flex items-center gap-4 p-4 border rounded-lg bg-muted/20">
        <Skeleton className="w-16 h-16 rounded-lg" />
        <div className="flex-1">
          <Skeleton className="h-4 w-3/4 mb-2" />
          <Skeleton className="h-3 w-1/2" />
        </div>
        <Skeleton className="h-6 w-20" />
      </div>
    );
  }

  return (
    <div
      key={`${item.productId}-${index}`}
      className="flex items-center gap-4 p-4 border rounded-lg bg-muted/20"
    >
      {/* Product Image */}
      <div className="flex-shrink-0">
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={product?.name || `Product ${item.productId}`}
            className="w-16 h-16 object-cover rounded-lg border"
            onError={(e) => {
              // Fallback to placeholder if image fails to load
              const target = e.target as HTMLImageElement;
              target.style.display = "none";
              target.nextElementSibling?.classList.remove("hidden");
            }}
          />
        ) : null}
        <div
          className={`w-16 h-16 bg-muted rounded-lg border flex items-center justify-center ${
            item.imageUrl ? "hidden" : ""
          }`}
        >
          <ImageOff className="h-6 w-6 text-muted-foreground" />
        </div>
      </div>

      {/* Product Info */}
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm mb-1">
          {product?.name || `Product ID: ${item.productId}`}
        </p>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>Qty: {item.quantity}</span>
          <span>Price: {formatPrice(item.price)}</span>
        </div>
        {product?.name && (
          <p className="text-xs text-muted-foreground mt-1">
            ID: {item.productId}
          </p>
        )}
      </div>

      {/* Item Total */}
      <div className="text-right flex-shrink-0">
        <p className="font-semibold text-lg">{formatPrice(item.totalMoney)}</p>
        <p className="text-xs text-muted-foreground">Item Total</p>
      </div>
    </div>
  );
};

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
    <div className="space-y-6">
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
                  Total: {formatPrice(order.totalMoney)}
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

      {/* Order Items Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Order Items ({order.orderItems?.length || 0}{" "}
            {order.orderItems?.length === 1 ? "item" : "items"})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!order.orderItems || order.orderItems.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Package2 className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No items in this order</p>
            </div>
          ) : (
            <div className="space-y-4">
              {order.orderItems.map((item, index) => (
                <OrderItemDisplay
                  key={`${item.productId}-${index}`}
                  item={item}
                  index={index}
                />
              ))}

              {/* Order Summary */}
              <Separator />
              <div className="flex justify-between items-center pt-2">
                <span className="text-lg font-medium">Order Total:</span>
                <span className="text-xl font-bold text-primary">
                  {formatPrice(order.totalMoney)}
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderDetail;
