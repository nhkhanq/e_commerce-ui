import { useEffect, useState, FC } from "react";
import { Link } from "react-router-dom";
import { useGetProductsQuery, useGetCategoriesQuery } from "@/api/product/productsApi";
import type { SVGProps } from "react";

const Home: FC = () => {
  const [randomProductPage, setRandomProductPage] = useState<number>(1);
  const [randomCategoryPage, setRandomCategoryPage] = useState<number>(1);

  useEffect(() => {
    setRandomProductPage(Math.floor(Math.random() * 20) + 1);
    setRandomCategoryPage(Math.floor(Math.random()) + 1);
  }, []);

  const { data: productsData, isLoading: productsLoading } = useGetProductsQuery({
    pageNumber: randomProductPage,
    pageSize: 4,
  });

  const {
    data: categoriesData,
    isLoading: categoriesLoading,
  } = useGetCategoriesQuery({
    pageNumber: randomCategoryPage,
    pageSize: 5,
  });

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-950">
      <section className="w-full py-12 md:py-16 lg:py-20 overflow-hidden">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="flex flex-col space-y-4">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl/none text-green-700 dark:text-green-400">
                Fresh & Organic Food
              </h1>
              <p className="text-gray-600 dark:text-gray-300 md:text-xl max-w-lg">
                Discover our selection of locally sourced, organic produce and sustainable food products for a healthier lifestyle.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Link
                  to="/product-list"
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 inline-block text-center"
                >
                  Shop Now
                </Link>
                <Link
                  to="/deals"
                  className="border border-gray-300 dark:border-gray-700 hover:border-green-600 dark:hover:border-green-500 px-6 py-3 rounded-lg font-medium transition-colors duration-200 inline-block text-center"
                >
                  Explore Deals
                </Link>
              </div>
            </div>
            <Link to="/product-list" className="relative h-80 md:h-96 overflow-hidden rounded-xl">
              <div className="flex items-center justify-center w-full h-full bg-gray-50 dark:bg-gray-800">
                <img
                  src="/api/placeholder/300/300"
                  alt="Fresh organic food"
                  className="max-w-full max-h-full object-contain transition-transform duration-700 hover:scale-110"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-green-600/20 to-transparent pointer-events-none" />
            </Link>
          </div>
        </div>
      </section>

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
              : productsData?.items?.length
              ? productsData.items.map(product => (
                  <Link
                    key={product.id}
                    to="/product-list"
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
                ))
              : Array(4)
                  .fill(0)
                  .map((_, idx) => (
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
                  ))}
          </div>
        </div>
      </section>

      <section className="w-full py-16 overflow-hidden">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1 rounded-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300 text-sm font-medium mb-4">
              Shop by Category
            </span>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white md:text-4xl">
              Explore Our Food Categories
            </h2>
            <p className="mt-4 text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Browse our selection of organic foods to find the perfect ingredients for your healthy lifestyle.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categoriesLoading
              ? Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <div key={i} className="bg-gray-200 dark:bg-gray-800 rounded-lg h-48 animate-pulse" />
                  ))
              : categoriesData?.items
              ? categoriesData.items.map(category => (
                  <Link
                    key={category.id}
                    to="/product-list"
                    className="relative group overflow-hidden rounded-lg h-48 cursor-pointer block"
                  >
                    <div className="flex items-center justify-center w-full h-full bg-gray-100 dark:bg-gray-800">
                      <img
                        src={category.imageUrl || "/api/placeholder/300/300"}
                        alt={category.name}
                        className="max-w-full max-h-full object-contain transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent pointer-events-none" />
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="font-bold text-white">{category.name}</h3>
                    </div>
                    <div className="absolute inset-0 bg-green-600/0 group-hover:bg-green-600/20 transition-colors duration-300" />
                  </Link>
                ))
              : ["Vegetables", "Fruits", "Dairy", "Grains", "Superfoods"].map((cat, idx) => (
                  <Link
                    key={idx}
                    to="/product-list"
                    className="relative group overflow-hidden rounded-lg h-48 cursor-pointer block"
                  >
                    <div className="flex items-center justify-center w-full h-full bg-gray-100 dark:bg-gray-800">
                      <img
                        src="/api/placeholder/300/300"
                        alt={cat}
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="font-bold text-white">{cat}</h3>
                    </div>
                  </Link>
                ))}
          </div>
        </div>
      </section>

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
              Take advantage of our limited-time deals on seasonal produce and organic specialties.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {productsLoading
              ? Array(3)
                  .fill(0)
                  .map((_, i) => (
                    <div key={i} className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md">
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
                    to="/product-list"
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
                      <div className="mt-4 text-center">
                        <span className="inline-block px-4 py-2 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 transition-colors duration-200">
                          View Details
                        </span>
                      </div>
                    </div>
                  </Link>
                ))
            }\n          </div>
        </div>
      </section>

      <section className="w-full py-16 bg-green-50 dark:bg-green-900/20 overflow-hidden">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <span className="inline-block px-4 py-1 rounded-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300 text-sm font-medium">
                Why Choose Us
              </span>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                Committed to Sustainability
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                We work directly with local farmers to bring you the freshest, most sustainably grown produce. Our commitment to organic farming practices and eco-friendly packaging helps reduce our environmental footprint.
              </p>
              <ul className="space-y-3 pt-4">
                {[
                  "100% Organically grown produce",
                  "Supporting local farmers and communities",
                  "Eco-friendly packaging solutions",
                  "Fresh delivery to your doorstep",
                ].map((text, idx) => (
                  <li key={idx} className="flex gap-3 items-center text-gray-700 dark:text-gray-200">
                    <CheckIcon className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                    <span>{text}</span>
                  </li>
                ))}
              </ul>
            </div>
            <Link to="/product-list" className="relative h-64 md:h-96 overflow-hidden rounded-xl">
              <div className="flex items-center justify-center w-full h-full bg-gray-100 dark:bg-gray-800">
                <img
                  src="/api/placeholder/300/300"
                  alt="Organic farming"
                  className="max-w-full max-h-full object-contain transition-transform duration-700 hover:scale-105"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-green-600/20 to-transparent pointer-events-none" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

const CheckIcon: FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export default Home;
