import React, { useEffect, useState } from "react";
import {
  Minus,
  Plus,
  Heart,
  X,
  ArrowRight,
  Loader2,
  ShoppingBag,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { formatPrice } from "@/lib/utils";
import { CartItem } from "@/types";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  getStoredCart,
  setStoredCart,
  getFavorites,
  setFavorites,
  toggleFavorite as toggleProductFavorite,
} from "@/lib/storage-utils";

const ShoppingCart: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setMounted(true);

    if (typeof window !== "undefined") {
      setCartItems(getStoredCart());
      setFavorites(getFavorites());
    }
  }, []);

  const calculateTotal = (): number => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  const updateCartItem = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeCartItem(id);
      return;
    }

    const updatedItems = cartItems.map((item) =>
      item.id === id ? { ...item, quantity: newQuantity } : item
    );
    setCartItems(updatedItems);

    if (typeof window !== "undefined") {
      setStoredCart(updatedItems);
    }
  };

  const removeCartItem = (id: string) => {
    const updatedItems = cartItems.filter((item) => item.id !== id);
    setCartItems(updatedItems);

    if (typeof window !== "undefined") {
      setStoredCart(updatedItems);
    }
    toast.success("Removed product from cart");
  };

  const handleToggleFavorite = (item: CartItem) => {
    if (typeof window === "undefined") return;

    const newIsFavorite = toggleProductFavorite(item.id);
    setFavorites(getFavorites());

    if (newIsFavorite) {
      toast.success("Added to favorites", {
        description: `${item.name} has been added to your favorites.`,
      });
    } else {
      toast("Removed from favorites", {
        description: `${item.name} removed from your favorites.`,
      });
    }
  };

  if (!mounted) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-green-600 dark:text-green-500" />
      </div>
    );
  }

  return (
    <section className="bg-background py-8 md:py-16">
      <div className="container max-w-screen-xl mx-auto px-4 2xl:px-0">
        <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
          Shopping Cart
        </h2>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            {cartItems.length === 0 ? (
              <Alert className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800/30">
                <ShoppingBag className="h-4 w-4 text-green-600 dark:text-green-500" />
                <AlertDescription className="text-green-800 dark:text-green-300">
                  Your cart is empty. Start shopping to add products!
                </AlertDescription>
              </Alert>
            ) : (
              <div className="space-y-4">
                {cartItems.map((item) => {
                  const isFavorite = favorites.includes(item.id);
                  return (
                    <Card
                      key={item.id}
                      className="border-green-100 dark:border-green-800/30 overflow-hidden"
                    >
                      <CardContent className="p-4 md:p-6">
                        <div className="flex flex-col md:flex-row md:items-center gap-6">
                          <div className="shrink-0">
                            <img
                              className="h-20 w-20 object-cover rounded border-2 border-green-100 dark:border-green-800/30"
                              src={item.imageUrl}
                              alt={item.name}
                            />
                          </div>

                          <div className="flex-1 space-y-2">
                            <h3 className="text-base font-medium text-green-800 dark:text-green-300 hover:text-green-600 dark:hover:text-green-400 hover:underline cursor-pointer">
                              {item.name}
                            </h3>
                            <p className="text-sm text-green-600/80 dark:text-green-400/80">
                              {formatPrice(item.price)} / item
                            </p>

                            <div className="flex items-center gap-4 pt-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                className={`h-8 px-2 ${
                                  isFavorite
                                    ? "text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20"
                                    : "text-green-600 hover:text-green-700 hover:bg-green-50 dark:text-green-400 dark:hover:text-green-300 dark:hover:bg-green-900/30"
                                }`}
                                onClick={() => handleToggleFavorite(item)}
                              >
                                <Heart
                                  className={`h-4 w-4 mr-1.5 ${
                                    isFavorite ? "fill-red-500" : ""
                                  }`}
                                />
                                {isFavorite ? "Saved" : "Save"}
                              </Button>

                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 px-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                                onClick={() => removeCartItem(item.id)}
                              >
                                <X className="h-4 w-4 mr-1.5" />
                                Remove
                              </Button>
                            </div>
                          </div>

                          <div className="flex items-center justify-between md:justify-end gap-4">
                            <div className="flex items-center border rounded border-green-200 dark:border-green-800/50">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 rounded-none text-green-700 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/30"
                                onClick={() =>
                                  updateCartItem(item.id, item.quantity - 1)
                                }
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="w-10 text-center text-sm font-medium text-green-800 dark:text-green-300">
                                {item.quantity}
                              </span>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 rounded-none text-green-700 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/30"
                                onClick={() =>
                                  updateCartItem(item.id, item.quantity + 1)
                                }
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                            <div className="text-right w-24">
                              <p className="font-bold text-green-800 dark:text-green-300">
                                {formatPrice(item.price * item.quantity)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <Card className="border-green-100 dark:border-green-800/30 overflow-hidden">
              <CardHeader className="bg-green-50/50 dark:bg-green-900/20 border-b border-green-100 dark:border-green-800/30">
                <CardTitle className="text-green-800 dark:text-green-300">
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="flex items-center justify-between font-bold">
                  <span className="text-green-800 dark:text-green-300">
                    Total
                  </span>
                  <span className="text-green-800 dark:text-green-300">
                    {formatPrice(calculateTotal())}
                  </span>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4 bg-green-50/50 dark:bg-green-900/10 border-t border-green-100 dark:border-green-800/30 pt-6">
                <Button
                  className="w-full bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 text-white"
                  disabled={cartItems.length === 0}
                  onClick={() => navigate("/payment")}
                >
                  Proceed to Checkout
                </Button>

                <div className="flex items-center justify-center gap-2 text-sm">
                  <span className="text-green-600/80 dark:text-green-400/80">
                    or
                  </span>
                  <Button
                    variant="link"
                    className="h-auto p-0 flex items-center gap-1 text-orange-600 hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300"
                    onClick={() => navigate("/product-list")}
                  >
                    Continue Shopping
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ShoppingCart;
