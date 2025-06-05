import { CartItem } from "@/types";
import { toast } from "sonner";

/**
 * Adds an item to cart in localStorage
 */
export const addToCart = (
  productId: string,
  productName: string,
  productPrice: number,
  productImage: string,
  quantity: number
): void => {
  try {
    // Check if we're in browser environment
    if (typeof window === 'undefined') return;
    
    const stored = localStorage.getItem("cart");
    const cart: CartItem[] = stored ? JSON.parse(stored) : [];
    const existing = cart.find((item) => item.id === productId);

    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.push({
        id: productId,
        name: productName,
        price: productPrice,
        imageUrl: productImage,
        quantity,
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    toast.success("Added to cart", {
      description: `${productName} x${quantity} added to your cart.`,
    });
  } catch (err) {
    console.error("Error adding to cart:", err);
    toast.error("Could not add to cart");
  }
};

/**
 * Remove an item from cart
 */
export const removeFromCart = (productId: string): void => {
  try {
    // Check if we're in browser environment
    if (typeof window === 'undefined') return;
    
    const stored = localStorage.getItem("cart");
    if (!stored) return;

    const cart: CartItem[] = JSON.parse(stored);
    const updatedCart = cart.filter((item) => item.id !== productId);
    
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  } catch (err) {
    console.error("Error removing from cart:", err);
    toast.error("Could not remove item from cart");
  }
};

/**
 * Update the quantity of an item in cart
 */
export const updateCartItemQuantity = (
  productId: string,
  newQuantity: number
): void => {
  try {
    // Check if we're in browser environment
    if (typeof window === 'undefined') return;
    
    if (newQuantity < 1) return;
    
    const stored = localStorage.getItem("cart");
    if (!stored) return;

    const cart: CartItem[] = JSON.parse(stored);
    const item = cart.find((item) => item.id === productId);
    
    if (item) {
      item.quantity = newQuantity;
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  } catch (err) {
    console.error("Error updating cart:", err);
    toast.error("Could not update cart");
  }
};

/**
 * Get the current cart from localStorage
 */
export const getCart = (): CartItem[] => {
  try {
    // Check if we're in browser environment
    if (typeof window === 'undefined') return [];
    
    const stored = localStorage.getItem("cart");
    return stored ? JSON.parse(stored) : [];
  } catch (err) {
    console.error("Error getting cart:", err);
    return [];
  }
};

/**
 * Clear the entire cart
 */
export const clearCart = (): void => {
  try {
    // Check if we're in browser environment
    if (typeof window === 'undefined') return;
    
    localStorage.removeItem("cart");
  } catch (err) {
    console.error("Error clearing cart:", err);
  }
};

/**
 * Calculate the total price of items in cart
 */
export const calculateCartTotal = (): number => {
  try {
    const cart = getCart();
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  } catch (err) {
    console.error("Error calculating cart total:", err);
    return 0;
  }
};

/**
 * Get the total number of items in cart
 */
export const getCartItemCount = (): number => {
  try {
    const cart = getCart();
    return cart.reduce((count, item) => count + item.quantity, 0);
  } catch (err) {
    console.error("Error getting cart item count:", err);
    return 0;
  }
}; 
