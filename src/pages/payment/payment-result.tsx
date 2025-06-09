import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import { useUpdatePaymentStatusMutation } from "@/services/payment/paymentApi";
import type { PaymentStatusUpdateRequest } from "@/services/payment/paymentApi";

const PaymentResult = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState<"processing" | "success" | "failed">(
    "processing"
  );
  const [updatePaymentStatus, { isLoading: isUpdating }] =
    useUpdatePaymentStatusMutation();

  useEffect(() => {
    const processPaymentResult = async () => {
      console.log("🔄 Processing VNPay payment result...");

      // Bước 1: Lấy parameters từ URL
      const urlParams = new URLSearchParams(window.location.search);
      const responseCode = urlParams.get("vnp_ResponseCode");
      const orderId = urlParams.get("vnp_TxnRef");
      const amount = urlParams.get("vnp_Amount");

      console.log("📋 VNPay Parameters:", {
        responseCode,
        orderId,
        amount,
        allParams: Object.fromEntries(urlParams.entries()),
      });

      // Validate required parameters
      if (!responseCode || !orderId || !amount) {
        console.error("❌ Missing required parameters:", {
          responseCode,
          orderId,
          amount,
        });
        toast.error("Invalid payment response parameters");
        setStatus("failed");

        setTimeout(() => {
          navigate("/payment?error=invalid_params");
        }, 3000);
        return;
      }

      try {
        // Bước 2: Gọi API update status
        const updateData: PaymentStatusUpdateRequest = {
          responseCode,
          orderId,
          amount,
        };

        console.log("📤 Calling update payment status API with:", updateData);
        const response = await updatePaymentStatus(updateData).unwrap();

        // Bước 3: Điều hướng trang dựa trên response
        if (response.code === 200) {
          // Success
          console.log("✅ Payment status updated successfully");
          setStatus("success");

          toast.success("Payment successful!", {
            description: "Your order has been processed successfully.",
          });

          // Redirect to success page after delay
          setTimeout(() => {
            navigate(
              "/payment/vn-pay-callback?status=success&orderId=" + orderId
            );
          }, 2000);
        } else {
          // Failed
          console.log("❌ Payment status update failed:", response);
          setStatus("failed");

          toast.error("Payment failed", {
            description: response.message || "Payment could not be processed.",
          });

          // Redirect to failed page after delay
          setTimeout(() => {
            navigate(
              "/payment/vn-pay-callback?status=failed&reason=" + responseCode
            );
          }, 2000);
        }
      } catch (error) {
        setStatus("failed");

        console.error("💥 Payment processing error:", error);
        toast.error("Payment processing error", {
          description: "An error occurred while processing your payment.",
        });

        setTimeout(() => {
          navigate("/payment?error=processing_failed");
        }, 3000);
      }
    };

    processPaymentResult();
  }, [navigate, updatePaymentStatus]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
        <div className="text-center">
          {status === "processing" && (
            <>
              <div className="flex justify-center mb-4">
                <Loader2 className="h-16 w-16 text-blue-500 animate-spin" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                Processing Payment
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {isUpdating
                  ? "Updating payment status with backend..."
                  : "Verifying your payment details..."}
              </p>
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Please wait while we confirm your payment with VNPay. This
                  usually takes just a few seconds.
                </p>
              </div>
            </>
          )}

          {status === "success" && (
            <>
              <div className="flex justify-center mb-4">
                <CheckCircle className="h-16 w-16 text-green-500" />
              </div>
              <h1 className="text-2xl font-bold text-green-600 dark:text-green-400 mb-4">
                Payment Successful!
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Your payment has been processed successfully. Redirecting to
                order confirmation...
              </p>
            </>
          )}

          {status === "failed" && (
            <>
              <div className="flex justify-center mb-4">
                <XCircle className="h-16 w-16 text-red-500" />
              </div>
              <h1 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">
                Payment Failed
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Unfortunately, your payment could not be processed. Redirecting
                back to payment page...
              </p>
            </>
          )}

          {/* Debug info in development */}
          {import.meta.env.DEV && (
            <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg text-left">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Debug Info:
              </h3>
              <pre className="text-xs text-gray-600 dark:text-gray-400 overflow-auto">
                {JSON.stringify(
                  Object.fromEntries(
                    new URLSearchParams(window.location.search)
                  ),
                  null,
                  2
                )}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentResult;
