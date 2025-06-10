import { toast } from "sonner";
import { getStoredCart, setStoredCart } from "@/lib/storage-utils";
import * as storage from "@/lib/storage";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}

export const addToCart = (
  productId: string,
  productName: string,
  price: number,
  quantity: number = 1,
  imageUrl?: string
): void => {
  try {
    const cart: CartItem[] = getStoredCart();

    const existingItemIndex = cart.findIndex((item) => item.id === productId);

    if (existingItemIndex !== -1) {
      cart[existingItemIndex].quantity += quantity;
    } else {
      cart.push({
        id: productId,
        name: productName,
        price,
        quantity,
        imageUrl,
      });
    }

    setStoredCart(cart);
    toast.success("Added to cart!");
  } catch (error) {
    toast.error("Cannot add to cart!");
  }
};

/**
 * Removes an item from cart in localStorage
 */
export const removeFromCart = (productId: string): void => {
  try {
    const cart: CartItem[] = getStoredCart();
    const updatedCart = cart.filter((item) => item.id !== productId);

    setStoredCart(updatedCart);
    toast.success("Removed from cart!");
  } catch (error) {
    toast.error("Cannot remove from cart!");
  }
};

/**
 * Updates the quantity of an item in cart
 */
export const updateCartQuantity = (
  productId: string,
  newQuantity: number
): void => {
  try {
    const cart: CartItem[] = getStoredCart();
    const itemIndex = cart.findIndex((item) => item.id === productId);

    if (itemIndex !== -1) {
      if (newQuantity <= 0) {
        cart.splice(itemIndex, 1);
      } else {
        cart[itemIndex].quantity = newQuantity;
      }
    }

    setStoredCart(cart);
  } catch (error) {
    toast.error("Unable to update quantity");
  }
};

/**
 * Get the current cart from localStorage
 */
export const getCart = (): CartItem[] => {
  return getStoredCart();
};

/**
 * Get cart item count
 */
export const getCartItemCount = (): number => {
  const cart = getCart();
  return cart.reduce((total, item) => total + item.quantity, 0);
};

/**
 * Clear the entire cart
 */
export const clearCart = (): void => {
  setStoredCart([]);
  toast.success("Cart cleared successfully!");
};

/**
 * Calculate the total price of items in cart
 */
export const calculateCartTotal = (): number => {
  try {
    const cart = getCart();
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  } catch (err) {
    return 0;
  }
}; 
