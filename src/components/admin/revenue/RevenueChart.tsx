import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
} from "recharts";

interface RevenueChartProps {
  data: any[];
  type: "line" | "bar";
  title: string;
  dataKey: string;
  xAxisKey: string;
  color?: string;
}

const RevenueChart: React.FC<RevenueChartProps> = ({
  data,
  type,
  title,
  dataKey,
  xAxisKey,
  color = "#8884d8",
}) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  const ChartComponent = type === "line" ? LineChart : BarChart;

  return (
    <div className="w-full h-80 p-4 bg-card rounded-lg border">
      <h3 className="text-lg font-semibold mb-4 text-foreground">{title}</h3>
      <ResponsiveContainer width="100%" height="100%">
        <ChartComponent data={data}>
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          <XAxis
            dataKey={xAxisKey}
            className="text-muted-foreground"
            fontSize={12}
          />
          <YAxis
            className="text-muted-foreground"
            fontSize={12}
            tickFormatter={formatCurrency}
          />
          <Tooltip
            formatter={(value: number) => [formatCurrency(value), "Revenue"]}
            labelClassName="text-foreground"
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
            }}
          />
          <Legend />
          {type === "line" ? (
            <Line
              type="monotone"
              dataKey={dataKey}
              stroke={color}
              strokeWidth={2}
              dot={{ fill: color, strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6 }}
              name="Revenue"
            />
          ) : (
            <Bar
              dataKey={dataKey}
              fill={color}
              name="Revenue"
              radius={[4, 4, 0, 0]}
            />
          )}
        </ChartComponent>
      </ResponsiveContainer>
    </div>
  );
};

export default RevenueChart;
