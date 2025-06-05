import { Link } from "react-router-dom";
import { useGetProductsQuery } from "@/services/product/productsApi";

interface FeaturedProductsProps {
  randomProductPage: number;
}

const FeaturedProducts = ({ randomProductPage }: FeaturedProductsProps) => {
  const { data: productsData, isLoading: productsLoading } =
    useGetProductsQuery({
      pageNumber: randomProductPage,
      pageSize: 4,
    });

  const ProductSkeleton = () => (
    <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md">
      <div className="h-64 bg-gray-200 dark:bg-gray-700 animate-pulse" />
      <div className="p-4 space-y-3">
        <div className="h-5 w-2/3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
      </div>
    </div>
  );

  const ProductCard = ({ product }: { product: any }) => (
    <Link
      to={`/product/${product.id}`}
      className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 block"
    >
      <div className="relative h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
        <img
          src={product.imageUrl || "/api/placeholder/300/300"}
          alt={product.name}
          className="max-w-full max-h-full object-contain transition-transform duration-500 hover:scale-110"
        />
      </div>
      <div className="p-4">
        <h3 className="font-bold text-lg text-gray-900 dark:text-white">
          {product.name}
        </h3>
        <p className="text-gray-600 dark:text-gray-300 text-sm mt-1 line-clamp-2">
          {product.description}
        </p>
      </div>
    </Link>
  );

  const PlaceholderCard = ({ idx }: { idx: number }) => (
    <Link
      key={idx}
      to="/product-list"
      className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 block"
    >
      <div className="relative h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
        <img
          src="/api/placeholder/300/300"
          alt="Product placeholder"
          className="max-w-full max-h-full object-contain"
        />
      </div>
      <div className="p-4">
        <h3 className="font-bold text-lg text-gray-900 dark:text-white">
          Organic Product
        </h3>
        <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">
          Fresh and healthy
        </p>
      </div>
    </Link>
  );

  return (
    <section className="w-full py-16 bg-gray-50 dark:bg-gray-900 overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1 rounded-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300 text-sm font-medium mb-4">
            Featured Products
          </span>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white md:text-4xl">
            Our Best Sellers
          </h2>
          <p className="mt-4 text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Discover the most popular organic products loved by our customers.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {productsLoading
            ? Array(4)
                .fill(0)
                .map((_, i) => <ProductSkeleton key={i} />)
            : productsData?.items?.length
            ? productsData.items.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            : Array(4)
                .fill(0)
                .map((_, idx) => <PlaceholderCard key={idx} idx={idx} />)}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
