import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
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
  title,
  description,
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
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="code">Voucher Code</Label>
              <Input
                id="code"
                name="code"
                placeholder="SUMMER2023"
                value={formData.code}
                onChange={handleChange}
                disabled={isLoading || voucher !== undefined} // Disable editing the code for existing vouchers
                className={formErrors.code ? "border-destructive" : ""}
              />
              {formErrors.code && (
                <p className="text-sm text-destructive">{formErrors.code}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="discountType">Discount Type</Label>
              <Select
                value={formData.discountType}
                onValueChange={handleDiscountTypeChange as any}
                disabled={isLoading}
              >
                <SelectTrigger id="discountType">
                  <SelectValue placeholder="Select discount type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="FIXED">Fixed Amount</SelectItem>
                  <SelectItem value="PERCENT">Percentage</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="discountValue">
                Discount Value{" "}
                {formData.discountType === "PERCENT" ? "(%)" : "($)"}
              </Label>
              <Input
                id="discountValue"
                name="discountValue"
                type="number"
                min={0}
                max={formData.discountType === "PERCENT" ? 100 : undefined}
                placeholder={
                  formData.discountType === "PERCENT" ? "10" : "5.99"
                }
                value={formData.discountValue || ""}
                onChange={handleChange}
                disabled={isLoading}
                className={formErrors.discountValue ? "border-destructive" : ""}
              />
              {formErrors.discountValue && (
                <p className="text-sm text-destructive">
                  {formErrors.discountValue}
                </p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="expirationDate">Expiration Date</Label>
              <Input
                id="expirationDate"
                type="datetime-local"
                value={dateTimeLocalValue}
                onChange={handleExpirationDateChange}
                disabled={isLoading}
                min={format(new Date(), "yyyy-MM-dd'T'HH:mm")}
              />
              <p className="text-xs text-muted-foreground">
                Date will be saved in format: {formData.expirationDate}
              </p>
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/admin/vouchers")}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Processing..." : submitButtonText}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default VoucherForm;
