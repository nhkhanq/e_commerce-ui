import React from "react";
import { Package, ShoppingCart, Users } from "lucide-react";

import type { Product } from "@/api/product/productsApi";
import type { Order } from "@/api/orders/ordersApi";
import { useGetProductsQuery } from "@/api/product/productsApi";
import { useGetMyOrdersQuery } from "@/api/orders/ordersApi";
import { useGetUsersQuery } from "@/api/admin/adminApi";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
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
import { Skeleton } from "@/components/ui/skeleton";

// const getOrderStatusClass = (status: string): string => {
//   if (!status) return "bg-gray-100 text-gray-700";
//   switch (status.toUpperCase()) {
//     case "PENDING":
//       return "bg-yellow-100 text-yellow-700 dark:bg-yellow-700/30 dark:text-yellow-300";
//     case "PAID":
//       return "bg-green-100 text-green-700 dark:bg-green-700/30 dark:text-green-300";
//     case "CANCELED":
//       return "bg-red-100 text-red-700 dark:bg-red-700/30 dark:text-red-300";
//     case "DELIVERING":
//       return "bg-blue-100 text-blue-700 dark:bg-blue-700/30 dark:text-blue-300";
//     case "SHIPPED":
//       return "bg-purple-100 text-purple-700 dark:bg-purple-700/30 dark:text-purple-300";
//     default:
//       return "bg-gray-100 text-gray-700 dark:bg-gray-600/30 dark:text-gray-300";
//   }
// };

const getOrderStatusBadgeVariant = (
  status: string
): "default" | "secondary" | "destructive" | "outline" => {
  if (!status) return "default";
  switch (status.toUpperCase()) {
    case "PAID":
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

interface DashboardSummaryCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  isLoading?: boolean;
  description?: string;
}

const DashboardSummaryCard: React.FC<DashboardSummaryCardProps> = ({
  title,
  value,
  icon,
  isLoading,
  description,
}) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-8 w-20" />
        ) : (
          <div className="text-2xl font-bold">{value}</div>
        )}
        {description && !isLoading && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
        {isLoading && description && <Skeleton className="h-4 w-2/3 mt-1" />}
      </CardContent>
    </Card>
  );
};

const AdminDashboardPage: React.FC = () => {
  const { data: productsData, isLoading: isLoadingProductCount } =
    useGetProductsQuery({ pageNumber: 1, pageSize: 1 });
  const { data: ordersData, isLoading: isLoadingOrderCount } =
    useGetMyOrdersQuery({ pageNumber: 1, pageSize: 1 });
  const { data: usersData, isLoading: isLoadingUserCount } = useGetUsersQuery({
    pageNumber: 1,
    pageSize: 1,
  });

  const { data: recentProductsData, isLoading: isLoadingRecentProducts } =
    useGetProductsQuery({ pageSize: 5, pageNumber: 1 });
  const { data: recentOrdersData, isLoading: isLoadingRecentOrders } =
    useGetMyOrdersQuery({ pageSize: 5, pageNumber: 1 });

  const productCount = productsData?.totalItems ?? 0;
  const orderCount = ordersData?.totalItems ?? 0;
  const userCount = usersData?.totalItems ?? 0;

  const recentProducts = recentProductsData?.items ?? [];
  const recentOrders = recentOrdersData?.items ?? [];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl md:text-3xl font-semibold text-foreground">
        Dashboard Overview
      </h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <DashboardSummaryCard
          title="Total Products"
          value={productCount}
          icon={<Package className="h-4 w-4 text-muted-foreground" />}
          isLoading={isLoadingProductCount}
        />
        <DashboardSummaryCard
          title="Total Orders"
          value={orderCount}
          icon={<ShoppingCart className="h-4 w-4 text-muted-foreground" />}
          isLoading={isLoadingOrderCount}
        />
        <DashboardSummaryCard
          title="Total Users"
          value={userCount}
          icon={<Users className="h-4 w-4 text-muted-foreground" />}
          isLoading={isLoadingUserCount}
        />
        {/* <SummaryCard icon={<DollarSign size={28} />} title="Total Revenue" value={`$${totalRevenue.toLocaleString()}`} color="red" /> */}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Products</CardTitle>
            <CardDescription>Last 5 products added.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingRecentProducts ? (
              <div className="space-y-2">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-10 w-full" />
                ))}
              </div>
            ) : recentProducts.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead className="hidden sm:table-cell">
                      Category
                    </TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead className="hidden md:table-cell">
                      Stock
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentProducts.map((product: Product) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">
                        {product.name}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        {product.category?.name || "N/A"}
                      </TableCell>
                      <TableCell>
                        ${product.price?.toFixed(2) ?? "0.00"}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {product.quantity}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-sm text-muted-foreground">
                No recent products found.
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>Last 5 orders placed.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingRecentOrders ? (
              <div className="space-y-2">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-10 w-full" />
                ))}
              </div>
            ) : recentOrders.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead className="hidden sm:table-cell">
                      Customer
                    </TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentOrders.map((order: Order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium truncate">
                        {order.id.substring(0, 8)}...
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        {order.fullName}
                      </TableCell>
                      <TableCell>
                        ${order.totalMoney?.toFixed(2) ?? "0.00"}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={getOrderStatusBadgeVariant(order.status)}
                          className="capitalize"
                        >
                          {order.status?.toLowerCase() || "unknown"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-sm text-muted-foreground">
                No recent orders found.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
