import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useGetProductByIdQuery } from "@/services/product/productsApi";
import LoadingPage from "@/components/loading";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ShoppingCart,
  Heart,
  Minus,
  Plus,
  ChevronLeft,
  Leaf,
  DollarSign,
  ShoppingBag,
  Package,
} from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { CartItem } from "@/types";

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [quantity, setQuantity] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [mounted, setMounted] = useState(false);

  const {
    data: product,
    error,
    isLoading,
  } = useGetProductByIdQuery(id as string);

  useEffect(() => {
    if (product) {
      setTotalPrice(product.price * quantity);
    }
  }, [product, quantity]);

  useEffect(() => {
    setMounted(true);

    if (product && typeof window !== "undefined") {
      const stored = localStorage.getItem("favorites");
      const favs: string[] = stored ? JSON.parse(stored) : [];
      setIsFavorite(favs.includes(product.id));
    }
  }, [product]);

  if (isLoading) return <LoadingPage />;
  if (error || !product) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4">
        <h3 className="text-xl font-medium mb-2">Product not found</h3>
        <p className="text-muted-foreground mb-4">
          The product you're looking for might have been removed or doesn't
          exist.
        </p>
        <Link to="/product-list">
          <Button className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600">
            <ChevronLeft className="h-5 w-5 mr-1" />
            Back to Products
          </Button>
        </Link>
      </div>
    );
  }

  const handleQuantityChange = (type: "increase" | "decrease") => {
    if (type === "increase" && quantity < product.quantity) {
      setQuantity((prev) => prev + 1);
    } else if (type === "decrease" && quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleAddToCart = () => {
    try {
      // Check if we're in browser environment
      if (typeof window === "undefined") return;

      const stored = localStorage.getItem("cart");
      const cart: CartItem[] = stored ? JSON.parse(stored) : [];
      const existing = cart.find((item) => item.id === product.id);

      if (existing) {
        existing.quantity += quantity;
      } else {
        cart.push({
          id: product.id,
          name: product.name,
          price: product.price,
          imageUrl: product.imageUrl,
          quantity,
        });
      }

      localStorage.setItem("cart", JSON.stringify(cart));
      toast.success("Added to cart", {
        description: `${product.name} x${quantity} added to your cart.`,
      });
    } catch (err) {
      console.error(err);
      toast.error("Could not add to cart");
    }
  };

  const handleToggleFavorite = () => {
    if (!product) return;
    try {
      // Check if we're in browser environment
      if (typeof window === "undefined") return;

      const stored = localStorage.getItem("favorites");
      let favs: string[] = stored ? JSON.parse(stored) : [];

      if (isFavorite) {
        favs = favs.filter((pid) => pid !== product.id);
        localStorage.setItem("favorites", JSON.stringify(favs));
        setIsFavorite(false);
        toast("Removed from favorites", {
          description: `${product.name} removed from your favorites.`,
        });
      } else {
        favs.push(product.id);
        localStorage.setItem("favorites", JSON.stringify(favs));
        setIsFavorite(true);
        toast.success("Added to favorites", {
          description: `${product.name} has been added to your favorites.`,
        });
      }
    } catch (err) {
      console.error(err);
      toast.error("Could not update favorites");
    }
  };

  // Prevent hydration mismatch by not rendering favorites until mounted
  if (!mounted) {
    return <LoadingPage />;
  }

  return (
    <section className="relative bg-background text-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button - positioned left */}
        <div className="mb-6 text-left">
          <Button
            variant="outline"
            asChild
            className="border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/30 hover:text-green-800 dark:hover:text-green-300 flex items-center"
          >
            <Link to="/product-list">
              <ChevronLeft className="h-5 w-5 mr-1" /> Back to Products
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16">
          {/* Product Image with decorative elements */}
          <Card className="border-none shadow-none relative group">
            <CardContent className="p-0">
              <div className="relative overflow-hidden rounded-lg">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-auto object-cover rounded-lg border border-border transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-4 right-4">
                  <Badge className="bg-orange-500 dark:bg-orange-600 text-white">
                    <ShoppingBag className="h-3 w-3 mr-1" />
                    Sold: {product.soldQuantity}
                  </Badge>
                </div>
                <div className="absolute top-4 left-4">
                  <Badge className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-800">
                    <Leaf className="h-3 w-3 mr-1" />
                    Organic
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Product Details */}
          <div className="flex flex-col justify-center">
            <Badge
              variant="outline"
              className="mb-4 self-start border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/20"
            >
              {product.category.name}
            </Badge>

            <h2 className="font-bold text-3xl sm:text-4xl mb-4 capitalize text-gray-800 dark:text-gray-100">
              {product.name}
            </h2>

            {/* Price & Total */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6 p-4 rounded-lg bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-2">
                <DollarSign className="h-6 w-6 text-green-600 dark:text-green-400" />
                <span className="font-bold text-2xl sm:text-3xl text-green-600 dark:text-green-400">
                  {formatPrice(product.price)}
                </span>
              </div>

              <div className="h-8 w-px bg-gray-300 dark:bg-gray-700 hidden sm:block"></div>

              <div className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-orange-500 dark:text-orange-400" />
                <span className="font-medium text-xl">
                  Total: {formatPrice(totalPrice)}
                </span>
              </div>

              <div className="hidden sm:flex items-center gap-2 text-gray-500 dark:text-gray-400 ml-auto">
                <ShoppingBag className="h-4 w-4" />
                <span className="text-sm">{product.soldQuantity} sold</span>
              </div>
            </div>

            <div className="mb-5 prose dark:prose-invert max-w-none">
              <p className="text-gray-600 dark:text-gray-300">
                {product.description}
              </p>
            </div>

            <div className="flex items-center gap-2 mb-8">
              <Package className="h-5 w-5 text-green-600 dark:text-green-400" />
              <Badge
                variant="outline"
                className="border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400"
              >
                In stock: {product.quantity}
              </Badge>
            </div>

            {/* Quantity Selector & Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-6 border-t border-border">
              <div className="flex items-center justify-center sm:justify-start">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleQuantityChange("decrease")}
                  disabled={quantity <= 1}
                  className="h-10 w-10 flex items-center justify-center rounded-l-full cursor-pointer border-gray-300 dark:border-gray-700"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="h-10 flex items-center justify-center px-6 border-y border-gray-300 dark:border-gray-700 font-medium">
                  {quantity}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleQuantityChange("increase")}
                  disabled={quantity >= product.quantity}
                  className="h-10 w-10 flex items-center justify-center rounded-r-full cursor-pointer border-gray-300 dark:border-gray-700"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <Button
                onClick={handleAddToCart}
                disabled={product.quantity === 0}
                className="w-full rounded-full h-10 cursor-pointer bg-orange-500 hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-500 text-white"
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                Add to cart
              </Button>
            </div>

            <div className="flex items-center gap-4 mt-4">
              <Button
                variant="outline"
                size="icon"
                onClick={handleToggleFavorite}
                className={`h-10 w-10 flex items-center justify-center rounded-full cursor-pointer ${
                  isFavorite
                    ? "bg-red-100 dark:bg-red-900/30 border-red-200 dark:border-red-800"
                    : "border-gray-300 dark:border-gray-700"
                }`}
              >
                <Heart
                  className={`h-5 w-5 ${
                    isFavorite
                      ? "text-red-500 fill-red-500 dark:text-red-400 dark:fill-red-400"
                      : "text-gray-500 dark:text-gray-400"
                  }`}
                />
              </Button>

              <Button
                disabled={product.quantity === 0}
                className="flex-1 h-10 rounded-full cursor-pointer bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 text-white"
              >
                Buy Now
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductDetail;
