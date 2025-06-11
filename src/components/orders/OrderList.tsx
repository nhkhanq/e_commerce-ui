import { FC, useEffect, useState } from "react";
import {
  useGetMyOrdersQuery,
  useSearchOrdersQuery,
} from "@/services/orders/ordersApi";
import { useAuth } from "@/context/auth-context";
import { Link } from "react-router-dom";
import { format, isValid } from "date-fns";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChevronLeft,
  ChevronRight,
  Package,
  MapPin,
  CreditCard,
  Calendar,
  Eye,
  ShoppingBag,
  Clock,
  Filter,
  X,
} from "lucide-react";
import { formatPrice } from "@/lib/utils";

const OrderList: FC = () => {
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const PAGE_SIZE = 10; // Standard pagination size

  const shouldUseSearch = statusFilter !== "ALL" && statusFilter !== "";
  const userId = user?.id;

  const {
    data: myOrdersData,
    isLoading: isLoadingMyOrders,
    refetch: refetchMyOrders,
  } = useGetMyOrdersQuery(
    {
      pageNumber: currentPage,
      pageSize: PAGE_SIZE,
    },
    {
      skip: shouldUseSearch,
    }
  );

  const {
    data: searchOrdersData,
    isLoading: isLoadingSearch,
    refetch: refetchSearch,
  } = useSearchOrdersQuery(
    {
      status: statusFilter !== "ALL" ? statusFilter : undefined,
      userId: userId,
      pageNumber: currentPage,
      pageSize: PAGE_SIZE,
    },
    {
      skip: !shouldUseSearch || !userId,
    }
  );

  const ordersData = shouldUseSearch ? searchOrdersData : myOrdersData;
  const isLoading = shouldUseSearch ? isLoadingSearch : isLoadingMyOrders;
  const refetch = shouldUseSearch ? refetchSearch : refetchMyOrders;

  useEffect(() => {
    refetch();
  }, [refetch]);

  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter]);

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

  const formatOrderId = (id: string) => {
    const shortId = id.slice(-6).toUpperCase();
    return `#${shortId}`;
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "PENDING":
        return {
          label: "Pending",
          bgColor: "bg-orange-100 dark:bg-orange-900/30",
          textColor: "text-orange-800 dark:text-orange-300",
          borderColor: "border-orange-200 dark:border-orange-800/30",
        };
      case "PAID":
        return {
          label: "Paid",
          bgColor: "bg-blue-100 dark:bg-blue-900/30",
          textColor: "text-blue-800 dark:text-blue-300",
          borderColor: "border-blue-200 dark:border-blue-800/30",
        };
      case "DELIVERING":
        return {
          label: "Delivering",
          bgColor: "bg-purple-100 dark:bg-purple-900/30",
          textColor: "text-purple-800 dark:text-purple-300",
          borderColor: "border-purple-200 dark:border-purple-800/30",
        };
      case "SHIPPED":
        return {
          label: "Shipped",
          bgColor: "bg-green-100 dark:bg-green-900/30",
          textColor: "text-green-800 dark:text-green-300",
          borderColor: "border-green-200 dark:border-green-800/30",
        };
      case "CANCELED":
        return {
          label: "Canceled",
          bgColor: "bg-red-100 dark:bg-red-900/30",
          textColor: "text-red-800 dark:text-red-300",
          borderColor: "border-red-200 dark:border-red-800/30",
        };
      default:
        return {
          label: status,
          bgColor: "bg-gray-100 dark:bg-gray-800",
          textColor: "text-gray-800 dark:text-gray-300",
          borderColor: "border-gray-200 dark:border-gray-700",
        };
    }
  };

  const getPageNumbers = () => {
    if (!ordersData) return [];
    const totalPages = ordersData.totalPages;

    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (currentPage <= 3) {
      return [1, 2, 3, 4, 5, "...", totalPages];
    }

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

  const handleClearFilter = () => {
    setStatusFilter("ALL");
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        {Array(3)
          .fill(0)
          .map((_, i) => (
            <div
              key={i}
              className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg animate-pulse"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
              </div>
            </div>
          ))}
      </div>
    );
  }

  if (!ordersData?.items.length) {
    return (
      <div className="text-center py-16">
        <div className="h-16 w-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
          <ShoppingBag className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
          {statusFilter !== "ALL"
            ? `No ${statusFilter.toLowerCase()} orders found`
            : "No orders yet"}
        </h3>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          {statusFilter !== "ALL"
            ? "Try adjusting your filters or browse all orders"
            : "Start shopping to see your orders here"}
        </p>
        {statusFilter !== "ALL" ? (
          <Button
            onClick={handleClearFilter}
            variant="outline"
            className="mr-3"
          >
            <X className="h-4 w-4 mr-2" />
            Clear Filter
          </Button>
        ) : null}
        <Button
          onClick={() => (window.location.href = "/product-list")}
          className="bg-green-600 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700 text-white"
        >
          <Package className="h-4 w-4 mr-2" />
          Start Shopping
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Filter Section */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Orders</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="PAID">Paid</SelectItem>
                <SelectItem value="DELIVERING">Delivering</SelectItem>
                <SelectItem value="SHIPPED">Shipped</SelectItem>
                <SelectItem value="CANCELED">Canceled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {statusFilter !== "ALL" && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearFilter}
              className="flex items-center gap-2"
            >
              <X className="h-4 w-4" />
              Clear
            </Button>
          )}
        </div>
      </div>

      {/* Orders Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
              <Package className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-900 dark:text-blue-300">
                {ordersData.totalItems}
              </p>
              <p className="text-sm text-blue-600 dark:text-blue-400">
                {statusFilter !== "ALL" ? `${statusFilter}` : "Total"}
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
              <Clock className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-orange-900 dark:text-orange-300">
                {
                  ordersData.items.filter((order) => order.status === "PENDING")
                    .length
                }
              </p>
              <p className="text-sm text-orange-600 dark:text-orange-400">
                Pending
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
              <Package className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-900 dark:text-blue-300">
                {
                  ordersData.items.filter((order) => order.status === "PAID")
                    .length
                }
              </p>
              <p className="text-sm text-blue-600 dark:text-blue-400">Paid</p>
            </div>
          </div>
        </div>

        <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
              <Package className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-purple-900 dark:text-purple-300">
                {
                  ordersData.items.filter(
                    (order) => order.status === "DELIVERING"
                  ).length
                }
              </p>
              <p className="text-sm text-purple-600 dark:text-purple-400">
                Delivering
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
              <Package className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-green-900 dark:text-green-300">
                {
                  ordersData.items.filter((order) => order.status === "SHIPPED")
                    .length
                }
              </p>
              <p className="text-sm text-green-600 dark:text-green-400">
                Shipped
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-6">
        {ordersData.items.map((order) => {
          const statusConfig = getStatusConfig(order.status);

          return (
            <div
              key={order.id}
              className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              {/* Header Row */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-4">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                    <Package className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      Order {formatOrderId(order.id)}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                      <Calendar className="h-4 w-4" />
                      {order.createdAt && isValid(new Date(order.createdAt))
                        ? format(
                            new Date(order.createdAt),
                            "MMM dd, yyyy 'at' HH:mm"
                          )
                        : ""}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span
                    className={`px-3 py-2 rounded-lg text-sm font-medium border ${statusConfig.bgColor} ${statusConfig.textColor} ${statusConfig.borderColor}`}
                  >
                    {statusConfig.label}
                  </span>
                  <span className="text-xl font-bold text-gray-900 dark:text-gray-100">
                    {formatPrice(order.totalMoney)}
                  </span>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                {/* Delivery Address */}
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
                      Delivery Address
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                      {order.address}
                    </p>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="flex items-start gap-3">
                  <CreditCard className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
                      Payment Method
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {order.paymentMethod === "CASH"
                        ? "Cash on Delivery"
                        : order.paymentMethod === "VN_PAY"
                        ? "VNPay"
                        : "PayPal"}
                    </p>
                  </div>
                </div>

                {/* Customer Info */}
                <div className="flex items-start gap-3">
                  <Package className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
                      Customer
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {order.fullName}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-500">
                      {order.phone}
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {order.orderItems?.length || 0}{" "}
                  {(order.orderItems?.length || 0) === 1 ? "item" : "items"} in
                  this order
                </div>
                <Link to={`/orders/${order.id}`}>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      {ordersData && ordersData.totalPages > 1 && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Page {currentPage} of {ordersData.totalPages} •{" "}
            {ordersData.totalItems} total{" "}
            {statusFilter !== "ALL" ? statusFilter.toLowerCase() : ""} orders
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className="h-9 w-9 p-0 border-gray-200 dark:border-gray-700"
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
                  className={`h-9 w-9 p-0 ${
                    currentPage === page
                      ? "bg-green-600 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700 text-white"
                      : "border-gray-200 dark:border-gray-700"
                  }`}
                >
                  {page}
                </Button>
              ) : (
                <span
                  key={index}
                  className="h-9 w-9 flex items-center justify-center text-gray-400"
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
              className="h-9 w-9 p-0 border-gray-200 dark:border-gray-700"
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
