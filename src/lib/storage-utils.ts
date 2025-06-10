import * as storage from "./storage";
import { logger } from "./logger";

export interface StorageResult<T> {
  data: T | null;
  error: Error | null;
}

export const getFavorites = (): string[] => {
  try {
    const stored = storage.getItem("favorites");
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    logger.warn("Error parsing favorites:", error);
    return [];
  }
};

export const setFavorites = (favorites: string[]): void => {
  try {
    storage.setJSON("favorites", favorites);
  } catch (error) {
    logger.warn("Error setting favorites:", error);
  }
};

export const addToFavorites = (productId: string): void => {
  const favorites = getFavorites();
  if (!favorites.includes(productId)) {
    setFavorites([...favorites, productId]);
  }
};

export const removeFromFavorites = (productId: string): void => {
  const favorites = getFavorites();
  setFavorites(favorites.filter(id => id !== productId));
};

export const toggleFavorite = (productId: string): boolean => {
  const favorites = getFavorites();
  const isFavorite = favorites.includes(productId);
  
  if (isFavorite) {
    removeFromFavorites(productId);
    return false;
  } else {
    addToFavorites(productId);
    return true;
  }
};

export const isFavorite = (productId: string): boolean => {
  const favorites = getFavorites();
  return favorites.includes(productId);
};

export const getStoredCart = () => {
  try {
    const storedItems = storage.getItem("cart");
    return storedItems ? JSON.parse(storedItems) : [];
  } catch (error) {
    logger.warn("Error parsing cart:", error);
    return [];
  }
};

export const setStoredCart = (cartItems: any[]): void => {
  try {
    storage.setJSON("cart", cartItems);
  } catch (error) {
    logger.warn("Error setting cart:", error);
  }
}; 