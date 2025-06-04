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
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AlertCircle, Edit, MoreHorizontal, Plus, Search } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

function CategoryDropdownMenu({
  category,
  onEdit,
}: {
  category: any;
  onEdit: (id: string) => void;
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
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

const CategoryList = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [searchTerm, setSearchTerm] = useState("");

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

  return (
    <div className="container mx-auto p-4 lg:p-6">
      <Card className="shadow-md dark:bg-gray-800">
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <CardTitle className="text-2xl font-bold">
                Category Management
              </CardTitle>
              <CardDescription className="dark:text-gray-300">
                List of all product categories
              </CardDescription>
            </div>
            <Button onClick={handleAddNew} className="flex items-center gap-1">
              <Plus size={16} />
              <span>Add Category</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <form
              onSubmit={handleSearch}
              className="relative flex w-full max-w-sm items-center"
            >
              <Input
                type="text"
                placeholder="Search categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10"
              />
              <Button
                type="submit"
                variant="ghost"
                size="icon"
                className="absolute right-0"
              >
                <Search size={18} />
              </Button>
            </form>
          </div>

          {isError && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                Unable to load categories. Please try again later.
              </AlertDescription>
            </Alert>
          )}

          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Image</TableHead>
                  <TableHead>Category Name</TableHead>
                  <TableHead>ID</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  // Skeleton loading state
                  Array(5)
                    .fill(0)
                    .map((_, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Skeleton className="h-12 w-12 rounded-md" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-full max-w-[200px]" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-24" />
                        </TableCell>
                        <TableCell className="text-right">
                          <Skeleton className="h-8 w-8 rounded-full ml-auto" />
                        </TableCell>
                      </TableRow>
                    ))
                ) : filteredCategories.length > 0 ? (
                  filteredCategories.map((category) => (
                    <TableRow key={category.id} className="hover:bg-muted/50">
                      <TableCell>
                        {category.imageUrl ? (
                          <img
                            src={category.imageUrl}
                            alt={category.name}
                            className="h-12 w-12 object-cover rounded-md"
                          />
                        ) : (
                          <div className="h-12 w-12 rounded-md bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                            <span className="text-gray-500 dark:text-gray-400 text-xs">
                              No Image
                            </span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="font-medium">
                        {category.name}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {category.id}
                      </TableCell>
                      <TableCell className="text-right">
                        <CategoryDropdownMenu
                          category={category}
                          onEdit={handleEdit}
                        />
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                      No categories found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {data && data.totalPages > 1 && (
            <Pagination className="mt-4">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setPage((prev) => Math.max(1, prev - 1))}
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
                      onClick={() => setPage(pageNum)}
                      isActive={page === pageNum}
                    >
                      {pageNum}
                    </PaginationLink>
                  </PaginationItem>
                ))}

                <PaginationItem>
                  <PaginationNext
                    onClick={() =>
                      setPage((prev) => Math.min(totalPages, prev + 1))
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
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CategoryList;
