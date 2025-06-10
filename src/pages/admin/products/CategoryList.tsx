import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGetAdminCategoriesQuery } from "@/services/admin/adminApi";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertCircle,
  Edit,
  MoreHorizontal,
  Plus,
  Search,
  Grid3X3,
  Package,
  TrendingUp,
} from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

function CategoryDropdownMenu({
  category,
  onEdit,
  onDeleteConfirm,
}: {
  category: any;
  onEdit: (id: string) => void;
  onDeleteConfirm: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreHorizontal size={16} />
          <span className="sr-only">Menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem
          onClick={() => {
            onEdit(category.id);
            setOpen(false);
          }}
        >
          <Edit size={16} className="mr-2" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            onDeleteConfirm(category.id);
            setOpen(false);
          }}
        >
          <Edit size={16} className="mr-2" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

const CategoryList = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingCategoryId, setDeletingCategoryId] = useState("");

  const { data, isLoading, isError, refetch } = useGetAdminCategoriesQuery({
    pageNumber: page,
    pageSize,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement search functionality - client-side filtering for now
    refetch();
  };

  const handleEdit = (categoryId: string) => {
    navigate(`/admin/categories/edit/${categoryId}`);
  };

  const handleAddNew = () => {
    navigate("/admin/categories/new");
  };

  const handleDelete = () => {
    // Implement delete functionality
    console.log("Deleting category:", deletingCategoryId);
  };

  const confirmDelete = (categoryId: string) => {
    setDeletingCategoryId(categoryId);
    setDeleteDialogOpen(true);
  };

  const filteredCategories =
    data?.items.filter((category) =>
      searchTerm
        ? category.name.toLowerCase().includes(searchTerm.toLowerCase())
        : true
    ) || [];

  const totalPages = data?.totalPages || 1;

  // Generate pagination range
  const paginationRange = [];
  const startPage = Math.max(1, page - 2);
  const endPage = Math.min(totalPages, page + 2);

  for (let i = startPage; i <= endPage; i++) {
    paginationRange.push(i);
  }

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
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
              {[...Array(2)].map((_, i) => (
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
                  Category Management
                </h1>
              </div>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Organize and manage product categories
              </p>
            </div>
            <Button
              onClick={handleAddNew}
              className="bg-purple-600 hover:bg-purple-700 dark:bg-purple-600 dark:hover:bg-purple-700 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add New Category
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="p-6 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                  <Grid3X3 className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-purple-900 dark:text-purple-300">
                    {data?.totalItems || 0}
                  </p>
                  <p className="text-purple-600 dark:text-purple-400">
                    Total Categories
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <Package className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-blue-900 dark:text-blue-300">
                    {data?.items.length || 0}
                  </p>
                  <p className="text-blue-600 dark:text-blue-400">
                    Total Categories
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-900 dark:text-green-300">
                    {data?.items.length || 0}
                  </p>
                  <p className="text-green-600 dark:text-green-400">
                    All Categories
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="mb-6">
            <form onSubmit={handleSearch} className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search categories..."
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

          {/* Categories Table */}
          <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-gray-200 dark:border-gray-700">
                  <TableHead className="text-gray-900 dark:text-gray-100">
                    Icon
                  </TableHead>
                  <TableHead className="text-gray-900 dark:text-gray-100">
                    Category Name
                  </TableHead>
                  <TableHead className="text-gray-900 dark:text-gray-100">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCategories.map((category) => (
                  <TableRow
                    key={category.id}
                    className="border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  >
                    <TableCell>
                      <img
                        src={category.imageUrl}
                        alt={category.name}
                        className="h-12 w-12 object-cover rounded-lg"
                      />
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-gray-100">
                          {category.name}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <CategoryDropdownMenu
                        category={category}
                        onEdit={handleEdit}
                        onDeleteConfirm={confirmDelete}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
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

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="bg-white dark:bg-gray-800">
          <DialogHeader>
            <DialogTitle className="text-gray-900 dark:text-gray-100">
              Confirm Delete
            </DialogTitle>
            <DialogDescription className="text-gray-600 dark:text-gray-400">
              Are you sure you want to delete this category? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              className="border-gray-200 dark:border-gray-700"
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Error State */}
      {isError && (
        <div className="py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <Alert className="border-red-200 dark:border-red-800/30 bg-red-50 dark:bg-red-900/20">
              <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
              <AlertTitle className="text-red-900 dark:text-red-300">
                Error
              </AlertTitle>
              <AlertDescription className="text-red-700 dark:text-red-400">
                Failed to load categories. Please try again later.
              </AlertDescription>
            </Alert>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryList;
