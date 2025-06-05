import { Link } from "react-router-dom";
import { useGetProductsQuery } from "@/services/product/productsApi";

interface SeasonalSpecialsProps {
  randomProductPage: number;
}

const SeasonalSpecials = ({ randomProductPage }: SeasonalSpecialsProps) => {
  const { data: productsData, isLoading: productsLoading } =
    useGetProductsQuery({
      pageNumber: randomProductPage,
      pageSize: 4,
    });

  return (
    <section className="w-full py-16 bg-gray-50 dark:bg-gray-900 overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1 rounded-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300 text-sm font-medium mb-4">
            Limited Time
          </span>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white md:text-4xl">
            Seasonal Specials
          </h2>
          <p className="mt-4 text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Take advantage of our limited-time deals on seasonal produce and
            organic specialties.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {productsLoading
            ? Array(3)
                .fill(0)
                .map((_, i) => (
                  <div
                    key={i}
                    className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md"
                  >
                    <div className="h-64 bg-gray-200 dark:bg-gray-700 animate-pulse" />
                    <div className="p-4 space-y-3">
                      <div className="h-5 w-2/3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                      <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                    </div>
                  </div>
                ))
            : productsData?.items?.slice(0, 3).map((product, idx) => (
                <Link
                  key={product.id}
                  to={`/product/${product.id}`}
                  className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 block"
                >
                  <div className="relative h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
                    <div className="absolute top-0 right-0 bg-green-600 text-white z-10 px-3 py-1 rounded-bl-lg font-medium">
                      {15 + idx * 5}% OFF
                    </div>
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
              ))}
        </div>
      </div>
    </section>
  );
};

export default SeasonalSpecials;
