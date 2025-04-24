import React, { useState, useEffect } from "react";
import {
  useGetProductsQuery,
  useSearchByCriteriaQuery,
} from "@/api/product/productsApi";
import LoadingPage from "@/components/loading";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Package, ShoppingBag } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { calculateOriginalPrice } from "@/lib/utils";
import Pagination from "./pagination";
import ProductFilter from "./product-filter";
import { FilterOptions } from "@/interfaces";

const ProductList: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

  const [filters, setFilters] = useState<FilterOptions>({
    type: [],
    price: "",
    categories: [],
    keyword: "",
    sortBy: "",
  });

  const hasFilters =
    filters.type.length > 0 ||
    !!filters.price ||
    (filters.categories && filters.categories.length > 0) ||
    !!filters.keyword ||
    !!filters.sortBy;

  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  const getKeywordsFromFilters = (): string[] => {
    const keywords: string[] = [...filters.type];

    if (filters.price) {
      keywords.push(filters.price);
    }

    if (filters.keyword) {
      keywords.push(filters.keyword);
    }

    return keywords;
  };

  const standardQuery = useGetProductsQuery(
    {
      pageNumber: currentPage,
      pageSize,
    },
    {
      skip: hasFilters,
    }
  );

  const filterQuery = useSearchByCriteriaQuery(
    {
      keyword: getKeywordsFromFilters(),
      category:
        filters.categories && filters.categories.length > 0
          ? filters.categories[0]
          : undefined,
      sortBy: filters.sortBy,
      pageNumber: currentPage,
      pageSize,
    },
    {
      skip: !hasFilters,
    }
  );

  const { data, error, isLoading } = hasFilters ? filterQuery : standardQuery;

  let products = data?.items || [];
  let totalItems = data?.totalItems || 0;
  let totalPages = data?.totalPages || 0;

  if (hasFilters) {
    const allItems = data?.items || [];
    totalItems = allItems.length;
    totalPages = Math.ceil(totalItems / pageSize);
    products = allItems.slice(
      (currentPage - 1) * pageSize,
      currentPage * pageSize
    );
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleApplyFilters = (newFilters: FilterOptions) => {
    setFilters(newFilters);
  };

  const handleResetFilters = () => {
    setFilters({
      type: [],
      price: "",
      categories: [],
      keyword: "",
      sortBy: "",
    });
  };

  if (isLoading) return <LoadingPage />;
  if (error) console.error("Error fetching products:", error);

  return (
    <div className="bg-background text-foreground">
      <div className="mx-auto max-w-2xl p-4 sm:py-6 sm:px-6 lg:max-w-7xl lg:px-8">
        <ProductFilter
          onApplyFilters={handleApplyFilters}
          onResetFilters={handleResetFilters}
          initialFilters={filters}
        />

        {products.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12">
            <h3 className="text-xl font-medium mb-2">No products found</h3>
            <p className="text-muted-foreground text-center mb-4">
              Try adjusting your filter criteria
            </p>
            <Button onClick={handleResetFilters}>Reset Filters</Button>
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <Card
              key={product.id}
              className="group overflow-hidden transition-colors duration-200"
            >
              <div className="relative mx-3 mt-3 flex h-52 sm:h-60 overflow-hidden rounded-xl">
                <img
                  className="peer absolute top-0 right-0 h-full w-full object-cover"
                  src={product.imageUrl}
                  alt={product.name}
                />
                <img
                  className="peer absolute top-0 -right-96 h-full w-full object-cover transition-all delay-100 duration-1000 hover:right-0 peer-hover:right-0"
                  src={product.imageUrl}
                  alt={product.name}
                />
                <div className="absolute top-2 right-2">
                  <Badge className="bg-primary text-primary-foreground">
                    Đã bán: {product.soldQuantity}
                  </Badge>
                </div>
                <svg
                  className="pointer-events-none absolute inset-x-0 bottom-5 mx-auto text-3xl text-white transition-opacity group-hover:animate-ping group-hover:opacity-30 peer-hover:opacity-0"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                  role="img"
                  width="1em"
                  height="1em"
                  preserveAspectRatio="xMidYMid meet"
                  viewBox="0 0 32 32"
                >
                  <path
                    fill="currentColor"
                    d="M2 10a4 4 0 0 1 4-4h20a4 4 0 0 1 4 4v10a4 4 0 0 1-2.328 3.635a2.996 2.996 0 0 0-.55-.756l-8-8A3 3 0 0 0 14 17v7H6a4 4 0 0 1-4-4V10Zm14 19a1 1 0 0 0 1.8.6l2.7-3.6H25a1 1 0 0 0 .707-1.707l-8-8A1 1 0 0 0 16 17v12Z"
                  />
                </svg>
              </div>

              <CardHeader className="pb-2 pt-4">
                <div className="flex justify-between items-start">
                  <h3 className="font-medium line-clamp-2">{product.name}</h3>
                  <Badge variant="outline" className="ml-2 whitespace-nowrap">
                    {product.category.name}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="pb-2">
                <div className="flex flex-col">
                  <div className="flex items-baseline">
                    <span className="text-2xl font-bold">
                      {formatPrice(product.price)}
                    </span>
                    <span className="ml-1 text-sm font-bold">VND</span>
                  </div>
                  <span className="text-sm text-muted-foreground line-through">
                    {formatPrice(calculateOriginalPrice(product.price))} VND
                  </span>

                  <div className="flex items-center mt-2 text-sm text-muted-foreground">
                    <Package className="h-4 w-4 mr-1" />
                    <span>Còn lại: {product.quantity}</span>
                    <ShoppingBag className="h-4 w-4 ml-3 mr-1" />
                    <span>Đã bán: {product.soldQuantity}</span>
                  </div>
                </div>
              </CardContent>

              <CardFooter>
                <Button className="w-full" disabled={product.quantity === 0}>
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  {product.quantity > 0 ? "Add to cart" : "Hết hàng"}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {products.length > 0 && (
          <div className="mt-8">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalItems}
              pageSize={pageSize}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductList;
