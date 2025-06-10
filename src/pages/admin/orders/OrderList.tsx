import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  useSearchOrdersQuery,
  useUpdateOrderStatusMutation,
  useDeleteOrderMutation,
  type Order,
} from "@/services/orders/ordersApi";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  MoreHorizontal,
  Eye,
  Pencil,
  Trash2,
  Package,
  DollarSign,
  Clock,
  CheckCircle,
} from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useFocusManagement } from "@/hooks/useFocusManagement";
import { formatPrice } from "@/lib/utils";

// Helper function to get status badge variant
const getOrderStatusBadgeVariant = (
  status?: string
): "default" | "secondary" | "destructive" | "outline" => {
  if (!status) return "default";
  switch (status.toUpperCase()) {
    case "PAID":
      return "default";
    case "SHIPPED":
      return "default";
    case "PENDING":
      return "secondary";
    case "DELIVERING":
      return "outline";
    case "CANCELED":
      return "destructive";
    default:
      return "default";
  }
};

// Order status options for filtering and changing status
const ORDER_STATUS_OPTIONS = [
  { value: "PENDING", label: "Pending" },
  { value: "PAID", label: "Paid" },
  { value: "CANCELED", label: "Canceled" },
  { value: "DELIVERING", label: "Delivering" },
  { value: "SHIPPED", label: "Shipped" },
];

