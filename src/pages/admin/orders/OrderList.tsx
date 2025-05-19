import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  useSearchOrdersQuery,
  useUpdateOrderStatusMutation,
  useDeleteOrderMutation,
  type Order,
} from "@/api/orders/ordersApi";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  SearchIcon,
  MoreHorizontal,
  Eye,
  Pencil,
  Trash2,
  Filter,
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

// Format currency for Vietnamese dong
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(amount);
};

// Order status options for filtering and changing status
const ORDER_STATUS_OPTIONS = [
  { value: "PENDING", label: "Đang chờ" },
  { value: "PAID", label: "Đã thanh toán" },
  { value: "CANCELED", label: "Đã hủy" },
  { value: "DELIVERING", label: "Đang giao" },
  { value: "SHIPPED", label: "Đã giao" },
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
    setDropdownOpen({});
    navigate(`/admin/orders/${orderId}`);
  };

  const handleChangeStatus = (order: Order) => {
    setDropdownOpen({});
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
        `Trạng thái đơn hàng đã được cập nhật thành ${
          ORDER_STATUS_OPTIONS.find((opt) => opt.value === newStatus)?.label ||
          newStatus
        }`
      );
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("Không thể cập nhật trạng thái đơn hàng");
    }
  };

  const handleDeleteClick = (orderId: string) => {
    setDropdownOpen({});
    setOrderToDelete(orderId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!orderToDelete) return;

    try {
      setDeleteDialogOpen(false); // Đóng dialog trước khi gọi API

      await deleteOrder(orderToDelete).unwrap();
      toast.success("Đơn hàng đã được xóa");
    } catch (error) {
      console.error("Error deleting order:", error);
      toast.error("Không thể xóa đơn hàng");
    }
  };

  // Toggle dropdown cho từng đơn hàng
  const toggleDropdown = (orderId: string) => {
    setDropdownOpen((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));
  };

  // Calculate pagination details
  const totalPages = ordersData?.totalPages || 1;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl md:text-3xl font-semibold">Quản lý đơn hàng</h1>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Danh sách đơn hàng</CardTitle>
          <CardDescription>
            Quản lý tất cả đơn hàng trong hệ thống
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-3 justify-between">
            <div className="flex flex-wrap items-center gap-3">
              <Select
                value={statusFilter || "ALL"}
                onValueChange={handleStatusFilterChange}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Tất cả trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="ALL">Tất cả trạng thái</SelectItem>
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

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mã đơn hàng</TableHead>
                  <TableHead>Khách hàng</TableHead>
                  <TableHead className="hidden md:table-cell">
                    Phương thức thanh toán
                  </TableHead>
                  <TableHead>Tổng tiền</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading || isFetching ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
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
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">
                        {order.id?.substring(0, 8)}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium text-sm">
                            {order.fullName}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {order.email}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {order.paymentMethod === "CASH" && "Tiền mặt"}
                        {order.paymentMethod === "VN_PAY" && "VN Pay"}
                        {order.paymentMethod === "PAYPAL" && "Paypal"}
                      </TableCell>
                      <TableCell>{formatCurrency(order.totalMoney)}</TableCell>
                      <TableCell>
                        <Badge
                          variant={getOrderStatusBadgeVariant(order.status)}
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
                            setDropdownOpen((prev) => ({
                              ...prev,
                              [order.id]: open,
                            }));
                          }}
                        >
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => toggleDropdown(order.id)}
                            >
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Mở menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleViewOrder(order.id)}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              Xem chi tiết
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleChangeStatus(order)}
                            >
                              <Pencil className="mr-2 h-4 w-4" />
                              Đổi trạng thái
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDeleteClick(order.id)}
                              className="text-destructive focus:text-destructive"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Xóa
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
                      className="text-center py-8 text-muted-foreground"
                    >
                      Không tìm thấy đơn hàng nào
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6 flex justify-center">
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
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteDialogOpen(false);
          } else {
            setDeleteDialogOpen(open);
          }
        }}
      >
        <DialogContent onPointerDownOutside={(e) => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle>Xác nhận xóa đơn hàng</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa đơn hàng này? Hành động này không thể
              hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={isDeleting}
            >
              Hủy
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Đang xóa..." : "Xóa"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Change Status Dialog */}
      <Dialog
        open={changeStatusDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            setChangeStatusDialogOpen(false);
          } else {
            setChangeStatusDialogOpen(open);
          }
        }}
      >
        <DialogContent onPointerDownOutside={(e) => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle>Thay đổi trạng thái đơn hàng</DialogTitle>
            <DialogDescription>
              Chọn trạng thái mới cho đơn hàng #
              {orderToChangeStatus?.id?.substring(0, 8)}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Select value={newStatus} onValueChange={setNewStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn trạng thái" />
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
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setChangeStatusDialogOpen(false)}
              disabled={isUpdatingStatus}
            >
              Hủy
            </Button>
            <Button
              onClick={confirmStatusChange}
              disabled={
                isUpdatingStatus ||
                !newStatus ||
                newStatus === orderToChangeStatus?.status
              }
            >
              {isUpdatingStatus ? "Đang cập nhật..." : "Cập nhật"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrderList;
