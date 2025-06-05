import React from "react";
import { useNavigate } from "react-router-dom";
import { useCreateVoucherMutation } from "@/services/admin/adminApi";
import VoucherForm from "./VoucherForm";
import { VoucherRequest } from "@/services/admin/adminApi";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

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
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Header Section */}
      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <Button
                variant="ghost"
                onClick={() => navigate("/admin/vouchers")}
                className="mb-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Vouchers
              </Button>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                Add New Voucher
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Create a new discount voucher for your customers
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <VoucherForm
            isLoading={isLoading}
            onSubmit={handleSubmit}
            title="Create New Voucher"
            description="Add a new discount voucher for your customers"
            submitButtonText="Create Voucher"
          />
        </div>
      </div>
    </div>
  );
};

export default AddVoucherPage;
