import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  useGetRevenueByDateRangeMutation,
  useGetRevenueByProductMutation,
  useGetRevenueByCategoryMutation,
  useGetRevenueByYearQuery,
  useGetRevenueByMonthQuery,
} from "@/services/revenue/revenueApi";
import RevenueFilters from "@/components/admin/revenue/RevenueFilters";
import RevenueChart from "@/components/admin/revenue/RevenueChart";
import RevenueSummaryCard from "@/components/admin/revenue/RevenueSummaryCard";
import RevenueTable from "@/components/admin/revenue/RevenueTable";
import { TrendingUp, Package, BarChart3, Calendar, Table } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";

const RevenuePage: React.FC = () => {
  const [revenueData, setRevenueData] = useState<any>(null);
  const [productRevenueData, setProductRevenueData] = useState<any[]>([]);
  const [categoryRevenueData, setCategoryRevenueData] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("overview");

  // Mutations for date range filters
  const [getRevenueByDateRange, { isLoading: isLoadingDateRange }] =
    useGetRevenueByDateRangeMutation();
  const [getRevenueByProduct, { isLoading: isLoadingProduct }] =
    useGetRevenueByProductMutation();
  const [getRevenueByCategory, { isLoading: isLoadingCategory }] =
    useGetRevenueByCategoryMutation();

  // Queries for year/month
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  const { data: yearRevenue, isLoading: isLoadingYear } =
    useGetRevenueByYearQuery(currentYear);
  const { data: monthRevenue, isLoading: isLoadingMonth } =
    useGetRevenueByMonthQuery({
      year: currentYear,
      month: currentMonth,
    });

  const handleDateRangeFilter = async (startDate: string, endDate?: string) => {
    try {
      const filterData = { startDate, endDate };

      // Get main revenue data
      const revenueResult = await getRevenueByDateRange(filterData).unwrap();
      setRevenueData(revenueResult);

      // Get product revenue data
      const productResult = await getRevenueByProduct(filterData).unwrap();
      setProductRevenueData(productResult || []);

      // Get category revenue data
      const categoryResult = await getRevenueByCategory(filterData).unwrap();
      setCategoryRevenueData(categoryResult || []);

      toast.success("Revenue data updated successfully");
    } catch (error: any) {
      console.error("Revenue API Error:", error);
      toast.error(
        "Error loading revenue data: " + (error?.message || "Unknown error")
      );
      // Set empty arrays on error to prevent undefined issues
      setProductRevenueData([]);
      setCategoryRevenueData([]);
    }
  };

  const handleYearFilter = async (year: number) => {
    // This will automatically trigger the query due to RTK Query
    toast.success(`Revenue filtered by year ${year}`);
  };

  const handleMonthFilter = async (month: number, year: number) => {
    // This will automatically trigger the query due to RTK Query
    toast.success(`Revenue filtered by ${month}/${year}`);
  };

  // Load initial data (current month)
  useEffect(() => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    // Set time for start and end of day
    startOfMonth.setHours(0, 0, 0, 0);
    endOfMonth.setHours(23, 59, 59, 999);

    // Format to dd-MM-yyyy HH:mm:ss
    const formattedStartDate = format(startOfMonth, "dd-MM-yyyy HH:mm:ss");
    const formattedEndDate = format(endOfMonth, "dd-MM-yyyy HH:mm:ss");

    handleDateRangeFilter(formattedStartDate, formattedEndDate);
  }, []);

  const isLoading =
    isLoadingDateRange ||
    isLoadingProduct ||
    isLoadingCategory ||
    isLoadingYear ||
    isLoadingMonth;

  // Transform product data for chart - with null check
  const transformedProductData = productRevenueData
    .filter((item) => Array.isArray(item) && item.length >= 2) // Filter valid arrays
    .map((item, index) => ({
      name: item[0] || `Product ${index + 1}`, // First element is name
      revenue: item[1] || 0, // Second element is revenue
      quantity: 1, // We don't have quantity data from this API
    }));

  // Transform category data for chart - with null check
  const transformedCategoryData = categoryRevenueData
    .filter((item) => Array.isArray(item) && item.length >= 2) // Filter valid arrays
    .map((item, index) => ({
      name: item[0] || `Category ${index + 1}`, // First element is name
      revenue: item[1] || 0, // Second element is revenue
      quantity: 1, // We don't have quantity data from this API
    }));

  // Transform data for table - with null check
  const productTableData = productRevenueData
    .filter((item) => Array.isArray(item) && item.length >= 2) // Filter valid arrays
    .map((item, index) => ({
      id: `product-${index + 1}`, // Generate ID since we don't have it
      name: item[0] || `Product ${index + 1}`,
      revenue: item[1] || 0,
      quantity: 1, // We don't have quantity data
      type: "product" as const,
    }));

  const categoryTableData = categoryRevenueData
    .filter((item) => Array.isArray(item) && item.length >= 2) // Filter valid arrays
    .map((item, index) => ({
      id: `category-${index + 1}`, // Generate ID since we don't have it
      name: item[0] || `Category ${index + 1}`,
      revenue: item[1] || 0,
      quantity: 1, // We don't have quantity data
      type: "category" as const,
    }));

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            Revenue Report
          </h1>
          <p className="text-muted-foreground mt-1">
            Track and analyze your store revenue
          </p>
        </div>
      </div>

      {/* Filters */}
      <RevenueFilters
        onDateRangeFilter={handleDateRangeFilter}
        onYearFilter={handleYearFilter}
        onMonthFilter={handleMonthFilter}
        loading={isLoading}
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <RevenueSummaryCard
          title="Revenue by Filter"
          value={revenueData?.revenue || 0}
          loading={isLoadingDateRange}
        />
        <RevenueSummaryCard
          title="Current Year Revenue"
          value={yearRevenue?.revenue || 0}
          loading={isLoadingYear}
        />
        <RevenueSummaryCard
          title="Current Month Revenue"
          value={monthRevenue?.revenue || 0}
          loading={isLoadingMonth}
        />
        <RevenueSummaryCard
          title="Products with Revenue"
          value={productRevenueData.length}
          loading={isLoadingProduct}
          prefix=""
          suffix=" products"
          skipCurrencyFormat={true}
        />
      </div>

      {/* Charts and Tables */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 lg:w-auto lg:grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            <span className="hidden sm:inline">Overview</span>
            <span className="sm:hidden">Overview</span>
          </TabsTrigger>
          <TabsTrigger value="products" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            <span className="hidden sm:inline">Products</span>
            <span className="sm:hidden">Products</span>
          </TabsTrigger>
          <TabsTrigger value="categories" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Categories</span>
            <span className="sm:hidden">Categories</span>
          </TabsTrigger>
          <TabsTrigger value="tables" className="flex items-center gap-2">
            <Table className="h-4 w-4" />
            <span className="hidden sm:inline">Tables</span>
            <span className="sm:hidden">Tables</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-card p-4 sm:p-6 rounded-lg border">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Revenue Overview
              </h3>
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-4 bg-muted/50 rounded-lg gap-2">
                  <span className="font-medium">Revenue by filter:</span>
                  <span className="text-lg font-bold text-primary">
                    {revenueData?.revenue
                      ? new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(revenueData.revenue)
                      : "0 ₫"}
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-4 bg-muted/50 rounded-lg gap-2">
                  <span className="font-medium">Categories with revenue:</span>
                  <span className="text-lg font-bold text-secondary-foreground">
                    {categoryRevenueData.length}
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-4 bg-muted/50 rounded-lg gap-2">
                  <span className="font-medium">Products with revenue:</span>
                  <span className="text-lg font-bold text-secondary-foreground">
                    {productRevenueData.length}
                  </span>
                </div>
                {/* Debug info - can be removed after fixing */}
                {!isLoading && productRevenueData.length === 0 && (
                  <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                    <p className="text-sm text-yellow-800 dark:text-yellow-200">
                      <strong>Debug:</strong> No product data found. Check API
                      response and date format.
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-card p-4 sm:p-6 rounded-lg border">
              <h3 className="text-lg font-semibold mb-4">Top Products</h3>
              <div className="space-y-3">
                {transformedProductData.slice(0, 5).map((product, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center p-3 bg-muted/30 rounded-lg"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">
                        {product.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Rank #{index + 1}
                      </p>
                    </div>
                    <span className="text-sm font-bold ml-2 flex-shrink-0">
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(product.revenue)}
                    </span>
                  </div>
                ))}
                {transformedProductData.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">
                      {isLoadingProduct
                        ? "Loading data..."
                        : "No product data available"}
                    </p>
                    {!isLoadingProduct && (
                      <p className="text-xs text-muted-foreground mt-2">
                        Try adjusting filters or check API endpoint
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="products" className="space-y-6">
          <RevenueChart
            data={transformedProductData}
            type="bar"
            title="Revenue by Products"
            dataKey="revenue"
            xAxisKey="name"
            color="#8884d8"
          />
        </TabsContent>

        <TabsContent value="categories" className="space-y-6">
          <RevenueChart
            data={transformedCategoryData}
            type="bar"
            title="Revenue by Categories"
            dataKey="revenue"
            xAxisKey="name"
            color="#82ca9d"
          />
        </TabsContent>

        <TabsContent value="tables" className="space-y-6">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <RevenueTable
              data={productTableData}
              loading={isLoadingProduct}
              title="Product Revenue Details"
            />
            <RevenueTable
              data={categoryTableData}
              loading={isLoadingCategory}
              title="Category Revenue Details"
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RevenuePage;
