import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

const PaymentCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const vnp_ResponseCode = searchParams.get("vnp_ResponseCode");
    const vnp_TransactionStatus = searchParams.get("vnp_TransactionStatus");

    if (vnp_ResponseCode === "00" && vnp_TransactionStatus === "00") {
      toast({
        title: "Success",
        description: "Payment successful",
      });
      navigate("/orders");
    } else {
      toast({
        title: "Error",
        description: "Payment failed",
        variant: "destructive",
      });
      navigate("/payment");
    }
  }, [searchParams, navigate, toast]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-3xl font-bold mb-4">Processing Payment</h1>
        <p>Please wait while we process your payment...</p>
      </div>
    </div>
  );
};

export default PaymentCallback;
