import React, { useState } from "react";
import { useGetUsersQuery } from "@/services/admin/adminApi";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { User } from "@/services/admin/adminApi";
import {
  Users,
  UserCheck,
  Calendar,
  Search,
  MoreHorizontal,
  User as UserIcon,
  AlertCircle,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ReactivateUserButton from "@/components/admin/ReactivateUserButton";

const CustomersPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [searchTerm, setSearchTerm] = useState("");

  const {
    data: usersData,
    isLoading,
    isError,
  } = useGetUsersQuery({
    pageNumber: page,
    pageSize,
  });

  const users = usersData?.items || [];
  const totalPages = usersData?.totalPages || 0;

  const paginationRange = [];
  const startPage = Math.max(1, page - 2);
  const endPage = Math.min(totalPages, page + 2);

  for (let i = startPage; i <= endPage; i++) {
    paginationRange.push(i);
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="animate-pulse">
          <div className="py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          </div>
          <div className="py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
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

  const filteredCustomers = users.filter(
    (user) =>
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">
              Customer Management
            </h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Manage customer accounts and information
          </p>
        </div>
      </div>

      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="p-6 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-indigo-900 dark:text-indigo-300">
                    {usersData?.totalItems || 0}
                  </p>
                  <p className="text-indigo-600 dark:text-indigo-400">
                    Total Customers
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                  <UserCheck className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-900 dark:text-green-300">
                    {usersData?.totalItems || 0}
                  </p>
                  <p className="text-green-600 dark:text-green-400">
                    Active Customers
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-blue-900 dark:text-blue-300">
                    {Math.floor((usersData?.totalItems || 0) / 4)}
                  </p>
                  <p className="text-blue-600 dark:text-blue-400">
                    New This Month
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <form onSubmit={handleSearch} className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search customers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>
              <Button
                type="submit"
                variant="outline"
                className="border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                Search
              </Button>
            </form>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-gray-200 dark:border-gray-700">
                  <TableHead className="text-gray-900 dark:text-gray-100">
                    Customer
                  </TableHead>
                  <TableHead className="text-gray-900 dark:text-gray-100">
                    Email
                  </TableHead>
                  <TableHead className="text-gray-900 dark:text-gray-100">
                    Status
                  </TableHead>
                  <TableHead className="text-gray-900 dark:text-gray-100">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.map((customer, index) => (
                  <TableRow
                    key={customer.id || `customer-${index}`}
                    className="border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center">
                          <UserIcon className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-gray-100">
                            {customer.firstName} {customer.lastName}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400"></p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-gray-900 dark:text-gray-100">
                        {customer.email}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          customer.active
                            ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300"
                            : "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300"
                        }`}
                      >
                        {customer.active ? "Active" : "Inactive"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                        >
                          <DropdownMenuLabel className="text-gray-900 dark:text-gray-100">
                            Actions
                          </DropdownMenuLabel>

                          {!customer.active && (
                            <DropdownMenuItem
                              asChild
                              className="focus:bg-green-50 dark:focus:bg-green-900/20"
                              onSelect={(e) => e.preventDefault()}
                            >
                              <div className="w-full">
                                <ReactivateUserButton
                                  userId={customer.id}
                                  userEmail={customer.email}
                                  variant="ghost"
                                  size="sm"
                                />
                              </div>
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {totalPages > 1 && (
            <div className="mt-6 flex justify-center">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setPage(Math.max(1, page - 1))}
                      className={
                        page === 1
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>
                  {paginationRange.map((pageNum) => (
                    <PaginationItem key={pageNum}>
                      <PaginationLink
                        onClick={() => setPage(pageNum)}
                        isActive={pageNum === page}
                        className="cursor-pointer"
                      >
                        {pageNum}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => setPage(Math.min(totalPages, page + 1))}
                      className={
                        page === totalPages
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>
      </div>

      {isError && (
        <div className="py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <Alert className="border-red-200 dark:border-red-800/50 bg-red-50 dark:bg-red-900/20">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle className="text-red-800 dark:text-red-300">
                Error loading customers
              </AlertTitle>
              <AlertDescription className="text-red-700 dark:text-red-400">
                Unable to load customer data. Please try again later.
              </AlertDescription>
            </Alert>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomersPage;
