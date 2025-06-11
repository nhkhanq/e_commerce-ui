import React from "react";
import { useNavigate } from "react-router-dom";
import VoucherList from "@/components/vouchers/VoucherList";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ShoppingCart } from "lucide-react";

const VouchersPage: React.FC = () => {
  const navigate = useNavigate();

  const handleVoucherSelect = (voucherCode: string) => {
    // Save voucher to storage and redirect to cart/payment
    if (typeof window !== "undefined") {
      localStorage.setItem("voucherCode", voucherCode);
    }
    navigate("/cart");
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Header Section */}
      <div className="py-8 px-4 sm:px-6 lg:px-8 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">
                Vouchers & Discounts
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 mt-2">
                Discover amazing deals and save money on your orders
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              onClick={() => navigate("/cart")}
              className="bg-green-600 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700 text-white"
            >
              <ShoppingCart className="h-5 w-5 mr-2" />
              Go to Cart
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate("/product-list")}
              className="border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Continue Shopping
            </Button>
          </div>
        </div>
      </div>

      {/* Voucher List Section */}
      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <VoucherList
            onVoucherSelect={handleVoucherSelect}
            showApplyButton={true}
          />
        </div>
      </div>
    </div>
  );
};

export default VouchersPage;
