import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { useCreateOrderMutation } from "@/services/orders/ordersApi";
import { OrderReq, OrderItemReq } from "@/types/order";
import { AddressChangeEvent } from "@/types/location";
import OrderSummary from "@/components/orders/OrderSummary";
import VNPayButton from "@/components/payment/VNPayButton";
import { CartItem } from "@/types";
import { MapPin, CreditCard, Truck, Tag, NotebookPen } from "lucide-react";
import AddressSelector from "@/components/location/AddressSelector";

const PaymentPage = () => {
  const navigate = useNavigate();
  const [createOrder] = useCreateOrderMutation();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [streetAddress, setStreetAddress] = useState("");
  const [fullAddress, setFullAddress] = useState("");
  const [mounted, setMounted] = useState(false);

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
        // Only access localStorage in browser environment
        if (typeof window !== "undefined") {
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
        }
      } catch (error) {
        console.error("Error loading cart items:", error);
        toast.error("Failed to load cart items");
      } finally {
        setMounted(true);
      }
    };

    loadCartItems();
  }, []);

  // Update address whenever the full address changes
  useEffect(() => {
    if (fullAddress && streetAddress) {
      const completeAddress = `${streetAddress}, ${fullAddress}`;
      setFormData((prev) => ({
        ...prev,
        address: completeAddress,
      }));
    }
  }, [fullAddress, streetAddress]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev: OrderReq) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleStreetAddressChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setStreetAddress(e.target.value);
  };

  const handleAddressChange = (address: AddressChangeEvent) => {
    setFullAddress(address.fullAddress);
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

    // Only access localStorage in browser environment
    if (typeof window !== "undefined") {
      localStorage.setItem("voucherCode", e.target.value);
    }
  };

  // Handle cash payment - direct order creation
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate that we have a complete address
    if (!formData.address || formData.address.split(",").length < 4) {
      toast.error("Please provide a complete address");
      return;
    }

    // Only proceed if payment method is CASH
    if (formData.paymentMethod !== "CASH") {
      return;
    }

    try {
      const response = await createOrder(formData).unwrap();
      if (response.code === 200) {
        // Clear cart and voucher after successful order
        if (typeof window !== "undefined") {
          localStorage.removeItem("cart");
          localStorage.removeItem("voucherCode");
        }
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
    if (typeof window !== "undefined") {
      localStorage.removeItem("cart");
      localStorage.removeItem("voucherCode");
    }
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

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full mx-auto"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-500 dark:from-emerald-400 dark:to-teal-300 bg-clip-text text-transparent">
          <Truck className="h-8 w-8 text-orange-500 dark:text-orange-400" />
          Payment & Delivery
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Payment Form */}
          <Card className="overflow-hidden border-emerald-100 dark:border-emerald-800/30 shadow-md shadow-emerald-100 dark:shadow-emerald-900/5">
            <CardHeader className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/40 border-b border-emerald-100 dark:border-emerald-800/30">
              <CardTitle className="text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-orange-500 dark:text-orange-400" />
                Payment Information
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 bg-white dark:bg-gray-950">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label
                      htmlFor="fullName"
                      className="text-emerald-700 dark:text-emerald-400"
                    >
                      Full Name
                    </Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      required
                      className="border-emerald-200 dark:border-emerald-800/50 focus-visible:ring-orange-500 dark:focus-visible:ring-orange-600 bg-emerald-50/50 dark:bg-emerald-900/10"
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor="email"
                      className="text-emerald-700 dark:text-emerald-400"
                    >
                      Email
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="border-emerald-200 dark:border-emerald-800/50 focus-visible:ring-orange-500 dark:focus-visible:ring-orange-600 bg-emerald-50/50 dark:bg-emerald-900/10"
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor="phone"
                      className="text-emerald-700 dark:text-emerald-400"
                    >
                      Phone
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="border-emerald-200 dark:border-emerald-800/50 focus-visible:ring-orange-500 dark:focus-visible:ring-orange-600 bg-emerald-50/50 dark:bg-emerald-900/10"
                    />
                  </div>

                  <div className="space-y-4 border p-4 rounded-md border-emerald-200 dark:border-emerald-800/50 bg-gradient-to-br from-emerald-50/70 to-teal-50/70 dark:from-emerald-900/10 dark:to-teal-900/10">
                    <h3 className="font-medium text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-orange-500 dark:text-orange-400" />
                      Delivery Address
                    </h3>

                    {/* Address selector for province, district, ward */}
                    <AddressSelector onAddressChange={handleAddressChange} />

                    {/* Street address input */}
                    <div>
                      <Label
                        htmlFor="streetAddress"
                        className="text-emerald-700 dark:text-emerald-400"
                      >
                        Street Address
                      </Label>
                      <Input
                        id="streetAddress"
                        name="streetAddress"
                        value={streetAddress}
                        onChange={handleStreetAddressChange}
                        placeholder="House number, street name"
                        required
                        className="border-emerald-200 dark:border-emerald-800/50 focus-visible:ring-orange-500 dark:focus-visible:ring-orange-600 bg-white/80 dark:bg-gray-900/50"
                      />
                    </div>

                    {fullAddress && streetAddress && (
                      <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 rounded-md border border-blue-100 dark:border-blue-800/30">
                        <p className="text-sm text-blue-800 dark:text-blue-300">
                          <strong>Full Address:</strong> {streetAddress},{" "}
                          {fullAddress}
                        </p>
                      </div>
                    )}
                  </div>

                  <div>
                    <Label
                      htmlFor="note"
                      className="text-emerald-700 dark:text-emerald-400 flex items-center gap-2"
                    >
                      <NotebookPen className="h-4 w-4 text-orange-500 dark:text-orange-400" />
                      Note (Optional)
                    </Label>
                    <Input
                      id="note"
                      name="note"
                      value={formData.note}
                      onChange={handleInputChange}
                      className="border-emerald-200 dark:border-emerald-800/50 focus-visible:ring-orange-500 dark:focus-visible:ring-orange-600 bg-emerald-50/50 dark:bg-emerald-900/10"
                    />
                  </div>

                  <div>
                    <Label className="text-emerald-700 dark:text-emerald-400 flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-orange-500 dark:text-orange-400" />
                      Payment Method
                    </Label>
                    <RadioGroup
                      value={formData.paymentMethod}
                      onValueChange={handlePaymentMethodChange}
                      className="mt-2 space-y-2"
                    >
                      <div className="flex items-center space-x-2 rounded-md border p-3 border-emerald-200 dark:border-emerald-800/50 bg-gradient-to-r from-emerald-50/80 to-emerald-100/80 dark:from-emerald-900/10 dark:to-emerald-800/10">
                        <RadioGroupItem
                          value="CASH"
                          id="cash"
                          className="text-orange-600 dark:text-orange-400 border-orange-400"
                        />
                        <Label
                          htmlFor="cash"
                          className="flex-1 cursor-pointer text-emerald-800 dark:text-emerald-300"
                        >
                          Cash on Delivery
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 rounded-md border p-3 border-emerald-200 dark:border-emerald-800/50 bg-gradient-to-r from-emerald-50/80 to-emerald-100/80 dark:from-emerald-900/10 dark:to-emerald-800/10">
                        <RadioGroupItem
                          value="VN_PAY"
                          id="vnpay"
                          className="text-orange-600 dark:text-orange-400 border-orange-400"
                        />
                        <Label
                          htmlFor="vnpay"
                          className="flex-1 cursor-pointer text-emerald-800 dark:text-emerald-300"
                        >
                          VNPay
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <Label
                      htmlFor="voucherCode"
                      className="text-emerald-700 dark:text-emerald-400 flex items-center gap-2"
                    >
                      <Tag className="h-4 w-4 text-orange-500 dark:text-orange-400" />
                      Voucher Code
                    </Label>
                    <Input
                      id="voucherCode"
                      name="voucherCode"
                      value={formData.voucherCode || ""}
                      onChange={handleVoucherChange}
                      placeholder="Enter voucher code (if any)"
                      className="border-emerald-200 dark:border-emerald-800/50 focus-visible:ring-orange-500 dark:focus-visible:ring-orange-600 bg-emerald-50/50 dark:bg-emerald-900/10"
                    />
                  </div>
                </div>

                {formData.paymentMethod === "VN_PAY" ? (
                  <VNPayButton
                    orderData={formData}
                    onSuccess={handlePaymentSuccess}
                  />
                ) : (
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 dark:from-orange-600 dark:to-orange-500 dark:hover:from-orange-500 dark:hover:to-orange-400 text-white shadow-md"
                  >
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
