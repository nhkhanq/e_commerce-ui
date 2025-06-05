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
      <div className="min-h-screen bg-white dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <Skeleton className="h-10 w-56 bg-gray-200 dark:bg-gray-700" />
          <div className="max-w-2xl mx-auto">
            <div className="space-y-4">
              <Skeleton className="h-12 w-full bg-gray-200 dark:bg-gray-700" />
              <Skeleton className="h-40 w-full bg-gray-200 dark:bg-gray-700" />
              <Skeleton className="h-12 w-full bg-gray-200 dark:bg-gray-700" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !voucher) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center py-10">
          <h2 className="text-2xl font-semibold mb-2 text-gray-900 dark:text-gray-100">
            Voucher Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            The voucher you're trying to edit doesn't exist or couldn't be
            loaded.
          </p>
          <button
            onClick={() => navigate("/admin/vouchers")}
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            Return to voucher list
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Header Section */}
      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Edit Voucher
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Update voucher details for {voucher.code}
          </p>
        </div>
      </div>

      {/* Form Section */}
      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
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
    </div>
  );
};

export default EditVoucherPage;
