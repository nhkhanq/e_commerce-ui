import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Heart,
  ShoppingCart,
  Trash2,
  ChevronLeft,
  Package,
  ArrowRight,
} from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { toast } from "sonner";

import LoadingPage from "@/components/loading";
import { BASE_URL } from "@/lib/constants";
import * as storage from "@/lib/storage";

interface WishlistItem {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
  category: {
    name: string;
  };
}

const WishlistPage: React.FC = () => {
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [wishlistProducts, setWishlistProducts] = useState<WishlistItem[]>([]);
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Load wishlist IDs from storage
  useEffect(() => {
    setMounted(true);

    const stored = storage.getItem("favorites");
    if (stored) {
      try {
        const ids: string[] = JSON.parse(stored);
        setWishlistIds(ids);
      } catch (error) {
        console.warn("Error parsing favorites:", error);
      }
    }
  }, []);

  // Fetch product details for each wishlist item
  useEffect(() => {
    const fetchWishlistProducts = async () => {
      if (!wishlistIds.length) {
        setLoading(false);
        return;
      }

      try {
        const products: WishlistItem[] = [];

        // Note: In a real app, you'd want to batch these requests
        for (const id of wishlistIds) {
          try {
            const response = await fetch(`${BASE_URL}/products/${id}`, {
              headers: {
                "ngrok-skip-browser-warning": "true",
              },
            });

            if (response.ok) {
              const data = await response.json();
              if (data.result) {
                products.push(data.result);
              }
            }
          } catch (error) {
            console.error(`Error fetching product ${id}:`, error);
          }
        }

        setWishlistProducts(products);
      } catch (error) {
        console.error("Error fetching wishlist products:", error);
        toast.error("Failed to load wishlist products");
      } finally {
        setLoading(false);
      }
    };

    if (mounted) {
      fetchWishlistProducts();
    }
  }, [wishlistIds, mounted]);

  const handleRemoveFromWishlist = (productId: string) => {
    const updatedIds = wishlistIds.filter((id) => id !== productId);
    setWishlistIds(updatedIds);

    // Also update the products list immediately
    setWishlistProducts((prev) =>
      prev.filter((product) => product.id !== productId)
    );

    storage.setJSON("favorites", updatedIds);
    toast.success("Đã xóa khỏi danh sách yêu thích");
  };

  const handleAddToCart = (product: any) => {
    try {
      const stored = storage.getItem("cart");
      const cart = stored ? JSON.parse(stored) : [];

      const existingItem = cart.find((item: any) => item.id === product.id);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cart.push({
          id: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
          imageUrl: product.imageUrl,
        });
      }

      storage.setJSON("cart", cart);
      toast.success("Đã thêm vào giỏ hàng!");
    } catch (error) {
      console.warn("Error adding to cart:", error);
      toast.error("Không thể thêm vào giỏ hàng");
    }
  };

  const handleClearWishlist = () => {
    setWishlistIds([]);
    setWishlistProducts([]);
    storage.setJSON("favorites", []);
    toast.success("Đã xóa toàn bộ danh sách yêu thích");
  };

  if (!mounted || loading) {
    return <LoadingPage />;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Header Section */}
      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <Button
              variant="outline"
              onClick={() => navigate("/product-list")}
              className="border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <ChevronLeft className="h-5 w-5 mr-1" />
              Back to Products
            </Button>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Heart className="h-8 w-8 text-red-600 dark:text-red-400" />
                <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">
                  My Wishlist
                </h1>
              </div>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                {wishlistProducts.length} product
                {wishlistProducts.length !== 1 ? "s" : ""} saved for later
              </p>
            </div>

            {wishlistProducts.length > 0 && (
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  onClick={handleClearWishlist}
                  className="text-red-600 dark:text-red-400 border-red-200 dark:border-red-800/30 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear All
                </Button>
                <div className="flex items-center gap-2">
                  <Heart className="h-6 w-6 text-red-500 dark:text-red-400 fill-red-500 dark:fill-red-400" />
                  <span className="text-red-600 dark:text-red-400 font-semibold">
                    {wishlistProducts.length} Items
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {wishlistProducts.length === 0 ? (
            // Empty State
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="h-16 w-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4">
                <Heart className="h-8 w-8 text-red-600 dark:text-red-400" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Your wishlist is empty
              </h2>
              <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md">
                Start adding products to your wishlist by clicking the heart
                icon on any product
              </p>
              <Button
                onClick={() => navigate("/product-list")}
                size="lg"
                className="bg-green-600 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700 text-white px-8"
              >
                <Package className="h-5 w-5 mr-2" />
                Start Shopping
              </Button>
            </div>
          ) : (
            // Products Grid
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {wishlistProducts.map((product) => (
                <div
                  key={product.id}
                  className="group bg-white dark:bg-gray-800 rounded-lg overflow-hidden hover:shadow-lg dark:hover:shadow-2xl transition-all duration-300 border border-gray-200 dark:border-gray-700"
                >
                  {/* Product Image */}
                  <div className="relative overflow-hidden">
                    <Link to={`/product/${product.id}`}>
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </Link>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleRemoveFromWishlist(product.id)}
                      className="absolute top-3 right-3 h-8 w-8 bg-white/90 dark:bg-gray-800/90 hover:bg-red-50 dark:hover:bg-red-900/20 border-red-200 dark:border-red-800/30"
                    >
                      <Heart className="h-4 w-4 text-red-500 dark:text-red-400 fill-red-500 dark:fill-red-400" />
                    </Button>
                  </div>

                  {/* Product Details */}
                  <div className="p-4">
                    <div className="mb-2">
                      <span className="text-xs font-medium text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-full">
                        {product.category.name}
                      </span>
                    </div>

                    <Link to={`/product/${product.id}`}>
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 line-clamp-2 hover:text-green-600 dark:hover:text-green-400 transition-colors">
                        {product.name}
                      </h3>
                    </Link>

                    <div className="flex items-center justify-between mb-4">
                      <span className="text-lg font-bold text-green-600 dark:text-green-400">
                        {formatPrice(product.price)}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        Stock: {product.quantity}
                      </span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleAddToCart(product)}
                        disabled={product.quantity === 0}
                        className="flex-1 h-9 bg-green-600 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Add to Cart
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleRemoveFromWishlist(product.id)}
                        className="h-9 px-3 border-red-200 dark:border-red-800/30 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Continue Shopping */}
          {wishlistProducts.length > 0 && (
            <div className="mt-12 text-center">
              <Button
                variant="outline"
                onClick={() => navigate("/product-list")}
                size="lg"
                className="border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                Continue Shopping
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WishlistPage;
