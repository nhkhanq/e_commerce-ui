import React from "react";
import { TrendingUp, TrendingDown, DollarSign } from "lucide-react";

interface RevenueSummaryCardProps {
  title: string;
  value: number;
  previousValue?: number;
  loading?: boolean;
  prefix?: string;
  suffix?: string;
  skipCurrencyFormat?: boolean;
}

const RevenueSummaryCard: React.FC<RevenueSummaryCardProps> = ({
  title,
  value,
  previousValue,
  loading = false,
  prefix = "",
  suffix = "",
  skipCurrencyFormat = false,
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const formatNumber = (amount: number) => {
    return new Intl.NumberFormat("vi-VN").format(amount);
  };

  const calculatePercentageChange = () => {
    if (!previousValue || previousValue === 0) return null;
    return ((value - previousValue) / previousValue) * 100;
  };

  const percentageChange = calculatePercentageChange();
  const isPositive = percentageChange !== null && percentageChange > 0;
  const isNegative = percentageChange !== null && percentageChange < 0;

  if (loading) {
    return (
      <div className="bg-card p-6 rounded-lg border">
        <div className="animate-pulse">
          <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
          <div className="h-8 bg-muted rounded w-1/2 mb-2"></div>
          <div className="h-3 bg-muted rounded w-1/3"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card p-6 rounded-lg border hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground mb-1">
            {title}
          </p>
          <div className="flex items-center gap-2">
            <h3 className="text-2xl font-bold text-foreground">
              {prefix}
              {typeof value === "number"
                ? skipCurrencyFormat
                  ? formatNumber(value)
                  : formatCurrency(value)
                : value}
              {suffix}
            </h3>
          </div>

          {percentageChange !== null && (
            <div className="flex items-center gap-1 mt-2">
              {isPositive && (
                <>
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-green-500 font-medium">
                    +{percentageChange.toFixed(1)}%
                  </span>
                </>
              )}
              {isNegative && (
                <>
                  <TrendingDown className="h-4 w-4 text-red-500" />
                  <span className="text-sm text-red-500 font-medium">
                    {percentageChange.toFixed(1)}%
                  </span>
                </>
              )}
              {percentageChange === 0 && (
                <span className="text-sm text-muted-foreground font-medium">
                  0%
                </span>
              )}
              <span className="text-xs text-muted-foreground">
                vs previous period
              </span>
            </div>
          )}
        </div>

        <div className="flex-shrink-0">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
            <DollarSign className="h-6 w-6 text-primary" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RevenueSummaryCard;
