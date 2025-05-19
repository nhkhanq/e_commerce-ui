import React from "react";
import { useNavigate } from "react-router-dom";
import { useCreateVoucherMutation } from "@/api/admin/adminApi";
import VoucherForm from "./VoucherForm";
import { VoucherRequest } from "@/api/admin/adminApi";
import { toast } from "sonner";

const AddVoucherPage: React.FC = () => {
  const navigate = useNavigate();
  const [createVoucher, { isLoading }] = useCreateVoucherMutation();

  const handleSubmit = async (data: VoucherRequest) => {
    try {
      await createVoucher(data).unwrap();
      toast.success("Voucher created successfully");
      navigate("/admin/vouchers");
    } catch (error: any) {
      const errorMsg = error?.data?.message || "Failed to create voucher";
      toast.error(errorMsg);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl md:text-3xl font-semibold text-foreground">
        Add Voucher
      </h1>

      <div className="max-w-2xl mx-auto">
        <VoucherForm
          isLoading={isLoading}
          onSubmit={handleSubmit}
          title="Create New Voucher"
          description="Add a new discount voucher for your customers"
          submitButtonText="Create Voucher"
        />
      </div>
    </div>
  );
};

export default AddVoucherPage;
