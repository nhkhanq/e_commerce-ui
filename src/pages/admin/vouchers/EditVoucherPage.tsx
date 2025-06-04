import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useGetVoucherByCodeQuery,
  useUpdateVoucherMutation,
} from "@/services/admin/adminApi";
import VoucherForm from "./VoucherForm";
import { VoucherRequest } from "@/services/admin/adminApi";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

const EditVoucherPage: React.FC = () => {
  const navigate = useNavigate();
  const { code } = useParams<{ code: string }>();

  const {
    data: voucher,
    isLoading: isLoadingVoucher,
    error,
  } = useGetVoucherByCodeQuery(code || "", {
    skip: !code,
  });

  const [updateVoucher, { isLoading: isUpdating }] = useUpdateVoucherMutation();

  const handleSubmit = async (data: VoucherRequest) => {
    if (!code) return;

    try {
      await updateVoucher({ code, data }).unwrap();
      toast.success("Voucher updated successfully");
      navigate("/admin/vouchers");
    } catch (error: any) {
      const errorMsg = error?.data?.message || "Failed to update voucher";
      toast.error(errorMsg);
    }
  };

  if (isLoadingVoucher) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-56" />
        <div className="max-w-2xl mx-auto">
          <div className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !voucher) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-semibold mb-2">Voucher Not Found</h2>
        <p className="text-muted-foreground mb-6">
          The voucher you're trying to edit doesn't exist or couldn't be loaded.
        </p>
        <button
          onClick={() => navigate("/admin/vouchers")}
          className="text-primary hover:underline"
        >
          Return to voucher list
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl md:text-3xl font-semibold text-foreground">
        Edit Voucher
      </h1>

      <div className="max-w-2xl mx-auto">
        <VoucherForm
          voucher={voucher}
          isLoading={isUpdating}
          onSubmit={handleSubmit}
          title={`Edit Voucher ${voucher.code}`}
          description="Update the voucher details"
          submitButtonText="Update Voucher"
        />
      </div>
    </div>
  );
};

export default EditVoucherPage;
