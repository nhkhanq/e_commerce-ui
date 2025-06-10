import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";

interface RevenueTableItem {
  id: string;
  name: string;
  revenue: number;
  quantity: number;
  type: "product" | "category";
}

interface RevenueTableProps {
  data: RevenueTableItem[];
  loading?: boolean;
  title: string;
}

const RevenueTable: React.FC<RevenueTableProps> = ({
  data,
  loading = false,
  title,
}) => {
  if (loading) {
    return (
      <div className="bg-card p-6 rounded-lg border">
        <h3 className="text-lg font-semibold mb-4">{title}</h3>
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex space-x-4">
              <div className="h-4 bg-muted rounded flex-1"></div>
              <div className="h-4 bg-muted rounded w-24"></div>
              <div className="h-4 bg-muted rounded w-20"></div>
              <div className="h-4 bg-muted rounded w-16"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="bg-card p-6 rounded-lg border">
        <h3 className="text-lg font-semibold mb-4">{title}</h3>
        <div className="text-center py-8">
          <p className="text-muted-foreground">No data available</p>
        </div>
      </div>
    );
  }

  // Sort data by revenue descending
  const sortedData = [...data].sort((a, b) => b.revenue - a.revenue);

  return (
    <div className="bg-card p-6 rounded-lg border">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">#</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="text-right">Revenue</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedData.map((item, index) => (
              <TableRow key={item.id || index}>
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell>
                  <div className="font-medium">{item.name}</div>
                  <div className="text-sm text-muted-foreground">
                    ID: {item.id}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={item.type === "product" ? "default" : "secondary"}
                  >
                    {item.type === "product" ? "Product" : "Category"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <span className="font-bold text-primary">
                    {formatPrice(item.revenue)}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Summary row */}
      <div className="mt-4 pt-4 border-t">
        <div className="flex justify-between items-center">
          <span className="font-medium">
            Total ({sortedData.length} items):
          </span>
          <div className="text-right">
            <div className="text-lg font-bold text-primary">
              {formatPrice(
                sortedData.reduce((sum, item) => sum + item.revenue, 0)
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RevenueTable;
