import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { OrderReq } from "@/types/order";
import { useGetPaymentUrlMutation } from "@/services/payment/paymentApi";
import { logger } from "@/lib/logger";

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

      const paymentData = {
        ...orderData,
        paymentMethod: "VN_PAY" as "VN_PAY",
      };

      logger.debug("Sending payment request:", paymentData);
      const response = await getPaymentUrl(paymentData).unwrap();

      logger.debug("Payment response:", response);

      if (response.code === 200 && response.result?.paymentUrl) {
        toast.success("Redirecting to VNPay...");

        // Direct redirect to VNPay
        window.location.href = response.result.paymentUrl;
      } else {
        toast.error("Failed to initiate VNPay payment");
      }
    } catch (error) {
      logger.error("VNPay payment error:", error);
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
