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
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { formatPrice } from "@/lib/utils";
import { CartItem } from "@/types";
import { usePreviewOrderMutation } from "@/services/vouchers/vouchersApi";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const ShoppingCart: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [voucherCode, setVoucherCode] = useState("");
  const [appliedVoucherCode, setAppliedVoucherCode] = useState<string | null>(
    null
  );
  const [totalMoney, setTotalMoney] = useState<number | null>(null);
  const [isApplyingVoucher, setIsApplyingVoucher] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);
  const navigate = useNavigate();

  const [previewOrder, { isLoading: isPreviewLoading }] =
    usePreviewOrderMutation();

  useEffect(() => {
    const loadCartItems = () => {
      try {
        // Only access localStorage in browser environment
        if (typeof window !== "undefined") {
          const storedItems = localStorage.getItem("cart");
          if (storedItems) {
            setCartItems(JSON.parse(storedItems));
          }

          // Load favorites
          const storedFavorites = localStorage.getItem("favorites");
          if (storedFavorites) {
            setFavorites(JSON.parse(storedFavorites));
          }
        }
      } catch (error) {
        console.error("Error loading cart items:", error);
      } finally {
        setIsLoading(false);
        setMounted(true);
      }
    };

    setTimeout(loadCartItems, 800);
  }, []);

  useEffect(() => {
    if (cartItems.length > 0) {
      fetchPreviewOrder();
    } else {
      setTotalMoney(null);
      setError(null);
    }
  }, [cartItems, appliedVoucherCode]);

  const fetchPreviewOrder = async () => {
    try {
      const orderItems = cartItems.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
      }));
      const previewData = await previewOrder({
        orderItems,
        voucherCode: appliedVoucherCode || undefined,
      }).unwrap();
      setTotalMoney(previewData.result.totalMoney);
      setError(null);
    } catch (err) {
      console.error("Error fetching preview order:", err);
      setTotalMoney(calculateManualTotal());
      setError(null); // We'll calculate manually instead of showing an error
    }
  };

  // Backup method to calculate total if the API fails
  const calculateManualTotal = (): number => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;

    const updatedItems = cartItems.map((item) =>
      item.id === id ? { ...item, quantity: newQuantity } : item
    );
    setCartItems(updatedItems);

    // Only access localStorage in browser environment
    if (typeof window !== "undefined") {
      localStorage.setItem("cart", JSON.stringify(updatedItems));
    }
  };

  const removeItem = (id: string) => {
    const updatedItems = cartItems.filter((item) => item.id !== id);
    setCartItems(updatedItems);

    // Only access localStorage in browser environment
    if (typeof window !== "undefined") {
      localStorage.setItem("cart", JSON.stringify(updatedItems));
    }
  };

  const toggleFavorite = (item: CartItem) => {
    try {
      // Only access localStorage in browser environment
      if (typeof window === "undefined") return;

      const productId = item.id;
      const isFavorite = favorites.includes(productId);

      let updatedFavorites: string[];

      if (isFavorite) {
        // Remove from favorites
        updatedFavorites = favorites.filter((id) => id !== productId);
        toast("Removed from favorites", {
          description: `${item.name} removed from your favorites.`,
        });
      } else {
        // Add to favorites
        updatedFavorites = [...favorites, productId];
        toast.success("Added to favorites", {
          description: `${item.name} has been added to your favorites.`,
        });
      }

      setFavorites(updatedFavorites);
      localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
    } catch (err) {
      console.error("Could not update favorites:", err);
      toast.error("Could not update favorites");
    }
  };

  const applyVoucherCode = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!voucherCode) return;

    setIsApplyingVoucher(true);
    try {
      const orderItems = cartItems.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
      }));
      const previewData = await previewOrder({
        orderItems,
        voucherCode,
      }).unwrap();
      setAppliedVoucherCode(voucherCode);
      setTotalMoney(previewData.result.totalMoney);
      setError(null);
      setVoucherCode("");

      // Only access localStorage in browser environment
      if (typeof window !== "undefined") {
        localStorage.setItem("voucherCode", voucherCode);
      }
    } catch (err) {
      console.error("Invalid voucher:", err);
      setError("Invalid voucher code");
      setTotalMoney(calculateManualTotal()); // Fallback to manual calculation
    } finally {
      setIsApplyingVoucher(false);
    }
  };

  useEffect(() => {
    if (cartItems.length === 0) {
      setTotalMoney(null);
      setError(null);
      setAppliedVoucherCode(null);

      // Only access localStorage in browser environment
      if (typeof window !== "undefined") {
        localStorage.removeItem("voucherCode");
      }
    }
  }, [cartItems]);

  if (isLoading || !mounted) {
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
          <ShoppingBag className="h-6 w-6 text-green-600 dark:text-green-500" />
          Shopping Cart
        </h2>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            {cartItems.length === 0 ? (
              <Alert className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800/30">
                <AlertDescription className="flex flex-col items-center justify-center py-8">
                  <h3 className="mb-2 text-lg font-medium text-green-800 dark:text-green-300">
                    Your cart is empty
                  </h3>
                  <p className="text-green-600/80 dark:text-green-400/80">
                    Add some organic products to your cart
                  </p>
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
                                onClick={() => toggleFavorite(item)}
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
                                onClick={() => removeItem(item.id)}
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
                                  updateQuantity(item.id, item.quantity - 1)
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
                                  updateQuantity(item.id, item.quantity + 1)
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
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                <div className="flex items-center justify-between font-bold">
                  <span className="text-green-800 dark:text-green-300">
                    Total
                  </span>
                  {isPreviewLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin text-green-600 dark:text-green-500" />
                  ) : (
                    <span className="text-green-800 dark:text-green-300">
                      {totalMoney ? formatPrice(totalMoney) : "0 ₫"}
                    </span>
                  )}
                </div>
                {appliedVoucherCode && (
                  <div className="text-sm text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 p-2 rounded border border-green-100 dark:border-green-800/30">
                    Voucher applied:{" "}
                    <span className="font-medium">{appliedVoucherCode}</span>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex flex-col space-y-4 bg-green-50/50 dark:bg-green-900/10 border-t border-green-100 dark:border-green-800/30 pt-6">
                <Button
                  className="w-full bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 text-white"
                  disabled={
                    cartItems.length === 0 || isPreviewLoading || !totalMoney
                  }
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

            <Card className="border-green-100 dark:border-green-800/30 overflow-hidden">
              <CardHeader className="bg-orange-50/50 dark:bg-orange-900/20 border-b border-orange-100 dark:border-orange-800/30">
                <CardTitle className="text-base text-orange-800 dark:text-orange-300">
                  Voucher Code
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div>
                  <div className="mb-2 text-sm text-orange-700 dark:text-orange-400">
                    Do you have a voucher or gift card?
                  </div>
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      value={voucherCode}
                      onChange={(e) => setVoucherCode(e.target.value)}
                      placeholder="Enter code"
                      className="flex-1 border-orange-200 dark:border-orange-800/50 focus-visible:ring-orange-500 dark:focus-visible:ring-orange-600"
                    />
                    <Button
                      onClick={applyVoucherCode}
                      disabled={
                        !voucherCode || isApplyingVoucher || isPreviewLoading
                      }
                      className="bg-orange-600 hover:bg-orange-700 dark:bg-orange-700 dark:hover:bg-orange-600 text-white"
                    >
                      {isApplyingVoucher && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      Apply
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ShoppingCart;
