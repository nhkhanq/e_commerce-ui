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
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Voucher } from "@/services/admin/adminApi";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
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
import {
  PlusCircle,
  Edit,
  Trash,
  Ticket,
  Plus,
  CheckCircle,
  Clock,
  Users,
  Search,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

const VouchersPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

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

  // Calculate stats
  const activeVouchers = vouchers.filter((v) => {
    const isExpired = v.expirationDate
      ? new Date(v.expirationDate) < new Date()
      : false;
    return !isExpired;
  }).length;

  const expiredVouchers = vouchers.filter((v) => {
    return v.expirationDate ? new Date(v.expirationDate) < new Date() : false;
  }).length;

  // Filter vouchers based on search and status
  const filteredVouchers = vouchers.filter((voucher) => {
    const matchesSearch = voucher.code
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (statusFilter === "all") return true;

    const isExpired = voucher.expirationDate
      ? new Date(voucher.expirationDate) < new Date()
      : false;

    switch (statusFilter) {
      case "ACTIVE":
        return !isExpired;
      case "Expired":
        return isExpired;
      default:
        return true;
    }
  });

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

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
    if (!voucher || !voucher.discountType || !voucher.discountValue) {
      return "N/A";
    }
    return voucher.discountType === "PERCENT"
      ? `${voucher.discountValue}%`
      : formatPrice(voucher.discountValue);
  };

  // Safe date formatter with error handling
  const safeFormatDate = (dateString: string | undefined | null) => {
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

  // Generate pagination range
  const paginationRange = [];
  const startPage = Math.max(1, page - 2);
  const endPage = Math.min(totalPages, page + 2);

  for (let i = startPage; i <= endPage; i++) {
    paginationRange.push(i);
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <div className="animate-pulse">
          <div className="py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          </div>
          <div className="py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="p-6">
                  <div className="h-6 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Header Section */}
      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">
                  Vouchers Management
                </h1>
              </div>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Manage discount vouchers and promotional codes
              </p>
            </div>
            <Button
              onClick={() => navigate("/admin/vouchers/new")}
              className="bg-pink-600 hover:bg-pink-700 dark:bg-pink-600 dark:hover:bg-pink-700 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add New Voucher
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 place-items-center gap-6 mb-8">
            <div className="p-8 bg-pink-50 dark:bg-pink-900/20 rounded-lg w-full flex justify-center items-center">
              <div className="flex items-center gap-6 w-full justify-center">
                <div className="h-16 w-16 bg-pink-100 dark:bg-pink-900/30 rounded-lg flex items-center justify-center">
                  <Ticket className="h-8 w-8 text-pink-600 dark:text-pink-400" />
                </div>
                <div className="flex-1 text-center">
                  <p className="text-4xl font-bold text-pink-900 dark:text-pink-300">
                    {vouchersData?.totalItems || 0}
                  </p>
                  <p className="text-pink-600 dark:text-pink-400 text-lg font-medium">
                    Total Vouchers
                  </p>
                </div>
              </div>
            </div>
            <div className="p-8 bg-green-50 dark:bg-green-900/20 rounded-lg w-full flex justify-center items-center">
              <div className="flex items-center gap-6 w-full justify-center">
                <div className="h-16 w-16 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                  <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
                <div className="flex-1 text-center">
                  <p className="text-4xl font-bold text-green-900 dark:text-green-300">
                    {activeVouchers}
                  </p>
                  <p className="text-green-600 dark:text-green-400 text-lg font-medium">
                    Active
                  </p>
                </div>
              </div>
            </div>
            <div className="p-8 bg-orange-50 dark:bg-orange-900/20 rounded-lg w-full flex justify-center items-center">
              <div className="flex items-center gap-6 w-full justify-center">
                <div className="h-16 w-16 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                  <Clock className="h-8 w-8 text-orange-600 dark:text-orange-400" />
                </div>
                <div className="flex-1 text-center">
                  <p className="text-4xl font-bold text-orange-900 dark:text-orange-300">
                    {expiredVouchers}
                  </p>
                  <p className="text-orange-600 dark:text-orange-400 text-lg font-medium">
                    Expired
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="mb-6">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search vouchers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="Expired">Expired</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Vouchers Table Section */}
      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {filteredVouchers.length > 0 ? (
            <div className="overflow-hidden bg-white dark:bg-gray-800 rounded-lg shadow">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-gray-200 dark:border-gray-700">
                    <TableHead className="h-14 text-base font-semibold text-gray-900 dark:text-gray-100">
                      Code
                    </TableHead>
                    <TableHead className="h-14 text-base font-semibold text-gray-900 dark:text-gray-100">
                      Type
                    </TableHead>
                    <TableHead className="h-14 text-base font-semibold text-gray-900 dark:text-gray-100">
                      Value
                    </TableHead>
                    <TableHead className="h-14 text-base font-semibold text-gray-900 dark:text-gray-100 hidden md:table-cell">
                      Expiration Date
                    </TableHead>
                    <TableHead className="h-14 text-base font-semibold text-gray-900 dark:text-gray-100 text-right">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading || isFetching
                    ? Array(5)
                        .fill(0)
                        .map((_, i) => (
                          <TableRow key={i} className="h-16">
                            <TableCell>
                              <Skeleton className="h-4 w-24" />
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-6 w-20 rounded-full" />
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-4 w-16" />
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              <Skeleton className="h-4 w-24" />
                            </TableCell>
                            <TableCell className="text-right">
                              <Skeleton className="h-8 w-16 ml-auto" />
                            </TableCell>
                          </TableRow>
                        ))
                    : filteredVouchers.map((voucher: Voucher) => (
                        <TableRow
                          key={voucher.id}
                          className="h-16 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors border-b border-gray-100 dark:border-gray-700"
                        >
                          <TableCell className="font-medium text-gray-900 dark:text-gray-100 text-base">
                            <div className="flex items-center gap-3">
                              <div className="h-8 w-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                                <Ticket className="h-4 w-4 text-green-600 dark:text-green-400" />
                              </div>
                              {voucher.code}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                voucher.discountType === "PERCENT"
                                  ? "secondary"
                                  : "default"
                              }
                              className="text-sm"
                            >
                              {voucher.discountType}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-semibold text-gray-900 dark:text-gray-100 text-base">
                            {formatDiscountValue(voucher)}
                          </TableCell>
                          <TableCell className="hidden md:table-cell text-base text-gray-900 dark:text-gray-100">
                            {safeFormatDate(voucher.expirationDate)}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() =>
                                  navigate(
                                    `/admin/vouchers/edit/${voucher.code}`
                                  )
                                }
                                className="border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
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
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center bg-white dark:bg-gray-800 rounded-lg shadow">
              <div className="h-16 w-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
                <Ticket className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <p className="text-xl font-medium text-gray-900 dark:text-gray-100 mb-2">
                No vouchers found
              </p>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                {searchTerm
                  ? `No vouchers match "${searchTerm}"`
                  : "Create your first voucher to get started"}
              </p>
              <Button
                onClick={() => navigate("/admin/vouchers/new")}
                size="lg"
                className="bg-green-600 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700 text-white px-8"
              >
                <PlusCircle className="h-5 w-5 mr-2" />
                Add your first voucher
              </Button>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-12 flex justify-center">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => handlePageChange(Math.max(1, page - 1))}
                      className={
                        page <= 1
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                      aria-disabled={page <= 1}
                    />
                  </PaginationItem>

                  {paginationRange.map((pageNum) => (
                    <PaginationItem key={pageNum}>
                      <PaginationLink
                        onClick={() => handlePageChange(pageNum)}
                        isActive={page === pageNum}
                      >
                        {pageNum}
                      </PaginationLink>
                    </PaginationItem>
                  ))}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() =>
                        handlePageChange(Math.min(totalPages, page + 1))
                      }
                      className={
                        page >= totalPages
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                      aria-disabled={page >= totalPages}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-gray-900 dark:text-gray-100">
              Are you sure you want to delete this voucher?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600 dark:text-gray-400">
              This action cannot be undone. This will permanently delete the
              voucher
              <span className="font-semibold text-gray-900 dark:text-gray-100">
                {" "}
                {selectedVoucher?.code}
              </span>
              .
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700">
              Cancel
            </AlertDialogCancel>
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
