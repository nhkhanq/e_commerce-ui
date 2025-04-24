import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useGetProductByIdQuery } from "@/api/product/productsApi";
import LoadingPage from "@/components/loading";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Star,
  ShoppingCart,
  Heart,
  Minus,
  Plus,
  ChevronLeft,
} from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [quantity, setQuantity] = useState(1);

  const {
    data: product,
    error,
    isLoading,
  } = useGetProductByIdQuery(id as string);

  if (isLoading) return <LoadingPage />;
  if (error || !product)
    return (
      <div className="flex flex-col items-start justify-center py-12 px-4">
        <h3 className="text-xl font-medium mb-2">Product not found</h3>
        <p className="text-muted-foreground mb-4">
          The product you're looking for might have been removed or doesn't
          exist.
        </p>
        <Link to="/products">
          <Button>Back to Products</Button>
        </Link>
      </div>
    );

  const handleQuantityChange = (action: "increase" | "decrease") => {
    if (action === "increase" && quantity < product.quantity) {
      setQuantity(quantity + 1);
    } else if (action === "decrease" && quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  return (
    <section className="relative">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-0">
        <div className="mb-6 pt-6">
          <Button
            variant="ghost"
            asChild
            className="flex items-center text-muted-foreground hover:text-primary p-0"
          >
            <Link to="/products">
              <ChevronLeft className="h-5 w-5 mr-1" />
              Back to Products
            </Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 mx-auto max-md:px-2">
          {/* Product Image */}
          <Card className="border-none shadow-none">
            <CardContent className="p-0">
              <div className="img-box h-full max-lg:mx-auto">
                <img
                  src={product.imageUrl}
                  alt={`${product.name} image`}
                  className="max-lg:mx-auto lg:ml-auto h-full object-cover rounded-lg border border-border"
                />
              </div>
            </CardContent>
          </Card>

          {/* Product Details */}
          <div className="data w-full lg:pr-8 pr-0 xl:justify-start justify-center flex items-center max-lg:pb-10 xl:my-2 lg:my-5 my-0">
            <div className="data w-full max-w-xl">
              {/* Category */}
              <Badge variant="outline" className="mb-4">
                {product.category.name}
              </Badge>

              {/* Product Name */}
              <h2 className="font-bold text-3xl text-foreground mb-2 capitalize">
                {product.name}
              </h2>

              {/* Price and Ratings */}
              <div className="flex flex-col sm:flex-row sm:items-center mb-6">
                <h6 className="font-semibold text-2xl text-foreground pr-5 sm:border-r border-border mr-5">
                  {formatPrice(product.price)} VND
                </h6>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star, index) => (
                      <Star
                        key={star}
                        className={`h-5 w-5 ${
                          index < 4
                            ? "fill-yellow-400 text-yellow-400"
                            : "fill-muted text-muted"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="pl-2 text-muted-foreground text-sm">
                    {product.soldQuantity} sold
                  </span>
                </div>
              </div>

              {/* Product Description */}
              <p className="text-muted-foreground text-base mb-5">
                {product.description}
              </p>

              {/* Product Info */}
              <Badge variant="secondary" className="mb-8">
                In stock: {product.quantity} items
              </Badge>

              {/* Quantity Selector */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 py-8 border-t border-border">
                <div className="flex sm:items-center sm:justify-center w-full">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleQuantityChange("decrease")}
                    disabled={quantity <= 1}
                    className="rounded-l-full rounded-r-none h-10"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <div className="font-semibold text-lg h-10 flex items-center justify-center w-full sm:max-w-[118px] border-y border-border bg-transparent text-center">
                    {quantity}
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleQuantityChange("increase")}
                    disabled={quantity >= product.quantity}
                    className="rounded-r-full rounded-l-none h-10"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <Button
                  variant="secondary"
                  disabled={product.quantity === 0}
                  className="rounded-full"
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Add to cart
                </Button>
              </div>

              {/* Buy Now & Favorite Buttons */}
              <div className="flex items-center gap-3">
                <Button
                  variant="secondary"
                  size="icon"
                  className="rounded-full"
                >
                  <Heart className="h-5 w-5 text-primary" />
                </Button>
                <Button
                  disabled={product.quantity === 0}
                  className="w-full rounded-full"
                >
                  Buy Now
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductDetail;
