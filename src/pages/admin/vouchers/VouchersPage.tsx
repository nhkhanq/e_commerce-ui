import React, { useState } from "react";
import {
  useGetVouchersQuery,
  useDeleteVoucherMutation,
} from "@/services/admin/adminApi";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Voucher } from "@/services/admin/adminApi";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { PlusCircle, Edit, Trash } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const VouchersPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const navigate = useNavigate();

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(null);

  const {
    data: vouchersData,
    isLoading,
    isFetching,
    refetch,
  } = useGetVouchersQuery({
    pageNumber: page,
    pageSize,
  });

  const [deleteVoucher, { isLoading: isDeleting }] = useDeleteVoucherMutation();

  const vouchers = vouchersData?.items || [];
  const totalPages = vouchersData?.totalPages || 0;

  const handleDeleteClick = (voucher: Voucher) => {
    setSelectedVoucher(voucher);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedVoucher) {
      try {
        console.log(
          `Attempting to delete voucher with code: ${selectedVoucher.code}`
        );

        // Check if we have the code property
        if (!selectedVoucher.code) {
          throw new Error("Voucher code is missing");
        }

        const result = await deleteVoucher(selectedVoucher.code).unwrap();
        console.log("Delete response:", result);

        // Force refetch the vouchers list to update UI
        await refetch();

        toast.success(`Voucher ${selectedVoucher.code} deleted successfully`);
      } catch (error: any) {
        console.error("Error deleting voucher:", error);

        // Show a more detailed error message
        const errorMessage =
          error?.data?.message || error?.message || "Unknown error occurred";
        toast.error(`Failed to delete voucher: ${errorMessage}`);
      } finally {
        setDeleteDialogOpen(false);
        setSelectedVoucher(null);
      }
    }
  };

  const formatDiscountValue = (voucher: Voucher) => {
    return voucher.discountType === "PERCENT"
      ? `${voucher.discountValue}%`
      : `$${voucher.discountValue.toFixed(2)}`;
  };

  // Safe date formatter with error handling
  const safeFormatDate = (dateString: string) => {
    try {
      if (!dateString) return "No date set";

      // Handle DD-MM-YYYY HH:MM:SS format
      if (dateString.match(/^\d{2}-\d{2}-\d{4} \d{2}:\d{2}:\d{2}$/)) {
        const [datePart, timePart] = dateString.split(" ");
        const [day, month, year] = datePart.split("-");
        return format(
          new Date(`${year}-${month}-${day}T${timePart}`),
          "MMM dd, yyyy"
        );
      }

      return format(new Date(dateString), "MMM dd, yyyy");
    } catch (error) {
      console.error(`Error formatting date: ${dateString}`, error);
      return "Invalid date";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-semibold text-foreground">
          Vouchers
        </h1>
        <Button
          onClick={() => navigate("/admin/vouchers/new")}
          className="flex items-center gap-2"
        >
          <PlusCircle className="h-4 w-4" />
          <span>Add Voucher</span>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Voucher List</CardTitle>
          <CardDescription>
            Manage your store's discount vouchers.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              {Array(5)
                .fill(0)
                .map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
            </div>
          ) : vouchers.length > 0 ? (
            <>
              <div className="rounded-md border overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Code</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Value</TableHead>
                      <TableHead className="hidden md:table-cell">
                        Expiration Date
                      </TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {vouchers.map((voucher: Voucher) => (
                      <TableRow key={voucher.id}>
                        <TableCell className="font-medium">
                          {voucher.code}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              voucher.discountType === "PERCENT"
                                ? "secondary"
                                : "default"
                            }
                          >
                            {voucher.discountType}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatDiscountValue(voucher)}</TableCell>
                        <TableCell className="hidden md:table-cell">
                          {safeFormatDate(voucher.expirationDate)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() =>
                                navigate(`/admin/vouchers/edit/${voucher.code}`)
                              }
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="destructive"
                              size="icon"
                              onClick={() => handleDeleteClick(voucher)}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-end space-x-2 py-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.max(p - 1, 1))}
                    disabled={page <= 1 || isFetching}
                  >
                    Previous
                  </Button>
                  <div className="text-sm font-medium">
                    Page {page} of {totalPages}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                    disabled={page >= totalPages || isFetching}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-10 text-muted-foreground">
              No vouchers found. Create your first voucher by clicking the "Add
              Voucher" button.
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to delete this voucher?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              voucher
              <span className="font-semibold"> {selectedVoucher?.code}</span>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default VouchersPage;
