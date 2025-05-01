import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import LoadingPage from "@/components/loading";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Category } from "@/interfaces";
import { X, Search, SlidersHorizontal } from "lucide-react";
import { useGetCategoriesQuery } from "@/api/product/productsApi";
import { ProductFilterProps } from "@/interfaces";

const sortOptions = [
  { id: "price:asc", label: "Price: Low to High" },
  { id: "price:desc", label: "Price: High to Low" },
  { id: "name:asc", label: "Name: A to Z" },
  { id: "name:desc", label: "Name: Z to A" },
  { id: "quantity:asc", label: "Quantity: Low to High" },
  { id: "quantity:desc", label: "Quantity: High to Low" },
  { id: "soldQuantity:asc", label: "Sold Quantity: Low to High" },
  { id: "soldQuantity:desc", label: "Sold Quantity: High to Low" },
];

const ProductFilter: React.FC<ProductFilterProps> = ({
  onApplyFilters,
  onResetFilters,
  initialFilters,
}) => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    initialFilters?.categories || []
  );
  const [searchKeyword, setSearchKeyword] = useState<string>(
    initialFilters?.keyword || ""
  );
  const [sortBy, setSortBy] = useState<string>(initialFilters?.sortBy || "");
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const { data: categoriesData, isLoading } = useGetCategoriesQuery({
    pageNumber: 1,
    pageSize: 50,
  });
  const categories = categoriesData?.items || [];

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchKeyword(e.target.value);
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
    applyFilters(undefined, value);
  };

  const handleCategoryChange = (id: string) => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const resetAll = () => {
    setSelectedCategories([]);
    setSearchKeyword("");
    setSortBy("");
    onResetFilters();
  };

  const applyFilters = (
    event?: React.MouseEvent,
    newSortBy: string = sortBy
  ) => {
    onApplyFilters({
      categories: selectedCategories,
      keyword: searchKeyword,
      sortBy: newSortBy,
      type: [],
      price: "",
    });
    if (event) setIsOpen(false);
  };

  const removeFilter = (
    type: "category" | "keyword" | "sort",
    value: string = ""
  ) => {
    if (type === "category") {
      const newCategories = selectedCategories.filter((c) => c !== value);
      setSelectedCategories(newCategories);
      onApplyFilters({
        categories: newCategories,
        keyword: searchKeyword,
        sortBy,
        type: [],
        price: "",
      });
    } else if (type === "keyword") {
      setSearchKeyword("");
      onApplyFilters({
        categories: selectedCategories,
        keyword: "",
        sortBy,
        type: [],
        price: "",
      });
    } else if (type === "sort") {
      setSortBy("");
      onApplyFilters({
        categories: selectedCategories,
        keyword: searchKeyword,
        sortBy: "",
        type: [],
        price: "",
      });
    }
  };

  const hasActiveFilters =
    selectedCategories.length > 0 || searchKeyword || sortBy;

  return (
    <div className="mb-6">
      <div className="flex flex-col md:flex-row gap-3 mb-4">
        <div className="relative flex-grow">
          <Input
            placeholder="Search products..."
            value={searchKeyword}
            onChange={handleSearchChange}
            className="pl-10 pr-12 h-11"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                applyFilters();
              }
            }}
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center">
            {searchKeyword && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0 mr-1"
                onClick={() => removeFilter("keyword")}
              >
                <X className="h-3 w-3" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0 bg-primary/10 hover:bg-primary/20"
              onClick={() => applyFilters()}
            >
              <Search className="h-4 w-4 text-primary" />
            </Button>
          </div>
        </div>

        <div className="flex gap-2">
          <Select value={sortBy} onValueChange={handleSortChange}>
            <SelectTrigger className="w-full md:w-[180px] h-11">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((opt) => (
                <SelectItem key={opt.id} value={opt.id}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                className="h-11 flex items-center gap-2"
              >
                <SlidersHorizontal className="h-4 w-4" />
                <span className="hidden sm:inline">Filters</span>
                {selectedCategories.length > 0 && (
                  <span className="bg-primary text-primary-foreground rounded-full h-5 w-5 flex items-center justify-center text-xs">
                    {selectedCategories.length}
                  </span>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent className="overflow-y-auto">
              <SheetHeader>
                <SheetTitle>Product Filters</SheetTitle>
                <SheetDescription>Filter products by category</SheetDescription>
              </SheetHeader>

              <div className="py-6 space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium pl-2.5">Categories</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedCategories([])}
                      disabled={selectedCategories.length === 0}
                      className="h-8 text-xs pl-2.5"
                    >
                      Reset Categories
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    {isLoading ? (
                      <p className="text-sm text-muted-foreground">
                        <LoadingPage />
                      </p>
                    ) : (
                      categories.map((cat: Category) => (
                        <div
                          key={cat.id}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={`category-${cat.id}`}
                            checked={selectedCategories.includes(cat.id)}
                            onCheckedChange={() => handleCategoryChange(cat.id)}
                          />
                          <Label
                            htmlFor={`category-${cat.id}`}
                            className="cursor-pointer"
                          >
                            {cat.name}
                          </Label>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              <SheetFooter className="flex-col gap-2 sm:flex-row">
                <Button
                  variant="outline"
                  onClick={resetAll}
                  className="w-full sm:w-auto"
                >
                  Reset All
                </Button>
                <SheetClose asChild>
                  <Button
                    onClick={(e) => applyFilters(e)}
                    className="w-full sm:w-auto"
                  >
                    Apply Filters
                  </Button>
                </SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 mb-4">
          {searchKeyword && (
            <div className="px-3 py-1 bg-accent rounded-full flex items-center gap-1">
              <span className="text-sm">Search: {searchKeyword}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 p-0"
                onClick={() => removeFilter("keyword")}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          )}
          {sortBy && (
            <div className="px-3 py-1 bg-accent rounded-full flex items-center gap-1">
              <span className="text-sm">
                {sortOptions.find((o) => o.id === sortBy)?.label}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 p-0"
                onClick={() => removeFilter("sort")}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          )}
          {selectedCategories.map((id) => (
            <div
              key={id}
              className="px-3 py-1 bg-accent rounded-full flex items-center gap-1"
            >
              <span className="text-sm">
                {categories.find((cat) => cat.id === id)?.name}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 p-0"
                onClick={() => removeFilter("category", id)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs px-2"
              onClick={resetAll}
            >
              Reset All
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductFilter;
