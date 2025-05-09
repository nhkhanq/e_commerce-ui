import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OrderItemReq } from "@/interfaces/order";
import { formatPrice } from "@/lib/utils";

interface OrderSummaryProps {
  items: {
    productId: string;
    quantity: number;
    name?: string;
    price?: number;
  }[];
  subtotal: number;
  shipping: number;
  total: number;
}

const OrderSummary = ({
  items,
  subtotal,
  shipping,
  total,
}: OrderSummaryProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.productId} className="flex justify-between">
              <span>{item.name || `Product ${item.productId}`}</span>
              <span>Quantity: {item.quantity}</span>
            </div>
          ))}
          <div className="border-t pt-4">
            <div className="flex justify-between mb-2">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Shipping</span>
              <span>{formatPrice(shipping)}</span>
            </div>
            <div className="flex justify-between font-bold">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderSummary;
