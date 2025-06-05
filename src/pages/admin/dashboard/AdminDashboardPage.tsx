import React from "react";
import {
  Package,
  ShoppingCart,
  Users,
  CreditCard,
  ArrowRight,
  Eye,
  Activity,
  CircleDollarSign,
  BarChart4,
  CheckCircle,
  ListChecks,
} from "lucide-react";

import type { Product } from "@/services/product/productsApi";
import type { Order } from "@/services/orders/ordersApi";

import { useGetProductsQuery } from "@/services/product/productsApi";
import { useSearchOrdersQuery } from "@/services/orders/ordersApi";
import { useGetUsersQuery } from "@/services/admin/adminApi";
import { useGetRevenueByProductMutation } from "@/services/revenue/revenueApi";
import { format } from "date-fns";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
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
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";

const getOrderStatusBadgeVariant = (
  status?: string
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

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description?: string;
  trend?: number;
  isLoading?: boolean;
  color?: "default" | "blue" | "green" | "amber" | "red" | "purple";
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  description,
  trend,
  isLoading,
  color = "default",
}) => {
  const getColorClass = () => {
    switch (color) {
      case "blue":
        return "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400";
      case "green":
        return "bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400";
      case "amber":
        return "bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400";
      case "red":
        return "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400";
      case "purple":
        return "bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400";
      default:
        return "bg-gray-50 text-gray-600 dark:bg-gray-800 dark:text-gray-400";
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${getColorClass()}`}
          >
            {icon}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-8 w-20" />
        ) : (
          <div className="text-2xl font-bold">{value}</div>
        )}
        {description && !isLoading && (
          <div className="flex items-center mt-1 space-x-1">
            {trend !== undefined && (
              <span className={trend >= 0 ? "text-green-500" : "text-red-500"}>
                {trend >= 0 ? "↑" : "↓"} {Math.abs(trend)}%
              </span>
            )}
            <p className="text-xs text-muted-foreground">{description}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

interface ActivityItemProps {
  title: string;
  description: string;
  timestamp: string;
  icon: React.ReactNode;
  iconColor: string;
}

const ActivityItem: React.FC<ActivityItemProps> = ({
  title,
  description,
  timestamp,
  icon,
  iconColor,
}) => (
  <div className="flex items-start space-x-3 mb-4">
    <div className={`${iconColor} p-2 rounded-full mt-1`}>{icon}</div>
    <div className="flex-1">
      <h4 className="text-sm font-medium">{title}</h4>
      <p className="text-xs text-muted-foreground">{description}</p>
      <p className="text-xs text-muted-foreground mt-1">{timestamp}</p>
    </div>
  </div>
);

const AdminDashboardPage: React.FC = () => {
  const { data: productsData, isLoading: isLoadingProductCount } =
    useGetProductsQuery({ pageNumber: 1, pageSize: 1 });
  const { data: ordersResponse, isLoading: isLoadingOrderCount } =
    useSearchOrdersQuery({ pageNumber: 1, pageSize: 1 });
  const { data: usersData, isLoading: isLoadingUserCount } = useGetUsersQuery({
    pageNumber: 1,
    pageSize: 1,
  });

  const { data: recentProductsResponse, isLoading: isLoadingRecentProducts } =
    useGetProductsQuery({ pageSize: 5, pageNumber: 1 });
  const { data: recentOrdersResponse, isLoading: isLoadingRecentOrders } =
    useSearchOrdersQuery({ pageSize: 5, pageNumber: 1 });

  // Fetch top products by revenue
  const [
    getRevenueByProduct,
    { data: topProductsData, isLoading: isLoadingTopProducts },
  ] = useGetRevenueByProductMutation();

  React.useEffect(() => {
    // Get current month data for top products
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    // Set time for start and end of day
    startOfMonth.setHours(0, 0, 0, 0);
    endOfMonth.setHours(23, 59, 59, 999);

    // Format to dd-MM-yyyy HH:mm:ss
    const formattedStartDate = format(startOfMonth, "dd-MM-yyyy HH:mm:ss");
    const formattedEndDate = format(endOfMonth, "dd-MM-yyyy HH:mm:ss");

    getRevenueByProduct({
      startDate: formattedStartDate,
      endDate: formattedEndDate,
    });
  }, [getRevenueByProduct]);

  const productCount = productsData?.totalItems ?? 0;
  const orderCount = ordersResponse?.totalItems ?? 0;
  const userCount = usersData?.totalItems ?? 0;

  const recentProducts: Product[] = recentProductsResponse?.items ?? [];
  const recentOrders: Order[] = recentOrdersResponse?.items ?? [];

  // Transform top products data from API
  const topProducts = React.useMemo(() => {
    if (!topProductsData || !Array.isArray(topProductsData)) return [];

    // Take top 5 products and calculate percentage based on highest revenue
    const sortedProducts = [...topProductsData]
      .filter((item) => Array.isArray(item) && item.length >= 2)
      .sort((a, b) => (b[1] || 0) - (a[1] || 0))
      .slice(0, 5);

    const maxRevenue = sortedProducts[0]?.[1] || 1; // Avoid division by zero

    return sortedProducts.map((item, index) => ({
      name: item[0] || `Product ${index + 1}`,
      revenue: item[1] || 0,
      // Calculate percentage relative to top product
      percentage: ((item[1] || 0) / maxRevenue) * 100,
    }));
  }, [topProductsData]);

  const estimatedRevenue = recentOrders.reduce((sum, order) => {
    if (
      order.status === "PAID" ||
      order.status === "SHIPPED" ||
      order.status === "DELIVERING"
    ) {
      return sum + (order.totalMoney || 0);
    }
    return sum;
  }, 0);

  // Update number format to use English locale
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Products"
          value={productCount}
          icon={<Package className="h-4 w-4" />}
          description="All active products"
          isLoading={isLoadingProductCount}
          color="blue"
        />
        <StatCard
          title="Total Orders"
          value={orderCount}
          icon={<ShoppingCart className="h-4 w-4" />}
          description="All time orders"
          trend={12}
          isLoading={isLoadingOrderCount}
          color="green"
        />
        <StatCard
          title="Active Users"
          value={userCount}
          icon={<Users className="h-4 w-4" />}
          description="Registered accounts"
          trend={8}
          isLoading={isLoadingUserCount}
          color="amber"
        />
        <StatCard
          title="Revenue"
          value={formatCurrency(estimatedRevenue)}
          icon={<CreditCard className="h-4 w-4" />}
          description="Current month"
          trend={15}
          color="purple"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-7">
        {/* Left Column - Takes 5 columns on large screens */}
        <div className="lg:col-span-5 space-y-6">
          {/* Recent Orders */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Recent Orders</CardTitle>
                  <CardDescription>Latest customer purchases</CardDescription>
                </div>
                <ListChecks className="h-4 w-4 text-muted-foreground" />
              </div>
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
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentOrders.map((order: Order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium truncate">
                          #{order.id?.substring(0, 6)?.toUpperCase() ?? "N/A"}
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          {order.fullName || "Anonymous"}
                        </TableCell>
                        <TableCell>
                          {formatCurrency(order.totalMoney || 0)}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={getOrderStatusBadgeVariant(order.status)}
                            className="capitalize"
                          >
                            {order.status?.toLowerCase() ?? "unknown"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" asChild>
                            <Link to={`/admin/orders/${order.id}`}>
                              <Eye className="h-4 w-4" />
                              <span className="sr-only">View</span>
                            </Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-sm text-muted-foreground py-4 text-center">
                  No recent orders found.
                </p>
              )}
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" asChild>
                <Link to="/admin/orders">
                  <span>View All Orders</span>
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </CardFooter>
          </Card>

          {/* Recent Products */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Latest Products</CardTitle>
                  <CardDescription>Recently added to inventory</CardDescription>
                </div>
                <Package className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              {isLoadingRecentProducts ? (
                <div className="space-y-2">
                  {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} className="h-10 w-full" />
                  ))}
                </div>
              ) : recentProducts.length > 0 ? (
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                  {recentProducts.map((product) => (
                    <Card
                      key={product.id}
                      className="overflow-hidden border-0 shadow-sm"
                    >
                      <div className="flex items-center p-3">
                        <div className="w-10 h-10 mr-3 bg-gray-100 rounded-md flex items-center justify-center">
                          <Package className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium truncate">
                            {product.name}
                          </h4>
                          <div className="flex items-center justify-between">
                            <p className="text-xs text-muted-foreground">
                              {product.category?.name || "Uncategorized"}
                            </p>
                            <p className="text-sm font-semibold">
                              {formatCurrency(product.price || 0)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground py-4 text-center">
                  No recent products found.
                </p>
              )}
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" asChild>
                <Link to="/admin/products">
                  <span>Manage Products</span>
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Right Column - Takes 2 columns on large screens */}
        <div className="lg:col-span-2 space-y-6">
          {/* Top Selling Products */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Top Products</CardTitle>
                  <CardDescription>
                    Highest revenue in {format(new Date(), "MM/yyyy")}
                  </CardDescription>
                </div>
                <BarChart4 className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              {isLoadingTopProducts ? (
                <div className="space-y-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-2 w-full" />
                    </div>
                  ))}
                </div>
              ) : topProducts.length > 0 ? (
                <div className="space-y-4">
                  {topProducts.map((product, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span
                          className="truncate flex-1 mr-2"
                          title={product.name}
                        >
                          {product.name}
                        </span>
                        <span className="font-medium text-xs whitespace-nowrap">
                          {formatCurrency(product.revenue)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Progress
                          value={product.percentage}
                          className="h-2 flex-1"
                        />
                        <span className="text-xs text-muted-foreground w-12 text-right">
                          {product.percentage.toFixed(0)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-sm text-muted-foreground">
                    No revenue data available
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Data will be displayed when orders are placed
                  </p>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" asChild>
                <Link to="/admin/products">
                  <span>View All Products</span>
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </CardFooter>
          </Card>

          {/* Recent Activity Card */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Latest system events</CardDescription>
                </div>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <ActivityItem
                title="New Product Added"
                description="Wireless Headphones XB300"
                timestamp="10 minutes ago"
                icon={<Package className="h-4 w-4" />}
                iconColor="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
              />
              <ActivityItem
                title="Order Fulfilled"
                description="Order #AB1234 has been shipped"
                timestamp="2 hours ago"
                icon={<CheckCircle className="h-4 w-4" />}
                iconColor="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
              />
              <ActivityItem
                title="New Customer"
                description="Alex Johnson signed up"
                timestamp="5 hours ago"
                icon={<Users className="h-4 w-4" />}
                iconColor="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
              />
              <ActivityItem
                title="Payment Received"
                description="$129.99 for Order #CD5678"
                timestamp="Yesterday"
                icon={<CircleDollarSign className="h-4 w-4" />}
                iconColor="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
              />
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                <span>View All Activity</span>
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
