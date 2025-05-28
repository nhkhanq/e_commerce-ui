import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { OrderReq } from "@/interfaces/order";
import { useGetPaymentUrlMutation } from "@/api/payment/paymentApi";
import { SERVER_URL } from "@/lib/constants";

interface VNPayButtonProps {
  orderData: OrderReq;
  onSuccess?: () => void;
}

const VNPayButton = ({ orderData, onSuccess }: VNPayButtonProps) => {
  const [getPaymentUrl, { isLoading }] = useGetPaymentUrlMutation();

  const handleVNPayPayment = async () => {
    try {
      if (
        !orderData.fullName ||
        !orderData.email ||
        !orderData.phone ||
        !orderData.address
      ) {
        toast.error("Please fill in all required fields");
        return;
      }

      const frontendReturnUrl = `${SERVER_URL}/payment/vn-pay-callback`;

      localStorage.setItem("vnpay_callback_url", frontendReturnUrl);

      console.log("Using frontend return URL:", frontendReturnUrl);
      const paymentData = {
        ...orderData,
        paymentMethod: "VN_PAY" as "VN_PAY",
        returnUrl: frontendReturnUrl,
      };

      console.log("Sending payment request:", paymentData);
      const response = await getPaymentUrl(paymentData).unwrap();

      console.log("Payment response:", response);

      if (response.code === 200 && response.result?.paymentUrl) {
        onSuccess?.();

        // Log before redirecting
        console.log(
          "Redirecting to payment gateway:",
          response.result.paymentUrl
        );
        if (response.result.paymentUrl.includes("vnp_ReturnUrl=")) {
          console.log(
            "VNPay return URL parameter:",
            decodeURIComponent(
              response.result.paymentUrl
                .split("vnp_ReturnUrl=")[1]
                .split("&")[0]
            )
          );
        }
        window.location.href = response.result.paymentUrl;
      } else {
        toast.error("Failed to initiate VNPay payment");
      }
    } catch (error) {
      console.error("VNPay payment error:", error);
      toast.error("Failed to process payment. Please try again later.");
    }
  };

  return (
    <Button
      onClick={handleVNPayPayment}
      disabled={isLoading}
      className="w-full bg-[#0055a9] hover:bg-[#004080]"
    >
      {isLoading ? "Processing..." : "Pay with VNPay"}
    </Button>
  );
};

export default VNPayButton;
