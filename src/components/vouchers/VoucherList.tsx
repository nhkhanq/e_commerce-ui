import React from "react";
import {
  useGetAllVouchersQuery,
  PublicVoucher,
} from "@/services/vouchers/vouchersApi";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { formatPrice } from "@/lib/utils";
import { format } from "date-fns";
import {
  Ticket,
  Copy,
  Clock,
  Percent,
  DollarSign,
  Calendar,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";

interface VoucherListProps {
  onVoucherSelect?: (voucherCode: string) => void;
  selectedVoucherCode?: string;
  showApplyButton?: boolean;
}

const VoucherList: React.FC<VoucherListProps> = ({
  onVoucherSelect,
  selectedVoucherCode,
  showApplyButton = false,
}) => {
  const { data: vouchersData, isLoading, error } = useGetAllVouchersQuery();
  const vouchers = Array.isArray(vouchersData) ? vouchersData : [];

  console.log("VoucherList - API Status:", {
    vouchersData,
    vouchers,
    isLoading,
    error,
    dataType: typeof vouchersData,
  });

  const isVoucherExpired = (expirationDate: string): boolean => {
    return new Date(expirationDate) < new Date();
  };

  const copyVoucherCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success(`Voucher code "${code}" copied to clipboard!`);
  };

  const formatDiscountValue = (voucher: PublicVoucher) => {
    return voucher.discountType === "PERCENT"
      ? `${voucher.discountValue}%`
      : formatPrice(voucher.discountValue);
  };

  const formatExpirationDate = (dateString: string) => {
    try {
      // Handle different date formats
      let date: Date;
      if (dateString.includes("-") && dateString.includes(" ")) {
        // Format: dd-MM-yyyy HH:mm:ss
        const [datePart, timePart] = dateString.split(" ");
        const [day, month, year] = datePart.split("-");
        date = new Date(`${year}-${month}-${day}T${timePart}`);
      } else {
        date = new Date(dateString);
      }

      if (isNaN(date.getTime())) {
        return "Invalid Date";
      }

      return format(date, "MMM dd, yyyy");
    } catch (error) {
      return "Invalid Date";
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
            <Ticket className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
              Available Vouchers
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Choose a voucher to get discount
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32 bg-gray-200 dark:bg-gray-700" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="h-16 w-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
        </div>
        <p className="text-red-600 dark:text-red-400">
          Failed to load vouchers
        </p>
      </div>
    );
  }

  if (vouchers.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="h-16 w-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
          <Ticket className="h-8 w-8 text-gray-400" />
        </div>
        <p className="text-gray-500 dark:text-gray-400">
          No vouchers available
        </p>
      </div>
    );
  }

  // Sort vouchers: active first, then expired
  const sortedVouchers = [...vouchers].sort((a, b) => {
    const aExpired = isVoucherExpired(a.expirationDate);
    const bExpired = isVoucherExpired(b.expirationDate);

    if (aExpired && !bExpired) return 1;
    if (!aExpired && bExpired) return -1;
    return 0;
  });

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
        <div className="h-8 w-8 sm:h-10 sm:w-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
          <Ticket className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600 dark:text-purple-400" />
        </div>
        <div>
          <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 dark:text-gray-100">
            Available Vouchers
          </h3>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            Choose a voucher to get discount on your order
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {sortedVouchers.map((voucher) => {
          const isExpired = isVoucherExpired(voucher.expirationDate);
          const isSelected = selectedVoucherCode === voucher.code;

          return (
            <Card
              key={voucher.id}
              className={`relative overflow-hidden transition-all duration-200 hover:shadow-lg ${
                isExpired
                  ? "opacity-50 grayscale border-gray-200 dark:border-gray-700"
                  : isSelected
                  ? "border-green-500 dark:border-green-400 ring-2 ring-green-200 dark:ring-green-800"
                  : "border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600"
              }`}
            >
              {/* Voucher Type Badge */}
              <div className="absolute top-2 sm:top-3 right-2 sm:right-3">
                <Badge
                  variant={
                    voucher.discountType === "PERCENT" ? "secondary" : "default"
                  }
                  className={`text-xs ${
                    isExpired
                      ? "bg-gray-300 text-gray-600 dark:bg-gray-600 dark:text-gray-300"
                      : voucher.discountType === "PERCENT"
                      ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                      : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                  }`}
                >
                  {voucher.discountType === "PERCENT" ? (
                    <Percent className="h-3 w-3 mr-1" />
                  ) : (
                    <DollarSign className="h-3 w-3 mr-1" />
                  )}
                  {voucher.discountType}
                </Badge>
              </div>

              {/* Expired Overlay */}
              {isExpired && (
                <div className="absolute top-0 left-0 right-0 bg-red-500/90 text-white text-center py-1 text-xs sm:text-sm font-medium">
                  <Clock className="h-3 w-3 sm:h-4 sm:w-4 inline mr-1" />
                  EXPIRED
                </div>
              )}

              <CardContent
                className={`p-3 sm:p-4 md:p-6 ${
                  isExpired ? "pt-6 sm:pt-8" : ""
                }`}
              >
                <div className="space-y-3 sm:space-y-4">
                  {/* Voucher Code */}
                  <div className="flex items-center justify-between">
                    <div className="min-w-0 flex-1">
                      <p className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                        Voucher Code
                      </p>
                      <div className="flex items-center gap-1 sm:gap-2">
                        <code
                          className={`px-2 sm:px-3 py-1 rounded font-mono text-sm sm:text-base md:text-lg font-bold border truncate ${
                            isExpired
                              ? "bg-gray-100 text-gray-500 border-gray-300 dark:bg-gray-700 dark:text-gray-400 dark:border-gray-600"
                              : "bg-purple-50 text-purple-800 border-purple-200 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-700"
                          }`}
                        >
                          {voucher.code}
                        </code>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => copyVoucherCode(voucher.code)}
                          className="h-6 w-6 sm:h-8 sm:w-8 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 flex-shrink-0"
                          disabled={isExpired}
                        >
                          <Copy className="h-3 w-3 sm:h-4 sm:w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Discount Value */}
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                      Discount
                    </p>
                    <p
                      className={`text-xl sm:text-2xl font-bold ${
                        isExpired
                          ? "text-gray-400 dark:text-gray-500"
                          : "text-green-600 dark:text-green-400"
                      }`}
                    >
                      {formatDiscountValue(voucher)}
                      {voucher.discountType === "PERCENT" ? " OFF" : " OFF"}
                    </p>
                  </div>

                  {/* Expiration Date */}
                  <div className="flex items-center gap-2">
                    <Calendar
                      className={`h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0 ${
                        isExpired
                          ? "text-red-500 dark:text-red-400"
                          : "text-gray-500 dark:text-gray-400"
                      }`}
                    />
                    <span
                      className={`text-xs sm:text-sm ${
                        isExpired
                          ? "text-red-600 dark:text-red-400 font-medium"
                          : "text-gray-600 dark:text-gray-400"
                      }`}
                    >
                      {isExpired ? "Expired: " : "Valid until: "}
                      {formatExpirationDate(voucher.expirationDate)}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  {showApplyButton && !isExpired && (
                    <Button
                      onClick={() => onVoucherSelect?.(voucher.code)}
                      className={`w-full text-sm sm:text-base ${
                        isSelected
                          ? "bg-green-600 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700"
                          : "bg-purple-600 hover:bg-purple-700 dark:bg-purple-600 dark:hover:bg-purple-700"
                      } text-white`}
                      disabled={isExpired}
                    >
                      {isSelected ? "Applied" : "Apply Voucher"}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Summary */}
      <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <div className="flex flex-col xs:flex-row justify-between gap-2 xs:gap-0 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
          <span>
            Available:{" "}
            {vouchers.filter((v) => !isVoucherExpired(v.expirationDate)).length}
          </span>
          <span>
            Expired:{" "}
            {vouchers.filter((v) => isVoucherExpired(v.expirationDate)).length}
          </span>
          <span>Total: {vouchers.length}</span>
        </div>
      </div>
    </div>
  );
};

export default VoucherList;