const OrderList: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(10);
  const [statusFilter, setStatusFilter] = useState<string | undefined>(
    undefined
  );
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<string | null>(null);
  const [changeStatusDialogOpen, setChangeStatusDialogOpen] = useState(false);
  const [orderToChangeStatus, setOrderToChangeStatus] = useState<Order | null>(
    null
  );
  const [newStatus, setNewStatus] = useState<string>("");
  const [dropdownOpen, setDropdownOpen] = useState<{ [key: string]: boolean }>(
    {}
  );

  // Handle URL parameters for filtering
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const statusParam = searchParams.get("status");

    if (statusParam) {
      setStatusFilter(statusParam);
    }
  }, [location.search]);

  // Fetch orders with filtering
  const {
    data: ordersData,
    isLoading,
    isFetching,
  } = useSearchOrdersQuery({
    status: statusFilter,
    pageNumber,
    pageSize,
  });

  // Mutations
  const [updateOrderStatus, { isLoading: isUpdatingStatus }] =
    useUpdateOrderStatusMutation();
  const [deleteOrder, { isLoading: isDeleting }] = useDeleteOrderMutation();

  // Handlers
  const handlePageChange = (page: number) => {
    setPageNumber(page);
  };

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value === "ALL" ? undefined : value);
    setPageNumber(1); // Reset to first page when filter changes

    // Update URL without reloading the page
    const searchParams = new URLSearchParams(location.search);
    if (value === "ALL") {
      searchParams.delete("status");
    } else {
      searchParams.set("status", value);
    }

    const newSearch = searchParams.toString();
    navigate(
      {
        pathname: location.pathname,
        search: newSearch ? `?${newSearch}` : "",
      },
      { replace: true }
    );
  };

  const handleViewOrder = (orderId: string) => {
    closeAllDropdowns();
    navigate(`/admin/orders/${orderId}`);
  };

  const handleChangeStatus = (order: Order) => {
    closeAllDropdowns();
    setOrderToChangeStatus(order);
    setNewStatus(order.status);
    setChangeStatusDialogOpen(true);
  };

  const confirmStatusChange = async () => {
    if (!orderToChangeStatus || !newStatus) return;

    try {
      setChangeStatusDialogOpen(false); // Đóng dialog trước khi gọi API

      await updateOrderStatus({
        id: orderToChangeStatus.id,
        request: { status: newStatus as any },
      }).unwrap();

      toast.success(
        `Order status has been updated to ${
          ORDER_STATUS_OPTIONS.find((opt) => opt.value === newStatus)?.label ||
          newStatus
        }`
      );
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("Unable to update order status");
    }
  };

  const handleDeleteClick = (orderId: string) => {
    closeAllDropdowns();
    setOrderToDelete(orderId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!orderToDelete) return;

    try {
      setDeleteDialogOpen(false); // Đóng dialog trước khi gọi API

      await deleteOrder(orderToDelete).unwrap();
      toast.success("Order has been deleted");
    } catch (error) {
      console.error("Error deleting order:", error);
      toast.error("Unable to delete order");
    }
  };

  // Toggle dropdown cho từng đơn hàng
  const toggleDropdown = (orderId: string, isOpen?: boolean) => {
    setDropdownOpen((prev) => ({
      ...prev,
      [orderId]: isOpen !== undefined ? isOpen : !prev[orderId],
    }));
  };

  // Đóng tất cả dropdown khi cần
  const closeAllDropdowns = React.useCallback(() => {
    setDropdownOpen({});
  }, []);

  // Sử dụng focus management hook
  useFocusManagement({
    onEscape: closeAllDropdowns,
    enabled: Object.values(dropdownOpen).some(Boolean), // Chỉ kích hoạt khi có dropdown mở
  });

  // Calculate pagination details
  const totalPages = ordersData?.totalPages || 1;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <div className="animate-pulse">
          <div className="py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
            </div>
          </div>
          <div className="py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="p-6">
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
                  <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Header Section */}
      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">
              Order Management
            </h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Manage customer orders and fulfillment
          </p>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <Package className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-blue-900 dark:text-blue-300">
                    {ordersData?.totalItems || 0}
                  </p>
                  <p className="text-blue-600 dark:text-blue-400">
                    Total Orders
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                  <Clock className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-orange-900 dark:text-orange-300">
                    {ordersData?.items.filter((o) => o.status === "PENDING")
                      .length || 0}
                  </p>
                  <p className="text-orange-600 dark:text-orange-400">
                    Pending
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-900 dark:text-green-300">
                    {ordersData?.items.filter((o) => o.status === "SHIPPED")
                      .length || 0}
                  </p>
                  <p className="text-green-600 dark:text-green-400">
                    Completed
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-emerald-900 dark:text-emerald-300">
                    {formatPrice(
                      ordersData?.items.reduce(
                        (sum, order) => sum + order.totalMoney,
                        0
                      ) || 0
                    )}
                  </p>
                  <p className="text-emerald-600 dark:text-emerald-400">
                    Total Revenue
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Section */}
      <div className="py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 justify-between">
            <div className="flex flex-wrap items-center gap-3">
              <Select
                value={statusFilter || "ALL"}
                onValueChange={handleStatusFilterChange}
              >
                <SelectTrigger className="w-[180px] bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100">
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="ALL">All statuses</SelectItem>
                    {ORDER_STATUS_OPTIONS.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Orders Table Section */}
      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-gray-200 dark:border-gray-700">
                  <TableHead className="text-gray-900 dark:text-gray-100">
                    Order ID
                  </TableHead>
                  <TableHead className="text-gray-900 dark:text-gray-100">
                    Customer
                  </TableHead>
                  <TableHead className="text-gray-900 dark:text-gray-100 hidden md:table-cell">
                    Payment Method
                  </TableHead>
                  <TableHead className="text-gray-900 dark:text-gray-100">
                    Total
                  </TableHead>
                  <TableHead className="text-gray-900 dark:text-gray-100">
                    Status
                  </TableHead>
                  <TableHead className="text-gray-900 dark:text-gray-100 text-right">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading || isFetching ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i} className="h-20">
                      <TableCell>
                        <Skeleton className="h-5 w-24" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-5 w-32" />
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <Skeleton className="h-5 w-24" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-5 w-20" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-5 w-24" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-8 w-20 ml-auto" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : ordersData?.items.length ? (
                  ordersData.items.map((order) => (
                    <TableRow
                      key={order.id}
                      className="border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                    >
                      <TableCell className="font-medium text-gray-900 dark:text-gray-100">
                        {order.id?.substring(0, 8)}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-900 dark:text-gray-100">
                            {order.fullName}
                          </span>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {order.email}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-gray-900 dark:text-gray-100">
                        {order.paymentMethod === "CASH" && "Cash"}
                        {order.paymentMethod === "VN_PAY" && "VN Pay"}
                        {order.paymentMethod === "PAYPAL" && "PayPal"}
                      </TableCell>
                      <TableCell className="font-semibold text-green-600 dark:text-green-400">
                        {formatPrice(order.totalMoney)}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={getOrderStatusBadgeVariant(order.status)}
                          className="text-sm"
                        >
                          {ORDER_STATUS_OPTIONS.find(
                            (opt) => opt.value === order.status
                          )?.label || order.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu
                          open={dropdownOpen[order.id]}
                          onOpenChange={(open) => {
                            toggleDropdown(order.id, open);
                          }}
                          modal={false}
                        >
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              aria-haspopup="menu"
                              aria-expanded={dropdownOpen[order.id] || false}
                              onFocus={() => {
                                // Ensure proper focus state
                                if (!dropdownOpen[order.id]) {
                                  // Focus without opening dropdown
                                }
                              }}
                            >
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">
                                Open menu for order {order.id?.substring(0, 8)}
                              </span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            onInteractOutside={() => {
                              closeAllDropdowns();
                            }}
                          >
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleViewOrder(order.id)}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              View details
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleChangeStatus(order)}
                            >
                              <Pencil className="mr-2 h-4 w-4" />
                              Change status
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDeleteClick(order.id)}
                              className="text-destructive focus:text-destructive"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="h-32 text-center text-gray-500 text-base"
                    >
                      No orders found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-12 flex justify-center">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() =>
                        pageNumber > 1 && handlePageChange(pageNumber - 1)
                      }
                      className={
                        pageNumber === 1
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>

                  {/* Show first page */}
                  {pageNumber > 2 && (
                    <PaginationItem>
                      <PaginationLink onClick={() => handlePageChange(1)}>
                        1
                      </PaginationLink>
                    </PaginationItem>
                  )}

                  {/* Show ellipsis if not showing first page */}
                  {pageNumber > 3 && (
                    <PaginationItem>
                      <PaginationLink>...</PaginationLink>
                    </PaginationItem>
                  )}

                  {/* Show previous page if not first page */}
                  {pageNumber > 1 && (
                    <PaginationItem>
                      <PaginationLink
                        onClick={() => handlePageChange(pageNumber - 1)}
                      >
                        {pageNumber - 1}
                      </PaginationLink>
                    </PaginationItem>
                  )}

                  {/* Current page */}
                  <PaginationItem>
                    <PaginationLink isActive>{pageNumber}</PaginationLink>
                  </PaginationItem>

                  {/* Show next page if not last page */}
                  {pageNumber < totalPages && (
                    <PaginationItem>
                      <PaginationLink
                        onClick={() => handlePageChange(pageNumber + 1)}
                      >
                        {pageNumber + 1}
                      </PaginationLink>
                    </PaginationItem>
                  )}

                  {/* Show ellipsis if not showing last page */}
                  {pageNumber < totalPages - 2 && (
                    <PaginationItem>
                      <PaginationLink>...</PaginationLink>
                    </PaginationItem>
                  )}

                  {/* Show last page if not current or next */}
                  {pageNumber < totalPages - 1 && (
                    <PaginationItem>
                      <PaginationLink
                        onClick={() => handlePageChange(totalPages)}
                      >
                        {totalPages}
                      </PaginationLink>
                    </PaginationItem>
                  )}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() =>
                        pageNumber < totalPages &&
                        handlePageChange(pageNumber + 1)
                      }
                      className={
                        pageNumber === totalPages
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onOpenChange={(open) => setDeleteDialogOpen(open)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Delete Order</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this order? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={confirmDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Change Status Dialog */}
      <Dialog
        open={changeStatusDialogOpen}
        onOpenChange={(open) => setChangeStatusDialogOpen(open)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Change Status</DialogTitle>
            <DialogDescription>
              Select a new status for the order
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <Select value={newStatus} onValueChange={setNewStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {ORDER_STATUS_OPTIONS.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter className="sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => setChangeStatusDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={confirmStatusChange}
              disabled={isUpdatingStatus}
            >
              {isUpdatingStatus ? "Updating..." : "Save changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrderList;
