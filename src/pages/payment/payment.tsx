import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { useCreateOrderMutation } from "@/api/orders/ordersApi";
import { OrderReq, OrderItemReq } from "@/interfaces/order";
import OrderSummary from "@/components/order/OrderSummary";
import VNPayButton from "@/components/payment/VNPayButton";
import { CartItem } from "@/interfaces";

const PaymentPage = () => {
  const navigate = useNavigate();
  const [createOrder] = useCreateOrderMutation();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [totalAmount, setTotalAmount] = useState(0);

  const [formData, setFormData] = useState<OrderReq>({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    note: "",
    paymentMethod: "CASH",
    orderItems: [],
    voucherCode: "",
  });

  useEffect(() => {
    // Load cart items from localStorage
    const loadCartItems = () => {
      try {
        const storedItems = localStorage.getItem("cart");
        if (storedItems) {
          const items = JSON.parse(storedItems);
          setCartItems(items);

          // Calculate total amount
          const total = items.reduce((sum: number, item: CartItem) => {
            return sum + item.price * item.quantity;
          }, 0);
          setTotalAmount(total);

          // Convert cart items to order items
          const orderItems: OrderItemReq[] = items.map((item: CartItem) => ({
            productId: item.id,
            quantity: item.quantity,
          }));

          setFormData((prev) => ({
            ...prev,
            orderItems,
          }));
        }
      } catch (error) {
        console.error("Error loading cart items:", error);
        toast.error("Failed to load cart items");
      }
    };

    loadCartItems();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev: OrderReq) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePaymentMethodChange = (value: string) => {
    setFormData((prev: OrderReq) => ({
      ...prev,
      paymentMethod: value as "CASH" | "VN_PAY",
    }));
  };

  const handleVoucherChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev: OrderReq) => ({
      ...prev,
      voucherCode: e.target.value,
    }));
    localStorage.setItem("voucherCode", e.target.value);
  };

  // Handle cash payment - direct order creation
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Only proceed if payment method is CASH
    if (formData.paymentMethod !== "CASH") {
      return;
    }

    try {
      const response = await createOrder(formData).unwrap();
      if (response.code === 200) {
        // Clear cart and voucher after successful order
        localStorage.removeItem("cart");
        localStorage.removeItem("voucherCode");
        toast.success("Order created successfully");
        navigate("/orders");
      }
    } catch (error) {
      console.error("Order creation error:", error);
      toast.error("Failed to create order");
    }
  };

  const handlePaymentSuccess = () => {
    // This will be called after VNPay redirect initialization
    localStorage.removeItem("cart");
    localStorage.removeItem("voucherCode");
    toast.success("Payment initiated successfully");
  };

  // Order summary data
  const orderSummary = {
    items: cartItems.map((item) => ({
      productId: item.id,
      quantity: item.quantity,
      name: item.name,
      price: item.price,
    })),
    subtotal: totalAmount,
    shipping: 0, // You can add shipping cost calculation here
    total: totalAmount,
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Payment</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Payment Form */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Information</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="note">Note (Optional)</Label>
                    <Input
                      id="note"
                      name="note"
                      value={formData.note}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div>
                    <Label>Payment Method</Label>
                    <RadioGroup
                      value={formData.paymentMethod}
                      onValueChange={handlePaymentMethodChange}
                      className="mt-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="CASH" id="cash" />
                        <Label htmlFor="cash">Cash on Delivery</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="VN_PAY" id="vnpay" />
                        <Label htmlFor="vnpay">VNPay</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <Label htmlFor="voucherCode">Voucher Code</Label>
                    <Input
                      id="voucherCode"
                      name="voucherCode"
                      value={formData.voucherCode || ""}
                      onChange={handleVoucherChange}
                      placeholder="Nhập mã giảm giá (nếu có)"
                    />
                  </div>
                </div>

                {formData.paymentMethod === "VN_PAY" ? (
                  <VNPayButton
                    orderData={formData}
                    onSuccess={handlePaymentSuccess}
                  />
                ) : (
                  <Button type="submit" className="w-full">
                    Place Order
                  </Button>
                )}
              </form>
            </CardContent>
          </Card>

          {/* Order Summary */}
          <OrderSummary {...orderSummary} />
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
