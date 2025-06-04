import { FC, useEffect, useState } from "react";
import { useGetMyOrdersQuery } from "@/services/orders/ordersApi";
import { Link } from "react-router-dom";
import { format, isValid } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

const OrderList: FC = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const PAGE_SIZE = 10;

  const {
    data: ordersData,
    isLoading,
    refetch,
  } = useGetMyOrdersQuery({
    pageNumber: currentPage,
    pageSize: PAGE_SIZE,
  });

  // Force refetch when component mounts to ensure fresh data
  useEffect(() => {
    refetch();
  }, [refetch]);

  // Handle page changes
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (ordersData && currentPage < ordersData.totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const goToPage = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

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

  // Helper function to create a user-friendly order ID
  const formatOrderId = (id: string) => {
    // Extract last 6 characters for a shorter identifier
    const shortId = id.slice(-6).toUpperCase();
    return `#${shortId}`;
  };

  // Generate an array of page numbers for pagination
  const getPageNumbers = () => {
    if (!ordersData) return [];
    const totalPages = ordersData.totalPages;

    // If 5 or fewer pages, show all
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    // If near the beginning
    if (currentPage <= 3) {
      return [1, 2, 3, 4, 5, "...", totalPages];
    }

    // If near the end
    if (currentPage >= totalPages - 2) {
      return [
        1,
        "...",
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    }

    // In the middle
    return [
      1,
      "...",
      currentPage - 1,
      currentPage,
      currentPage + 1,
      "...",
      totalPages,
    ];
  };

  return (
    <div className="space-y-8">
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

      {/* Pagination UI */}
      {ordersData && ordersData.totalPages > 1 && (
        <div className="flex justify-between items-center border-t pt-4">
          <div className="text-sm text-muted-foreground">
            Showing page {currentPage} of {ordersData.totalPages} (Total:{" "}
            {ordersData.totalItems} orders)
          </div>

          <div className="flex space-x-1">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className="h-8 w-8 p-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            {getPageNumbers().map((page, index) =>
              typeof page === "number" ? (
                <Button
                  key={index}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => goToPage(page)}
                  className="h-8 w-8 p-0"
                >
                  {page}
                </Button>
              ) : (
                <span
                  key={index}
                  className="h-8 w-8 flex items-center justify-center"
                >
                  {page}
                </span>
              )
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={handleNextPage}
              disabled={!ordersData || currentPage >= ordersData.totalPages}
              className="h-8 w-8 p-0"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderList;
