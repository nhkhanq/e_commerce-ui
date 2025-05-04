import React, { useState, useEffect } from "react";
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
import { toast } from "sonner";
import { CartItem } from "@/interfaces";

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [quantity, setQuantity] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

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
    if (product) {
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
          <Button>Back to Products</Button>
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

  return (
    <section className="relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <div className="mb-6 pt-6">
          <Button
            variant="ghost"
            asChild
            className="flex items-center text-muted-foreground hover:text-primary p-0"
          >
            <Link to="/product-list">
              <ChevronLeft className="h-5 w-5 mr-1" /> Back to Products
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16">
          {/* Product Image */}
          <Card className="border-none shadow-none">
            <CardContent className="p-0">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-auto object-cover rounded-lg border border-border"
              />
            </CardContent>
          </Card>

          {/* Product Details */}
          <div className="flex flex-col justify-center">
            <Badge variant="outline" className="mb-4">
              {product.category.name}
            </Badge>

            <h2 className="font-extrabold text-3xl sm:text-4xl mb-2 capitalize bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-red-500">
              {product.name}
            </h2>

            {/* Price & Total */}
            <div className="flex flex-col sm:flex-row sm:items-center mb-6">
              <span className="font-extrabold text-2xl sm:text-3xl pr-5 sm:border-r border-border mr-5">
                {formatPrice(product.price)} VND
              </span>
              <span className="font-semibold text-xl sm:text-2xl mr-5">
                Total: {formatPrice(totalPrice)} VND
              </span>
              <div className="flex items-center gap-2">
                {[...Array(5)].map((_, idx) => (
                  <Star
                    key={idx}
                    className={`h-5 w-5 ${
                      idx < 4
                        ? "fill-yellow-400 text-yellow-400"
                        : "fill-muted text-muted"
                    }`}
                  />
                ))}
                <span className="pl-2 text-muted-foreground text-sm">
                  {product.soldQuantity} sold
                </span>
              </div>
            </div>

            <p className="text-muted-foreground text-base mb-5">
              {product.description}
            </p>
            <Badge variant="secondary" className="mb-8">
              In stock: {product.quantity}
            </Badge>

            {/* Quantity Selector & Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-8 border-t border-border">
              <div className="flex items-center justify-center">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleQuantityChange("decrease")}
                  disabled={quantity <= 1}
                  className="h-10 w-10 flex items-center justify-center rounded-l-full cursor-pointer"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="h-10 flex items-center justify-center px-4 border-y border-border">
                  {quantity}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleQuantityChange("increase")}
                  disabled={quantity >= product.quantity}
                  className="h-10 w-10 flex items-center justify-center rounded-r-full cursor-pointer"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <Button
                variant="secondary"
                onClick={handleAddToCart}
                disabled={product.quantity === 0}
                className="w-full rounded-full h-10 cursor-pointer"
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                Add to cart
              </Button>
            </div>

            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="icon"
                onClick={handleToggleFavorite}
                className={`h-10 w-10 flex items-center justify-center rounded-full cursor-pointer ${
                  isFavorite ? "bg-red-100" : ""
                }`}
              >
                <Heart
                  className={`h-5 w-5 ${
                    isFavorite ? "text-red-500 fill-red-500" : "text-gray-500"
                  }`}
                />
              </Button>

              <Button
                disabled={product.quantity === 0}
                className="flex-1 h-10 rounded-full cursor-pointer"
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
