import { Link } from "react-router-dom";
import { useGetCategoriesQuery } from "@/services/product/productsApi";

interface CategorySectionProps {
  randomCategoryPage: number;
}

const CategorySection = ({ randomCategoryPage }: CategorySectionProps) => {
  const { data: categoriesData, isLoading: categoriesLoading } =
    useGetCategoriesQuery({
      pageNumber: randomCategoryPage,
      pageSize: 5,
    });

  return (
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
            Browse our selection of organic foods to find the perfect
            ingredients for your healthy lifestyle.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {categoriesLoading
            ? Array(5)
                .fill(0)
                .map((_, i) => (
                  <div
                    key={i}
                    className="bg-gray-200 dark:bg-gray-800 rounded-lg h-48 animate-pulse"
                  />
                ))
            : categoriesData?.items
            ? categoriesData.items.map((category) => (
                <Link
                  key={category.id}
                  to={`/product-list?categoryId=${category.id}`}
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
            : ["Vegetables", "Fruits", "Dairy", "Grains", "Superfoods"].map(
                (cat, idx) => (
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
                )
              )}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
