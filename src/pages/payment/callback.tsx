import { useEffect, useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle } from "lucide-react";
import { ordersApi } from "@/services/orders/ordersApi";
import { useDispatch } from "react-redux";
import * as storage from "@/lib/storage";
import {
  useVerifyVNPayPaymentMutation,
  useUpdatePaymentStatusMutation,
} from "@/services/payment/paymentApi";
import { logger } from "@/lib/logger";

const PaymentCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [status, setStatus] = useState<"processing" | "success" | "error">(
    "processing"
  );
  const [orderInfo, setOrderInfo] = useState<string>("");
  const [amount, setAmount] = useState<string>("");

  const dispatch = useDispatch();
  const [verifyVNPayPayment] = useVerifyVNPayPaymentMutation();
  const [updatePaymentStatus] = useUpdatePaymentStatusMutation();

  useEffect(() => {
    const processPaymentCallback = async () => {
      const statusParam = searchParams.get("status");

      if (statusParam === "success") {
        setStatus("success");
        setOrderInfo("Payment verified successfully");

        if (typeof window !== "undefined") {
          storage.removeItem("cart");
          storage.removeItem("voucherCode");
          storage.removeItem("vnpay_payment_initiated");
          storage.removeItem("vnpay_order_data");
        }

        dispatch(
          ordersApi.util.invalidateTags([{ type: "Order", id: "LIST" }])
        );

        toast({
          title: "Success",
          description: "Payment successful",
        });

        const timer = setTimeout(() => {
          navigate("/orders");
        }, 5000);

        return () => clearTimeout(timer);
      } else if (statusParam === "failed") {
        setStatus("error");
        toast({
          title: "Error",
          description: "Payment failed",
          variant: "destructive",
        });
        return;
      }

      const vnp_ResponseCode = searchParams.get("vnp_ResponseCode");
      const vnp_TransactionStatus = searchParams.get("vnp_TransactionStatus");
      const vnp_TxnRef = searchParams.get("vnp_TxnRef");
      const vnp_OrderInfo = searchParams.get("vnp_OrderInfo");
      const vnp_Amount = searchParams.get("vnp_Amount");
      const vnp_BankCode = searchParams.get("vnp_BankCode");
      const vnp_PayDate = searchParams.get("vnp_PayDate");
      const vnp_SecureHash = searchParams.get("vnp_SecureHash");

      if (!vnp_ResponseCode || !vnp_TransactionStatus) {
        setStatus("error");
        toast({
          title: "Error",
          description: "Invalid payment response",
          variant: "destructive",
        });
        return;
      }

      if (vnp_OrderInfo) {
        setOrderInfo(
          vnp_OrderInfo.replace("Thanh+toan+don+hang:", "").replace(/\+/g, " ")
        );
      }

      if (vnp_Amount) {
        const formattedAmount = (parseInt(vnp_Amount) / 100).toLocaleString(
          "vi-VN"
        );
        setAmount(formattedAmount);
      }

      if (vnp_ResponseCode === "00" && vnp_TransactionStatus === "00") {
        try {
          await updatePaymentStatus({
            responseCode: vnp_ResponseCode,
            orderId: vnp_TxnRef || "",
            amount: vnp_Amount || "",
          }).unwrap();

          setStatus("success");
          toast({
            title: "Success",
            description: "Payment successful!",
          });

          if (typeof window !== "undefined") {
            storage.removeItem("cart");
            storage.removeItem("voucherCode");
            storage.removeItem("vnpay_payment_initiated");
            storage.removeItem("vnpay_order_data");
          }

          dispatch(
            ordersApi.util.invalidateTags([{ type: "Order", id: "LIST" }])
          );

          const timer = setTimeout(() => {
            navigate("/orders");
          }, 5000);

          return () => clearTimeout(timer);
        } catch (error) {
          logger.error("Failed to update payment status:", error);
          setStatus("error");
          toast({
            title: "Error",
            description:
              "Failed to update payment status. Please contact support.",
            variant: "destructive",
          });
        }
      } else {
        setStatus("error");
        toast({
          title: "Error",
          description: `Payment failed. Response code: ${vnp_ResponseCode}`,
          variant: "destructive",
        });
      }
    };

    processPaymentCallback();
  }, [
    searchParams,
    navigate,
    toast,
    dispatch,
    verifyVNPayPayment,
    updatePaymentStatus,
  ]);

  if (status === "processing") {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-4">Processing Payment</h1>
          <p className="text-lg">
            Please wait while we process your payment...
          </p>
          <div className="mt-6">
            <div className="animate-spin w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          <div className="p-8">
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <h1 className="text-3xl font-bold text-center text-green-600 dark:text-green-400 mb-4">
              Payment Successful!
            </h1>
            <div className="space-y-4 mb-6">
              <p className="text-center text-gray-600 dark:text-gray-300">
                Thank you for your purchase. Your payment has been successfully
                processed.
              </p>
              {orderInfo && (
                <div className="text-center">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Order Reference:
                  </p>
                  <p className="font-medium">{orderInfo}</p>
                </div>
              )}
              {amount && (
                <div className="text-center">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Amount Paid:
                  </p>
                  <p className="font-medium">{amount} VND</p>
                </div>
              )}
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center italic">
                Redirecting to orders page in 5 seconds...
              </p>
            </div>
            <div className="flex flex-col space-y-3 md:flex-row md:space-y-0 md:space-x-3">
              <Button
                asChild
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                <Link to="/orders">View Orders</Link>
              </Button>
              <Button asChild variant="outline" className="flex-1">
                <Link to="/product-list">Continue Shopping</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        <div className="p-8">
          <div className="flex justify-center mb-4">
            <XCircle className="h-16 w-16 text-red-500" />
          </div>
          <h1 className="text-3xl font-bold text-center text-red-600 dark:text-red-400 mb-4">
            Payment Failed
          </h1>
          <p className="text-center text-gray-600 dark:text-gray-300 mb-6">
            We couldn't process your payment. Please try again or use a
            different payment method.
          </p>
          <div className="flex flex-col space-y-3 md:flex-row md:space-y-0 md:space-x-3">
            <Button asChild className="flex-1 bg-red-600 hover:bg-red-700">
              <Link to="/payment">Try Again</Link>
            </Button>
            <Button asChild variant="outline" className="flex-1">
              <Link to="/cart">Return to Cart</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentCallback;
