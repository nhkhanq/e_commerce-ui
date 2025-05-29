import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  useGetOrderByIdQuery,
  useGetOrderItemsQuery,
  useUpdateOrderStatusMutation,
  useUpdateOrderInfoMutation,
  useDeleteOrderMutation,
  type ChangeOrderInfoRequest,
} from "@/api/orders/ordersApi";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  Trash2,
  Truck,
  Package,
  Calendar,
  MapPin,
  Phone,
  Mail,
  User,
  Edit,
  AlertTriangle,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// Helper function for status badge variants (same as in OrderList)
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

// Order status options
const ORDER_STATUS_OPTIONS = [
  { value: "PENDING", label: "Pending" },
  { value: "PAID", label: "Paid" },
  { value: "CANCELED", label: "Canceled" },
  { value: "DELIVERING", label: "Delivering" },
  { value: "SHIPPED", label: "Shipped" },
];

// Payment method mapping
const PAYMENT_METHODS = {
  CASH: "Cash",
  VN_PAY: "VN Pay",
  PAYPAL: "PayPal",
};

// Format currency for Vietnamese dong
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(amount);
};

const OrderDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<string>("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editInfoDialogOpen, setEditInfoDialogOpen] = useState(false);
  const [customerInfo, setCustomerInfo] = useState<ChangeOrderInfoRequest>({
    fullName: "",
    phone: "",
    address: "",
  });

  // Queries and mutations
  const { data: order, isLoading, refetch } = useGetOrderByIdQuery(id || "");
  const { data: orderItemsData, isLoading: isLoadingItems } =
    useGetOrderItemsQuery({ orderId: id || "" }, { skip: !id });
  const [updateStatus, { isLoading: isUpdatingStatus }] =
    useUpdateOrderStatusMutation();
  const [updateOrderInfo, { isLoading: isUpdatingInfo }] =
    useUpdateOrderInfoMutation();
  const [deleteOrder, { isLoading: isDeleting }] = useDeleteOrderMutation();

  // Calculate total money from items if available
  const totalFromItems =
    orderItemsData?.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    ) || 0;

  // Handle status change
  const handleChangeStatus = () => {
    if (!order) return;
    setNewStatus(order.status);
    setStatusDialogOpen(true);
  };

  const confirmStatusChange = async () => {
    if (!id || !newStatus) return;

    try {
      setStatusDialogOpen(false); // Đóng dialog trước
      await updateStatus({
        id,
        request: { status: newStatus as any },
      }).unwrap();

      toast.success(
        `Order status has been updated to ${
          ORDER_STATUS_OPTIONS.find((opt) => opt.value === newStatus)?.label ||
          newStatus
        }`
      );

      // Đảm bảo focus được đặt lại đúng nơi
      setTimeout(() => {
        refetch(); // Refresh order data
      }, 100);
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("Unable to update order status");
    }
  };

  // Handle customer info edit
  const handleEditCustomerInfo = () => {
    if (!order) return;

    setCustomerInfo({
      fullName: order.fullName,
      phone: order.phone,
      address: order.address,
    });

    setEditInfoDialogOpen(true);
  };

  const handleInfoChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setCustomerInfo((prev) => ({ ...prev, [name]: value }));
  };

  const confirmInfoUpdate = async () => {
    if (!id) return;

    try {
      setEditInfoDialogOpen(false); // Đóng dialog trước
      await updateOrderInfo({
        id,
        request: customerInfo,
      }).unwrap();

      toast.success("Customer information has been updated");
      // Đảm bảo focus được đặt lại đúng nơi
      setTimeout(() => {
        refetch(); // Refresh order data
      }, 100);
    } catch (error) {
      console.error("Error updating customer info:", error);
      toast.error("Unable to update customer information");
    }
  };

  // Handle delete order
  const handleDeleteOrder = () => {
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!id) return;

    try {
      setDeleteDialogOpen(false); // Đóng dialog trước khi thực hiện hành động
      await deleteOrder(id).unwrap();
      toast.success("Order has been deleted");
      // Đảm bảo focus không bị giữ lại
      setTimeout(() => {
        navigate("/admin/orders");
      }, 100);
    } catch (error) {
      console.error("Error deleting order:", error);
      toast.error("Unable to delete order");
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" disabled>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Skeleton className="h-8 w-48" />
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-[300px] w-full" />
          <Skeleton className="h-[300px] w-full" />
        </div>
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <AlertTriangle className="h-12 w-12 text-yellow-500" />
        <h2 className="text-2xl font-semibold">Order not found</h2>
        <p className="text-muted-foreground">
          This order does not exist or has been deleted.
        </p>
        <Button onClick={() => navigate("/admin/orders")}>
          Back to order list
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate("/admin/orders")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl md:text-3xl font-semibold">
            Order Details #{order.id.substring(0, 8)}
          </h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleChangeStatus}>
            Update Status
          </Button>
          <Button variant="destructive" onClick={handleDeleteOrder}>
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Order
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Order Info Card */}
        <Card>
          <CardHeader>
            <CardTitle>Order Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Order ID:
                  </span>
                </div>
                <span className="font-medium">{order.id}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Package className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Status:</span>
                </div>
                <Badge variant={getOrderStatusBadgeVariant(order.status)}>
                  {ORDER_STATUS_OPTIONS.find(
                    (opt) => opt.value === order.status
                  )?.label || order.status}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Truck className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Payment Method:
                  </span>
                </div>
                <span className="font-medium">
                  {PAYMENT_METHODS[
                    order.paymentMethod as keyof typeof PAYMENT_METHODS
                  ] || order.paymentMethod}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Truck className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Total:</span>
                </div>
                <span className="font-bold">
                  {formatCurrency(order.totalMoney)}
                </span>
              </div>

              {order.note && (
                <>
                  <Separator />
                  <div>
                    <h3 className="text-sm font-semibold mb-1">Note:</h3>
                    <p className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
                      {order.note}
                    </p>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Customer Info Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Customer Information</CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleEditCustomerInfo}
            >
              <Edit className="h-4 w-4" />
              <span className="sr-only">Edit information</span>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 py-2">
              <div className="flex items-center">
                <User className="mr-3 h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground w-24">
                  Full Name:
                </span>
                <span className="font-medium">{order.fullName}</span>
              </div>

              <div className="flex items-center">
                <Mail className="mr-3 h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground w-24">
                  Email:
                </span>
                <span className="font-medium">{order.email}</span>
              </div>

              <div className="flex items-center">
                <Phone className="mr-3 h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground w-24">
                  Phone:
                </span>
                <span className="font-medium">{order.phone}</span>
              </div>

              <div className="flex items-start">
                <MapPin className="mr-3 h-4 w-4 text-muted-foreground translate-y-1" />
                <span className="text-sm text-muted-foreground w-24">
                  Address:
                </span>
                <span className="font-medium">{order.address}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Order Items */}
      <Card>
        <CardHeader>
          <CardTitle>Order Details</CardTitle>
          <CardDescription>List of products in the order</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-right">Quantity</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoadingItems ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell>
                        <Skeleton className="h-5 w-48" />
                      </TableCell>
                      <TableCell className="text-right">
                        <Skeleton className="h-5 w-20 ml-auto" />
                      </TableCell>
                      <TableCell className="text-right">
                        <Skeleton className="h-5 w-10 ml-auto" />
                      </TableCell>
                      <TableCell className="text-right">
                        <Skeleton className="h-5 w-24 ml-auto" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : orderItemsData?.items && orderItemsData.items.length > 0 ? (
                  orderItemsData.items.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {item.product?.imageUrl && (
                            <div className="h-10 w-10 rounded-md bg-muted overflow-hidden">
                              <img
                                src={item.product.imageUrl}
                                alt={
                                  item.product?.name || `Product ${index + 1}`
                                }
                                className="h-full w-full object-cover"
                              />
                            </div>
                          )}
                          <span>
                            {item.product?.name ||
                              `Product #${item.productId.substring(0, 8)}`}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(item.price)}
                      </TableCell>
                      <TableCell className="text-right">
                        {item.quantity}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(
                          item.totalMoney || item.price * item.quantity
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="text-center py-6 text-muted-foreground"
                    >
                      No product data available
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end border-t p-4">
          <div className="space-y-2 text-right">
            <div className="flex justify-between gap-10">
              <span className="text-muted-foreground">Total product cost:</span>
              <span className="font-medium">
                {formatCurrency(totalFromItems)}
              </span>
            </div>
            <div className="flex justify-between gap-10">
              <span className="font-bold">Total:</span>
              <span className="font-bold text-lg">
                {formatCurrency(order.totalMoney)}
              </span>
            </div>
          </div>
        </CardFooter>
      </Card>

      {/* Change Status Dialog */}
      <Dialog
        open={statusDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            // Chỉ đóng dialog khi người dùng thực hiện hành động đóng
            setStatusDialogOpen(false);
          } else {
            setStatusDialogOpen(open);
          }
        }}
      >
        <DialogContent onPointerDownOutside={(e) => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle>Update Order Status</DialogTitle>
            <DialogDescription>
              Select new status for order #{order.id.substring(0, 8)}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
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
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setStatusDialogOpen(false)}
              disabled={isUpdatingStatus}
            >
              Cancel
            </Button>
            <Button
              onClick={confirmStatusChange}
              disabled={
                isUpdatingStatus || !newStatus || newStatus === order.status
              }
            >
              {isUpdatingStatus ? "Updating..." : "Update"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Customer Info Dialog */}
      <Dialog
        open={editInfoDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            // Chỉ đóng dialog khi người dùng thực hiện hành động đóng
            setEditInfoDialogOpen(false);
          } else {
            setEditInfoDialogOpen(open);
          }
        }}
      >
        <DialogContent onPointerDownOutside={(e) => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle>Update Customer Information</DialogTitle>
            <DialogDescription>
              Edit contact information and shipping address
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid gap-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                name="fullName"
                value={customerInfo.fullName}
                onChange={handleInfoChange}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                name="phone"
                value={customerInfo.phone}
                onChange={handleInfoChange}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                name="address"
                value={customerInfo.address}
                onChange={handleInfoChange}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditInfoDialogOpen(false)}
              disabled={isUpdatingInfo}
            >
              Cancel
            </Button>
            <Button
              onClick={confirmInfoUpdate}
              disabled={
                isUpdatingInfo ||
                (customerInfo.fullName === order.fullName &&
                  customerInfo.phone === order.phone &&
                  customerInfo.address === order.address)
              }
            >
              {isUpdatingInfo ? "Updating..." : "Update"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Order Dialog */}
      <AlertDialog
        open={deleteDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            // Chỉ đóng dialog khi người dùng thực hiện hành động đóng
            setDeleteDialogOpen(false);
          } else {
            setDeleteDialogOpen(open);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to delete this order?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. All information related to this
              order will be permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete order"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default OrderDetail;
