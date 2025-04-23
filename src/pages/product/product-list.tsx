import React from "react";
import { useGetProductsQuery } from "@/api/product/productsApi";
import LoadingPage from "@/components/loading";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { calculateOriginalPrice } from "@/lib/utils";

const ProductList: React.FC = () => {
  const { data: products, error, isLoading } = useGetProductsQuery();

  if (isLoading) return <LoadingPage />;
  if (error) console.error("Error fetching products:", error);

  return (
    <div className="bg-background text-foreground">
      <div className="mx-auto max-w-2xl p-4 sm:p-6 lg:max-w-7xl lg:p-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products?.map((product) => (
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
                </div>
              </CardContent>

              <CardFooter>
                <Button className="w-full">
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Add to cart
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductList;
