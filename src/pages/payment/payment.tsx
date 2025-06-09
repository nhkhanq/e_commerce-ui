import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { useCreateOrderMutation } from "@/services/orders/ordersApi";
import { OrderReq, OrderItemReq } from "@/types/order";
import { AddressChangeEvent } from "@/types/location";
import VNPayButton from "@/components/payment/VNPayButton";
import PaymentInstructions from "@/components/payment/PaymentInstructions";
import { CartItem } from "@/types";
import {
  MapPin,
  CreditCard,
  Truck,
  Tag,
  Package,
  ShoppingCart,
  ArrowLeft,
} from "lucide-react";
import AddressSelector from "@/components/location/AddressSelector";
import { formatPrice } from "@/lib/utils";
import * as storage from "@/lib/storage";

const PaymentPage = () => {
  const navigate = useNavigate();
  const [createOrder] = useCreateOrderMutation();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [streetAddress, setStreetAddress] = useState("");
  const [fullAddress, setFullAddress] = useState("");
  const [partialAddress, setPartialAddress] = useState("");
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
    // Load cart items from storage
    setMounted(true);

    // Only access storage in browser environment
    if (typeof window !== "undefined") {
      const storedItems = storage.getItem("cart");
      if (storedItems) {
        try {
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
        } catch (error) {
          console.warn("Error parsing cart items:", error);
        }
      }
    }
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
    setPartialAddress(address.fullAddress);
  };

  const handlePartialAddressChange = (partialAddr: string) => {
    setPartialAddress(partialAddr);
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

    // Only access storage in browser environment
    if (typeof window !== "undefined") {
      storage.setItem("voucherCode", e.target.value);
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
        storage.removeItem("cart");
        storage.removeItem("voucherCode");
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
    storage.removeItem("cart");
    storage.removeItem("voucherCode");
    toast.success("Payment initiated successfully");
  };

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex justify-center items-center">
        <div className="animate-spin w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <div className="py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="h-16 w-16 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mb-4">
                <ShoppingCart className="h-8 w-8 text-orange-600 dark:text-orange-400" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Your cart is empty
              </h2>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                Add some products to your cart before proceeding to checkout
              </p>
              <Button
                onClick={() => navigate("/product-list")}
                size="lg"
                className="bg-green-600 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700 text-white px-8"
              >
                <Package className="h-5 w-5 mr-2" />
                Continue Shopping
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Header Section */}
      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <Button
              variant="outline"
              onClick={() => navigate("/cart")}
              className="mb-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 border-gray-200 dark:border-gray-700"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Cart
            </Button>
            <div className="flex items-center gap-3 mb-2">
              <Truck className="h-8 w-8 text-green-600 dark:text-green-400" />
              <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">
                Payment & Delivery
              </h1>
            </div>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Complete your order by providing payment and delivery information
            </p>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Payment Form - 2/3 width */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="space-y-12">
                {/* Customer Information Section */}
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="h-10 w-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                      <CreditCard className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                        Customer Information
                      </h2>
                      <p className="text-gray-600 dark:text-gray-400">
                        Enter your personal details
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label
                        htmlFor="fullName"
                        className="text-base font-medium text-gray-900 dark:text-gray-100"
                      >
                        Full Name
                      </Label>
                      <Input
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        required
                        className="p-4 text-lg bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100"
                        placeholder="Enter your full name"
                      />
                    </div>

                    <div className="space-y-3">
                      <Label
                        htmlFor="phone"
                        className="text-base font-medium text-gray-900 dark:text-gray-100"
                      >
                        Phone Number
                      </Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        className="p-4 text-lg bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100"
                        placeholder="Enter your phone number"
                      />
                    </div>

                    <div className="space-y-3 md:col-span-2">
                      <Label
                        htmlFor="email"
                        className="text-base font-medium text-gray-900 dark:text-gray-100"
                      >
                        Email Address
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="p-4 text-lg bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100"
                        placeholder="Enter your email address"
                      />
                    </div>
                  </div>
                </div>

                {/* Delivery Address Section */}
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="h-10 w-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                      <MapPin className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                        Delivery Address
                      </h2>
                      <p className="text-gray-600 dark:text-gray-400">
                        Where should we deliver your order?
                      </p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {/* Address selector for province, district, ward */}
                    <AddressSelector
                      onAddressChange={handleAddressChange}
                      onPartialAddressChange={handlePartialAddressChange}
                    />

                    {/* Street address input */}
                    <div className="space-y-3">
                      <Label
                        htmlFor="streetAddress"
                        className="text-base font-medium text-gray-900 dark:text-gray-100"
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
                        className="p-4 text-lg bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100"
                      />
                    </div>

                    {/* Hiển thị địa chỉ đã chọn (từng phần hoặc đầy đủ) */}
                    {(partialAddress || (streetAddress && fullAddress)) && (
                      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800/30">
                        <p className="text-sm font-medium text-blue-900 dark:text-blue-300 mb-1">
                          {fullAddress && streetAddress
                            ? "Complete Delivery Address:"
                            : "Selected Address:"}
                        </p>
                        <p className="text-blue-800 dark:text-blue-200">
                          {streetAddress && fullAddress
                            ? `${streetAddress}, ${fullAddress}`
                            : partialAddress}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Payment Method Section */}
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="h-10 w-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                      <CreditCard className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                        Payment Method
                      </h2>
                      <p className="text-gray-600 dark:text-gray-400">
                        Choose how you want to pay
                      </p>
                    </div>
                  </div>

                  <RadioGroup
                    value={formData.paymentMethod}
                    onValueChange={handlePaymentMethodChange}
                    className="space-y-4"
                  >
                    <div className="flex items-center space-x-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                      <RadioGroupItem value="CASH" id="cash" />
                      <Label
                        htmlFor="cash"
                        className="flex-1 cursor-pointer text-base font-medium text-gray-900 dark:text-gray-100"
                      >
                        Cash on Delivery
                      </Label>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        Pay when you receive your order
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                      <RadioGroupItem value="VN_PAY" id="vnpay" />
                      <Label
                        htmlFor="vnpay"
                        className="flex-1 cursor-pointer text-base font-medium text-gray-900 dark:text-gray-100"
                      >
                        VNPay
                      </Label>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        Pay online with VNPay
                      </span>
                    </div>
                  </RadioGroup>
                </div>

                {/* Additional Information Section */}
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="h-10 w-10 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                      <Tag className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                        Additional Information
                      </h2>
                      <p className="text-gray-600 dark:text-gray-400">
                        Optional details for your order
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label
                        htmlFor="voucherCode"
                        className="text-base font-medium text-gray-900 dark:text-gray-100"
                      >
                        Voucher Code
                      </Label>
                      <Input
                        id="voucherCode"
                        name="voucherCode"
                        value={formData.voucherCode || ""}
                        onChange={handleVoucherChange}
                        placeholder="Enter voucher code (optional)"
                        className="p-4 text-lg bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100"
                      />
                    </div>

                    <div className="space-y-3">
                      <Label
                        htmlFor="note"
                        className="text-base font-medium text-gray-900 dark:text-gray-100"
                      >
                        Order Notes
                      </Label>
                      <Input
                        id="note"
                        name="note"
                        value={formData.note}
                        onChange={handleInputChange}
                        placeholder="Special instructions (optional)"
                        className="p-4 text-lg bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100"
                      />
                    </div>
                  </div>
                </div>

                {/* Payment Instructions */}
                {formData.paymentMethod === "VN_PAY" && <PaymentInstructions />}

                {/* Submit Section */}
                <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                  {formData.paymentMethod === "VN_PAY" ? (
                    <VNPayButton
                      orderData={formData}
                      onSuccess={handlePaymentSuccess}
                    />
                  ) : (
                    <Button
                      type="submit"
                      size="lg"
                      className="w-full bg-green-600 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700 text-white py-4 text-lg font-semibold"
                    >
                      <ShoppingCart className="h-5 w-5 mr-2" />
                      Place Order
                    </Button>
                  )}
                </div>
              </form>
            </div>

            {/* Order Summary - 1/3 width */}
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-10 w-10 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                    <Package className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                      Order Summary
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                      {cartItems.length} item{cartItems.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                    >
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="h-16 w-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-1">
                          {item.name}
                        </h3>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            Qty: {item.quantity}
                          </span>
                          <span className="font-semibold text-gray-900 dark:text-gray-100">
                            {formatPrice(item.price * item.quantity)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}

                  <div className="pt-4 space-y-3 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between text-base">
                      <span className="text-gray-600 dark:text-gray-400">
                        Subtotal
                      </span>
                      <span className="text-gray-900 dark:text-gray-100">
                        {formatPrice(totalAmount)}
                      </span>
                    </div>
                    <div className="flex justify-between text-base">
                      <span className="text-gray-600 dark:text-gray-400">
                        Shipping
                      </span>
                      <span className="text-gray-900 dark:text-gray-100">
                        Free
                      </span>
                    </div>
                    <div className="flex justify-between text-lg font-semibold pt-3 border-t border-gray-200 dark:border-gray-700">
                      <span className="text-gray-900 dark:text-gray-100">
                        Total
                      </span>
                      <span className="text-green-600 dark:text-green-400">
                        {formatPrice(totalAmount)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
