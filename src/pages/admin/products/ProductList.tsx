import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useGetAdminProductsQuery,
  useDeleteProductMutation,
} from "@/services/admin/adminApi";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
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
  Trash2,
  Package,
  ShoppingCart,
  TrendingUp,
} from "lucide-react";
import { formatPrice } from "@/lib/utils";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const ProductList = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);

  const { data, isLoading, isError, refetch } = useGetAdminProductsQuery({
    pageNumber: page,
    pageSize,
  });

  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement search functionality - you might need a separate endpoint for search
    // For now, just use client-side filtering as an example
    refetch();
  };

  const handleEdit = (productId: string) => {
    navigate(`/admin/products/edit/${productId}`);
  };

  const handleDelete = async () => {
    if (productToDelete) {
      try {
        await deleteProduct(productToDelete).unwrap();
        setDeleteDialogOpen(false);
        setProductToDelete(null);
      } catch (error) {
        console.error("Failed to delete product:", error);
      }
    }
  };

  const confirmDelete = (productId: string) => {
    setProductToDelete(productId);
    setDeleteDialogOpen(true);
  };

  const handleAddNew = () => {
    navigate("/admin/products/new");
  };

  const filteredProducts =
    data?.items.filter((product) =>
      searchTerm
        ? product.name.toLowerCase().includes(searchTerm.toLowerCase())
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

  function ProductDropdownMenu({
    product,
    onEdit,
    onDeleteConfirm,
  }: {
    product: any;
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
              onEdit(product.id);
              setOpen(false);
            }}
          >
            <Edit size={16} className="mr-2" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              onDeleteConfirm(product.id);
              setOpen(false);
            }}
            className="text-red-600 focus:text-red-600 dark:text-red-400 dark:focus:text-red-400"
          >
            <Trash2 size={16} className="mr-2" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <div className="animate-pulse">
          <div className="py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
            </div>
          </div>
          <div className="py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="p-6">
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
                  <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
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
                  Product Management
                </h1>
              </div>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Manage your products, inventory, and pricing
              </p>
            </div>
            <Button
              onClick={handleAddNew}
              className="bg-green-600 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700 text-white"
            >
              Add New Product
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 mb-8">
            <div className="p-8 bg-blue-50 dark:bg-blue-900/20 rounded-lg w-full flex justify-center items-center">
              <div className="flex items-center gap-6 w-full justify-center">
                <div className="h-16 w-16 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <Package className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1 text-center">
                  <p className="text-4xl font-bold text-blue-900 dark:text-blue-300">
                    {data?.totalItems || 0}
                  </p>
                  <p className="text-blue-600 dark:text-blue-400 text-lg font-medium">
                    Total Products
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
                  placeholder="Search products..."
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

          {/* Products Table */}
          <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-gray-200 dark:border-gray-700">
                  <TableHead className="text-gray-900 dark:text-gray-100">
                    Image
                  </TableHead>
                  <TableHead className="text-gray-900 dark:text-gray-100">
                    Product
                  </TableHead>
                  <TableHead className="text-gray-900 dark:text-gray-100">
                    Category
                  </TableHead>
                  <TableHead className="text-gray-900 dark:text-gray-100">
                    Price
                  </TableHead>
                  <TableHead className="text-gray-900 dark:text-gray-100">
                    Stock
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
                {filteredProducts.map((product) => (
                  <TableRow
                    key={product.id}
                    className="border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  >
                    <TableCell>
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="h-12 w-12 object-cover rounded-lg"
                      />
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-gray-100">
                          {product.name}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                          {product.description}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs rounded-full">
                        {product.category?.name || "Uncategorized"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="font-semibold text-green-600 dark:text-green-400">
                        {formatPrice(product.price)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          product.quantity > 10
                            ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300"
                            : product.quantity > 0
                            ? "bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300"
                            : "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300"
                        }`}
                      >
                        {product.quantity}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          product.quantity > 0
                            ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300"
                            : "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300"
                        }`}
                      >
                        {product.quantity > 0 ? "In Stock" : "Out of Stock"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <ProductDropdownMenu
                        product={product}
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
              Are you sure you want to delete this product? This action cannot
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
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
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
                Failed to load products. Please try again later.
              </AlertDescription>
            </Alert>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductList;
