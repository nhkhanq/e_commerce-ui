import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Voucher, VoucherRequest } from "@/services/admin/adminApi";
import { format, addDays } from "date-fns";
import { Ticket, DollarSign } from "lucide-react";

// Helper function to parse backend date format for form
const parseBackendDate = (dateString: string): string => {
  if (!dateString) return "";
  try {
    // If it's in DD-MM-YYYY HH:MM:SS format, convert it to YYYY-MM-DDTHH:MM
    if (dateString.match(/^\d{2}-\d{2}-\d{4} \d{2}:\d{2}:\d{2}$/)) {
      const [datePart, timePart] = dateString.split(" ");
      const [day, month, year] = datePart.split("-");
      const [hours, minutes] = timePart.split(":");
      return `${year}-${month}-${day}T${hours}:${minutes}`;
    }
    // If it's a valid date string in any format, convert to ISO format
    const date = new Date(dateString);
    if (!isNaN(date.getTime())) {
      return format(date, "yyyy-MM-dd'T'HH:mm");
    }
    return dateString;
  } catch (error) {
    console.error("Error parsing date:", error);
    return dateString;
  }
};

interface VoucherFormProps {
  voucher?: Voucher;
  isLoading: boolean;
  onSubmit: (data: VoucherRequest) => Promise<void>;
  title: string;
  description: string;
  submitButtonText: string;
}

const VoucherForm: React.FC<VoucherFormProps> = ({
  voucher,
  isLoading,
  onSubmit,

  submitButtonText,
}) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<VoucherRequest>({
    code: "",
    discountType: "FIXED",
    discountValue: 0,
    expirationDate: format(addDays(new Date(), 30), "dd-MM-yyyy HH:mm:ss"),
  });

  const [formErrors, setFormErrors] = useState({
    code: "",
    discountValue: "",
  });

  // For form display only - ISO format
  const [dateTimeLocalValue, setDateTimeLocalValue] = useState(
    format(addDays(new Date(), 30), "yyyy-MM-dd'T'HH:mm")
  );

  useEffect(() => {
    if (voucher) {
      setFormData({
        code: voucher.code,
        discountType: voucher.discountType,
        discountValue: voucher.discountValue,
        expirationDate: voucher.expirationDate,
      });

      // Parse the backend date for form display
      setDateTimeLocalValue(parseBackendDate(voucher.expirationDate));
    }
  }, [voucher]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === "discountValue" ? parseFloat(value) || 0 : value,
    }));

    // Clear errors
    if (name in formErrors) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleDiscountTypeChange = (value: "FIXED" | "PERCENT") => {
    setFormData((prev) => ({
      ...prev,
      discountType: value,
    }));
  };

  const handleExpirationDateChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { value } = e.target;
    setDateTimeLocalValue(value);

    // Convert to backend format
    if (value) {
      try {
        const date = new Date(value);
        setFormData((prev) => ({
          ...prev,
          expirationDate: format(date, "dd-MM-yyyy HH:mm:ss"),
        }));
      } catch (error) {
        console.error("Error converting date:", error);
      }
    }
  };

  const validateForm = (): boolean => {
    const errors = {
      code: "",
      discountValue: "",
    };

    let isValid = true;

    if (!formData.code.trim()) {
      errors.code = "Voucher code is required";
      isValid = false;
    }

    if (formData.discountValue <= 0) {
      errors.discountValue = "Discount value must be greater than 0";
      isValid = false;
    }

    if (formData.discountType === "PERCENT" && formData.discountValue > 100) {
      errors.discountValue = "Percentage discount cannot exceed 100%";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the form errors before submitting");
      return;
    }

    try {
      await onSubmit(formData);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-12">
      {/* Basic Information Section */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
            <Ticket className="h-5 w-5 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
              Basic Information
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Enter the basic voucher details
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-3">
            <Label
              htmlFor="code"
              className="text-base font-medium text-gray-900 dark:text-gray-100"
            >
              Voucher Code
            </Label>
            <Input
              id="code"
              name="code"
              placeholder="SUMMER2023"
              value={formData.code}
              onChange={handleChange}
              disabled={isLoading || voucher !== undefined}
              className={`p-4 text-lg bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 ${
                formErrors.code ? "border-destructive" : ""
              }`}
            />
            {formErrors.code && (
              <p className="text-sm text-red-600 dark:text-red-400">
                {formErrors.code}
              </p>
            )}
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {voucher
                ? "Voucher code cannot be changed"
                : "Enter a unique code for this voucher"}
            </p>
          </div>

          <div className="space-y-3">
            <Label
              htmlFor="discountType"
              className="text-base font-medium text-gray-900 dark:text-gray-100"
            >
              Discount Type
            </Label>
            <Select
              value={formData.discountType}
              onValueChange={handleDiscountTypeChange as any}
              disabled={isLoading}
            >
              <SelectTrigger
                id="discountType"
                className="p-4 text-lg bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100"
              >
                <SelectValue placeholder="Select discount type" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <SelectItem
                  value="FIXED"
                  className="text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Fixed Amount (VND)
                </SelectItem>
                <SelectItem
                  value="PERCENT"
                  className="text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Percentage (%)
                </SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Choose whether the discount is a fixed amount or percentage
            </p>
          </div>
        </div>
      </div>

      {/* Discount Configuration Section */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
            <DollarSign className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
              Discount Configuration
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Set the discount value and expiration
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-3">
            <Label
              htmlFor="discountValue"
              className="text-base font-medium text-gray-900 dark:text-gray-100"
            >
              Discount Value{" "}
              {formData.discountType === "PERCENT" ? "(%)" : "(VND)"}
            </Label>
            <Input
              id="discountValue"
              name="discountValue"
              type="number"
              min={0}
              max={formData.discountType === "PERCENT" ? 100 : undefined}
              placeholder={formData.discountType === "PERCENT" ? "10" : "50000"}
              value={formData.discountValue || ""}
              onChange={handleChange}
              disabled={isLoading}
              className={`p-4 text-lg bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 ${
                formErrors.discountValue ? "border-destructive" : ""
              }`}
            />
            {formErrors.discountValue && (
              <p className="text-sm text-red-600 dark:text-red-400">
                {formErrors.discountValue}
              </p>
            )}
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {formData.discountType === "PERCENT"
                ? "Enter percentage value (1-100)"
                : "Enter amount in VND"}
            </p>
          </div>

          <div className="space-y-3">
            <Label
              htmlFor="expirationDate"
              className="text-base font-medium text-gray-900 dark:text-gray-100"
            >
              Expiration Date
            </Label>
            <Input
              id="expirationDate"
              type="datetime-local"
              value={dateTimeLocalValue}
              onChange={handleExpirationDateChange}
              disabled={isLoading}
              min={format(new Date(), "yyyy-MM-dd'T'HH:mm")}
              className="p-4 text-lg bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100"
            />
            <p className="text-sm text-gray-500 dark:text-gray-400">
              When this voucher will expire and become invalid
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-end gap-4 pt-8 border-t border-gray-200 dark:border-gray-700">
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate("/admin/vouchers")}
          disabled={isLoading}
          className="px-8 py-3 text-base border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isLoading}
          className="bg-green-600 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700 text-white px-8 py-3 text-base"
        >
          {isLoading ? "Processing..." : submitButtonText}
        </Button>
      </div>
    </form>
  );
};

export default VoucherForm;
