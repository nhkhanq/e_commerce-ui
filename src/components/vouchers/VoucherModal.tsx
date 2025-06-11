import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import VoucherList from "./VoucherList";
import { Ticket } from "lucide-react";

interface VoucherModalProps {
  onVoucherSelect: (voucherCode: string) => void;
  selectedVoucherCode?: string;
  children?: React.ReactNode;
}

const VoucherModal: React.FC<VoucherModalProps> = ({
  onVoucherSelect,
  selectedVoucherCode,
  children,
}) => {
  const [open, setOpen] = React.useState(false);

  const handleVoucherSelect = (voucherCode: string) => {
    onVoucherSelect(voucherCode);
    setOpen(false); // Close modal after selection
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button
            variant="outline"
            className="flex items-center gap-2 text-orange-600 border-orange-200 hover:bg-orange-50 dark:text-orange-400 dark:border-orange-800 dark:hover:bg-orange-900/20 text-sm md:text-base"
          >
            <Ticket className="h-4 w-4" />
            <span className="hidden xs:inline">Browse Vouchers</span>
            <span className="xs:hidden">Vouchers</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="w-[95vw] max-w-6xl h-[90vh] sm:h-[80vh] overflow-y-auto p-3 sm:p-6">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100">
            Choose a Voucher
          </DialogTitle>
        </DialogHeader>
        <div className="mt-2 sm:mt-4">
          <VoucherList
            onVoucherSelect={handleVoucherSelect}
            selectedVoucherCode={selectedVoucherCode}
            showApplyButton={true}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VoucherModal;
