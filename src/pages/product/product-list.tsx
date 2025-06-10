import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  useGetProductsQuery,
  useSearchProductsQuery,
  useSearchByCriteriaQuery,
} from "@/services/product/productsApi";
import LoadingPage from "@/components/loading";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Package, ShoppingBag, Heart } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { calculateOriginalPrice } from "@/lib/utils";
import Pagination from "./pagination";
import ProductFilter from "./product-filter";
import { FilterOptions } from "@/types";
import AddToCartButton from "@/components/product/add-to-cart-button";
import { toast } from "sonner";
import {
  getFavorites,
  toggleFavorite as toggleProductFavorite,
} from "@/lib/storage-utils";

const ProductList: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;
  const [favorites, setFavorites] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

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

  // Load favorites from storage
  useEffect(() => {
    setMounted(true);
    setFavorites(getFavorites());
  }, []);

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

  const searchQuery = useSearchProductsQuery(
    {
      keyword: filters.keyword || undefined,
      categoryId: filters.categories?.[0] || undefined,
      sortDir: (filters.sortBy as "asc" | "desc") || undefined,
      pageNumber: currentPage,
      pageSize,
    },
    {
      skip: !hasFilters,
    }
  );

  const { data, error, isLoading } = hasFilters ? searchQuery : standardQuery;

  const products = data?.items || [];
  const totalItems = data?.totalItems || 0;
  const totalPages = data?.totalPages || 0;

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

  const handleToggleFavorite = (productId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const isFavorite = favorites.includes(productId);
    const newIsFavorite = toggleProductFavorite(productId);

    // Update local state to match storage
    setFavorites(getFavorites());

    if (newIsFavorite) {
      toast.success("Added to favorites");
    } else {
      toast.success("Removed from favorites");
    }
  };

  if (isLoading) return <LoadingPage />;

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
            <Button
              onClick={handleResetFilters}
              variant="outline"
              className="border-primary text-primary hover:bg-primary/10 hover:text-primary hover:border-primary"
            >
              Reset Filters
            </Button>
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => {
            const isFavorite = favorites.includes(product.id);
            return (
              <Link
                to={`/product/${product.id}`}
                key={product.id}
                className="block"
              >
                <Card className="group overflow-hidden transition-all duration-300 h-full hover:shadow-lg border-border hover:border-green-500/30 dark:hover:border-green-300/30 bg-card">
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

                    {/* Badge area */}
                    <div className="absolute top-2 right-2">
                      <Badge className="bg-orange-500 dark:bg-orange-600 text-white font-medium">
                        Sold: {product.soldQuantity}
                      </Badge>
                    </div>

                    {/* Heart button */}
                    <div className="absolute top-2 left-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={(e) => handleToggleFavorite(product.id, e)}
                        className={`h-8 w-8 bg-white/90 dark:bg-gray-800/90 border backdrop-blur-sm transition-all duration-300 ${
                          isFavorite
                            ? "bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800/50 hover:bg-red-100 dark:hover:bg-red-900/50"
                            : "border-gray-200 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-800/90"
                        }`}
                      >
                        <Heart
                          className={`h-4 w-4 transition-colors duration-300 ${
                            isFavorite
                              ? "text-red-500 fill-red-500 dark:text-red-400 dark:fill-red-400"
                              : "text-gray-500 dark:text-gray-400"
                          }`}
                        />
                      </Button>
                    </div>

                    {/* Hover effect */}
                    <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/60 to-transparent"></div>
                  </div>

                  <CardHeader className="pb-2 pt-4">
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium line-clamp-2 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-300">
                        {product.name}
                      </h3>
                      <Badge
                        variant="outline"
                        className="ml-2 whitespace-nowrap border-green-200 dark:border-green-800/50 text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/20"
                      >
                        {product.category.name}
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="pb-2">
                    <div className="flex flex-col">
                      <div className="flex items-baseline">
                        <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                          {formatPrice(product.price)}
                        </span>
                      </div>
                      <span className="text-sm text-muted-foreground line-through">
                        {formatPrice(calculateOriginalPrice(product.price))}
                      </span>

                      <div className="flex items-center mt-2 text-sm text-muted-foreground">
                        <Package className="h-4 w-4 mr-1 text-green-600 dark:text-green-400" />
                        <span>In stock: {product.quantity}</span>
                        <ShoppingBag className="h-4 w-4 ml-3 mr-1 text-orange-500 dark:text-orange-400" />
                        <span className="text-orange-700 dark:text-orange-400 font-medium">
                          Sold: {product.soldQuantity}
                        </span>
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter>
                    {product.quantity === 0 ? (
                      <Button
                        variant="outline"
                        className="w-full rounded-md bg-transparent text-muted-foreground border-muted"
                        disabled
                      >
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        Out of stock
                      </Button>
                    ) : (
                      <div
                        onClick={(e) => e.preventDefault()}
                        className="w-full"
                      >
                        <AddToCartButton
                          productId={product.id}
                          productName={product.name}
                          productPrice={product.price}
                          productImage={product.imageUrl}
                          maxQuantity={product.quantity}
                        />
                      </div>
                    )}
                  </CardFooter>
                </Card>
              </Link>
            );
          })}
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
