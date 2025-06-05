import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Plus, Minus } from "lucide-react";
import { addToCart } from "@/lib/cart-utils";

interface AddToCartButtonProps {
  productId: string;
  productName: string;
  productPrice: number;
  productImage: string;
  maxQuantity: number;
}

const AddToCartButton: React.FC<AddToCartButtonProps> = ({
  productId,
  productName,
  productPrice,
  productImage,
  maxQuantity,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [isExpanded, setIsExpanded] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Clean up the timeout when unmounting
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleAddToCart = () => {
    addToCart(productId, productName, productPrice, quantity, productImage);

    // Reset
    setQuantity(1);
    setIsExpanded(false);
  };

  const handleQuantityChange = (type: "increase" | "decrease") => {
    // Reset timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (type === "increase" && quantity < maxQuantity) {
      setQuantity((prev) => prev + 1);
    } else if (type === "decrease" && quantity > 1) {
      setQuantity((prev) => prev - 1);
    }

    // Set new timeout to add to cart after 2 seconds of inactivity
    timeoutRef.current = setTimeout(() => {
      handleAddToCart();
    }, 2000);
  };

  const handleInitialClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsExpanded(true);
  };

  return (
    <div className="relative" onClick={(e) => e.stopPropagation()}>
      {!isExpanded ? (
        <Button
          variant="default"
          className="w-full rounded-md bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 text-white"
          onClick={handleInitialClick}
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          Add to cart
        </Button>
      ) : (
        <div className="flex items-center justify-between bg-green-50 dark:bg-green-900/30 rounded-md p-1 border border-green-200 dark:border-green-800">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-green-700 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-800/50"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleQuantityChange("decrease");
            }}
          >
            <Minus className="h-3 w-3" />
          </Button>

          <span className="mx-2 font-medium text-green-800 dark:text-green-300">
            {quantity}
          </span>

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-green-700 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-800/50"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleQuantityChange("increase");
            }}
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default AddToCartButton;
