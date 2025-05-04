import React, { useEffect, useState } from "react";
import { Minus, Plus, Heart, X, ArrowRight, Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { formatPrice } from "@/lib/utils";
import { CartItem } from "@/interfaces";

const ShoppingCart: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [voucherCode, setVoucherCode] = useState("");
  const [isApplyingVoucher, setIsApplyingVoucher] = useState(false);

  useEffect(() => {
    const loadCartItems = () => {
      try {
        const storedItems = localStorage.getItem("cart");
        if (storedItems) {
          setCartItems(JSON.parse(storedItems));
        }
      } catch (error) {
        console.error("Error loading cart items:", error);
      } finally {
        setIsLoading(false);
      }
    };

    setTimeout(loadCartItems, 800);
  }, []);

  const originalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const shipping = 20000;
  const tax = Math.round(originalPrice * 0.1);
  const total = originalPrice + shipping + tax;

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;

    const updatedItems = cartItems.map((item) =>
      item.id === id ? { ...item, quantity: newQuantity } : item
    );

    setCartItems(updatedItems);
    localStorage.setItem("cart", JSON.stringify(updatedItems));
  };

  // Remove item from cart
  const removeItem = (id: string) => {
    const updatedItems = cartItems.filter((item) => item.id !== id);
    setCartItems(updatedItems);
    localStorage.setItem("cart", JSON.stringify(updatedItems));
  };

  // fake api vouchers
  const applyVoucherCode = (e: React.FormEvent) => {
    e.preventDefault();
    setIsApplyingVoucher(true);

    // mock API
    setTimeout(() => {
      console.log("Applying voucher code:", voucherCode);
      setIsApplyingVoucher(false);
      setVoucherCode("");
    }, 1000);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <section className="bg-background py-8 md:py-16">
      <div className="container max-w-screen-xl mx-auto px-4 2xl:px-0">
        <h2 className="text-2xl font-bold text-foreground mb-6">
          Shopping Cart
        </h2>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            {cartItems.length === 0 ? (
              <Alert>
                <AlertDescription className="flex flex-col items-center justify-center py-8">
                  <h3 className="mb-2 text-lg font-medium">
                    Your cart is empty
                  </h3>
                  <p className="text-muted-foreground">
                    Add some products to your cart
                  </p>
                </AlertDescription>
              </Alert>
            ) : (
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <Card key={item.id}>
                    <CardContent className="p-4 md:p-6">
                      <div className="flex flex-col md:flex-row md:items-center gap-6">
                        <div className="shrink-0">
                          <img
                            className="h-20 w-20 object-cover rounded"
                            src={item.imageUrl}
                            alt={item.name}
                          />
                        </div>

                        <div className="flex-1 space-y-2">
                          <h3 className="text-base font-medium hover:underline cursor-pointer">
                            {item.name}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {formatPrice(item.price)} / item
                          </p>

                          <div className="flex items-center gap-4 pt-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 px-2 text-muted-foreground"
                            >
                              <Heart className="h-4 w-4 mr-1.5" />
                              Save
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
                          <div className="flex items-center border rounded">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-none"
                              onClick={() =>
                                updateQuantity(item.id, item.quantity - 1)
                              }
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-10 text-center text-sm font-medium">
                              {item.quantity}
                            </span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-none"
                              onClick={() =>
                                updateQuantity(item.id, item.quantity + 1)
                              }
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          <div className="text-right w-24">
                            <p className="font-bold">
                              {formatPrice(item.price * item.quantity)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">
                      Original price
                    </span>
                    <span>{formatPrice(originalPrice)}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>{formatPrice(shipping)}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Tax</span>
                    <span>{formatPrice(tax)}</span>
                  </div>
                </div>

                <Separator />

                <div className="flex items-center justify-between font-bold">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4">
                <Button className="w-full" disabled={cartItems.length === 0}>
                  Proceed to Checkout
                </Button>

                <div className="flex items-center justify-center gap-2 text-sm">
                  <span className="text-muted-foreground">or</span>
                  <Button
                    variant="link"
                    className="h-auto p-0 flex items-center gap-1"
                  >
                    Continue Shopping
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Voucher Code</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="mb-2 text-sm">
                    Do you have a voucher or gift card?
                  </div>
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      value={voucherCode}
                      onChange={(e) => setVoucherCode(e.target.value)}
                      placeholder="Enter code"
                      className="flex-1"
                    />
                    <Button
                      onClick={applyVoucherCode}
                      disabled={!voucherCode || isApplyingVoucher}
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
