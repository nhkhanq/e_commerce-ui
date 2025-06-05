import { toast } from "sonner";
import * as storage from "@/lib/storage";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}

/**
 * Adds an item to cart in localStorage
 */
export const addToCart = (
  productId: string,
  productName: string,
  price: number,
  quantity: number = 1,
  imageUrl?: string
): void => {
  try {
    const cartData = storage.getItem("cart");
    const cart: CartItem[] = cartData ? JSON.parse(cartData) : [];

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

    storage.setJSON("cart", cart);
    toast.success("Đã thêm vào giỏ hàng!");
  } catch (error) {
    console.warn("Error adding to cart:", error);
    toast.error("Không thể thêm vào giỏ hàng");
  }
};

/**
 * Removes an item from cart in localStorage
 */
export const removeFromCart = (productId: string): void => {
  try {
    const cartData = storage.getItem("cart");
    if (!cartData) return;

    const cart: CartItem[] = JSON.parse(cartData);
    const updatedCart = cart.filter((item) => item.id !== productId);

    storage.setJSON("cart", updatedCart);
    toast.success("Đã xóa khỏi giỏ hàng!");
  } catch (error) {
    console.warn("Error removing from cart:", error);
    toast.error("Không thể xóa khỏi giỏ hàng");
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
    const cartData = storage.getItem("cart");
    if (!cartData) return;

    const cart: CartItem[] = JSON.parse(cartData);
    const itemIndex = cart.findIndex((item) => item.id === productId);

    if (itemIndex !== -1) {
      if (newQuantity <= 0) {
        cart.splice(itemIndex, 1);
      } else {
        cart[itemIndex].quantity = newQuantity;
      }
    }

    storage.setJSON("cart", cart);
  } catch (error) {
    console.warn("Error updating cart quantity:", error);
    toast.error("Không thể cập nhật số lượng");
  }
};

/**
 * Get the current cart from localStorage
 */
export const getCart = (): CartItem[] => {
  try {
    const cartData = storage.getItem("cart");
    return cartData ? JSON.parse(cartData) : [];
  } catch (error) {
    console.warn("Error getting cart:", error);
    return [];
  }
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
  storage.removeItem("cart");
  toast.success("Đã xóa toàn bộ giỏ hàng!");
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
