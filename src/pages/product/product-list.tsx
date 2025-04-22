import React from "react";
import { useGetProductsQuery } from "@/api/product/productsApi";
import LoadingPage from "@/components/loading";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

const ProductList: React.FC = () => {
  const { data: products, error, isLoading } = useGetProductsQuery();

  if (isLoading) return <LoadingPage />;
  if (error) console.error("Error fetching products:", error);

  return (
    <div className="bg-background text-foreground">
      <div className="mx-auto max-w-2xl p-4 sm:p-6 lg:max-w-7xl lg:p-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products?.map((product) => (
            <Card key={product.id} className="group">
              <CardHeader>
                <CardTitle className="line-clamp-5 mb-1">
                  {product.name}
                </CardTitle>
                <CardDescription>{product.category.name}</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <img
                  alt={product.name}
                  src={product.imageUrl}
                  className="w-full aspect-square object-cover rounded-t-md bg-muted group-hover:opacity-75"
                />
                <div className="mt-2 flex justify-between items-center px-4">
                  <span className="font-medium">{product.price} VND</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductList;
