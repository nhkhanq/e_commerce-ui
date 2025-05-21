import { FC } from "react";
import { useGetMyOrdersQuery } from "@/api/orders/ordersApi";
import { Link } from "react-router-dom";
import { format, isValid } from "date-fns";
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
          <p className="text-muted-foreground">No orders found</p>
        </CardContent>
      </Card>
    );
  }

  // Helper function to safely format dates
  const formatDate = (dateString?: string) => {
    if (!dateString) return "Not available";

    const date = new Date(dateString);
    if (!isValid(date)) return "Not available";

    return format(date, "MM/dd/yyyy HH:mm");
  };

  // Helper function to create a user-friendly order ID
  const formatOrderId = (id: string) => {
    // Extract last 6 characters for a shorter identifier
    const shortId = id.slice(-6).toUpperCase();
    return `#${shortId}`;
  };

  return (
    <div className="space-y-4">
      {ordersData.items.map((order) => (
        <Link key={order.id} to={`/orders/${order.id}`}>
          <Card className="hover:bg-accent/50 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Order {formatOrderId(order.id)}
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
                  ? "Pending"
                  : order.status === "PAID"
                  ? "Paid"
                  : order.status === "CANCELED"
                  ? "Canceled"
                  : order.status === "DELIVERING"
                  ? "Delivering"
                  : "Shipped"}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <p className="text-sm text-muted-foreground">
                  {order.createdAt && isValid(new Date(order.createdAt))
                    ? format(new Date(order.createdAt), "MM/dd/yyyy HH:mm")
                    : ""}
                </p>
                <p className="text-sm font-medium">
                  ${order.totalMoney.toLocaleString()}
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
