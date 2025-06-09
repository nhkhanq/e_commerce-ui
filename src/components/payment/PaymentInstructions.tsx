import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info, CreditCard, ArrowRight, CheckCircle } from "lucide-react";

const PaymentInstructions = () => {
  return (
    <Alert className="mb-6">
      <Info className="h-4 w-4" />
      <AlertDescription>
        <div className="space-y-2">
          <p className="font-medium text-blue-600">VNPay Payment Process:</p>
          <div className="space-y-1">
            <div className="flex items-center space-x-2 text-sm">
              <CreditCard className="h-3 w-3 text-blue-500" />
              <span>1. Click "Pay with VNPay" → Popup window opens</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <ArrowRight className="h-3 w-3 text-blue-500" />
              <span>2. Complete payment in popup window</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <CheckCircle className="h-3 w-3 text-green-500" />
              <span>3. Close popup after seeing "Payment successful"</span>
            </div>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded p-2 mt-2">
            <p className="text-xs font-medium text-yellow-800">💡 Important:</p>
            <ul className="text-xs text-yellow-700 mt-1 space-y-1">
              <li>• Payment will be verified automatically</li>
              <li>
                • If verification takes too long, manually close popup after
                confirming payment
              </li>
              <li>• Only successful payments will proceed to confirmation</li>
            </ul>
          </div>
        </div>
      </AlertDescription>
    </Alert>
  );
};

export default PaymentInstructions;
