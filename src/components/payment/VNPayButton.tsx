import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { OrderReq } from "@/interfaces/order";

interface VNPayButtonProps {
  orderData: OrderReq;
  onSuccess?: () => void;
}

const VNPayButton = ({ orderData, onSuccess }: VNPayButtonProps) => {
  const handleVNPayPayment = async () => {
    try {
      const response = await fetch(
        `${process.env.VITE_API_URL}/payment/pay?request=${JSON.stringify(
          orderData
        )}`
      );
      const data = await response.json();

      if (data.code === 200 && data.result?.paymentUrl) {
        window.location.href = data.result.paymentUrl;
        onSuccess?.();
      } else {
        toast.error("Failed to initiate VNPay payment");
      }
    } catch (error) {
      toast.error("Failed to process payment");
    }
  };

  return (
    <Button
      onClick={handleVNPayPayment}
      className="w-full bg-[#0055a9] hover:bg-[#004080]"
    >
      Pay with VNPay
    </Button>
  );
};

export default VNPayButton;
