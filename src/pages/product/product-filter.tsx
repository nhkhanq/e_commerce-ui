import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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
import { X, Search, SlidersHorizontal, Leaf } from "lucide-react";
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
  const [selectedCategory, setSelectedCategory] = useState<string>(
    initialFilters?.categories?.[0] || ""
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
    setSelectedCategory(id);
  };

  const resetAll = () => {
    setSelectedCategory("");
    setSearchKeyword("");
    setSortBy("");
    onResetFilters();
  };

  const applyFilters = (
    event?: React.MouseEvent,
    newSortBy: string = sortBy
  ) => {
    onApplyFilters({
      categories: selectedCategory ? [selectedCategory] : [],
      keyword: searchKeyword,
      sortBy: newSortBy,
      type: [],
      price: "",
    });
    if (event) setIsOpen(false);
  };

  const removeFilter = (type: "category" | "keyword" | "sort") => {
    if (type === "category") {
      setSelectedCategory("");
      onApplyFilters({
        categories: [],
        keyword: searchKeyword,
        sortBy,
        type: [],
        price: "",
      });
    } else if (type === "keyword") {
      setSearchKeyword("");
      onApplyFilters({
        categories: selectedCategory ? [selectedCategory] : [],
        keyword: "",
        sortBy,
        type: [],
        price: "",
      });
    } else if (type === "sort") {
      setSortBy("");
      onApplyFilters({
        categories: selectedCategory ? [selectedCategory] : [],
        keyword: searchKeyword,
        sortBy: "",
        type: [],
        price: "",
      });
    }
  };

  const hasActiveFilters = selectedCategory || searchKeyword || sortBy;

  return (
    <div className="mb-6">
      <div className="flex flex-col md:flex-row gap-3 mb-4">
        <div className="relative flex-grow">
          <Input
            placeholder="Search products..."
            value={searchKeyword}
            onChange={handleSearchChange}
            className="pl-10 pr-12 h-11 border-green-200 dark:border-green-800/50 focus-visible:ring-green-500 dark:focus-visible:ring-green-600 focus-visible:ring-offset-green-50 dark:focus-visible:ring-offset-gray-900"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                applyFilters();
              }
            }}
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-600 dark:text-green-400" />
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center">
            {searchKeyword && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0 mr-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                onClick={() => removeFilter("keyword")}
              >
                <X className="h-3 w-3" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0 bg-green-100 hover:bg-green-200 dark:bg-green-800/30 dark:hover:bg-green-800/50"
              onClick={() => applyFilters()}
            >
              <Search className="h-4 w-4 text-green-700 dark:text-green-400" />
            </Button>
          </div>
        </div>

        <div className="flex gap-2">
          <Select value={sortBy} onValueChange={handleSortChange}>
            <SelectTrigger className="w-full md:w-[180px] h-11 border-green-200 dark:border-green-800/50 focus:ring-green-500 dark:focus:ring-green-600">
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
                className="h-11 flex items-center gap-2 border-green-200 dark:border-green-800/50 text-green-700 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/30 hover:text-green-800 dark:hover:text-green-300"
              >
                <SlidersHorizontal className="h-4 w-4" />
                <span className="hidden sm:inline">Filters</span>
                {selectedCategory && (
                  <span className="bg-orange-500 dark:bg-orange-600 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs">
                    1
                  </span>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent className="overflow-y-auto border-l border-green-200 dark:border-green-800/50">
              <SheetHeader>
                <SheetTitle className="text-green-700 dark:text-green-400 flex items-center gap-2">
                  <Leaf className="h-5 w-5" />
                  Product Filters
                </SheetTitle>
                <SheetDescription>
                  Filter organic products by category
                </SheetDescription>
              </SheetHeader>

              <div className="py-6 space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium pl-2.5 text-green-700 dark:text-green-400">
                      Categories
                    </h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedCategory("")}
                      disabled={!selectedCategory}
                      className="h-8 text-xs pl-2.5 text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 hover:bg-orange-50 dark:hover:bg-orange-900/20"
                    >
                      Reset Category
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    {isLoading ? (
                      <p className="text-sm text-muted-foreground">
                        <LoadingPage />
                      </p>
                    ) : (
                      <RadioGroup
                        value={selectedCategory}
                        onValueChange={handleCategoryChange}
                      >
                        {categories.map((cat: Category) => (
                          <div
                            key={cat.id}
                            className="flex items-center space-x-2 p-2 rounded-md hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
                          >
                            <RadioGroupItem
                              id={`category-${cat.id}`}
                              value={cat.id}
                              className="border-green-300 dark:border-green-700 text-green-600 dark:text-green-400"
                            />
                            <Label
                              htmlFor={`category-${cat.id}`}
                              className="cursor-pointer text-gray-700 dark:text-gray-200 w-full"
                            >
                              {cat.name}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    )}
                  </div>
                </div>
              </div>

              <SheetFooter className="flex-col gap-2 sm:flex-row">
                <Button
                  variant="outline"
                  onClick={resetAll}
                  className="w-full sm:w-auto border-orange-200 dark:border-orange-800/50 text-orange-700 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/30 hover:text-orange-800 dark:hover:text-orange-300"
                >
                  Reset All
                </Button>
                <SheetClose asChild>
                  <Button
                    onClick={(e) => applyFilters(e)}
                    className="w-full sm:w-auto bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 text-white"
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
            <div className="px-3 py-1 bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-800/50 rounded-full flex items-center gap-1">
              <span className="text-sm">Search: {searchKeyword}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 p-0 hover:bg-green-100 dark:hover:bg-green-800/50"
                onClick={() => removeFilter("keyword")}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          )}
          {sortBy && (
            <div className="px-3 py-1 bg-orange-50 dark:bg-orange-900/20 text-orange-800 dark:text-orange-300 border border-orange-200 dark:border-orange-800/50 rounded-full flex items-center gap-1">
              <span className="text-sm">
                {sortOptions.find((o) => o.id === sortBy)?.label}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 p-0 hover:bg-orange-100 dark:hover:bg-orange-800/50"
                onClick={() => removeFilter("sort")}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          )}
          {selectedCategory && (
            <div className="px-3 py-1 bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-800/50 rounded-full flex items-center gap-1">
              <span className="text-sm">
                {categories.find((cat) => cat.id === selectedCategory)?.name}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 p-0 hover:bg-green-100 dark:hover:bg-green-800/50"
                onClick={() => removeFilter("category")}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          )}
          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              className="h-7 text-xs px-2 border-red-200 dark:border-red-800/50 text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-800 dark:hover:text-red-300"
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
